const features = [
  { icon: '🎟️', title: 'Easy Booking', desc: 'Book in under 60 seconds' },
  { icon: '💺', title: 'Seat Selection', desc: 'Choose your perfect seat' },
  { icon: '📱', title: 'E-Tickets', desc: 'Instant mobile tickets' },
  { icon: '🔄', title: 'Easy Refunds', desc: 'Hassle-free cancellation' },
];

const FeatureStrip = () => (
  <div className="bg-[#1a1a1a] border-y border-[#2a2a2a] py-6">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {features.map(f => (
          <div key={f.title} className="flex items-center gap-3 group">
            <span className="text-2xl">{f.icon}</span>
            <div>
              <p className="text-white font-semibold text-sm group-hover:text-[#E50914] transition-colors">
                {f.title}
              </p>
              <p className="text-gray-500 text-xs">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default FeatureStrip;
