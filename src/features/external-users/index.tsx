import React, { useEffect, useState } from 'react';
import { getExternalUsers, ExternalUser, checkInUser } from '@/utils/ht6-api';
import Button from '@/components/button';
import AlertPopup from '@/components/alert-popup';

export default function ExternalUsers() {
  const [allUsers, setAllUsers] = useState<ExternalUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ExternalUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('firstName');
  const [sortCriteria, setSortCriteria] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(25);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [alert, setAlert] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getExternalUsers(1, 1000, 'asc', 'firstName');
      console.log(res.message);
      setAllUsers(res.message);
    } catch (e: any) {
      setError('Failed to load external users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = [...allUsers];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(searchLower) ||
          user.lastName?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower),
      );
    }

    filtered.sort((a, b) => {
      let aValue = '';
      let bValue = '';

      if (sortField === 'firstName') {
        aValue = `${a.firstName} ${a.lastName}`;
        bValue = `${b.firstName} ${b.lastName}`;
      } else if (sortField === 'email') {
        aValue = a.email || '';
        bValue = b.email || '';
      }

      if (sortCriteria === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    setFilteredUsers(filtered);
    setPage(1);
  }, [allUsers, search, sortField, sortCriteria]);

  const handleCheckIn = async (user: ExternalUser) => {
    setCheckingIn(user._id);
    try {
      const res = await checkInUser(user._id, 'ExternalUser');
      if (res.status === 200) {
        setAlert('Successfully checked in user!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchUsers();
      } else {
        setAlert(
          typeof res.message === 'string' ? res.message : 'Check-in failed',
        );
      }
    } catch (e: any) {
      setAlert('Check-in failed');
    } finally {
      setCheckingIn(null);
      setTimeout(() => setAlert(''), 2500);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortCriteria(sortCriteria === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortCriteria('asc');
    }
  };

  const paginatedUsers = filteredUsers.slice((page - 1) * size, page * size);
  const totalPages = Math.ceil(filteredUsers.length / size);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-6">External Users</h1>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Search by name or email..."
                className="w-full md:w-72 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-white"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredUsers.length} of {allUsers.length} users
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="px-2 py-1 border rounded dark:bg-slate-700"
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
              <Button
                buttonType="secondary"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-2 py-1"
              >
                &lt;
              </Button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                buttonType="secondary"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="px-2 py-1"
              >
                &gt;
              </Button>
            </div>
          </div>
          {loading ?
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Loading users...
              </p>
            </div>
          : error ?
            <div className="py-8 text-center text-red-500">{error}</div>
          : <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('firstName')}
                    >
                      Name{' '}
                      {sortField === 'firstName' &&
                        (sortCriteria === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('email')}
                    >
                      Email{' '}
                      {sortField === 'email' &&
                        (sortCriteria === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Check-in Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role(s)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Discord Suffix
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.email}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status?.checkedIn ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}
                        >
                          {user.status?.checkedIn ?
                            'Checked In'
                          : 'Not Checked In'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.checkInTime ?
                          new Date(user.checkInTime).toLocaleString()
                        : '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.checkInNotes && user.checkInNotes.length > 0 ?
                          user.checkInNotes.join(', ')
                        : '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {(
                          user.discord?.additionalRoles &&
                          user.discord.additionalRoles.length > 0
                        ) ?
                          user.discord.additionalRoles.join(', ')
                        : '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.discord?.suffix ?
                          user.discord.suffix.replace(/[\[\]\s]/g, '')
                        : '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <Button
                          onClick={() => handleCheckIn(user)}
                          disabled={
                            user.status?.checkedIn || checkingIn === user._id
                          }
                          className={`px-3 py-1 text-xs ${user.status?.checkedIn ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} disabled:bg-gray-400 disabled:cursor-not-allowed`}
                        >
                          {checkingIn === user._id ?
                            'Checking In...'
                          : user.status?.checkedIn ?
                            '✓ Checked In'
                          : 'Check In'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {paginatedUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-12 text-center text-gray-400 dark:text-gray-500"
                      >
                        {search ?
                          'No users found matching your search'
                        : 'No external users found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
      {alert && <AlertPopup message={alert} />}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-50 text-white px-6 rounded-lg shadow-lg z-50 animate-pulse">
          ✓ Action completed successfully!
        </div>
      )}
    </div>
  );
}
