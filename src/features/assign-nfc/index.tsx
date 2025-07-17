import { useState, useEffect } from 'react';
import { getUser, User, loaderAuthCheck } from '@/utils/ht6-api';
import axios from 'axios';

export async function clientLoader() {
  return loaderAuthCheck()({} as any);
}

const apiBaseURL = import.meta.env.VITE_API_HOST;

const populateEvents = async (userId: string) => {
  try {
    const response = await axios.post(`${apiBaseURL}/nfc/populateEvents`, {
      userId: userId,
    });

    if (response.status == 200) {
      return response.data;
    } else {
      throw new Error('Failed to populate check-ins');
    }
  } catch (err) {
    throw err;
  }
};

const generateNfcId = async (user: User) => {
  const id = user._id;
  const { firstName, lastName } = user;

  let idx = 1;
  let nfcId;

  while (true) {
    if (idx > lastName.length + id.length) {
      throw new Error('Error assigning unique nfc id');
    }

    if (idx > lastName.length) {
      nfcId = `${firstName}-${lastName}-${id.slice(0, idx - lastName.length)}`;
    } else {
      nfcId = `${firstName}-${lastName.slice(0, idx)}`;
    }

    const existingIdResponse = await axios.get(
      `${apiBaseURL}/nfc/getUserId/${nfcId.toLowerCase()}`,
    );

    if (existingIdResponse.status == 200 && existingIdResponse.data.userId) {
      const existingId = existingIdResponse.data.userId;

      if (existingId == id) {
        return nfcId.toLowerCase();
      } else {
        console.log('NFC ID taken by different user, trying next...');

        idx += 1;
        continue;
      }
    } else {
      break;
    }
  }

  try {
    const assignResponse = await axios.post(`${apiBaseURL}/nfc/assign`, {
      nfcId: nfcId.toLowerCase(),
      userId: id,
    });

    if (assignResponse.status == 200) {
      await populateEvents(id);
    } else {
      throw new Error('Failed to assign NFC ID');
    }

    return nfcId.toLowerCase();
  } catch (err) {
    throw err;
  }
};

export default function AssignNfc() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [nfcId, setNfcId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const dashboardURL = import.meta.env.VITE_ADMIN_URL;

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const result = await getUser(1, 50, 'asc', '', term.trim(), {});
      if (typeof result.message != 'object') {
        setUsers([]);
      } else {
        setUsers(result.message.filter((user: User) => user.status.confirmed));
      }
    } catch (error) {
      console.error('Search failed:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
      <div className="flex flex-col gap-4">
        <div className="mb-4">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            placeholder="Search for hackers by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading && <span className="ml-2 text-gray-500">Searching...</span>}
        </div>

        <div className="mb-6">
          {users.length > 0 &&
            users.map((user: User) => (
              <div
                key={user._id}
                className="py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between gap-2"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-sm sm:text-base">
                    {user.fullName} - {user._id}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {user.email}
                  </p>
                </div>

                <button
                  className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm sm:text-base w-full sm:w-auto"
                  onClick={async () => {
                    if (selectedUser?._id == user._id) {
                      return;
                    }
                    setIsLoading(true);
                    setSelectedUser(user);

                    const nfcId = await generateNfcId(user);
                    console.log(nfcId);
                    setNfcId(nfcId);
                    setIsLoading(false);
                  }}
                >
                  {isLoading && selectedUser?._id == user._id ?
                    'Loading...'
                  : 'Assign'}
                </button>
              </div>
            ))}
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Selected User
        </h3>
        {selectedUser && nfcId ?
          <>
            <div className="space-y-3">
              <div className="text-sm sm:text-base">
                <strong>Name:</strong> {selectedUser.fullName}
              </div>
              <div className="text-sm sm:text-base">
                <strong>Email:</strong> {selectedUser.email}
              </div>
              <div className="text-sm sm:text-base">
                <strong>User ID:</strong> {selectedUser._id}
              </div>
              <div className="mt-4 p-3 bg-white border border-blue-300 rounded">
                <strong className="text-sm sm:text-base">
                  Generated NFC ID URL:
                </strong>
                <div className="mt-2 break-all">
                  <span className="font-mono text-blue-700 bg-blue-100 px-2 py-1 rounded text-xs sm:text-sm">
                    {dashboardURL}/nfc/u/{nfcId}
                  </span>
                </div>
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md w-full sm:w-auto text-sm sm:text-base"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${dashboardURL}/nfc/u/${nfcId}`,
                  );
                }}
              >
                Copy URL
              </button>
            </div>
          </>
        : <>
            <p className="text-sm sm:text-base">
              Select a user to generate their NFC ID URL here.
            </p>
          </>
        }
      </div>
    </div>
  );
}
