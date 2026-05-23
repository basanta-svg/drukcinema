import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Clock, Calendar, Ticket, Play, ChevronLeft, Users } from 'lucide-react';
import { nowShowingMovies, comingSoonMovies } from '../data/movies';

const allMovies = [...nowShowingMovies, ...comingSoonMovies];

/* Generate 4 days of showtimes */
const generateShowtimes = (movieId) => {
  const halls   = ['Hall 1 - Thimphu', 'Hall 2 - Thimphu', 'Paro Multiplex'];
  const rawTimes = ['10:30 AM', '1:15 PM', '4:00 PM', '7:30 PM', '10:00 PM'];
  const days = [];
  for (let d = 0; d < 4; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const label = d === 0 ? 'Today' : d === 1 ? 'Tomorrow'
      : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    // Vary which times are shown per day
    const times = rawTimes.filter((_, i) => (movieId + d + i) % 3 !== 0).slice(0, 4);
    days.push({
      label,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      shows: times.map((time, i) => ({
        id:    `${d}-${i}`,
        time,
        hall:  halls[(movieId + i) % halls.length],
        seats: Math.floor(20 + ((movieId * 7 + i * 13 + d * 5) % 80)),
      })),
    });
  }
  return days;
};

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = allMovies.find(m => m.id === Number(id));

  const showtimes    = useMemo(() => movie ? generateShowtimes(movie.id) : [], [movie]);
  const [dayIdx,     setDayIdx]     = useState(0);
  const [selectedST, setSelectedST] = useState(null);
  const [imgError,   setImgError]   = useState(false);

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center pt-20 text-center">
        <div>
          <p className="text-4xl mb-4">🎬</p>
          <h2 className="text-white text-xl font-bold mb-2">Movie not found</h2>
          <Link to="/movies" className="text-[#E50914] hover:underline">Browse all movies</Link>
        </div>
      </div>
    );
  }

  const isComingSoon = comingSoonMovies.some(m => m.id === movie.id);
  const currentDay   = showtimes[dayIdx];

  const handleBookNow = () => {
    if (!selectedST) return;
    navigate(`/book/${movie.id}`, {
      state: { movie, showtime: { ...selectedST, day: currentDay.label, date: currentDay.date } }
    });
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      {/* ── Backdrop hero ─────────────────────────── */}
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        {!imgError ? (
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="w-full h-full object-cover object-center"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-zinc-900 to-[#141414]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/80 to-transparent" />

        {/* Back button */}
        <div className="absolute top-20 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg"
          >
            <ChevronLeft size={16} /> Back
          </button>
        </div>
      </div>

      {/* ── Main content ──────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left: poster + details ──────────────── */}
          <div className="flex-1">
            <div className="flex gap-5 mb-6">
              {/* Poster thumbnail */}
              <div className="w-24 sm:w-32 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
              </div>
              <div className="pt-2">
                {/* Status badge */}
                {isComingSoon ? (
                  <span className="coming-soon-badge mb-2 inline-block">Coming Soon</span>
                ) : (
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold mb-2 inline-block">
                    NOW SHOWING
                  </span>
                )}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-2">
                  {movie.title}
                </h1>
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3">
                  {!isComingSoon && (
                    <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/25 px-2.5 py-1 rounded-md">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-amber-400 text-sm font-bold">{movie.rating}</span>
                    </div>
                  )}
                  <span className="text-gray-400 text-sm flex items-center gap-1.5">
                    <Clock size={13} /> {movie.duration}
                  </span>
                  <span className="text-gray-400 text-sm">{movie.language}</span>
                  <span className="text-[10px] border border-gray-600 text-gray-400 px-1.5 py-0.5 rounded">
                    {movie.certificate}
                  </span>
                </div>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre.map(g => <span key={g} className="genre-tag">{g}</span>)}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-3">Synopsis</h3>
              <p className="text-gray-400 leading-relaxed">{movie.description}</p>
            </div>

            {/* Cast & Crew */}
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-3">Director</h3>
                <p className="text-gray-300 text-sm">{movie.director}</p>
              </div>
              <div>
                <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-3">Cast</h3>
                <p className="text-gray-300 text-sm">{movie.cast?.join(', ')}</p>
              </div>
            </div>

            {/* Pricing */}
            {!isComingSoon && (
              <div className="bg-[#1a1a1a] border border-white/6 rounded-xl p-5">
                <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-4">Ticket Prices</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { type: 'Regular', price: movie.price?.regular, desc: 'Rows A–D' },
                    { type: 'Deluxe',  price: Math.round((movie.price?.regular || 150) * 1.3), desc: 'Rows E–H' },
                    { type: 'VIP',     price: movie.price?.vip,     desc: 'Rows I–J' },
                  ].map(({ type, price, desc }) => (
                    <div key={type} className="bg-white/4 rounded-lg p-3 text-center">
                      <p className="text-white font-bold text-sm">Nu. {price}</p>
                      <p className="text-[#E50914] text-xs font-semibold">{type}</p>
                      <p className="text-gray-600 text-[10px] mt-0.5">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: showtime selector ─────────────── */}
          {!isComingSoon && (
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-5 sticky top-24">
                <div className="flex items-center gap-2 mb-5">
                  <Calendar size={16} className="text-[#E50914]" />
                  <h3 className="text-white font-bold">Select Showtime</h3>
                </div>

                {/* Date tabs */}
                <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 scroll-container">
                  {showtimes.map((day, i) => (
                    <button
                      key={i}
                      onClick={() => { setDayIdx(i); setSelectedST(null); }}
                      className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all text-center min-w-[60px] ${
                        dayIdx === i
                          ? 'bg-[#E50914] text-white'
                          : 'bg-white/6 text-gray-400 hover:text-white border border-white/8'
                      }`}
                    >
                      <div className="font-bold">{day.label === 'Today' ? 'Today' : day.label.split(',')[0] || day.label}</div>
                      <div className="opacity-70 text-[10px]">{day.date}</div>
                    </button>
                  ))}
                </div>

                {/* Time slots */}
                <div className="space-y-2 mb-5">
                  {currentDay?.shows.map(show => (
                    <button
                      key={show.id}
                      onClick={() => setSelectedST(show)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${
                        selectedST?.id === show.id
                          ? 'bg-[#E50914]/15 border-[#E50914] text-white'
                          : 'bg-white/4 border-white/8 text-gray-300 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <span className="font-semibold">{show.time}</span>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{show.hall}</p>
                        <p className={`text-[10px] font-medium ${show.seats > 20 ? 'text-green-400' : show.seats > 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {show.seats} seats left
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Book button */}
                <button
                  onClick={handleBookNow}
                  disabled={!selectedST}
                  className="w-full py-3.5 bg-[#E50914] hover:bg-[#c8000f] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Ticket size={16} />
                  {selectedST ? 'Select Seats' : 'Choose a Showtime'}
                </button>

                {selectedST && (
                  <p className="text-center text-gray-500 text-xs mt-3">
                    {currentDay.label} · {selectedST.time} · {selectedST.hall}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Coming soon notice */}
          {isComingSoon && (
            <div className="lg:w-72 flex-shrink-0">
              <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-6 text-center sticky top-24">
                <Calendar size={32} className="text-[#E50914] mx-auto mb-3" />
                <h3 className="text-white font-bold mb-1">Coming {movie.releaseMonth}</h3>
                <p className="text-gray-500 text-sm mb-4">Booking opens soon. Get notified when tickets go live.</p>
                <button className="w-full py-3 bg-[#E50914] text-white font-semibold rounded-xl hover:bg-[#c8000f] transition-colors text-sm">
                  Notify Me
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
