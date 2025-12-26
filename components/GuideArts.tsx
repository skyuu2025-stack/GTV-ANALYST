import React from 'react';
import { Helmet } from 'react-helmet-async';
import FAQSchema from './FAQSchema.tsx';

interface GuideProps {
  onStart: () => void;
  onBack?: () => void;
}

const GuideArts: React.FC<GuideProps> = ({ onStart, onBack }) => {
  const artsFaqs = [
    {
      question: "Which art forms are covered under the Arts Council GTV?",
      answer: "The Arts Council England endorses professionals in visual arts, dance, literature, music, theatre, and combined arts. It also covers film, television, and architecture through specific bodies."
    },
    {
      question: "What is the requirement for international recognition in arts?",
      answer: "You must provide evidence of being an established leader or an emerging leader with international press coverage, major awards, and performances or exhibitions in at least two countries."
    },
    {
      question: "Can I apply as a freelance artist?",
      answer: "Yes, the GTV is ideal for freelancers as it doesn't require a single employer sponsorship, provided you meet the talent or promise criteria."
    }
  ];

  return (
    <article className="max-w-4xl mx-auto py-12 md:py-20 px-6 animate-fade-in">
      <Helmet>
        <title>Arts & Culture UK Global Talent Visa | Arts Council Endorsement Guide</title>
        <meta name="description" content="Guide for artists, musicians, and writers applying for the UK Global Talent Visa. AI criteria mapping for Arts Council England endorsement." />
      </Helmet>

      <FAQSchema items={artsFaqs} />

      {onBack && (
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
          <i className="fas fa-chevron-left"></i> Back to Wiki Hub
        </button>
      )}

      <div className="prose prose-zinc max-w-none">
        <header className="mb-12">
          <div className="inline-block px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-[9px] font-black uppercase tracking-widest mb-4">Field: Arts & Culture</div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-zinc-900 mb-6">Arts & Culture Endorsement</h1>
          <p className="text-lg md:text-xl text-zinc-600 leading-relaxed italic font-medium">
            Arts Council England evaluates practitioners in the creative industries. From visual artists to classical musicians, this route values cultural impact over commercial revenue.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-6">Core Evidence Requirements</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-50 p-6 rounded-3xl">
              <h4 className="text-sm font-black uppercase tracking-tight mb-2">Talent (Established Leaders)</h4>
              <p className="text-xs text-zinc-500 italic">Significant international media coverage, major individual awards (Grammys, Oscars), and a career spanning 5+ years.</p>
            </div>
            <div className="bg-zinc-50 p-6 rounded-3xl">
              <h4 className="text-sm font-black uppercase tracking-tight mb-2">Promise (Emerging Leaders)</h4>
              <p className="text-xs text-zinc-500 italic">Early-stage recognition, press in national titles, and proof of potential to become a leader in your field.</p>
            </div>
          </div>
        </section>

        <section className="mb-16 bg-zinc-900 text-white p-12 rounded-[3rem] text-center shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-black uppercase italic mb-6 text-amber-500">AI Arts Eligibility Audit</h2>
          <p className="text-zinc-400 mb-10 italic">
            Analyze your artistic portfolio against official Arts Council criteria.
          </p>
          <button onClick={onStart} className="w-full md:w-auto px-12 py-5 bg-purple-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-purple-500 transition-all shadow-xl active:scale-95">
            Start Arts Assessment
          </button>
        </section>
      </div>
    </article>
  );
};

export default GuideArts;