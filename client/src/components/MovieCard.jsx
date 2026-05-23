import { useState } from 'react';

const MovieCard = ({ movie, isComingSoon = false }) => {
  const [imgError, setImgError] = useState(false);

  const fallbackColors = [
    'from-red-900 to-red-950',
    'from-slate-800 to-slate-900',
    'from-zinc-800 to-zinc-900',
    'from-neutral-800 to-neutral-900',
  ];
  const fallbackColor = fallbackColors[movie.id % fallbackColors.length];

  return (
    <div className="movie-card flex-shrink-0 w-44 sm:w-48 cursor-pointer group">
      {/* Poster */}
      <div className="relative rounded-lg overflow-hidden bg-[#1e1e1e] aspect-[2/3] mb-3">
        {!imgError ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-b ${fallbackColor} flex items-center justify-center`}>
            <div className="text-center px-3">
              <span className="text-4xl mb-2 block">🎬</span>
              <span className="text-white text-xs font-medium leading-tight">{movie.title}</span>
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-3">
          {isComingSoon ? (
            <>
              <div className="coming-soon-badge">Coming Soon</div>
              <p className="text-white text-xs text-center font-medium">{movie.releaseMonth}</p>
              <button className="w-full py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded border border-white/40 transition-colors">
                Notify Me
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1 text-yellow-400">
                <span className="text-sm">⭐</span>
                <span className="text-white font-bold">{movie.rating}</span>
              </div>
              <button className="w-full py-2 bg-[#E50914] hover:bg-[#f40612] text-white text-xs font-semibold rounded transition-all shadow-lg">
                🎟 Book Now
              </button>
              <button className="w-full py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded border border-white/20 transition-colors">
                More Info
              </button>
            </>
          )}
        </div>

        {/* Top badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {isComingSoon && (
            <span className="coming-soon-badge text-[9px]">SOON</span>
          )}
          {!isComingSoon && movie.certificate && (
            <span className="text-[9px] bg-black/60 text-gray-300 border border-gray-600 px-1.5 py-0.5 rounded">
              {movie.certificate}
            </span>
          )}
          {!isComingSoon && (
            <div className="ml-auto flex items-center gap-0.5 bg-black/60 px-1.5 py-0.5 rounded">
              <span className="text-yellow-400 text-[10px]">⭐</span>
              <span className="text-white text-[10px] font-bold">{movie.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="px-1">
        <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2 group-hover:text-[#E50914] transition-colors">
          {movie.title}
        </h3>
        <div className="flex flex-wrap gap-1 mb-1">
          {movie.genre.slice(0, 2).map(g => (
            <span key={g} className="genre-tag">{g}</span>
          ))}
        </div>
        {isComingSoon ? (
          <p className="text-gray-500 text-xs">{movie.releaseMonth}</p>
        ) : (
          <p className="text-gray-500 text-xs">
            {movie.duration} • {movie.language}
          </p>
        )}
        {!isComingSoon && (
          <p className="text-[#E50914] text-xs font-semibold mt-1">
            Nu. {movie.price?.regular}+
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
