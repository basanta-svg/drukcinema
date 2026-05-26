const mongoose = require('mongoose');

const ShowtimeSchema = new mongoose.Schema({
  movie:       { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  cinema:      String,
  hall:        String,
  hallType:    String,
  capacity:    Number,
  date:        String,
  time:        String,
  bookedSeats: [String],
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Showtime', ShowtimeSchema);
