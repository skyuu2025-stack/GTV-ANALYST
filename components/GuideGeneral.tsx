import React from 'react';

interface GuideProps {
  onStart: () => void;
}

const GuideGeneral: React.FC<GuideProps> = ({ onStart }) => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 animate-fade-in">
      <div className="prose prose-zinc max-w-none">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-zinc-900 mb-8">UK Global Talent Visa: Eligibility, Requirements and Assessment</h1>
        
        <p className="text-lg md:text-xl text-zinc-600 leading-relaxed italic font-medium mb-12">
          The UK Global Talent Visa is designed for exceptional individuals and emerging leaders in fields such as arts, fashion, digital technology, and academia.
          This page explains how the visa works, who is eligible, and how to assess your readiness before applying.
        </p>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-6">What Is the UK Global Talent Visa?</h2>
          <p className="text-zinc-500 leading-relaxed">
            The Global Talent Visa allows highly skilled professionals to live and work in the UK without employer sponsorship.
            Applicants must first obtain an endorsement from an approved endorsing body before applying for the visa.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-6">Who Is Eligible for the Global Talent Visa?</h2>
          <p className="text-zinc-500 leading-relaxed mb-6">
            You may be eligible if you can demonstrate exceptional talent or exceptional promise and are recognized by an approved endorsing body.
          </p>
          <ul className="space-y-4">
            <li className="flex gap-4 items-start">
              <i className="fas fa-check-circle text-[#D4AF37] mt-1"></i>
              <span className="text-zinc-600 font-bold text-sm">Leaders or emerging leaders in arts and culture</span>
            </li>
            <li className="flex gap-4 items-start">
              <i className="fas fa-check-circle text-[#D4AF37] mt-1"></i>
              <span className="text-zinc-600 font-bold text-sm">Fashion designers and creative professionals</span>
            </li>
            <li className="flex gap-4 items-start">
              <i className="fas fa-check-circle text-[#D4AF37] mt-1"></i>
              <span className="text-zinc-600 font-bold text-sm">Digital technology specialists and founders</span>
            </li>
            <li className="flex gap-4 items-start">
              <i className="fas fa-check-circle text-[#D4AF37] mt-1"></i>
              <span className="text-zinc-600 font-bold text-sm">Academic researchers and scientists</span>
            </li>
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-6">UK Global Talent Visa Requirements</h2>
          <p className="text-zinc-500 leading-relaxed mb-6">
            Applicants must provide strong evidence aligned with official endorsement criteria, including:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 font-bold text-sm italic">Professional achievements and recognition</li>
            <li className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 font-bold text-sm italic">Media coverage, awards, or exhibitions</li>
            <li className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 font-bold text-sm italic">Letters of recommendation from industry experts</li>
            <li className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 font-bold text-sm italic">Clear career progression and future plans in the UK</li>
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-6">Global Talent Visa Endorsing Bodies</h2>
          <p className="text-zinc-500 leading-relaxed mb-6">
            Endorsement is issued by one of the following UK bodies depending on your field:
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="px-5 py-3 bg-white border border-zinc-100 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Arts Council England</span>
            <span className="px-5 py-3 bg-white border border-zinc-100 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Tech Nation</span>
            <span className="px-5 py-3 bg-white border border-zinc-100 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">UK Research and Innovation</span>
          </div>
        </section>

        <section className="mb-16 bg-zinc-900 text-white p-12 rounded-[3rem] text-center">
          <h2 className="text-2xl md:text-3xl font-black uppercase italic mb-6 text-amber-500">AI-Powered Global Talent Visa Assessment</h2>
          <p className="text-zinc-400 mb-10 italic">
            GTV Assessor uses AI to evaluate your background against endorsement criteria,
            providing a readiness score, strengths, weaknesses, and improvement guidance.
          </p>
          <button 
            onClick={onStart}
            className="cta-button"
          >
            Start Your AI Assessment
          </button>
        </section>

        <section className="text-zinc-400 text-xs italic space-x-4">
          <span>Related guides:</span>
          <a href="/global-talent-visa" className="underline hover:text-zinc-900">GTV Overview</a>
          <span>|</span>
          <a href="/global-talent-visa-fashion" className="underline hover:text-zinc-900">Fashion Guide</a>
        </section>
      </div>
    </div>
  );
};

export default GuideGeneral;