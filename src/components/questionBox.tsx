import { FC } from 'react';

interface QuestionBoxProps {
  title?: string;
  label?: string;
  children?: string;
  className?: string;
  items?: string[];
  wordCount?: number;
  links?: string[];
  labelColor?: string;
  outerColor?: string;
  innerColor?: string;
}

const QuestionBox: FC<QuestionBoxProps> = ({
  title,
  label,
  children,
  wordCount = 0,
  className = '',
  items = [],
  links = [],
  labelColor = 'text-white',
  outerColor = 'bg-primary dark:bg-slate-700',
  innerColor = 'bg-primary-light dark:bg-slate-800',
}) => {
  return (
    <div
      className={`${outerColor} ${labelColor} p-4 px-6 rounded-2xl ${className}`}
    >
      {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
      {title && <h2 className="text-md mb-6">{label}</h2>}
      {items.length > 0 && (
        <ul className="mt-4 space-y-2 text-left mb-5">
          {items.map((item, index) => (
            <li
              key={index}
              className={`font-bold text-black dark:text-slate-400 ${innerColor} p-2 pl-4 pr-4 rounded-xl`}
            >
              {links[index] ?
                <a
                  href={links[index]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-500"
                >
                  {item} 🔗
                </a>
              : item}
            </li>
          ))}
        </ul>
      )}
      <p
        className={`text-black dark:text-slate-400 ${innerColor} p-2 pl-4 pr-4 rounded-xl`}
      >
        {children}
      </p>
      {wordCount ?
        <p
          className={`font-bold ${labelColor} dark:text-slate-400 mt-4 text-right`}
        >
          Word Count: {wordCount}
        </p>
      : null}
    </div>
  );
};

export default QuestionBox;
