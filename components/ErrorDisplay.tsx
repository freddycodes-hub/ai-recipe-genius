
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="my-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow" role="alert">
      <strong className="font-bold">Oops! Something went wrong.</strong>
      <p className="mt-1">{message}</p>
    </div>
  );
};

export default ErrorDisplay;
    