
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Wallet, LayoutGrid, Settings } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    {
      path: '/dashboard',
      label: 'Home',
      icon: <Home className="h-5 w-5" />
    },
    {
      path: '/wallet',
      label: 'Wallet',
      icon: <Wallet className="h-5 w-5" />
    },
    {
      path: '/plans',
      label: 'Plans',
      icon: <LayoutGrid className="h-5 w-5" />
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 h-16">
      <div className="grid grid-cols-4 h-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center"
            >
              <div className={`${isActive ? 'text-emerald-500' : 'text-gray-400'}`}>
                {item.icon}
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'text-emerald-500' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
