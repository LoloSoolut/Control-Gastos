
import React from 'react';
// Fix: Use namespace import for react-router-dom
import * as Router from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, LogOut, Wallet } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface NavigationProps {
  user: User;
}

const Navigation: React.FC<NavigationProps> = ({ user }) => {
  const location = Router.useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/add', label: 'Nuevo Gasto', icon: PlusCircle },
    { path: '/history', label: 'Historial', icon: History },
  ];

  return (
    <nav className="bg-white border-r border-gray-200 w-full md:w-64 flex flex-col h-auto md:h-screen sticky top-0 z-10">
      <div className="p-6 flex items-center gap-2">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Wallet className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">SmartSpend</span>
      </div>

      <div className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <Router.Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              location.pathname === item.path
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </Router.Link>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="px-4 py-3 mb-4 rounded-lg bg-gray-50">
          <p className="text-xs text-gray-500 font-medium truncate">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
