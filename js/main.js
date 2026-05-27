/* ================================================================
   DrukCinema — Main JavaScript
   Covers: navbar, hero slider, carousels, movie filters, seat map
   ================================================================ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   API CONFIGURATION
───────────────────────────────────────────────────────────── */
const API = 'https://drukcinema-api.onrender.com';

/* ─────────────────────────────────────────────────────────────
   HERO MOVIE DATA
───────────────────────────────────────────────────────────── */
const heroMovies = [
  {
    id: '6a15e1f722fc561369cf172f',
    title:       'Lunana: A Yak in the Classroom',
    genres:      ['Drama', 'Adventure'],
    rating:      8.4,
    duration:    '109 min',
    language:    'Dzongkha',
    description: 'A young teacher is sent to the most remote school in the world, nestled in the Himalayan mountains of Bhutan. Far from his dream of moving to Australia, he discovers the true meaning of life.',
    backdrop:    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=80',
    price:       150,
  },
  {
    id: '6a15e1f722fc561369cf1733',
    title:       "Dragon's Blessing",
    genres:      ['Action', 'Spiritual'],
    rating:      7.9,
    duration:    '118 min',
    language:    'Dzongkha',
    description: 'A young monk discovers an ancient scroll prophesying a dark force threatening Bhutan. He must journey across the kingdom to unite the five dzongs before the monsoon ends.',
    backdrop:    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&h=1080&fit=crop&q=80',
    price:       180,
  },
  {
    id: '6a15e1f722fc561369cf1735',
    title:       "Tiger's Nest",
    genres:      ['Thriller', 'Spiritual'],
    rating:      7.7,
    duration:    '112 min',
    language:    'Dzongkha',
    description: 'A detective investigates mysterious disappearances near Paro Taktsang. The case spirals into Bhutanese folklore, ancient secrets, and a conspiracy that reaches the highest peaks.',
    backdrop:    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&q=80',
    price:       150,
  },
  {
    id: '6a15e1f722fc561369cf1736',
    title:       'Gross National Happiness',
    genres:      ['Documentary', 'Drama'],
    rating:      8.1,
    duration:    '95 min',
    language:    'English/Dzongkha',
    description: "A documentary following five Bhutanese citizens over a year, exploring what true happiness means in the world's happiest nation.",
    backdrop:    'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1920&h=1080&fit=crop&q=80',
    price:       120,
  },
];

/* ─────────────────────────────────────────────────────────────
   MOVIE DATA (for booking page + search)
───────────────────────────────────────────────────────────── */
const MOVIE_DATA = {
  1: {
    title:    'Lunana: A Yak in the Classroom',
    poster:   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&q=80',
    rating:   8.4,
    duration: '109 min', language: 'Dzongkha', genres: ['Drama','Adventure'],
    trailer:  '3XDGcBxQFmE',
    desc:     'A young government-assigned teacher reluctantly travels to Lunana — the most remote school on earth, deep in the Himalayas. Without electricity or modern comforts, he discovers the profound meaning of purpose, community, and belonging.',
  },
  2: {
    title:    'Travellers & Magicians',
    poster:   'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=600&fit=crop&q=80',
    rating:   7.6,
    duration: '108 min', language: 'Dzongkha', genres: ['Fantasy','Drama'],
    trailer:  'OHFQ_QrBkZ0',
    desc:     'A young Bhutanese civil servant dreams of leaving for America. While hitchhiking to the airport he misses his ride and falls into a captivating story told by a monk — a magical tale of ambition, temptation, and the grass-is-greener illusion.',
  },
  3: {
    title:    'The Cup (Phörpa)',
    poster:   'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop&q=80',
    rating:   7.4,
    duration: '93 min', language: 'Tibetan', genres: ['Comedy','Drama'],
    trailer:  'QO0sXUxVG2Y',
    desc:     'Young Tibetan monks at a monastery in India are obsessed with watching the 1998 FIFA World Cup. Their hilarious attempts to secretly rent a television and satellite dish lead to warm-hearted comedy and wisdom about desire and detachment.',
  },
  4: {
    title:    'Hema Hema: Sing Me a Song While I Wait',
    poster:   'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=600&fit=crop&q=80',
    rating:   6.8,
    duration: '81 min', language: 'Dzongkha', genres: ['Mystery','Drama'],
    trailer:  '',
    desc:     'In a surreal forest ceremony held every 12 years, strangers wear animal masks and shed their identities. As the boundaries between reality and ritual dissolve, hidden desires and fears surface. A profound meditation on ego and transformation.',
  },
  5: {
    title:    "Dragon's Blessing",
    poster:   'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=600&fit=crop&q=80',
    rating:   7.9,
    duration: '118 min', language: 'Dzongkha', genres: ['Action','Spiritual'],
    trailer:  '',
    desc:     'A young warrior-monk uncovers an ancient prophecy foretelling destruction of the five sacred dzongs. Racing against a monsoon deadline, he must traverse Bhutan\'s highest passes, face rogue spirits, and unite rival kingdoms to save the land.',
  },
  6: {
    title:    'Paro: Valley of Love',
    poster:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop&q=80',
    rating:   7.2,
    duration: '102 min', language: 'Dzongkha', genres: ['Romance','Drama'],
    trailer:  '',
    desc:     'Two strangers from different walks of Bhutanese life meet during the Paro Tshechu festival. As rice paddy harvests and ancient dances weave their story together, they must choose between family tradition and a love that defies expectation.',
  },
  7: {
    title:    "Tiger's Nest",
    poster:   'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&q=80',
    rating:   7.7,
    duration: '112 min', language: 'Dzongkha', genres: ['Thriller','Spiritual'],
    trailer:  '',
    desc:     'A Thimphu detective investigates a series of mysterious disappearances near the sacred Paro Taktsang monastery. The case pulls him into a web of ancient folklore, hidden cults, and a conspiracy stretching from palace corridors to mountain caves.',
  },
  8: {
    title:    'Gross National Happiness',
    poster:   'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=600&fit=crop&q=80',
    rating:   8.1,
    duration: '95 min', language: 'English/Dzongkha', genres: ['Documentary','Drama'],
    trailer:  '',
    desc:     'Following five Bhutanese citizens across a full year — a farmer, a monk, a student, an entrepreneur, and an elderly grandmother — this documentary explores what "happiness" truly means in the world\'s only GNH-governed nation.',
  },
};

/* ── Movie data is now loaded from the API.
   MOVIE_DATA above remains as an offline fallback for the
   booking page and global search when the API is unreachable. ──── */

/* MongoDB ObjectId map — translates numeric 1-8 to real IDs for search links */
const MONGO_ID_MAP_SEARCH = {
  '1': '6a15e1f722fc561369cf172f',
  '2': '6a15e1f722fc561369cf1730',
  '3': '6a15e1f722fc561369cf1731',
  '4': '6a15e1f722fc561369cf1732',
  '5': '6a15e1f722fc561369cf1733',
  '6': '6a15e1f722fc561369cf1734',
  '7': '6a15e1f722fc561369cf1735',
  '8': '6a15e1f722fc561369cf1736',
};

/* All movies including coming soon — used by search */
const ALL_MOVIES_SEARCH = [
  ...Object.entries(MOVIE_DATA).map(([id, m]) => ({ id: MONGO_ID_MAP_SEARCH[id] || id, status: 'now', ...m })),
  { id:9,  title:'Wangchuck: The Dragon King', poster:'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=600&fit=crop&q=80', rating:0, status:'soon', release:'June 2026',    genres:['Historical','Epic'],      desc:'An epic retelling of the unification of modern Bhutan under the first Dragon King.' },
  { id:10, title:'Bhutan Calling',             poster:'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop&q=80', rating:0, status:'soon', release:'July 2026',    genres:['Comedy','Romance'],       desc:'A hilarious culture-clash comedy when a Bhutanese student returns from abroad.' },
  { id:11, title:'The Last Yak Herder',        poster:'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop&q=80', rating:0, status:'soon', release:'August 2026', genres:['Drama','Adventure'],      desc:'A dying tradition, a son\'s duty, and the vast Himalayan highlands.' },
  { id:12, title:'Thimphu Nights',             poster:'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=600&fit=crop&q=80', rating:0, status:'soon', release:'Sept 2026',  genres:['Crime','Thriller'],       desc:'A gripping noir set in the neon-lit streets of a rapidly modernising Thimphu.' },
  { id:13, title:'The Masked Dancer',          poster:'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=600&fit=crop&q=80', rating:0, status:'soon', release:'Oct 2026',   genres:['Cultural','Musical'],     desc:'A young cham dancer discovers forbidden moves that unlock ancestral power.' },
  { id:14, title:'Himalayan Sky',              poster:'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop&q=80', rating:0, status:'soon', release:'Nov 2026',   genres:['Sci-Fi','Adventure'],     desc:'Bhutan\'s first sci-fi epic — a solar anomaly threatens the Thunder Dragon kingdom.' },
];

/* ─────────────────────────────────────────────────────────────
   AUTH STATE — show profile dropdown if logged in
───────────────────────────────────────────────────────────── */
(function initNavAuth() {
  const user = JSON.parse(localStorage.getItem('drukcinema_user') || 'null');
  if (!user) return;

  /* Wait for DOM then swap buttons */
  function applyProfile() {
    const actions = document.querySelector('.navbar-actions');
    if (!actions) return;

    const loginBtn    = actions.querySelector('.nav-login-btn');
    const registerBtn = actions.querySelector('.nav-register-btn');
    if (!loginBtn) return;           // already replaced or not present

    const nameParts = (user.name || '').trim().split(/\s+/);
    const initials  = nameParts.map(p => p[0] || '').join('').toUpperCase().slice(0, 2) || '?';
    const firstName = nameParts[0] || 'Account';

    const wrap = document.createElement('div');
    wrap.className = 'nav-profile-wrap';
    wrap.innerHTML = `
      <button class="nav-profile-btn" id="navProfileBtn" aria-label="My account">
        <div class="nav-avatar">${initials}</div>
        <span>${firstName}</span>
        <i class="fas fa-chevron-down nav-chev"></i>
      </button>
      <div class="nav-profile-drop" id="navProfileDrop">
        <a href="profile.html" class="drop-item"><i class="fas fa-user"></i> My Profile</a>
        <a href="profile.html#bookings" class="drop-item"><i class="fas fa-ticket"></i> My Bookings</a>
        <a href="profile.html#edit" class="drop-item"><i class="fas fa-pen-to-square"></i> Edit Profile</a>
        <div class="drop-divider"></div>
        <button class="drop-item drop-signout" id="navSignOut">
          <i class="fas fa-arrow-right-from-bracket"></i> Sign Out
        </button>
      </div>`;

    loginBtn.remove();
    if (registerBtn) registerBtn.remove();
    const hamburger = actions.querySelector('.hamburger');
    actions.insertBefore(wrap, hamburger || null);

    /* Toggle dropdown */
    const btn  = document.getElementById('navProfileBtn');
    const drop = document.getElementById('navProfileDrop');
    const chev = btn.querySelector('.nav-chev');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      drop.classList.toggle('open');
      chev.classList.toggle('rotated');
    });
    document.addEventListener('click', function () {
      drop.classList.remove('open');
      chev.classList.remove('rotated');
    });

    /* Update mobile menu — hide Sign In / Register, show profile link + sign out */
    const mobileActions = document.querySelector('.mobile-menu-actions');
    if (mobileActions) {
      mobileActions.innerHTML = `
        <a href="profile.html" class="m-login"><i class="fas fa-user"></i> ${firstName}</a>
        <button class="m-register" id="mobileNavSignOut" style="cursor:pointer;">Sign Out</button>`;
      const mobileOut = document.getElementById('mobileNavSignOut');
      if (mobileOut) {
        mobileOut.addEventListener('click', function () {
          localStorage.removeItem('drukcinema_token');
          localStorage.removeItem('drukcinema_user');
          window.location.href = 'index.html';
        });
      }
    }

    /* Sign out */
    document.getElementById('navSignOut').addEventListener('click', function () {
      localStorage.removeItem('drukcinema_token');
      localStorage.removeItem('drukcinema_user');
      window.location.href = 'index.html';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyProfile);
  } else {
    applyProfile();
  }
})();

/* ─────────────────────────────────────────────────────────────
   NAVBAR — scroll effect + hamburger
───────────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 55);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();

/* ─────────────────────────────────────────────────────────────
   HERO SLIDER
───────────────────────────────────────────────────────────── */
(function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.indicator-dot');
  if (!slides.length) return;

  const els = {
    title:    document.getElementById('heroTitle'),
    rating:   document.getElementById('heroRating'),
    duration: document.getElementById('heroDuration'),
    lang:     document.getElementById('heroLanguage'),
    genres:   document.getElementById('heroGenres'),
    desc:     document.getElementById('heroDesc'),
    price:    document.getElementById('heroPrice'),
    count:    document.getElementById('indicatorCount'),
  };

  let cur = 0;
  let timer;

  function goTo(idx) {
    slides[cur].classList.remove('active');
    if (dots[cur]) dots[cur].classList.remove('active');
    cur = ((idx % heroMovies.length) + heroMovies.length) % heroMovies.length;
    slides[cur].classList.add('active');
    if (dots[cur]) dots[cur].classList.add('active');
    if (els.count) els.count.textContent = `${cur + 1} / ${heroMovies.length}`;

    const m = heroMovies[cur];
    if (els.title)    els.title.textContent    = m.title;
    if (els.rating)   els.rating.textContent   = m.rating;
    if (els.duration) els.duration.textContent = m.duration;
    if (els.lang)     els.lang.textContent     = m.language;
    if (els.desc)     els.desc.textContent     = m.description;
    if (els.price)    els.price.textContent    = m.price;
    if (els.genres) {
      els.genres.innerHTML = m.genres.map(g => `<span class="genre-tag">${g}</span>`).join('');
    }
    const bookBtn = document.querySelector('.hero-actions a.btn-primary');
    if (bookBtn) bookBtn.href = `booking.html?id=${m.id}`;
  }

  dots.forEach(d => {
    d.addEventListener('click', function () {
      goTo(parseInt(this.dataset.index, 10));
      clearInterval(timer);
      timer = setInterval(() => goTo(cur + 1), 6000);
    });
  });

  timer = setInterval(() => goTo(cur + 1), 6000);
})();

/* ─────────────────────────────────────────────────────────────
   CAROUSEL PREV / NEXT
───────────────────────────────────────────────────────────── */
(function initCarousels() {
  const bind = (prevId, nextId, trackId) => {
    const t = document.getElementById(trackId);
    if (!t) return;
    const prev = document.getElementById(prevId);
    const next = document.getElementById(nextId);
    if (prev) prev.addEventListener('click', () => t.scrollBy({ left: -250, behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => t.scrollBy({ left:  250, behavior: 'smooth' }));
  };
  bind('nowPrev', 'nowNext',   'nowShowingTrack');
  bind('soonPrev', 'soonNext', 'comingSoonTrack');
})();

/* ─────────────────────────────────────────────────────────────
   INDEX PAGE — fetch now_showing & coming_soon from API
   Populates #nowShowingTrack and #comingSoonTrack on index.html
───────────────────────────────────────────────────────────── */
(function initIndexCarousels() {
  const nowTrack  = document.getElementById('nowShowingTrack');
  const soonTrack = document.getElementById('comingSoonTrack');
  if (!nowTrack && !soonTrack) return;

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function buildNowCard(m) {
    const rating  = m.rating || 0;
    const genres  = Array.isArray(m.genres) ? m.genres : (m.genre || '').split('/').map(g => g.trim()).filter(Boolean);
    const tags    = genres.map(g => `<span class="genre-tag">${esc(g)}</span>`).join('');
    const poster  = m.posterUrl || m.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop';
    const price   = m.price || 150;
    const movieId = m._id || m.id;
    return `
      <div class="movie-card">
        <div class="movie-poster-wrap">
          <img src="${esc(poster)}" alt="${esc(m.title)}" loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop'">
          <div class="card-badges">
            <div class="rating-badge"><i class="fas fa-star"></i><span>${rating}</span></div>
          </div>
          <div class="movie-overlay">
            <div class="overlay-soon-date"><i class="fas fa-star"></i> <span>${rating} / 10</span></div>
            <a href="booking.html?id=${esc(movieId)}" class="overlay-btn overlay-btn-primary">
              <i class="fas fa-ticket"></i> Book Now
            </a>
            <button class="overlay-btn overlay-btn-secondary">
              <i class="fas fa-circle-info"></i> More Info
            </button>
          </div>
        </div>
        <div class="movie-info">
          <h3>${esc(m.title)}</h3>
          <div class="movie-genres">${tags}</div>
          <p class="movie-meta-line">${esc(m.duration || '')}${m.duration && m.language ? ' · ' : ''}${esc(m.language || '')}</p>
          <p class="movie-price">Nu. ${price}+</p>
        </div>
      </div>`;
  }

  function buildSoonCard(m) {
    const genres  = Array.isArray(m.genres) ? m.genres : (m.genre || '').split('/').map(g => g.trim()).filter(Boolean);
    const tags    = genres.map(g => `<span class="genre-tag">${esc(g)}</span>`).join('');
    const poster  = m.posterUrl || m.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop';
    const release = m.releaseDate || m.release || 'Coming Soon';
    return `
      <div class="movie-card">
        <div class="movie-poster-wrap">
          <img src="${esc(poster)}" alt="${esc(m.title)}" loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop'">
          <div class="card-badges">
            <span class="soon-badge">Soon</span>
          </div>
          <div class="movie-overlay">
            <div class="overlay-soon-date"><i class="fas fa-calendar"></i> <span>${esc(release)}</span></div>
            <button class="overlay-btn overlay-btn-notify">
              <i class="fas fa-bell"></i> Notify Me
            </button>
          </div>
        </div>
        <div class="movie-info">
          <h3>${esc(m.title)}</h3>
          <div class="movie-genres">${tags}</div>
          <p class="movie-release"><i class="fas fa-calendar-days"></i> ${esc(release)}</p>
        </div>
      </div>`;
  }

  function updateSectionCount(track, count) {
    const countEl = track.closest('.carousel-section')?.querySelector('.section-count');
    if (countEl) countEl.textContent = `${count} film${count !== 1 ? 's' : ''}`;
  }

  if (nowTrack) {
    fetch(`${API}/api/movies?status=now_showing`)
      .then(r => r.json())
      .then(data => {
        const movies = Array.isArray(data) ? data : (data.movies || []);
        if (!movies.length) return;
        nowTrack.innerHTML = movies.map(buildNowCard).join('');
        updateSectionCount(nowTrack, movies.length);
      })
      .catch(() => { /* Keep hardcoded fallback */ });
  }

  if (soonTrack) {
    fetch(`${API}/api/movies?status=coming_soon`)
      .then(r => r.json())
      .then(data => {
        const movies = Array.isArray(data) ? data : (data.movies || []);
        if (!movies.length) return;
        soonTrack.innerHTML = movies.map(buildSoonCard).join('');
        updateSectionCount(soonTrack, movies.length);
        /* Re-bind notify buttons after dynamic render */
        document.querySelectorAll('#comingSoonTrack .overlay-btn-notify').forEach(btn => {
          btn.dispatchEvent(new Event('drk:rebind'));
        });
      })
      .catch(() => { /* Keep hardcoded fallback */ });
  }
})();

/* ─────────────────────────────────────────────────────────────
   MOVIES PAGE — fetch from API, then filter / sort
───────────────────────────────────────────────────────────── */
(function initMoviesPage() {
  const grid = document.getElementById('moviesGrid');
  if (!grid) return;

  const filterBtns  = document.querySelectorAll('#filterBar .filter-btn');
  const catTabs     = document.querySelectorAll('.cat-tab');
  const searchInput = document.getElementById('searchInput');
  const sortSelect  = document.getElementById('sortSelect');
  const resultCount = document.getElementById('resultCount');
  const noResults   = document.getElementById('noResults');

  let activeGenre = 'all';
  let activeCat   = 'all';
  let searchTerm  = '';
  let sortMode    = 'default';

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function applyFilters() {
    const cards = Array.from(grid.querySelectorAll('.movie-card'));
    let visible = 0;

    cards.forEach(card => {
      const genre = (card.dataset.genre  || '').toLowerCase();
      const cat   = (card.dataset.cat    || '');
      const title = (card.dataset.title  || '').toLowerCase();

      const gOk = activeGenre === 'all' || genre.includes(activeGenre);
      const cOk = activeCat   === 'all' || cat === activeCat;
      const sOk = !searchTerm || title.includes(searchTerm);

      if (gOk && cOk && sOk) { card.classList.remove('hidden'); visible++; }
      else                    { card.classList.add('hidden'); }
    });

    if (resultCount) resultCount.textContent = visible;
    if (noResults)   noResults.style.display = visible === 0 ? 'block' : 'none';

    if (sortMode !== 'default') {
      const vis = cards.filter(c => !c.classList.contains('hidden'));
      vis.sort((a, b) => {
        if (sortMode === 'rating') return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
        if (sortMode === 'title')  return (a.dataset.title || '').localeCompare(b.dataset.title || '');
        if (sortMode === 'price')  return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
        return 0;
      });
      vis.forEach(c => grid.appendChild(c));
    }
  }

  filterBtns.forEach(btn => btn.addEventListener('click', function () {
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    activeGenre = this.dataset.genre;
    applyFilters();
  }));

  catTabs.forEach(tab => tab.addEventListener('click', function () {
    catTabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    activeCat = this.dataset.cat;
    applyFilters();
  }));

  if (searchInput) searchInput.addEventListener('input', function () {
    searchTerm = this.value.trim().toLowerCase();
    applyFilters();
  });

  if (sortSelect) sortSelect.addEventListener('change', function () {
    sortMode = this.value;
    applyFilters();
  });

  /* ── Build a movie card HTML string from an API movie object ── */
  function buildGridCard(m) {
    const isNow    = m.status === 'now_showing';
    const rating   = m.rating || 0;
    const genres   = Array.isArray(m.genres) ? m.genres
                     : (m.genre || '').split('/').map(g => g.trim()).filter(Boolean);
    const genreData = genres.map(g => g.toLowerCase()).join(' ') + ' bhutanese';
    const genreTags = genres.map(g => `<span class="genre-tag">${esc(g)}</span>`).join('');
    const poster   = m.posterUrl || m.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop';
    const price    = m.price || 150;
    const movieId  = m._id || m.id;
    const release  = m.releaseDate || m.release || 'Coming Soon';

    if (isNow) {
      return `<div class="movie-card"
          data-genre="${genreData}"
          data-cat="now"
          data-title="${esc(m.title.toLowerCase())}"
          data-rating="${rating}"
          data-price="${price}">
          <div class="movie-poster-wrap">
            <img src="${esc(poster)}" alt="${esc(m.title)}" loading="lazy"
              onerror="this.src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop'">
            <div class="card-badges">
              <div class="rating-badge"><i class="fas fa-star"></i><span>${rating}</span></div>
            </div>
            <div class="movie-overlay">
              <div class="overlay-soon-date"><i class="fas fa-star"></i> ${rating} / 10</div>
              <a href="booking.html?id=${esc(movieId)}" class="overlay-btn overlay-btn-primary">
                <i class="fas fa-ticket"></i> Book Now
              </a>
              <button class="overlay-btn overlay-btn-secondary">
                <i class="fas fa-circle-info"></i> More Info
              </button>
            </div>
          </div>
          <div class="movie-info">
            <h3>${esc(m.title)}</h3>
            <div class="movie-genres">${genreTags}</div>
            <p class="movie-meta-line">${esc(m.duration || '')}${m.duration && m.language ? ' · ' : ''}${esc(m.language || '')}</p>
            <p class="movie-price">Nu. ${price}+</p>
          </div>
        </div>`;
    } else {
      return `<div class="movie-card"
          data-genre="${genreData}"
          data-cat="soon"
          data-title="${esc(m.title.toLowerCase())}"
          data-rating="0"
          data-price="${price}">
          <div class="movie-poster-wrap">
            <img src="${esc(poster)}" alt="${esc(m.title)}" loading="lazy"
              onerror="this.src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop'">
            <div class="card-badges"><span class="soon-badge">Soon</span></div>
            <div class="movie-overlay">
              <div class="overlay-soon-date"><i class="fas fa-calendar"></i> ${esc(release)}</div>
              <button class="overlay-btn overlay-btn-notify"><i class="fas fa-bell"></i> Notify Me</button>
            </div>
          </div>
          <div class="movie-info">
            <h3>${esc(m.title)}</h3>
            <div class="movie-genres">${genreTags}</div>
            <p class="movie-release"><i class="fas fa-calendar-days"></i> ${esc(release)}</p>
          </div>
        </div>`;
    }
  }

  /* ── Fetch all movies from API; fall back to hardcoded cards ── */
  fetch(`${API}/api/movies`)
    .then(r => r.json())
    .then(data => {
      const movies = Array.isArray(data) ? data : (data.movies || []);
      if (!movies.length) { applyFilters(); return; }

      const nowShowing = movies.filter(m => m.status === 'now_showing');
      const comingSoon = movies.filter(m => m.status === 'coming_soon');

      let html = nowShowing.map(buildGridCard).join('');
      if (comingSoon.length) {
        html += `<div class="section-divider-row">
          <h3><i class="fas fa-hourglass-half"></i> Coming Soon</h3>
        </div>`;
        html += comingSoon.map(buildGridCard).join('');
      }
      grid.innerHTML = html;

      if (resultCount) resultCount.textContent = movies.length;
      applyFilters();
    })
    .catch(() => {
      /* API unavailable — keep hardcoded cards and apply filters */
      applyFilters();
    });
})();

/* ─────────────────────────────────────────────────────────────
   BOOKING PAGE — BookMyShow-style seat map
───────────────────────────────────────────────────────────── */
(function initBookingPage() {
  const seatGrid = document.getElementById('seatGrid');
  if (!seatGrid) return;

  /* ── Seat categories ──────────────────────────────────── */
  const CATEGORIES = [
    {
      id:       'recliner',
      name:     'RECLINER',
      subtext:  'Premium recliner seats with extra legroom',
      icon:     'fa-couch',
      rows:     ['A', 'B'],
      price:    500,
      cssClass: 'cat-recliner',
      dotColor: '#F5C518',
    },
    {
      id:       'execgold',
      name:     'EXECUTIVE GOLD',
      subtext:  'Best view — centre rows with extra comfort',
      icon:     'fa-star',
      rows:     ['C', 'D'],
      price:    300,
      cssClass: 'cat-execgold',
      dotColor: '#60a5fa',
    },
    {
      id:       'executive',
      name:     'EXECUTIVE',
      subtext:  'Standard executive seating',
      icon:     'fa-circle-dot',
      rows:     ['E', 'F', 'G'],
      price:    250,
      cssClass: 'cat-executive',
      dotColor: '#4ade80',
    },
    {
      id:       'classic',
      name:     'CLASSIC',
      subtext:  'Affordable standard seating',
      icon:     'fa-ticket',
      rows:     ['H', 'I', 'J'],
      price:    150,
      cssClass: 'cat-classic',
      dotColor: '#9ca3af',
    },
  ];

  /* ── Pre-booked seats ─────────────────────────────────── */
  const BOOKED = {
    A: [3, 4, 8],
    B: [1, 2, 6, 7],
    C: [5, 9],
    D: [2, 3, 8],
    E: [1, 4, 5, 6, 10],
    F: [7, 8],
    G: [2, 3, 9, 10],
    H: [4, 5],
    I: [1, 6, 7],
    J: [3, 8, 9],
  };

  const COLS     = 10;
  const MAX      = 8;
  const CONV_FEE = 30;

  /* ── State ────────────────────────────────────────────── */
  // selectedSeats: [{ id:'A1', price:500, cat:'recliner', catName:'RECLINER', dotColor:'#F5C518' }]
  let selectedSeats = [];

  /* ── Load movie from API (falls back to MOVIE_DATA) ─────── */
  (function loadMovie() {
    const rawId = new URLSearchParams(window.location.search).get('id') || '1';
    const set   = (sel, val, prop = 'textContent') => {
      const el = document.querySelector(sel);
      if (el) el[prop] = val;
    };

    /* ── Map legacy numeric IDs (1-8) to real MongoDB ObjectIds ──
       Links from hardcoded HTML still use ?id=1 etc.
       API-generated cards already use ?id=<24-char ObjectId>.       */
    const MONGO_ID_MAP = {
      '1': '6a15e1f722fc561369cf172f',   /* Lunana              */
      '2': '6a15e1f722fc561369cf1730',   /* Travellers          */
      '3': '6a15e1f722fc561369cf1731',   /* The Cup             */
      '4': '6a15e1f722fc561369cf1732',   /* Hema Hema           */
      '5': '6a15e1f722fc561369cf1733',   /* Dragon's Blessing   */
      '6': '6a15e1f722fc561369cf1734',   /* Paro: Valley        */
      '7': '6a15e1f722fc561369cf1735',   /* Tiger's Nest        */
      '8': '6a15e1f722fc561369cf1736',   /* Gross Nat. Happiness*/
    };

    /* 24-char hex = already a MongoDB ObjectId; otherwise map or pass through */
    const mongoId = (rawId.length === 24) ? rawId : (MONGO_ID_MAP[rawId] || rawId);

    /* Expose MongoDB ID globally so confirmBtn and admin-bridge can use it */
    window._drkMongoId = mongoId;

    function applyMovie(movie) {
      /* Store globally so confirmBtn handler can read it */
      window._drkMovie = movie;
      const poster = movie.posterUrl || movie.poster || '';
      set('#bookingTitle',  movie.title);
      set('#summaryTitle',  movie.title);
      set('#bookingRating', movie.rating || '');
      set('#bookingPoster', poster, 'src');
      set('#bookingPoster', movie.title, 'alt');
      set('#summaryPoster', poster, 'src');
      set('#summaryPoster', movie.title, 'alt');
    }

    fetch(`${API}/api/movies/${encodeURIComponent(mongoId)}`)
      .then(r => r.json())
      .then(data => applyMovie(data.movie || data))
      .catch(() => {
        /* Fallback to local static data */
        const m = MOVIE_DATA[rawId] || MOVIE_DATA[parseInt(rawId, 10)] || MOVIE_DATA[1];
        if (m) { m.posterUrl = m.posterUrl || m.poster; applyMovie(m); }
      });
  })();

  /* ── Build seat map ───────────────────────────────────── */
  function buildSeatMap() {
    seatGrid.innerHTML = '';

    /* Column number header */
    const headerEl = document.getElementById('seatNumHeader');
    if (headerEl) {
      let html = '<div class="seat-num-header"><div class="snh-spacer"></div><div class="snh-nums">';
      for (let c = 1; c <= COLS; c++) {
        if (c === 6) html += '<div class="snh-aisle"></div>';
        html += `<div class="snh-num">${c}</div>`;
      }
      html += '</div></div>';
      headerEl.innerHTML = html;
    }

    /* Category sections */
    CATEGORIES.forEach(cat => {
      const section = document.createElement('div');
      section.className = `seat-category ${cat.cssClass}`;

      /* Category header bar */
      const bar = document.createElement('div');
      bar.className = `cat-bar ${cat.id}`;
      bar.innerHTML = `
        <div class="cat-bar-left">
          <i class="fas ${cat.icon}"></i>
          <span>${cat.name}</span>
          <span style="font-size:10px;font-weight:400;opacity:0.65;">${cat.subtext}</span>
        </div>
        <div class="cat-bar-right">Nu. ${cat.price} / seat</div>
      `;
      section.appendChild(bar);

      /* Rows */
      cat.rows.forEach(rowLetter => {
        const rowEl = document.createElement('div');
        rowEl.className = 's-row';

        /* Left label */
        const lblL = document.createElement('div');
        lblL.className = 's-row-lbl';
        lblL.textContent = rowLetter;
        rowEl.appendChild(lblL);

        /* Seats container */
        const seatsWrap = document.createElement('div');
        seatsWrap.className = 's-seats';

        for (let col = 1; col <= COLS; col++) {
          /* Aisle after col 5 */
          if (col === 6) {
            const aisle = document.createElement('div');
            aisle.className = 's-aisle';
            seatsWrap.appendChild(aisle);
          }

          const seatId   = `${rowLetter}${col}`;
          const isBooked = BOOKED[rowLetter]?.includes(col);
          const btn      = document.createElement('button');
          btn.className  = `seat ${isBooked ? 'seat-b' : 'seat-a'}`;
          btn.dataset.id = seatId;
          btn.disabled   = isBooked;
          btn.title      = isBooked ? `${seatId} — Booked` : `${seatId} — ${cat.name} · Nu.${cat.price}`;
          btn.setAttribute('aria-label', `Seat ${seatId}${isBooked ? ', booked' : ''}`);
          btn.textContent = col; // seat number inside

          if (!isBooked) {
            btn.addEventListener('click', () => toggleSeat(btn, seatId, cat));
          }

          seatsWrap.appendChild(btn);
        }

        rowEl.appendChild(seatsWrap);

        /* Right label */
        const lblR = document.createElement('div');
        lblR.className = 's-row-lbl';
        lblR.textContent = rowLetter;
        rowEl.appendChild(lblR);

        section.appendChild(rowEl);
      });

      seatGrid.appendChild(section);
    });
  }

  /* ── Toggle seat ──────────────────────────────────────── */
  function toggleSeat(btn, seatId, cat) {
    const idx = selectedSeats.findIndex(s => s.id === seatId);

    if (idx > -1) {
      /* Deselect */
      selectedSeats.splice(idx, 1);
      btn.classList.remove('seat-s');
      btn.classList.add('seat-a');
      hideMaxWarn();
    } else {
      /* Select */
      if (selectedSeats.length >= MAX) {
        showMaxWarn();
        btn.animate([
          { transform: 'translateX(-4px)' },
          { transform: 'translateX(4px)' },
          { transform: 'translateX(-3px)' },
          { transform: 'translateX(3px)' },
          { transform: 'translateX(0)' },
        ], { duration: 300 });
        return;
      }
      selectedSeats.push({
        id:       seatId,
        price:    cat.price,
        cat:      cat.id,
        catName:  cat.name,
        dotColor: cat.dotColor,
      });
      btn.classList.remove('seat-a');
      btn.classList.add('seat-s');
      hideMaxWarn();
    }

    updateSummary();
  }

  /* ── Max warn ─────────────────────────────────────────── */
  function showMaxWarn() {
    const el = document.getElementById('maxWarn');
    if (el) el.classList.add('show');
  }
  function hideMaxWarn() {
    const el = document.getElementById('maxWarn');
    if (el) el.classList.remove('show');
  }

  /* ── Update summary panel ─────────────────────────────── */
  function updateSummary() {
    const count    = selectedSeats.length;
    const subtotal = selectedSeats.reduce((s, x) => s + x.price, 0);
    const conv     = count > 0 ? CONV_FEE : 0;
    const total    = subtotal + conv;

    /* Seat count badge */
    const badge = document.getElementById('seatCountBadge');
    if (badge) badge.textContent = `${count} / ${MAX} selected`;

    /* Seat tags */
    const tagsEl = document.getElementById('seatTagsDisplay');
    if (tagsEl) {
      if (count === 0) {
        tagsEl.innerHTML = '<span class="no-sel">No seats selected yet</span>';
      } else {
        const sorted = [...selectedSeats].sort((a, b) => {
          if (a.id[0] !== b.id[0]) return a.id[0].localeCompare(b.id[0]);
          return parseInt(a.id.slice(1)) - parseInt(b.id.slice(1));
        });
        tagsEl.innerHTML = sorted.map(s => `<span class="s-tag">${s.id}</span>`).join('');
      }
    }

    /* Category breakdown */
    const bdEl = document.getElementById('catBreakdown');
    if (bdEl) {
      if (count === 0) {
        bdEl.innerHTML = '<p class="brkdwn-empty">Select seats to see breakdown</p>';
      } else {
        /* Group by category */
        const groups = {};
        selectedSeats.forEach(s => {
          if (!groups[s.cat]) {
            groups[s.cat] = { name: s.catName, price: s.price, count: 0, color: s.dotColor };
          }
          groups[s.cat].count++;
        });

        bdEl.innerHTML = Object.values(groups).map(g => `
          <div class="brkdwn-row">
            <div class="brkdwn-left">
              <div class="brkdwn-dot" style="background:${g.color}"></div>
              <span>${g.count}× ${g.name}</span>
            </div>
            <div class="brkdwn-right">Nu. ${g.count * g.price}</div>
          </div>
        `).join('');
      }
    }

    /* Pricing totals */
    setText('subtotalEl', `Nu. ${subtotal}`);
    setText('convFeeEl',  `Nu. ${conv}`);
    setText('totalEl',    count > 0 ? `Nu. ${total}` : 'Nu. 0');

    /* Confirm button */
    const btn = document.getElementById('confirmBtn');
    if (btn) btn.disabled = count === 0;
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  /* ── Hall chips ──────────────────────────────────────── */
  document.querySelectorAll('#hallSelector .hall-chip').forEach(chip => {
    chip.addEventListener('click', function () {
      document.querySelectorAll('#hallSelector .hall-chip').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      const hallName = this.dataset.hall;
      const hallPill = document.getElementById('hallPill');
      if (hallPill) hallPill.textContent = `Thimphu City Cinema · ${hallName}`;
      const summaryHall = document.getElementById('summaryHall');
      if (summaryHall) summaryHall.textContent = `${hallName} · Digital · 2D`;
      /* Reset seats when hall changes */
      selectedSeats = [];
      buildSeatMap();
      updateSummary();
    });
  });

  /* ── Date chips — event delegation (works with dynamically generated chips) ── */
  const dateScrollerEl = document.getElementById('dateScroller');
  if (dateScrollerEl) {
    dateScrollerEl.addEventListener('click', function (e) {
      const chip = e.target.closest('.date-chip');
      if (!chip || chip.disabled) return;
      dateScrollerEl.querySelectorAll('.date-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      /* Reset seat selection on date change */
      selectedSeats = [];
      buildSeatMap();
      updateSummary();
    });
  }

  /* ── Time chips ───────────────────────────────────────── */
  document.querySelectorAll('#timeScroller .time-chip').forEach(chip => {
    chip.addEventListener('click', function () {
      document.querySelectorAll('#timeScroller .time-chip').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      const t = this.dataset.time;
      setText('headerTime', t);
      setText('summaryTime', t);
    });
  });

  /* ── Confirm booking → E-Ticket modal ────────────────── */
  const confirmBtn   = document.getElementById('confirmBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalReset   = document.getElementById('modalReset');
  const modalClose   = document.getElementById('modalClose');

  if (confirmBtn) {
    confirmBtn.addEventListener('click', function () {
      if (selectedSeats.length === 0) return;

      /* ── Auth gate: user must be logged in ────────────── */
      const drkToken = localStorage.getItem('drukcinema_token');
      const drkUser  = JSON.parse(localStorage.getItem('drukcinema_user') || 'null');

      if (!drkToken || !drkUser) {
        /* Save current booking state so user can return after login */
        const rawId = new URLSearchParams(window.location.search).get('id') || '1';
        sessionStorage.setItem('pendingBooking', JSON.stringify({
          returnUrl: window.location.href,
          movieId:   rawId,
          seats:     selectedSeats.map(s => s.id),
        }));
        /* Show auth-gate modal */
        const gate = document.getElementById('authGateOverlay');
        if (gate) { gate.classList.add('open'); document.body.style.overflow = 'hidden'; }
        return;
      }

      /* Disable button while processing */
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing…';

      const subtotal = selectedSeats.reduce((s, x) => s + x.price, 0);
      const conv     = Math.round(subtotal * 0.05);
      const total    = subtotal + conv;

      /* Gather show info */
      const rawMovieId     = new URLSearchParams(window.location.search).get('id') || '1';
      const movie          = window._drkMovie || MOVIE_DATA[rawMovieId] || MOVIE_DATA[parseInt(rawMovieId, 10)] || MOVIE_DATA[1] || {};
      const activeDateChip = document.querySelector('#dateScroller .date-chip.active');
      const activeTimeChip = document.querySelector('#timeScroller .time-chip.active');
      const activeHallChip = document.querySelector('#hallSelector .hall-chip.active');

      const dateYear = activeDateChip?.dataset?.year || new Date().getFullYear();
      const dateText = activeDateChip
        ? `${activeDateChip.querySelector('.dc-day').textContent}, ${activeDateChip.querySelector('.dc-num').textContent} ${activeDateChip.querySelector('.dc-mon').textContent} ${dateYear}`
        : 'Today';
      const timeText   = activeTimeChip ? activeTimeChip.dataset.time : '6:30 PM';
      const hallText   = activeHallChip ? activeHallChip.dataset.hall : 'Hall 1';
      const showtimeId = activeTimeChip?.dataset?.showtimeId || '';
      const isoDate    = activeDateChip?.dataset?.date || new Date().toISOString().split('T')[0];

      const sorted = [...selectedSeats].sort((a, b) =>
        a.id[0].localeCompare(b.id[0]) || parseInt(a.id.slice(1)) - parseInt(b.id.slice(1))
      );

      /* Populate e-ticket and show modal */
      function showTicket(ref) {
        const setT = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        const setH = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML  = val; };
        const setS = (id, val) => { const el = document.getElementById(id); if (el) el.src        = val; };

        setT('etMovieTitle', movie.title || '');
        setS('etPoster',     movie.posterUrl || movie.poster || '');
        setT('etLangTag',    movie.language || 'Dzongkha');
        setT('etDate',       dateText);
        setT('etTime',       timeText);
        setT('etHall',       hallText);
        setT('etRefCode',    ref);
        setT('etTotal',      `Nu. ${total}`);
        setH('etSeatChips',  sorted.map(s => `<span class="et-seat-chip">${s.id}</span>`).join(''));

        const qrBox = document.getElementById('etQrBox');
        if (qrBox) {
          qrBox.innerHTML = '';
          if (typeof QRCode !== 'undefined') {
            new QRCode(qrBox, {
              text: `DRUKCINEMA|${ref}|${sorted.map(s => s.id).join(',')}|${dateText}|${timeText}`,
              width: 110, height: 110,
              colorDark: '#000000', colorLight: '#ffffff',
              correctLevel: QRCode.CorrectLevel.M,
            });
          } else {
            qrBox.innerHTML = `<div style="width:110px;height:110px;background:#111;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;color:#555;text-align:center;padding:8px;">${ref}</div>`;
          }
        }

        if (modalOverlay) modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';

        /* Re-enable button */
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<i class="fas fa-lock"></i> Confirm &amp; Pay';
      }

      /* Show inline error below confirm button */
      function showBookingError(msg) {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<i class="fas fa-lock"></i> Confirm &amp; Pay';
        let errEl = document.getElementById('bookingErrorMsg');
        if (!errEl) {
          errEl = document.createElement('p');
          errEl.id = 'bookingErrorMsg';
          errEl.style.cssText = 'color:#f87171;font-size:12px;text-align:center;margin-top:10px;';
          confirmBtn.parentNode.appendChild(errEl);
        }
        errEl.textContent = msg;
        setTimeout(() => { if (errEl) errEl.textContent = ''; }, 6000);
      }

      /* ── POST booking to API ─────────────────────────── */
      const headers = { 'Content-Type': 'application/json' };
      if (drkToken) headers['Authorization'] = 'Bearer ' + drkToken;

      const payload = {
        customerName:    drkUser?.name  || 'Guest',
        phone:           drkUser?.phone || 'N/A',
        email:           drkUser?.email || 'N/A',
        movie:           window._drkMongoId || rawMovieId,
        showtimeId:      showtimeId,
        seats:           sorted.map(s => s.id),
        seatType:        selectedSeats[0]?.cat || 'classic',
        amount:          subtotal,
        convenienceFee:  conv,
        totalAmount:     total,
        type:            'online',
        status:          'confirmed',
      };

      console.log('[DrukCinema] POST /api/bookings payload:', payload);

      fetch(`${API}/api/bookings`, {
        method:  'POST',
        headers: headers,
        body:    JSON.stringify(payload),
      })
        .then(r => r.json().then(data => ({ ok: r.ok, status: r.status, data })))
        .then(({ ok, data }) => {
          console.log('[DrukCinema] booking response:', data);
          if (!ok) {
            showBookingError(data.error || 'Booking failed. Please try again.');
            return;
          }
          const ref = data.bookingId || data.id || ('DRK-' + Math.floor(100000 + Math.random() * 900000));
          showTicket(ref);
        })
        .catch(err => {
          console.error('[DrukCinema] booking error:', err);
          showBookingError('Could not connect to server. Please check your connection and try again.');
        });
    });
  }

  function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function resetBooking() {
    closeModal();
    selectedSeats = [];
    buildSeatMap();
    updateSummary();
  }

  if (modalReset) modalReset.addEventListener('click', resetBooking);
  if (modalClose) modalClose.addEventListener('click', () => {
    closeModal(); window.location.href = 'index.html';
  });
  const etCloseX = document.getElementById('etCloseX');
  if (etCloseX) etCloseX.addEventListener('click', closeModal);

  const etDownloadBtn = document.getElementById('etDownloadBtn');
  if (etDownloadBtn) etDownloadBtn.addEventListener('click', () => window.print());

  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });
  }

  /* ── Keyboard close ───────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('open')) closeModal();
  });

  /* ── Expose internals for admin-bridge.js ─────────────── */
  window._drk = {
    BOOKED:       BOOKED,
    buildSeatMap: buildSeatMap,
    selectedSeats:selectedSeats,
    updateSummary:updateSummary,
  };

  /* ── Init ─────────────────────────────────────────────── */
  buildSeatMap();
  updateSummary();
})();

/* ─────────────────────────────────────────────────────────────
   NEWSLETTER
───────────────────────────────────────────────────────────── */
(function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    const btn   = form.querySelector('.newsletter-submit');
    const input = form.querySelector('.newsletter-input');
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
      if (!input.value.trim() || !input.value.includes('@')) {
        input.style.borderColor = 'rgba(229,9,20,0.8)';
        input.focus();
        setTimeout(() => { input.style.borderColor = ''; }, 2000);
        return;
      }
      btn.textContent = 'Subscribed!';
      btn.style.background = '#16a34a';
      input.value = '';
      setTimeout(() => {
        btn.innerHTML = 'Subscribe <i class="fas fa-arrow-right"></i>';
        btn.style.background = '';
      }, 3000);
    });
  });
})();

/* ─────────────────────────────────────────────────────────────
   SMOOTH ANCHOR SCROLL
───────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ─────────────────────────────────────────────────────────────
   GLOBAL SEARCH OVERLAY
   Triggered by .nav-icon-btn (search icon) on any page
───────────────────────────────────────────────────────────── */
(function initGlobalSearch() {
  /* Inject overlay HTML once */
  const overlayHTML = `
    <div class="search-overlay" id="searchOverlay" role="dialog" aria-label="Search movies">
      <div class="so-wrap">
        <div class="so-input-row">
          <i class="fas fa-magnifying-glass"></i>
          <input class="so-input" id="soInput" type="search"
            placeholder="Search movies, directors, genres…" autocomplete="off" spellcheck="false">
          <button class="so-close-btn" id="soCloseBtn" aria-label="Close search">
            <i class="fas fa-times"></i> Esc
          </button>
        </div>
        <p class="so-hint" id="soHint">Start typing to search all movies</p>
        <div class="so-results" id="soResults"></div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', overlayHTML);

  const overlay   = document.getElementById('searchOverlay');
  const input     = document.getElementById('soInput');
  const results   = document.getElementById('soResults');
  const hint      = document.getElementById('soHint');
  const closeBtn  = document.getElementById('soCloseBtn');

  function openSearch() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input.focus(), 80);
    renderResults('');
  }
  function closeSearch() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    input.value = '';
    results.innerHTML = '';
  }

  /* Bind all search icon buttons */
  document.querySelectorAll('.nav-icon-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      openSearch();
    });
  });

  closeBtn.addEventListener('click', closeSearch);
  overlay.addEventListener('click', function (e) {
    if (e.target === this) closeSearch();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeSearch();
  });

  input.addEventListener('input', function () {
    renderResults(this.value.trim().toLowerCase());
  });

  function renderResults(q) {
    if (!q) {
      hint.style.display = 'block';
      results.innerHTML  = '';
      return;
    }
    hint.style.display = 'none';

    const matches = ALL_MOVIES_SEARCH.filter(m => {
      return m.title.toLowerCase().includes(q)
        || (m.genres || []).some(g => g.toLowerCase().includes(q))
        || (m.language || '').toLowerCase().includes(q);
    });

    if (!matches.length) {
      results.innerHTML = `<div class="so-no-results"><i class="fas fa-film" style="font-size:28px;margin-bottom:10px;display:block;"></i>No movies found for "<strong>${q}</strong>"</div>`;
      return;
    }

    results.innerHTML = matches.map(m => {
      const isNow  = m.status === 'now';
      const href   = isNow ? `booking.html?id=${m.id}` : 'movies.html';
      const rating = m.rating ? `<span class="so-result-rating">⭐ ${m.rating}</span>` : '';
      const status = isNow
        ? `<span class="so-result-status now">Now Showing</span>`
        : `<span class="so-result-status soon">${m.release || 'Coming Soon'}</span>`;
      return `
        <a href="${href}" class="so-result" onclick="document.getElementById('searchOverlay').classList.remove('open');document.body.style.overflow=''">
          <img class="so-result-poster" src="${m.poster}" alt="${m.title}" loading="lazy">
          <div class="so-result-info">
            <p class="so-result-title">${m.title}</p>
            <p class="so-result-meta">${(m.genres || []).join(' · ')} · ${m.language || ''}</p>
          </div>
          <div class="so-result-right">
            ${rating}
            ${status}
          </div>
        </a>`;
    }).join('');
  }
})();

/* ─────────────────────────────────────────────────────────────
   YOUTUBE TRAILER MODAL
   Works for hero "Watch Trailer" button + movie cards
───────────────────────────────────────────────────────────── */
(function initTrailerModal() {
  /* Inject modal HTML */
  const html = `
    <div class="trailer-modal" id="trailerModal">
      <div class="trailer-wrap">
        <div class="trailer-top">
          <span class="trailer-title" id="trailerTitle">Watch Trailer</span>
          <button class="trailer-close" id="trailerClose" aria-label="Close trailer">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="trailer-iframe-wrap" id="trailerIframeWrap">
          <div class="trailer-no-video" id="trailerNoVideo" style="display:none;">
            <i class="fas fa-film" style="font-size:32px;margin-bottom:12px;display:block;"></i>
            Trailer not available yet. Check back soon!
          </div>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);

  const modal      = document.getElementById('trailerModal');
  const closeBtn   = document.getElementById('trailerClose');
  const titleEl    = document.getElementById('trailerTitle');
  const iframeWrap = document.getElementById('trailerIframeWrap');
  const noVideoEl  = document.getElementById('trailerNoVideo');

  function openTrailer(ytId, movieTitle) {
    titleEl.textContent = (movieTitle || 'Watch Trailer') + ' — Trailer';
    iframeWrap.querySelectorAll('iframe').forEach(f => f.remove());

    if (ytId) {
      noVideoEl.style.display = 'none';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframeWrap.appendChild(iframe);
    } else {
      noVideoEl.style.display = 'block';
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeTrailer() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    iframeWrap.querySelectorAll('iframe').forEach(f => f.remove());
  }

  closeBtn.addEventListener('click', closeTrailer);
  modal.addEventListener('click', function (e) { if (e.target === this) closeTrailer(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeTrailer();
  });

  /* Hero "Watch Trailer" button */
  const heroTrailerBtn = document.querySelector('.hero-actions .btn-secondary');
  let currentHeroMovieId = 1;

  /* Update current hero ID when slider changes */
  const origGoTo = window.__heroGoTo;

  /* Bind hero trailer — we observe data-movie-id if it gets set, else read from heroMovies */
  if (heroTrailerBtn) {
    heroTrailerBtn.id = 'heroTrailerBtn';
    heroTrailerBtn.addEventListener('click', function () {
      /* Find current slide index */
      const slides = document.querySelectorAll('.hero-slide');
      let activeIdx = 0;
      slides.forEach((s, i) => { if (s.classList.contains('active')) activeIdx = i; });
      const m = heroMovies[activeIdx] || heroMovies[0];
      const data = MOVIE_DATA[m.id] || {};
      openTrailer(data.trailer || '', m.title);
    });
  }

  /* Movie card "More Info" / "Watch Trailer" buttons — delegate from body */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-trailer-id]');
    if (btn) {
      openTrailer(btn.dataset.trailerId, btn.dataset.trailerTitle || '');
    }
  });

  /* Expose openTrailer globally for inline calls */
  window.openTrailer = openTrailer;
})();

/* ─────────────────────────────────────────────────────────────
   NOTIFY ME — Coming Soon movies (localStorage)
───────────────────────────────────────────────────────────── */
(function initNotifyMe() {
  /* Load already-registered notifications */
  const notified = JSON.parse(localStorage.getItem('drkNotify') || '[]');

  function showToastGlobal(msg, type) {
    let t = document.getElementById('globalToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'globalToast';
      t.style.cssText = `
        position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(80px);
        background:#1a1a1a;border:1px solid rgba(74,222,128,0.3);border-radius:12px;
        padding:14px 22px;display:flex;align-items:center;gap:10px;font-size:14px;
        color:white;z-index:99999;box-shadow:0 8px 32px rgba(0,0,0,0.6);
        transition:transform 0.4s ease,opacity 0.4s ease;opacity:0;white-space:nowrap;
        font-family:Inter,sans-serif;`;
      document.body.appendChild(t);
    }
    const isErr = type === 'error';
    t.style.borderColor = isErr ? 'rgba(239,68,68,0.4)' : 'rgba(74,222,128,0.3)';
    t.innerHTML = `<i class="fas ${isErr ? 'fa-circle-xmark' : 'fa-circle-check'}"
      style="color:${isErr ? '#f87171' : '#4ade80'};font-size:18px;"></i> ${msg}`;
    t.style.transform  = 'translateX(-50%) translateY(0)';
    t.style.opacity    = '1';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => {
      t.style.transform = 'translateX(-50%) translateY(80px)';
      t.style.opacity   = '0';
    }, 3500);
  }

  function bindNotifyButtons() {
    document.querySelectorAll('.overlay-btn-notify').forEach(btn => {
      /* Get title from nearest movie-info > h3 */
      const card = btn.closest('.movie-card') || btn.closest('.carousel-item');
      const titleEl = card
        ? (card.querySelector('.movie-info h3') || card.querySelector('h3'))
        : null;
      const title = titleEl ? titleEl.textContent.trim() : 'this movie';

      /* Mark already-notified buttons */
      if (notified.includes(title)) {
        btn.innerHTML = '<i class="fas fa-bell-slash"></i> Notified ✓';
        btn.style.background = 'rgba(74,222,128,0.15)';
        btn.style.borderColor = 'rgba(74,222,128,0.3)';
        btn.style.color = '#4ade80';
        btn.disabled = true;
      }

      btn.addEventListener('click', function () {
        if (this.disabled) return;
        const user = JSON.parse(localStorage.getItem('drukcinema_user') || 'null');
        if (!user) {
          showToastGlobal('Sign in to get notified about new releases!', 'error');
          setTimeout(() => { window.location.href = 'signin.html'; }, 1600);
          return;
        }
        if (!notified.includes(title)) notified.push(title);
        localStorage.setItem('drkNotify', JSON.stringify(notified));
        this.innerHTML = '<i class="fas fa-bell-slash"></i> Notified ✓';
        this.style.background  = 'rgba(74,222,128,0.15)';
        this.style.borderColor = 'rgba(74,222,128,0.3)';
        this.style.color = '#4ade80';
        this.disabled = true;
        showToastGlobal(`🔔 You'll be notified when <strong>${title}</strong> releases!`);
      });
    });
  }

  /* Run now and after potential dynamic render */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindNotifyButtons);
  } else {
    bindNotifyButtons();
  }
})();

/* ─────────────────────────────────────────────────────────────
   DARK / LIGHT MODE TOGGLE — disabled (coming soon)
───────────────────────────────────────────────────────────── */
// Theme toggle is intentionally disabled; kept for future use.
// (function initThemeToggle() { ... })();
