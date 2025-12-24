import React from 'react';

interface HeroProps { onStart: () => void; }

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="hero-critical bg-white relative overflow-hidden">
      {/* Background Glow - GPU Accelerated */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] aspect-square bg-amber-50/30 rounded-full blur-[80px] -z-10 will-change-transform"
        aria-hidden="true"
      ></div>
      
      {/* Social Proof */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex -space-x-2" aria-label="Successful applicants">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 overflow-hidden">
              <img 
                src={`https://i.pravatar.cc/64?img=${i+20}`} 
                alt="" 
                width="32" 
                height="32"
                fetchpriority={i === 1 ? "high" : "low"}
                loading="eager"
                className="w-full h-full object-cover" 
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-start">
          <div className="flex text-amber-500 text-[8px] gap-0.5">
            {[1,2,3,4,5].map(s => <i key={s} className="fas fa-star" aria-hidden="true"></i>)}
          </div>
          <span className="text-[7px] font-black uppercase tracking-widest text-zinc-500">4.9/5 RATING</span>
        </div>
      </div>

      {/* Badge */}
      <div className="badge-critical italic ring-2 ring-amber-50/50">
        <i className="fas fa-bolt-lightning mr-2 text-amber-600" aria-hidden="true"></i> 2025 UK IMMIGRATION
      </div>
      
      {/* Main LCP Headline */}
      <h1 
        fetchpriority="high"
        className="h1-critical text-[#121212] px-2"
      >
        UK GLOBAL TALENT VISA <br/>
        <span className="text-[#A48020]">AI ELIGIBILITY AUDIT</span>
      </h1>
      
      <h2 className="text-zinc-600 text-sm md:text-lg max-w-xl mx-auto leading-relaxed mb-6 font-medium italic px-6">
        Definitive professional assessment tool for UK GTV readiness. Map your evidence for Tech Nation and Arts Council instantly.
      </h2>
      
      <div className="w-full px-4 flex flex-col items-center">
        <button
          onClick={onStart}
          className="btn-critical transition-transform hover:scale-[1.02] active:scale-95 shadow-xl italic"
        >
          START PROFESSIONAL AUDIT
        </button>

        <nav className="flex gap-4 mt-6 opacity-40 text-[7px] font-black uppercase tracking-widest" aria-label="GTV Categories">
           <span>Digital Tech</span>
           <span>Arts & Culture</span>
           <span>Fashion</span>
           <span>Architecture</span>
        </nav>
      </div>
    </section>
  );
};

export default Hero;