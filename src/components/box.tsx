import { FC, ReactNode } from 'react';

interface BoxProps {
  title?: string;
  children?: ReactNode;
  className?: string;
  items?: string[];
}

const Box: FC<BoxProps> = ({ title, children, className = '', items = [] }) => {
  return (
    <div
      className={`bg-primary dark:bg-slate-700 text-white p-4 text-center rounded-2xl ${className}`}
    >
      {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
      {items.length > 0 && (
        <ul className="mt-4 space-y-2 text-left">
          {children}
          {items.map((item, index) => (
            <li
              key={index}
              className="font-bold text-black dark:text-slate-400 bg-primary-light dark:bg-slate-800 p-2 pl-4 pr-4 rounded-xl"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Box;
