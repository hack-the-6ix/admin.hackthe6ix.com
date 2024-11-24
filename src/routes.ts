import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from '@react-router/dev/routes';

export default [
  layout('components/layouts/Dashboard.tsx', [
    route('admin-settings', 'features/admin-settings/index.tsx'),
    route('apps', 'features/applications/index.tsx'),
    route('external-users', 'features/external-users/index.tsx'),
    index('features/home/index.tsx'),
  ]),
  ...prefix('auth', [
    route('login', 'features/auth/Login.tsx'),
    route('callback', 'features/auth/Callback.tsx'),
  ]),
] satisfies RouteConfig;
