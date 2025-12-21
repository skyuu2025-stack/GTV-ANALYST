
import React from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="bg-white min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 md:px-6 py-10 md:py-20 text-center animate-fade-in">
      <div className="inline-block px-5 md:px-8 py-2 md:py-3 bg-[#FFFBEB] border border-[#FEF3C7] rounded-full text-[#D97706] text-[9px] md:text-[13px] font-black uppercase tracking-[0.2em] mb-8 md:12 shadow-sm italic">
        The Industry Standard GTV AI Counsel
      </div>
      
      <h1 className="text-[32px] md:text-[84px] font-bold text-[#1A1A1A] max-w-5xl leading-[1.15] md:leading-[1.1] mb-8 md:mb-10 tracking-tighter">
        Check Your Eligibility for the <br/>
        <span className="font-serif italic text-[#D4AF37] font-medium decoration-1 underline-offset-8">Global Talent Visa</span>
      </h1>
      
      <h2 className="text-zinc-400 text-sm md:text-[22px] max-w-2xl mx-auto leading-relaxed mb-10 md:mb-16 font-medium opacity-80 px-4 italic">
        Get an instant Tech Nation or Arts Council success roadmap using latest UK Home Office criteria. Consultant-grade AI analysis in minutes.
      </h2>
      
      <button
        onClick={onStart}
        className="w-full md:w-auto px-10 md:px-16 py-5 md:py-6 bg-[#1A1A1A] text-white font-black rounded-2xl transition-all hover:bg-black hover:shadow-2xl active:scale-95 shadow-xl mb-12 md:mb-24 text-base md:text-xl tracking-widest uppercase italic"
      >
        Start Eligibility Analysis
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16 w-full max-w-4xl px-2">
        {[
          { icon: 'fa-microchip', label: 'Gemini 3 Pro Engine' },
          { icon: 'fa-shield-halved', label: 'GDPR Compliant' },
          { icon: 'fa-file-invoice-dollar', label: 'Home Office Ready' }
        ].map((f, i) => (
          <div key={i} className="flex flex-col items-center gap-3 md:gap-5 group transition-all">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-50 rounded-full flex items-center justify-center text-[#D4AF37] shadow-inner border border-zinc-100 group-hover:bg-amber-50 transition-colors">
              <i className={`fas ${f.icon} text-lg md:text-2xl`}></i>
            </div>
            <span className="text-[8px] md:text-[11px] font-black text-zinc-300 uppercase tracking-[0.3em] group-hover:text-zinc-500 transition-colors">{f.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
