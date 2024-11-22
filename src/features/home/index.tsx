/* eslint-disable prettier/prettier */
import Box from '../../components/box';
import LeaderBoard from './leaderboard';
import { getStatistics, StatisticsResponse } from '../../utils/ht6-api';
import { useState, useEffect } from 'react';

export function Component() {
  const [data, setData] = useState<StatisticsResponse | null>(null);

  const fetchData = async () => {
    try {
      const response = await getStatistics(true);
      console.log('API response:', response);
      setData(response.message);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const reviewers =
    data?.hacker.submittedApplicationStats.review.reviewers ?
      Object.entries(
        data.hacker.submittedApplicationStats.review.reviewers,
      ).map(([, value]) => ({ name: value.name, total: value.total }))
    : [];

  const hackers =
    data?.hacker.status ?
      Object.entries(data.hacker.status)
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        .filter(([, value]) => value != null) // Exclude entries where value is null or undefined
        .map(([key, value]) => `${key.charAt(0).toUpperCase() + String(key).slice(1)}: ${value.toString()}`) // Format the key-value pairs
    : [];

  reviewers.sort((a, b) => b.total - a.total);

  return (
    <div className="p-4 m-3">
      <div className="m-4 text-left">
        <h1 className="text-5xl font-bold text-primary">Statistics</h1>
        <p className="text-xl font-bold text-slate-500">
          All the numbers at a glance
        </p>
      </div>
      <button
        onClick={() => {
          void fetchData();
        }}
        className="m-4 p-2 pl-4 pr-4 bg-amber-500 rounded-2xl text-white hover:bg-amber-600 dark:hover:bg-primary dark:bg-primary-dark"
      >
        Update Statistics
      </button>

      <LeaderBoard reviewers={reviewers} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        <Box title="System">box4</Box>
        <Box title="Hackers" items={hackers}></Box>
        <Box title="Gender">box1</Box>
        <Box title="Reviews">box2</Box>
        <Box title="Questions">box3</Box>
        <Box title="Grades">box3</Box>
      </div>
    </div>
  );
}
