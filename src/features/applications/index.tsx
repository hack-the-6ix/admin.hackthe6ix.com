/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React, { Suspense, useState, useEffect } from 'react';
import type { Info } from './+types';
import ApplicationHeader from './application-header';
import { getUser, getRankedUser, User } from '@/utils/ht6-api';
import {
  useLoaderData,
  useNavigate,
  useSearchParams,
  Await,
} from 'react-router';
import Button from '@/components/button';

// Table header name, function to get data, path for sorting, width
const columns = new Map<
  string,
  [(user: User) => React.ReactNode, string, string]
>([
  ['Name', [(user) => user.fullName, 'lastName', 'w-[250px]']],
  [
    'Status',
    [
      (user) => user.status.internalTextStatus,
      'status.internalTextStatus',
      'w-[200px]',
    ],
  ],
  ['ID', [(user) => user._id, '_id', 'w-[100px]']],
  ['Email', [(user) => user.email, 'email', 'w-[300px]']],
  [
    'Final Rating',
    [
      (user) => {
        return user.internal.computedFinalApplicationScore ?
            user.internal.computedFinalApplicationScore
          : 'No Rank';
      },
      'internal.computedFinalApplicationScore',
      'w-[200px]',
    ],
  ],
  [
    'Personal Rating',
    [
      (user) => {
        return user.internal.computedApplicationScore !== -1 ?
            user.internal.computedApplicationScore
          : 'No Rank';
      },
      'internal.computedApplicationScore',
      'w-[200px]',
    ],
  ],
]);

export async function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') ?? '1');
  const size = parseInt(url.searchParams.get('size') ?? '10');
  const sortCriteria =
    (
      url.searchParams.get('sortCriteria') === 'asc' ||
      url.searchParams.get('sortCriteria') === 'desc'
    ) ?
      url.searchParams.get('sortCriteria')
    : 'asc';
  const sortField = url.searchParams.get('sortField') ?? '';
  const isRanked = url.searchParams.get('isRanked') ?? 'false';
  const search = url.searchParams.get('search') ?? '';

  const applicantsData = await (isRanked === 'false' ?
    getUser(page, size, sortCriteria as 'asc' | 'desc', sortField, search, {
      $and: [{ 'groups.hacker': true }],
    })
  : getRankedUser());

  return {
    applicants: applicantsData.message,
    currentPage: page,
    totalPage: 50,
    size: size,
    isRanked: isRanked === 'true',
  };
}

export default function Applications() {
  const data = useLoaderData<Info['loaderData']>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [inputPage, setInputPage] = useState(data.currentPage);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const handleSort = (field?: string) => {
    if (!field) return;

    const currentSortField = searchParams.get('sortField');
    const currentSortCriteria = searchParams.get('sortCriteria');

    const params = new URLSearchParams(searchParams);

    if (currentSortField === field) {
      if (currentSortCriteria === 'asc') {
        params.set('sortCriteria', 'desc');
      } else if (currentSortCriteria === 'desc') {
        params.delete('sortField');
        params.delete('sortCriteria');
      } else {
        params.set('sortCriteria', 'asc');
      }
    } else {
      params.set('sortField', field);
      params.set('sortCriteria', 'asc');
    }
    setIsTableLoading(true);
    void navigate(`?${params.toString()}`);
  };

  const handleRanked = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isRanked', !data.isRanked ? 'true' : 'false');
    params.delete('sortField');
    params.delete('sortCriteria');
    setIsTableLoading(true);
    void navigate(`?${params.toString()}`);
  };

  const handlePage = (page: number) => {
    if (page >= 1 && page <= data.totalPage) {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      setIsTableLoading(true);
      void navigate(`?${params.toString()}`);
    }
  };

  const handleSize = (size: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('size', size.toString());
    setIsTableLoading(true);
    void navigate(`?${params.toString()}`);
  };

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(parseInt(e.target.value));
  };

  useEffect(() => {
    setIsTableLoading(false);
  }, [data]);

  useEffect(() => {
    setInputPage(data.currentPage);
  }, [data.currentPage]);

  const TableLoadingIndicator = () => (
    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-50/80 dark:bg-slate-800 text-center py-2 px-4 rounded-lg shadow-md">
      <span className="font-semibold text-primary dark:text-white">
        Loading data...
      </span>
    </div>
  );

  const scrollToTop = () => {
    console.log(document.body.scrollHeight);
    document.querySelector('#top')?.scrollIntoView();
  };

  return (
    <div className="p-4 m-3" id="top">
      <ApplicationHeader isRanked={data.isRanked} handleRanked={handleRanked} />
      <div>
        {isTableLoading && <TableLoadingIndicator />}
        <table className="min-w-full table-fixed border-collapse text-left">
          <thead className="sticky top-0.5 z-1 bg-slate-50 dark:bg-slate-700 rounded-t-lg">
            <tr>
              {[...columns.entries()].map(([key, value]) => (
                <th
                  key={key}
                  className={`px-2 py-2 border-b text-sm font-semibold dark:text-white dark:border-slate-600 ${value[2]} truncate`}
                  onClick={() => {
                    if (!data.isRanked && key != 'Status') handleSort(value[1]);
                  }}
                >
                  {key}
                  {searchParams.get('sortField') === value[1] &&
                    (searchParams.get('sortCriteria') === 'asc' ? ' ↑'
                    : searchParams.get('sortCriteria') === 'desc' ? ' ↓'
                    : '')}
                </th>
              ))}
            </tr>
          </thead>
          <Suspense>
            <Await resolve={data} errorElement={<p>Oh no...</p>}>
              <tbody className="max-h-64 overflow-y-auto">
                {data.applicants?.map((user) => (
                  <tr
                    key={user._id}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-500 dark:hover:bg-slate-700"
                    onClick={() => {
                      void navigate(`/user/${user._id}`);
                    }}
                  >
                    {[...columns.entries()].map(([key, value]) => (
                      <td
                        key={key}
                        className={`px-2 py-2 border-b border-gray-200 dark:border-slate-600 text-sm truncate ${value[2]}`}
                      >
                        {value[0](user)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Await>
          </Suspense>
        </table>
      </div>
      <div className="flex space-x-3 mt-4 items-center justify-end" id="bottom">
        {parseInt(searchParams.get('size') ?? '10') > 10 && (
          <Button
            buttonType="primary"
            onClick={scrollToTop}
            className="font-normal px-2 py-1 dark:bg-primary-dark dark:hover:bg-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 18.75 7.5-7.5 7.5 7.5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 7.5-7.5 7.5 7.5"
              />
            </svg>
          </Button>
        )}
        <select
          className="mx-1 pl-2 py-1 border rounded dark:bg-slate-700"
          value={data.size}
          onChange={(e) => {
            handleSize(parseInt(e.target.value));
          }}
        >
          <option value="10" className="dark:bg-slate-500">
            10 per page
          </option>
          <option value="25" className="dark:bg-slate-500">
            25 per page
          </option>
          <option value="50" className="dark:bg-slate-500">
            50 per page
          </option>
          <option value="100" className="dark:bg-slate-500">
            100 per page
          </option>
        </select>
        <Button
          buttonType="secondary"
          onClick={() => {
            handlePage(data.currentPage - 1);
          }}
          disabled={data.currentPage === 1}
          className="font-normal bg-transparent px-2 py-1 disabled:opacity-50 dark:text-white dark:hover:bg-slate-700"
        >
          &lt;
        </Button>
        <span>
          Page
          <input
            type="number"
            min="1"
            max={data.totalPage}
            value={inputPage}
            onChange={handlePageInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handlePage(inputPage);
              }
            }}
            className="mx-1 pl-2 py-1 border rounded dark:bg-slate-700"
          />
          of {data.totalPage}
          <Button
            buttonType="secondary"
            onClick={() => {
              handlePage(inputPage);
            }}
            className="font-normal ml-2 px-2 py-1 bg-primary hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary dark:text-white"
          >
            Go
          </Button>
        </span>
        <Button
          buttonType="secondary"
          onClick={() => {
            handlePage(data.currentPage + 1);
          }}
          disabled={data.currentPage === data.totalPage}
          className="font-normal px-2 py-1 bg-transparent	 disabled:opacity-50  dark:text-white dark:hover:bg-slate-700"
        >
          &gt;
        </Button>
      </div>
    </div>
  );
}
