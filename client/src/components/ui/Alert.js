import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

const Alert = ({
  type = 'info',
  message,
  onClose,
  className = '',
  ...props
}) => {
  const typeClasses = {
    success: 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    error: 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    warning: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    info: 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };

  const icons = {
    success: <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" />,
    error: <ExclamationCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400" />,
    warning: <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
    info: <InformationCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
  };

  return (
    <div
      className={`rounded-md p-4 mb-4 flex items-start ${typeClasses[type]} ${className}`}
      role="alert"
      {...props}
    >
      <div className="flex-shrink-0 mr-3">{icons[type]}</div>
      <div className="flex-1">{message}</div>
      {onClose && (
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 rounded-md p-1.5 inline-flex text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Alert; 