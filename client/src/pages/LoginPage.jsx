import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname || '/';

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-[#0e0e0e]">

      {/* ── Left panel — cinematic backdrop ───────── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=900&fit=crop&q=85"
          alt="Cinema"
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e]/30 via-transparent to-[#0e0e0e]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-black/40 to-transparent" />

        {/* Content over image */}
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          {/* Logo */}
          <Link to="/">
            <span className="text-2xl font-black tracking-widest uppercase">
              <span className="text-[#E50914]">DRUK</span>
              <span className="text-white">CINEMA</span>
            </span>
          </Link>

          {/* Bottom text */}
          <div>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Bhutan's Premier Cinema</p>
            <h2 className="text-white text-3xl font-black leading-snug mb-4">
              Experience the Magic<br/>of Bhutanese Cinema
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Book tickets for the latest films from the Land of the Thunder Dragon.
              From Himalayan dramas to epic cultural stories.
            </p>
            {/* Dots */}
            <div className="flex gap-2 mt-8">
              {[0,1,2].map(i => (
                <div key={i} className={`rounded-full ${i===0 ? 'w-6 h-2 bg-[#E50914]' : 'w-2 h-2 bg-white/25'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ─────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 relative">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10 text-center">
          <Link to="/">
            <span className="text-2xl font-black tracking-widest uppercase">
              <span className="text-[#E50914]">DRUK</span><span className="text-white">CINEMA</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
            <p className="text-gray-500">Sign in to your DrukCinema account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-950/40 border border-red-800/50 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
              <AlertCircle size={15} className="flex-shrink-0" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  name="email" type="email" value={form.email} onChange={onChange}
                  placeholder="you@example.com" autoComplete="email"
                  className="w-full bg-[#1a1a1a] border border-white/8 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 placeholder-gray-700 focus:outline-none focus:border-[#E50914]/50 focus:bg-[#1e1e1e] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Password</label>
                <a href="#" className="text-[#E50914] text-xs hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  name="password" type={show ? 'text' : 'password'} value={form.password} onChange={onChange}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full bg-[#1a1a1a] border border-white/8 text-white text-sm rounded-xl pl-11 pr-12 py-3.5 placeholder-gray-700 focus:outline-none focus:border-[#E50914]/50 focus:bg-[#1e1e1e] transition-all"
                />
                <button type="button" onClick={() => setShow(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-[#E50914] hover:bg-[#c8000f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-[0_4px_24px_rgba(229,9,20,0.25)]">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Signing in…</>
                : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-white/6" />
            <span className="text-gray-700 text-xs">New to DrukCinema?</span>
            <div className="flex-1 h-px bg-white/6" />
          </div>

          <Link to="/register"
            className="block w-full text-center py-3.5 bg-white/6 hover:bg-white/10 border border-white/8 hover:border-white/15 text-white font-semibold rounded-xl transition-all text-sm">
            Create an account
          </Link>

          <p className="text-center text-gray-700 text-xs mt-8">
            © 2025 DrukCinema Pvt. Ltd. · Thimphu, Bhutan
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
