import { useState, useEffect } from 'react';
import { getUser, User } from '@/utils/ht6-api';

export default function AssignNfc() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const result = await getUser(1, 50, 'asc', '', term.trim(), {
        $and: [{ 'roles.hacker': true }],
      });
      setUsers(result.message);
    } catch (error) {
      console.error('Search failed:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // debounce 
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          placeholder="Search for hackers by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading && <span className="ml-2 text-gray-500">Searching...</span>}
      </div>

      <div>
        {users.map((user) => (
          <div key={user._id} className="py-2 border-b border-gray-200">
            {user.fullName}
          </div>
        ))}
      </div>
    </div>
  );
}