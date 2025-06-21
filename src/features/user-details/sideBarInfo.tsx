import { User } from '@/utils/ht6-api';
import React, { useState } from 'react';
import { getPersonalInfo, getEducationInfo, getExperienceInfo } from './info';
import AlertPopup from '@/components/alert-popup';

export default function SideBarInfo({
  candidate,
  resumeLink,
}: {
  candidate: User;
  resumeLink: string;
}) {
  const [showAlert, setShowAlert] = useState(false);
  const personalInfo = getPersonalInfo(candidate);
  const educationInfo = getEducationInfo(candidate);
  const experienceInfo = getExperienceInfo(candidate);

  function DisplayInfo({
    label,
    svg,
    value,
    copy,
    link,
  }: {
    label: string;
    svg: React.JSX.Element;
    value: string;
    copy: boolean;
    link?: string;
  }) {
    return (
      <div className="flex flex-col ml-2">
        <div className="flex flex-row gap-2 items-center">
          {svg}
          <h3 className="text-gray-500 dark:text-slate-200 font-semibold">
            {label}
          </h3>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            />
            {link ?
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-blue-400"
              >
                {value}
              </a>
            : <p className="text-gray-700 dark:text-slate-200">{value}</p>}
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
    <div className="p-5 bg-white dark:bg-slate-700 rounded-2xl flex flex-col gap-4">
      {showAlert && <AlertPopup message="Copied to clipboard" />}
      <div className="flex justify-between items-center">
        <h2 className="text-gray-700 dark:text-slate-200 font-medium text-lg">
          Personal
        </h2>
      </div>

      {personalInfo.map((itm) => (
        <DisplayInfo
          key={itm.label}
          label={itm.label}
          value={itm.value}
          svg={itm.svg}
          copy={itm.copy}
        />
      ))}

      <hr className="border-t-2 border-gray-300 my-4" />
      <div className="flex justify-between items-center">
        <h2 className="text-gray-700 dark:text-slate-200 font-medium text-lg">
          Education
        </h2>
      </div>

      {educationInfo.map((itm) => (
        <DisplayInfo
          key={itm.label}
          label={itm.label}
          value={itm.value}
          svg={itm.svg}
          copy={itm.copy}
        />
      ))}

      <hr className="border-t-2 border-gray-300 my-4" />
      <div className="flex justify-between items-center">
        <h2 className="text-gray-700 dark:text-slate-200 font-medium text-lg">
          Experience
        </h2>
      </div>

      {experienceInfo.map((itm) => (
        <DisplayInfo
          key={itm.label}
          label={itm.label}
          value={itm.value}
          svg={itm.svg}
          copy={itm.copy}
          link={itm.label === 'Resume' ? resumeLink : itm.link}
        />
      ))}
    </div>
  );
}
