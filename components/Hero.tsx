import React from 'react';

interface HeroProps { onStart: () => void; }

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="px-6 py-12 flex flex-col items-center text-center space-y-10 animate-fade-in">
      <div className="badge-critical ring-2 ring-amber-50/50 bg-amber-50">
        <i className="fas fa-bolt-lightning mr-2 text-amber-600"></i> 2025 AI ENGINE
      </div>
      
      <div className="space-y-4">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-[0.8] text-zinc-900">
          GLOBAL <br/> TALENT <br/> <span className="text-amber-600">VISA</span>
        </h1>
        <p className="text-zinc-500 font-medium italic text-sm tracking-tight px-8">
          Professional UK endorsement roadmap powered by expert AI models.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <div className="bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100 flex flex-col items-center gap-2">
           <i className="fas fa-shield-halved text-amber-600"></i>
           <span className="text-[9px] font-black uppercase tracking-widest text-zinc-900">Endorsed</span>
        </div>
        <div className="bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100 flex flex-col items-center gap-2">
           <i className="fas fa-clock text-amber-600"></i>
           <span className="text-[9px] font-black uppercase tracking-widest text-zinc-900">Fast-Track</span>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full max-w-sm py-6 bg-zinc-900 text-white font-black rounded-3xl uppercase tracking-widest text-sm italic shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-95 transition-all"
      >
        Start Audit Flow
      </button>

      <div className="pt-4 flex flex-col items-center gap-2">
        <p className="text-[8px] font-black text-zinc-300 uppercase tracking-[0.5em]">Aligned Frameworks</p>
        <div className="flex gap-4 opacity-20">
          <span className="text-[10px] font-black uppercase">Tech Nation</span>
          <span className="text-[10px] font-black uppercase">Arts Council</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;