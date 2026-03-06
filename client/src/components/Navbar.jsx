import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'rgba(7, 13, 26, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(148,163,184,0.08)',
    }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-lg">
            🔗
          </div>
          <span className="font-bold text-base sm:text-lg text-white">LinkVault</span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {token ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {(user?.name || 'U')[0].toUpperCase()}
                </div>
                <span className="text-slate-300 text-sm font-medium truncate max-w-[120px]">{user?.name}</span>
              </div>
              <button onClick={handleLogout}
                className="text-xs sm:text-sm text-slate-400 hover:text-white px-3 py-2 rounded-lg transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-2">
                Sign in
              </Link>
              <Link to="/register"
                className="text-sm text-white font-semibold px-4 py-2 rounded-lg transition-all"
                style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
