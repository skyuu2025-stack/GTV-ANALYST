
import React, { useState, useEffect } from 'react';

const LoadingState: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Analyzing your professional background...",
    "Scanning Global Talent Visa criteria...",
    "Comparing achievements with previous successful applications...",
    "Evaluating field impact and recognition...",
    "Generating your success probability report...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-amber-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-amber-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fas fa-microchip text-amber-600 text-2xl animate-pulse"></i>
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Assessment</h3>
      <p className="text-gray-500 text-center max-w-xs animate-fade-in">
        {messages[messageIndex]}
      </p>
      
      <div className="mt-12 w-full max-w-md bg-gray-200 h-1.5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-amber-600 transition-all duration-500 ease-out" 
          style={{ width: `${(messageIndex + 1) * (100 / messages.length)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingState;
