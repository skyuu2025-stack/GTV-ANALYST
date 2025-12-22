import React, { useState } from 'react';

const FAQ: React.FC = () => {
  const faqs = [
    {
      q: "What is the UK Global Talent Visa?",
      a: "The UK Global Talent Visa allows leaders or potential leaders in fields such as arts, fashion, digital technology, and academia to live and work in the UK without employer sponsorship."
    },
    {
      q: "Who is eligible for the Global Talent Visa?",
      a: "Applicants must demonstrate exceptional talent or exceptional promise and be endorsed by an official UK endorsing body such as Arts Council England or Tech Nation."
    },
    {
      q: "How accurate is the GTV Assessor AI evaluation?",
      a: "GTV Assessor uses structured criteria based on UK endorsement guidelines to analyze your background and evidence. While not a legal decision, it provides a strong indication of readiness and areas for improvement."
    },
    {
      q: "Is GTV Assessor a legal service?",
      a: "No. GTV Assessor is an AI-powered assessment tool designed for guidance and preparation. It does not replace immigration lawyers or official UK Home Office decisions."
    },
    {
      q: "How long does the assessment take?",
      a: "The assessment typically takes 3–5 minutes to complete, and results are generated automatically after submission."
    },
    {
      q: "Is the assessment free?",
      a: "The initial evaluation requires payment. Pricing is displayed clearly before checkout."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-4xl mx-auto py-24 px-6 border-t border-zinc-100">
      <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-8 text-center">Frequently Asked Questions</h3>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-zinc-100 rounded-2xl overflow-hidden bg-white hover:border-amber-100 transition-colors">
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-8 py-6 text-left flex justify-between items-center group"
            >
              <span className="text-sm font-bold text-zinc-800 tracking-tight group-hover:text-zinc-900 transition-colors">{faq.q}</span>
              <i className={`fas fa-chevron-down text-[10px] text-zinc-300 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}></i>
            </button>
            {openIndex === i && (
              <div className="px-8 pb-8 animate-fade-in">
                <p className="text-zinc-500 text-sm leading-relaxed font-medium italic">
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;