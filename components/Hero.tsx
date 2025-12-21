
import React from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="bg-white min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 md:px-6 py-10 md:py-20 text-center animate-fade-in relative overflow-hidden">
      {/* 装饰性背景 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-50/30 rounded-full blur-[120px] -z-10"></div>
      
      <div className="inline-block px-5 md:px-8 py-2 md:py-3 bg-[#FFFBEB] border border-[#FEF3C7] rounded-full text-[#D97706] text-[9px] md:text-[13px] font-black uppercase tracking-[0.2em] mb-8 md:12 shadow-sm italic">
        <i className="fas fa-users-viewfinder mr-2"></i> 1,240+ Assessments Completed This Month
      </div>
      
      <h1 className="text-[32px] md:text-[84px] font-bold text-[#1A1A1A] max-w-5xl leading-[1.15] md:leading-[1.1] mb-8 md:mb-10 tracking-tighter">
        Check Your Eligibility for the <br/>
        <span className="font-serif italic text-[#D4AF37] font-medium decoration-1 underline-offset-8">Global Talent Visa</span>
      </h1>
      
      <h2 className="text-zinc-400 text-sm md:text-[22px] max-w-2xl mx-auto leading-relaxed mb-10 md:mb-16 font-medium opacity-80 px-4 italic">
        Professional Gemini 3 Pro AI analysis of your Tech Nation or Arts Council endorsement route. Get your success score in 2 minutes.
      </h2>
      
      <div className="flex flex-col items-center gap-6 w-full px-4">
        <button
          onClick={onStart}
          className="w-full md:w-auto px-16 md:px-24 py-6 md:py-8 bg-[#1A1A1A] text-white font-black rounded-3xl transition-all hover:bg-black hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] active:scale-95 shadow-2xl text-base md:text-2xl tracking-widest uppercase italic"
        >
          Get My Expert Score
        </button>
        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">No Credit Card Required For Initial Analysis</p>
      </div>
      
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16 w-full max-w-4xl px-2">
        {[
          { icon: 'fa-bolt-lightning', label: 'Instant AI Report', sub: '2min processing' },
          { icon: 'fa-shield-halved', label: 'Secure & Private', sub: 'Encrypted analysis' },
          { icon: 'fa-gavel', label: 'Latest Criteria', sub: '2025 Guidelines' }
        ].map((f, i) => (
          <div key={i} className="flex flex-col items-center gap-2 group transition-all">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-[#D4AF37] border border-zinc-100 group-hover:bg-amber-50 group-hover:-translate-y-1 transition-all">
              <i className={`fas ${f.icon} text-base md:text-xl`}></i>
            </div>
            <span className="text-[10px] md:text-[11px] font-black text-zinc-800 uppercase tracking-wider">{f.label}</span>
            <span className="text-[8px] font-bold text-zinc-300 uppercase tracking-widest">{f.sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
