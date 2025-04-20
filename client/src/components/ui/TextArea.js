import React, { forwardRef } from 'react';

const TextArea = forwardRef(({
  label,
  name,
  placeholder,
  error,
  rows = 4,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} 
          ${error ? 'focus:border-red-500' : 'focus:border-primary-500'} 
          bg-white dark:bg-gray-700 text-gray-900 dark:text-white
          ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea; 