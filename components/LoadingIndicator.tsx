import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "The world is changing...",
  "Weaving the threads of fate...",
  "Consulting the ancient spirits...",
  "Painting the scene with starlight...",
  "A new path reveals itself...",
];

const LoadingIndicator: React.FC = () => {
  const [message, setMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = loadingMessages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full bg-purple-500 opacity-75 animate-ping"></div>
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-purple-400 shadow-lg shadow-purple-500/50">
                <svg className="h-8 w-8 text-purple-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3.5a1.5 1.5 0 011.5 1.5v1.5a1 1 0 001 1h1.5a1.5 1.5 0 010 3h-1.5a1 1 0 00-1 1v1.5a1.5 1.5 0 01-3 0v-1.5a1 1 0 00-1-1h-1.5a1.5 1.5 0 010-3h1.5a1 1 0 001-1v-1.5a1.5 1.5 0 011.5-1.5z"/>
                </svg>
            </div>
        </div>
        <p className="text-xl text-gray-300 transition-opacity duration-500">{message}</p>
    </div>
  );
};

export default LoadingIndicator;