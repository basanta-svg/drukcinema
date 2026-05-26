const express         = require('express');
const Movie           = require('../models/Movie');
const { verifyToken } = require('../middleware/auth');
const router          = express.Router();

// GET /api/movies  (optional ?status=now_showing|coming_soon)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/movies/:id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/movies  (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/movies/:id  (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/movies/:id  (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
