import React from 'react';
import { Helmet } from 'react-helmet-async';
import FAQSchema from './FAQSchema.tsx';

interface GuideProps {
  onStart: () => void;
}

const GuideTech: React.FC<GuideProps> = ({ onStart }) => {
  const techFaqs = [
    {
      question: "Who can apply for the Global Talent Visa under the tech route?",
      answer: "Software engineers, startup founders, AI specialists, product managers, and technical leaders with proven impact may qualify under the Digital Technology route."
    },
    {
      question: "Is Tech Nation endorsement still required?",
      answer: "Applicants must meet the UK Home Office requirements for the digital technology route. Endorsing bodies and criteria may change over time, and our AI reflects the latest 2025 guidelines."
    },
    {
      question: "How does the AI assess my technical background?",
      answer: "Our AI Assessor evaluates your professional experience, technical contributions, and leadership indicators against official endorsement criteria."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 animate-fade-in">
      <Helmet>
        <title>Global Talent Visa for Tech Professionals | GTV AI Assessor</title>
        <meta name="description" content="AI-powered eligibility check for the UK Global Talent Visa for software engineers, founders, and tech leaders. Get your roadmap today." />
        <link rel="canonical" href="https://gtvassessor.com/global-talent-visa-tech" />
      </Helmet>

      <FAQSchema items={techFaqs} />

      <div className="prose prose-zinc max-w-none">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-zinc-900 mb-8">UK Global Talent Visa for Tech Professionals</h1>
        
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

        {/* Explicit FAQ for SEO Consistency */}
        <section className="mb-16 border-t border-zinc-100 pt-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-10">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {techFaqs.map((faq, i) => (
              <div key={i} className="space-y-3">
                <h3 className="font-black text-zinc-900 text-lg italic">{faq.question}</h3>
                <p className="text-zinc-500 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 bg-zinc-900 text-white p-12 rounded-[3rem] text-center">
          <h2 className="text-2xl md:text-3xl font-black uppercase italic mb-6 text-amber-500">AI-Powered Global Talent Visa Assessment for Tech Professionals</h2>
          <p className="text-zinc-400 mb-10 italic">
            GTV Assessor analyzes your technical background, achievements, and leadership indicators against Tech Nation criteria,
            providing a readiness score and targeted improvement guidance.
          </p>
          <button 
            onClick={onStart}
            className="w-full md:w-auto px-12 py-5 bg-amber-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-amber-500 transition-all shadow-xl"
          >
            Start Tech Visa Assessment
          </button>
        </section>
      </div>
    </div>
  );
};

export default GuideTech;