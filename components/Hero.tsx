import React from 'react';

interface HeroProps { onStart: () => void; }

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="bg-white min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 md:px-6 py-10 md:py-20 text-center animate-fade-in relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-50/20 rounded-full blur-[120px] -z-10"></div>
      
      {/* Social Proof Avatars */}
      <div className="flex items-center gap-3 mb-10">
        <div className="flex -space-x-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white bg-zinc-100 overflow-hidden shadow-sm">
              <img src={`https://i.pravatar.cc/100?img=${i+15}`} alt="user" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-start ml-1">
          <div className="flex text-amber-400 text-[10px] gap-0.5">
            <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">4.9/5 RATING (500+ VERIFIED)</span>
        </div>
      </div>

      {/* Badge */}
      <div className="inline-flex items-center px-6 py-2.5 bg-white border border-amber-100 rounded-full text-amber-600 text-[11px] font-black uppercase tracking-[0.2em] mb-10 shadow-sm italic ring-4 ring-amber-50/50">
        <i className="fas fa-bolt-lightning mr-2 text-amber-500 animate-pulse"></i> 2025 UPDATED CRITERIA
      </div>
      
      {/* Headline */}
      <h1 className="text-[40px] md:text-[92px] font-black text-[#121212] max-w-6xl leading-[0.95] md:leading-[0.85] mb-10 tracking-tighter uppercase italic">
        UK GLOBAL TALENT VISA <br/>
        <span className="text-[#C4A030] drop-shadow-sm">ELIGIBILITY ASSESSMENT</span> <br/>
        BY AI
      </h1>
      
      {/* Subheadline */}
      <h2 className="text-zinc-400 text-sm md:text-[22px] max-w-3xl mx-auto leading-relaxed mb-14 font-medium italic px-4">
        Check Your Global Talent Visa Readiness in Minutes. AI-powered evaluation for Tech Nation, Arts Council, and RIBA.
      </h2>
      
      {/* CTA Section */}
      <div className="flex flex-col items-center w-full px-4 gap-6">
        <button
          onClick={onStart}
          className="w-full max-w-[500px] md:w-auto md:px-24 py-6 md:py-8 bg-[#121212] text-white font-black rounded-[2rem] transition-all hover:bg-black hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] active:scale-95 shadow-xl text-lg md:text-2xl tracking-[0.2em] uppercase italic"
        >
          START AI ASSESSMENT
        </button>
      </div>
    </section>
  );
};

export default Hero;