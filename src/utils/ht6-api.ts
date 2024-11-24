/* eslint-disable prettier/prettier */
import { LoaderFunction, LoaderFunctionArgs, redirect } from 'react-router-dom';

export interface Ht6ApiResponse<Data = string> {
  status: number;
  message: Data;
}

export interface FetchHt6ApiOptions<Payload extends Record<string, unknown>> {
  searchParams?: URLSearchParams;
  payload?: Payload;
  method?: string;
}

type GroupCounts = Record<string, number>;
type Reviewers = Record<string, { total: number; name: string }>;

export interface StatisticsResponse {
  total: number;
  timestamp: number;
  groups: GroupCounts;
  hacker: {
    status: GroupCounts;
    submittedApplicationStats: {
      gender: GroupCounts;
      review: {
        reviewed: number;
        notReviewed: number;
        applicationScores: GroupCounts;
        reviewers: Reviewers;
      };
      questionBreakdown: GroupCounts;
    };
  };
}

export async function fetchHt6Api<
  Result,
  Payload extends Record<string, unknown>,
>(
  path: string,
  {
    payload,
    method = payload ? 'POST' : 'GET',
    searchParams,
  }: FetchHt6ApiOptions<Payload> = {},
) {
  const requestUrl = new URL(path, import.meta.env.VITE_API_HOST);
  if (searchParams) {
    Array.from(searchParams).forEach((keyPair) => {
      requestUrl.searchParams.set(...keyPair);
    });
  }

  const data = await fetch(requestUrl, {
    body: payload ? JSON.stringify(payload) : null,
    headers: {
      'X-Access-Token': window.localStorage.getItem('HT6_token') ?? '',
      'Content-Type': 'application/json',
    },
    method,
  });

  return data.json() as Promise<Ht6ApiResponse<Result>>;
}

export function toLoaderResult<T>(result: Ht6ApiResponse<T>) {
  const res = new Response(JSON.stringify(result.message), {
    statusText: JSON.stringify(result.message),
    status: result.status,
  });
  // eslint-disable-next-line @typescript-eslint/only-throw-error
  if (result.status !== 200) throw res;
  return res;
}

export function loaderAuthCheck(next: LoaderFunction = () => null) {
  return (args: LoaderFunctionArgs) => {
    if (!window.localStorage.getItem('HT6_token')) {
      return redirect('/auth/login');
    }
    return next(args);
  };
}

export const getStatistics = async (update: boolean) => {
  return fetchHt6Api<StatisticsResponse, never>('/api/action/getStatistics', {
    method: 'GET',
    searchParams: new URLSearchParams({ update: update ? 'true' : 'false' }),
  });
};

