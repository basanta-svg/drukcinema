const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  showtime: {
    date: { type: Date, required: true },
    time: { type: String, required: true },
    hall: { type: String, required: true },
    cinema: { type: String, required: true },
  },
  seats: [{
    row: String,
    number: Number,
    type: { type: String, enum: ['regular', 'vip'], default: 'regular' },
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'used'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['mBoB', 'BNB', 'cash', 'card'],
    default: 'cash',
  },
  bookingRef: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate booking reference before saving
bookingSchema.pre('save', function (next) {
  if (!this.bookingRef) {
    this.bookingRef = 'DC' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
