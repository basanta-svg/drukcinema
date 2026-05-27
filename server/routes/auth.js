const express       = require('express');
const jwt           = require('jsonwebtoken');
const bcrypt        = require('bcryptjs');
const crypto        = require('crypto');
const User          = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/emailService');
const router        = express.Router();

/* ── POST /api/auth/register  (new user sign-up) ─────────── */
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ name, email, phone, password: hashed });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send welcome email (non-blocking — don't fail registration if email fails)
    sendWelcomeEmail(user.email, user.name).catch(() => {});

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: 'user' },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── POST /api/auth/login  (user sign-in with email + password) ── */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: 'user' },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── POST /api/auth/admin/login  (admin-only, username + password) ── */
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'drukcinema2024') {
    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.json({ token, user: { username, role: 'admin' } });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

/* ── GET /api/auth/me  (current user from token) ─────────── */
router.get('/me', verifyToken, async (req, res) => {
  try {
    if (!req.user.id) {
      return res.json({ user: { username: req.user.username, role: 'admin' } });
    }
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── GET /api/auth/verify  (check any token) ─────────────── */
router.get('/verify', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

/* ── POST /api/auth/forgot-password ─────────────────────── */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    // Always respond OK to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If that email is registered, a reset link has been sent.' });
    }

    // Generate secure token (hex, 64 chars)
    const resetToken   = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken   = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    await sendPasswordResetEmail(user.email, user.name, resetToken);

    res.json({ message: 'If that email is registered, a reset link has been sent.' });
  } catch (err) {
    console.error('[forgot-password]', err.message);
    res.status(500).json({ error: 'Failed to send reset email. Please try again.' });
  }
});

/* ── POST /api/auth/reset-password ──────────────────────── */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({
      resetPasswordToken:   token,
      resetPasswordExpires: { $gt: new Date() }, // not expired
    });

    if (!user) {
      return res.status(400).json({ error: 'Reset link is invalid or has expired.' });
    }

    user.password             = await bcrypt.hash(password, 10);
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now sign in.' });
  } catch (err) {
    console.error('[reset-password]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
