const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/movies  — list all (with filters)
router.get('/', async (req, res) => {
  try {
    const { status, genre, search, limit = 20, page = 1 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (genre) filter.genre = { $in: [genre] };
    if (search) filter.$text = { $search: search };

    const skip = (page - 1) * limit;
    const movies = await Movie.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Movie.countDocuments(filter);

    res.json({
      success: true,
      count: movies.length,
      total,
      pages: Math.ceil(total / limit),
      movies,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/movies/now-showing
router.get('/now-showing', async (req, res) => {
  try {
    const movies = await Movie.find({ status: 'now_showing' })
      .sort({ featured: -1, rating: -1 });
    res.json({ success: true, movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/movies/coming-soon
router.get('/coming-soon', async (req, res) => {
  try {
    const movies = await Movie.find({ status: 'coming_soon' })
      .sort({ releaseDate: 1 });
    res.json({ success: true, movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/movies/:id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found.' });
    res.json({ success: true, movie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/movies  (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ success: true, movie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/movies/:id  (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found.' });
    res.json({ success: true, movie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/movies/:id  (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Movie deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
