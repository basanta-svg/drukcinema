import { useRef } from 'react';
import MovieCard from './MovieCard';

const MovieCarousel = ({ title, movies, isComingSoon = false, icon = '🎬' }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 220, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Red accent bar */}
            <div className="w-1 h-7 bg-[#E50914] rounded-full" />
            <span className="text-xl mr-1">{icon}</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
            <span className="hidden sm:inline text-gray-500 text-sm ml-2">
              ({movies.length} films)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#E50914] text-sm font-medium cursor-pointer hover:underline hidden sm:block">
              See All →
            </span>
            {/* Arrow buttons */}
            <button
              onClick={() => scroll(-1)}
              className="p-2 rounded-full bg-white/10 hover:bg-[#E50914] text-white transition-all duration-200"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll(1)}
              className="p-2 rounded-full bg-white/10 hover:bg-[#E50914] text-white transition-all duration-200"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Decorative underline */}
        <div className="mt-3 h-px bg-gradient-to-r from-[#E50914] via-[#E50914]/30 to-transparent" />
      </div>

      {/* Scrollable row */}
      <div className="max-w-7xl mx-auto relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#141414] to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#141414] to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          className="scroll-container flex gap-4 pb-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {movies.map(movie => (
            <div key={movie.id} style={{ scrollSnapAlign: 'start' }}>
              <MovieCard movie={movie} isComingSoon={isComingSoon} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieCarousel;
