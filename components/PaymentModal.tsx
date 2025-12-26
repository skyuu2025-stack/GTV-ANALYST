import React, { useState, useEffect } from 'react';

interface PaymentModalProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ email, onSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isDemo = localStorage.getItem('gtv_demo_mode') === 'true' || sessionStorage.getItem('gtv_demo_active') === 'true';

  const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/5kQbIT444bzybaQbTZ1Jm00";
  const checkoutUrl = `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(email)}&client_reference_id=${encodeURIComponent(email)}`;

  const handleDemoPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 1200);
  };

  const handleRealPaymentClick = () => {
    // Persist pending state for return journey
    localStorage.setItem('gtv_pending_payment', 'true');
    localStorage.setItem('gtv_pending_email', email);
    // Visual feedback before navigation
    setIsProcessing(true);
  };

  return (
    <div 
      className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto animate-scale-up border border-zinc-100 mx-auto relative z-[100] custom-scrollbar" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="payment-modal-title"
    >
      <div className="bg-[#1a1a1a] text-white p-8 md:p-12 text-center relative overflow-hidden sticky top-0 z-10">
        {isDemo && (
          <div className="absolute top-0 left-0 bg-green-600 text-white px-4 py-1 text-[8px] font-black uppercase tracking-widest z-10 animate-pulse">
            Reviewer Access
          </div>
        )}
        <div className="w-14 h-14 md:w-16 md:h-16 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-xl mx-auto mb-4 md:mb-6 shadow-2xl ring-4 ring-white/10 relative" aria-hidden="true">
          <i className="fas fa-crown text-white"></i>
        </div>
        <h2 id="payment-modal-title" className="text-xl md:text-3xl font-black tracking-tight mb-1 uppercase italic leading-tight">
          Unlock <span className="text-[#D4AF37]">Premium</span> Audit
        </h2>
        <p className="text-zinc-500 text-[8px] md:text-[10px] font-black tracking-widest uppercase italic">Full Evidence Gap Analysis</p>
      </div>

      <div className="p-6 md:p-12 bg-white flex flex-col">
        {isProcessing ? (
          <div className="text-center animate-fade-in space-y-8 py-12" aria-live="polite">
            <div className="relative w-12 h-12 md:w-16 md:h-16 mx-auto">
              <div className="absolute inset-0 border-[3px] md:border-[4px] border-zinc-50 rounded-full"></div>
              <div className="absolute inset-0 border-[3px] md:border-[4px] border-[#D4AF37] rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="space-y-4">
              <p className="text-zinc-900 font-black text-[10px] md:text-xs uppercase tracking-widest animate-pulse">
                Redirecting to Stripe...
              </p>
              <p className="text-[9px] text-zinc-400 mb-2 uppercase font-bold">Secure Payment Gateway</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-zinc-100">
              <div className="flex flex-col">
                <span className="text-zinc-900 font-black text-2xl md:text-3xl tracking-tighter" aria-label="Price: nineteen dollars">$19</span>
                <span className="text-zinc-500 font-bold text-[8px] md:text-[9px] uppercase tracking-widest italic">One-time payment</span>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-amber-50 text-[#B48F27] rounded-full text-[8px] md:text-[9px] font-black uppercase border border-amber-200">AI Verified</span>
              </div>
            </div>

            <div className="space-y-4 md:space-y-5 mb-8 md:mb-10" aria-label="Premium features included">
              {[
                "10-Point Evidence Gap Scan", 
                "Criteria-by-Criteria Breakdown", 
                "Tactical Success Roadmap", 
                "PDF Report Generation"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-zinc-700">
                  <div className="w-4 h-4 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                    <i className="fas fa-check text-amber-700 text-[8px]"></i>
                  </div>
                  <span className="text-xs md:text-[13px] font-bold tracking-tight">{item}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {isDemo ? (
                <button 
                  onClick={handleDemoPayment}
                  className="w-full py-5 md:py-6 bg-green-700 text-white font-black rounded-2xl md:rounded-3xl shadow-xl uppercase tracking-widest text-[10px] transition-all active:scale-95 hover:bg-green-800 focus:ring-4 focus:ring-green-500"
                >
                  Verify Reviewer Access
                </button>
              ) : (
                <a 
                  href={checkoutUrl}
                  onClick={handleRealPaymentClick}
                  className="w-full py-5 md:py-6 bg-zinc-900 text-white font-black rounded-2xl md:rounded-3xl shadow-xl uppercase tracking-widest text-[10px] transition-all active:scale-95 hover:bg-black flex items-center justify-center text-center focus:ring-4 focus:ring-amber-500 no-underline decoration-transparent"
                >
                  <i className="fas fa-lock mr-2" aria-hidden="true"></i> Purchase Full Audit
                </a>
              )}
              
              <button 
                onClick={onCancel} 
                className="w-full text-zinc-500 hover:text-zinc-900 text-[9px] font-black uppercase tracking-widest transition-all py-2 active:scale-95 focus:outline-none focus:underline"
              >
                Back to Score
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;