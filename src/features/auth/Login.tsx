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

  toLoaderResult(result);
  return redirectDocument(result.message.url);
}

export function Component() {
  return <div>owo login</div>;
}
