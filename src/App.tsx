/* eslint-disable prettier/prettier */
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardLayout from './components/layouts/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        lazy: () => import('@/features/admin-settings'),
        path: '/admin-settings',
      },
      {
        lazy: () => import('@/features/applications'),
        path: '/apps',
      },
      {
        lazy: () => import('@/features/external-users'),
        path: '/external-users',
      },
      {
        lazy: () => import('@/features/home'),
        path: '/',
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
