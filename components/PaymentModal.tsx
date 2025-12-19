
import React, { useState } from 'react';

interface PaymentModalProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ email, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showManualLink, setShowManualLink] = useState(false);

  // 您的正式 Stripe 支付链接
  const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/5kQbIT444bzybaQbTZ1Jm00";
  const checkoutUrl = `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(email)}`;

  const handlePayment = () => {
    setIsProcessing(true);
    
    // 尝试在新窗口打开以获得最佳兼容性
    const newWindow = window.open(checkoutUrl, '_blank');
    
    // 如果弹窗被拦截，则在当前页面尝试重定向
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      try {
        if (window.top) {
          window.top.location.href = checkoutUrl;
        } else {
          window.location.replace(checkoutUrl);
        }
      } catch (e) {
        window.location.href = checkoutUrl;
      }
    }

    // 2.5秒后如果还没跳转，显示手动点击按钮
    setTimeout(() => {
      setShowManualLink(true);
    }, 2500);
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_50px_150px_-30px_rgba(0,0,0,0.3)] max-w-lg w-full overflow-hidden animate-scale-up border border-zinc-100 mx-auto">
      <div className={`bg-[#1a1a1a] text-white p-12 text-center transition-all ${isProcessing ? 'bg-zinc-800' : 'bg-[#1a1a1a]'}`}>
        <div className="w-14 h-14 bg-amber-600 rounded-full flex items-center justify-center text-xl mx-auto mb-6 shadow-xl">
          <i className="fas fa-shield-check"></i>
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-2 uppercase italic">Premium <span className="font-serif italic font-normal text-amber-500 underline decoration-1 underline-offset-8">Roadmap</span></h2>
        <p className="text-zinc-500 text-[10px] font-black tracking-widest uppercase">Verified Secure Gateway</p>
      </div>

      <div className="p-12 relative bg-white min-h-[460px] flex flex-col justify-center">
        {isProcessing ? (
          <div className="text-center animate-fade-in space-y-10">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-[5px] border-zinc-50 rounded-full"></div>
              <div className="absolute inset-0 border-[5px] border-amber-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter">Redirecting...</h3>
              <p className="text-zinc-400 text-sm font-medium italic">Establishing secure connection to Stripe.</p>
            </div>
            {showManualLink && (
              <div className="pt-8 border-t border-zinc-50 animate-fade-in">
                <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className="inline-block w-full py-5 bg-amber-600 text-white font-bold rounded-2xl text-[11px] uppercase tracking-widest hover:bg-black transition-all">Click to Open Checkout</a>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-10 pb-8 border-b border-zinc-50">
              <div className="flex flex-col">
                <span className="text-zinc-400 font-black text-[11px] uppercase tracking-widest">Upgrade Cost</span>
                <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest italic">One-time payment</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-zinc-900 font-black text-5xl tracking-tighter">$19</span>
                <span className="text-zinc-300 font-serif italic text-xl">.00</span>
              </div>
            </div>
            <div className="space-y-6 mb-12">
              {["Detailed Criteria Mapping", "5 Tactical Modification Steps", "Official PDF Analysis", "Priority Email Delivery"].map((text, idx) => (
                <div key={idx} className="flex items-center gap-4 text-zinc-600">
                  <i className="fas fa-check-circle text-amber-500 text-sm"></i>
                  <span className="text-[13px] font-bold tracking-tight">{text}</span>
                </div>
              ))}
            </div>
            <button onClick={handlePayment} className="w-full py-6 bg-zinc-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all active:scale-[0.98] uppercase tracking-widest text-xs">Unlock Premium Analysis</button>
            <button onClick={onCancel} className="w-full mt-8 text-zinc-300 hover:text-zinc-900 text-[10px] font-black uppercase tracking-widest italic transition-all">Cancel & Return</button>
            <div className="mt-12 flex items-center justify-center gap-6 opacity-20">
              <i className="fab fa-cc-stripe text-2xl"></i>
              <i className="fab fa-cc-visa text-2xl"></i>
              <i className="fab fa-cc-mastercard text-2xl"></i>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
