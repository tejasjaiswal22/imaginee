import React from 'react';

interface ErrorDisplayProps {
  message: string | null;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="w-full max-w-2xl text-center bg-red-900/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-red-700/50">
      <h2 className="text-3xl font-bold text-red-300 mb-4 font-serif">A Tear in the Weave</h2>
      <p className="text-red-200 mb-6">
        The narrative has faltered, an unexpected anomaly has occurred:
      </p>
      <div className="bg-slate-900/50 p-4 rounded-lg text-red-200/80 font-mono text-sm mb-6 text-left border border-red-800">
        {message || 'An unknown error occurred.'}
      </div>
      <button 
        onClick={onRetry}
        className="py-3 px-8 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
      >
        Begin a New Chronicle
      </button>
    </div>
  );
};

export default ErrorDisplay;