import { NavLink } from 'react-router-dom';
import { FiTrendingUp } from 'react-icons/fi';

const Sidebar = ({ navItems }) => {
  return (
    <aside className="w-64 min-h-screen bg-sidebar text-white flex flex-col fixed left-0 top-0">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-hover">
        <FiTrendingUp size={22} className="text-primary" />
        <span className="font-bold text-lg">LeadFlow</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-brand text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;