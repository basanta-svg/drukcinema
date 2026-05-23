import { useState, useEffect } from 'react';
import { Play, Ticket, Star, Clock, ChevronRight } from 'lucide-react';
import { nowShowingMovies } from '../data/movies';

const HeroBanner = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const heroes = nowShowingMovies.slice(0, 4);
  const movie   = heroes[currentIdx];

  useEffect(() => {
    const t = setInterval(() => setCurrentIdx(i => (i + 1) % heroes.length), 6000);
    return () => clearInterval(t);
  }, [heroes.length]);

  return (
    <div className="relative w-full h-[88vh] min-h-[560px] max-h-[780px] overflow-hidden">

      {/* ── Backdrop images ───────────────────────────── */}
      {heroes.map((m, i) => (
        <div
          key={m.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === currentIdx ? 1 : 0 }}
        >
          <img
            src={m.backdrop}
            alt={m.title}
            className="w-full h-full object-cover object-center scale-105"
          />
        </div>
      ))}

      {/* ── Gradient layers ───────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />

      {/* ── Content ───────────────────────────────────── */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-xl lg:max-w-2xl">

          {/* Label */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-px bg-[#E50914]" />
            <span className="text-[#E50914] text-xs font-bold tracking-[3px] uppercase">
              Featured Film
            </span>
          </div>

          {/* Title */}
          <h1
            key={movie.id}
            className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-[1.1] mb-4 fade-in"
          >
            {movie.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-md">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="text-amber-400 text-xs font-bold">{movie.rating}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 text-sm">
              <Clock size={13} />
              <span>{movie.duration}</span>
            </div>
            <span className="text-gray-600">·</span>
            <span className="text-gray-400 text-sm">{movie.language}</span>
            <span className="text-[10px] text-gray-400 border border-gray-600 px-2 py-0.5 rounded">
              {movie.certificate}
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-5">
            {movie.genre.map(g => (
              <span key={g} className="genre-tag">{g}</span>
            ))}
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-7 line-clamp-3">
            {movie.description}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary flex items-center gap-2">
              <Ticket size={16} />
              Book Now
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Play size={15} className="fill-white" />
              Watch Trailer
            </button>
          </div>

          {/* Price */}
          <p className="mt-5 text-xs text-gray-500">
            Tickets from{' '}
            <span className="text-white font-semibold text-sm">Nu. {movie.price.regular}</span>
          </p>
        </div>
      </div>

      {/* ── Slide indicators ──────────────────────────── */}
      <div className="absolute bottom-10 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          {heroes.map((m, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`transition-all duration-300 rounded-full ${
                i === currentIdx
                  ? 'w-7 h-1.5 bg-[#E50914]'
                  : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
          <span className="ml-3 text-gray-500 text-xs">
            {currentIdx + 1} / {heroes.length}
          </span>
        </div>
      </div>

      {/* ── Top accent line ───────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E50914]/50 to-transparent" />
    </div>
  );
};

export default HeroBanner;
