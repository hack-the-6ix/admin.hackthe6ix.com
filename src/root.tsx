import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import type { Route } from './+types/root';
import './index.css';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router';

export function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Admin Dashboard</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const navigate = useNavigate();
  const resetApp = () => {
    window.localStorage.clear();
    void navigate('/auth/login');
  };
  if (isRouteErrorResponse(error)) {
    return (
      <div className="container flex items-center justify-center h-dvh mx-auto px-4">
        <main className="bg-white shadow-sm border border-slate-200 rounded-lg p-4 flex flex-col gap-4 max-w-prose">
          <h1 className="text-center font-semibold text-xl">
            Route Error - {error.status}
          </h1>
          <code className="text-center text-xs rounded-sm bg-slate-100 p-2">
            {error.statusText}
          </code>
          <button
            onClick={resetApp}
            className="rounded transition-colors font-medium bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white mx-auto px-3 py-1"
          >
            Reset App
          </button>
        </main>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="container flex items-center justify-center h-dvh mx-auto px-4">
        <main className="bg-white shadow-sm border border-slate-200 rounded-lg p-4 flex flex-col gap-4 max-w-prose">
          <h1 className="text-center font-semibold text-xl">
            Runtime Error - {error.message}
          </h1>
          <code className="text-center text-xs rounded-sm bg-slate-100 p-2">
            {error.stack}
          </code>
          <button
            onClick={resetApp}
            className="rounded transition-colors font-medium bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white mx-auto px-3 py-1"
          >
            Reset App
          </button>
        </main>
      </div>
    );
  } else {
    return (
      <div className="container flex flex-col items-center justify-center h-dvh mx-auto px-4">
        <main className="bg-white shadow-sm border border-slate-200 rounded-lg p-4 flex flex-col gap-4 max-w-prose">
          <h1 className="text-center font-semibold text-xl">Unknown Error</h1>
          <button
            onClick={resetApp}
            className="rounded transition-colors font-medium bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white mx-auto px-3 py-1"
          >
            Reset App
          </button>
        </main>
      </div>
    );
  }
}

export function HydrateFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-100 dark:bg-slate-900">
      <div className="flex flex-col items-center text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid border-opacity-50"></div>
        <p className="mt-4 text-2xl font-semibold text-slate-800 dark:text-white">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}

export default function Root() {
  return <Outlet />;
}
