import React from 'react';

interface GuideProps {
  onStart: () => void;
}

const GuideFashion: React.FC<GuideProps> = ({ onStart }) => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 animate-fade-in">
      <div className="prose prose-zinc max-w-none">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-zinc-900 mb-8">UK Global Talent Visa for Fashion Designers</h1>
        
        <p className="text-lg md:text-xl text-zinc-600 leading-relaxed italic font-medium mb-12">
          The UK Global Talent Visa for fashion designers is designed for exceptional and emerging talent in the global fashion industry.
          This page explains eligibility, endorsement criteria, and how fashion professionals can assess their readiness before applying.
        </p>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-6">What Is the Global Talent Visa for Fashion?</h2>
          <p className="text-zinc-500 leading-relaxed">
            Fashion professionals applying under the Global Talent Visa route are endorsed by Arts Council England.
            Applicants must demonstrate significant recognition, influence, and contribution to the fashion industry at an international or national level.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-6">Who Is Eligible for the Global Talent Visa in Fashion?</h2>
          <p className="text-zinc-500 leading-relaxed mb-6">
            You may be eligible if you are a fashion professional with a strong creative track record and industry recognition.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Independent fashion designers", "Fashion brand founders and creative directors", "Designers featured in fashion weeks", "Fashion professionals with awards"].map((item, idx) => (
              <li key={idx} className="flex items-center gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-100 font-bold uppercase text-[10px] tracking-widest italic">
                <i className="fas fa-check-circle text-[#D4AF37]"></i> {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-6">Arts Council England Endorsement Criteria for Fashion</h2>
          <p className="text-zinc-500 leading-relaxed mb-6">
            Key evidence areas include:
          </p>
          <ul className="space-y-4">
            <li className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <i className="fas fa-camera text-amber-600 text-xs"></i>
              </div>
              <span className="text-zinc-600 font-medium italic">Runway shows, presentations, or major exhibitions</span>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <i className="fas fa-newspaper text-amber-600 text-xs"></i>
              </div>
              <span className="text-zinc-600 font-medium italic">Press coverage in recognized fashion media (Vogue, Hypebeast, etc.)</span>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <i className="fas fa-chart-line text-amber-600 text-xs"></i>
              </div>
              <span className="text-zinc-600 font-medium italic">Sales performance or verifiable brand growth</span>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <i className="fas fa-envelope-open-text text-amber-600 text-xs"></i>
              </div>
              <span className="text-zinc-600 font-medium italic">Strong recommendation letters from global industry leaders</span>
            </li>
          </ul>
        </section>

        <section className="mb-16 p-8 bg-amber-50 rounded-[2.5rem] border border-amber-200">
          <h2 className="text-xl md:text-2xl font-black uppercase italic mb-6 text-amber-800">Common Reasons Fashion Applicants Are Refused</h2>
          <ul className="space-y-3">
             <li className="text-amber-700 text-sm font-bold italic">• Weak or unstructured evidence presentation</li>
             <li className="text-amber-700 text-sm font-bold italic">• Too much focus on aesthetics without industry impact</li>
             <li className="text-amber-700 text-sm font-bold italic">• Lack of independent recognition</li>
             <li className="text-amber-700 text-sm font-bold italic">• Unclear professional positioning</li>
          </ul>
        </section>

        <section className="mb-16 bg-zinc-900 text-white p-12 rounded-[3rem] text-center">
          <h2 className="text-2xl md:text-3xl font-black uppercase italic mb-6 text-amber-500">AI-Powered Global Talent Visa Assessment for Fashion Designers</h2>
          <p className="text-zinc-400 mb-10 italic">
            GTV Assessor evaluates your fashion career against Arts Council England criteria,
            providing a readiness score, strengths analysis, and tailored improvement guidance.
          </p>
          <button 
            onClick={onStart}
            className="cta-button"
          >
            Start Fashion Visa Assessment
          </button>
        </section>

        <section className="text-zinc-400 text-xs italic space-x-4">
          <span>Related guides:</span>
          <a href="/global-talent-visa" className="underline hover:text-zinc-900">GTV Overview</a>
          <span>|</span>
          <a href="/global-talent-visa-fashion" className="underline hover:text-zinc-900">Fashion Guide</a>
        </section>
      </div>
    </div>
  );
};

export default GuideFashion;