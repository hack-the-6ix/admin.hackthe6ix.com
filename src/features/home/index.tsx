/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import Box from '../../components/box';
import LeaderBoard from './leaderboard';
import { getStatistics, StatisticsResponse } from '../../utils/ht6-api';
import { useState, useEffect } from 'react';
import PieChart from './piechart';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const calculatePercentage = (value: number, total: number) =>
  total > 0 ? ((value / total) * 100).toFixed(1) : '0';

const formatKeyValue = (key: string, value: number, total: number) =>
  `${capitalize(key)}: ${String(value)} (${calculatePercentage(value, total)}%)`;

const formatEntries = (
  entries: Record<string, number>,
  total: number,
): string[] =>
  Object.entries(entries).map(([key, value]) =>
    formatKeyValue(key, value, total),
  );

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

  const downloadJSON = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '6ixStatistics.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const reviewed = data?.hacker.submittedApplicationStats.review.reviewed ?? 0;
  const notReviewed =
    data?.hacker.submittedApplicationStats.review.notReviewed ?? 0;
  const totalReviews = reviewed + notReviewed;

  const reviewDisplay = formatEntries(
    { Reviewed: reviewed, 'Not Reviewed': notReviewed },
    totalReviews,
  );

  const questionsDisplay =
    data?.hacker.submittedApplicationStats.review.applicationScores ?
      formatEntries(
        data.hacker.submittedApplicationStats.review.applicationScores,
        totalReviews,
      )
    : [];

  const hackers =
    data?.hacker.status ?
      formatEntries(data.hacker.status, data.groups?.hacker ?? 1)
    : [];

  const system =
    data?.groups ?
      [
        'Last updated: ' + new Date(data?.timestamp ?? 0).toString(),
        ...formatEntries(data.groups, data.total),
      ]
    : [];

  const genderChart =
    data?.hacker.submittedApplicationStats.gender ?
      Object.entries(data.hacker.submittedApplicationStats.gender).map(
        ([key, value]) => ({ name: capitalize(key), total: value }),
      )
    : [];

  const totalGenderCount = genderChart.reduce(
    (sum, item) => sum + item.total,
    0,
  );

  const genderDisplay = genderChart.map((item) =>
    formatKeyValue(item.name, item.total, totalGenderCount),
  );

  const questionsAnswered =
    data?.hacker.submittedApplicationStats.questionBreakdown ?
      formatEntries(
        data.hacker.submittedApplicationStats.questionBreakdown,
        data.groups?.hacker ?? 1,
      )
    : [];

  const reviewers =
    data?.hacker.submittedApplicationStats.review.reviewers ?
      Object.entries(
        data.hacker.submittedApplicationStats.review.reviewers,
      ).map(([, value]) => ({ name: value.name, total: value.total }))
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

      <button
        onClick={downloadJSON}
        className="m-4 p-2 pl-4 pr-4 bg-amber-500 rounded-2xl text-white hover:bg-amber-600 dark:hover:bg-primary dark:bg-primary-dark"
      >
        Download Data
      </button>

      <LeaderBoard reviewers={reviewers} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        <Box title="System Status" items={system}></Box>
        <Box title="Applications" items={reviewDisplay}>
          <PieChart
            data={[
              { name: 'Reviewed', total: reviewed },
              { name: 'Not Reviewed', total: notReviewed },
            ]}
          />
        </Box>
        <Box title="Questions Reviewed" items={questionsDisplay}></Box>
        <Box title="Hacker Status" items={hackers}></Box>
        <Box title="Gender Distribution" items={genderDisplay}>
          <PieChart data={genderChart} />
        </Box>
        <Box title="Questions Answered" items={questionsAnswered}></Box>
      </div>
    </div>
  );
}
