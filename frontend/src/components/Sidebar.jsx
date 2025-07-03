// components/Sidebar.jsx
import React from 'react';
import { HomeIcon, BarChartIcon, SettingsIcon, LogOutIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  const linkStyle = (path) =>
    `flex items-center px-4 py-2 hover:bg-gray-700 rounded ${
      location.pathname === path ? 'bg-gray-700 text-yellow-400' : 'text-white'
    }`;

  return (
    <aside className="bg-gray-900 w-64 flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2 px-6 pt-6">
          {/* Gráfico com as cores da bandeira da Alemanha */}
          <div className="flex items-end space-x-1">
            <div className="w-1.5 h-2 bg-black rounded-sm" />
            <div className="w-1.5 h-3 bg-red-600 rounded-sm" />
            <div className="w-1.5 h-4 bg-yellow-400 rounded-sm" />
          </div>
          <h2 className="text-2xl font-bold text-white">InvestTrack</h2>
        </div>

        <nav className="space-y-2 px-4 mt-4">
          <Link to="/assets" className={linkStyle('/assets')}>
            <HomeIcon className="h-5 w-5 mr-2" /> Home
          </Link>
          <Link to="/analytics" className={linkStyle('/analytics')}>
            <BarChartIcon className="h-5 w-5 mr-2" /> Analytics
          </Link>
          <Link to="/settings" className={linkStyle('/settings')}>
            <SettingsIcon className="h-5 w-5 mr-2" /> Settings
          </Link>
        </nav>
      </div>
      <div className="px-4 py-6">
        <button
          onClick={onLogout}
          className="flex items-center text-red-400 hover:text-red-600 text-sm"
        >
          <LogOutIcon className="h-4 w-4 mr-2" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
