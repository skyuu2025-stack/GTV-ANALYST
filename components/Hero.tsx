
import React from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="bg-white min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 py-12 md:py-20 text-center animate-fade-in">
      <div className="inline-block px-6 md:px-8 py-2 md:py-3 bg-[#FFFBEB] border border-[#FEF3C7] rounded-full text-[#D97706] text-[11px] md:text-[13px] font-bold uppercase tracking-[0.1em] mb-8 md:12 shadow-sm">
        #1 AI TOOL FOR UK VISAS
      </div>
      
      <h1 className="text-3xl md:text-[84px] font-bold text-[#1A1A1A] max-w-5xl leading-[1.2] md:leading-[1.1] mb-8 md:mb-10 tracking-tight">
        Qualify for the <br/>
        <span className="font-serif italic text-[#D4AF37] font-medium">Global Talent Visa?</span>
      </h1>
      
      <p className="text-zinc-400 text-base md:text-[22px] max-w-3xl mx-auto leading-relaxed mb-10 md:mb-16 font-medium opacity-80 px-2">
        Stop guessing. Upload your CV and evidence to get an instant, professional success probability score. Optimized for Fashion, Tech, and Arts.
      </p>
      
      <button
        onClick={onStart}
        className="w-full md:w-auto px-12 md:px-16 py-5 md:py-6 bg-[#1A1A1A] text-white font-bold rounded-2xl transition-all hover:bg-black hover:shadow-2xl active:scale-95 shadow-xl mb-16 md:mb-32 text-lg md:text-xl tracking-tight"
      >
        Check My Success Rate
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 w-full max-w-5xl px-4">
        {[
          { icon: 'fa-shield-halved', label: 'Official Criteria' },
          { icon: 'fa-lock', label: 'Private & Secure' },
          { icon: 'fa-star', label: 'Actionable Feedback' }
        ].map((f, i) => (
          <div key={i} className="flex flex-col items-center gap-4 md:gap-6 group transition-all">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-50 rounded-full flex items-center justify-center text-[#D4AF37] shadow-sm border border-zinc-100 group-hover:scale-110 transition-transform">
              <i className={`fas ${f.icon} text-2xl md:text-3xl`}></i>
            </div>
            <span className="text-[10px] md:text-[12px] font-black text-zinc-400 uppercase tracking-[0.2em] md:tracking-[0.25em]">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
