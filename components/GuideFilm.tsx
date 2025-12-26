import React from 'react';
import { Helmet } from 'react-helmet-async';
import FAQSchema from './FAQSchema.tsx';

interface GuideProps {
  onStart: () => void;
  onBack?: () => void;
}

const GuideFilm: React.FC<GuideProps> = ({ onStart, onBack }) => {
  const filmFaqs = [
    {
      question: "Who can apply under the Film & TV route?",
      answer: "Producers, directors, writers, actors, and post-production specialists. Endorsement is managed by PACT on behalf of Arts Council England."
    },
    {
      question: "Are Academy Awards required for this visa?",
      answer: "While a 'Main Award' (Oscar, BAFTA, Emmy) provides a fast-track, you can also qualify under the talent or promise criteria with significant industry impact and recognition."
    }
  ];

  return (
    <article className="max-w-4xl mx-auto py-12 md:py-20 px-6 animate-fade-in">
      <Helmet>
        <title>Film & TV UK Global Talent Visa | PACT Endorsement Guide</title>
        <meta name="description" content="Guide for filmmakers, producers, and actors applying for the UK Global Talent Visa. AI criteria mapping for PACT endorsement." />
      </Helmet>

      <FAQSchema items={filmFaqs} />

      {onBack && (
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
          <i className="fas fa-chevron-left"></i> Back to Wiki Hub
        </button>
      )}

      <div className="prose prose-zinc max-w-none">
        <header className="mb-12">
          <div className="inline-block px-3 py-1 bg-red-50 text-red-700 rounded-lg text-[9px] font-black uppercase tracking-widest mb-4">Field: Film & TV</div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-zinc-900 mb-6">Film, Television & Animation</h1>
          <p className="text-lg md:text-xl text-zinc-600 leading-relaxed italic font-medium">
            PACT handles endorsements for the film, television, post-production, and animation sectors. 
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-6">Industry Recognition</h2>
          <div className="bg-red-50 p-8 rounded-[3rem] border border-red-100 italic font-medium text-zinc-700">
            PACT requires evidence of "sustained recognition" or "significant career progress" through professional awards, press reviews in top industry publications (Variety, THR), and evidence of distribution or festival selection.
          </div>
        </section>

        <section className="mb-16 bg-zinc-900 text-white p-12 rounded-[3rem] text-center shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-black uppercase italic mb-6 text-amber-500">AI Film & TV Audit</h2>
          <p className="text-zinc-400 mb-10 italic">
            Scan your IMDb and credits against PACT criteria.
          </p>
          <button onClick={onStart} className="w-full md:w-auto px-12 py-5 bg-red-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-red-500 transition-all shadow-xl active:scale-95">
            Start Film Assessment
          </button>
        </section>
      </div>
    </article>
  );
};

export default GuideFilm;