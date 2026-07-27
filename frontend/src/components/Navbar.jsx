import { FiLogOut, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        <p className="text-sm text-text-secondary">Welcome back,</p>
        <p className="font-semibold text-text-primary">{user?.name}</p>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 px-3 py-2 rounded-brand border border-border text-text-primary hover:bg-background transition-colors text-sm font-medium"
        >
          <FiUser size={16} />
          Profile
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-brand bg-danger text-white hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;