import { useState, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import { checkInUser, getUser, User, getNfcIdForUser } from '@/utils/ht6-api';
import axios from 'axios';

export default function CheckInQR() {
  const [scanned, setScanned] = useState<string | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [nfcId, setNfcId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanDisabled, setScanDisabled] = useState(false);
  const [copied, setCopied] = useState(false);
  const dashboardURL = import.meta.env.VITE_ADMIN_URL;
  const apiBaseURL = import.meta.env.VITE_API_HOST;
  const scanLockRef = useRef(false);

  const populateEvents = async (userId: string) => {
    try {
      const response = await axios.post(`${apiBaseURL}/nfc/populateEvents`, {
        userId: userId,
      });
      if (response.status === 200) {
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
      if (existingIdResponse.status === 200 && existingIdResponse.data.userId) {
        const existingId = existingIdResponse.data.userId;
        if (existingId === id) {
          return nfcId.toLowerCase();
        } else {
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
      if (assignResponse.status === 200) {
        await populateEvents(id);
      } else {
        throw new Error('Failed to assign NFC ID');
      }
      return nfcId.toLowerCase();
    } catch (err) {
      throw err;
    }
  };

  const handleScan = async (result: string | null) => {
    if (!result || scanned || scanDisabled || loading || scanLockRef.current)
      return;
    scanLockRef.current = true;
    setScanned(result);
    setScanDisabled(true);
    setLoading(true);
    setError(null);
    let userID = result.trim();
    try {
      if (userID.startsWith('{') && userID.endsWith('}')) {
        const parsed = JSON.parse(userID);
        if (parsed.userID) userID = parsed.userID;
      }
      const checkinRes = await checkInUser(userID, 'User');
      if (checkinRes.status === 200) {
        const userRes = await getUser(1, 1, 'asc', '', '', { _id: userID });
        const userObj = userRes.message[0];
        setUser(userObj);
        let nfcId = await getNfcIdForUser(userObj._id);
        if (!nfcId) {
          nfcId = await generateNfcId(userObj);
        }
        setNfcId(nfcId ?? null);
        setCheckedIn(true);
      } else {
        if (
          checkinRes.status === 400 ||
          (Array.isArray(checkinRes.message) &&
            checkinRes.message.includes('User has already checked in.'))
        ) {
          setError('User has already checked in.');
          setScanDisabled(false);
          setScanned(null);
        } else {
          setError('Check-in failed');
          setScanDisabled(false);
          setScanned(null);
        }
      }
    } catch (e) {
      if (
        e &&
        typeof e === 'object' &&
        'status' in e &&
        (e as any).status === 400
      ) {
        setError('User has already checked in.');
        setScanDisabled(false);
        setScanned(null);
      } else {
        setError('Check-in failed');
        setScanDisabled(false);
        setScanned(null);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!checkedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-4">Hacker Check-In</h1>
        <div className="w-full max-w-xs">
          {!scanDisabled && (
            <>
              {error && (
                <div className="mb-2 text-center text-red-500">{error}</div>
              )}
              <QrReader
                constraints={{ facingMode: 'environment' }}
                onResult={(result) => {
                  if (result?.getText()) handleScan(result.getText());
                }}
                containerStyle={{ width: '100%' }}
              />
            </>
          )}
        </div>
        <p className="mt-4 text-gray-600">Present your QR code to the camera</p>
        {(error || scanned) && (
          <button
            className="mt-4 px-4 py-2 bg-gray-400 rounded text-sm"
            onClick={() => window.location.reload()}
          >
            Reset Scanner
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Check-In Complete</h1>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 w-full max-w-md">
        <div className="mb-2 font-semibold">Name: {user?.fullName}</div>
        <div className="mb-2">Email: {user?.email}</div>
        <div className="mb-2">User ID: {user?._id}</div>
      </div>
      {nfcId && (
        <div className="mt-4 p-4 bg-white border border-blue-300 rounded w-full max-w-md">
          <div className="font-semibold mb-2">Your NFC URL:</div>
          <div className="mb-2 break-all font-mono text-blue-700 bg-blue-100 px-2 py-1 rounded">
            {dashboardURL}/nfc/u/{nfcId}
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full mt-2"
            onClick={async () => {
              await navigator.clipboard.writeText(
                `${dashboardURL}/nfc/u/${nfcId}`,
              );
              setCopied(true);
              setTimeout(() => setCopied(false), 1000);
            }}
          >
            {copied ? 'Copied' : 'Copy URL'}
          </button>
        </div>
      )}
      <button
        className="mt-6 px-4 py-2 bg-gray-400 rounded text-sm"
        onClick={() => window.location.reload()}
      >
        Reset Scanner
      </button>
    </div>
  );
}
