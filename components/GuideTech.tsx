import React from 'react';
import { Helmet } from 'react-helmet-async';
import FAQSchema from './FAQSchema.tsx';

interface GuideProps {
  onStart: () => void;
  onBack?: () => void;
}

const GuideTech: React.FC<GuideProps> = ({ onStart, onBack }) => {
  const techFaqs = [
    {
      question: "Who can apply for the Tech Nation endorsement?",
      answer: "Software engineers, startup founders, AI specialists, and technical leaders with proven impact in the digital technology sector may qualify for Tech Nation GTV endorsement."
    },
    {
      question: "What are the Tech Nation Global Talent Visa requirements?",
      answer: "Applicants must meet mandatory leadership criteria and at least two optional criteria focused on innovation, proof of recognition, and technical or business contribution."
    },
    {
      question: "How does AI help with Tech Nation endorsement?",
      answer: "Our AI Assessor scans your technical background and evidence against Tech Nation's 2025 guidelines to detect gaps before you submit your formal application."
    }
  ];

  return (
    <article className="max-w-4xl mx-auto py-12 md:py-20 px-6 animate-fade-in" id="tech-guide">
      <Helmet>
        <title>{`Tech Nation Endorsement Guide: UK Global Talent Visa AI Eligibility Check`}</title>
        <meta name="description" content="Complete Tech Nation endorsement guide for the UK Global Talent Visa. Use our AI tool to check your tech visa eligibility and map your evidence instantly." />
        <link rel="canonical" href="https://gtvassessor.com/global-talent-visa-tech" />
      </Helmet>

      <FAQSchema items={techFaqs} />

      {onBack && (
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <i className="fas fa-chevron-left"></i> Back to Wiki Hub
        </button>
      )}

      <div className="prose prose-zinc max-w-none">
        <header className="mb-12">
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[9px] font-black uppercase tracking-widest mb-4">Field: Digital Tech</div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-zinc-900 mb-6">Tech Nation Endorsement & UK Tech Visa</h1>
          <p className="text-lg md:text-xl text-zinc-600 leading-relaxed italic font-medium">
            The Digital Technology route for the UK Global Talent Visa is the premier path for engineers, founders, and tech innovators to move to the UK. 
            Understanding Tech Nation criteria is critical for success.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-6">Tech Nation Endorsement Criteria</h2>
          <p className="text-zinc-500 leading-relaxed">
            The Global Talent Visa targets individuals who have demonstrated significant technical, commercial, or innovative impact. 
            Whether you are a technical lead or a business founder, your evidence must show that you are a leader in the global tech ecosystem.
          </p>
        </section>

        <section className="mb-16 border-t border-zinc-100 pt-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-10">Tech GTV FAQ</h2>
          <div className="space-y-8">
            {techFaqs.map((faq, i) => (
              <div key={i} className="space-y-3">
                <h3 className="font-black text-zinc-900 text-lg italic">{faq.question}</h3>
                <p className="text-zinc-500 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 bg-zinc-900 text-white p-12 rounded-[3rem] text-center shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-black uppercase italic mb-6 text-amber-500">AI-Powered Tech Nation Eligibility Audit</h2>
          <p className="text-zinc-400 mb-10 italic">
            Analyze your technical career against official Tech Nation requirements. Receive a professional readiness score and evidence roadmap.
          </p>
          <button 
            onClick={onStart}
            className="w-full md:w-auto px-12 py-5 bg-amber-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-amber-500 transition-all shadow-xl active:scale-95"
          >
            Start Tech Assessment
          </button>
        </section>
      </div>
    </article>
  );
};

export default GuideTech;