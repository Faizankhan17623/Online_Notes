import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

const S = {
  nav: {
    background: '#1e293b',
    borderBottom: '1px solid #334155',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: '#6366f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    flexShrink: 0,
  },
  logoText: {
    fontWeight: 700,
    fontSize: '1rem',
    color: '#f1f5f9',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.25rem 0.75rem 0.25rem 0.375rem',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '6px',
  },
  avatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#6366f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#fff',
    flexShrink: 0,
  },
  userName: {
    color: '#cbd5e1',
    fontSize: '0.875rem',
    maxWidth: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    padding: '0.375rem 0.875rem',
    background: 'transparent',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#94a3b8',
    fontSize: '0.875rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  signInLink: {
    color: '#94a3b8',
    fontSize: '0.875rem',
    textDecoration: 'none',
    padding: '0.375rem 0.5rem',
  },
  registerLink: {
    padding: '0.375rem 0.875rem',
    background: '#6366f1',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: 600,
    textDecoration: 'none',
  },
};

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav style={S.nav}>
      <div style={S.inner}>
        <Link to="/" style={S.logo}>
          <div style={S.logoIcon}>🔗</div>
          <span style={S.logoText}>LinkVault</span>
        </Link>

        <div style={S.right}>
          {token ? (
            <>
              <div style={S.userBadge}>
                <div style={S.avatar}>{(user?.name || 'U')[0].toUpperCase()}</div>
                <span style={S.userName}>{user?.name}</span>
              </div>
              <button onClick={handleLogout} style={S.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={S.signInLink}>Sign in</Link>
              <Link to="/register" style={S.registerLink}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
