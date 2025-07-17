import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from '@react-router/dev/routes';

export default [
  route('role-select', 'features/auth/RoleSelect.tsx'),
  layout('components/layouts/Dashboard.tsx', [
    route('admin-settings', 'features/admin-settings/index.tsx'),
    route('apps', 'features/applications/index.tsx'),
    route('user/:id', 'features/user-details/index.tsx'),
    route('external-users', 'features/external-users/index.tsx'),
    route('volunteers', 'features/volunteers/index.tsx'),
    route('review', 'features/review/index.tsx'),
    route('nfc/u/:nfcId', 'features/participant/ParticipantDetail.tsx'),
    route('assign-nfc', 'features/assign-nfc/index.tsx'),
    route('qr-checkIn', 'features/qr-checkIn/index.tsx'),
    index('features/home/index.tsx'),
  ]),
  ...prefix('auth', [
    route('login', 'features/auth/Login.tsx'),
    route('callback', 'features/auth/Callback.tsx'),
    route('volunteer', 'features/auth/VolunteerLogin.tsx'),
  ]),
] satisfies RouteConfig;
