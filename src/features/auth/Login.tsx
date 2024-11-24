import type { Route } from './+types/Login';
import { fetchHt6Api, toLoaderResult } from '@/utils/ht6-api';
import { redirectDocument } from 'react-router';

export async function loader({ request }: Route.LoaderArgs) {
  const { origin } = new URL(request.url);
  const callbackURL = new URL('/auth/callback', origin);
  const result = await fetchHt6Api<
    { url: string },
    { callbackURL: URL; redirectTo: string }
  >('/auth/organizer/login', {
    payload: {
      redirectTo: origin,
      callbackURL,
    },
  });

  toLoaderResult(result);
  return redirectDocument(result.message.url);
}

export default function Login() {
  return <div>owo login</div>;
}
