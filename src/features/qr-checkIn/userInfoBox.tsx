import { User, checkInUser } from '@/utils/ht6-api';
import React, { useState } from 'react';
import AlertPopup from '@/components/alert-popup';
import Button from '@/components/button';

export const getImportantInfo = (candidate: User) => [
  {
    label: 'ID',
    value: candidate._id || 'Not Provided',
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5 text-primary"
      >
        <path
          fillRule="evenodd"
          d="M10 2.5c-1.31 0-2.526.386-3.546 1.051a.75.75 0 0 1-.82-1.256A8 8 0 0 1 18 9a22.47 22.47 0 0 1-1.228 7.351.75.75 0 1 1-1.417-.49A20.97 20.97 0 0 0 16.5 9 6.5 6.5 0 0 0 10 2.5ZM4.333 4.416a.75.75 0 0 1 .218 1.038A6.466 6.466 0 0 0 3.5 9a7.966 7.966 0 0 1-1.293 4.362.75.75 0 0 1-1.257-.819A6.466 6.466 0 0 0 2 9c0-1.61.476-3.11 1.295-4.365a.75.75 0 0 1 1.038-.219ZM10 6.12a3 3 0 0 0-3.001 3.041 11.455 11.455 0 0 1-2.697 7.24.75.75 0 0 1-1.148-.965A9.957 9.957 0 0 0 5.5 9c0-.028.002-.055.004-.082a4.5 4.5 0 0 1 8.996.084V9.15l-.005.297a.75.75 0 1 1-1.5-.034c.003-.11.004-.219.005-.328a3 3 0 0 0-3-2.965Zm0 2.13a.75.75 0 0 1 .75.75c0 3.51-1.187 6.745-3.181 9.323a.75.75 0 1 1-1.186-.918A13.687 13.687 0 0 0 9.25 9a.75.75 0 0 1 .75-.75Zm3.529 3.698a.75.75 0 0 1 .584.885 18.883 18.883 0 0 1-2.257 5.84.75.75 0 1 1-1.29-.764 17.386 17.386 0 0 0 2.078-5.377.75.75 0 0 1 .885-.584Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    copy: true,
  },
  {
    label: 'Full Name',
    value: candidate.fullName || 'Not Provided',
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5 text-primary"
      >
        <path
          fillRule="evenodd"
          d="M1 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V6Zm4 1.5a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm2 3a4 4 0 0 0-3.665 2.395.75.75 0 0 0 .416 1A8.98 8.98 0 0 0 7 14.5a8.98 8.98 0 0 0 3.249-.604.75.75 0 0 0 .416-1.001A4.001 4.001 0 0 0 7 10.5Zm5-3.75a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm0 6.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm.75-4a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    copy: true,
  },
  {
    label: 'Age',
    value: candidate.hackerApplication?.age?.toString() ?? 'Not Provided',
    svg: <></>,
    copy: false,
  },
  {
    label: 'Email',
    value: candidate.email || 'Not Provided',
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5 text-primary"
      >
        <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
        <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
      </svg>
    ),
    copy: true,
  },
  {
    label: 'Shirt Size',
    value: candidate.hackerApplication?.shirtSize ?? 'Not Provided',
    svg: <></>,
    copy: false,
  },
  {
    label: 'Status',
    value: candidate.status.checkedIn ? 'Checked In' : 'Not Checked In',
    svg: <></>,
    copy: false,
    important: true,
  },
];

export default function UserInfoBox({
  candidate,
  userType,
}: {
  candidate: User | null | undefined;
  userType: 'User' | 'ExternalUser' | null;
}) {
  const [showAlert, setShowAlert] = useState(false);
  const userInfo = candidate ? getImportantInfo(candidate) : [];
  const [alertMessage, setAlertMessage] = useState('');

  const handleCheckIn = async (
    userID: string,
    userType: 'User' | 'ExternalUser',
  ) => {
    try {
      const res = await checkInUser(userID, userType);
      if (res.status === 200) {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        setAlertMessage('User checked in successfully');
      } else {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        setAlertMessage('Check-in failed');
      }
    } catch (error) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      setAlertMessage('Check-in failed');
      console.log(error);
    }
  };

  function DisplayInfo({
    label,
    svg,
    value,
    copy,
    important,
  }: {
    label: string;
    svg: React.JSX.Element;
    value: string;
    copy: boolean;
    important?: boolean;
  }) {
    return (
      <div className="flex flex-col ml-2">
        <div className="flex flex-row gap-2 items-center">
          {svg}
          {important ?
            <h3 className="text-red-700 dark:text-slate-200 font-semibold">
              {label}
            </h3>
          : <h3 className="text-gray-500 dark:text-slate-200 font-semibold">
              {label}
            </h3>
          }
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            />
            <p className="text-gray-700 dark:text-slate-200">{value}</p>
          </div>
          {copy && (
            <button
              className="bg-transparent hover:bg-transparent"
              onClick={() => {
                navigator.clipboard.writeText(value).catch(() => {
                  console.error('Failed to copy text');
                });
                setShowAlert(true);
                setTimeout(() => {
                  setShowAlert(false);
                }, 1500);
                setAlertMessage(`"${value}" copied to clipboard`);
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
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-primary-extralight border border-primary shadow-xl dark:bg-slate-700 rounded-2xl flex flex-col gap-4">
      {showAlert && <AlertPopup message={alertMessage} />}
      <div className="flex justify-between items-center">
        <h2 className="text-gray-700 dark:text-slate-200 font-medium text-lg">
          Scanned User Info
        </h2>
      </div>

      {candidate ?
        userInfo.map((itm) => (
          <DisplayInfo
            key={itm.label}
            label={itm.label}
            value={itm.value}
            svg={itm.svg}
            copy={itm.copy}
            important={itm.important}
          />
        ))
      : <p className="text-gray-500 dark:text-slate-400 italic">
          No user scanned
        </p>
      }

      {candidate && (
        <div className="flex justify-end">
          <Button
            onClick={() => {
              handleCheckIn(candidate._id, userType ?? 'User').catch(() => {
                console.error('Check-in failed');
              });
            }}
            buttonType="primary"
            className="py-1 rounded-full shadow-md"
            disabled={candidate.status.checkedIn}
          >
            {candidate.status.checkedIn ?
              'User Already Checked In'
            : 'Check In User'}
          </Button>
        </div>
      )}
    </div>
  );
}
