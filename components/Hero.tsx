import React from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="bg-white min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 md:px-6 py-10 md:py-20 text-center animate-fade-in relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-50/30 rounded-full blur-[120px] -z-10"></div>
      
      <div className="flex items-center gap-3 mb-8">
        <div className="flex -space-x-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 overflow-hidden">
              <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-start">
          <div className="flex text-amber-500 text-[10px]">
            <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">4.9/5 Rating (500+ Verified)</span>
        </div>
      </div>

      <div className="inline-block px-5 md:px-8 py-2 md:py-3 bg-[#FFFBEB] border border-[#FEF3C7] rounded-full text-[#D97706] text-[9px] md:text-[13px] font-black uppercase tracking-[0.2em] mb-8 md:12 shadow-sm italic">
        <i className="fas fa-bolt-lightning mr-2"></i> 2025 Updated Criteria
      </div>
      
      <h1 className="text-[36px] md:text-[84px] font-bold text-[#1A1A1A] max-w-5xl leading-[1.1] md:leading-[1.1] mb-8 md:mb-10 tracking-tighter">
        Get Your <span className="font-serif italic text-[#D4AF37]">Global Talent</span> <br/> 
        Success Roadmap
      </h1>
      
      <h2 className="text-zinc-400 text-sm md:text-[22px] max-w-2xl mx-auto leading-relaxed mb-10 md:mb-16 font-medium opacity-80 px-4 italic">
        Expert Gemini 3 Pro AI audit for Tech Nation, Arts Council, and RIBA. Stop guessing, start your roadmap today.
      </h2>
      
      <div className="flex flex-col items-center gap-6 w-full px-4">
        <button
          onClick={onStart}
          className="w-full md:w-auto px-16 md:px-24 py-6 md:py-8 bg-[#1A1A1A] text-white font-black rounded-3xl transition-all hover:bg-black hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] active:scale-95 shadow-2xl text-base md:text-2xl tracking-widest uppercase italic"
        >
          Check My Eligibility
        </button>
        <div className="flex items-center gap-4 opacity-40">
           <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Stripe_logo%2C_revised_2016.svg" className="h-4" alt="Stripe" />
           <span className="w-1 h-1 bg-zinc-400 rounded-full"></span>
           <span className="text-[9px] font-black uppercase tracking-widest">PCI DSS Compliant</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;