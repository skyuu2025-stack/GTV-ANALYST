
import React, { useState } from 'react';

interface PaymentModalProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ email, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showManualLink, setShowManualLink] = useState(false);

  // 获取当前网站的 Origin，用于配置返回 URL (虽然此处是固定的 buy.stripe.com)
  const currentOrigin = window.location.origin + window.location.pathname;
  const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/5kQbIT444bzybaQbTZ1Jm00";
  
  // 如果 Stripe 链接配置了 success_url 重定向，则可以在此添加
  const checkoutUrl = `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(email)}`;

  const handlePayment = () => {
    setIsProcessing(true);
    
    // 强制备份当前状态到 localStorage
    // 这样用户即使手动刷新回来也能看到报告
    
    try {
      if (window.top) {
        window.top.location.href = checkoutUrl;
      } else {
        window.location.href = checkoutUrl;
      }
    } catch (e) {
      window.location.href = checkoutUrl;
    }

    setTimeout(() => {
      setShowManualLink(true);
    }, 4000);
  };

  return (
    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-[0_50px_150px_-30px_rgba(0,0,0,0.3)] max-w-lg w-full overflow-hidden animate-scale-up border border-zinc-100 mx-auto">
      <div className="bg-[#1a1a1a] text-white p-8 md:p-12 text-center">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-600 rounded-full flex items-center justify-center text-xl mx-auto mb-6 shadow-xl">
          <i className="fas fa-shield-check"></i>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 uppercase italic">Premium <span className="font-serif italic font-normal text-amber-500 underline decoration-1 underline-offset-8">Roadmap</span></h2>
        <p className="text-zinc-500 text-[9px] md:text-[10px] font-black tracking-widest uppercase">Verified Secure Gateway</p>
      </div>

      <div className="p-8 md:p-12 relative bg-white min-h-[400px] md:min-h-[460px] flex flex-col justify-center">
        {isProcessing ? (
          <div className="text-center animate-fade-in space-y-10">
            <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto">
              <div className="absolute inset-0 border-[4px] md:border-[5px] border-zinc-50 rounded-full"></div>
              <div className="absolute inset-0 border-[4px] md:border-[5px] border-amber-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-black text-zinc-900 uppercase tracking-tighter">Redirecting to Stripe</h3>
              <p className="text-zinc-400 text-xs md:text-sm font-medium italic">After payment, please ensure you return to this page to see your report.</p>
            </div>
            {showManualLink && (
              <div className="pt-8 border-t border-zinc-50 animate-fade-in">
                <a href={checkoutUrl} className="inline-block w-full py-4 bg-amber-600 text-white font-bold rounded-2xl text-[10px] md:text-[11px] uppercase tracking-widest hover:bg-black transition-all">Manual Redirect</a>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8 md:mb-10 pb-6 md:pb-8 border-b border-zinc-50">
              <div className="flex flex-col">
                <span className="text-zinc-400 font-black text-[10px] md:text-[11px] uppercase tracking-widest">Upgrade Cost</span>
                <span className="text-[9px] md:text-[10px] text-zinc-300 font-bold uppercase tracking-widest italic">One-time payment</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-zinc-900 font-black text-4xl md:text-5xl tracking-tighter">$19</span>
                <span className="text-zinc-300 font-serif italic text-xl">.00</span>
              </div>
            </div>
            <div className="space-y-4 md:space-y-6 mb-10 md:mb-12">
              {["Detailed Criteria Mapping", "5 Tactical Modification Steps", "Official PDF Analysis", "Priority Email Delivery"].map((text, idx) => (
                <div key={idx} className="flex items-center gap-4 text-zinc-600">
                  <i className="fas fa-check-circle text-amber-500 text-sm"></i>
                  <span className="text-[12px] md:text-[13px] font-bold tracking-tight">{text}</span>
                </div>
              ))}
            </div>
            <button onClick={handlePayment} className="w-full py-5 md:py-6 bg-zinc-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all active:scale-[0.98] uppercase tracking-widest text-[10px] md:text-xs">Unlock Premium Analysis</button>
            <button onClick={onCancel} className="w-full mt-6 md:mt-8 text-zinc-300 hover:text-zinc-900 text-[9px] md:text-[10px] font-black uppercase tracking-widest italic transition-all">Cancel & Return</button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
