const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  genre: [{
    type: String,
    required: true,
  }],
  duration: {
    type: Number, // in minutes
    required: true,
  },
  language: {
    type: String,
    default: 'Dzongkha',
  },
  certificate: {
    type: String,
    enum: ['U', 'U/A', 'A', 'S'],
    default: 'U',
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  director: String,
  cast: [String],
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  poster: String,
  backdrop: String,
  trailer: String,
  status: {
    type: String,
    enum: ['now_showing', 'coming_soon', 'ended'],
    default: 'now_showing',
  },
  price: {
    regular: { type: Number, default: 150 },
    vip: { type: Number, default: 300 },
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Text index for search
movieSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
