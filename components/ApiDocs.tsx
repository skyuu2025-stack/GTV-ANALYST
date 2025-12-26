import React from 'react';

interface ApiDocsProps {
  onBack: () => void;
}

const ApiDocs: React.FC<ApiDocsProps> = ({ onBack }) => {
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
          GTV <span className="text-amber-600">API</span> <br/> DOCUMENTATION
        </h1>
        <p className="text-lg text-zinc-500 italic font-medium max-w-2xl">
          Integrate the GTV Assessor engine into your law firm, HR portal, or institution.
        </p>
      </div>

      <div className="grid gap-12">
        <section className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-tight italic">Authentication</h2>
          <div className="bg-zinc-900 p-6 rounded-2xl font-mono text-[11px] text-zinc-400 border border-zinc-800">
            <span className="text-amber-500">Authorization:</span> Bearer gtv_test_51...
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-black uppercase tracking-tight italic">Endpoints</h2>
          
          <div className="space-y-4">
            <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-green-900 text-green-400 rounded-lg text-[10px] font-black uppercase">POST</span>
                <span className="text-xs font-mono font-bold text-zinc-900">/v1/assess/eligibility</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium italic mb-6">Process professional bio and route selection to return a probability score.</p>
              <div className="bg-zinc-900 p-5 rounded-xl font-mono text-[10px] text-zinc-300">
                <pre>{`{
  "route": "tech_nation",
  "experience": "12_years",
  "achievements": ["patents", "leadership"]
}`}</pre>
              </div>
            </div>

            <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-900 text-blue-400 rounded-lg text-[10px] font-black uppercase">GET</span>
                <span className="text-xs font-mono font-bold text-zinc-900">/v1/guides/criteria/{'{route}'}</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium italic mb-6">Retrieve structured criteria definitions for a specific endorsement route.</p>
            </div>
          </div>
        </section>

        <section className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-black uppercase italic tracking-tight text-amber-900">Request Sandbox Access</h3>
            <p className="text-xs text-amber-800/60 italic font-medium">Enterprise API keys available for qualified legal partners.</p>
          </div>
          <a 
            href="mailto:skyuu2025@gmail.com"
            className="px-10 py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 no-underline inline-block"
          >
            Contact Dev Support
          </a>
        </section>
      </div>
    </div>
  );
};

export default ApiDocs;