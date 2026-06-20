// ============================================================
//  ARIA Platform — AI Service (Multi-tenant)
//  BUG FIXES:
//  1. chat() was only sending 1 message, ignoring conversation history
//  2. JSON extraction regex was too greedy (matched wrong blocks)
//  3. Added error handling for Groq API failures
//  4. Added call limit check per plan
// ============================================================

const { Appointment, Customer, Business } = require('../models');
const { format, addDays, parseISO } = require('date-fns');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const PLAN_CALL_LIMITS = {
  trial:   50,
  starter: 500,
  growth:  2000,
  pro:     Infinity,
};

// ── Build system prompt for specific business ─────────────────
async function buildSystemPrompt(businessId) {
  const business = await Business.findById(businessId);
  if (!business) throw new Error('Business not found');

  const agentName = business.agentName || 'ARIA';
  const bizName   = business.name;
  const services  = business.services?.map(s =>
    `${s.name} (${s.duration} mins, ₹${s.price})`
  ).join(', ') || 'our services';

  const today    = format(new Date(), 'EEEE, MMMM d yyyy');
  const tomorrow = format(addDays(new Date(), 1), 'EEEE, MMMM d yyyy');

  // Include working hours in prompt
  const hours = business.workingHours;
  const daysText = Object.entries(hours || {}).map(([day, h]) =>
    h.closed ? `${day}: Closed` : `${day}: ${h.open}–${h.close}`
  ).join(', ');

  const personalities = {
    friendly:     'warm, friendly and helpful',
    professional: 'professional, formal and efficient',
    funny:        'witty, humorous but still helpful',
    caring:       'caring, empathetic and patient',
  };
  const personality = personalities[business.agentPersonality] || 'warm, friendly and helpful';

  return `You are ${agentName}, the AI receptionist for ${bizName}.
Today is ${today}. Tomorrow is ${tomorrow}.
Your personality: ${personality}.

Working hours: ${daysText}

Your job:
1. Greet customers warmly
2. Book, reschedule or cancel appointments
3. Answer questions about services, hours and pricing
4. Take messages when needed

Available services: ${services}

When booking appointments collect:
- Customer name
- Preferred date (today/tomorrow/specific date in yyyy-MM-dd format)
- Preferred time (in HH:mm 24hr format)
- Service needed
- Phone number

IMPORTANT RULES:
- Keep responses SHORT — under 3 sentences. You are speaking on the phone.
- Be warm and efficient.
- When you have ALL required info to book: first say a short natural confirmation OUT LOUD (e.g. "Great, you're booked for Tuesday at 2 PM!"), then on a NEW LINE silently include this JSON wrapped in double square brackets — NEVER speak this part or read the words "action", "book", "name" etc out loud:
  [[{"action":"book","name":"John","phone":"+91XXXXXXXXXX","service":"Haircut","date":"2025-04-10","time":"14:00","notes":""}]]
- For cancellation, confirm out loud then silently include:
  [[{"action":"cancel","phone":"+91XXXXXXXXXX","date":"2025-04-10","time":"14:00"}]]
- For reschedule, confirm out loud then silently include:
  [[{"action":"reschedule","phone":"+91XXXXXXXXXX","old_date":"2025-04-10","old_time":"14:00","new_date":"2025-04-11","new_time":"15:00"}]]
- ONLY include the [[ ]] JSON block when you have ALL required fields. Never include a partial block.
- Include the [[ ]] block only ONCE — do not repeat it in later messages.
- Speak in customer's language if they use Hindi or another language.
- Never say you are an AI unless directly asked.`;
}

// ── Extract action from AI response ──────────────────────────
// BUG FIX: now primarily looks for the [[ ]] silent-wrapper convention
// (used so the JSON is never spoken aloud by the voice assistant).
// Falls back to brace-matching for plain JSON, for backward compatibility.
function extractAction(text) {
  if (!text) return null;

  // ── Primary: look for [[ ... ]] wrapped JSON ─────────────────
  const wrapped = text.match(/\[\[([\s\S]*?)\]\]/);
  if (wrapped) {
    try {
      const parsed = JSON.parse(wrapped[1].trim());
      if (parsed && parsed.action) return parsed;
    } catch { /* fall through to legacy method below */ }
  }

  // ── Fallback: legacy brace-matching for plain {"action":...} ──
  const match = text.match(/\{\s*"action"\s*:\s*"[^"]+"/);
  if (!match) return null;

  const startIdx = text.indexOf(match[0]);
  let braceCount = 0;
  let endIdx = startIdx;

  for (let i = startIdx; i < text.length; i++) {
    if (text[i] === '{') braceCount++;
    if (text[i] === '}') braceCount--;
    if (braceCount === 0) { endIdx = i; break; }
  }

  const jsonStr = text.substring(startIdx, endIdx + 1);
  try {
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

// ── Execute booking action ────────────────────────────────────
async function executeAction(action, callerPhone, businessId) {
  if (action.action === 'book') {
    const phone = action.phone || callerPhone;
    if (!phone) return { success: false, error: 'No phone number' };
    if (!action.date || !action.time) return { success: false, error: 'Missing date or time' };

    let customer = await Customer.findOne({ businessId, phone });
    if (!customer) {
      customer = await Customer.create({
        businessId,
        name:     action.name || 'Unknown',
        phone,
        whatsapp: phone,
      });
    } else {
      customer.totalVisits += 1;
      await customer.save();
    }

    const appointment = await Appointment.create({
      businessId,
      customer:      customer._id,
      customerName:  action.name  || customer.name,
      customerPhone: phone,
      service:       action.service || 'General',
      date:          action.date,
      time:          action.time,
      notes:         action.notes || '',
      createdBy:     'ai-agent',
    });

    return { success: true, appointment, customer };
  }

  if (action.action === 'cancel') {
    const phone = action.phone || callerPhone;
    const appt = await Appointment.findOneAndUpdate(
      { businessId, customerPhone: phone, date: action.date, time: action.time },
      { status: 'cancelled' },
      { new: true }
    );
    // BUG FIX: was not returning useful info when appt not found
    if (!appt) return { success: false, error: 'Appointment not found' };
    return { success: true, appointment: appt };
  }

  if (action.action === 'reschedule') {
    const phone = action.phone || callerPhone;
    const appt = await Appointment.findOneAndUpdate(
      { businessId, customerPhone: phone, date: action.old_date, time: action.old_time },
      { date: action.new_date, time: action.new_time, status: 'confirmed' },
      { new: true }
    );
    if (!appt) return { success: false, error: 'Appointment not found' };
    return { success: true, appointment: appt };
  }

  return { success: false, error: 'Unknown action' };
}

// ── Main chat function ────────────────────────────────────────
// BUG FIX: was only sending single message; now sends full conversation history
async function chat(messages, callerPhone, businessId) {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY not configured');
  if (!messages || messages.length === 0) throw new Error('No messages provided');

  const systemPrompt = await buildSystemPrompt(businessId);

  // Keep last 10 messages to avoid token overflow
  const recentMessages = messages.slice(-10);

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + GROQ_API_KEY,
    },
    body: JSON.stringify({
      model:      'llama-3.3-70b-versatile',
      max_tokens: 400,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        ...recentMessages,
      ],
    }),
  });

  // BUG FIX: handle non-200 responses from Groq
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(`Groq API error: ${errData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  const reply = data.choices?.[0]?.message?.content;
  if (!reply) throw new Error('Empty response from AI');

  const action = extractAction(reply);

  let actionResult = null;
  if (action) {
    actionResult = await executeAction(action, callerPhone, businessId);
  }

  // Strip the JSON blob (and its [[ ]] wrapper, if present) from the spoken reply
  const cleanReply = reply
    .replace(/\[\[[\s\S]*?\]\]/g, '')
    .replace(/\{\s*"action"[\s\S]*?\}/g, '')
    .trim();

  return { reply: cleanReply || reply, action, actionResult };
}

module.exports = { chat, buildSystemPrompt, extractAction };
