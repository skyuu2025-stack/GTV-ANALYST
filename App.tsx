
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

  // Recovery logic for after-payment redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      try {
        const savedData = localStorage.getItem('gtv_assessment_data');
        const savedResult = localStorage.getItem('gtv_analysis_result');
        
        if (savedData && savedResult) {
          setAssessmentData(JSON.parse(savedData));
          setAnalysisResult(JSON.parse(savedResult));
          setStep(AppStep.RESULTS_PREMIUM);
          
          // Clear URL to prevent re-processing on refresh
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (e) {
        console.warn("Failed to restore session data from local storage.");
      }
    }
  }, []);

  const handleFormSubmit = async (data: AssessmentData, fileNames: string[]) => {
    setError(null);
    setAssessmentData(data);
    setStep(AppStep.ANALYZING);
    
    try {
      // Small timeout to allow the loading spinner to render smoothly
      await new Promise(r => setTimeout(r, 200));
      
      const result = await analyzeVisaEligibility(data, fileNames);
      
      // Save state to local storage for recovery after potential payment redirect
      localStorage.setItem('gtv_assessment_data', JSON.stringify(data));
      localStorage.setItem('gtv_analysis_result', JSON.stringify(result));
      
      setAnalysisResult(result);
      setStep(AppStep.RESULTS_FREE);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setError(err.message || "An unexpected error occurred during analysis.");
      setStep(AppStep.FORM);
    }
  };

  const resetToForm = () => {
    setError(null);
    setStep(AppStep.FORM);
  };

  // Safe rendering logic to prevent white screen on empty states
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-40 h-20 flex items-center justify-between px-6 md:px-12">
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={() => setStep(AppStep.LANDING)}
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-900 rounded-full flex items-center justify-center text-white font-black text-sm md:text-base">G</div>
          <span className="text-sm md:text-xl font-light tracking-widest uppercase">
            GTV <span className="font-black">Analyst</span>
          </span>
        </div>
        <button 
          onClick={resetToForm}
          className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest border border-zinc-100 px-4 md:px-6 py-2 md:py-3 rounded-full hover:text-zinc-900 hover:border-zinc-300 transition-all active:scale-95"
        >
          New Analysis
        </button>
      </header>

      <main className="flex-grow">
        {step === AppStep.LANDING && (
          <Hero onStart={() => setStep(AppStep.FORM)} />
        )}
        
        {step === AppStep.FORM && (
          <div className="animate-scale-up">
            <AssessmentForm onSubmit={handleFormSubmit} error={error} />
          </div>
        )}
        
        {step === AppStep.ANALYZING && (
          <LoadingState />
        )}
        
        {(step === AppStep.RESULTS_FREE || step === AppStep.RESULTS_PREMIUM) && analysisResult && assessmentData && (
          <ResultsDashboard 
            result={analysisResult} 
            data={assessmentData} 
            isPremium={step === AppStep.RESULTS_PREMIUM}
            onUpgrade={() => setStep(AppStep.PAYMENT)}
          />
        )}
        
        {step === AppStep.PAYMENT && assessmentData && (
          <div className="fixed inset-0 bg-white/95 backdrop-blur-xl flex items-center justify-center p-4 z-50">
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
          &copy; {new Date().getFullYear()} GTV AI ASSESSOR. ALL RIGHTS RESERVED.
        </p>
        <p className="text-[9px] text-zinc-300 uppercase tracking-widest">Optimized for UK Global Talent Criteria.</p>
      </footer>
    </div>
  );
};

export default App;
