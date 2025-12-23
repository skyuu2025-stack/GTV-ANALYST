import React, { useState, useEffect } from 'react';

const LoadingState: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Initializing neural assessment engine...",
    "Scanning 2025 Home Office criteria...",
    "Benchmarking professional impact...",
    "Detecting evidence patterns & gaps...",
    "Finalizing tactical roadmap...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="relative w-32 h-32 mb-12">
        {/* Outer orbital rings */}
        <div className="absolute inset-0 border-2 border-zinc-100 rounded-full"></div>
        <div className="absolute inset-0 border-t-2 border-amber-500 rounded-full animate-spin duration-[3s]"></div>
        
        {/* Core AI Icon with pulse */}
        <div className="absolute inset-4 bg-zinc-900 rounded-full flex items-center justify-center text-white shadow-2xl neural-pulse">
          <i className="fas fa-brain text-3xl"></i>
        </div>

        {/* Floating particles (Decorative) */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-amber-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute -bottom-4 -right-2 w-6 h-6 bg-zinc-900 rounded-full animate-bounce opacity-5"></div>
      </div>

      <div className="text-center space-y-4 max-w-sm">
        <h3 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase italic">AI Deep Scan</h3>
        <p className="text-zinc-400 text-sm font-medium italic animate-pulse h-12">
          {messages[messageIndex]}
        </p>
      </div>
      
      <div className="mt-16 w-full max-w-xs bg-zinc-50 h-1 rounded-full overflow-hidden border border-zinc-100">
        <div 
          className="h-full bg-zinc-900 transition-all duration-1000 ease-in-out" 
          style={{ width: `${(messageIndex + 1) * (100 / messages.length)}%` }}
        ></div>
      </div>

      <div className="mt-8 flex items-center gap-4 opacity-20">
         <span className="text-[8px] font-black uppercase tracking-[0.4em]">Processing via Gemini 3 Pro</span>
      </div>
    </div>
  );
};

export default LoadingState;