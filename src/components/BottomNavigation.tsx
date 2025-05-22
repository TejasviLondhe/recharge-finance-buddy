
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { Home, Wallet, Phone, Settings } from 'lucide-react';

export const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 py-2 px-4 border-t border-gray-200 dark:border-gray-700 shadow-lg z-10">
      <div className="flex justify-around items-center">
        <Link to="/dashboard" className="flex flex-col items-center p-2">
          <Home 
            size={20} 
            className={isActive("/dashboard") 
              ? "text-emerald-500" 
              : "text-gray-500 dark:text-gray-400"
            } 
          />
          <span className={`text-xs mt-1 ${isActive("/dashboard") 
            ? "text-emerald-500" 
            : "text-gray-500 dark:text-gray-400"}`}
          >
            Home
          </span>
        </Link>
        
        <Link to="/plans" className="flex flex-col items-center p-2">
          <Phone 
            size={20} 
            className={isActive("/plans") 
              ? "text-emerald-500" 
              : "text-gray-500 dark:text-gray-400"
            } 
          />
          <span className={`text-xs mt-1 ${isActive("/plans") 
            ? "text-emerald-500" 
            : "text-gray-500 dark:text-gray-400"}`}
          >
            Plans
          </span>
        </Link>
        
        <Link to="/wallet" className="flex flex-col items-center p-2">
          <Wallet 
            size={20} 
            className={isActive("/wallet") 
              ? "text-emerald-500" 
              : "text-gray-500 dark:text-gray-400"
            } 
          />
          <span className={`text-xs mt-1 ${isActive("/wallet") 
            ? "text-emerald-500" 
            : "text-gray-500 dark:text-gray-400"}`}
          >
            Wallet
          </span>
        </Link>
        
        <Link to="/settings" className="flex flex-col items-center p-2">
          <Settings 
            size={20} 
            className={isActive("/settings") 
              ? "text-emerald-500" 
              : "text-gray-500 dark:text-gray-400"
            } 
          />
          <span className={`text-xs mt-1 ${isActive("/settings") 
            ? "text-emerald-500"  
            : "text-gray-500 dark:text-gray-400"}`}
          >
            Settings
          </span>
        </Link>
      </div>
    </nav>
  );
};
