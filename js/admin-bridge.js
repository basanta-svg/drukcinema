/*!
 * DrukCinema — Admin Bridge  (js/admin-bridge.js)
 * ─────────────────────────────────────────────────
 * Connects admin-panel localStorage data to the public frontend.
 * Include AFTER main.js in: movies.html, booking.html
 *
 * What it does:
 *   movies.html  → replaces the hard-coded grid with admin-managed movies
 *   booking.html → swaps date/time chips for admin showtimes and syncs the seat map
 */
(function () {
  'use strict';

  /* ── Keys (must match admin.js) ───────────────────────── */
  var SK = { movies: 'drk_admin_movies', showtimes: 'drk_admin_showtimes' };

  function getAdminMovies()    { return JSON.parse(localStorage.getItem(SK.movies)    || '[]'); }
  function getAdminShowtimes() { return JSON.parse(localStorage.getItem(SK.showtimes) || '[]'); }
  function todayStr()          { return new Date().toISOString().split('T')[0]; }

  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ══════════════════════════════════════════════════════════
     MOVIES PAGE — dynamic grid
     Runs when moviesGrid is present in the DOM.
     If admin has movies saved, replaces the hard-coded cards.
  ══════════════════════════════════════════════════════════ */
  function bridgeMoviesPage() {
    var grid = document.getElementById('moviesGrid');
    if (!grid) return;

    var adminMovies = getAdminMovies();
    if (!adminMovies || adminMovies.length === 0) return; // Keep hard-coded cards

    /* Clear existing cards */
    grid.innerHTML = '';

    var nowShowing = adminMovies.filter(function(m) { return m.status === 'now_showing'; });
    var comingSoon = adminMovies.filter(function(m) { return m.status === 'coming_soon'; });

    /* Render now-showing */
    nowShowing.forEach(function(m) { grid.appendChild(buildMovieCard(m, 'now')); });

    /* Section divider before coming-soon */
    if (comingSoon.length > 0) {
      var divider = document.createElement('div');
      divider.className = 'section-divider-row';
      divider.innerHTML = '<h3><i class="fas fa-hourglass-half"></i> Coming Soon</h3>';
      grid.appendChild(divider);
      comingSoon.forEach(function(m) { grid.appendChild(buildMovieCard(m, 'soon')); });
    }

    /* Update visible count */
    var countEl = document.getElementById('resultCount');
    if (countEl) countEl.textContent = adminMovies.length;
  }

  function buildMovieCard(m, cat) {
    var isNow       = cat === 'now';
    var ratingOut10 = ((m.rating || 0) * 2).toFixed(1);
    var genreArr    = (m.genre || '').split('/').map(function(g) { return g.trim(); }).filter(Boolean);
    var genreData   = genreArr.map(function(g) { return g.toLowerCase(); }).join(' ') + ' bhutanese';
    var genreTags   = genreArr.map(function(g) { return '<span class="genre-tag">' + esc(g) + '</span>'; }).join('');
    var poster      = m.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop';
    var safeDesc    = (m.description || '').replace(/'/g, '&#39;').replace(/"/g, '&quot;');

    var card = document.createElement('div');
    card.className       = 'movie-card';
    card.dataset.genre   = genreData;
    card.dataset.cat     = cat;
    card.dataset.title   = m.title.toLowerCase();
    card.dataset.rating  = ratingOut10;
    card.dataset.price   = '150';
    card.dataset.adminId = m.id;

    card.innerHTML =
      '<div class="movie-poster-wrap">' +
        '<img src="' + esc(poster) + '" alt="' + esc(m.title) + '" loading="lazy"' +
          ' onerror="this.src=\'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop\'">' +
        '<div class="card-badges">' +
          '<div class="rating-badge"><i class="fas fa-star"></i><span>' + ratingOut10 + '</span></div>' +
          (!isNow ? '<div style="position:absolute;bottom:8px;left:8px;background:rgba(245,197,24,0.88);color:#000;font-size:9px;font-weight:800;padding:3px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px">Soon</div>' : '') +
        '</div>' +
        '<div class="movie-overlay">' +
          '<div class="overlay-soon-date"><i class="fas fa-star"></i> ' + ratingOut10 + ' / 10</div>' +
          (isNow
            ? '<a href="booking.html?id=' + esc(m.id) + '" class="overlay-btn overlay-btn-primary"><i class="fas fa-ticket"></i> Book Now</a>'
            : '<button class="overlay-btn overlay-btn-primary" style="opacity:0.5;cursor:not-allowed" disabled><i class="fas fa-hourglass-half"></i> Coming Soon</button>'
          ) +
          '<button class="overlay-btn overlay-btn-secondary" onclick="alert(\'' + safeDesc + '\')"><i class="fas fa-circle-info"></i> More Info</button>' +
        '</div>' +
      '</div>' +
      '<div class="movie-info">' +
        '<h3>' + esc(m.title) + '</h3>' +
        '<div class="movie-genres">' + genreTags + '</div>' +
        '<p class="movie-meta-line">' + esc(m.duration || '') + (m.duration && m.year ? ' · ' : '') + (m.year || '') + '</p>' +
        '<p class="movie-price">Nu. 150+</p>' +
      '</div>';

    return card;
  }

  /* ══════════════════════════════════════════════════════════
     BOOKING PAGE — admin showtimes for date/time chips
     Runs when dateScroller is present in the DOM.
  ══════════════════════════════════════════════════════════ */
  var DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function bridgeBookingPage() {
    var dateScroller = document.getElementById('dateScroller');
    if (!dateScroller) return;

    var urlId       = new URLSearchParams(window.location.search).get('id') || '';
    var adminMovies = getAdminMovies();
    var adminMovie  = adminMovies.find(function(m) {
      return m.id === urlId || String(m.id) === urlId;
    });
    if (!adminMovie) return; /* Not an admin movie — let main.js handle it */

    /* ── Get showtimes for this movie ─────────────────────── */
    var showtimes = getAdminShowtimes()
      .filter(function(s) { return s.movieId === adminMovie.id && s.date >= todayStr(); })
      .sort(function(a, b) {
        var d = a.date.localeCompare(b.date);
        return d !== 0 ? d : a.time.localeCompare(b.time);
      });

    if (showtimes.length === 0) {
      dateScroller.innerHTML =
        '<p style="color:var(--text-muted);font-size:13px;padding:8px 0">' +
        '<i class="fas fa-calendar-xmark" style="color:var(--accent);margin-right:6px"></i>' +
        'No upcoming showtimes scheduled for this movie. Please check back soon.</p>';
      var ts = document.getElementById('timeScroller');
      if (ts) ts.innerHTML = '';
      return;
    }

    /* Store for handlers */
    window._drkBridge = { showtimes: showtimes };

    /* ── Build date chips ─────────────────────────────────── */
    var uniqueDates = [];
    showtimes.forEach(function(s) {
      if (uniqueDates.indexOf(s.date) === -1) uniqueDates.push(s.date);
    });

    dateScroller.innerHTML = uniqueDates.map(function(date, i) {
      var d = new Date(date + 'T00:00:00');
      return '<button class="date-chip' + (i === 0 ? ' active' : '') + '" data-date="' + date + '">' +
        '<span class="dc-day">' + DAY_NAMES[d.getDay()] + '</span>' +
        '<span class="dc-num">' + d.getDate() + '</span>' +
        '<span class="dc-mon">' + MONTH_NAMES[d.getMonth()] + '</span>' +
        '</button>';
    }).join('');

    dateScroller.querySelectorAll('.date-chip').forEach(function(chip) {
      chip.addEventListener('click', function() {
        dateScroller.querySelectorAll('.date-chip').forEach(function(c) { c.classList.remove('active'); });
        chip.classList.add('active');
        renderTimeChips(chip.dataset.date);
      });
    });

    /* Render first date's time chips */
    renderTimeChips(uniqueDates[0]);
  }

  function renderTimeChips(date) {
    var timeScroller = document.getElementById('timeScroller');
    if (!timeScroller || !window._drkBridge) return;

    var dayShowtimes = window._drkBridge.showtimes.filter(function(s) { return s.date === date; });

    timeScroller.innerHTML = dayShowtimes.map(function(s, i) {
      var booked   = (s.bookedSeats || []).length;
      var avail    = s.totalSeats - booked;
      var isFull   = avail === 0;
      var isLow    = !isFull && avail <= 10;
      var dotColor = isFull ? 'var(--accent)' : isLow ? '#F5C518' : '#4ade80';

      /* 24h → 12h */
      var parts = s.time.split(':');
      var h     = parseInt(parts[0], 10);
      var min   = parts[1];
      var ampm  = h >= 12 ? 'PM' : 'AM';
      var h12   = h > 12 ? h - 12 : h === 0 ? 12 : h;
      var tDisp = h12 + ':' + min + ' ' + ampm;

      return '<button class="time-chip' + (i === 0 ? ' active' : '') + (isFull ? ' full' : '') + '"' +
        ' data-showtime-id="' + s.id + '"' +
        ' data-time="' + tDisp + '"' +
        (isFull ? ' disabled' : '') + '>' +
        '<span class="avail-dot" style="background:' + dotColor + '"></span>' +
        tDisp +
        (isLow  ? ' <span style="font-size:9px;color:#F5C518;font-weight:700"> FAST FILLING</span>' : '') +
        (isFull ? ' <span style="font-size:9px;color:var(--accent);font-weight:700"> SOLD OUT</span>' : '') +
        ' <span style="font-size:9px;color:var(--text-muted)">· Hall ' + s.hall + '</span>' +
        '</button>';
    }).join('');

    timeScroller.querySelectorAll('.time-chip').forEach(function(chip) {
      if (chip.disabled) return;
      chip.addEventListener('click', function() {
        timeScroller.querySelectorAll('.time-chip').forEach(function(c) { c.classList.remove('active'); });
        chip.classList.add('active');
        /* Update header time display if present */
        var ht = document.getElementById('headerTime');
        var st = document.getElementById('summaryTime');
        if (ht) ht.textContent = chip.dataset.time;
        if (st) st.textContent = chip.dataset.time;
        /* Apply showtime's booked seats to seat map */
        var showtime = window._drkBridge.showtimes.find(function(s) { return s.id === chip.dataset.showtimeId; });
        if (showtime) applyAdminShowtime(showtime);
      });
    });

    /* Auto-apply first available showtime */
    var first = dayShowtimes.find(function(s) {
      return (s.totalSeats - (s.bookedSeats || []).length) > 0;
    }) || dayShowtimes[0];
    if (first) {
      applyAdminShowtime(first);
      /* Update header time */
      var parts2 = first.time.split(':');
      var h2     = parseInt(parts2[0], 10);
      var ampm2  = h2 >= 12 ? 'PM' : 'AM';
      var h122   = h2 > 12 ? h2 - 12 : h2 === 0 ? 12 : h2;
      var tDisp2 = h122 + ':' + parts2[1] + ' ' + ampm2;
      var ht = document.getElementById('headerTime');
      var sm = document.getElementById('summaryTime');
      if (ht) ht.textContent = tDisp2;
      if (sm) sm.textContent = tDisp2;
    }
  }

  function applyAdminShowtime(showtime) {
    var bookedSeats = showtime.bookedSeats || [];
    var drk = window._drk; /* Exposed by main.js */

    if (drk && drk.BOOKED && drk.buildSeatMap) {
      /* Clear existing BOOKED and refill with admin data */
      var B = drk.BOOKED;
      Object.keys(B).forEach(function(row) { B[row] = []; });
      bookedSeats.forEach(function(seatId) {
        var row = seatId[0];
        var col = parseInt(seatId.slice(1), 10);
        if (!B[row]) B[row] = [];
        if (B[row].indexOf(col) === -1) B[row].push(col);
      });
      /* Clear current selection */
      if (drk.selectedSeats) drk.selectedSeats.length = 0;
      /* Rebuild map */
      drk.buildSeatMap();
      if (drk.updateSummary) drk.updateSummary();
    } else {
      /* Fallback: update DOM classes directly */
      document.querySelectorAll('#seatGrid .seat').forEach(function(btn) {
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
     BOOT — run after DOM + main.js are ready
  ══════════════════════════════════════════════════════════ */
  function run() {
    bridgeMoviesPage();
    bridgeBookingPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    /* main.js already ran synchronously — bridge runs right after */
    run();
  }

})();
