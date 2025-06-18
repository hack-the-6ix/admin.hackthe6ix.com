import { FC, ReactNode } from 'react';

interface BoxProps {
  title?: string;
  children?: ReactNode;
  className?: string;
  items?: string[];
  background?: string;
  innerBackground?: string;
  allowHTML?: boolean;
}

const Box: FC<BoxProps> = ({
  title,
  children,
  className = '',
  items = [],
  background = 'bg-primary dark:bg-slate-700',
  innerBackground = 'bg-primary-light dark:bg-slate-800',
  allowHTML = false,
}) => {
  return (
    <div
      className={`${background} text-white p-4 text-center rounded-2xl ${className}`}
    >
      {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
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
