import { FC, ReactNode, useState } from 'react';
import AlertPopup from './alert-popup';

interface BoxProps {
  title?: string;
  children?: ReactNode;
  className?: string;
  items?: string[];
  background?: string;
  innerBackground?: string;
  allowHTML?: boolean;
  copy?: boolean[];
  labelColor?: string;
}

const Box: FC<BoxProps> = ({
  title,
  children,
  className = '',
  items = [],
  background = 'bg-primary dark:bg-slate-700',
  innerBackground = 'bg-primary-light dark:bg-slate-800',
  allowHTML = false,
  copy = [],
  labelColor = 'text-white',
}) => {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <div
      className={`${background} ${labelColor} p-4 text-center rounded-2xl ${className}`}
    >
      {showAlert && <AlertPopup message="Copied to clipboard" />}
      {title && <h2 className="text-2xl font-bold mb-2 text-left">{title}</h2>}
      {items.length > 0 && (
        <div className={`rounded-2xl p-4 ${innerBackground}`}>
          {children}
          {allowHTML ?
            items.map((item, index) => (
              <div
                key={index}
                className="mb-2 text-black font-bold dark:text-white"
                dangerouslySetInnerHTML={{ __html: item }}
              />
            ))
          : items.map((item, index) => {
              const match = /^(.+?):\s*(.+)$/.exec(item);
              return match ?
                  <div key={index} className="mb-2 text-black dark:text-white">
                    <span className="font-bold">{match[1]}</span>: {match[2]}
                    {copy[index] && (
                      <button
                        className="bg-transparent hover:bg-transparent px-1 translate-y-1"
                        onClick={() => {
                          navigator.clipboard.writeText(match[2]).catch(() => {
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
                          className="size-5 text-primary hover:text-primary-dark"
                        >
                          <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12A1.5 1.5 0 0 1 17 6.622V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1Z" />
                          <path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z" />
                        </svg>
                      </button>
                    )}
                  </div>
                : <div
                    key={index}
                    className="mb-2 text-black font-bold dark:text-white"
                  >
                    {item}
                  </div>;
            })
          }
        </div>
      )}
    </div>
  );
};

export default Box;
