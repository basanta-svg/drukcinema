import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Field = ({ icon: Icon, label, name, type = 'text', value, onChange, placeholder, right }) => (
  <div className="space-y-1.5">
    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{label}</label>
    <div className="relative">
      <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
      <input
        name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full bg-[#1a1a1a] border border-white/8 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 placeholder-gray-700 focus:outline-none focus:border-[#E50914]/50 focus:bg-[#1e1e1e] transition-all"
        style={{ paddingRight: right ? '3rem' : undefined }}
      />
      {right}
    </div>
  </div>
);

const strength = pw => {
  if (!pw) return null;
  if (pw.length < 6)  return { w: 'w-1/3', color: 'bg-red-500',    label: 'Weak',   text: 'text-red-400' };
  if (pw.length < 10) return { w: 'w-2/3', color: 'bg-yellow-500', label: 'Fair',   text: 'text-yellow-400' };
  return               { w: 'w-full', color: 'bg-green-500',  label: 'Strong', text: 'text-green-400' };
};

const RegisterPage = () => {
  const [form,    setForm]    = useState({ name:'', email:'', phone:'', password:'', confirm:'' });
  const [showPw,  setShowPw]  = useState(false);
  const [showCf,  setShowCf]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const { register } = useAuth();
  const navigate     = useNavigate();

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name || !form.email || !form.password) return 'Name, email and password are required.';
    if (form.name.length < 2) return 'Name must be at least 2 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const pw = strength(form.password);
  const match = form.confirm && form.password === form.confirm;

  return (
    <div className="min-h-screen flex bg-[#0e0e0e]">

      {/* ── Left panel ──────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1000&h=1200&fit=crop&q=85"
          alt="Cinema"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e]/20 via-transparent to-[#0e0e0e]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-black/50 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link to="/">
            <span className="text-2xl font-black tracking-widest uppercase">
              <span className="text-[#E50914]">DRUK</span><span className="text-white">CINEMA</span>
            </span>
          </Link>
          <div>
            <h2 className="text-white text-3xl font-black leading-snug mb-4">
              Join Thousands<br/>of Film Lovers
            </h2>
            {/* Feature list */}
            {['Book tickets instantly', 'Choose your seats', 'Get exclusive offers', 'Easy e-tickets'].map(item => (
              <div key={item} className="flex items-center gap-2.5 mb-2">
                <div className="w-5 h-5 rounded-full bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center flex-shrink-0">
                  <Check size={10} className="text-[#E50914]" />
                </div>
                <span className="text-white/70 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ──────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 text-center">
          <Link to="/">
            <span className="text-2xl font-black tracking-widest uppercase">
              <span className="text-[#E50914]">DRUK</span><span className="text-white">CINEMA</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Create account</h1>
            <p className="text-gray-500">Join DrukCinema and start booking</p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 bg-red-950/40 border border-red-800/50 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
              <AlertCircle size={15} className="flex-shrink-0" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field icon={User}  label="Full Name"        name="name"  value={form.name}  onChange={onChange} placeholder="Tenzin Dorji" />
            <Field icon={Mail}  label="Email Address"    name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" />
            <Field icon={Phone} label="Phone (optional)" name="phone" value={form.phone} onChange={onChange} placeholder="+975 17 XXX XXX" />

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={onChange}
                  placeholder="Min. 6 characters"
                  className="w-full bg-[#1a1a1a] border border-white/8 text-white text-sm rounded-xl pl-11 pr-12 py-3.5 placeholder-gray-700 focus:outline-none focus:border-[#E50914]/50 focus:bg-[#1e1e1e] transition-all" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {pw && (
                <div>
                  <div className="h-1 bg-white/6 rounded-full overflow-hidden mt-1.5">
                    <div className={`h-full rounded-full transition-all duration-500 ${pw.color} ${pw.w}`} />
                  </div>
                  <p className={`text-xs mt-1 ${pw.text}`}>{pw.label} password</p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input name="confirm" type={showCf ? 'text' : 'password'} value={form.confirm} onChange={onChange}
                  placeholder="Re-enter password"
                  className={`w-full bg-[#1a1a1a] border text-white text-sm rounded-xl pl-11 pr-12 py-3.5 placeholder-gray-700 focus:outline-none transition-all ${
                    form.confirm ? (match ? 'border-green-600/50 focus:border-green-500/50' : 'border-red-700/50 focus:border-red-600/50') : 'border-white/8 focus:border-[#E50914]/50'
                  } focus:bg-[#1e1e1e]`} />
                <button type="button" onClick={() => setShowCf(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors">
                  {showCf ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {form.confirm && (
                <p className={`text-xs ${match ? 'text-green-400' : 'text-red-400'}`}>
                  {match ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-[#E50914] hover:bg-[#c8000f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-[0_4px_24px_rgba(229,9,20,0.25)]">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account…</>
                : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/6" />
            <span className="text-gray-700 text-xs">Have an account?</span>
            <div className="flex-1 h-px bg-white/6" />
          </div>

          <Link to="/login"
            className="block w-full text-center py-3.5 bg-white/6 hover:bg-white/10 border border-white/8 hover:border-white/15 text-white font-semibold rounded-xl transition-all text-sm">
            Sign In
          </Link>

          <p className="text-center text-gray-700 text-xs mt-8">
            © 2025 DrukCinema Pvt. Ltd. · Thimphu, Bhutan
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
