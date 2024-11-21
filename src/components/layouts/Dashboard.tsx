/* eslint-disable prettier/prettier */
import { NavLink, Outlet } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.svg';

const pages = [
  { label: 'Home', to: '/' },
  { label: 'Applications', to: '/apps' },
  { label: 'External Users', to: '/external-users' },
  { label: 'Admin Settings', to: '/admin-settings' },
];

export default function DashboardLayout() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark',
  );

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="flex flex-col h-screen">
      <nav className="sticky top-0 flex justify-between items-center bg-slate-50 dark:bg-slate-950 text-neutral-light dark:text-white p-4 shadow-md w-full">
        <img src={logo} alt="Logo" className="ml-6 h-8 w-8" />
        <div className="justify-end">
        {pages.map(({ label, to }, idx) => (
          <NavLink
            to={to}
            key={idx}
            className={({ isActive }) =>
              `px-4 py-2 mx-2 rounded-md text-sm font-medium hover:bg-primary-extralight dark:hover:bg-slate-800 transition ${
                isActive ? 'bg-primary-light dark:bg-slate-700' : ''
              }`
            }
          >
            {label}
          </NavLink>
        ))}
        <label className="mx-2 relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
          <div className="w-10 h-5 bg-slate-300 rounded-full dark:bg-slate-700">
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                isDarkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </label>
        </div>
      </nav>
      <div className="dark:text-white bg-slate-200 dark:bg-slate-900 flex-grow overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
