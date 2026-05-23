import { Mail, ArrowRight } from 'lucide-react';

const footerLinks = {
  Explore:  ['Now Showing', 'Coming Soon', 'Top Rated', 'Bhutanese Films', 'International Films'],
  Cinemas:  ['Thimphu City Cinema', 'Paro Multiplex', 'Punakha Cinema', 'Bumthang Theatre'],
  Help:     ['FAQs', 'Booking Guide', 'Refund Policy', 'Contact Support', 'Terms of Service'],
  Company:  ['About DrukCinema', 'Careers', 'Press', 'Advertise', 'Privacy Policy'],
};

/* Inline SVG brand icons — lucide-react v1+ removed brand icons */
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon fill="#0d0d0d" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

const socialLinks = [
  { Icon: FacebookIcon,  label: 'Facebook'  },
  { Icon: TwitterIcon,   label: 'Twitter'   },
  { Icon: InstagramIcon, label: 'Instagram' },
  { Icon: YoutubeIcon,   label: 'YouTube'   },
];

const Footer = () => (
  <footer className="bg-[#0d0d0d] border-t border-white/6 mt-16">

    {/* ── Main grid ──────────────────────────────── */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">

        {/* Brand column */}
        <div className="sm:col-span-2 lg:col-span-2">
          <div className="mb-5">
            <span className="text-2xl font-black tracking-widest uppercase select-none">
              <span className="text-[#E50914]">DRUK</span>
              <span className="text-white">CINEMA</span>
            </span>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
            Bhutan's premier movie ticketing platform. Experience the magic of
            Bhutanese and international cinema in the Land of the Thunder Dragon.
          </p>

          {/* Social icons */}
          <div className="flex gap-2">
            {socialLinks.map(({ Icon, label }) => (
              <button
                key={label}
                title={label}
                className="w-9 h-9 rounded-lg bg-white/6 hover:bg-[#E50914] border border-white/8 hover:border-[#E50914] flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([section, items]) => (
          <div key={section}>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-4">
              {section}
            </h4>
            <ul className="space-y-2.5">
              {items.map(item => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-[#E50914] text-sm transition-colors"
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

    {/* ── Newsletter ─────────────────────────────── */}
    <div className="border-t border-white/6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mail size={14} className="text-[#E50914]" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Never miss a premiere</p>
              <p className="text-gray-500 text-xs mt-0.5">Get notified about new films and special screenings</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 sm:w-60 px-3.5 py-2.5 bg-white/6 border border-white/10 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#E50914]/50 transition-colors"
            />
            <button className="px-4 py-2.5 bg-[#E50914] hover:bg-[#c8000f] text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap">
              Subscribe <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* ── Bottom bar ─────────────────────────────── */}
    <div className="border-t border-white/4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-gray-600 text-xs">
          © 2025 DrukCinema Pvt. Ltd. All rights reserved. Thimphu, Bhutan.
        </p>
        <div className="flex items-center gap-4 text-gray-600 text-xs">
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
          <span className="text-white/10">|</span>
          <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
          <span className="text-white/10">|</span>
          <a href="#" className="hover:text-gray-400 transition-colors">Cookies</a>
          <span className="text-white/10">|</span>
          <span className="text-[#E50914]">Made in Bhutan</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
