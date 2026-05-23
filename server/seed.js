/**
 * Seed script — populates MongoDB with sample movies.
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');

const movies = [
  {
    title: "Lunana: A Yak in the Classroom",
    description: "A young teacher is sent to the most remote school in the world, nestled in the Himalayan mountains of Bhutan. Far from his dream of moving to Australia, he discovers the true meaning of life.",
    genre: ["Drama", "Adventure"],
    duration: 109,
    language: "Dzongkha",
    certificate: "U",
    releaseDate: new Date("2019-01-01"),
    director: "Pawo Choyning Dorji",
    cast: ["Sherab Dorji", "Ugyen Norbu Lhendup", "Kelden Lhamo Gurung"],
    rating: 8.4,
    poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    status: "now_showing",
    featured: true,
    price: { regular: 150, vip: 300 },
  },
  {
    title: "Travellers & Magicians",
    description: "A young Bhutanese man dreams of going to America but misses his bus. While waiting, a monk tells him a tale of sorcery and desire.",
    genre: ["Fantasy", "Drama"],
    duration: 108,
    language: "Dzongkha",
    certificate: "U/A",
    releaseDate: new Date("2003-05-17"),
    director: "Khyentse Norbu",
    cast: ["Tshewang Dendup", "Deki Yangzom"],
    rating: 7.6,
    poster: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop",
    status: "now_showing",
    price: { regular: 150, vip: 300 },
  },
  {
    title: "Dragon's Blessing",
    description: "A young monk discovers an ancient scroll prophesying a dark force threatening Bhutan.",
    genre: ["Action", "Spiritual"],
    duration: 118,
    language: "Dzongkha",
    certificate: "U/A",
    releaseDate: new Date("2024-03-10"),
    director: "Karma Yangchen",
    cast: ["Tenzin Dorji", "Pema Lhamo"],
    rating: 7.9,
    poster: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&h=1080&fit=crop",
    status: "now_showing",
    price: { regular: 180, vip: 350 },
  },
  {
    title: "Wangchuck: The Dragon King",
    description: "An epic historical drama depicting the unification of Bhutan under the first Druk Gyalpo.",
    genre: ["Historical", "Epic"],
    duration: 145,
    language: "Dzongkha",
    certificate: "U/A",
    releaseDate: new Date("2025-06-15"),
    director: "Sonam Tobgyal",
    cast: ["Tenzin Wangchuk", "Dechen Lhamo"],
    rating: 0,
    poster: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1920&h=1080&fit=crop",
    status: "coming_soon",
    price: { regular: 200, vip: 400 },
  },
  {
    title: "Himalayan Sky",
    description: "In 2045, Bhutan's first astronaut carries the nation's flag — and ancient prayers — to the stars.",
    genre: ["Sci-Fi", "Adventure"],
    duration: 132,
    language: "English/Dzongkha",
    certificate: "U",
    releaseDate: new Date("2025-11-15"),
    director: "Karma Phuntsho",
    cast: ["Rinzin Tenzin", "Pema Wangmo"],
    rating: 0,
    poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&h=1080&fit=crop",
    status: "coming_soon",
    price: { regular: 200, vip: 400 },
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Movie.deleteMany({});
    console.log('🗑️  Cleared existing movies');

    await Movie.insertMany(movies);
    console.log(`🎬 Seeded ${movies.length} movies`);

    await mongoose.disconnect();
    console.log('✅ Done! Disconnected from MongoDB.');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
