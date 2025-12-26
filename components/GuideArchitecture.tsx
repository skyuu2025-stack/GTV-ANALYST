import React from 'react';
import { Helmet } from 'react-helmet-async';
import FAQSchema from './FAQSchema.tsx';

interface GuideProps {
  onStart: () => void;
  onBack?: () => void;
}

const GuideArchitecture: React.FC<GuideProps> = ({ onStart, onBack }) => {
  const archFaqs = [
    {
      question: "Who endorses architects for the Global Talent Visa?",
      answer: "The Royal Institute of British Architects (RIBA) acts as the competent body for architectural practitioners on behalf of Arts Council England."
    },
    {
      question: "Can urban planners apply under this route?",
      answer: "Yes, urban planners and landscape architects can apply if they can demonstrate significant artistic or design-led impact on the built environment."
    }
  ];

  return (
    <article className="max-w-4xl mx-auto py-12 md:py-20 px-6 animate-fade-in">
      <Helmet>
        <title>Architecture UK Global Talent Visa | RIBA Endorsement Guide</title>
        <meta name="description" content="Guide for architects and urban planners applying for the UK Global Talent Visa. AI criteria mapping for RIBA endorsement." />
      </Helmet>

      <FAQSchema items={archFaqs} />

      {onBack && (
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
          <i className="fas fa-chevron-left"></i> Back to Wiki Hub
        </button>
      )}

      <div className="prose prose-zinc max-w-none">
        <header className="mb-12">
          <div className="inline-block px-3 py-1 bg-zinc-50 text-zinc-700 rounded-lg text-[9px] font-black uppercase tracking-widest mb-4">Field: Architecture</div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-zinc-900 mb-6">Architecture & RIBA</h1>
          <p className="text-lg md:text-xl text-zinc-600 leading-relaxed italic font-medium">
            The Royal Institute of British Architects (RIBA) evaluates leading practitioners who show exceptional talent or promise in architecture.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-6">Key RIBA Indicators</h2>
          <ul className="space-y-4 text-zinc-500 italic font-medium list-none pl-0">
            <li className="flex gap-4 items-start"><i className="fas fa-check-circle text-amber-500 mt-1"></i> Major international awards (Pritzker, RIBA Gold Medal).</li>
            <li className="flex gap-4 items-start"><i className="fas fa-check-circle text-amber-500 mt-1"></i> Press coverage in specialist architectural journals.</li>
            <li className="flex gap-4 items-start"><i className="fas fa-check-circle text-amber-500 mt-1"></i> Examples of significant built projects globally.</li>
          </ul>
        </section>

        <section className="mb-16 bg-zinc-900 text-white p-12 rounded-[3rem] text-center shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-black uppercase italic mb-6 text-amber-500">AI Architecture Audit</h2>
          <p className="text-zinc-400 mb-10 italic">
            Analyze your design portfolio against RIBA's endorsement framework.
          </p>
          <button onClick={onStart} className="w-full md:w-auto px-12 py-5 bg-zinc-700 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-zinc-600 transition-all shadow-xl active:scale-95">
            Start Architecture Assessment
          </button>
        </section>
      </div>
    </article>
  );
};

export default GuideArchitecture;