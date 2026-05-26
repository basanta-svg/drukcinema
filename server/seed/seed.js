require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const dns      = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Fix SRV lookup on restrictive DNS networks
const mongoose = require('mongoose');
const Movie    = require('../models/Movie');
const Showtime = require('../models/Showtime');
const Booking  = require('../models/Booking');

// ── Movie data ────────────────────────────────────────────────
const moviesData = [
  // ── NOW SHOWING ─────────────────────────────────────────────
  {
    title:       'Lunana: A Yak in the Classroom',
    genres:      ['Drama', 'Adventure'],
    language:    'Dzongkha',
    duration:    '109 min',
    rating:      8.4,
    basePrice:   150,
    description: 'A Bhutanese government teacher is assigned to the most remote school in the world — a tiny village in the Himalayas called Lunana.',
    status:      'now_showing',
  },
  {
    title:       'Travellers & Magicians',
    genres:      ['Fantasy', 'Drama'],
    language:    'Dzongkha',
    duration:    '108 min',
    rating:      7.6,
    basePrice:   150,
    description: 'A young Bhutanese government official who dreams of going to America encounters a group of travellers on the road who teach him about life.',
    status:      'now_showing',
  },
  {
    title:       'The Cup (Phörpa)',
    genres:      ['Comedy', 'Drama'],
    language:    'Tibetan',
    duration:    '93 min',
    rating:      7.4,
    basePrice:   120,
    description: 'Young Tibetan monks in exile in India try to watch the 1998 FIFA World Cup final against the wishes of their monastery elders.',
    status:      'now_showing',
  },
  {
    title:       'Hema Hema',
    genres:      ['Mystery', 'Drama'],
    language:    'Dzongkha',
    duration:    '81 min',
    rating:      6.8,
    basePrice:   150,
    description: 'A group of strangers are invited to a mysterious ritual in the forest where they must wear masks and leave their identities behind.',
    status:      'now_showing',
  },
  {
    title:       "Dragon's Blessing",
    genres:      ['Action', 'Spiritual'],
    language:    'Dzongkha',
    duration:    '118 min',
    rating:      7.9,
    basePrice:   180,
    description: 'An epic tale of a warrior who must protect the sacred Dragon Kingdom from ancient evil forces threatening its spiritual balance.',
    status:      'now_showing',
  },
  {
    title:       'Paro: Valley of Love',
    genres:      ['Romance', 'Drama'],
    language:    'Dzongkha',
    duration:    '102 min',
    rating:      7.2,
    basePrice:   150,
    description: 'A heartwarming love story set against the breathtaking landscape of the Paro valley and the iconic Tiger\'s Nest monastery.',
    status:      'now_showing',
  },
  {
    title:       "Tiger's Nest",
    genres:      ['Thriller', 'Spiritual'],
    language:    'Dzongkha',
    duration:    '112 min',
    rating:      7.7,
    basePrice:   150,
    description: 'A spiritual thriller following a monk who discovers a dark conspiracy threatening the sacred Paro Taktsang monastery.',
    status:      'now_showing',
  },
  {
    title:       'Gross National Happiness',
    genres:      ['Documentary', 'Drama'],
    language:    'English/Dzongkha',
    duration:    '95 min',
    rating:      8.1,
    basePrice:   120,
    description: 'An exploration of Bhutan\'s unique philosophy of Gross National Happiness and how it shapes the lives of its people.',
    status:      'now_showing',
  },

  // ── COMING SOON ─────────────────────────────────────────────
  {
    title:       'Wangchuck: The Dragon King',
    genres:      ['Historical', 'Epic'],
    language:    'Dzongkha',
    duration:    'TBA',
    basePrice:   200,
    description: 'An epic historical drama about the life of Bhutan\'s beloved fourth king and the nation\'s path to democracy.',
    status:      'coming_soon',
    releaseDate: 'June 2026',
  },
  {
    title:       'Bhutan Calling',
    genres:      ['Comedy', 'Romance'],
    language:    'Dzongkha',
    duration:    'TBA',
    basePrice:   150,
    description: 'A modern romantic comedy about a Bhutanese student returning home from abroad and rediscovering his roots.',
    status:      'coming_soon',
    releaseDate: 'July 2026',
  },
  {
    title:       'The Last Yak Herder',
    genres:      ['Drama', 'Adventure'],
    language:    'Dzongkha',
    duration:    'TBA',
    basePrice:   150,
    description: 'The poignant story of a traditional yak herder in the Bhutanese highlands facing the encroachment of modernity.',
    status:      'coming_soon',
    releaseDate: 'August 2026',
  },
  {
    title:       'Thimphu Nights',
    genres:      ['Crime', 'Thriller'],
    language:    'Dzongkha',
    duration:    'TBA',
    basePrice:   160,
    description: 'A gripping crime thriller set in the streets of Thimphu uncovering a web of corruption beneath the city\'s serene surface.',
    status:      'coming_soon',
    releaseDate: 'September 2026',
  },
  {
    title:       'The Masked Dancer',
    genres:      ['Cultural', 'Musical'],
    language:    'Dzongkha',
    duration:    'TBA',
    basePrice:   150,
    description: 'A young dancer strives to master the sacred Cham dance for the Thimphu Tsechu festival against family opposition.',
    status:      'coming_soon',
    releaseDate: 'October 2026',
  },
  {
    title:       'Himalayan Sky',
    genres:      ['Sci-Fi', 'Adventure'],
    language:    'Dzongkha',
    duration:    'TBA',
    basePrice:   180,
    description: 'A visionary sci-fi adventure where Bhutanese astronauts carry their kingdom\'s ancient wisdom to the stars.',
    status:      'coming_soon',
    releaseDate: 'November 2026',
  },
];

// ── Showtime config ───────────────────────────────────────────
const TIMES    = ['10:00 AM', '1:30 PM', '6:30 PM', '9:15 PM'];
const CINEMA   = 'Thimphu City Cinema';
const HALL     = 'Hall 1';
const HALL_TYPE = 'Premium';
const CAPACITY  = 150;

// Build date strings for today + next 6 days
function getDateStrings() {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, '0');
    const dd   = String(d.getDate()).padStart(2, '0');
    dates.push(`${yyyy}-${mm}-${dd}`);
  }
  return dates;
}

// ── Main seed ─────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Clear existing data
    await Movie.deleteMany({});
    await Showtime.deleteMany({});
    await Booking.deleteMany({});
    console.log('🗑️  Cleared existing movies, showtimes, and bookings');

    // Insert movies
    const insertedMovies = await Movie.insertMany(moviesData);
    console.log(`🎬 Inserted ${insertedMovies.length} movies`);

    // Build showtimes for now_showing movies only
    const nowShowing = insertedMovies.filter(m => m.status === 'now_showing');
    const dates      = getDateStrings();
    const showtimeDocs = [];

    for (const movie of nowShowing) {
      for (const date of dates) {
        for (const time of TIMES) {
          showtimeDocs.push({
            movie:       movie._id,
            cinema:      CINEMA,
            hall:        HALL,
            hallType:    HALL_TYPE,
            capacity:    CAPACITY,
            date,
            time,
            bookedSeats: [],
            isActive:    true,
          });
        }
      }
    }

    const insertedShowtimes = await Showtime.insertMany(showtimeDocs);
    console.log(`🕐 Inserted ${insertedShowtimes.length} showtimes`);
    console.log(`   (${nowShowing.length} movies × 7 days × 4 times)`);

    console.log('\n✅ Seed complete!');
    console.log('─────────────────────────────────────────');
    insertedMovies.forEach(m => {
      console.log(`  [${m.status === 'now_showing' ? '▶ NOW' : '⏳ SOON'}] ${m.title}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
