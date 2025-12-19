
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

  // 1. 处理支付回调后的数据恢复
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      try {
        const savedData = localStorage.getItem('gtv_assessment_data');
        const savedResult = localStorage.getItem('gtv_analysis_result');
        
        if (savedData && savedResult) {
          const parsedData = JSON.parse(savedData);
          const parsedResult = JSON.parse(savedResult);
          
          setAssessmentData(parsedData);
          setAnalysisResult(parsedResult);
          setStep(AppStep.RESULTS_PREMIUM);
          
          // 支付成功后清理 URL，防止重复触发
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (e) {
        console.error("Session recovery failed:", e);
      }
    }
  }, []);

  const handleFormSubmit = async (data: AssessmentData, fileNames: string[]) => {
    setError(null);
    setAssessmentData(data);
    setStep(AppStep.ANALYZING);
    
    // 给 UI 一个切换到 Loading 状态的微小间隙
    await new Promise(r => setTimeout(r, 150));

    try {
      const result = await analyzeVisaEligibility(data, fileNames);
      
      // 必须先确保存储成功
      localStorage.setItem('gtv_assessment_data', JSON.stringify(data));
      localStorage.setItem('gtv_analysis_result', JSON.stringify(result));
      
      setAnalysisResult(result);
      setStep(AppStep.RESULTS_FREE);
    } catch (err: any) {
      console.error("Submission Error:", err);
      setError(err.message || "Analysis interrupted. Please try again.");
      setStep(AppStep.FORM);
    }
  };

  const handleGoBack = () => {
    setError(null);
    setStep(AppStep.FORM);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-40 h-20 flex items-center justify-between px-12">
        <div 
          className="flex items-center space-x-4 cursor-pointer" 
          onClick={() => setStep(AppStep.LANDING)}
        >
          <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-white font-black shadow-sm">G</div>
          <span className="text-xl font-light tracking-widest uppercase">
            GTV <span className="font-black">Analyst</span>
          </span>
        </div>
        <button 
          onClick={handleGoBack}
          className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border border-zinc-100 px-6 py-3 rounded-full hover:text-zinc-900 hover:border-zinc-300 transition-all active:scale-95"
        >
          New Analysis
        </button>
      </header>

      <main className="flex-grow relative">
        {step === AppStep.LANDING && <Hero onStart={() => setStep(AppStep.FORM)} />}
        
        {step === AppStep.FORM && (
          <div className="animate-scale-up">
            <AssessmentForm onSubmit={handleFormSubmit} error={error} />
          </div>
        )}
        
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
          <div className="fixed inset-0 bg-white/95 backdrop-blur-2xl flex items-center justify-center p-4 z-50 overflow-y-auto overflow-x-hidden">
            <PaymentModal 
              email={assessmentData.email} 
              onSuccess={() => setStep(AppStep.RESULTS_PREMIUM)}
              onCancel={() => setStep(AppStep.RESULTS_FREE)}
            />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-zinc-100 py-12 text-center">
        <p className="text-[10px] text-zinc-400 font-black tracking-widest uppercase mb-2">
          &copy; {new Date().getFullYear()} GTV AI ASSESSOR. SECURED BY ARTISTIC INTELLIGENCE.
        </p>
        <p className="text-[9px] text-zinc-300 uppercase tracking-widest">Optimized for London, Paris, New York.</p>
      </footer>
    </div>
  );
};

export default App;
