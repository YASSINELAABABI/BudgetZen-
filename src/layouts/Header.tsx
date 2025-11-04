import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, LogOut, User as UserIcon, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const PAGE_TITLES: Record<string, string> = {
  '/': 'Tableau de bord',
  '/expenses': 'Depenses',
  '/charges': 'Charges',
  '/settings': 'Parametres',
};

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

    const title = useMemo(() => {
    const match = Object.entries(PAGE_TITLES).find(([route]) => route !== '/' && location.pathname.startsWith(route));
    return match ? match[1] : PAGE_TITLES[location.pathname] ?? 'Tableau de bord';
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="relative z-10 flex h-16 flex-shrink-0 items-center border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:px-8">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex flex-1 items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">{title}</h1>
          <p className="hidden text-xs text-gray-500 dark:text-gray-400 sm:block">
            Nous sommes le {new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date())}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden rounded-full border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 md:inline-flex"
          >
            <Bell className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            aria-label="Changer de theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              type="button"
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={
                  user?.avatarUrl ??
                  (user?.email
                    ? `https://www.gravatar.com/avatar/${btoa(user.email)}?d=identicon`
                    : 'https://www.gravatar.com/avatar/?d=mp')
                }
                alt="Avatar utilisateur"
              />
              <span className="hidden sm:inline">{user?.name ?? 'Utilisateur'}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-lg border border-gray-100 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="px-4 pb-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/settings');
                    setDropdownOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                >
                  <UserIcon className="h-4 w-4" />
                  Parametres
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:text-red-300 dark:hover:bg-red-900/30 dark:hover:text-red-200"
                >
                  <LogOut className="h-4 w-4" />
                  Deconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;



