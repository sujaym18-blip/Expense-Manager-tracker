import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Transactions', icon: TrendingUp, path: '/transactions' },
    { name: 'Budget', icon: DollarSign, path: '/budget' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-white/10 backdrop-blur-md rounded-xl transition border border-white/10 text-gray-100"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 h-screen bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-300 z-40 ${
          isOpen ? 'left-0' : '-left-64 md:left-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link to="/dashboard" className="flex items-center gap-2 text-2xl font-bold text-blue-300">
            <DollarSign size={28} />
            <span>Expense</span>
          </Link>
          <p className="text-sm text-gray-400 mt-1">Manager</p>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-white/10 bg-white/5">
            <p className="font-medium text-gray-100">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-xl font-medium transition backdrop-blur-md border ${
                isActive(item.path)
                  ? 'bg-blue-500/30 text-blue-100 border-blue-400/50'
                  : 'text-gray-300 hover:bg-white/10 border-white/10 hover:border-white/20'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-rose-200 hover:bg-rose-500/20 rounded-xl font-medium transition backdrop-blur-md border border-white/10 hover:border-rose-400/50"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
