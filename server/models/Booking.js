const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingId:      String,
  customerName:   String,
  phone:          String,
  email:          String,
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  movie:          { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  showtime:       { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime' },
  seats:          [String],
  seatType:       String,
  amount:         Number,
  convenienceFee: Number,
  totalAmount:    Number,
  type:           { type: String, enum: ['online', 'offline'] },
  status:         { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
