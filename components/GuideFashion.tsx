
import React from 'react';
import { Helmet } from 'react-helmet-async';
import FAQSchema from './FAQSchema.tsx';

interface GuideProps {
  onStart: () => void;
}

const GuideFashion: React.FC<GuideProps> = ({ onStart }) => {
  const fashionFaqs = [
    {
      question: "Can fashion designers apply for the UK Global Talent Visa?",
      answer: "Yes. Fashion designers with international recognition, runway experience, fashion week participation, media coverage, or awards may be eligible for the UK Global Talent Visa via Arts Council England."
    },
    {
      question: "What is the Arts Council fashion visa endorsement criteria?",
      answer: "Evidence required includes press coverage in titles like Vogue, fashion shows, awards, professional endorsements, and proof of significant industry impact at a global level."
    },
    {
      question: "How do I check my fashion visa eligibility?",
      answer: "Use GTV AI Assessor to benchmark your fashion portfolio against official Arts Council criteria and receive an instant eligibility score."
    }
  ];

  return (
    <article className="max-w-4xl mx-auto py-20 px-6 animate-fade-in" id="fashion-guide">
      <Helmet>
        <title>Arts Council Fashion Visa: UK Global Talent Endorsement Guide for Designers</title>
        <meta name="description" content="Ultimate guide to the Arts Council fashion visa endorsement for designers. Check your UK Global Talent Visa eligibility with AI-powered criteria mapping." />
        <link rel="canonical" href="https://gtvassessor.com/global-talent-visa-fashion" />
      </Helmet>

      <FAQSchema items={fashionFaqs} />

      <div className="prose prose-zinc max-w-none">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-zinc-900 mb-6">Arts Council Fashion Visa & Endorsement</h1>
          <p className="text-lg md:text-xl text-zinc-600 leading-relaxed italic font-medium">
            The UK Global Talent Visa for fashion designers is a prestigious route for world-class creatives. 
            Understanding the Arts Council endorsement criteria is the first step to your UK professional future.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-6">Eligibility for Fashion Designers</h2>
          <p className="text-zinc-500 leading-relaxed">
            Fashion professionals applying under the Global Talent Visa route are endorsed by Arts Council England.
            You must demonstrate significant recognition, influence, and contribution to the fashion industry at an international level through media, awards, and industry leadership.
          </p>
        </section>

        <section className="mb-16 border-t border-zinc-100 pt-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-10">Common Questions on Fashion GTV</h2>
          <div className="space-y-8">
            {fashionFaqs.map((faq, i) => (
              <div key={i} className="space-y-3">
                <h3 className="font-black text-zinc-900 text-lg italic">{faq.question}</h3>
                <p className="text-zinc-500 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 bg-zinc-900 text-white p-12 rounded-[3rem] text-center">
          <h2 className="text-2xl md:text-3xl font-black uppercase italic mb-6 text-amber-500">AI Fashion Visa Eligibility Audit</h2>
          <p className="text-zinc-400 mb-10 italic">
            GTV Assessor evaluates your fashion career against official Arts Council criteria,
            providing a readiness score, strengths analysis, and tailored improvement guidance.
          </p>
          <button 
            onClick={onStart}
            className="w-full md:w-auto px-12 py-5 bg-amber-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-amber-500 transition-all shadow-xl"
          >
            Start Fashion Assessment
          </button>
        </section>
      </div>
    </article>
  );
};

export default GuideFashion;
