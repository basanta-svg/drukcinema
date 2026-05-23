import { Film, Clock, Building2, Ticket, MapPin, Monitor } from 'lucide-react';
import HeroBanner     from '../components/HeroBanner';
import MovieCarousel  from '../components/MovieCarousel';
import FeatureStrip   from '../components/FeatureStrip';
import BhutanPromo    from '../components/BhutanPromo';
import { nowShowingMovies, comingSoonMovies } from '../data/movies';

/* ── Reusable section heading ─────────────────────── */
const SectionHeading = ({ title, Icon }) => (
  <div className="mb-6">
    <div className="flex items-center gap-3">
      <div className="w-1 h-6 bg-[#E50914] rounded-full" />
      {Icon && <Icon size={20} className="text-[#E50914]" />}
      <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
    </div>
    <div className="mt-3 h-px bg-gradient-to-r from-[#E50914] via-[#E50914]/20 to-transparent" />
  </div>
);

/* ── Cinema data ──────────────────────────────────── */
const cinemas = [
  { name: 'Thimphu City Cinema', address: 'Norzin Lam, Thimphu',   screens: 3, status: 'open',   Icon: Building2 },
  { name: 'Paro Multiplex',      address: 'Town Center, Paro',      screens: 2, status: 'open',   Icon: Monitor   },
  { name: 'Punakha Cinema',      address: 'Main Road, Punakha',     screens: 1, status: 'open',   Icon: MapPin    },
  { name: 'Bumthang Theatre',    address: 'Jakar, Bumthang',        screens: 1, status: 'coming', Icon: MapPin    },
];

/* ── Page ─────────────────────────────────────────── */
const HomePage = () => (
  <main>
    <HeroBanner />
    <FeatureStrip />

    {/* Now Showing */}
    <MovieCarousel
      title="Now Showing"
      movies={nowShowingMovies}
      Icon={Film}
      isComingSoon={false}
    />

    {/* Bhutan promo */}
    <BhutanPromo />

    {/* Coming Soon */}
    <MovieCarousel
      title="Coming Soon"
      movies={comingSoonMovies}
      Icon={Clock}
      isComingSoon={true}
    />

    {/* ── CTA banner ───────────────────────────────── */}
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#E50914] to-[#a10010] rounded-2xl px-8 py-10 sm:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Ticket size={18} className="text-red-200" />
              <span className="text-red-200 text-xs font-semibold tracking-widest uppercase">Weekend Special</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-1">
              Book Your Seats Today
            </h3>
            <p className="text-red-100/80 text-sm sm:text-base">
              Premium seats available this weekend. Bhutan's finest cinema experience.
            </p>
          </div>
          <button className="flex-shrink-0 px-7 py-3 bg-white text-[#E50914] font-black rounded-xl hover:bg-gray-50 transition-colors text-base shadow-xl flex items-center gap-2">
            Book Now
            <Ticket size={16} />
          </button>
        </div>
      </div>
    </section>

    {/* ── Cinema locations ─────────────────────────── */}
    <section className="py-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Our Cinemas" Icon={Building2} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cinemas.map(({ name, address, screens, status, Icon }) => (
            <div
              key={name}
              className="bg-[#1a1a1a] border border-white/6 rounded-xl p-5 hover:border-[#E50914]/40 transition-all group cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center group-hover:bg-[#E50914]/20 transition-colors">
                  <Icon size={18} className="text-[#E50914]" />
                </div>
                {status === 'open' ? (
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold tracking-wide">
                    OPEN
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded-full font-semibold tracking-wide">
                    SOON
                  </span>
                )}
              </div>

              <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-[#E50914] transition-colors leading-snug">
                {name}
              </h3>
              <p className="text-gray-600 text-xs mb-1">{address}</p>
              <p className="text-gray-500 text-xs">
                {screens} {screens === 1 ? 'Screen' : 'Screens'}
              </p>

              {status === 'open' && (
                <button className="mt-4 w-full py-2 bg-[#E50914]/8 hover:bg-[#E50914] text-[#E50914] hover:text-white border border-[#E50914]/20 hover:border-[#E50914] rounded-lg text-xs font-semibold transition-all">
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

export default HomePage;
