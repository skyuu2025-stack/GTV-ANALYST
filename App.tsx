
import React, { useState, useEffect } from 'react';
import { AppStep, AssessmentData, AnalysisResult } from './types.ts';
import { analyzeVisaEligibility } from './geminiService.ts';
import Hero from './components/Hero.tsx';
import AssessmentForm from './components/AssessmentForm.tsx';
import LoadingState from './components/LoadingState.tsx';
import PaymentModal from './components/PaymentModal.tsx';
import ResultsDashboard from './components/ResultsDashboard.tsx';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  // 这里的逻辑是专门用来检测 Stripe 跳转回来的信号的
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isSuccess = params.get('success') === 'true';
    
    // 检查本地缓存是否已经是高级用户
    const hasExistingPremium = sessionStorage.getItem('gtv_is_premium') === 'true';

    if (isSuccess || hasExistingPremium) {
      setIsVerifyingPayment(true);
      
      // 3秒验证动画，确保体验的一致性
      const timer = setTimeout(() => {
        try {
          const rawData = localStorage.getItem('gtv_assessment_data');
          const rawResult = localStorage.getItem('gtv_analysis_result');
          
          if (rawData && rawResult) {
            setAssessmentData(JSON.parse(rawData));
            setAnalysisResult(JSON.parse(rawResult));
            
            // 关键：在这里锁定高级状态
            sessionStorage.setItem('gtv_is_premium', 'true');
            setStep(AppStep.RESULTS_PREMIUM);
            
            // 清理掉 URL 里的 ?success=true，防止用户刷新网页重复触发验证
            if (isSuccess) {
              const cleanUrl = window.location.origin + window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
            }
          } else {
            console.error("未找到本地报告数据");
            setError("支付成功，但未检测到原始分析记录。请尝试重新开始或联系支持。");
            setStep(AppStep.LANDING);
          }
        } catch (err) {
          setError("会话恢复失败。");
          setStep(AppStep.LANDING);
        } finally {
          setIsVerifyingPayment(false);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleFormSubmit = async (data: AssessmentData, fileNames: string[]) => {
    setError(null);
    setAssessmentData(data);
    setStep(AppStep.ANALYZING);
    
    try {
      const result = await analyzeVisaEligibility(data, fileNames);
      
      // 在用户跳转到 Stripe 之前，先把数据存死在本地浏览器里
      localStorage.setItem('gtv_assessment_data', JSON.stringify(data));
      localStorage.setItem('gtv_analysis_result', JSON.stringify(result));
      
      setAnalysisResult(result);
      setStep(AppStep.RESULTS_FREE);
    } catch (err: any) {
      setError(err.message || "AI 分析超时。");
      setStep(AppStep.FORM);
    }
  };

  const resetToForm = () => {
    setError(null);
    localStorage.clear();
    sessionStorage.clear();
    setStep(AppStep.FORM);
  };

  if (isVerifyingPayment) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center text-center p-6">
        <div className="relative w-32 h-32 mb-12">
          <div className="absolute inset-0 border-[3px] border-amber-500/5 rounded-full"></div>
          <div className="absolute inset-0 border-[3px] border-amber-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="fas fa-crown text-amber-500 text-4xl animate-pulse"></i>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white italic">Payment Verified</h2>
          <div className="flex flex-col gap-3">
             <p className="text-amber-500 font-bold uppercase tracking-[0.5em] text-[10px] animate-pulse">Unlocking High-Resolution Report</p>
             <p className="text-zinc-500 text-sm font-medium italic max-w-xs mx-auto">Re-syncing with secure expert criteria database...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-40 h-20 flex items-center justify-between px-4 md:px-12 print:hidden">
        <div 
          className="flex items-center space-x-2 md:space-x-3 cursor-pointer" 
          onClick={() => setStep(AppStep.LANDING)}
        >
          <div className="w-9 h-9 md:w-11 md:h-11 bg-zinc-900 rounded-full flex items-center justify-center text-white font-black text-sm md:text-base shadow-xl">G</div>
          <span className="text-xs md:text-xl font-light tracking-widest uppercase">
            GTV <span className="font-black">Analyst</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={resetToForm}
            className="text-[8px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest border border-zinc-100 px-3 md:px-6 py-2.5 md:py-3.5 rounded-full hover:text-zinc-900 hover:border-zinc-300 transition-all active:scale-95 shadow-sm"
          >
            New Analysis
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {step === AppStep.LANDING && <Hero onStart={() => setStep(AppStep.FORM)} />}
        {step === AppStep.FORM && <AssessmentForm onSubmit={handleFormSubmit} error={error} />}
        {step === AppStep.ANALYZING && <LoadingState />}
        {(step === AppStep.RESULTS_FREE || step === AppStep.RESULTS_PREMIUM) && analysisResult && assessmentData && (
          <ResultsDashboard 
            result={analysisResult} 
            data={assessmentData} 
            isPremium={step === AppStep.RESULTS_PREMIUM}
            onUpgrade={() => setStep(AppStep.PAYMENT)}
          />
        )}
        {step === AppStep.PAYMENT && assessmentData && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50 overflow-y-auto">
            <PaymentModal 
              email={assessmentData.email} 
              onSuccess={() => {
                sessionStorage.setItem('gtv_is_premium', 'true');
                setStep(AppStep.RESULTS_PREMIUM);
              }}
              onCancel={() => setStep(AppStep.RESULTS_FREE)}
            />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-zinc-100 py-12 text-center px-6 print:hidden">
        <p className="text-[9px] text-zinc-400 font-black tracking-widest uppercase mb-2">
          &copy; {new Date().getFullYear()} GTV AI ASSESSOR. ENCRYPTED & SECURE.
        </p>
      </footer>
    </div>
  );
};

export default App;
