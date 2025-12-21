
import React, { useState, useEffect } from 'react';
import { AppStep, AssessmentData, AnalysisResult } from './types.ts';
import { analyzeVisaEligibility } from './geminiService.ts';
import Hero from './components/Hero.tsx';
import AssessmentForm from './components/AssessmentForm.tsx';
import LoadingState from './components/LoadingState.tsx';
import PaymentModal from './components/PaymentModal.tsx';
import ResultsDashboard from './components/ResultsDashboard.tsx';
import PrivacyPolicy from './components/PrivacyPolicy.tsx';
import FAQ from './components/FAQ.tsx';
import SocialProof from './components/SocialProof.tsx';
import LeadCapture from './components/LeadCapture.tsx';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isSuccess = params.get('success') === 'true';
    const hasExistingPremium = sessionStorage.getItem('gtv_is_premium') === 'true';

    if (isSuccess || hasExistingPremium) {
      setIsVerifyingPayment(true);
      const timer = setTimeout(() => {
        try {
          const rawData = localStorage.getItem('gtv_assessment_data');
          const rawResult = localStorage.getItem('gtv_analysis_result');
          
          if (rawData && rawResult) {
            setAssessmentData(JSON.parse(rawData));
            setAnalysisResult(JSON.parse(rawResult));
            sessionStorage.setItem('gtv_is_premium', 'true');
            setStep(AppStep.RESULTS_PREMIUM);
            
            if (isSuccess) {
              const cleanUrl = window.location.origin + window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
            }
          } else {
            setError("Session recovery failed.");
            setStep(AppStep.LANDING);
          }
        } catch (err) {
          setError("Data processing error.");
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
      localStorage.setItem('gtv_assessment_data', JSON.stringify(data));
      localStorage.setItem('gtv_analysis_result', JSON.stringify(result));
      setAnalysisResult(result);
      setStep(AppStep.RESULTS_FREE);
    } catch (err: any) {
      setError(err.message || "AI Analysis Error.");
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
          <p className="text-amber-500 font-bold uppercase tracking-[0.5em] text-[10px] animate-pulse">Unlocking High-Resolution Report</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-40 pt-[var(--sat)] h-[calc(80px+var(--sat))] flex items-center justify-between px-6 md:px-12 print:hidden">
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={() => setStep(AppStep.LANDING)}
        >
          <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-white font-black text-base shadow-xl">G</div>
          <span className="text-sm md:text-xl font-light tracking-widest uppercase">
            GTV <span className="font-black">Analyst</span>
          </span>
        </div>
        <button 
          onClick={resetToForm}
          className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border border-zinc-100 px-4 py-2.5 rounded-full hover:text-zinc-900 transition-all active:scale-95"
        >
          Reset
        </button>
      </header>

      <main className="flex-grow pb-[var(--sab)]">
        {step === AppStep.LANDING && (
          <>
            <Hero onStart={() => setStep(AppStep.FORM)} />
            <SocialProof />
            <FAQ />
            <LeadCapture />
          </>
        )}
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

      <footer className="bg-white border-t border-zinc-100 py-12 text-center px-6 print:hidden pb-[calc(48px+var(--sab))]">
        <div className="max-w-xs mx-auto space-y-4">
          <p className="text-[9px] text-zinc-400 font-black tracking-widest uppercase">
            &copy; {new Date().getFullYear()} GTV AI ASSESSOR. ENCRYPTED & SECURE.
          </p>
          <div className="flex justify-center gap-6">
            <button 
              onClick={() => setShowPrivacy(true)}
              className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest hover:text-zinc-900 transition-colors underline underline-offset-4 decoration-zinc-100"
            >
              Privacy Policy & Terms
            </button>
          </div>
        </div>
      </footer>

      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
    </div>
  );
};

export default App;
