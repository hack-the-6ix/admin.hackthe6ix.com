import { fetchHt6Api, toLoaderResult } from '@/utils/ht6-api';
import { LoaderFunctionArgs, redirectDocument } from 'react-router-dom';

export async function loader({ request }: LoaderFunctionArgs) {
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

  // TODO: IDK WHY THIS NO WORKS PROPERLY
  if (import.meta.env.DEV) {
    const url = new URL(result.message.url);
    url.searchParams.set('redirect_uri', callbackURL.toString());
    url.searchParams.set('state', JSON.stringify({ callbackURL }));
    result.message.url = url.toString();
  }

  toLoaderResult(result);
  return redirectDocument(result.message.url);
}

export function Component() {
  return <div>owo login</div>;
}
