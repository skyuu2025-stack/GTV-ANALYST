import React from 'react';

interface HeroProps { onStart: () => void; }

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="bg-white min-h-[100dvh] flex flex-col items-center justify-center px-4 md:px-6 py-10 md:py-20 text-center animate-fade-in relative overflow-hidden">
      {/* Background Soft Glow - Optimized for GPU */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square bg-amber-50/20 rounded-full blur-[80px] md:blur-[120px] -z-10 will-change-transform"></div>
      
      {/* Social Proof Avatars - Added dimensions for CLS prevention */}
      <div className="flex items-center gap-3 mb-8 md:mb-12">
        <div className="flex -space-x-2 md:-space-x-3" aria-label="Successful applicants verified by our tool">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-zinc-100 overflow-hidden shadow-sm">
              <img 
                src={`https://i.pravatar.cc/100?img=${i+15}`} 
                alt={`Verified User Profile ${i}`} 
                width="40"
                height="40"
                loading="eager"
                className="w-full h-full object-cover" 
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-start ml-1">
          <div className="flex text-amber-500 text-[8px] md:text-[10px] gap-0.5">
            <i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i>
          </div>
          <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-zinc-500">4.9/5 RATING</span>
        </div>
      </div>

      {/* Badge */}
      <div className="inline-flex items-center px-4 py-2 md:px-6 md:py-2.5 bg-white border border-amber-200 rounded-full text-amber-700 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-8 md:mb-12 shadow-sm italic ring-2 md:ring-4 ring-amber-50/50">
        <i className="fas fa-bolt-lightning mr-2 text-amber-600 animate-pulse" aria-hidden="true"></i> 2025 UK IMMIGRATION
      </div>
      
      {/* Headline - Added fetchpriority="high" to prioritize LCP */}
      <h1 
        fetchpriority="high"
        className="text-[34px] sm:text-[44px] md:text-[88px] font-black text-[#121212] max-w-6xl leading-[0.9] md:leading-[0.85] mb-8 md:mb-12 tracking-tight md:tracking-tighter uppercase italic px-2"
      >
        UK GLOBAL TALENT VISA <br/>
        <span className="text-[#A48020] drop-shadow-sm">AI ELIGIBILITY AUDIT</span> <br className="hidden md:block"/>
        & ASSESSMENT
      </h1>
      
      {/* Subheadline */}
      <h2 className="text-zinc-600 text-xs sm:text-sm md:text-[22px] max-w-2xl mx-auto leading-relaxed mb-10 md:mb-16 font-medium italic px-6">
        The definitive professional assessment tool for UK Global Talent Visa readiness. Map your evidence for Tech Nation and Arts Council endorsements instantly.
      </h2>
      
      {/* CTA Section */}
      <div className="flex flex-col items-center w-full px-4 gap-6 md:gap-8">
        <button
          onClick={onStart}
          className="w-full max-w-[400px] md:px-24 py-5 md:py-8 bg-[#121212] text-white font-black rounded-2xl md:rounded-[2rem] transition-all hover:bg-black hover:shadow-2xl active:scale-95 shadow-xl text-base md:text-2xl tracking-[0.2em] uppercase italic focus:ring-4 focus:ring-amber-500"
          aria-label="Start your professional eligibility audit now"
        >
          START PROFESSIONAL AUDIT
        </button>

        <nav className="flex flex-wrap justify-center gap-4 md:gap-6 opacity-60 px-4" aria-label="Available GTV Categories">
           {["Digital Tech", "Arts & Culture", "Fashion Design", "Architecture"].map((route) => (
             <span key={route} className="text-[7px] md:text-[9px] font-black uppercase tracking-widest whitespace-nowrap text-zinc-700">{route}</span>
           ))}
        </nav>
      </div>
    </section>
  );
};

export default Hero;