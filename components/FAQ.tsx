
import React, { useState } from 'react';

const FAQ: React.FC = () => {
  const faqs = [
    {
      q: "What is the Global Talent Visa (GTV) endorsement?",
      a: "The endorsement is the first stage of the GTV application where a designated body (like Tech Nation or Arts Council England) reviews your achievements and confirms you are a leader or potential leader in your field."
    },
    {
      q: "How accurate is the AI Assessor?",
      a: "Our AI model is trained on the latest official UK Home Office guidelines and Tech Nation digital visa criteria. While it provides high-fidelity analysis based on professional logic, it is an assessment tool and not a legal guarantee."
    },
    {
      q: "Can I apply for GTV if I am an emerging talent?",
      a: "Yes, the GTV has two routes: 'Exceptional Talent' for established leaders and 'Exceptional Promise' for emerging stars with less than 5 years of professional experience."
    },
    {
      q: "What evidence is typically required?",
      a: "Common evidence includes high-profile media coverage, international awards, letters of recommendation from industry experts, and proof of commercial or artistic impact."
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
