import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../utils/constants';
import { useTheme } from '../hooks/useTheme';

export default function Sidebar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6 dark:border-gray-700">
        <span className="text-2xl">🚛</span>
        <div>
          <h1 className="text-lg font-bold text-primary-600 dark:text-primary-400">TransitOps</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Fleet Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <span>{isDark ? '☀️' : '🌙'}</span>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </aside>
  );
}
