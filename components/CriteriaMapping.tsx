import React from 'react';

interface CriteriaMappingProps {
  onBack: () => void;
}

const CriteriaMapping: React.FC<CriteriaMappingProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 md:py-20 px-6 animate-fade-in space-y-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
      >
        <i className="fas fa-chevron-left"></i> Back to Wiki
      </button>

      <div className="space-y-6">
        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-zinc-900 leading-[0.85]">
          AI <span className="text-amber-600">CRITERIA</span> <br/> MAPPING ENGINE
        </h1>
        <p className="text-lg text-zinc-500 italic font-medium max-w-2xl">
          How GTV Assessor translates professional history into structured endorsement evidence.
        </p>
      </div>

      <div className="grid gap-8">
        <section className="bg-zinc-50 p-8 rounded-[2.5rem] border border-zinc-100 space-y-6">
          <h2 className="text-xl font-black uppercase tracking-tight italic">Evidence Processing Stack</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">01</div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-900">OCR & NLP</h4>
              <p className="text-[10px] text-zinc-500 font-medium italic">Scanning portfolios and press releases for key performance indicators (KPIs).</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">02</div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-900">Criteria Triage</h4>
              <p className="text-[10px] text-zinc-500 font-medium italic">Sorting data into Mandatory Leadership vs. Optional Innovation/Recognition buckets.</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">03</div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-900">Gap Detection</h4>
              <p className="text-[10px] text-zinc-500 font-medium italic">Identifying specific missing pieces like 'international' scope or 'independent' validation.</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tight italic">Aligned Frameworks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Tech Nation v2025', desc: 'Direct mapping to Leadership, Innovation, Proof of Recognition, and Business Impact.', icon: 'fa-code' },
              { title: 'Arts Council ACE', desc: 'Evaluation of press volume, exhibition quality, and global performance history.', icon: 'fa-palette' },
              { title: 'RIBA Standards', desc: 'Assessment of built projects and architectural awards recognition.', icon: 'fa-archway' },
              { title: 'UKRI Academic', desc: 'Citation indexing and research fellowship validation.', icon: 'fa-microscope' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6 bg-white border border-zinc-100 rounded-3xl shadow-sm">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900">{item.title}</h4>
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="p-8 border-t border-zinc-100 italic font-medium text-zinc-400 text-sm">
          Note: Our AI models are updated weekly to reflect the latest Home Office caseworker guidance and endorsement body revisions.
        </section>
      </div>
    </div>
  );
};

export default CriteriaMapping;