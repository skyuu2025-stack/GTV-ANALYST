
import React from 'react';

const SocialProof: React.FC = () => {
  const cases = [
    { name: "S. Zhang", role: "AI Research Lead", verdict: "Endorsed via Tech Nation", text: "The AI analysis predicted an 85% success rate and identified exactly which evidence I was missing." },
    { name: "L. Dubois", role: "Fashion Designer", verdict: "Endorsed via Arts Council", text: "Saved me weeks of manual criteria mapping. The tactical roadmap is a game changer." }
  ];

  return (
    <section className="py-24 bg-zinc-50/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Global Success Stories</h3>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">Trusted by Global Talents</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map((c, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-white font-bold text-xs">{c.name[0]}</div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tight">{c.name}</h4>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{c.role}</p>
                </div>
                <div className="ml-auto px-3 py-1 bg-amber-50 text-amber-600 text-[9px] font-black uppercase rounded-full border border-amber-100 italic">
                  {c.verdict}
                </div>
              </div>
              <p className="text-zinc-600 italic font-medium leading-relaxed">"{c.text}"</p>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all">
           {['Tech Nation', 'Arts Council', 'Royal Academy', 'Home Office'].map(logo => (
             <span key={logo} className="text-sm font-black uppercase tracking-[0.3em] italic">{logo} Criteria</span>
           ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
