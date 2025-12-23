import React from 'react';

interface GuideProps {
  onStart: () => void;
}

const GuideTech: React.FC<GuideProps> = ({ onStart }) => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 animate-fade-in">
      <div className="prose prose-zinc max-w-none">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-zinc-900 mb-8">UK Global Talent Visa for Digital Technology Professionals</h1>
        
        <p className="text-lg md:text-xl text-zinc-600 leading-relaxed italic font-medium mb-12">
          The UK Global Talent Visa for digital technology professionals is designed for exceptional talent and emerging leaders in the tech sector.
          This page explains eligibility, endorsement criteria, and how to assess your readiness before applying.
        </p>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-6">What Is the Global Talent Visa for Digital Technology?</h2>
          <p className="text-zinc-500 leading-relaxed">
            Digital technology applicants apply for endorsement under the Tech Nation route.
            The visa targets individuals who have demonstrated significant technical, commercial, or innovative impact in the technology sector.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-6">Who Is Eligible for the Global Talent Visa in Tech?</h2>
          <p className="text-zinc-500 leading-relaxed mb-6">
            You may be eligible if you are a technology professional with a proven track record or strong potential for leadership.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Software engineers & Technical architects", "Startup founders & Co-founders", "Product managers & Technical leads", "AI, Blockchain & Data specialists"].map((item, idx) => (
              <li key={idx} className="flex items-center gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-100 font-bold uppercase text-[10px] tracking-widest italic">
                <i className="fas fa-check-circle text-[#D4AF37]"></i> {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-6">Tech Nation Endorsement Criteria</h2>
          <p className="text-zinc-500 leading-relaxed mb-6">
            Tech Nation evaluates applicants based on their contribution to the digital technology sector. Key evidence areas include:
          </p>
          <ul className="space-y-4">
            <li className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <i className="fas fa-lightbulb text-amber-600 text-xs"></i>
              </div>
              <span className="text-zinc-600 font-medium italic">Innovation in products, platforms, or proprietary systems</span>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <i className="fas fa-chart-line text-amber-600 text-xs"></i>
              </div>
              <span className="text-zinc-600 font-medium italic">Commercial impact and business growth metrics</span>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <i className="fas fa-code-branch text-amber-600 text-xs"></i>
              </div>
              <span className="text-zinc-600 font-medium italic">Technical leadership, open-source contributions or patents</span>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <i className="fas fa-file-signature text-amber-600 text-xs"></i>
              </div>
              <span className="text-zinc-600 font-medium italic">High-quality recommendation letters from industry experts</span>
            </li>
          </ul>
        </section>

        <section className="mb-16 p-8 bg-amber-50 rounded-[2.5rem] border border-amber-200">
          <h2 className="text-xl md:text-2xl font-black uppercase italic mb-6 text-amber-800">Common Reasons Tech Applicants Are Refused</h2>
          <ul className="space-y-3">
             <li className="text-amber-700 text-sm font-bold italic">• Evidence focused only on job duties, not impact</li>
             <li className="text-amber-700 text-sm font-bold italic">• Lack of independent recognition outside of current employer</li>
             <li className="text-amber-700 text-sm font-bold italic">• Unclear distinction between 'Talent' and 'Promise' criteria</li>
             <li className="text-amber-700 text-sm font-bold italic">• Weak or generic recommendation letters</li>
          </ul>
        </section>

        <section className="mb-16 bg-zinc-900 text-white p-12 rounded-[3rem] text-center">
          <h2 className="text-2xl md:text-3xl font-black uppercase italic mb-6 text-amber-500">AI-Powered Global Talent Visa Assessment for Tech Professionals</h2>
          <p className="text-zinc-400 mb-10 italic">
            GTV Assessor analyzes your technical background, achievements, and leadership indicators against Tech Nation criteria,
            providing a readiness score and targeted improvement guidance.
          </p>
          <button 
            onClick={onStart}
            className="cta-button"
          >
            Start Tech Visa Assessment
          </button>
        </section>

        <section className="text-zinc-400 text-xs italic space-x-4">
          <span>Related guides:</span>
          <a href="/global-talent-visa" className="underline hover:text-zinc-900">GTV Overview</a>
          <span>|</span>
          <a href="/global-talent-visa-fashion" className="underline hover:text-zinc-900">Fashion Guide</a>
          <span>|</span>
          <a href="/global-talent-visa-tech" className="underline hover:text-zinc-900">Tech Guide</a>
        </section>
      </div>
    </div>
  );
};

export default GuideTech;