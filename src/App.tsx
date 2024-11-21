/* eslint-disable prettier/prettier */
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardLayout from './components/layouts/Dashboard';
import { loaderAuthCheck } from './utils/ht6-api';

export const router = createBrowserRouter([
  {
    path: '/',
    loader: loaderAuthCheck(),
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
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        lazy: () => import('@/features/auth/Login'),
      },
      {
        path: 'callback',
        lazy: () => import('@/features/auth/Callback'),
      },
    ],
  },
]);

function App() {
  return (
    <RouterProvider future={{ v7_startTransition: true }} router={router} />
  );
}

export default App;
