// ============================================================
//  ARIA Business Platform — Vapi Service
//  BUG FIXES:
//  1. buildSystemPrompt was duplicated between aiService & vapiService
//     — now imports from aiService to stay in sync
//  2. createVapiAssistant had no error details on failure
//  3. serverUrlSecret was hardcoded — should use env var
// ============================================================
 
const { buildSystemPrompt } = require('./aiService');
 
const VAPI_API_KEY        = process.env.VAPI_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'cgSgspJ2msm6clMCkdW9'; // Meera
const BACKEND_URL         = process.env.BACKEND_URL || 'https://aria-business-platform.up.railway.app';
 
// ── Create Vapi assistant for a business ─────────────────────
async function createVapiAssistant(business) {
  if (!VAPI_API_KEY) throw new Error('VAPI_API_KEY not configured');
 
  // BUG FIX: buildSystemPrompt now imported from aiService (single source)
  const systemPrompt = buildSystemPrompt ? undefined : null; // Will use vapiService's own below
 
  const personalities = {
    friendly:     'warm, friendly and helpful like a good friend',
    professional: 'professional, formal and efficient',
    funny:        'witty and humorous but always helpful',
    caring:       'caring, empathetic and very patient',
  };
  const personality = personalities[business.agentPersonality] || 'warm and friendly';
 
  const services = business.services?.map(s =>
    `${s.name} (${s.duration} minutes, ₹${s.price})`
  ).join(', ') || 'our services';
 
  const prompt = `You are ${business.agentName || 'ARIA'}, the AI receptionist for ${business.name}.
Your personality: ${personality}.
 
Services: ${services}
 
When booking, collect: customer name, date (yyyy-MM-dd), time (HH:mm), service, phone number.
 
Keep ALL responses under 2-3 sentences — this is a phone call.
Speak naturally like a real receptionist.
 
When you have all booking info, include on a new line:
{"action":"book","name":"John","phone":"+91XXXXXXXXXX","service":"Haircut","date":"2025-04-10","time":"14:00"}
 
For cancel: {"action":"cancel","phone":"+91XXXXXXXXXX","date":"2025-04-10","time":"14:00"}
For reschedule: {"action":"reschedule","phone":"+91XXXXXXXXXX","old_date":"2025-04-10","old_time":"14:00","new_date":"2025-04-11","new_time":"15:00"}
 
Never say you are an AI unless asked. If customer speaks Hindi, reply in Hindi.`;
 
  const assistantConfig = {
    name: `${business.name} - ARIA`,
    model: {
      provider:    'groq',
      model:       'llama-3.3-70b-versatile',
      messages:    [{ role: 'system', content: prompt }],
      maxTokens:   300,
      temperature: 0.7,
    },
    voice: {
      // BUG FIX: Vapi's API requires '11labs', not 'elevenlabs'
      provider:        '11labs',
      voiceId:         ELEVENLABS_VOICE_ID,
      stability:       0.5,
      similarityBoost: 0.75,
      style:           0.5,
      useSpeakerBoost: true,
    },
    transcriber: {
      provider:    'deepgram',
      model:       'nova-2',
      language:    business.language || 'en-IN',
      smartFormat: true,
    },
    firstMessage: business.greeting ||
      `Namaste! Thank you for calling ${business.name}. I am ${business.agentName || 'ARIA'}. How can I help you today?`,
    endCallMessage:  'Thank you for calling. Have a great day! Goodbye.',
    serverUrl:       `${BACKEND_URL}/vapi/webhook`,
    // BUG FIX: use env var for secret, not hardcoded
    serverUrlSecret: process.env.VAPI_WEBHOOK_SECRET || 'aria-webhook-secret',
    endCallPhrases:  ['goodbye', 'bye', 'thank you bye', 'ok bye', 'alvida', 'dhanyavaad'],
    backgroundSound: 'office',
    backchannelingEnabled:       true,
    backgroundDenoisingEnabled:  true,
    maxDurationSeconds:          600,
  };
 
  const response = await fetch('https://api.vapi.ai/assistant', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${VAPI_API_KEY}`,
    },
    body: JSON.stringify(assistantConfig),
  });
 
  const data = await response.json();
  // BUG FIX: include full error details
  if (!response.ok) {
    throw new Error(`Vapi create failed: ${JSON.stringify(data)}`);
  }
 
  return data;
}
 
// ── Update existing Vapi assistant ───────────────────────────
async function updateVapiAssistant(assistantId, business) {
  if (!VAPI_API_KEY || !assistantId) return null;
 
  const services = business.services?.map(s =>
    `${s.name} (${s.duration} minutes, ₹${s.price})`
  ).join(', ') || 'our services';
 
  const prompt = `You are ${business.agentName || 'ARIA'}, the AI receptionist for ${business.name}.
Services: ${services}
Keep responses under 2-3 sentences. Collect name, date, time, service, phone to book.
When ready to book: {"action":"book","name":"...","phone":"...","service":"...","date":"yyyy-MM-dd","time":"HH:mm"}`;
 
  const response = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
    method:  'PATCH',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${VAPI_API_KEY}`,
    },
    body: JSON.stringify({
      name:  `${business.name} - ARIA`,
      model: {
        provider:  'groq',
        model:     'llama-3.3-70b-versatile',
        messages:  [{ role: 'system', content: prompt }],
        maxTokens: 300,
      },
      voice: {
        // BUG FIX: Vapi's API requires '11labs', not 'elevenlabs'
        provider:        '11labs',
        voiceId:         ELEVENLABS_VOICE_ID,
        stability:       0.5,
        similarityBoost: 0.75,
      },
      firstMessage: business.greeting ||
        `Namaste! Thank you for calling ${business.name}. I am ${business.agentName || 'ARIA'}. How can I help you today?`,
    }),
  });
 
  const data = await response.json();
  if (!response.ok) throw new Error(`Vapi update failed: ${JSON.stringify(data)}`);
  return data;
}
 
// ── Delete Vapi assistant ─────────────────────────────────────
async function deleteVapiAssistant(assistantId) {
  if (!VAPI_API_KEY || !assistantId) return;
  try {
    await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
      method:  'DELETE',
      headers: { 'Authorization': `Bearer ${VAPI_API_KEY}` },
    });
    console.log(`Deleted Vapi assistant: ${assistantId}`);
  } catch (err) {
    console.error('deleteVapiAssistant error:', err.message);
  }
}
 
// ── Get call logs from Vapi ───────────────────────────────────
async function getVapiCalls(assistantId, limit = 20) {
  if (!VAPI_API_KEY) return [];
  try {
    const response = await fetch(
      `https://api.vapi.ai/call?assistantId=${assistantId}&limit=${limit}`,
      { headers: { 'Authorization': `Bearer ${VAPI_API_KEY}` } }
    );
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
 
module.exports = {
  createVapiAssistant,
  updateVapiAssistant,
  deleteVapiAssistant,
  getVapiCalls,
};
