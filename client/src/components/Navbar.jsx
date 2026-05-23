import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home',    to: '/' },
  { label: 'Movies',  to: '/movies' },
  { label: 'Cinemas', to: '/cinemas' },
  { label: 'Offers',  to: '/offers' },
  { label: 'About',   to: '/about' },
];

const Navbar = () => {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0e0e0e]/95 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,0.6)]'
          : 'bg-gradient-to-b from-black/75 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* ── Logo ─────────────────────────────────── */}
          <Link to="/" className="flex-shrink-0 group">
            <span className="text-xl sm:text-2xl font-black tracking-widest uppercase select-none">
              <span className="text-[#E50914]">DRUK</span>
              <span className="text-white">CINEMA</span>
            </span>
          </Link>

          {/* ── Desktop nav links ─────────────────────── */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ label, to }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={label}
                  to={to}
                  className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                    active
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {label}
                  {active && (
                    <div className="h-0.5 bg-[#E50914] mt-0.5 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Right actions ─────────────────────────── */}
          <div className="flex items-center gap-2">
            {/* Search — desktop only */}
            <button className="hidden sm:flex p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/8 transition-colors">
              <Search size={18} />
            </button>

            {/* Sign In */}
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold text-white border border-white/25 rounded-lg hover:border-white/60 hover:bg-white/8 transition-all"
            >
              Sign In
            </Link>

            {/* Register */}
            <Link
              to="/register"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-[#E50914] rounded-lg hover:bg-[#c8000f] transition-all"
            >
              Register
            </Link>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────── */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#111111] border-t border-white/8 px-4 py-4 space-y-1">
          {navLinks.map(({ label, to }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={label}
                to={to}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#E50914]/15 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/6'
                }`}
              >
                {active && <div className="w-1 h-4 bg-[#E50914] rounded-full mr-2" />}
                {label}
              </Link>
            );
          })}

          <div className="pt-3 flex gap-2 border-t border-white/8 mt-3">
            <Link
              to="/login"
              className="flex-1 text-center py-2.5 border border-white/25 rounded-lg text-white text-sm font-semibold hover:border-white/50 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="flex-1 text-center py-2.5 bg-[#E50914] rounded-lg text-white text-sm font-semibold hover:bg-[#c8000f] transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
