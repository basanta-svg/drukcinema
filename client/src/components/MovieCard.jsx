import { useState } from 'react';
import { Star, Ticket, Info, Bell, Film, Clock } from 'lucide-react';

const MovieCard = ({ movie, isComingSoon = false }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="movie-card flex-shrink-0 w-40 sm:w-44 md:w-48 cursor-pointer group">

      {/* ── Poster ────────────────────────────────── */}
      <div className="relative rounded-xl overflow-hidden bg-[#1e1e1e] aspect-[2/3] mb-3 shadow-lg">
        {!imgError ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-zinc-800 to-zinc-950 flex flex-col items-center justify-center gap-2 px-3">
            <Film size={32} className="text-[#E50914]/60" />
            <span className="text-white text-xs font-medium text-center leading-tight line-clamp-3">
              {movie.title}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2.5 p-3">
          {isComingSoon ? (
            <>
              <div className="coming-soon-badge">Coming Soon</div>
              <div className="flex items-center gap-1.5 text-gray-300">
                <Clock size={12} />
                <span className="text-xs font-medium">{movie.releaseMonth}</span>
              </div>
              <button className="w-full py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold rounded-lg border border-white/25 transition-colors flex items-center justify-center gap-1.5">
                <Bell size={12} />
                Notify Me
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span className="text-white font-bold text-sm">{movie.rating}</span>
              </div>
              <button className="w-full py-2 bg-[#E50914] hover:bg-[#c8000f] text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5">
                <Ticket size={12} />
                Book Now
              </button>
              <button className="w-full py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg border border-white/15 transition-colors flex items-center justify-center gap-1.5">
                <Info size={12} />
                More Info
              </button>
            </>
          )}
        </div>

        {/* ── Top badges ───────────────────────── */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start pointer-events-none">
          {isComingSoon ? (
            <span className="coming-soon-badge text-[9px]">SOON</span>
          ) : (
            movie.certificate && (
              <span className="text-[9px] bg-black/65 text-gray-300 border border-white/15 px-1.5 py-0.5 rounded font-medium">
                {movie.certificate}
              </span>
            )
          )}
          {!isComingSoon && (
            <div className="ml-auto flex items-center gap-0.5 bg-black/65 px-1.5 py-0.5 rounded">
              <Star size={9} className="fill-amber-400 text-amber-400" />
              <span className="text-white text-[10px] font-bold">{movie.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Info ──────────────────────────────────── */}
      <div>
        <h3 className="text-white font-semibold text-sm leading-tight mb-1.5 line-clamp-2 group-hover:text-[#E50914] transition-colors">
          {movie.title}
        </h3>
        <div className="flex flex-wrap gap-1 mb-1.5">
          {movie.genre.slice(0, 2).map(g => (
            <span key={g} className="genre-tag">{g}</span>
          ))}
        </div>
        {isComingSoon ? (
          <p className="text-gray-500 text-xs flex items-center gap-1">
            <Clock size={10} />
            {movie.releaseMonth}
          </p>
        ) : (
          <p className="text-gray-500 text-xs">{movie.duration} · {movie.language}</p>
        )}
        {!isComingSoon && (
          <p className="text-[#E50914] text-xs font-semibold mt-1">Nu. {movie.price?.regular}+</p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
