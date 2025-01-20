import { FC, ReactNode } from 'react';

interface BoxProps {
  title?: string;
  children?: ReactNode;
  className?: string;
  items?: string[];
  background?: string;
  innerBackground?: string;
}

const Box: FC<BoxProps> = ({
  title,
  children,
  className = '',
  items = [],
  background = 'bg-primary dark:bg-slate-700',
  innerBackground = 'bg-primary-light dark:bg-slate-800',
}) => {
  return (
    <div
      className={`${background} text-white p-4 text-center rounded-2xl ${className}`}
    >
      {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
      {items.length > 0 && (
        <ul className="mt-4 space-y-2 text-left">
          {children}
          {items.map((item, index) => (
            <li
              key={index}
              className={`${innerBackground} font-bold text-black dark:text-slate-400  p-2 pl-4 pr-4 rounded-xl`}
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
