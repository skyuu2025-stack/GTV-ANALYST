import React, { useState, useEffect } from 'react';

interface PaymentModalProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ email, onSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    // 检测是否在原生 App 容器内运行
    const isCapacitor = (window as any).Capacitor?.isNativePlatform;
    setIsNativeApp(!!isCapacitor);
  }, []);

  // Web 端使用的 Stripe 链接
  const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/5kQbIT444bzybaQbTZ1Jm00";
  
  const handlePayment = () => {
    setIsProcessing(true);
    
    if (isNativeApp) {
      // 在原生 App 中，这里应该调用 Capacitor 的 IAP 插件
      // 演示逻辑：模拟 IAP 成功
      console.log("Initiating Apple In-App Purchase...");
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess(); // 模拟支付成功
      }, 2000);
    } else {
      // Web 环境继续使用 Stripe
      const checkoutUrl = `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(email)}`;
      window.location.href = checkoutUrl;
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_50px_150px_-30px_rgba(0,0,0,0.4)] max-w-lg w-full overflow-hidden animate-scale-up border border-zinc-100 mx-auto relative z-[100]">
      <div className="bg-[#1a1a1a] text-white p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <i className="fas fa-shield-halved text-6xl"></i>
        </div>
        <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 shadow-2xl rotate-3 ring-4 ring-white/10">
          <i className="fas fa-crown"></i>
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 uppercase italic leading-tight">
          {isNativeApp ? 'Apple' : 'Expert'} <span className="text-amber-500">Audit</span>
        </h2>
        <p className="text-zinc-500 text-[10px] font-black tracking-widest uppercase">Secured by {isNativeApp ? 'App Store' : 'Stripe'}</p>
      </div>

      <div className="p-8 md:p-12 relative bg-white flex flex-col">
        {isProcessing ? (
          <div className="text-center animate-fade-in space-y-10 py-12">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-[5px] border-zinc-50 rounded-full"></div>
              <div className="absolute inset-0 border-[5px] border-amber-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-zinc-400 text-xs font-bold italic tracking-wide">
              {isNativeApp ? 'Connecting to App Store...' : 'Redirecting to Stripe...'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-10 pb-8 border-b border-zinc-50">
              <div className="flex flex-col">
                <span className="text-zinc-900 font-black text-3xl tracking-tighter">
                  {isNativeApp ? '£17.99' : '$19.00'}
                </span>
                <span className="text-zinc-400 font-bold text-[9px] uppercase tracking-widest">Restore purchases anytime</span>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase border border-amber-100">Most Popular</span>
              </div>
            </div>

            <div className="space-y-5 mb-10">
              {[
                { icon: "fa-file-lines", text: "Full Evidence Gap Analysis" },
                { icon: "fa-map-location-dot", text: "5 Tactical Roadmap Steps" },
                { icon: "fa-chart-simple", text: "Expert Scorecard breakdown" },
                { icon: "fa-envelope-open-text", text: "Priority Support Access" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 text-zinc-600">
                  <div className="w-5 h-5 bg-zinc-50 rounded-lg flex items-center justify-center text-[10px] mt-0.5 text-amber-600">
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <span className="text-[13px] font-bold tracking-tight leading-tight">{item.text}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={handlePayment} 
              className="w-full py-6 bg-zinc-900 text-white font-black rounded-3xl shadow-2xl hover:bg-black transition-all active:scale-[0.96] uppercase tracking-[0.2em] text-[11px] mb-4"
            >
              {isNativeApp ? 'Pay with Apple Pay' : 'Unlock Full Report'}
            </button>
            
            <p className="text-[9px] text-zinc-400 text-center mb-6 px-4 leading-relaxed font-medium">
              By continuing, you agree to our Terms of Use and EULA. Digital reports are delivered instantly.
            </p>

            <button 
              onClick={onCancel} 
              className="text-zinc-300 hover:text-zinc-900 text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;