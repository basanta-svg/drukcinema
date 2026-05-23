import HeroBanner from '../components/HeroBanner';
import MovieCarousel from '../components/MovieCarousel';
import FeatureStrip from '../components/FeatureStrip';
import BhutanPromo from '../components/BhutanPromo';
import { nowShowingMovies, comingSoonMovies } from '../data/movies';

const HomePage = () => {
  return (
    <main>
      {/* Hero Banner with auto-rotating slides */}
      <HeroBanner />

      {/* Feature highlights strip */}
      <FeatureStrip />

      {/* Now Showing carousel */}
      <MovieCarousel
        title="Now Showing"
        movies={nowShowingMovies}
        icon="🎬"
        isComingSoon={false}
      />

      {/* Bhutan promo section */}
      <BhutanPromo />

      {/* Coming Soon carousel */}
      <MovieCarousel
        title="Coming Soon"
        movies={comingSoonMovies}
        icon="🔜"
        isComingSoon={true}
      />

      {/* Quick booking banner */}
      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-[#E50914] to-[#9b0a0f] rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Book Your Seats Today! 🎟️
              </h3>
              <p className="text-red-100 text-sm sm:text-base">
                Premium seats available for this weekend. Don't miss out on Bhutan's finest cinema experience.
              </p>
            </div>
            <button className="flex-shrink-0 px-8 py-3 bg-white text-[#E50914] font-black rounded-lg hover:bg-gray-100 transition-colors text-lg shadow-2xl">
              Book Now →
            </button>
          </div>
        </div>
      </section>

      {/* Cinema locations */}
      <section className="py-10 px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 bg-[#E50914] rounded-full" />
            <span className="text-xl mr-1">🏟️</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Our Cinemas</h2>
          </div>
          <div className="mt-3 h-px bg-gradient-to-r from-[#E50914] via-[#E50914]/30 to-transparent mb-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: 'Thimphu City Cinema',
                address: 'Norzin Lam, Thimphu',
                screens: 3,
                icon: '🏙️',
                status: 'open',
              },
              {
                name: 'Paro Multiplex',
                address: 'Town Center, Paro',
                screens: 2,
                icon: '⛩️',
                status: 'open',
              },
              {
                name: 'Punakha Cinema',
                address: 'Main Road, Punakha',
                screens: 1,
                icon: '🏯',
                status: 'open',
              },
              {
                name: 'Bumthang Theatre',
                address: 'Jakar, Bumthang',
                screens: 1,
                icon: '🌄',
                status: 'coming',
              },
            ].map(cinema => (
              <div
                key={cinema.name}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#E50914]/50 transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{cinema.icon}</span>
                  {cinema.status === 'open' ? (
                    <span className="text-[10px] bg-green-900/40 text-green-400 border border-green-700/40 px-2 py-0.5 rounded-full font-semibold">
                      OPEN
                    </span>
                  ) : (
                    <span className="text-[10px] bg-yellow-900/40 text-yellow-400 border border-yellow-700/40 px-2 py-0.5 rounded-full font-semibold">
                      SOON
                    </span>
                  )}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-[#E50914] transition-colors">
                  {cinema.name}
                </h3>
                <p className="text-gray-500 text-xs mb-3">{cinema.address}</p>
                <p className="text-gray-400 text-xs">
                  {cinema.screens} {cinema.screens === 1 ? 'Screen' : 'Screens'}
                </p>
                {cinema.status === 'open' && (
                  <button className="mt-3 w-full py-2 bg-[#E50914]/10 hover:bg-[#E50914] text-[#E50914] hover:text-white border border-[#E50914]/30 hover:border-[#E50914] rounded text-xs font-semibold transition-all">
                    View Shows
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
