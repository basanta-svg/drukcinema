const express         = require('express');
const Booking         = require('../models/Booking');
const Showtime        = require('../models/Showtime');
const { verifyToken } = require('../middleware/auth');
const router          = express.Router();

// Generate DRK-XXXXXX booking ID
function generateBookingId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'DRK-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// GET /api/bookings  (protected, optional ?type=online|offline&status=confirmed)
router.get('/', verifyToken, async (req, res) => {
  try {
    const filter = {};
    if (req.query.type)   filter.type   = req.query.type;
    if (req.query.status) filter.status = req.query.status;

    const bookings = await Booking.find(filter)
      .populate('movie', 'title poster')
      .populate('showtime', 'cinema hall date time')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/find/:bookingId  (DRK-XXXXXX lookup)
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

// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const { showtimeId, seats, customerName, phone, email,
            seatType, amount, type } = req.body;

    // Validate showtime exists
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) return res.status(404).json({ error: 'Showtime not found' });

    // Check seat conflicts
    const conflict = seats.some(s => showtime.bookedSeats.includes(s));
    if (conflict) {
      return res.status(400).json({ error: 'One or more seats are already booked' });
    }

    // Calculate fees
    const convenienceFee = Math.round(amount * 0.05);
    const totalAmount    = amount + convenienceFee;

    // Generate unique booking ID (retry if collision)
    let bookingId;
    let attempts = 0;
    do {
      bookingId = generateBookingId();
      attempts++;
    } while (attempts < 5 && await Booking.findOne({ bookingId }));

    // Create booking
    const booking = await Booking.create({
      bookingId,
      customerName,
      phone,
      email,
      movie:    showtime.movie,
      showtime: showtime._id,
      seats,
      seatType,
      amount,
      convenienceFee,
      totalAmount,
      type: type || 'online',
      status: 'confirmed'
    });

    // Mark seats as booked
    await Showtime.findByIdAndUpdate(showtimeId, {
      $push: { bookedSeats: { $each: seats } }
    });

    const populated = await booking.populate([
      { path: 'movie',    select: 'title poster' },
      { path: 'showtime', select: 'cinema hall date time' }
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/bookings/:id  (protected — cancel booking)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.status = 'cancelled';
    await booking.save();

    // Free the seats
    await Showtime.findByIdAndUpdate(booking.showtime, {
      $pull: { bookedSeats: { $in: booking.seats } }
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
