import React, { useState, useEffect } from 'react';
import { AppStep, AssessmentData, AnalysisResult } from './types.ts';
import { analyzeVisaEligibility } from './geminiService.ts';
import { saveAssessment } from './supabaseService.ts';
import Hero from './components/Hero.tsx';
import AssessmentForm from './components/AssessmentForm.tsx';
import LoadingState from './components/LoadingState.tsx';
import PaymentModal from './components/PaymentModal.tsx';
import ResultsDashboard from './components/ResultsDashboard.tsx';
import PrivacyPolicy from './components/PrivacyPolicy.tsx';
import FAQ from './components/FAQ.tsx';
import SocialProof from './components/SocialProof.tsx';
import LeadCapture from './components/LeadCapture.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';

const MOCK_PREMIUM_RESULT: AnalysisResult = {
  probabilityScore: 92,
  summary: "Exceptional candidate profile demonstrating significant international impact in Artificial Intelligence. The evidence strategy aligns perfectly with Tech Nation Exceptional Talent criteria for innovation and leadership.",
  mandatoryCriteria: [
    { title: "Recognition as a Leader", met: true, reasoning: "Documented history of speaking at top-tier global AI summits and authorship in high-impact journals." }
  ],
  optionalCriteria: [
    { title: "Innovation in Industry", met: true, reasoning: "Led multiple patent-pending AI projects with verified commercial deployment in 12 countries." },
    { title: "Exceptional Contributions", met: true, reasoning: "Strong evidence of peer recognition and mentorship within the global developer community." }
  ],
  evidenceGap: ["None identified. Profile is ready for submission."],
  recommendations: [
    "Secure the final letter of recommendation from your current CEO.",
    "Compile press mentions into a unified PDF portfolio.",
    "Highlight the $50M+ revenue impact of your primary project."
  ],
  fieldAnalysis: "Technology / AI & Machine Learning"
};

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(localStorage.getItem('gtv_demo_mode') === 'true');

  useEffect(() => {
    sessionStorage.setItem('gtv_demo_active', isDemoMode.toString());
  }, [isDemoMode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isSuccess = params.get('success') === 'true';
    const hasExistingPremium = sessionStorage.getItem('gtv_is_premium') === 'true';

    if (isSuccess || hasExistingPremium) {
      setIsVerifyingPayment(true);
      setTimeout(() => {
        try {
          const rawData = localStorage.getItem('gtv_assessment_data');
          const rawResult = localStorage.getItem('gtv_analysis_result');
          if (rawData && rawResult) {
            setAssessmentData(JSON.parse(rawData));
            setAnalysisResult(JSON.parse(rawResult));
            sessionStorage.setItem('gtv_is_premium', 'true');
            setStep(AppStep.RESULTS_PREMIUM);
            if (isSuccess) window.history.replaceState({}, '', window.location.pathname);
          } else {
            setStep(AppStep.LANDING);
          }
        } catch (err) { setStep(AppStep.LANDING); }
        finally { setIsVerifyingPayment(false); }
      }, 800);
    }
  }, []);

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    if (newCount >= 5) {
      setShowAdmin(true);
      setLogoClickCount(0);
    } else {
      setLogoClickCount(newCount);
      // 3秒内不点满5次会自动重置
      const timer = setTimeout(() => setLogoClickCount(0), 3000);
      return () => clearTimeout(timer);
    }
  };

  const handleToggleDemo = (enabled: boolean) => {
    setIsDemoMode(enabled);
    localStorage.setItem('gtv_demo_mode', enabled.toString());
    sessionStorage.setItem('gtv_demo_active', enabled.toString());
  };

  const handleFormSubmit = async (data: AssessmentData, fileNames: string[]) => {
    setError(null);
    setAssessmentData(data);
    setStep(AppStep.ANALYZING);

    if (isDemoMode) {
      setTimeout(() => {
        setAnalysisResult(MOCK_PREMIUM_RESULT);
        setStep(AppStep.RESULTS_FREE); // 先展示免费版，引导进入支付弹窗
      }, 2000);
      return;
    }

    try {
      const result = await analyzeVisaEligibility(data, fileNames);
      localStorage.setItem('gtv_assessment_data', JSON.stringify(data));
      localStorage.setItem('gtv_analysis_result', JSON.stringify(result));
      await saveAssessment(data, result);
      setAnalysisResult(result);
      setStep(AppStep.RESULTS_FREE);
    } catch (err: any) {
      setError(err.message);
      setStep(AppStep.FORM);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-40 safe-top flex items-center justify-between px-6 md:px-12 h-[calc(80px+var(--sat))]">
        <div 
          className="flex items-center space-x-3 cursor-pointer group py-2 pr-10" 
          onClick={handleLogoClick}
          title="Developer Terminal (Click 5x)"
        >
          <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-white font-black shadow-lg group-hover:scale-105 transition-transform">G</div>
          <div className="flex flex-col">
            <span className="text-sm md:text-xl font-light tracking-widest uppercase">GTV <span className="font-black">Analyst</span></span>
            {isDemoMode && <span className="text-[8px] font-black text-green-500 uppercase tracking-widest mt-0.5 animate-pulse">DEMO Active</span>}
          </div>
        </div>
        <button 
          onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = window.location.pathname; }} 
          className="text-[9px] font-black text-zinc-400 uppercase tracking-widest border border-zinc-100 px-4 py-2 rounded-full hover:bg-zinc-50 transition-colors"
        >
          Reset Session
        </button>
      </header>

      <main className="flex-grow">
        {step === AppStep.LANDING && <><Hero onStart={() => setStep(AppStep.FORM)} /><SocialProof /><FAQ /><LeadCapture /></>}
        {step === AppStep.FORM && <AssessmentForm onSubmit={handleFormSubmit} error={error} />}
        {step === AppStep.ANALYZING && <LoadingState />}
        {(step === AppStep.RESULTS_FREE || step === AppStep.RESULTS_PREMIUM) && analysisResult && assessmentData && (
          <ResultsDashboard result={analysisResult} data={assessmentData} isPremium={step === AppStep.RESULTS_PREMIUM} onUpgrade={() => setStep(AppStep.PAYMENT)} />
        )}
        {step === AppStep.PAYMENT && assessmentData && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
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

      <footer className="bg-white border-t border-zinc-100 py-12 text-center pb-[calc(48px+var(--sab))]">
        <p className="text-[9px] text-zinc-400 font-black tracking-widest uppercase">&copy; {new Date().getFullYear()} GTV AI. PROUDLY BUILT FOR TALENTS.</p>
        <div className="flex justify-center gap-6 mt-6">
          <button onClick={() => setShowPrivacy(true)} className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest hover:text-zinc-600">Privacy Policy</button>
          <span className="text-zinc-100">|</span>
          <button onClick={() => setShowPrivacy(true)} className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest hover:text-zinc-600">Terms of Service</button>
        </div>
      </footer>

      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} isDemoMode={isDemoMode} onToggleDemoMode={handleToggleDemo} />}
    </div>
  );
};

export default App;