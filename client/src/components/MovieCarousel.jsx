import { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import MovieCard from './MovieCard';

const MovieCarousel = ({ title, movies, isComingSoon = false, Icon }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 230, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ───────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#E50914] rounded-full flex-shrink-0" />
            {Icon && <Icon size={20} className="text-[#E50914]" />}
            <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
            <span className="text-gray-600 text-sm hidden sm:inline">
              {movies.length} films
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-1 text-[#E50914] text-sm font-medium hover:text-red-400 transition-colors">
              See All <ArrowRight size={14} />
            </button>
            <div className="flex gap-1">
              <button
                onClick={() => scroll(-1)}
                className="p-1.5 rounded-lg bg-white/8 hover:bg-[#E50914] text-white transition-all duration-200"
                aria-label="Scroll left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll(1)}
                className="p-1.5 rounded-lg bg-white/8 hover:bg-[#E50914] text-white transition-all duration-200"
                aria-label="Scroll right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-[#E50914] via-[#E50914]/20 to-transparent mb-6" />

        {/* ── Scrollable row ───────────────────────── */}
        <div className="relative">
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#141414] to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="scroll-container flex gap-4 pb-2"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {movies.map(movie => (
              <div key={movie.id} style={{ scrollSnapAlign: 'start' }}>
                <MovieCard movie={movie} isComingSoon={isComingSoon} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieCarousel;
