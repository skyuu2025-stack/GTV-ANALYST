import React, { useState, useEffect } from 'react';

const LoadingState: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Initializing assessment...",
    "Scanning Home Office criteria...",
    "Benchmarking impact...",
    "Detecting evidence gaps...",
    "Finalizing roadmap...",
  ];

  useEffect(() => {
    // Speed up cycle from 3000ms to 1200ms
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="relative w-24 h-24 mb-10">
        <div className="absolute inset-0 border-2 border-zinc-100 rounded-full"></div>
        <div className="absolute inset-0 border-t-2 border-amber-500 rounded-full animate-spin duration-[1.5s] will-change-transform"></div>
        <div className="absolute inset-3 bg-zinc-900 rounded-full flex items-center justify-center text-white shadow-2xl">
          <i className="fas fa-brain text-xl"></i>
        </div>
      </div>

      <div className="text-center space-y-3 max-w-sm">
        <h3 className="text-xl font-black text-zinc-900 tracking-tighter uppercase italic">AI Deep Scan</h3>
        <p className="text-zinc-400 text-[11px] font-bold italic animate-pulse h-8">
          {messages[messageIndex]}
        </p>
      </div>
      
      <div className="mt-12 w-full max-w-[200px] bg-zinc-50 h-1 rounded-full overflow-hidden border border-zinc-100">
        <div 
          className="h-full bg-zinc-900 transition-all duration-700 ease-in-out" 
          style={{ width: `${(messageIndex + 1) * (100 / messages.length)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingState;