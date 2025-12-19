
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

  useEffect(() => {
    // 处理支付成功后的回跳
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      try {
        const savedData = localStorage.getItem('gtv_assessment_data');
        const savedResult = localStorage.getItem('gtv_analysis_result');
        
        if (savedData && savedResult) {
          setAssessmentData(JSON.parse(savedData));
          setAnalysisResult(JSON.parse(savedResult));
          setStep(AppStep.RESULTS_PREMIUM);
          // 清理 URL 保持整洁
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (e) {
        console.error("Failed to restore session after payment:", e);
      }
    }
  }, []);

  const handleFormSubmit = async (data: AssessmentData, fileNames: string[]) => {
    setAssessmentData(data);
    setStep(AppStep.ANALYZING);
    try {
      const result = await analyzeVisaEligibility(data, fileNames);
      setAnalysisResult(result);
      // 存储结果以便支付后恢复
      localStorage.setItem('gtv_assessment_data', JSON.stringify(data));
      localStorage.setItem('gtv_analysis_result', JSON.stringify(result));
      setStep(AppStep.RESULTS_FREE);
    } catch (err) {
      setError("Analysis engine busy. Please retry.");
      setStep(AppStep.FORM);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-40 h-20 flex items-center justify-between px-12">
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setStep(AppStep.LANDING)}>
          <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-white font-black">G</div>
          <span className="text-xl font-light tracking-widest uppercase">GTV <span className="font-black">Analyst</span></span>
        </div>
        <button onClick={() => setStep(AppStep.FORM)} className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border border-zinc-100 px-6 py-3 rounded-full hover:text-zinc-900">New Analysis</button>
      </header>
      <main className="flex-grow">
        {step === AppStep.LANDING && <Hero onStart={() => setStep(AppStep.FORM)} />}
        {step === AppStep.FORM && <AssessmentForm onSubmit={handleFormSubmit} error={error} />}
        {step === AppStep.ANALYZING && <LoadingState />}
        {(step === AppStep.RESULTS_FREE || step === AppStep.RESULTS_PREMIUM) && analysisResult && (
          <ResultsDashboard 
            result={analysisResult} 
            data={assessmentData!} 
            isPremium={step === AppStep.RESULTS_PREMIUM}
            onUpgrade={() => setStep(AppStep.PAYMENT)}
          />
        )}
        {step === AppStep.PAYMENT && (
          <div className="fixed inset-0 bg-white/95 backdrop-blur-xl flex items-center justify-center p-4 z-50 overflow-y-auto">
            <PaymentModal 
              email={assessmentData?.email || ''} 
              onSuccess={() => setStep(AppStep.RESULTS_PREMIUM)}
              onCancel={() => setStep(AppStep.RESULTS_FREE)}
            />
          </div>
        )}
      </main>
      <footer className="bg-white border-t border-zinc-100 py-12 text-center text-[10px] text-zinc-400 font-black tracking-widest uppercase">
        &copy; {new Date().getFullYear()} GTV AI ASSESSOR. SECURED BY ARTISTIC INTELLIGENCE.
      </footer>
    </div>
  );
};

export default App;
