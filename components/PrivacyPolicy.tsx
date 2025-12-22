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
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Version 1.0.2 (2025)</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="prose prose-zinc prose-sm md:prose-base space-y-10 text-zinc-600 leading-relaxed font-medium">
          <section className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
             <h3 className="text-amber-800 font-black uppercase tracking-widest text-[11px] mb-3">⚠️ Important Disclaimer</h3>
             <p className="text-amber-700 text-sm italic">GTV Analyst is an AI-powered advisory tool. It does not constitute legal advice. For formal immigration matters, consult a registered OISC advisor.</p>
          </section>

          <section>
            <h3 className="text-zinc-900 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
               <i className="fas fa-user-shield text-amber-500"></i> Data Protection (GDPR)
            </h3>
            <p>We take your professional data seriously. All assessment inputs are encrypted during transit and analyzed using private instances of Google Gemini 3.0. We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h3 className="text-zinc-900 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
               <i className="fas fa-file-contract text-amber-500"></i> Standard EULA
            </h3>
            <p>By using GTV Analyst, you agree to the standard Apple Licensed Application End User License Agreement (EULA). You acknowledge that the AI-generated results are for informational purposes only.</p>
          </section>

          <section>
            <h3 className="text-zinc-900 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
               <i className="fas fa-credit-card text-amber-500"></i> Subscription & In-App Purchases
            </h3>
            <p>Payments made within the App Store are managed by Apple. You can manage your purchases in your Apple ID settings. One-time purchases grant permanent access to the generated report on this device.</p>
          </section>
        </div>

        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-12 pb-4">
          <button 
            onClick={onClose}
            className="w-full py-6 bg-zinc-900 text-white font-black rounded-3xl uppercase tracking-widest text-xs shadow-2xl hover:bg-black transition-all"
          >
            I Accept the Terms
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;