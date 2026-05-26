const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  genres:      [String],
  language:    String,
  duration:    String,
  rating:      Number,
  basePrice:   Number,
  poster:      String,
  backdrop:    String,
  description: String,
  status:      { type: String, enum: ['now_showing', 'coming_soon'] },
  releaseDate: String,
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);
