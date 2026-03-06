import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../store/authSlice';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (token) navigate('/');
    return () => dispatch(clearError());
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: '#070d1a' }}>
      <div className="bg-orb w-80 h-80 sm:w-[500px] sm:h-[500px]"
        style={{ background: 'rgba(124,58,237,0.18)', top: '-80px', right: '-80px' }} />
      <div className="bg-orb w-64 h-64"
        style={{ background: 'rgba(79,70,229,0.12)', bottom: '-60px', left: '-40px' }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl mb-4 shadow-2xl"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}>
            🔗
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">LinkVault</h1>
          <p className="text-slate-500 mt-1.5 text-sm">Start saving your links today — it's free</p>
        </div>

        <div className="glass-card p-6 sm:p-8" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
          <h2 className="text-white font-bold text-xl mb-5">Create Account</h2>

          {error && (
            <div className="flex items-start gap-2 text-red-400 text-sm p-3 rounded-xl mb-4"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); dispatch(registerUser(form)); }} className="flex flex-col gap-4">
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Full Name</label>
              <input type="text" placeholder="John Doe" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required className="input" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required className="input" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6}
                  className="input" style={{ paddingRight: '2.75rem' }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-sm">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-1" style={{ padding: '0.875rem' }}>
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                    Creating account...
                  </span>
                : 'Create Account →'}
            </button>
          </form>

          <p className="text-slate-500 text-sm text-center mt-5">
            Have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
