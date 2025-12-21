import React, { useState } from 'react';

interface PaymentModalProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ email, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Stripe 支付链接
  const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/5kQbIT444bzybaQbTZ1Jm00";
  
  const handlePayment = () => {
    setIsProcessing(true);
    
    // 构建最终支付 URL，附带用户 Email 预填
    const checkoutUrl = `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(email)}`;
    
    // 使用最简单直接的 href 跳转，这在几乎所有移动端 App 内置浏览器（微信、FB等）中都最稳定
    window.location.href = checkoutUrl;
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_50px_150px_-30px_rgba(0,0,0,0.3)] max-w-lg w-full overflow-hidden animate-scale-up border border-zinc-100 mx-auto">
      <div className="bg-[#1a1a1a] text-white p-8 md:p-12 text-center">
        <div className="w-14 h-14 bg-amber-600 rounded-full flex items-center justify-center text-xl mx-auto mb-6 shadow-xl">
          <i className="fas fa-shield-check"></i>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 uppercase italic leading-tight">Premium <span className="font-serif italic font-normal text-amber-500 underline decoration-1 underline-offset-8">Roadmap</span></h2>
        <p className="text-zinc-500 text-[10px] font-black tracking-widest uppercase">Expert Visa Strategy Unlocked</p>
      </div>

      <div className="p-8 md:p-12 relative bg-white flex flex-col">
        {isProcessing ? (
          <div className="text-center animate-fade-in space-y-10 py-12">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-[5px] border-zinc-50 rounded-full"></div>
              <div className="absolute inset-0 border-[5px] border-amber-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-black text-zinc-900 uppercase tracking-tighter">Redirecting...</h3>
              <p className="text-zinc-400 text-xs font-medium italic">Connecting to Stripe Secure Checkout. Please do not close this window.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-10 pb-8 border-b border-zinc-50">
              <div className="flex flex-col">
                <span className="text-zinc-400 font-black text-[11px] uppercase tracking-widest">Upgrade Cost</span>
                <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest italic">Lifetime access for this report</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-zinc-900 font-black text-5xl tracking-tighter">$19</span>
                <span className="text-zinc-300 font-serif italic text-2xl">.00</span>
              </div>
            </div>
            <div className="space-y-5 mb-12">
              {[
                {icon: 'fa-map-location-dot', text: "Full Criteria Mapping Analysis"},
                {icon: 'fa-bolt', text: "5 Critical Modification Steps"},
                {icon: 'fa-envelope-open-text', text: "PDF Delivery to Your Inbox"},
                {icon: 'fa-user-tie', text: "Consultant-Grade Logic"}
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 text-zinc-700">
                  <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${item.icon} text-amber-600 text-[10px]`}></i>
                  </div>
                  <span className="text-[13px] font-bold tracking-tight">{item.text}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={handlePayment} 
              className="w-full py-6 bg-zinc-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
            >
              Unlock Analysis Now
            </button>
            <button 
              onClick={onCancel} 
              className="w-full mt-8 text-zinc-300 hover:text-zinc-900 text-[10px] font-black uppercase tracking-widest italic transition-all"
            >
              Maybe Later
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;