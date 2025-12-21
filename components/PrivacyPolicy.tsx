
import React from 'react';

interface PrivacyPolicyProps {
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-white overflow-y-auto safe-top safe-bottom p-8 animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-6 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">Privacy Policy</h2>
          <button onClick={onClose} className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="prose prose-zinc prose-sm md:prose-base space-y-6 text-zinc-600 leading-relaxed font-medium">
          <p className="text-zinc-900 font-bold">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h3 className="text-zinc-900 font-black uppercase tracking-widest text-xs mb-3">1. Information We Collect</h3>
            <p>We collect information you provide directly to us during the assessment process, including your name, email address, job title, and professional achievements. We also use Gemini AI to process your uploaded evidence documents.</p>
          </section>

          <section>
            <h3 className="text-zinc-900 font-black uppercase tracking-widest text-xs mb-3">2. How We Use Data</h3>
            <p>Your data is exclusively used to generate the Global Talent Visa eligibility report. We do not store your documents permanently; they are processed in real-time and cleared after analysis or session expiry.</p>
          </section>

          <section>
            <h3 className="text-zinc-900 font-black uppercase tracking-widest text-xs mb-3">3. AI Processing</h3>
            <p>Our analysis is powered by Google Gemini AI. By using this app, you acknowledge that your professional data will be analyzed by AI models to provide success probability scores. This is not legal advice.</p>
          </section>

          <section>
            <h3 className="text-zinc-900 font-black uppercase tracking-widest text-xs mb-3">4. Payments</h3>
            <p>Payment processing is handled securely via Stripe. We do not store your credit card details on our servers.</p>
          </section>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-5 bg-zinc-900 text-white font-black rounded-2xl uppercase tracking-widest text-xs"
        >
          Accept and Close
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
