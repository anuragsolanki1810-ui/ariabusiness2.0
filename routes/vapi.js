// ============================================================
//  ARIA Business Platform — Vapi Webhook Route
//  BUG FIXES:
//  1. Duplicate booking: end-of-call-report was booking again even
//     if transcript handler already booked during the call
//  2. Business not found crash (no null check)
//  3. Transcript array format was wrong (Vapi sends structured array)
// ============================================================

const express = require('express');
const router  = express.Router();
const { Business, Appointment, Customer, CallLog } = require('../models');
const { sendConfirmation } = require('../services/notificationService');
const { extractAction }    = require('../services/aiService');

// Track which calls have already booked (in-memory, resets on restart)
// For production use Redis; this is fine for single-instance Railway deploy
const bookedCalls = new Set();

// ── Helper: execute booking action ───────────────────────────
async function executeAction(action, businessId, callerPhone) {
  const phone = action.phone || callerPhone;
  if (!phone || !businessId) return { success: false };

  if (action.action === 'book') {
    // BUG FIX: validate required fields before creating
    if (!action.date || !action.time || !action.name) {
      console.log('Book action missing fields:', action);
      return { success: false };
    }

    let customer = await Customer.findOne({ businessId, phone });
    if (!customer) {
      customer = await Customer.create({
        businessId,
        name:     action.name,
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
      customerName:  action.name,
      customerPhone: phone,
      service:       action.service || 'General',
      date:          action.date,
      time:          action.time,
      notes:         action.notes || '',
      createdBy:     'ai-agent',
    });

    const business = await Business.findById(businessId).select('name');
    sendConfirmation(appointment, business?.name).catch(console.error);

    return { success: true, appointment };
  }

  if (action.action === 'cancel') {
    const appt = await Appointment.findOneAndUpdate(
      { businessId, customerPhone: phone, date: action.date, time: action.time },
      { status: 'cancelled' },
      { new: true }
    );
    return { success: !!appt };
  }

  if (action.action === 'reschedule') {
    const appt = await Appointment.findOneAndUpdate(
      { businessId, customerPhone: phone, date: action.old_date, time: action.old_time },
      { date: action.new_date, time: action.new_time, status: 'confirmed' },
      { new: true }
    );
    return { success: !!appt };
  }

  return { success: false };
}

// ── POST /vapi/webhook ────────────────────────────────────────
router.post('/webhook', async (req, res) => {
  // BUG FIX: always respond 200 quickly so Vapi doesn't retry
  res.sendStatus(200);

  const { message } = req.body;
  if (!message) return;

  const { type, call, artifact } = message;

  try {
    // BUG FIX: graceful null check — assistantId may be missing
    const assistantId = call?.assistantId;
    if (!assistantId) {
      console.log('Vapi webhook: no assistantId in call');
      return;
    }

    const business = await Business.findOne({ vapiAssistantId: assistantId });
    if (!business) {
      console.log(`Vapi webhook: no business found for assistant ${assistantId}`);
      return;
    }

    const businessId  = business._id;
    const callerPhone = call?.customer?.number || '';
    const callId      = call?.id || '';

    // ── Call started ────────────────────────────────────────
    if (type === 'call-started') {
      console.log(`📞 Call started — Business: ${business.name}, Caller: ${callerPhone}`);
      // Increment monthly call counter
      await Business.findByIdAndUpdate(businessId, {
        $inc: { callsThisMonth: 1 }
      });
    }

    // ── Transcript message — check for booking action ───────
    if (type === 'transcript' && message.role === 'assistant') {
      const action = extractAction(message.transcript);
      if (action?.action === 'book' && !bookedCalls.has(callId)) {
        const result = await executeAction(action, businessId, callerPhone);
        if (result.success) {
          bookedCalls.add(callId);
          console.log(`✅ Booked during call ${callId}`);
        }
      }
    }

    // ── End of call report ──────────────────────────────────
    if (type === 'end-of-call-report') {
      const rawTranscript = artifact?.transcript || '';
      const duration = call?.endedAt && call?.startedAt
        ? Math.floor((new Date(call.endedAt) - new Date(call.startedAt)) / 1000)
        : 0;

      let appointmentId = null;

      // BUG FIX: only try to book from summary if NOT already booked mid-call
      if (!bookedCalls.has(callId)) {
        const action = extractAction(
          typeof rawTranscript === 'string' ? rawTranscript : JSON.stringify(rawTranscript)
        );
        if (action?.action === 'book') {
          const result = await executeAction(action, businessId, callerPhone);
          if (result.success) appointmentId = result.appointment?._id;
        }
      } else {
        // Get the appointment that was already booked during call
        const existing = await Appointment.findOne({
          businessId,
          customerPhone: callerPhone,
          createdBy: 'ai-agent',
        }).sort({ createdAt: -1 });
        if (existing) appointmentId = existing._id;
      }

      // Clean up tracking set
      bookedCalls.delete(callId);

      // Save call log
      await CallLog.create({
        businessId,
        callSid:     callId,
        callerPhone,
        duration,
        transcript: typeof rawTranscript === 'string'
          ? [{ role: 'transcript', content: rawTranscript }]
          : rawTranscript,
        outcome:     appointmentId ? 'appointment_booked' : 'query_answered',
        appointmentId,
      });

      console.log(`📞 Call ended — Duration: ${duration}s, Business: ${business.name}, Booked: ${!!appointmentId}`);
    }

    // ── Function call (structured booking) ─────────────────
    if (type === 'function-call') {
      const { name, parameters } = message.functionCall || {};
      if (name === 'bookAppointment') {
        const result = await executeAction(
          { action: 'book', ...parameters },
          businessId,
          callerPhone
        );
        // Note: res already sent 200 above; Vapi function-call needs inline response
        // This is a known limitation — for function calls use a separate endpoint
        console.log('Function call result:', result.success);
      }
    }

  } catch (err) {
    console.error('Vapi webhook error:', err.message);
  }
});

// ── GET /vapi/calls/:businessId ───────────────────────────────
router.get('/calls/:businessId', async (req, res) => {
  try {
    const logs = await CallLog.find({ businessId: req.params.businessId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
