import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Clock, Calendar, Ticket, Play, ChevronLeft, User } from 'lucide-react';
import { nowShowingMovies, comingSoonMovies } from '../data/movies';

const allMovies = [...nowShowingMovies, ...comingSoonMovies];

/* Generate 4 days of showtimes */
const genShowtimes = id => {
  const halls = ['Hall 1 – Thimphu', 'Hall 2 – Thimphu', 'Paro Multiplex'];
  const times = ['10:30 AM', '1:15 PM', '4:00 PM', '7:30 PM', '10:00 PM'];
  return Array.from({ length: 4 }, (_, d) => {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const label = d === 0 ? 'Today' : d === 1 ? 'Tomorrow'
      : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const shows = times
      .filter((_, i) => (id + d + i) % 4 !== 0)
      .slice(0, 4)
      .map((time, i) => ({
        id: `${d}-${i}`, time,
        hall: halls[(id + i) % halls.length],
        seats: Math.max(5, Math.floor(20 + (id * 7 + i * 11 + d * 5) % 80)),
      }));
    return { label, date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), shows };
  });
};

const MovieDetailPage = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const movie     = allMovies.find(m => m.id === Number(id));
  const isCS      = comingSoonMovies.some(m => m.id === Number(id));
  const showtimes = useMemo(() => movie ? genShowtimes(movie.id) : [], [movie]);

  const [dayIdx, setDayIdx]   = useState(0);
  const [sel,    setSel]      = useState(null);
  const [tab,    setTab]      = useState('synopsis');
  const [imgErr, setImgErr]   = useState(false);

  if (!movie) return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center pt-20 text-center">
      <div>
        <p className="text-5xl mb-4 font-black text-[#E50914]">404</p>
        <h2 className="text-white text-xl font-bold mb-3">Movie not found</h2>
        <Link to="/movies" className="px-5 py-2.5 bg-[#E50914] text-white rounded-xl text-sm font-semibold hover:bg-[#c8000f] transition-colors">
          Browse Movies
        </Link>
      </div>
    </div>
  );

  const prices = {
    regular: movie.price?.regular || 150,
    deluxe:  Math.round((movie.price?.regular || 150) * 1.3),
    vip:     movie.price?.vip || 300,
  };

  const goBook = () => {
    if (!sel) return;
    navigate(`/book/${movie.id}`, {
      state: { movie, showtime: { ...sel, day: showtimes[dayIdx].label, date: showtimes[dayIdx].date } }
    });
  };

  return (
    <div className="min-h-screen bg-[#141414]">

      {/* ── Full-bleed hero ───────────────────────── */}
      <div className="relative h-[70vh] min-h-[480px] overflow-hidden">
        {!imgErr ? (
          <img src={movie.backdrop} alt={movie.title} className="w-full h-full object-cover object-top"
            onError={() => setImgErr(true)} />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-zinc-900 to-[#141414]" />
        )}
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/60 via-transparent to-transparent" />

        {/* Back button */}
        <div className="absolute top-20 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm bg-black/30 backdrop-blur-sm border border-white/10 px-3.5 py-2 rounded-xl transition-colors">
            <ChevronLeft size={15} /> Back
          </button>
        </div>

        {/* Hero info — bottom of backdrop */}
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-2xl">
            {isCS
              ? <span className="coming-soon-badge mb-3 inline-block">Coming Soon · {movie.releaseMonth}</span>
              : <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded-full mb-3 inline-block">Now Showing</span>
            }
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
              {movie.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {!isCS && (
                <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/25 px-2.5 py-1 rounded-lg">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="text-amber-400 text-sm font-bold">{movie.rating}</span>
                </div>
              )}
              <span className="text-gray-400 text-sm flex items-center gap-1.5"><Clock size={13} />{movie.duration}</span>
              <span className="text-gray-400 text-sm">{movie.language}</span>
              <span className="text-xs border border-gray-600 text-gray-400 px-2 py-0.5 rounded">{movie.certificate}</span>
              <div className="flex gap-1.5">
                {movie.genre.map(g => <span key={g} className="genre-tag">{g}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left: details ────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Action buttons (mobile) */}
            {!isCS && (
              <div className="flex gap-3 mb-8 lg:hidden">
                <button
                  onClick={() => sel ? goBook() : document.getElementById('showtimes')?.scrollIntoView({ behavior:'smooth' })}
                  className="flex-1 py-3 bg-[#E50914] hover:bg-[#c8000f] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <Ticket size={16} /> Book Tickets
                </button>
                <button className="px-4 py-3 bg-white/6 hover:bg-white/10 border border-white/10 text-white rounded-xl flex items-center gap-2 transition-colors text-sm">
                  <Play size={14} className="fill-white" /> Trailer
                </button>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-0 border-b border-white/8 mb-6">
              {['synopsis', 'cast', 'details'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-5 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                    tab === t ? 'text-white border-[#E50914]' : 'text-gray-600 border-transparent hover:text-gray-300'
                  }`}>{t}</button>
              ))}
            </div>

            {/* Synopsis tab */}
            {tab === 'synopsis' && (
              <div className="fade-in">
                <p className="text-gray-400 leading-relaxed text-[15px] mb-8">{movie.description}</p>
                {!isCS && (
                  <div className="bg-[#181818] border border-white/6 rounded-2xl p-5">
                    <h3 className="text-white font-bold text-sm mb-4">Ticket Prices</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { type: 'Regular', price: prices.regular, sub: 'Rows A – D', color: 'border-white/10' },
                        { type: 'Deluxe',  price: prices.deluxe,  sub: 'Rows E – H', color: 'border-blue-700/30' },
                        { type: 'VIP',     price: prices.vip,     sub: 'Rows I – J', color: 'border-amber-700/30' },
                      ].map(({ type, price, sub, color }) => (
                        <div key={type} className={`bg-white/3 border ${color} rounded-xl p-4 text-center`}>
                          <p className="text-white font-black text-lg">Nu. {price}</p>
                          <p className={`text-xs font-bold mt-0.5 ${type === 'VIP' ? 'text-amber-400' : type === 'Deluxe' ? 'text-blue-400' : 'text-gray-400'}`}>{type}</p>
                          <p className="text-gray-700 text-[10px] mt-1">{sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cast tab */}
            {tab === 'cast' && (
              <div className="fade-in">
                <div className="mb-6">
                  <h4 className="text-gray-500 text-xs uppercase tracking-widest mb-3">Director</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E50914]/15 border border-[#E50914]/25 flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-[#E50914]" />
                    </div>
                    <span className="text-white font-medium">{movie.director}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-gray-500 text-xs uppercase tracking-widest mb-3">Cast</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {movie.cast?.map((name, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/3 border border-white/6 rounded-xl px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {name[0]}
                        </div>
                        <span className="text-gray-300 text-sm">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Details tab */}
            {tab === 'details' && (
              <div className="fade-in grid grid-cols-2 gap-4">
                {[
                  { label: 'Duration',    value: movie.duration },
                  { label: 'Language',    value: movie.language },
                  { label: 'Certificate', value: movie.certificate },
                  { label: 'Release',     value: new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
                  { label: 'Genre',       value: movie.genre.join(', ') },
                  { label: 'Director',    value: movie.director },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/3 border border-white/6 rounded-xl p-4">
                    <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-white text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: showtime picker ───────────────── */}
          <div className="lg:w-[300px] flex-shrink-0" id="showtimes">
            {!isCS ? (
              <div className="bg-[#181818] border border-white/8 rounded-2xl overflow-hidden sticky top-24">
                {/* Header */}
                <div className="px-5 py-4 border-b border-white/6 flex items-center gap-2">
                  <Calendar size={15} className="text-[#E50914]" />
                  <span className="text-white font-bold text-sm">Select Showtime</span>
                </div>

                {/* Date tabs */}
                <div className="p-4 border-b border-white/6">
                  <div className="grid grid-cols-4 gap-1.5">
                    {showtimes.map((day, i) => (
                      <button key={i} onClick={() => { setDayIdx(i); setSel(null); }}
                        className={`py-2.5 rounded-xl text-center transition-all ${
                          dayIdx === i
                            ? 'bg-[#E50914] text-white shadow-[0_2px_12px_rgba(229,9,20,0.3)]'
                            : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/8 border border-white/5'
                        }`}>
                        <p className="text-[10px] font-bold leading-none">{day.label === 'Today' ? 'Today' : day.label.split(',')[0] || day.label}</p>
                        <p className="text-[9px] opacity-70 mt-0.5">{day.date}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time slots */}
                <div className="p-4 space-y-2">
                  {showtimes[dayIdx]?.shows.map(show => (
                    <button key={show.id} onClick={() => setSel(show)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all ${
                        sel?.id === show.id
                          ? 'bg-[#E50914]/10 border-[#E50914]/60 text-white'
                          : 'bg-white/3 border-white/6 text-gray-400 hover:border-white/15 hover:text-white'
                      }`}>
                      <span className="font-bold text-sm">{show.time}</span>
                      <div className="text-right">
                        <p className="text-[11px] text-gray-500">{show.hall.split('–')[0].trim()}</p>
                        <p className={`text-[10px] font-semibold ${show.seats > 20 ? 'text-emerald-400' : show.seats > 8 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {show.seats} seats left
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Book button */}
                <div className="px-4 pb-4">
                  <button onClick={goBook} disabled={!sel}
                    className="w-full py-3.5 bg-[#E50914] hover:bg-[#c8000f] disabled:opacity-35 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(229,9,20,0.2)]">
                    <Ticket size={15} />
                    {sel ? 'Select Seats' : 'Choose a Showtime'}
                  </button>
                  {sel && (
                    <p className="text-center text-gray-600 text-[11px] mt-2">
                      {showtimes[dayIdx].label} · {sel.time} · {sel.hall}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Coming soon widget */
              <div className="bg-[#181818] border border-white/8 rounded-2xl p-6 text-center sticky top-24">
                <div className="w-14 h-14 bg-[#E50914]/10 border border-[#E50914]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar size={24} className="text-[#E50914]" />
                </div>
                <h3 className="text-white font-bold mb-1">Coming {movie.releaseMonth}</h3>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                  Booking opens soon. Be the first to know when tickets go live.
                </p>
                <button className="w-full py-3 bg-[#E50914] text-white font-semibold rounded-xl hover:bg-[#c8000f] transition-colors text-sm">
                  Notify Me
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
