// ============================================================
//  ARIA Platform — Voice Routes (Twilio fallback)
//  BUG FIXES:
//  1. callSessions memory leak — sessions never cleaned on timeout
//  2. Business lookup was missing await error handling
//  3. Language wasn't being read correctly from business settings
// ============================================================

const express  = require('express');
const router   = express.Router();
const twilio   = require('twilio');
const { chat } = require('../services/aiService');
const { sendConfirmation } = require('../services/notificationService');
const { CallLog, Business } = require('../models');

const VoiceResponse = twilio.twiml.VoiceResponse;

// BUG FIX: Use Map with TTL cleanup to prevent memory leak
const callSessions = new Map();

// Clean up stale sessions every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [sid, session] of callSessions.entries()) {
    if (now - session.startTime > 15 * 60 * 1000) { // 15 min TTL
      console.log(`Cleaning stale session: ${sid}`);
      callSessions.delete(sid);
    }
  }
}, 10 * 60 * 1000);

// POST /voice/incoming
router.post('/incoming', async (req, res) => {
  const twiml        = new VoiceResponse();
  const callSid      = req.body.CallSid;
  const callerPhone  = req.body.From || '';
  const calledNumber = req.body.To   || '';

  try {
    const business = await Business.findOne({ twilioNumber: calledNumber });

    if (!business) {
      twiml.say({ voice: 'Polly.Aditi', language: 'en-IN' },
        'Sorry, this number is not configured. Please contact support.');
      twiml.hangup();
      res.type('text/xml');
      return res.send(twiml.toString());
    }

    callSessions.set(callSid, {
      messages:   [],
      callerPhone,
      businessId: business._id.toString(),
      startTime:  Date.now(),
    });

    const greeting = business.greeting ||
      `Thank you for calling ${business.name}. I am ${business.agentName || 'ARIA'}. How can I help you today?`;

    const lang = business.language || 'en-IN';

    const gather = twiml.gather({
      input:         'speech',
      action:        `/voice/respond?callSid=${callSid}`,
      method:        'POST',
      language:      lang,
      speechTimeout: 'auto',
      timeout:       5,
    });
    gather.say({ voice: 'Polly.Aditi', language: lang }, greeting);

    // BUG FIX: redirect was causing infinite loop if user didn't speak
    twiml.say({ voice: 'Polly.Aditi' }, 'I did not catch that. Goodbye.');
    twiml.hangup();

  } catch (err) {
    console.error('Voice incoming error:', err.message);
    twiml.say('Sorry, something went wrong. Please try again.');
    twiml.hangup();
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

// POST /voice/respond
router.post('/respond', async (req, res) => {
  const twiml   = new VoiceResponse();
  const callSid = req.query.callSid;
  const speech  = req.body.SpeechResult || '';

  const session = callSessions.get(callSid);
  if (!session) {
    twiml.say({ voice: 'Polly.Aditi' }, 'Sorry, session expired. Please call again.');
    twiml.hangup();
    res.type('text/xml');
    return res.send(twiml.toString());
  }

  // BUG FIX: handle empty speech (user was silent)
  if (!speech.trim()) {
    const gather = twiml.gather({
      input: 'speech', action: `/voice/respond?callSid=${callSid}`,
      method: 'POST', language: 'en-IN', speechTimeout: 'auto', timeout: 5,
    });
    gather.say({ voice: 'Polly.Aditi' }, "I didn't catch that. Could you please repeat?");
    res.type('text/xml');
    return res.send(twiml.toString());
  }

  session.messages.push({ role: 'user', content: speech });

  try {
    const { reply, action, actionResult } = await chat(
      session.messages,
      session.callerPhone,
      session.businessId
    );

    session.messages.push({ role: 'assistant', content: reply });
    callSessions.set(callSid, session);

    if (action?.action === 'book' && actionResult?.success) {
      sendConfirmation(actionResult.appointment).catch(console.error);
    }

    const business = await Business.findById(session.businessId).select('language');
    const lang = business?.language || 'en-IN';

    const gather = twiml.gather({
      input: 'speech', action: `/voice/respond?callSid=${callSid}`,
      method: 'POST', language: lang, speechTimeout: 'auto', timeout: 5,
    });
    gather.say({ voice: 'Polly.Aditi', language: lang }, reply);

    // BUG FIX: removed duplicate "Is there anything else" — was being said twice
    twiml.say({ voice: 'Polly.Aditi' }, 'Thank you for calling. Goodbye!');
    twiml.hangup();

  } catch (err) {
    console.error('AI error during call:', err.message);
    twiml.say({ voice: 'Polly.Aditi' }, 'I apologize, I am having trouble. Please call back in a moment.');
    twiml.hangup();
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

// POST /voice/status
router.post('/status', async (req, res) => {
  const callSid  = req.body.CallSid;
  const duration = parseInt(req.body.CallDuration) || 0;
  const session  = callSessions.get(callSid);

  if (session) {
    try {
      await CallLog.create({
        businessId:  session.businessId,
        callSid,
        callerPhone: session.callerPhone,
        duration,
        transcript:  session.messages,
        outcome:     session.messages.length > 2 ? 'query_answered' : 'other',
      });
    } catch (err) {
      console.error('Call log save error:', err.message);
    }
    callSessions.delete(callSid);
  }

  res.sendStatus(200);
});

module.exports = router;
