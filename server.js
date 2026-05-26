// ============================================================
//  ARIA Business Platform v5.0
//  Vapi + ElevenLabs + Groq + Railway
// ============================================================

const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const path     = require('path');
require('dotenv').config();

const app  = express();
const port = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','x-admin-key'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// ── Database ─────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1); // BUG FIX: exit if DB fails, don't run with no DB
  });

// ── Routes ───────────────────────────────────────────────────
const { router: authRouter } = require('./routes/auth');
app.use('/auth',         authRouter);
app.use('/appointments', require('./routes/appointments'));
app.use('/chat',         require('./routes/chat'));
app.use('/voice',        require('./routes/voice'));
app.use('/vapi',         require('./routes/vapi'));
app.use('/business',     require('./routes/business'));
app.use('/settings',     require('./routes/settings'));
app.use('/admin',        require('./routes/admin'));
app.use('/billing',      require('./routes/billing'));

// ── Health ───────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status:   'ok',
    message:  'ARIA Business Platform v5.0',
    version:  '5.0.0',
    stack:    'Vapi + ElevenLabs Meera + Groq + Railway',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime:   Math.floor(process.uptime()) + 's',
  });
});

// ── Catch-all: serve frontend for SPA routing ─────────────────
app.get('*', (req, res) => {
  // Only serve index.html for non-API routes
  if (!req.path.startsWith('/auth') && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
});

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Reminders ────────────────────────────────────────────────
const { startReminderScheduler } = require('./services/reminderScheduler');
startReminderScheduler();

// ── Start ─────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   ARIA Business Platform v5.0              ║
║   http://localhost:${port}                    ║
║   Voice: ElevenLabs Meera (Natural Hindi)  ║
║   Calls: Vapi.ai                           ║
║   AI:    Groq Llama 3.3                    ║
╚════════════════════════════════════════════╝
  `);
});
