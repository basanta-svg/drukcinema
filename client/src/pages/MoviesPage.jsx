import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, Filter, X, Ticket } from 'lucide-react';
import { nowShowingMovies, comingSoonMovies } from '../data/movies';

const allMovies = [...nowShowingMovies, ...comingSoonMovies];
const allGenres = [...new Set(allMovies.flatMap(m => m.genre))].sort();

/* ── Movie grid card (wider format) ──────────────── */
const GridCard = ({ movie, isComingSoon }) => (
  <Link to={`/movie/${movie.id}`} className="group block">
    <div className="bg-[#1a1a1a] border border-white/6 rounded-xl overflow-hidden hover:border-[#E50914]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(229,9,20,0.15)]">
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.target.style.display = 'none'; }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start">
          {isComingSoon ? (
            <span className="coming-soon-badge text-[9px]">SOON</span>
          ) : (
            <span className="text-[9px] bg-black/60 text-gray-300 border border-white/15 px-1.5 py-0.5 rounded font-medium">
              {movie.certificate}
            </span>
          )}
          {!isComingSoon && (
            <div className="flex items-center gap-1 bg-black/65 px-1.5 py-0.5 rounded">
              <Star size={9} className="fill-amber-400 text-amber-400" />
              <span className="text-white text-[10px] font-bold">{movie.rating}</span>
            </div>
          )}
        </div>

        {/* Hover CTA */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {isComingSoon ? (
            <button className="w-full py-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold rounded-lg">
              Notify Me
            </button>
          ) : (
            <button className="w-full py-2 bg-[#E50914] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5">
              <Ticket size={12} /> Book Now
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm leading-tight mb-1.5 line-clamp-1 group-hover:text-[#E50914] transition-colors">
          {movie.title}
        </h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {movie.genre.slice(0, 2).map(g => <span key={g} className="genre-tag">{g}</span>)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-xs flex items-center gap-1">
            <Clock size={10} /> {isComingSoon ? movie.releaseMonth : movie.duration}
          </span>
          {!isComingSoon && (
            <span className="text-[#E50914] text-xs font-semibold">Nu. {movie.price?.regular}+</span>
          )}
        </div>
      </div>
    </div>
  </Link>
);

/* ── Page ─────────────────────────────────────────── */
const MoviesPage = () => {
  const [tab,    setTab]    = useState('all');         // all | now_showing | coming_soon
  const [genre,  setGenre]  = useState('');
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const filtered = useMemo(() => {
    let list = tab === 'now_showing'  ? nowShowingMovies
             : tab === 'coming_soon' ? comingSoonMovies
             : allMovies;
    if (genre)  list = list.filter(m => m.genre.includes(genre));
    if (search) list = list.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [tab, genre, search]);

  const clearFilters = () => { setGenre(''); setSearch(''); };
  const hasFilter = genre || search;

  return (
    <div className="min-h-screen bg-[#141414] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page header ─────────────────────────── */}
        <div className="py-8 border-b border-white/6 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">All Movies</h1>
              <p className="text-gray-500 text-sm">{filtered.length} films available</p>
            </div>
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilter(v => !v)}
              className="sm:hidden flex items-center gap-1.5 px-3 py-2 bg-white/6 border border-white/10 rounded-lg text-gray-300 text-sm"
            >
              <Filter size={14} />
              Filters
              {hasFilter && <span className="w-2 h-2 bg-[#E50914] rounded-full" />}
            </button>
          </div>

          {/* ── Status tabs ─────────────────────────── */}
          <div className="flex gap-1 mt-6 bg-[#1a1a1a] border border-white/6 rounded-xl p-1 w-fit">
            {[
              { key: 'all',          label: 'All Films' },
              { key: 'now_showing',  label: 'Now Showing' },
              { key: 'coming_soon',  label: 'Coming Soon' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === key
                    ? 'bg-[#E50914] text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          {/* ── Sidebar filters (desktop) ────────────── */}
          <aside className={`flex-shrink-0 w-52 ${showFilter ? 'block' : 'hidden'} sm:block`}>
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div>
                <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-3">Search</h3>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Movie title…"
                    className="w-full bg-white/5 border border-white/8 rounded-lg pl-9 pr-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#E50914]/50 transition-colors"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Genre */}
              <div>
                <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-3">Genre</h3>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setGenre('')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${!genre ? 'bg-[#E50914] text-white' : 'bg-white/6 text-gray-400 hover:text-white border border-white/8'}`}
                  >
                    All
                  </button>
                  {allGenres.map(g => (
                    <button
                      key={g}
                      onClick={() => setGenre(genre === g ? '' : g)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${genre === g ? 'bg-[#E50914] text-white' : 'bg-white/6 text-gray-400 hover:text-white border border-white/8'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {hasFilter && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 text-[#E50914] text-xs hover:underline">
                  <X size={12} /> Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* ── Movie grid ───────────────────────────── */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Search size={40} className="text-gray-700 mb-4" />
                <h3 className="text-white font-semibold mb-1">No movies found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters</p>
                <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-[#E50914] text-white text-sm rounded-lg hover:bg-[#c8000f] transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filtered.map(movie => {
                  const isComingSoon = comingSoonMovies.some(m => m.id === movie.id);
                  return <GridCard key={movie.id} movie={movie} isComingSoon={isComingSoon} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;
