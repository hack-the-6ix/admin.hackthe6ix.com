'use client';

import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { getUser, User } from '@/utils/ht6-api';
import Button from '@/components/button';
import UserInfoBox from './userInfoBox';
import AlertPopup from '@/components/alert-popup';

interface Point {
  x: number;
  y: number;
}

interface QRCodeScanResult {
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  rawValue: string;
  format: string;
  cornerPoints: Point[];
}

export default function QRCheckIn() {
  const [cameraOn, setCameraOn] = useState(false);
  const [userType, setUserType] = useState<'User' | 'ExternalUser' | null>(
    null,
  );
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [candidate, setCandidate] = useState<User | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [scannedLog, setScannedLog] = useState<User[]>([]);

  const handleScan = async (codes: QRCodeScanResult[]) => {
    const result = codes[0]?.rawValue;
    if (!result) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      setAlertMessage('No QR code result');
    }
    if (result == scanResult) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      setAlertMessage('User already scanned and currently being displayed');
    }

    setScanResult(result);

    let parsed;
    try {
      parsed = JSON.parse(result) as {
        userID: string;
        userType: 'User' | 'ExternalUser';
      };
    } catch {
      console.error('Invalid QR code content:', result);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      setAlertMessage(`Invalid QR code content: ${result}`);
      return;
    }

    setUserType(parsed.userType);
    console.log('Scanned QR:', result);

    setShowAlert(true);
    setAlertMessage('Loading...');
    try {
      const res = await getUser(1, 2, 'asc', '', '', { _id: parsed.userID });
      setCandidate(res.message[0]);
      setShowAlert(false);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      setAlertMessage('User loaded');
      setScannedLog((prev) => {
        const updated = [res.message[0], ...prev];
        return updated.slice(0, 8);
      });
    } catch (error) {
      console.error('Search failed:', error);
      setCandidate(null);
    }
  };

  return (
    <div className="p-4 m-7 text-left">
      {showAlert && <AlertPopup message={alertMessage} />}
      <h1 className="text-5xl font-bold text-primary">QR Check In</h1>
      <p className="text-xl font-bold text-slate-500">
        Check in hackers quickly using their QR code
      </p>

      <div className="grid md:grid-cols-3 mt-8 gap-6">
        <div className="relative bg-primary-extralight border border-primary dark:bg-slate-700 rounded-2xl shadow-xl p-6 w-full flex items-center justify-center">
          {cameraOn ?
            <Scanner
              onScan={handleScan}
              onError={(err) => {
                console.error('QR scan error', err);
                alert('Error accessing camera or scanning QR code.');
              }}
              styles={{
                container: {
                  width: '100%',
                  height: '300px',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                },
                video: {
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                },
              }}
            />
          : <div className="w-full h-[300px] flex items-center justify-center text-slate-400">
              Camera is off
            </div>
          }

          <Button
            onClick={() => {
              setCameraOn(!cameraOn);
            }}
            buttonType="secondary"
            className="absolute top-4 right-4 px-4 py-1 text-sm rounded-full shadow-md"
          >
            {cameraOn ? 'Turn off Camera' : 'Turn on Camera'}
          </Button>
        </div>
        <UserInfoBox candidate={candidate} userType={userType}></UserInfoBox>
        <div className="p-5 bg-primary-extralight border border-primary shadow-xl dark:bg-slate-700 rounded-2xl flex flex-col gap-4">
          <h2 className="text-gray-700 dark:text-slate-200 font-medium text-lg">
            Scanned Log
          </h2>
          <ul className="text-sm text-gray-700 dark:text-slate-200 overflow-auto">
            {scannedLog.length === 0 ?
              <li className="italic text-slate-400">No scans yet</li>
            : scannedLog.map((user) => (
                <li key={user._id} className="py-1">
                  <strong>{user.fullName}</strong> — {user.email}
                  <button
                    className="bg-transparent hover:bg-transparent"
                    onClick={() => {
                      navigator.clipboard.writeText(user.fullName).catch(() => {
                        console.error('Failed to copy text');
                      });
                      setShowAlert(true);
                      setTimeout(() => {
                        setShowAlert(false);
                      }, 1500);
                      setAlertMessage(`"${user.fullName}" copied to clipboard`);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-5 text-primary-medlight hover:text-primary-dark"
                    >
                      <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12A1.5 1.5 0 0 1 17 6.622V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1Z" />
                      <path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z" />
                    </svg>
                  </button>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
}
