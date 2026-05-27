'use strict';
/* ================================================================
   DrukCinema Admin — Shared JavaScript
   API-connected: reads/writes from live backend at localhost:5000
================================================================ */

// ── API base ──────────────────────────────────────────────────
const ADMIN_API = 'https://drukcinema-api.onrender.com';

// ── Storage keys ──────────────────────────────────────────────
const SK = {
  auth:  'drk_admin_auth',
  token: 'drk_admin_token',
};

// ── Token helpers ─────────────────────────────────────────────
function getToken() { return localStorage.getItem(SK.token) || ''; }
function authHeader() {
  const h = { 'Content-Type': 'application/json' };
  const t = getToken();
  if (t) h['Authorization'] = 'Bearer ' + t;
  return h;
}

// ── Auth ──────────────────────────────────────────────────────
function checkAuth() {
  const a = JSON.parse(localStorage.getItem(SK.auth) || 'null');
  if (!a || !a.loggedIn || !getToken()) {
    window.location.href = 'index.html';
    return null;
  }
  return a;
}

// Returns Promise<boolean>
async function adminLogin(u, p) {
  try {
    const res  = await fetch(ADMIN_API + '/api/auth/admin/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username: u, password: p }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem(SK.token, data.token);
      localStorage.setItem(SK.auth, JSON.stringify({ loggedIn: true, username: u }));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function adminLogout() {
  localStorage.removeItem(SK.auth);
  localStorage.removeItem(SK.token);
  window.location.href = 'index.html';
}

function getLoggedInUser() {
  const a = JSON.parse(localStorage.getItem(SK.auth) || 'null');
  return a ? a.username : 'admin';
}

// ── In-memory cache ───────────────────────────────────────────
let _moviesCache    = [];
let _showtimesCache = [];
let _bookingsCache  = [];

// ── Normalisers — map API shapes → admin-page format ─────────

function _parseTime(t) {
  // "10:00 AM" / "1:30 PM" → "10:00" / "13:30" for <input type="time">
  if (!t) return '10:00';
  if (/^\d{2}:\d{2}$/.test(t)) return t;
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return String(t).substring(0, 5);
  let h = parseInt(m[1]);
  const min = m[2], ap = m[3].toUpperCase();
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return String(h).padStart(2, '0') + ':' + min;
}

function _normalizeMovie(m) {
  const genres = Array.isArray(m.genres) ? m.genres : [];
  return {
    ...m,
    id:        String(m._id || m.id || ''),
    genre:     genres.join('/'),
    rating:    Math.round((m.rating || 0) / 2),   // 0–10 → 0–5 stars
    posterUrl: m.poster || m.posterUrl || '',
    duration:  m.duration || '',
    year:      m.year || null,
  };
}

function _normalizeShowtime(s) {
  const mov = (typeof s.movie === 'object' && s.movie) ? s.movie : null;
  return {
    ...s,
    id:         String(s._id || s.id || ''),
    movieId:    String(mov?._id || (typeof s.movie === 'string' ? s.movie : '') || s.movieId || ''),
    movieTitle: mov?.title || s.movieTitle || '',
    totalSeats: s.capacity || s.totalSeats || 80,
    hall:       String(s.hall || '').replace(/^Hall\s*/i, '') || '1',
    price:      s.basePrice || s.price || 150,
    time:       _parseTime(s.time),
    bookedSeats: Array.isArray(s.bookedSeats) ? s.bookedSeats : [],
  };
}

function _normalizeBooking(b) {
  const mov = (typeof b.movie    === 'object' && b.movie)    ? b.movie    : null;
  const shw = (typeof b.showtime === 'object' && b.showtime) ? b.showtime : null;
  return {
    ...b,
    id:          b.bookingId || String(b._id || ''),
    movieId:     String(mov?._id    || (typeof b.movie    === 'string' ? b.movie    : '') || ''),
    movieTitle:  mov?.title  || b.movieTitle  || '',
    showtimeId:  String(shw?._id   || (typeof b.showtime === 'string' ? b.showtime : '') || ''),
    hall:        String(shw?.hall   || b.hall   || '').replace(/^Hall\s*/i, ''),
    date:        shw?.date   || b.date   || '',
    time:        _parseTime(shw?.time || b.time),
    seats:       Array.isArray(b.seats) ? b.seats : [],
    amount:      b.amount || 0,
    status:      b.status || 'confirmed',
    type:        b.type   || 'online',
    customerName: b.customerName || '',
    phone:       b.phone  || '',
  };
}

// ── Low-level API helpers ─────────────────────────────────────
async function apiGet(path) {
  const res = await fetch(ADMIN_API + path, { headers: authHeader() });
  if (res.status === 401) { adminLogout(); throw new Error('Unauthorised'); }
  return res.json();
}
async function apiPost(path, body) {
  const res = await fetch(ADMIN_API + path, {
    method: 'POST', headers: authHeader(), body: JSON.stringify(body),
  });
  return res.json();
}
async function apiPut(path, body) {
  const res = await fetch(ADMIN_API + path, {
    method: 'PUT', headers: authHeader(), body: JSON.stringify(body),
  });
  return res.json();
}
async function apiDelete(path) {
  const res = await fetch(ADMIN_API + path, {
    method: 'DELETE', headers: authHeader(),
  });
  return res.json();
}

// ── Data loaders (populate in-memory cache) ───────────────────
async function loadMovies() {
  // Movies are public — no auth needed
  const data = await fetch(ADMIN_API + '/api/movies').then(r => r.json());
  _moviesCache = (Array.isArray(data) ? data : []).map(_normalizeMovie);
  return _moviesCache;
}
async function loadShowtimes() {
  // Showtimes GET is public
  const data = await fetch(ADMIN_API + '/api/showtimes').then(r => r.json());
  _showtimesCache = (Array.isArray(data) ? data : []).map(_normalizeShowtime);
  return _showtimesCache;
}
async function loadBookings() {
  // Bookings GET requires auth
  const data = await apiGet('/api/bookings');
  _bookingsCache = (Array.isArray(data) ? data : []).map(_normalizeBooking);
  return _bookingsCache;
}

// ── Sync cache getters (used by page scripts after loadXxx) ───
function getMovies()    { return _moviesCache; }
function getShowtimes() { return _showtimesCache; }
function getBookings()  { return _bookingsCache; }

// ── Movie CRUD ────────────────────────────────────────────────
function _movieToApi(a) {
  return {
    title:       a.title,
    genres:      a.genre ? a.genre.split('/').map(g => g.trim()).filter(Boolean) : [],
    rating:      (Number(a.rating) || 0) * 2,   // 1–5 stars → 2–10
    duration:    a.duration || '',
    description: a.description || '',
    poster:      a.posterUrl || '',
    status:      a.status || 'now_showing',
    language:    a.language || 'Dzongkha',
    basePrice:   Number(a.basePrice) || 150,
  };
}

async function addMovieApi(data) {
  const m  = await apiPost('/api/movies', _movieToApi(data));
  const nm = _normalizeMovie(m);
  if (m._id) _moviesCache.push(nm);
  return nm;
}
async function updateMovieApi(id, data) {
  const m   = await apiPut('/api/movies/' + id, _movieToApi(data));
  const nm  = _normalizeMovie(m);
  const idx = _moviesCache.findIndex(x => x.id === id);
  if (idx >= 0) _moviesCache[idx] = nm;
  return nm;
}
async function deleteMovieApi(id) {
  await apiDelete('/api/movies/' + id);
  _moviesCache = _moviesCache.filter(m => m.id !== id);
}

// ── Showtime CRUD ─────────────────────────────────────────────
function _showtimeToApi(a) {
  return {
    movie:    a.movieId,
    cinema:   'Thimphu City Cinema',
    hall:     'Hall ' + (a.hall || '1'),
    hallType: 'Standard',
    capacity: Number(a.totalSeats) || 80,
    date:     a.date,
    time:     a.time,           // stored as "HH:MM"
    isActive: true,
  };
}

async function addShowtimeApi(data) {
  const s  = await apiPost('/api/showtimes', _showtimeToApi(data));
  const ns = _normalizeShowtime(s);
  if (s._id) _showtimesCache.push(ns);
  return ns;
}
async function updateShowtimeApi(id, data) {
  const s   = await apiPut('/api/showtimes/' + id, _showtimeToApi(data));
  const ns  = _normalizeShowtime(s);
  const idx = _showtimesCache.findIndex(x => x.id === id);
  if (idx >= 0) _showtimesCache[idx] = ns;
  return ns;
}
async function deleteShowtimeApi(id) {
  await apiDelete('/api/showtimes/' + id);
  _showtimesCache = _showtimesCache.filter(s => s.id !== id);
}

// ── Booking CRUD ──────────────────────────────────────────────
async function addBookingApi(data) {
  // POST /api/bookings is public
  const res = await fetch(ADMIN_API + '/api/bookings', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  });
  const b  = await res.json();
  const nb = _normalizeBooking(b);
  _bookingsCache.unshift(nb);
  return nb;
}
async function updateBookingStatusApi(mongoId, status) {
  const b   = await apiPut('/api/bookings/' + mongoId, { status });
  const idx = _bookingsCache.findIndex(x => String(x._id) === String(mongoId));
  if (idx >= 0) _bookingsCache[idx].status = status;
  return b;
}

// ── Utilities ─────────────────────────────────────────────────
function generateBookingId() {
  const ts  = Date.now().toString().slice(-6);
  const rnd = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BK${ts}${rnd}`;
}
function uid(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
function formatCurrency(n) {
  return `Nu. ${Number(n).toLocaleString()}`;
}
function formatDate(s) {
  if (!s) return '—';
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function todayStr() { return new Date().toISOString().split('T')[0]; }
function dateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// ── UI Helpers ────────────────────────────────────────────────
function renderStars(r) {
  return [1,2,3,4,5].map(i =>
    `<i class="fas fa-star" style="color:${i <= r ? '#F5C518' : '#333'};font-size:11px"></i>`
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
  const icons = { success:'check-circle', error:'times-circle', info:'info-circle', warning:'exclamation-circle' };
  t.innerHTML = `<i class="fas fa-${icons[type] || 'info-circle'}"></i><span>${msg}</span>`;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, 3200);
}

// ── Seat Map Builder ──────────────────────────────────────────
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
      const seatId   = `${rowLetter}${s}`;
      const isBooked = bookedSeats.includes(seatId);
      const isSel    = selectedSeats.includes(seatId);
      const cls      = isBooked ? 'booked' : isSel ? 'selected' : 'available';
      if (s === 6) html += `<div class="seat-gap"></div>`;
      html += `<button class="seat ${cls}" data-seat="${seatId}"${isBooked?' disabled':''} title="${seatId}">${s}</button>`;
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
