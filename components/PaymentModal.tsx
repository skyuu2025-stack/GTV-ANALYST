import React, { useState, useEffect } from 'react';

interface PaymentModalProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ email, onSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNativeApp, setIsNativeApp] = useState(false);
  
  // Check if Demo Mode is on (checking sessionStorage set in App.tsx isn't enough, we check localStorage as well)
  const isDemo = sessionStorage.getItem('gtv_demo_active') === 'true';

  useEffect(() => {
    const isCapacitor = (window as any).Capacitor?.isNativePlatform;
    setIsNativeApp(!!isCapacitor);
  }, []);

  const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/5kQbIT444bzybaQbTZ1Jm00";
  
  const handlePayment = () => {
    setIsProcessing(true);
    
    if (isDemo) {
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess();
      }, 1500);
      return;
    }

    if (isNativeApp) {
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess(); 
      }, 2000);
    } else {
      const checkoutUrl = `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(email)}`;
      window.location.href = checkoutUrl;
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_50px_150px_-30px_rgba(0,0,0,0.4)] max-w-lg w-full overflow-hidden animate-scale-up border border-zinc-100 mx-auto relative z-[100]">
      <div className="bg-[#1a1a1a] text-white p-8 md:p-12 text-center relative overflow-hidden">
        {isDemo && (
          <div className="absolute top-0 left-0 bg-green-500 text-white px-4 py-1 text-[8px] font-black uppercase tracking-widest z-10">Demo Mode Active</div>
        )}
        <div className="w-16 h-16 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 shadow-2xl rotate-3 ring-4 ring-white/10">
          <i className="fas fa-crown"></i>
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 uppercase italic leading-tight">
          Unlock <span className="text-[#D4AF37]">Premium</span> Report
        </h2>
        <p className="text-zinc-500 text-[10px] font-black tracking-widest uppercase">Secured Transaction</p>
      </div>

      <div className="p-8 md:p-12 bg-white flex flex-col">
        {isProcessing ? (
          <div className="text-center animate-fade-in space-y-10 py-12">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-[5px] border-zinc-50 rounded-full"></div>
              <div className="absolute inset-0 border-[5px] border-[#D4AF37] rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-zinc-400 text-xs font-bold italic tracking-wide">
              {isDemo ? 'Bypassing payment for Demo...' : 'Connecting...'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-10 pb-8 border-b border-zinc-50">
              <div className="flex flex-col">
                <span className="text-zinc-900 font-black text-3xl tracking-tighter">£17.99</span>
                <span className="text-zinc-400 font-bold text-[9px] uppercase tracking-widest italic">Instant Access</span>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-amber-50 text-[#D4AF37] rounded-full text-[9px] font-black uppercase border border-amber-100">Recommended</span>
              </div>
            </div>

            <div className="space-y-5 mb-10">
              {["Full Evidence Gap Analysis", "5 Tactical Roadmap Steps", "Expert Scorecard breakdown", "Priority Support"].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 text-zinc-600">
                  <i className="fas fa-check text-[#D4AF37] text-[10px] mt-1"></i>
                  <span className="text-[13px] font-bold tracking-tight">{item}</span>
                </div>
              ))}
            </div>

            <button onClick={handlePayment} className="w-full py-6 bg-zinc-900 text-white font-black rounded-3xl shadow-2xl uppercase tracking-[0.2em] text-[11px] mb-4">
              Unlock Full Report
            </button>
            <button onClick={onCancel} className="text-zinc-300 hover:text-zinc-900 text-[10px] font-black uppercase tracking-widest transition-all">Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;