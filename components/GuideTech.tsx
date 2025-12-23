import React from 'react';
import { Helmet } from 'react-helmet-async';
import FAQSchema from './FAQSchema.tsx';

interface GuideProps {
  onStart: () => void;
}

const GuideTech: React.FC<GuideProps> = ({ onStart }) => {
  const techFaqs = [
    {
      question: "Can software engineers apply for the Global Talent Visa?",
      answer: "Yes. Software engineers, startup founders, AI specialists, and tech leaders can apply under the Tech Nation route if they demonstrate significant technical or commercial impact."
    },
    {
      question: "What are the Tech Nation endorsement criteria?",
      answer: "Criteria include innovation in products, commercial impact metrics, technical leadership in fields like AI or Cloud, and high-quality recommendation letters from established tech CEOs."
    },
    {
      question: "Does the AI assessment analyze GitHub and technical impact?",
      answer: "Yes, our AI Assessor evaluates your technical background and product impact to determine your eligibility probability for a Tech Nation endorsement."
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
