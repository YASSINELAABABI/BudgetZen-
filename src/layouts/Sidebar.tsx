import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingCart, CreditCard, Settings, X, ShieldCheck } from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: Home },
  { name: 'Depenses', href: '/expenses', icon: ShoppingCart },
  { name: 'Charges', href: '/charges', icon: CreditCard },
  { name: 'Parametres', href: '/settings', icon: Settings },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const NavLinks = () => (
    <nav className="mt-6 flex-1 space-y-1 px-3">
      {navigation.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          end
          className={({ isActive }) =>
            `group flex items-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/60 dark:hover:text-gray-100'
            }`
          }
        >
          <item.icon
            className="mr-3 h-5 w-5 flex-shrink-0 transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-200"
            aria-hidden="true"
          />
          {item.name}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      <div className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/70" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-gray-900 shadow-xl">
          <div className="absolute right-0 top-0 -mr-10 pt-3">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-6 pt-5">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-semibold text-gray-900 dark:text-gray-50">BudgetZen</span>
            </div>
            <NavLinks />
          </div>
        </div>
        <div className="w-14 flex-shrink-0" />
      </div>

      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="flex items-center space-x-3 px-6 pt-6">
              <ShieldCheck className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-semibold text-gray-900 dark:text-gray-50">BudgetZen</span>
            </div>
            <NavLinks />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

