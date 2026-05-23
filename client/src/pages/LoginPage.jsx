import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Film } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4 py-20">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E50914]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <span className="text-3xl font-black tracking-widest uppercase">
              <span className="text-[#E50914]">DRUK</span>
              <span className="text-white">CINEMA</span>
            </span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-8">
          <h1 className="text-xl font-bold text-white mb-6">Welcome back</h1>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-950/50 border border-red-800/50 text-red-400 text-sm px-4 py-3 rounded-lg mb-5">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg pl-10 pr-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#E50914]/60 transition-colors"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-[#E50914] text-xs hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  name="password"
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg pl-10 pr-11 py-3 placeholder-gray-600 focus:outline-none focus:border-[#E50914]/60 transition-colors"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#E50914] hover:bg-[#c8000f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-gray-600 text-xs">OR</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Demo credentials hint */}
          <div className="bg-[#E50914]/5 border border-[#E50914]/15 rounded-lg px-4 py-3 mb-5">
            <p className="text-gray-400 text-xs leading-relaxed">
              <span className="text-[#E50914] font-semibold">Demo:</span>{' '}
              Register a new account to try the full booking flow.
            </p>
          </div>

          <p className="text-center text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#E50914] hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>

        {/* Back to site */}
        <p className="text-center mt-5">
          <Link to="/" className="text-gray-600 hover:text-gray-400 text-sm transition-colors flex items-center justify-center gap-1.5">
            <Film size={13} />
            Back to DrukCinema
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
