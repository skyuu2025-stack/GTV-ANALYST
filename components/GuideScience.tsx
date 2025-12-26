import React from 'react';
import { Helmet } from 'react-helmet-async';
import FAQSchema from './FAQSchema.tsx';

interface GuideProps {
  onStart: () => void;
  onBack?: () => void;
}

const GuideScience: React.FC<GuideProps> = ({ onStart, onBack }) => {
  const scienceFaqs = [
    {
      question: "Who are the endorsing bodies for science?",
      answer: "The Royal Society (Natural Sciences), British Academy (Humanities), Royal Academy of Engineering, and UKRI (Research) act as endorsing bodies."
    },
    {
      question: "Does the science route require a job offer?",
      answer: "Not necessarily. While there is a fast-track for those with fellowships or senior academic appointments, individuals can apply based on professional impact without a specific role."
    }
  ];

  return (
    <article className="max-w-4xl mx-auto py-12 md:py-20 px-6 animate-fade-in">
      <Helmet>
        <title>Science & Research UK Global Talent Visa | Academic Endorsement Guide</title>
        <meta name="description" content="Guide for scientists and researchers applying for the UK Global Talent Visa. AI criteria mapping for Royal Society and UKRI endorsement." />
      </Helmet>

      <FAQSchema items={scienceFaqs} />

      {onBack && (
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
          <i className="fas fa-chevron-left"></i> Back to Wiki Hub
        </button>
      )}

      <div className="prose prose-zinc max-w-none">
        <header className="mb-12">
          <div className="inline-block px-3 py-1 bg-green-50 text-green-700 rounded-lg text-[9px] font-black uppercase tracking-widest mb-4">Field: Science & Research</div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-zinc-900 mb-6">Science, Engineering & Humanities</h1>
          <p className="text-lg md:text-xl text-zinc-600 leading-relaxed italic font-medium">
            This route is for researchers and specialists in science, engineering, humanities, and medicine. It includes academic leaders and industry-based researchers.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-6">Four Pathways to Endorsement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 border border-zinc-100 rounded-3xl">
              <h4 className="text-xs font-black uppercase tracking-widest mb-2">1. Peer Review</h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase italic">Standard talent/promise application.</p>
            </div>
            <div className="p-6 border border-zinc-100 rounded-3xl">
              <h4 className="text-xs font-black uppercase tracking-widest mb-2">2. Fast-Track (Fellowships)</h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase italic">For those with approved research fellowships.</p>
            </div>
            <div className="p-6 border border-zinc-100 rounded-3xl">
              <h4 className="text-xs font-black uppercase tracking-widest mb-2">3. Fast-Track (Senior Academic)</h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase italic">University professorships or readers.</p>
            </div>
            <div className="p-6 border border-zinc-100 rounded-3xl">
              <h4 className="text-xs font-black uppercase tracking-widest mb-2">4. UKRI Endorsed Funder</h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase italic">For those on grants from approved funders.</p>
            </div>
          </div>
        </section>

        <section className="mb-16 bg-zinc-900 text-white p-12 rounded-[3rem] text-center shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-black uppercase italic mb-6 text-amber-500">AI Science & Research Audit</h2>
          <p className="text-zinc-400 mb-10 italic">
            Benchmark your citations and professional history against academic endorsement standards.
          </p>
          <button onClick={onStart} className="w-full md:w-auto px-12 py-5 bg-green-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-green-500 transition-all shadow-xl active:scale-95">
            Start Science Assessment
          </button>
        </section>
      </div>
    </article>
  );
};

export default GuideScience;