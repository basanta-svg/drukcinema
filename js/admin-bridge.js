/*!
 * DrukCinema — Admin Bridge  (js/admin-bridge.js)
 * ─────────────────────────────────────────────────
 * Bridges the API to the public frontend.
 * Include AFTER main.js in: movies.html, booking.html
 *
 * What it does:
 *   movies.html  → now handled directly by main.js (initMoviesPage fetch)
 *   booking.html → loads showtimes from API for date/time chips
 *                  and wires seat-map booked seats from API data
 *
 * Admin CRUD operations (used by admin panel pages):
 *   GET    /api/movies          → list movies
 *   POST   /api/movies          → add movie
 *   PUT    /api/movies/:id      → edit movie
 *   DELETE /api/movies/:id      → delete movie
 *   GET    /api/bookings        → list all bookings
 *   POST   /api/bookings        → create booking (offline counter)
 *   GET    /api/showtimes       → list all showtimes
 *   POST   /api/showtimes       → add showtime
 */
(function () {
  'use strict';

  /* ── API base — inherit from main.js or define locally ──── */
  var BASE = (typeof API !== 'undefined') ? API : 'https://drukcinema-api.onrender.com';
  function _adminToken() { return localStorage.getItem('drk_admin_token') || ''; }
  function _authHdr()    { var t = _adminToken(); return t ? { 'Content-Type':'application/json','Authorization':'Bearer '+t } : { 'Content-Type':'application/json' }; }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function todayStr() { return new Date().toISOString().split('T')[0]; }

  var DAY_NAMES   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /* ══════════════════════════════════════════════════════════
     PUBLIC API HELPERS
     Exported on window.DrkApi for use by admin panel pages.
  ══════════════════════════════════════════════════════════ */
  window.DrkApi = {

    /* ── Movies ─────────────────────────────────────────── */
    getMovies: function () {
      return fetch(BASE + '/api/movies').then(function (r) { return r.json(); });
    },
    addMovie: function (payload) {
      return fetch(BASE + '/api/movies', {
        method: 'POST',
        headers: _authHdr(),
        body: JSON.stringify(payload),
      }).then(function (r) { return r.json(); });
    },
    updateMovie: function (id, payload) {
      return fetch(BASE + '/api/movies/' + encodeURIComponent(id), {
        method: 'PUT',
        headers: _authHdr(),
        body: JSON.stringify(payload),
      }).then(function (r) { return r.json(); });
    },
    deleteMovie: function (id) {
      return fetch(BASE + '/api/movies/' + encodeURIComponent(id), {
        method: 'DELETE',
        headers: _authHdr(),
      }).then(function (r) { return r.json(); });
    },

    /* ── Bookings ───────────────────────────────────────── */
    getBookings: function () {
      return fetch(BASE + '/api/bookings').then(function (r) { return r.json(); });
    },
    addBooking: function (payload) {
      return fetch(BASE + '/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(function (r) { return r.json(); });
    },

    /* ── Showtimes ──────────────────────────────────────── */
    getShowtimes: function (movieId) {
      var url = BASE + '/api/showtimes';
      if (movieId) url += '?movieId=' + encodeURIComponent(movieId);
      return fetch(url).then(function (r) { return r.json(); });
    },
    addShowtime: function (payload) {
      return fetch(BASE + '/api/showtimes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(function (r) { return r.json(); });
    },
  };

  /* ══════════════════════════════════════════════════════════
     MOVIES PAGE
     main.js initMoviesPage() already fetches from API directly,
     so nothing extra is needed here.
  ══════════════════════════════════════════════════════════ */
  function bridgeMoviesPage() {
    /* intentional no-op — handled by main.js */
  }

  /* ══════════════════════════════════════════════════════════
     BOOKING PAGE — load showtimes from API → date/time chips
  ══════════════════════════════════════════════════════════ */
  function bridgeBookingPage() {
    var dateScroller = document.getElementById('dateScroller');
    if (!dateScroller) return;

    var movieId = new URLSearchParams(window.location.search).get('id') || '';
    if (!movieId) return;

    fetch(BASE + '/api/showtimes?movieId=' + encodeURIComponent(movieId))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var showtimes = Array.isArray(data) ? data : (data.showtimes || []);
        showtimes = showtimes
          .filter(function (s) { return s.date >= todayStr(); })
          .sort(function (a, b) {
            var d = a.date.localeCompare(b.date);
            return d !== 0 ? d : a.time.localeCompare(b.time);
          });

        /* No API showtimes — let the inline date fallback script run */
        if (!showtimes.length) return;

        window._drkBridge = { showtimes: showtimes };

        /* ── Build unique date list ────────────────────── */
        var uniqueDates = [];
        showtimes.forEach(function (s) {
          if (uniqueDates.indexOf(s.date) === -1) uniqueDates.push(s.date);
        });

        dateScroller.innerHTML = uniqueDates.map(function (date, i) {
          var d = new Date(date + 'T00:00:00');
          return '<button class="date-chip' + (i === 0 ? ' active' : '') +
            '" data-date="' + date + '"' +
            ' data-year="' + d.getFullYear() + '"' +
            ' data-full-date="' + DAY_NAMES[d.getDay()] + ', ' + d.getDate() + ' ' +
              MONTH_NAMES[d.getMonth()] + ' ' + d.getFullYear() + '">' +
            '<span class="dc-day">' + DAY_NAMES[d.getDay()] + '</span>' +
            '<span class="dc-num">' + d.getDate() + '</span>' +
            '<span class="dc-mon">' + MONTH_NAMES[d.getMonth()] + '</span>' +
            '</button>';
        }).join('');

        /* Sync header date display */
        function syncHeaderDate(chip) {
          var hd = document.getElementById('headerDate');
          var sd = document.getElementById('summaryDate');
          var fd = chip.dataset.fullDate || chip.dataset.date;
          if (hd) hd.textContent = fd;
          if (sd) sd.textContent = fd;
        }

        var firstChip = dateScroller.querySelector('.date-chip.active');
        if (firstChip) syncHeaderDate(firstChip);

        dateScroller.querySelectorAll('.date-chip').forEach(function (chip) {
          chip.addEventListener('click', function () {
            dateScroller.querySelectorAll('.date-chip').forEach(function (c) { c.classList.remove('active'); });
            chip.classList.add('active');
            syncHeaderDate(chip);
            renderTimeChips(chip.dataset.date);
          });
        });

        renderTimeChips(uniqueDates[0]);
      })
      .catch(function () {
        /* API unavailable — let inline fallback generate date chips */
      });
  }

  /* ── Build time chips for a given date ────────────────── */
  function renderTimeChips(date) {
    var timeScroller = document.getElementById('timeScroller');
    if (!timeScroller || !window._drkBridge) return;

    var dayShowtimes = window._drkBridge.showtimes.filter(function (s) { return s.date === date; });
    if (!dayShowtimes.length) { timeScroller.innerHTML = ''; return; }

    timeScroller.innerHTML = dayShowtimes.map(function (s, i) {
      var booked   = (s.bookedSeats || []).length;
      var total    = s.totalSeats || 80;
      var avail    = total - booked;
      var isFull   = avail <= 0;
      var isLow    = !isFull && avail <= 10;
      var dotColor = isFull ? 'var(--accent)' : isLow ? '#F5C518' : '#4ade80';

      var parts = (s.time || '00:00').split(':');
      var h     = parseInt(parts[0], 10);
      var min   = parts[1] || '00';
      var ampm  = h >= 12 ? 'PM' : 'AM';
      var h12   = h > 12 ? h - 12 : h === 0 ? 12 : h;
      var tDisp = h12 + ':' + min + ' ' + ampm;

      var sid = esc(s._id || s.id || '');
      return '<button class="time-chip' + (i === 0 ? ' active' : '') + (isFull ? ' full' : '') + '"' +
        ' data-showtime-id="' + sid + '"' +
        ' data-time="' + tDisp + '"' +
        (isFull ? ' disabled' : '') + '>' +
        '<span class="avail-dot" style="background:' + dotColor + '"></span>' +
        tDisp +
        (isLow  ? ' <span style="font-size:9px;color:#F5C518;font-weight:700"> FAST FILLING</span>' : '') +
        (isFull ? ' <span style="font-size:9px;color:var(--accent);font-weight:700"> SOLD OUT</span>' : '') +
        ' <span style="font-size:9px;color:var(--text-muted)">· Hall ' + esc(s.hall) + '</span>' +
        '</button>';
    }).join('');

    timeScroller.querySelectorAll('.time-chip').forEach(function (chip) {
      if (chip.disabled) return;
      chip.addEventListener('click', function () {
        timeScroller.querySelectorAll('.time-chip').forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        var ht = document.getElementById('headerTime');
        var st = document.getElementById('summaryTime');
        if (ht) ht.textContent = chip.dataset.time;
        if (st) st.textContent = chip.dataset.time;
        var showtime = window._drkBridge.showtimes.find(function (s) {
          return (s._id || s.id) === chip.dataset.showtimeId;
        });
        if (showtime) applyShowtimeToSeatMap(showtime);
      });
    });

    /* Auto-apply first available showtime to seat map */
    var first = dayShowtimes.find(function (s) {
      return ((s.totalSeats || 80) - (s.bookedSeats || []).length) > 0;
    }) || dayShowtimes[0];

    if (first) {
      applyShowtimeToSeatMap(first);
      var p2   = (first.time || '00:00').split(':');
      var h2   = parseInt(p2[0], 10);
      var a2   = h2 >= 12 ? 'PM' : 'AM';
      var h12b = h2 > 12 ? h2 - 12 : h2 === 0 ? 12 : h2;
      var td2  = h12b + ':' + (p2[1] || '00') + ' ' + a2;
      var ht2  = document.getElementById('headerTime');
      var sm2  = document.getElementById('summaryTime');
      if (ht2) ht2.textContent = td2;
      if (sm2) sm2.textContent = td2;
    }
  }

  /* ── Apply showtime booked seats to the seat map ────────── */
  function applyShowtimeToSeatMap(showtime) {
    var bookedSeats = showtime.bookedSeats || [];
    var drk = window._drk; /* exposed by main.js initBookingPage */

    if (drk && drk.BOOKED && drk.buildSeatMap) {
      var B = drk.BOOKED;
      Object.keys(B).forEach(function (row) { B[row] = []; });
      bookedSeats.forEach(function (seatId) {
        var row = seatId[0];
        var col = parseInt(seatId.slice(1), 10);
        if (!B[row]) B[row] = [];
        if (B[row].indexOf(col) === -1) B[row].push(col);
      });
      if (drk.selectedSeats) drk.selectedSeats.length = 0;
      drk.buildSeatMap();
      if (drk.updateSummary) drk.updateSummary();
    } else {
      /* Fallback: mark booked seats directly in DOM */
      document.querySelectorAll('#seatGrid .seat').forEach(function (btn) {
        var seatId = btn.dataset.id || btn.dataset.seat;
        if (!seatId) return;
        if (bookedSeats.indexOf(seatId) !== -1) {
          btn.classList.remove('seat-a', 'seat-s');
          btn.classList.add('seat-b');
          btn.disabled = true;
        }
      });
    }
  }

  /* ══════════════════════════════════════════════════════════
     BOOT — run after DOM + main.js
  ══════════════════════════════════════════════════════════ */
  function run() {
    bridgeMoviesPage();
    bridgeBookingPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

})();
