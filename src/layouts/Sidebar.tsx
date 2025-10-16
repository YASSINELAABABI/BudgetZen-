import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingCart, CreditCard, Settings, X, ShieldCheck } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Dépenses', href: '/expenses', icon: ShoppingCart },
  { name: 'Charges', href: '/charges', icon: CreditCard },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const NavLinks = () => (
    <nav className="mt-5 flex-1 px-2 space-y-1">
      {navigation.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          end
          className={({ isActive }) =>
            `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`
          }
        >
          <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
          {item.name}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <ShieldCheck className="h-8 w-auto text-primary-600" />
              <span className="ml-3 text-xl font-semibold text-gray-800 dark:text-white">Fin-Dash</span>
            </div>
            <NavLinks />
          </div>
        </div>
        <div className="flex-shrink-0 w-14" />
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <ShieldCheck className="h-8 w-auto text-primary-600" />
                <span className="ml-3 text-xl font-semibold text-gray-800 dark:text-white">Fin-Dash</span>
              </div>
              <NavLinks />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
