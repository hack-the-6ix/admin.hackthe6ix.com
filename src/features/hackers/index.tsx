import React, { useEffect, useState } from 'react';
import { getUser, checkInUser, getNfcIdForUser, User } from '@/utils/ht6-api';
import Button from '@/components/button';

export default function Hackers() {
  const [hackers, setHackers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [generatingNfc, setGeneratingNfc] = useState<string | null>(null);
  const [nfcUrls, setNfcUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchHackers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getUser(1, 1000, 'asc', 'firstName', '', {
          'status.confirmed': true,
          'groups.hacker': true,
        });
        setHackers(res.message);
      } catch (e: any) {
        setError('Failed to load hackers');
      } finally {
        setLoading(false);
      }
    };
    fetchHackers();
  }, []);

  const handleCheckIn = async (user: User) => {
    setCheckingIn(user._id);
    try {
      await checkInUser(user._id, 'User');
      setHackers((prev) =>
        prev.map((h) =>
          h._id === user._id ?
            { ...h, status: { ...h.status, checkedIn: true } }
          : h,
        ),
      );
    } catch (e) {
      setError('Check-in failed');
    } finally {
      setCheckingIn(null);
    }
  };

  const handleGenerateNfc = async (user: User) => {
    setGeneratingNfc(user._id);
    try {
      const nfcId = await getNfcIdForUser(user._id);
      if (nfcId) {
        setNfcUrls((prev) => ({
          ...prev,
          [user._id]: `${window.location.origin}/nfc/u/${nfcId}`,
        }));
      } else {
        setError('Failed to generate NFC URL');
      }
    } catch (e) {
      setError('Failed to generate NFC URL');
    } finally {
      setGeneratingNfc(null);
    }
  };

  const checkedInCount = hackers.filter((h) => h.status.checkedIn).length;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Hackers</h1>
      <div className="mb-4">
        {loading ?
          'Loading...'
        : `${checkedInCount} / ${hackers.length} checked in`}
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Check In</th>
              <th className="px-4 py-2 border-b">NFC URL</th>
            </tr>
          </thead>
          <tbody>
            {hackers.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <td className="px-4 py-2 border-b">{user.fullName}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">
                  {user.status.checkedIn ? 'Checked In' : 'Not Checked In'}
                </td>
                <td className="px-4 py-2 border-b">
                  <Button
                    onClick={() => handleCheckIn(user)}
                    disabled={user.status.checkedIn || checkingIn === user._id}
                  >
                    {checkingIn === user._id ?
                      'Checking In...'
                    : user.status.checkedIn ?
                      'Checked In'
                    : 'Check In'}
                  </Button>
                </td>
                <td className="px-4 py-2 border-b">
                  <Button
                    onClick={() => handleGenerateNfc(user)}
                    disabled={generatingNfc === user._id}
                  >
                    {generatingNfc === user._id ?
                      'Generating...'
                    : 'Generate NFC URL'}
                  </Button>
                  {nfcUrls[user._id] && (
                    <div className="mt-2 text-xs break-all">
                      <a
                        href={nfcUrls[user._id]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {nfcUrls[user._id]}
                      </a>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
