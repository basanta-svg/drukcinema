import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, CheckCircle, Film } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const InputField = ({ icon: Icon, label, name, type = 'text', value, onChange, placeholder, extra }) => (
  <div>
    <label className="block text-gray-400 text-xs font-medium mb-1.5 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg pl-10 pr-4 py-3 placeholder-gray-600 focus:outline-none focus:border-[#E50914]/60 transition-colors"
      />
      {extra}
    </div>
  </div>
);

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw,  setShowPw]  = useState(false);
  const [showCf,  setShowCf]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name || !form.email || !form.password) return 'Name, email and password are required.';
    if (form.name.length < 2) return 'Name must be at least 2 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
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
    } finally {
      setLoading(false);
    }
  };

  const pwStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Weak', color: 'bg-red-500', w: 'w-1/3' };
    if (p.length < 10) return { label: 'Fair', color: 'bg-yellow-500', w: 'w-2/3' };
    return { label: 'Strong', color: 'bg-green-500', w: 'w-full' };
  };
  const strength = pwStrength();

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4 py-20">
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
          <p className="text-gray-500 text-sm mt-2">Create your account</p>
        </div>

        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-8">
          <h1 className="text-xl font-bold text-white mb-6">Join DrukCinema</h1>

          {error && (
            <div className="flex items-center gap-2 bg-red-950/50 border border-red-800/50 text-red-400 text-sm px-4 py-3 rounded-lg mb-5">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <InputField icon={User} label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Tenzin Dorji" />

            {/* Email */}
            <InputField icon={Mail} label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />

            {/* Phone (optional) */}
            <InputField icon={Phone} label="Phone (optional)" name="phone" value={form.phone} onChange={handleChange} placeholder="+975 17 XXX XXX" />

            {/* Password */}
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  name="password" type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg pl-10 pr-11 py-3 placeholder-gray-600 focus:outline-none focus:border-[#E50914]/60 transition-colors"
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Strength bar */}
              {strength && (
                <div className="mt-1.5">
                  <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.w}`} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{strength.label} password</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  name="confirm" type={showCf ? 'text' : 'password'}
                  value={form.confirm} onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg pl-10 pr-11 py-3 placeholder-gray-600 focus:outline-none focus:border-[#E50914]/60 transition-colors"
                />
                <button type="button" onClick={() => setShowCf(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showCf ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                {form.confirm && (
                  <div className="absolute right-9 top-1/2 -translate-y-1/2">
                    {form.password === form.confirm
                      ? <CheckCircle size={14} className="text-green-500" />
                      : <AlertCircle size={14} className="text-red-500" />}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-[#E50914] hover:bg-[#c8000f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Creating account…</>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#E50914] hover:underline font-medium">Sign in</Link>
          </p>
        </div>

        <p className="text-center mt-5">
          <Link to="/" className="text-gray-600 hover:text-gray-400 text-sm transition-colors flex items-center justify-center gap-1.5">
            <Film size={13} /> Back to DrukCinema
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
