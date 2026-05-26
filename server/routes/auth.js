const express     = require('express');
const jwt         = require('jsonwebtoken');
const { verifyToken } = require('../middleware/auth');
const router      = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
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

// GET /api/auth/verify
router.get('/verify', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;
