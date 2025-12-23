import React from 'react';
import { Helmet } from 'react-helmet-async';
import FAQSchema from './FAQSchema.tsx';

interface GuideProps {
  onStart: () => void;
}

const GuideFashion: React.FC<GuideProps> = ({ onStart }) => {
  const fashionFaqs = [
    {
      question: "Can fashion designers apply for the Global Talent Visa?",
      answer: "Yes. Fashion designers with international recognition, runway experience, media coverage in Vogue, or major awards are eligible under the Global Talent Visa route endorsed by Arts Council England."
    },
    {
      question: "What evidence is required for a Global Talent fashion designer endorsement?",
      answer: "Key evidence includes runway show proofs, presentations, press clippings in recognized fashion media like Vogue or Harper's Bazaar, sales performance, and high-quality recommendation letters from industry leaders."
    },
    {
      question: "Does the AI assessment score runway achievements?",
      answer: "Yes, GTV Assessor analyzes runway participation and fashion week appearances to calculate your eligibility probability for the Arts Council endorsement."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 animate-fade-in">
      <Helmet>
        <title>Global Talent Visa for Fashion Designers | GTV AI Assessor</title>
        <meta name="description" content="Check your eligibility for the UK Global Talent Visa as a fashion designer. AI-powered assessment based on Home Office and Arts Council criteria." />
        <link rel="canonical" href="https://gtvassessor.com/global-talent-visa-fashion" />
      </Helmet>

      <FAQSchema items={fashionFaqs} />

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

        <section className="mb-16 bg-zinc-900 text-white p-12 rounded-[3rem] text-center">
          <h2 className="text-2xl md:text-3xl font-black uppercase italic mb-6 text-amber-500">AI-Powered Global Talent Visa Assessment for Fashion Designers</h2>
          <p className="text-zinc-400 mb-10 italic">
            GTV Assessor evaluates your fashion career against Arts Council England criteria,
            providing a readiness score, strengths analysis, and tailored improvement guidance.
          </p>
          <button 
            onClick={onStart}
            className="w-full md:w-auto px-12 py-5 bg-amber-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-amber-500 transition-all shadow-xl"
          >
            Start Fashion Visa Assessment
          </button>
        </section>
      </div>
    </div>
  );
};

export default GuideFashion;
