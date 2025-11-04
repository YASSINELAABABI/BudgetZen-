import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

const baseClass =
  'rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900';

const Card: React.FC<CardProps> = ({ title, action, className, children }) => {
  const classes = className ? `${baseClass} ${className}` : baseClass;

  return (
    <div className={classes}>
      {(title || action) && (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;

