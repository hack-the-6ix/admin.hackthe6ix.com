import { FC } from 'react';

interface AlertPopupProps {
  message?: string;
}

const AlertPopup: FC<AlertPopupProps> = ({ message = '' }) => {
  return (
    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-50/80 dark:bg-slate-800 text-center py-2 px-4 rounded-lg shadow-md">
      <span className="font-semibold text-primary dark:text-white">
        {message}
      </span>
    </div>
  );
};

export default AlertPopup;
