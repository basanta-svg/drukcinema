import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'navbar-scrolled' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            {/* Dragon Icon SVG */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="flex-shrink-0">
              <circle cx="18" cy="18" r="18" fill="#E50914" />
              <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fill="white">🐉</text>
            </svg>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black text-[#E50914] tracking-wider uppercase">
                Druk<span className="text-white">Cinema</span>
              </span>
              <span className="text-[9px] text-gray-400 tracking-[3px] uppercase">
                འབྲུག་གློག་བརྙན
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="text-white hover:text-[#E50914] transition-colors">Home</Link>
            <Link to="/movies" className="text-gray-300 hover:text-white transition-colors">Movies</Link>
            <Link to="/cinemas" className="text-gray-300 hover:text-white transition-colors">Cinemas</Link>
            <Link to="/offers" className="text-gray-300 hover:text-white transition-colors">Offers</Link>
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <button className="p-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-white border border-white/40 rounded hover:border-white hover:bg-white/10 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold text-white bg-[#E50914] rounded hover:bg-[#f40612] transition-all shadow-[0_0_15px_rgba(229,9,20,0.4)]"
            >
              Register
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1a1a1a] border-t border-[#2a2a2a] px-4 py-4 space-y-3">
          {['Home','Movies','Cinemas','Offers','About'].map(item => (
            <Link
              key={item}
              to={`/${item === 'Home' ? '' : item.toLowerCase()}`}
              className="block text-gray-300 hover:text-white py-2 border-b border-[#2a2a2a] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Link to="/login" className="flex-1 text-center py-2 border border-white/40 rounded text-white text-sm font-semibold">Sign In</Link>
            <Link to="/register" className="flex-1 text-center py-2 bg-[#E50914] rounded text-white text-sm font-semibold">Register</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
