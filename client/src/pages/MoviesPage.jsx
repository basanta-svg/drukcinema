import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, Ticket, SlidersHorizontal, X, ChevronRight } from 'lucide-react';
import { nowShowingMovies, comingSoonMovies } from '../data/movies';

const allMovies  = [...nowShowingMovies, ...comingSoonMovies];
const allGenres  = [...new Set(allMovies.flatMap(m => m.genre))].sort();

/* ── Big movie card ───────────────────────────────── */
const MovieCard = ({ movie, isComingSoon }) => {
  const [hover, setHover] = useState(false);
  return (
    <Link to={`/movie/${movie.id}`}
      className="group relative block bg-[#181818] rounded-xl overflow-hidden border border-white/5 hover:border-[#E50914]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster} alt={movie.title} loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={e => { e.target.style.display = 'none'; }}
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/20 to-transparent" />

        {/* Hover CTA overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hover ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center gap-2">
            {isComingSoon
              ? <span className="text-white text-xs font-semibold">View Details</span>
              : <><Ticket size={13} className="text-[#E50914]" /><span className="text-white text-xs font-semibold">Book Tickets</span></>
            }
          </div>
        </div>

        {/* Top left badge */}
        <div className="absolute top-2.5 left-2.5">
          {isComingSoon
            ? <span className="coming-soon-badge text-[9px]">SOON</span>
            : <span className="text-[9px] bg-black/70 text-gray-300 border border-white/15 px-1.5 py-0.5 rounded font-medium backdrop-blur-sm">{movie.certificate}</span>
          }
        </div>

        {/* Top right rating */}
        {!isComingSoon && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span className="text-white text-[11px] font-bold">{movie.rating}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3 className="text-white font-semibold text-[13px] leading-tight mb-2 line-clamp-1 group-hover:text-[#E50914] transition-colors">
          {movie.title}
        </h3>
        <div className="flex flex-wrap gap-1 mb-2.5">
          {movie.genre.slice(0, 2).map(g => <span key={g} className="genre-tag">{g}</span>)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-[11px] flex items-center gap-1">
            <Clock size={10} />
            {isComingSoon ? movie.releaseMonth : movie.duration}
          </span>
          {!isComingSoon && (
            <span className="text-[#E50914] text-[11px] font-bold">Nu. {movie.price?.regular}+</span>
          )}
        </div>
      </div>
    </Link>
  );
};

/* ── Page ─────────────────────────────────────────── */
const MoviesPage = () => {
  const [tab,    setTab]    = useState('all');
  const [genre,  setGenre]  = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = tab === 'now_showing'  ? nowShowingMovies
             : tab === 'coming_soon' ? comingSoonMovies
             : allMovies;
    if (genre)  list = list.filter(m => m.genre.includes(genre));
    if (search) list = list.filter(m => m.title.toLowerCase().includes(search.toLowerCase())
                                     || m.genre.some(g => g.toLowerCase().includes(search.toLowerCase())));
    return list;
  }, [tab, genre, search]);

  const hasFilters = genre || search;
  const clear = () => { setGenre(''); setSearch(''); };

  return (
    <div className="min-h-screen bg-[#141414] pt-16">

      {/* ── Hero bar ──────────────────────────────── */}
      <div className="bg-[#111] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[#E50914] text-xs font-bold tracking-[3px] uppercase mb-2">Browse</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-black text-white">All Movies</h1>
            <p className="text-gray-500 text-sm">{filtered.length} film{filtered.length !== 1 ? 's' : ''} found</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Filter bar ────────────────────────────── */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Row 1: Status tabs + Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Status tabs */}
            <div className="flex bg-[#1a1a1a] border border-white/6 rounded-xl p-1 gap-0.5">
              {[
                { key: 'all',          label: 'All' },
                { key: 'now_showing',  label: 'Now Showing' },
                { key: 'coming_soon',  label: 'Coming Soon' },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setTab(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    tab === key ? 'bg-[#E50914] text-white shadow' : 'text-gray-500 hover:text-white'
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search movies, genres…"
                className="w-full bg-[#1a1a1a] border border-white/6 rounded-xl pl-10 pr-10 py-2.5 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-[#E50914]/40 transition-colors" />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Clear filters */}
            {hasFilters && (
              <button onClick={clear} className="flex items-center gap-1.5 px-3 py-2.5 bg-[#E50914]/10 border border-[#E50914]/25 text-[#E50914] rounded-xl text-sm font-medium hover:bg-[#E50914]/20 transition-colors whitespace-nowrap">
                <X size={13} /> Clear
              </button>
            )}
          </div>

          {/* Row 2: Genre pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scroll-container">
            <button onClick={() => setGenre('')}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                !genre ? 'bg-[#E50914] border-[#E50914] text-white' : 'bg-transparent border-white/10 text-gray-400 hover:border-white/25 hover:text-white'
              }`}>All Genres</button>
            {allGenres.map(g => (
              <button key={g} onClick={() => setGenre(genre === g ? '' : g)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  genre === g ? 'bg-[#E50914] border-[#E50914] text-white' : 'bg-transparent border-white/10 text-gray-400 hover:border-white/25 hover:text-white'
                }`}>{g}</button>
            ))}
          </div>
        </div>

        {/* ── Grid ──────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 bg-white/4 rounded-2xl flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-600" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">No movies found</h3>
            <p className="text-gray-600 text-sm mb-5">Try different filters or search terms</p>
            <button onClick={clear} className="px-5 py-2.5 bg-[#E50914] text-white text-sm font-semibold rounded-xl hover:bg-[#c8000f] transition-colors">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filtered.map(m => (
              <MovieCard key={m.id} movie={m} isComingSoon={comingSoonMovies.some(c => c.id === m.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
