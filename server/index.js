require('dotenv').config();
const dns      = require('dns');
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

// ── Force Node.js to use Google DNS (fixes SRV lookup on restrictive networks) ──
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'https://drukcinema.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'http://localhost:5500',
  ],
  credentials: true,
}));
app.use(express.json());

// ── Database ──────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/movies',    require('./routes/movies'));
app.use('/api/showtimes', require('./routes/showtimes'));
app.use('/api/bookings',  require('./routes/bookings'));
app.use('/api/auth',      require('./routes/auth'));

// ── Health check ──────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'DrukCinema API running' });
});

// ── Start server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎬 DrukCinema API → http://localhost:${PORT}`);
});
