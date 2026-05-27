const express         = require('express');
const Booking         = require('../models/Booking');
const Showtime        = require('../models/Showtime');
const { verifyToken, optionalAuth } = require('../middleware/auth');
const router          = express.Router();

/* Generate DRK-XXXXXX booking ID */
function generateBookingId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'DRK-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/* ── GET /api/bookings/my  (user's own bookings — requires user JWT) ── */
router.get('/my', verifyToken, async (req, res) => {
  try {
    if (!req.user.id) {
      return res.status(403).json({ error: 'This route is for user accounts only' });
    }
    const bookings = await Booking.find({ user: req.user.id })
      .populate('movie',    'title posterUrl poster')
      .populate('showtime', 'date time hall cinema')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── GET /api/bookings  (admin — all bookings) ───────────── */
router.get('/', verifyToken, async (req, res) => {
  try {
    const filter = {};
    if (req.query.type)   filter.type   = req.query.type;
    if (req.query.status) filter.status = req.query.status;

    const bookings = await Booking.find(filter)
      .populate('movie',    'title posterUrl poster')
      .populate('showtime', 'cinema hall date time')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── GET /api/bookings/find/:bookingId  (DRK-XXXXXX lookup) ─ */
router.get('/find/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId })
      .populate('movie')
      .populate('showtime');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── POST /api/bookings  (create — optionally authenticated) ─ */
router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      showtimeId, seats, customerName, phone, email,
      seatType, amount, type, status
    } = req.body;

    console.log('[POST /api/bookings] body:', JSON.stringify(req.body, null, 2));
    console.log('[POST /api/bookings] user:', req.user ? req.user.id || req.user.username : 'guest');

    /* Validate showtime */
    if (!showtimeId) {
      return res.status(400).json({ error: 'showtimeId is required' });
    }
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) return res.status(404).json({ error: 'Showtime not found' });

    /* Check seat conflicts */
    if (!seats || !seats.length) {
      return res.status(400).json({ error: 'seats array is required' });
    }
    const conflict = seats.some(s => showtime.bookedSeats.includes(s));
    if (conflict) {
      return res.status(400).json({ error: 'One or more seats are already booked' });
    }

    /* Calculate fees */
    const subtotal        = Number(amount) || 0;
    const convenienceFee  = Math.round(subtotal * 0.05);
    const totalAmount     = subtotal + convenienceFee;

    /* Unique booking ID */
    let bookingId;
    let attempts = 0;
    do {
      bookingId = generateBookingId();
      attempts++;
    } while (attempts < 5 && await Booking.findOne({ bookingId }));

    /* Create booking */
    const booking = await Booking.create({
      bookingId,
      customerName: customerName || 'Guest',
      phone:        phone        || 'N/A',
      email:        email        || 'N/A',
      user:         req.user?.id || null,
      movie:        showtime.movie,
      showtime:     showtime._id,
      seats,
      seatType:     seatType || 'classic',
      amount:       subtotal,
      convenienceFee,
      totalAmount,
      type:         type   || 'online',
      status:       status || 'confirmed',
    });

    /* Mark seats as booked on showtime */
    await Showtime.findByIdAndUpdate(showtimeId, {
      $push: { bookedSeats: { $each: seats } }
    });

    const populated = await booking.populate([
      { path: 'movie',    select: 'title posterUrl poster' },
      { path: 'showtime', select: 'cinema hall date time'  },
    ]);

    console.log('[POST /api/bookings] created:', booking.bookingId);
    res.status(201).json(populated);
  } catch (err) {
    console.error('[POST /api/bookings] error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

/* ── PUT /api/bookings/:id  (cancel — protected) ─────────── */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.status = 'cancelled';
    await booking.save();

    await Showtime.findByIdAndUpdate(booking.showtime, {
      $pull: { bookedSeats: { $in: booking.seats } }
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
