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
          {items.map((item, index) => (
            <div
              key={index}
              className="mb-2 text-black font-bold dark:text-white"
              {...(allowHTML ?
                { dangerouslySetInnerHTML: { __html: item } }
              : { children: item })}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Box;
