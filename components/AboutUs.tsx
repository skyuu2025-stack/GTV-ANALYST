import React from 'react';

interface AboutUsProps {
  onBack: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 md:py-20 px-6 animate-fade-in space-y-16 pb-32">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
      >
        <i className="fas fa-chevron-left"></i> Back to Profile
      </button>

      <div className="space-y-6">
        <div className="inline-block px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest">
          Mission 2025
        </div>
        <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-zinc-900 leading-[0.85]">
          DEMOCRATIZING <br/> GLOBAL <br/> <span className="text-amber-600">TALENT</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-500 leading-relaxed italic font-medium max-w-2xl">
          We are an independent technology collective dedicated to removing the friction from high-stakes immigration through professional-grade AI auditing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
        <section className="space-y-4">
          <h3 className="text-zinc-900 font-black uppercase tracking-widest text-xs flex items-center gap-3">
             <div className="w-6 h-px bg-amber-500"></div> Our Vision
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed font-medium italic">
            The UK Global Talent Visa (GTV) is one of the world's most powerful visa routes, but its criteria are often opaque. GTV Assessor was born to provide world-class talent with the same level of analytical depth usually reserved for elite law firms.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-zinc-900 font-black uppercase tracking-widest text-xs flex items-center gap-3">
             <div className="w-6 h-px bg-amber-500"></div> The Technology
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed font-medium italic">
            Powered by the latest Gemini 3 models, our engine maps complex career histories to the specific, evolving standards of Tech Nation, Arts Council England, RIBA, and other official endorsing bodies.
          </p>
        </section>
      </div>

      <div className="bg-zinc-50 p-10 rounded-[3rem] border border-zinc-100 grid md:grid-cols-3 gap-8">
        <div className="text-center space-y-2">
          <span className="text-2xl font-black text-zinc-900 italic">5,000+</span>
          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Audits Performed</p>
        </div>
        <div className="text-center space-y-2">
          <span className="text-2xl font-black text-zinc-900 italic">24/7</span>
          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">AI Concierge</p>
        </div>
        <div className="text-center space-y-2">
          <span className="text-2xl font-black text-zinc-900 italic">92%</span>
          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Accuracy Benchmark</p>
        </div>
      </div>

      <section className="space-y-8">
        <h2 className="text-2xl font-black uppercase italic tracking-tight text-zinc-900">Why GTV Assessor?</h2>
        <div className="space-y-6">
          {[
            { title: "Independently Verified", desc: "We are not a law firm. We are a software platform that empowers you with the data you need to succeed with or without legal representation." },
            { title: "Real-Time Updates", desc: "Our engine is trained on the latest caseworker guidance to ensure your audit reflects 2025 Home Office standards." },
            { title: "Privacy First", desc: "Your data is encrypted end-to-end and can be wiped instantly at any time via your profile settings." }
          ].map((item, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-black shrink-0">0{i+1}</div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-zinc-900 uppercase italic">{item.title}</h4>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed italic">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-10 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.3em]">Built for the Global Talent ecosystem</p>
        <a 
          href="mailto:skyuu2025@gmail.com" 
          className="text-[11px] font-black text-zinc-900 uppercase tracking-[0.05em] border-b-2 border-amber-500 pb-1.5 transition-all active:scale-95"
        >
          CONTACT THE LAB
        </a>
      </div>
    </div>
  );
};

export default AboutUs;