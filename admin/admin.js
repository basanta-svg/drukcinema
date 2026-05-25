'use strict';
/* ================================================================
   DrukCinema Admin — Shared JavaScript
   Included by every admin page for auth, data, and utilities
================================================================ */

// ── Credentials ────────────────────────────────────────────────
const ADMIN_CREDS = { username: 'admin', password: 'drukcinema2024' };

// ── Storage Keys ───────────────────────────────────────────────
const SK = {
  auth:      'drk_admin_auth',
  movies:    'drk_admin_movies',
  showtimes: 'drk_admin_showtimes',
  bookings:  'drk_admin_bookings',
};

// ── Auth ───────────────────────────────────────────────────────
function checkAuth() {
  const a = JSON.parse(localStorage.getItem(SK.auth) || 'null');
  if (!a || !a.loggedIn) { window.location.href = 'index.html'; return null; }
  return a;
}
function adminLogin(u, p) {
  if (u === ADMIN_CREDS.username && p === ADMIN_CREDS.password) {
    localStorage.setItem(SK.auth, JSON.stringify({ loggedIn: true, username: u }));
    return true;
  }
  return false;
}
function adminLogout() {
  localStorage.removeItem(SK.auth);
  window.location.href = 'index.html';
}
function getLoggedInUser() {
  const a = JSON.parse(localStorage.getItem(SK.auth) || 'null');
  return a ? a.username : 'admin';
}

// ── LocalStorage Helpers ───────────────────────────────────────
function getMovies()      { return JSON.parse(localStorage.getItem(SK.movies)    || '[]'); }
function saveMovies(d)    { localStorage.setItem(SK.movies,    JSON.stringify(d)); }
function getShowtimes()   { return JSON.parse(localStorage.getItem(SK.showtimes) || '[]'); }
function saveShowtimes(d) { localStorage.setItem(SK.showtimes, JSON.stringify(d)); }
function getBookings()    { return JSON.parse(localStorage.getItem(SK.bookings)  || '[]'); }
function saveBookings(d)  { localStorage.setItem(SK.bookings,  JSON.stringify(d)); }

// ── Utilities ──────────────────────────────────────────────────
function generateBookingId() {
  const ts  = Date.now().toString().slice(-6);
  const rnd = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BK${ts}${rnd}`;
}
function uid(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
function formatCurrency(n) {
  return `Nu. ${Number(n).toLocaleString()}`;
}
function formatDate(s) {
  if (!s) return '—';
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function todayStr() {
  return new Date().toISOString().split('T')[0];
}
function dateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// ── UI Helpers ─────────────────────────────────────────────────
function renderStars(r) {
  return [1, 2, 3, 4, 5].map(i =>
    `<i class="fas fa-star" style="color:${i <= r ? '#F5C518' : '#333'}; font-size:11px"></i>`
  ).join('');
}

function statusBadge(s) {
  const M = {
    confirmed:   ['badge-success',   'Confirmed'],
    pending:     ['badge-warning',   'Pending'],
    cancelled:   ['badge-danger',    'Cancelled'],
    now_showing: ['badge-success',   'Now Showing'],
    coming_soon: ['badge-info',      'Coming Soon'],
    online:      ['badge-info',      'Online'],
    offline:     ['badge-secondary', 'Counter'],
  };
  const [cls, lbl] = M[s] || ['badge-secondary', s];
  return `<span class="badge ${cls}">${lbl}</span>`;
}

function showToast(msg, type = 'success') {
  document.getElementById('adminToast')?.remove();
  const t = document.createElement('div');
  t.id = 'adminToast';
  t.className = `admin-toast admin-toast-${type}`;
  const icons = { success: 'check-circle', error: 'times-circle', info: 'info-circle', warning: 'exclamation-circle' };
  t.innerHTML = `<i class="fas fa-${icons[type] || 'info-circle'}"></i><span>${msg}</span>`;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, 3200);
}

// ── Seat Map Builder ───────────────────────────────────────────
// options: { totalSeats, bookedSeats:[], selectedSeats:[], onToggle:fn }
function buildSeatMap(containerId, options) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { totalSeats = 80, bookedSeats = [], selectedSeats = [], onToggle } = options;
  const seatsPerRow = 10;
  const numRows     = Math.ceil(totalSeats / seatsPerRow);
  const rowLetters  = 'ABCDEFGHIJ'.slice(0, numRows).split('');

  let html = `
    <div class="screen-bar">S C R E E N</div>
    <div class="seat-legend">
      <div class="legend-item"><div class="legend-seat available"></div><span>Available</span></div>
      <div class="legend-item"><div class="legend-seat booked"></div><span>Booked</span></div>
      <div class="legend-item"><div class="legend-seat selected"></div><span>Selected</span></div>
    </div>
    <div class="seat-rows">`;

  for (const rowLetter of rowLetters) {
    html += `<div class="seat-row"><span class="row-label">${rowLetter}</span>`;
    for (let s = 1; s <= seatsPerRow; s++) {
      const seatId     = `${rowLetter}${s}`;
      const isBooked   = bookedSeats.includes(seatId);
      const isSelected = selectedSeats.includes(seatId);
      const cls        = isBooked ? 'booked' : isSelected ? 'selected' : 'available';
      if (s === 6) html += `<div class="seat-gap"></div>`;
      html += `<button class="seat ${cls}" data-seat="${seatId}"${isBooked ? ' disabled' : ''} title="${seatId}">${s}</button>`;
    }
    html += `</div>`;
  }
  html += `</div>`;
  container.innerHTML = html;

  if (onToggle) {
    container.querySelectorAll('.seat:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => onToggle(btn.dataset.seat));
    });
  }
}

// ── Sample Data ────────────────────────────────────────────────
const SAMPLE_MOVIES = [
  {
    id: 'sm1', title: 'Lunana: A Yak in the Classroom', genre: 'Drama',
    rating: 4, duration: '109 min', year: 2019,
    description: 'A young teacher is sent to the most remote school in the world in the Himalayan mountains of Bhutan, where he discovers the true meaning of purpose and belonging.',
    posterUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&q=80',
    status: 'now_showing'
  },
  {
    id: 'sm2', title: 'Hema Hema: Sing Me a Song While I Wait', genre: 'Drama',
    rating: 3, duration: '81 min', year: 2016,
    description: 'In a surreal forest ceremony held every 12 years, strangers wear animal masks and shed their identities in a profound meditation on ego and transformation.',
    posterUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=600&fit=crop&q=80',
    status: 'now_showing'
  },
  {
    id: 'sm3', title: 'The Cup', genre: 'Comedy/Drama',
    rating: 4, duration: '93 min', year: 1999,
    description: 'Young Tibetan monks at a monastery in India go to great lengths to secretly watch the 1998 FIFA World Cup, blending comedy with Buddhist wisdom.',
    posterUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop&q=80',
    status: 'now_showing'
  },
  {
    id: 'sm4', title: 'Milarepa', genre: 'Historical',
    rating: 4, duration: '100 min', year: 2006,
    description: "The life story of Tibet's greatest Buddhist saint — from a dark sorcerer seeking revenge to an enlightened master of the dharma.",
    posterUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=600&fit=crop&q=80',
    status: 'now_showing'
  },
  {
    id: 'sm5', title: 'Vara: A Blessing', genre: 'Drama',
    rating: 4, duration: '107 min', year: 2013,
    description: "A story of love, faith, and the sacred bond between humans and the divine, set against Bhutan's breathtaking Himalayan landscapes.",
    posterUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&q=80',
    status: 'coming_soon'
  },
];

function _buildSampleShowtimes() {
  return [
    { id: 'ss1',  movieId: 'sm1', date: dateOffset(0), time: '10:00', hall: '1', totalSeats: 80,  bookedSeats: ['A1','A2','A3','B1','B2'], price: 150 },
    { id: 'ss2',  movieId: 'sm1', date: dateOffset(1), time: '14:00', hall: '1', totalSeats: 80,  bookedSeats: ['C1','C2'],                 price: 150 },
    { id: 'ss3',  movieId: 'sm1', date: dateOffset(2), time: '19:00', hall: '2', totalSeats: 100, bookedSeats: ['A1','A2','A3','A4','B1'], price: 150 },
    { id: 'ss4',  movieId: 'sm2', date: dateOffset(0), time: '13:00', hall: '2', totalSeats: 80,  bookedSeats: ['A1','A2'],                 price: 150 },
    { id: 'ss5',  movieId: 'sm2', date: dateOffset(2), time: '16:00', hall: '1', totalSeats: 80,  bookedSeats: ['B3','B4','B5'],            price: 150 },
    { id: 'ss6',  movieId: 'sm2', date: dateOffset(4), time: '19:00', hall: '3', totalSeats: 60,  bookedSeats: [],                          price: 150 },
    { id: 'ss7',  movieId: 'sm3', date: dateOffset(1), time: '11:00', hall: '3', totalSeats: 60,  bookedSeats: ['A1','A2','A3','A4','A5'], price: 150 },
    { id: 'ss8',  movieId: 'sm3', date: dateOffset(3), time: '15:00', hall: '1', totalSeats: 80,  bookedSeats: ['D1','D2'],                 price: 150 },
    { id: 'ss9',  movieId: 'sm3', date: dateOffset(5), time: '18:00', hall: '2', totalSeats: 80,  bookedSeats: [],                          price: 150 },
    { id: 'ss10', movieId: 'sm4', date: dateOffset(0), time: '16:00', hall: '3', totalSeats: 60,  bookedSeats: ['A1','B1','C1'],            price: 150 },
    { id: 'ss11', movieId: 'sm4', date: dateOffset(3), time: '10:00', hall: '2', totalSeats: 100, bookedSeats: ['A1','A2'],                 price: 150 },
    { id: 'ss12', movieId: 'sm4', date: dateOffset(6), time: '20:00', hall: '1', totalSeats: 80,  bookedSeats: [],                          price: 150 },
    { id: 'ss13', movieId: 'sm5', date: dateOffset(7), time: '14:00', hall: '1', totalSeats: 80,  bookedSeats: [],                          price: 150 },
    { id: 'ss14', movieId: 'sm5', date: dateOffset(8), time: '17:00', hall: '2', totalSeats: 100, bookedSeats: [],                          price: 150 },
    { id: 'ss15', movieId: 'sm5', date: dateOffset(9), time: '20:00', hall: '3', totalSeats: 60,  bookedSeats: [],                          price: 150 },
  ];
}

function _buildSampleBookings() {
  const t = dateOffset(0);
  return [
    { id: 'BK240001', customerName: 'Tenzin Dorji',     phone: '17123456', movieId: 'sm1', movieTitle: 'Lunana: A Yak in the Classroom',          showtimeId: 'ss1',  date: t,             time: '10:00', hall: '1', seats: ['A1','A2'],      amount: 300, type: 'online',  status: 'confirmed' },
    { id: 'BK240002', customerName: 'Pema Choden',      phone: '17654321', movieId: 'sm1', movieTitle: 'Lunana: A Yak in the Classroom',          showtimeId: 'ss1',  date: t,             time: '10:00', hall: '1', seats: ['A3'],           amount: 150, type: 'online',  status: 'confirmed' },
    { id: 'BK240003', customerName: 'Karma Wangdi',     phone: '77889900', movieId: 'sm2', movieTitle: 'Hema Hema: Sing Me a Song While I Wait',  showtimeId: 'ss4',  date: t,             time: '13:00', hall: '2', seats: ['A1','A2'],      amount: 300, type: 'offline', status: 'confirmed' },
    { id: 'BK240004', customerName: 'Sonam Lhamo',      phone: '17234567', movieId: 'sm3', movieTitle: 'The Cup',                                 showtimeId: 'ss7',  date: dateOffset(1), time: '11:00', hall: '3', seats: ['A1','A2','A3'], amount: 450, type: 'online',  status: 'confirmed' },
    { id: 'BK240005', customerName: 'Ugyen Tshering',   phone: '77001122', movieId: 'sm4', movieTitle: 'Milarepa',                                showtimeId: 'ss10', date: t,             time: '16:00', hall: '3', seats: ['A1'],           amount: 150, type: 'offline', status: 'confirmed' },
    { id: 'BK240006', customerName: 'Deki Yangchen',    phone: '17345678', movieId: 'sm1', movieTitle: 'Lunana: A Yak in the Classroom',          showtimeId: 'ss1',  date: t,             time: '10:00', hall: '1', seats: ['B1','B2'],      amount: 300, type: 'online',  status: 'confirmed' },
    { id: 'BK240007', customerName: 'Rinchen Wangmo',   phone: '17456789', movieId: 'sm2', movieTitle: 'Hema Hema: Sing Me a Song While I Wait',  showtimeId: 'ss5',  date: dateOffset(2), time: '16:00', hall: '1', seats: ['B3','B4','B5'], amount: 450, type: 'online',  status: 'confirmed' },
    { id: 'BK240008', customerName: 'Lobzang Phuntsho', phone: '77334455', movieId: 'sm3', movieTitle: 'The Cup',                                 showtimeId: 'ss7',  date: dateOffset(1), time: '11:00', hall: '3', seats: ['A4','A5'],      amount: 300, type: 'offline', status: 'pending'   },
    { id: 'BK240009', customerName: 'Yeshi Dema',       phone: '17567890', movieId: 'sm4', movieTitle: 'Milarepa',                                showtimeId: 'ss10', date: t,             time: '16:00', hall: '3', seats: ['B1'],           amount: 150, type: 'online',  status: 'pending'   },
    { id: 'BK240010', customerName: 'Namgay Zam',       phone: '77556677', movieId: 'sm4', movieTitle: 'Milarepa',                                showtimeId: 'ss10', date: t,             time: '16:00', hall: '3', seats: ['C1'],           amount: 150, type: 'offline', status: 'cancelled' },
  ];
}

function initSampleData() {
  if (!localStorage.getItem(SK.movies))    saveMovies(_buildSampleMovies());
  if (!localStorage.getItem(SK.showtimes)) saveShowtimes(_buildSampleShowtimes());
  if (!localStorage.getItem(SK.bookings))  saveBookings(_buildSampleBookings());
}

function _buildSampleMovies() { return SAMPLE_MOVIES; }

// Run on every page load
initSampleData();
