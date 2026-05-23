import { ArrowRight, Film, Users, MapPin } from 'lucide-react';

const stats = [
  { value: '50+',  label: 'Bhutanese Films', Icon: Film  },
  { value: '4',    label: 'Cinema Halls',    Icon: MapPin },
  { value: '10K+', label: 'Happy Viewers',   Icon: Users  },
];

const BhutanPromo = () => (
  <section className="py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* ── Banner ───────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=480&fit=crop&q=80"
          alt="Bhutan landscape"
          className="w-full h-52 sm:h-64 lg:h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/95 via-[#141414]/70 to-[#141414]/20" />

        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-14">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-px bg-[#E50914]" />
            <span className="text-[#E50914] text-xs font-bold tracking-[3px] uppercase">
              Discover Bhutanese Cinema
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white max-w-lg leading-tight mb-3">
            Stories from the{' '}
            <span className="text-[#E50914]">Land of Thunder Dragon</span>
          </h2>

          <p className="text-gray-400 text-sm sm:text-base max-w-md mb-6 leading-relaxed hidden sm:block">
            Authentic Bhutanese storytelling — from monastic life to Himalayan adventures,
            carrying the soul of Gross National Happiness.
          </p>

          <div className="flex flex-wrap gap-3">
            <button className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
              Explore All Films
              <ArrowRight size={15} />
            </button>
            <button className="btn-secondary flex items-center gap-2 text-sm py-2.5 px-5 hidden sm:flex">
              About Bhutanese Cinema
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {stats.map(({ value, label, Icon }) => (
          <div
            key={label}
            className="bg-[#1a1a1a] border border-white/6 rounded-xl p-4 sm:p-5 text-center hover:border-[#E50914]/30 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#E50914]/10 border border-[#E50914]/15 flex items-center justify-center mx-auto mb-2 group-hover:bg-[#E50914]/20 transition-colors">
              <Icon size={16} className="text-[#E50914]" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">{value}</div>
            <div className="text-gray-500 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BhutanPromo;
