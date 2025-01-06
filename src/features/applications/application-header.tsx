import Button from '@/components/button';
import React, { FC, useState } from 'react';

type SortOption = 'asc' | 'desc';

interface ButtonProps {
  isRanked: boolean;
  handleRanked: () => void;
}

const ApplicationHeader: FC<ButtonProps> = ({ isRanked, handleRanked }) => {
  const [advanced, setAdvanced] = useState(false);
  const [sortFieldIndex, setSortFieldIndex] = useState(0);
  const [sortField, setSortField] = useState('created');
  const [sortCriteriaIndex, setSortCriteriaIndex] = useState(0);
  const [sortCriteria, setSortCriteria] = useState<SortOption>('asc');

  const sortCriteriaOptions: SortOption[] = ['asc', 'desc'];

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center flex-wrap mb-3">
        <div className="mt-4 text-left mb-6">
          <h1 className="text-5xl font-bold text-primary">Applications</h1>
          <p className="text-xl font-bold text-slate-500 ">
            List of applicants
          </p>
        </div>
        <div className="flex md:flex md:flex-grow flex-row justify-end space-x-3 flex-wrap">
          <Button className="h-12" onClick={handleRanked}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4"
            >
              <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
              <path
                fillRule="evenodd"
                d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                clipRule="evenodd"
              />
            </svg>
            <span>{isRanked ? 'View No Rank' : 'View Final Rank'}</span>
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
      {advanced && (
        <div>
          <div className="space-x-2">
            <label htmlFor="sortField">Sort Field</label>
            <select id="sortField" value={sortFieldIndex}>
              <option value="created">Created</option>
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="hackerApplication.lastUpdated">
                Last Updated
              </option>
            </select>
          </div>
          <div className="space-x-2">
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
