const Footer = () => {
  const links = {
    'Explore': ['Now Showing', 'Coming Soon', 'Top Rated', 'Bhutanese Films', 'International Films'],
    'Cinemas': ['Thimphu City Cinema', 'Paro Multiplex', 'Punakha Cinema', 'Bumthang Theatre'],
    'Help': ['FAQs', 'Booking Guide', 'Refund Policy', 'Contact Support', 'Terms of Service'],
    'Company': ['About DrukCinema', 'Careers', 'Press', 'Advertise', 'Privacy Policy'],
  };

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1e1e1e] mt-16">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="#E50914" />
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fill="white">🐉</text>
              </svg>
              <div>
                <div className="text-2xl font-black text-[#E50914]">
                  Druk<span className="text-white">Cinema</span>
                </div>
                <div className="text-[9px] text-gray-500 tracking-[3px]">འབྲུག་གློག་བརྙན</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs">
              Bhutan's premier online movie ticketing platform. Experience the magic of
              Bhutanese cinema and international blockbusters in the Land of the Thunder Dragon.
            </p>

            {/* Bhutan flag colors bar */}
            <div className="flex h-1.5 w-32 rounded overflow-hidden mb-5">
              <div className="flex-1 bg-orange-500" />
              <div className="flex-1 bg-white" />
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: '📘', label: 'Facebook' },
                { icon: '🐦', label: 'Twitter' },
                { icon: '📷', label: 'Instagram' },
                { icon: '▶️', label: 'YouTube' },
              ].map(s => (
                <button
                  key={s.label}
                  title={s.label}
                  className="w-9 h-9 rounded-full bg-[#1e1e1e] hover:bg-[#E50914] flex items-center justify-center text-sm transition-colors"
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#E50914] text-sm transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter bar */}
      <div className="border-t border-[#1e1e1e]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-white font-semibold">Never miss a premiere 🎬</p>
              <p className="text-gray-400 text-sm">Get notified about new Bhutanese films and special screenings</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-64 px-4 py-2.5 bg-[#1e1e1e] border border-[#2a2a2a] rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#E50914] transition-colors"
              />
              <button className="px-5 py-2.5 bg-[#E50914] hover:bg-[#f40612] text-white text-sm font-semibold rounded transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <span>🇧🇹</span>
            <span>© 2025 DrukCinema Pvt. Ltd. All rights reserved. Thimphu, Bhutan.</span>
          </div>
          <div className="flex items-center gap-4 text-gray-500 text-xs">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookies</a>
            <span>•</span>
            <span className="text-[#E50914]">Made with ❤️ in Bhutan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
