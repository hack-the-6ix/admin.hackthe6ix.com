/* eslint-disable prettier/prettier */
import Box from '../../components/box';
import LeaderBoard from './leaderboard';
import { getStatistics, StatisticsResponse } from '../../utils/ht6-api';
import { useState, useEffect } from 'react';
import PieChart from './piechart';

export function Component() {
  const [data, setData] = useState<StatisticsResponse | null>(null);

  const fetchData = async () => {
    try {
      const response = await getStatistics(true);
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
  reviewers.sort((a, b) => b.total - a.total);

  const hackers =
    data?.hacker.status ?
      Object.entries(data.hacker.status)
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        .filter(([, value]) => value != null)
        .map(
          ([key, value]) =>
            `${key.charAt(0).toUpperCase() + String(key).slice(1)}: ${value.toString()}`,
        )
    : [];

  const system =
    data?.groups ?
      Object.entries(data.groups)
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        .filter(([, value]) => value != null)
        .map(
          ([key, value]) =>
            `${key.charAt(0).toUpperCase() + String(key).slice(1)}: ${value.toString()}`,
        )
    : [];
  system.unshift('Last updated: ' + new Date(data?.timestamp ?? 0).toString());

  const genderChart =
    data?.hacker.submittedApplicationStats.gender ?
      Object.entries(data.hacker.submittedApplicationStats.gender).map(
        ([key, value]) => ({
          name: key,
          total: value,
        }),
      )
    : [];

  const totalGenderCount = genderChart.reduce(
    (sum, item) => sum + item.total,
    0,
  );
  const genderDisplay = genderChart.map((item) => {
    const percentage = ((item.total / totalGenderCount) * 100).toFixed(1); // Calculate percentage
    return `${item.name.charAt(0).toUpperCase() + item.name.slice(1)}: ${String(
      item.total,
    )} (${String(percentage)}%)`;
  });

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
        <Box title="System" items={system}></Box>
        <Box title="Hackers" items={hackers}></Box>
        <Box title="Gender" items={genderDisplay}>
          <PieChart data={genderChart} />
        </Box>

        <Box title="Reviews">box2</Box>
        <Box title="Questions">box3</Box>
        <Box title="Grades">box3</Box>
      </div>
    </div>
  );
}
