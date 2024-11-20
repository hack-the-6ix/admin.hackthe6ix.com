import { NavLink, Outlet } from 'react-router-dom';

const pages = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Applications',
    to: '/apps',
  },
  {
    label: 'External Users',
    to: '/external-users',
  },
  {
    label: 'Admin Settings',
    to: '/admin-settings',
  },
];

// TODO: Add links and stuff
export default function DashboardLayout() {
  return (
    <div className="container mx-auto px-4">
      <nav className="flex">
        {pages.map(({ label, to }, idx) => (
          <NavLink to={to} key={idx}>
            {label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
