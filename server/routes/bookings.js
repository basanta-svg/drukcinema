const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

// POST /api/bookings  (authenticated)
router.post('/', protect, async (req, res) => {
  try {
    const { movieId, showtime, seats, paymentMethod } = req.body;

    if (!movieId || !showtime || !seats || !seats.length) {
      return res.status(400).json({ success: false, message: 'Missing booking details.' });
    }

    // Calculate total
    const pricePerSeat = seats.some(s => s.type === 'vip') ? 300 : 150;
    const totalAmount = seats.length * pricePerSeat;

    const booking = await Booking.create({
      user: req.user._id,
      movie: movieId,
      showtime,
      seats,
      totalAmount,
      paymentMethod: paymentMethod || 'cash',
      status: 'confirmed',
    });

    // Populate movie info
    await booking.populate('movie', 'title poster');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed! 🎉',
      booking,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/my  (authenticated — user's own bookings)
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title poster duration')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie', 'title poster duration')
      .populate('user', 'name email');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    // Allow only the owner or admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/bookings/:id  (cancel booking)
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
