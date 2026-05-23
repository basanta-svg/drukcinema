const BhutanPromo = () => (
  <section className="py-12 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="relative rounded-2xl overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=400&fit=crop&q=80"
          alt="Bhutan landscape"
          className="w-full h-56 sm:h-72 object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🇧🇹</span>
            <span className="text-[#E50914] font-bold text-xs tracking-[3px] uppercase">
              Discover Bhutanese Cinema
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 max-w-lg leading-tight">
            Stories from the<br />
            <span className="text-[#E50914]">Land of Thunder Dragon</span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-md mb-5 leading-relaxed">
            Experience authentic Bhutanese storytelling — from monastic life to Himalayan adventures.
            Films that carry the soul of Gross National Happiness.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary text-sm py-2.5 px-6">
              Explore All Films
            </button>
            <button className="btn-secondary text-sm py-2.5 px-6">
              About Bhutanese Cinema
            </button>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute top-4 right-4 text-6xl opacity-20">🐉</div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          { value: '50+', label: 'Bhutanese Films', icon: '🎬' },
          { value: '4', label: 'Cinema Halls', icon: '🏟️' },
          { value: '10K+', label: 'Happy Viewers', icon: '😊' },
        ].map(stat => (
          <div
            key={stat.label}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 text-center hover:border-[#E50914]/40 transition-colors"
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-black text-[#E50914]">{stat.value}</div>
            <div className="text-gray-400 text-xs mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BhutanPromo;
