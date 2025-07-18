import { NavLink, Outlet, useNavigation, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import logo from '../../assets/Logo.svg';
import PageLoader from '../page-loader';

const organizerPages = [
  { label: 'Home', to: '/' },
  { label: 'Hackers', to: '/hackers' },
  { label: 'Applications', to: '/apps' },
  { label: 'Volunteers', to: '/volunteers' },
  { label: 'External Users', to: '/external-users' },
  { label: 'Check In', to: '/checkin' },
  { label: 'Admin Settings', to: '/admin-settings' },
  { label: 'Assign NFC', to: '/assign-nfc' },
];

const volunteerPages = [
  { label: 'Home', to: '/' },
  { label: 'Assign NFC', to: '/assign-nfc' },
  { label: 'Check In', to: '/checkin' },
  { label: 'Hackers', to: '/hackers' },
];

export default function DashboardLayout() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isPageChange =
    !!navigation.location &&
    navigation.location.pathname !== window.location.pathname;

  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark',
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userRole = localStorage.getItem('HT6_user_role') || 'organizer';
  const pages = userRole === 'volunteer' ? volunteerPages : organizerPages;

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/role-select');
  };

  return (
    <div className="flex flex-col h-screen">
      <nav className="sticky top-0 flex justify-between items-center bg-slate-50 dark:bg-slate-950 text-neutral-light dark:text-white p-4 shadow-md w-full">
        <img src={logo} alt="Logo" className="ml-6 h-8 w-8" />

        <div className="hidden md:flex justify-end">
          {pages.map(({ label, to }, idx) => (
            <NavLink
              to={to}
              key={idx}
              className={({ isActive, isPending }) =>
                `px-4 py-2 mx-2 rounded-md text-sm font-medium hover:bg-primary-extralight dark:hover:bg-slate-800 transition ${
                  (
                    navigation.location ? isPending : isActive
                  ) ?
                    'bg-primary-light dark:bg-slate-700'
                  : ''
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="px-4 py-2 mx-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition"
          >
            Log Out
          </button>
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

        <div className="md:hidden flex items-center">
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

          <button
            onClick={toggleMobileMenu}
            className="ml-4 p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ?
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              : <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              }
            </svg>
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700">
          <div className="px-4 py-2 space-y-1">
            {pages.map(({ label, to }, idx) => (
              <NavLink
                to={to}
                key={idx}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive, isPending }) =>
                  `block px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-extralight dark:hover:bg-slate-800 transition ${
                    (
                      navigation.location ? isPending : isActive
                    ) ?
                      'bg-primary-light dark:bg-slate-700'
                    : ''
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="block w-full px-4 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition mt-2"
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      <div className="dark:text-white bg-slate-200 dark:bg-slate-900 flex-grow overflow-y-auto">
        {isPageChange ?
          <PageLoader />
        : <Outlet />}
      </div>
    </div>
  );
}
