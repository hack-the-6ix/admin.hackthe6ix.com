import React, { useState } from 'react';
import type { Info } from './+types';
import ApplicationHeader from './application-header';
import { getUserProfile, User } from '@/utils/ht6-api';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router';
import Button from '@/components/button';

const columns = new Map<string, [(user: User) => React.ReactNode, string]>([
  ['Name', [(user) => user.fullName, 'user.fullName']],
  [
    'Status',
    [
      (user) => user.status.internalTextStatus,
      'user.status.internalTextStatus',
    ],
  ],
  ['ID', [(user) => user._id, 'user._id']],
  ['Email', [(user) => user.email, 'user.email']],
  [
    'Final Rating',
    [
      (user) => {
        return user.internal.computedFinalApplicationScore ?
            user.internal.computedFinalApplicationScore
          : -1;
      },
      'user.internal.computedFinalApplicationScore',
    ],
  ],
  [
    'Personal Rating',
    [
      (user) => user.internal.computedApplicationScore,
      'user.internal.computedApplicationScore',
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

  const search = url.searchParams.get('search') ?? '';

  const result = await getUserProfile(
    page,
    size,
    sortCriteria as 'asc' | 'desc',
    sortField,
    search,
    { $and: [{ 'groups.hacker': true }] },
  );

  return {
    applicants: result.message,
    currentPage: page,
    totalPage: 50, // fake size figure out how to get later
    size: size,
  };
}

export default function Applications() {
  const data = useLoaderData<Info['loaderData']>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [inputPage, setInputPage] = useState(data.currentPage);

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
    void navigate(`?${params.toString()}`);
  };

  const handlePage = (page: number) => {
    if (page >= 1 && page <= data.totalPage) {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      void navigate(`?${params.toString()}`);
    }
  };

  const handleSize = (size: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('size', size.toString());
    void navigate(`?${params.toString()}`);
  };

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(parseInt(e.target.value));
  };

  return (
    <div className="p-4 m-3">
      <ApplicationHeader />
      <table className="rounded-lg min-w-full table-auto border-collapse text-left">
        <thead className="sticky top-0.5 z-1 bg-slate-50 dark:bg-slate-700 rounded-t-lg ">
          <tr>
            {[...columns.entries()].map(([key, value]) => (
              <th
                key={key}
                className="px-4 py-2 border-b text-sm font-semibold dark:text-white"
                onClick={() => {
                  handleSort(value[1]);
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
        <tbody className="max-h-64 overflow-y-auto">
          {data.applicants.map((user) => (
            <tr
              key={user._id}
              className="bg-gray-100 hover:bg-gray-200  dark:bg-slate-600 dark:hover:bg-slate-700"
            >
              {[...columns.entries()].map(([key, value]) => (
                <td key={key} className="px-4 py-2 border-b text-sm">
                  {value[0](user)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex space-x-3 mt-4 items-center justify-end ">
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
            className="mx-1 pl-2 py-1 border rounded dark:bg-slate-700"
          />
          of {data.totalPage}
          <Button
            buttonType="secondary"
            onClick={() => {
              handlePage(inputPage);
            }}
            className="font-normal ml-2 px-2 py-1 bg-primary hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary"
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
