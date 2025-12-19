
import React from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center animate-fade-in">
      {/* Badge matching Image 1 */}
      <div className="inline-block px-8 py-3 bg-[#FFFBEB] border border-[#FEF3C7] rounded-full text-[#D97706] text-[13px] font-bold uppercase tracking-[0.1em] mb-12 shadow-sm">
        #1 AI TOOL FOR UK VISAS
      </div>
      
      {/* Title matching Image 1 with Serif font */}
      <h1 className="text-5xl md:text-[84px] font-bold text-[#1A1A1A] max-w-5xl leading-[1.1] mb-10 tracking-tight">
        Qualify for the <br/>
        <span className="font-serif italic text-[#D4AF37] font-medium">Global Talent Visa?</span>
      </h1>
      
      {/* Subtext matching Image 1 */}
      <p className="text-zinc-400 text-lg md:text-[22px] max-w-3xl mx-auto leading-relaxed mb-16 font-medium opacity-80">
        Stop guessing. Upload your CV and evidence to get an instant, professional success probability score. Optimized for Fashion, Tech, and Arts.
      </p>
      
      {/* Primary CTA matching Image 1 */}
      <button
        onClick={onStart}
        className="px-16 py-6 bg-[#1A1A1A] text-white font-bold rounded-2xl transition-all hover:bg-black hover:shadow-2xl active:scale-95 shadow-xl mb-32 text-xl tracking-tight"
      >
        Check My Success Rate
      </button>
      
      {/* Features Row matching Image 1 with Enriched Icons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full max-w-5xl px-4">
        <div className="flex flex-col items-center gap-6 group transition-all">
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center text-[#D4AF37] shadow-sm border border-zinc-100 group-hover:scale-110 transition-transform">
            <i className="fas fa-shield-halved text-3xl"></i>
          </div>
          <span className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.25em]">Official Criteria</span>
        </div>
        
        <div className="flex flex-col items-center gap-6 group transition-all">
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center text-[#D4AF37] shadow-sm border border-zinc-100 group-hover:scale-110 transition-transform">
            <i className="fas fa-lock text-3xl"></i>
          </div>
          <span className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.25em]">Private & Secure</span>
        </div>
        
        <div className="flex flex-col items-center gap-6 group transition-all">
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center text-[#D4AF37] shadow-sm border border-zinc-100 group-hover:scale-110 transition-transform">
            <i className="fas fa-star text-3xl"></i>
          </div>
          <span className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.25em]">Actionable Feedback</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
