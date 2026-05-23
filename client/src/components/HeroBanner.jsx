import { useState, useEffect } from 'react';
import { nowShowingMovies } from '../data/movies';

const HeroBanner = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const heroes = nowShowingMovies.slice(0, 4);
  const movie = heroes[currentIdx];

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx(i => (i + 1) % heroes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroes.length]);

  return (
    <div className="relative w-full h-[85vh] min-h-[520px] overflow-hidden">
      {/* Background image with transition */}
      {heroes.map((m, i) => (
        <div
          key={m.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === currentIdx ? 1 : 0 }}
        >
          <img
            src={m.backdrop}
            alt={m.title}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="hero-overlay absolute inset-0" />

      {/* Bottom fade to bg */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#141414] to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-12 lg:px-20 max-w-3xl">
        {/* Bhutan badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🇧🇹</span>
          <span className="text-xs text-[#E50914] font-bold tracking-[3px] uppercase">
            Featured Film
          </span>
        </div>

        {/* Title */}
        <h1
          key={movie.id}
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-3 fade-in"
          style={{ textShadow: '2px 2px 20px rgba(0,0,0,0.8)' }}
        >
          {movie.title}
        </h1>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="rating-badge">⭐ {movie.rating}</span>
          <span className="text-gray-300 text-sm">{movie.duration}</span>
          <span className="text-gray-300 text-sm">•</span>
          <span className="text-gray-300 text-sm">{movie.language}</span>
          <span className="text-gray-400 text-xs border border-gray-500 px-2 py-0.5 rounded">
            {movie.certificate}
          </span>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-4">
          {movie.genre.map(g => (
            <span key={g} className="genre-tag">{g}</span>
          ))}
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl line-clamp-3">
          {movie.description}
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            Book Now
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch Trailer
          </button>
        </div>

        {/* Price tag */}
        <div className="mt-5 flex items-center gap-2 text-sm text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#E50914]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          Tickets from <span className="text-white font-bold ml-1">Nu. {movie.price.regular}</span>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-16 left-8 sm:left-12 lg:left-20 flex gap-2 z-10">
        {heroes.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            className={`transition-all duration-300 rounded-full ${
              i === currentIdx
                ? 'w-8 h-2 bg-[#E50914]'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Decorative Bhutanese pattern top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E50914] to-transparent opacity-60" />
    </div>
  );
};

export default HeroBanner;
