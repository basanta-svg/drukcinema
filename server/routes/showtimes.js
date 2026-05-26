const express         = require('express');
const Showtime        = require('../models/Showtime');
const { verifyToken } = require('../middleware/auth');
const router          = express.Router();

// GET /api/showtimes  (optional ?movieId=xxx)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.movieId) filter.movie = req.query.movieId;
    const showtimes = await Showtime.find(filter)
      .populate('movie', 'title poster duration rating basePrice')
      .sort({ date: 1, time: 1 });
    res.json(showtimes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/showtimes/:id
router.get('/:id', async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate('movie');
    if (!showtime) return res.status(404).json({ error: 'Showtime not found' });
    res.json(showtime);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/showtimes  (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const showtime = await Showtime.create(req.body);
    res.status(201).json(showtime);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/showtimes/:id  (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!showtime) return res.status(404).json({ error: 'Showtime not found' });
    res.json(showtime);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/showtimes/:id  (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Showtime.findByIdAndDelete(req.params.id);
    res.json({ message: 'Showtime deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
