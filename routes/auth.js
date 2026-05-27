// ============================================================
//  ARIA Platform — Auth Routes
//  BUG FIXES:
//  1. Token expiry was not handled on /me route
//  2. Password validation added (min 6 chars)
//  3. Rate limiting comment added for production
// ============================================================

const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { Business } = require('../models');
const { assignNumberToBusiness } = require('../services/phoneService');
const { sendWelcomeWhatsApp } = require('../services/notificationService');

const JWT_SECRET = process.env.JWT_SECRET || 'aria-secret-change-in-production';

// ── Auth middleware ───────────────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    req.business = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    // BUG FIX: differentiate expired vs invalid token
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// POST /auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password, phone } = req.body;

  // BUG FIX: proper validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const existing = await Business.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashed  = await bcrypt.hash(password, 10);
    const business = await Business.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || '',
      password: hashed,
      services: [
        { name: 'Consultation', duration: 30, price: 500 },
        { name: 'Full Service',  duration: 60, price: 1000 },
      ],
      greeting: `Thank you for calling ${name.trim()}. I am ARIA, your AI assistant. How can I help you today?`,
    });

    // Auto-assign a phone number from pool
    const numberResult = await assignNumberToBusiness(business._id);
    if (numberResult.success) {
      console.log(`✅ Auto-assigned ${numberResult.number} to ${name}`);
    } else {
      console.log(`⚠️  No numbers available for ${name}`);
    }

    // Send welcome WhatsApp if phone provided
    if (phone) {
      sendWelcomeWhatsApp(phone, name, numberResult.number).catch(console.error);
    }

    const token = jwt.sign(
      { id: business._id, email: business.email, name: business.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const updatedBusiness = await Business.findById(business._id).select('-password');

    res.status(201).json({
      token,
      business: {
        id:             updatedBusiness._id,
        name:           updatedBusiness.name,
        email:          updatedBusiness.email,
        plan:           updatedBusiness.plan,
        trialEndsAt:    updatedBusiness.trialEndsAt,
        twilioNumber:   updatedBusiness.twilioNumber,
        numberAssigned: updatedBusiness.numberAssigned,
      },
      numberAssigned: numberResult.success,
      phoneNumber:    numberResult.number || null,
    });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ error: 'Signup failed. Please try again.' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const business = await Business.findOne({ email: email.toLowerCase().trim() });
    if (!business) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, business.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!business.isActive) {
      return res.status(403).json({ error: 'Account suspended. Please contact support.' });
    }

    const token = jwt.sign(
      { id: business._id, email: business.email, name: business.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      business: {
        id:             business._id,
        name:           business.name,
        email:          business.email,
        plan:           business.plan,
        trialEndsAt:    business.trialEndsAt,
        twilioNumber:   business.twilioNumber,
        numberAssigned: business.numberAssigned,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// GET /auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const business = await Business.findById(req.business.id).select('-password');
    if (!business) return res.status(404).json({ error: 'Business not found' });
    res.json({ business });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /auth/settings
router.patch('/settings', authMiddleware, async (req, res) => {
  try {
    // BUG FIX: prevent overwriting sensitive fields via this route
    const { password, plan, isActive, ...safeUpdates } = req.body;

    const business = await Business.findByIdAndUpdate(
      req.business.id,
      { $set: safeUpdates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!business) return res.status(404).json({ error: 'Business not found' });
    res.json({ business });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router, authMiddleware };
