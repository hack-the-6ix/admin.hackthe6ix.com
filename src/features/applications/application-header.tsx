import Button from '@/components/button';
import React, { FC, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

type SortOption = 'asc' | 'desc';

interface ButtonProps {}

const ApplicationHeader: FC<ButtonProps> = () => {
  const [advanced, setAdvanced] = useState(false);
  const [sortFieldIndex, setSortFieldIndex] = useState(0);
  const [sortField, setSortField] = useState('created');
  const [sortCriteriaIndex, setSortCriteriaIndex] = useState(0);
  const [sortCriteria, setSortCriteria] = useState<SortOption>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const sortCriteriaOptions: SortOption[] = ['asc', 'desc'];
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sortFieldOptions: string[] = [
    'created',
    'firstName',
    'lastName',
    'hackerApplication.lastUpdated',
  ];

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
      params.delete('page');
    } else {
      params.delete('search');
    }
    void navigate(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center flex-wrap mb-3">
        <div className="m-4 text-left mb-6">
          <h1 className="text-5xl font-bold text-primary">Applications</h1>
          <p className="text-xl font-bold text-slate-500 ">
            List of applicants
          </p>
        </div>
        <div className="flex md:flex md:flex-grow flex-row justify-end space-x-3 flex-wrap">
          <Button className="h-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M13.5 4.938a7 7 0 1 1-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 0 1 .572-2.759 6.026 6.026 0 0 1 2.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0 0 13.5 4.938ZM14 12a4 4 0 0 1-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4.043 4.043 0 0 0 1.601.564c.303.038.531-.24.51-.544a5.975 5.975 0 0 1 1.315-4.192.447.447 0 0 1 .431-.16A4.001 4.001 0 0 1 14 12Z"
                clipRule="evenodd"
              />
            </svg>
            <span>View Rank</span>
          </Button>
          <Button className="h-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M13.5 4.938a7 7 0 1 1-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 0 1 .572-2.759 6.026 6.026 0 0 1 2.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0 0 13.5 4.938ZM14 12a4 4 0 0 1-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4.043 4.043 0 0 0 1.601.564c.303.038.531-.24.51-.544a5.975 5.975 0 0 1 1.315-4.192.447.447 0 0 1 .431-.16A4.001 4.001 0 0 1 14 12Z"
                clipRule="evenodd"
              />
            </svg>
            <span> Begin Review</span>
          </Button>
          <Button
            onClick={() => {
              setAdvanced(!advanced);
            }}
            className="h-12"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-1"> Other Filter</span>
          </Button>
          <Button className="h-12">
            <svg
              className="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            </svg>
            <span> Download CSV</span>
          </Button>
        </div>
      </div>
      <div className="w-full pb-4">
        <div className="relative">
          <input
            className="w-full bg-transparent placeholder:text-slate-500 text-slate-900 text-sm border border-slate-900 rounded-xl pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-primary  shadow-sm focus:shadow dark:border-slate-500 dark:focus:border-white"
            placeholder="Search for an applicant..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <button
            className="absolute top-1 right-1 flex items-center rounded-xl bg-primary py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:shadow-none active:bg-slate-700 hover:bg-primary-dark active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={handleSearch}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                clipRule="evenodd"
              />
            </svg>
            Search
          </button>
        </div>
      </div>
      {advanced && (
        <div className="advancedQuery">
          <div>
            <label htmlFor="sortField">Sort Field</label>
            <select
              id="sortField"
              className="advancedQuery"
              value={sortFieldIndex}
              onChange={(e) => {
                const index = Number(e.target.value);
                setSortFieldIndex(index);
                setSortField(sortFieldOptions[index]);
              }}
            >
              {sortFieldOptions.map((option, index) => (
                <option key={option} value={index}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sortCriteria">Sort Criteria</label>
            <select
              id="sortCriteria"
              className="advancedQuery"
              value={sortCriteriaIndex}
              onChange={(e) => {
                const index = Number(e.target.value);
                setSortCriteriaIndex(index);
                setSortCriteria(sortCriteriaOptions[index]);
              }}
            >
              {sortCriteriaOptions.map((option, index) => (
                <option key={option} value={index}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationHeader;
