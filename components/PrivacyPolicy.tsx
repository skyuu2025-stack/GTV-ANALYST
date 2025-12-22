import React from 'react';

interface PrivacyPolicyProps {
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[120] bg-white overflow-y-auto safe-top safe-bottom p-8 animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-10 pb-20">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-8 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Legal & Privacy</h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Ref: GTV-2025-V1.0.3</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="prose prose-zinc prose-sm md:prose-base space-y-10 text-zinc-600 leading-relaxed font-medium">
          <section className="bg-red-50 p-6 rounded-2xl border border-red-100">
             <h3 className="text-red-800 font-black uppercase tracking-widest text-[11px] mb-3">⚠️ Critical Legal Disclaimer</h3>
             <p className="text-red-700 text-sm italic font-bold">
               GTV Analyst is an automated data processing and information retrieval tool driven by Artificial Intelligence. 
               It DOES NOT provide legal advice, immigration services, or professional representation. 
               The probability scores are based on pattern matching with historical public criteria and should be used for informational and educational purposes only.
             </p>
          </section>

          <section>
            <h3 className="text-zinc-900 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
               <i className="fas fa-shield-alt text-amber-500"></i> Data Processing Protocol
            </h3>
            <p>We implement industry-standard encryption (AES-256) for all professional data submitted. User inputs are processed via private API instances. We do not store original identity documents on our primary servers longer than required to generate the assessment report.</p>
          </section>

          <section>
            <h3 className="text-zinc-900 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
               <i className="fas fa-balance-scale text-amber-500"></i> Compliance with App Store Guidelines
            </h3>
            <p>This application complies with Apple's 5.1.1 Data Privacy guidelines. Users retain full control over their data and can request immediate deletion of their assessment history via the "Reset Session" function or by contacting support.</p>
          </section>

          <section>
            <h3 className="text-zinc-900 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
               <i className="fas fa-user-circle text-amber-500"></i> Developer Transparency
            </h3>
            <p>This tool is maintained by an independent developer dedicated to enhancing transparency in global talent mobility through technology. No affiliation with the UK Home Office or Tech Nation is claimed or implied.</p>
          </section>
        </div>

        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-12 pb-4">
          <button 
            onClick={onClose}
            className="w-full py-6 bg-zinc-900 text-white font-black rounded-3xl uppercase tracking-widest text-xs shadow-2xl hover:bg-black transition-all"
          >
            I Acknowledge and Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;