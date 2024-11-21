/* eslint-disable prettier/prettier */
import React, { FC, ReactNode } from 'react';

interface BoxProps {
  title?: string;
  children?: ReactNode;
  className?: string;
}

const Box: FC<BoxProps> = ({ title, children, className = '' }) => {
  return (
    <div
      className={`bg-primary dark:bg-slate-700 text-white p-4 text-center rounded-2xl ${className}`}
    >
      {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
      {children}
    </div>
  );
};

export default Box;
