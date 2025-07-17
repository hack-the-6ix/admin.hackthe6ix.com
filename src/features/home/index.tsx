import Box from '../../components/box';
import LeaderBoard from './leaderboard';
import {
  getStatistics,
  // loaderAuthCheck,
  StatisticsResponse,
} from '../../utils/ht6-api';
import PieChart from '../../components/piechart';
import VolunteerDashboard from './volunteer-dashboard';
import { useState } from 'react';
import { Link } from 'react-router';

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

export default function Home() {
  const [data, setData] = useState<StatisticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const userRole = localStorage.getItem('HT6_user_role') || 'organizer';
  const userToken = localStorage.getItem('HT6_token');
  const volunteerName = localStorage.getItem('HT6_volunteer_name');
  const volunteerEmail = localStorage.getItem('HT6_volunteer_email');

  if (!userToken) {
    return (
      <div className="p-4 m-3">
        <div className="m-4 text-left">
          <h1 className="text-5xl font-bold text-primary">Statistics</h1>
          <p className="text-xl font-bold text-slate-500">
            All the numbers at a glance
          </p>
        </div>
        <div className="m-4 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
          <h2 className="text-2xl font-semibold text-amber-800 dark:text-amber-200 mb-2">
            Not Logged In
          </h2>
          <p className="text-amber-700 dark:text-amber-300 mb-4">
            Please log in to access the statistics dashboard.
          </p>
          <Link
            to="/role-select"
            className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (userRole === 'volunteer') {
    return <VolunteerDashboard />;
  }

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    setHasAttemptedFetch(true);
    try {
      const res = await getStatistics(true);
      setData(res.message);
    } catch (e) {
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = () => {
    if (!data) return;
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '6ixStatistics.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!data) {
    return (
      <div className="p-4 m-3">
        <div className="m-4 text-left">
          <h1 className="text-5xl font-bold text-primary">Statistics</h1>
          <p className="text-xl font-bold text-slate-500">
            All the numbers at a glance
          </p>
        </div>
        <button
          onClick={fetchStatistics}
          className="m-4 p-2 pl-4 pr-4 bg-amber-500 rounded-2xl text-white hover:bg-amber-600 dark:hover:bg-primary dark:bg-primary-dark"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load Statistics'}
        </button>
        {error && <div className="text-red-500 m-4">{error}</div>}
      </div>
    );
  }

  const reviewed = data.hacker.submittedApplicationStats.review.reviewed;
  const notReviewed = data.hacker.submittedApplicationStats.review.notReviewed;
  const totalReviews = reviewed + notReviewed;

  const reviewDisplay = formatEntries(
    { Reviewed: reviewed, 'Not Reviewed': notReviewed },
    totalReviews,
  );

  const questionsDisplay = formatEntries(
    data.hacker.submittedApplicationStats.review.applicationScores,
    totalReviews,
  );

  const hackers = formatEntries(data.hacker.status, data.groups.hacker);

  const system = [
    'Last updated: ' + new Date(data.timestamp).toString(),
    ...formatEntries(data.groups, data.total),
  ];

  const genderChart = Object.entries(
    data.hacker.submittedApplicationStats.gender,
  ).map(([key, value]) => ({ name: capitalize(key), total: value }));

  const totalGenderCount = genderChart.reduce(
    (sum, item) => sum + item.total,
    0,
  );

  const genderDisplay = genderChart.map((item) =>
    formatKeyValue(item.name, item.total, totalGenderCount),
  );

  const questionsAnswered = formatEntries(
    data.hacker.questionBreakdown,
    data.groups.hacker,
  );

  const reviewers = Object.entries(
    data.hacker.submittedApplicationStats.review.reviewers,
  ).map(([, value]) => ({ name: value.name, total: value.total }));
  reviewers.sort((a, b) => b.total - a.total);

  return (
    <div className="p-4 m-3">
      <div className="m-4 text-left">
        <h1 className="text-5xl font-bold text-primary">Statistics</h1>
        <p className="text-xl font-bold text-slate-500">
          All the numbers at a glance
        </p>
        {hasAttemptedFetch && error && (
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Logged in as:{' '}
              <span className="font-semibold text-primary">
                {userRole === 'volunteer' ?
                  volunteerName || 'Volunteer'
                : 'Organizer'}
              </span>
              {userRole === 'volunteer' && volunteerEmail && (
                <span className="ml-2 text-slate-500">({volunteerEmail})</span>
              )}
            </p>
          </div>
        )}
      </div>

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
