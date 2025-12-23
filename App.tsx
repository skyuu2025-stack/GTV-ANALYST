import React, { useState, useEffect, useTransition, Suspense, useCallback } from 'react';
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
import GuideGeneral from './components/GuideGeneral.tsx';
import GuideFashion from './components/GuideFashion.tsx';
import GuideTech from './components/GuideTech.tsx';
import FAQSchema from './components/FAQSchema.tsx';

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
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(() => {
    try {
      return localStorage.getItem('gtv_demo_mode') === 'true';
    } catch {
      return false;
    }
  });

  const handleRouting = useCallback(() => {
    const path = window.location.pathname;
    startTransition(() => {
      if (path === '/global-talent-visa') {
        setStep(AppStep.GUIDE_GENERAL);
      } else if (path === '/global-talent-visa-fashion') {
        setStep(AppStep.GUIDE_FASHION);
      } else if (path === '/global-talent-visa-tech') {
        setStep(AppStep.GUIDE_TECH);
      } else if (path === '/eligibility-check') {
        setStep(AppStep.FORM);
      } else {
        setStep(AppStep.LANDING);
      }
    });
  }, []);

  useEffect(() => {
    handleRouting();
    window.addEventListener('popstate', handleRouting);
    return () => window.removeEventListener('popstate', handleRouting);
  }, [handleRouting]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isSuccess = params.get('success') === 'true';
    const hasExistingPremium = sessionStorage.getItem('gtv_is_premium') === 'true';

    if (isSuccess || hasExistingPremium) {
      startTransition(() => {
        setIsVerifyingPayment(true);
      });
      
      const timer = setTimeout(() => {
        try {
          const rawData = localStorage.getItem('gtv_assessment_data');
          const rawResult = localStorage.getItem('gtv_analysis_result');
          if (rawData && rawResult) {
            const parsedData = JSON.parse(rawData);
            const parsedResult = JSON.parse(rawResult);
            
            startTransition(() => {
              setAssessmentData(parsedData);
              setAnalysisResult(parsedResult);
              sessionStorage.setItem('gtv_is_premium', 'true');
              setStep(AppStep.RESULTS_PREMIUM);
              setIsVerifyingPayment(false);
            });
            
            if (isSuccess) window.history.replaceState({}, '', window.location.pathname);
          } else {
            startTransition(() => {
              setStep(AppStep.LANDING);
              setIsVerifyingPayment(false);
            });
          }
        } catch (err) { 
          startTransition(() => {
            setStep(AppStep.LANDING);
            setIsVerifyingPayment(false);
          });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    if (newCount >= 5) {
      startTransition(() => {
        setShowAdmin(true);
      });
      setLogoClickCount(0);
    } else {
      setLogoClickCount(newCount);
      const timer = setTimeout(() => setLogoClickCount(0), 3000);
      return () => clearTimeout(timer);
    }
  };

  const handleToggleDemo = (enabled: boolean) => {
    startTransition(() => {
      setIsDemoMode(enabled);
    });
    localStorage.setItem('gtv_demo_mode', enabled.toString());
    sessionStorage.setItem('gtv_demo_active', enabled.toString());
  };

  const handleFormSubmit = async (data: AssessmentData, fileNames: string[]) => {
    setError(null);
    setAssessmentData(data);
    startTransition(() => {
      setStep(AppStep.ANALYZING);
    });

    if (isDemoMode) {
      setTimeout(() => {
        startTransition(() => {
          setAnalysisResult(MOCK_PREMIUM_RESULT);
          setStep(AppStep.RESULTS_FREE);
        });
      }, 1500);
      return;
    }

    try {
      const result = await analyzeVisaEligibility(data, fileNames);
      localStorage.setItem('gtv_assessment_data', JSON.stringify(data));
      localStorage.setItem('gtv_analysis_result', JSON.stringify(result));
      
      saveAssessment(data, result).catch(err => {
        console.warn("Supabase Save failed:", err);
      });

      startTransition(() => {
        setAnalysisResult(result);
        setStep(AppStep.RESULTS_FREE);
      });
    } catch (err: any) {
      setError(err.message);
      startTransition(() => {
        setStep(AppStep.FORM);
      });
    }
  };

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    handleRouting();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (step === AppStep.LANDING) {
      return (
        <>
          <FAQSchema />
          <Hero onStart={() => navigateTo('/eligibility-check')} />
          <section className="py-24 px-6 max-w-6xl mx-auto border-t border-zinc-50">
            <div className="text-center mb-16">
              <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4">Official Criteria Scan</h3>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">How GTV Assessor Works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center font-black">1</div>
                <h3 className="text-xl font-bold italic">AI-Powered Eligibility Analysis</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">Our system evaluates your achievements, recognition, and professional impact based on official UK Global Talent Visa criteria.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center font-black">2</div>
                <h3 className="text-xl font-bold italic">Identify Strengths and Weaknesses</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">Understand exactly where your profile stands and which requirements need more evidence before your final submission.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center font-black">3</div>
                <h3 className="text-xl font-bold italic">Actionable Improvement Guidance</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">Receive a 5-phase tactical roadmap tailored to your specific field (Tech, Arts, or Research) to maximize success.</p>
              </div>
            </div>
          </section>
          <SocialProof />
          <FAQ />
          <LeadCapture />
        </>
      );
    }

    switch (step) {
      case AppStep.GUIDE_GENERAL: return <GuideGeneral onStart={() => navigateTo('/eligibility-check')} />;
      case AppStep.GUIDE_FASHION: return <GuideFashion onStart={() => navigateTo('/eligibility-check')} />;
      case AppStep.GUIDE_TECH: return <GuideTech onStart={() => navigateTo('/eligibility-check')} />;
      case AppStep.FORM: return (
        <>
          <FAQSchema items={[
            { question: "Is this GTV eligibility check accurate?", answer: "Our AI analysis uses the latest 2025 UK Home Office criteria for an instant professional assessment score." },
            { question: "How long does the assessment take?", answer: "The process takes 3-5 minutes from form submission to expert roadmap generation." }
          ]} />
          <AssessmentForm onSubmit={handleFormSubmit} error={error} />
        </>
      );
      case AppStep.ANALYZING: return <LoadingState />;
      case AppStep.RESULTS_FREE:
      case AppStep.RESULTS_PREMIUM:
        return analysisResult && assessmentData ? (
          <ResultsDashboard result={analysisResult} data={assessmentData} isPremium={step === AppStep.RESULTS_PREMIUM} onUpgrade={() => startTransition(() => setStep(AppStep.PAYMENT))} />
        ) : null;
      case AppStep.PAYMENT:
        return assessmentData ? (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
            <PaymentModal 
              email={assessmentData.email} 
              onSuccess={() => {
                sessionStorage.setItem('gtv_is_premium', 'true');
                startTransition(() => setStep(AppStep.RESULTS_PREMIUM));
              }} 
              onCancel={() => startTransition(() => setStep(AppStep.RESULTS_FREE))} 
            />
          </div>
        ) : null;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#FDFDFD] transition-opacity duration-300 ${isPending || isVerifyingPayment ? 'opacity-50' : 'opacity-100'}`}>
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-40 safe-top flex items-center justify-between px-6 md:px-12 h-[calc(80px+var(--sat))]">
        <div 
          className="flex items-center space-x-3 cursor-pointer group py-2 pr-10" 
          onClick={() => navigateTo('/')}
          title="Home"
        >
          <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-white font-black shadow-lg group-hover:scale-105 transition-transform">G</div>
          <div className="flex flex-col">
            <span className="text-sm md:text-xl font-light tracking-widest uppercase">GTV <span className="font-black">Assessor</span></span>
            {isDemoMode && <span className="text-[8px] font-black text-green-500 uppercase tracking-widest mt-0.5 animate-pulse">DEMO Active</span>}
          </div>
        </div>
        <button 
          onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = '/'; }} 
          className="text-[9px] font-black text-zinc-400 uppercase tracking-widest border border-zinc-100 px-4 py-2 rounded-full hover:bg-zinc-50 transition-colors"
        >
          Reset Session
        </button>
      </header>

      <main className="flex-grow">
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="spin-loader" style={{ width: '32px', height: '32px', border: '4px solid #f3f3f3', borderTop: '4px solid #000', borderRadius: '50%' }}></div>
          </div>
        }>
          {renderContent()}
        </Suspense>
      </main>

      <footer className="bg-white border-t border-zinc-100 py-12 text-center pb-[calc(48px+var(--sab))]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-left">
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Resources</h4>
              <ul className="space-y-2">
                 <li><button onClick={() => navigateTo('/global-talent-visa')} className="text-zinc-500 hover:text-zinc-900 text-xs font-bold italic transition-colors">Visa Overview Guide</button></li>
                 <li><button onClick={() => navigateTo('/global-talent-visa-fashion')} className="text-zinc-500 hover:text-zinc-900 text-xs font-bold italic transition-colors">Fashion Designer Guide</button></li>
                 <li><button onClick={() => navigateTo('/global-talent-visa-tech')} className="text-zinc-500 hover:text-zinc-900 text-xs font-bold italic transition-colors">Digital Tech Guide</button></li>
              </ul>
           </div>
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Connect</h4>
              <ul className="space-y-2">
                 <li><a href="#" className="text-zinc-500 hover:text-zinc-900 text-xs font-bold italic transition-colors">WhatsApp Community</a></li>
                 <li><a href="#" className="text-zinc-500 hover:text-zinc-900 text-xs font-bold italic transition-colors">Email Support</a></li>
              </ul>
           </div>
           <div className="space-y-4" onDoubleClick={handleLogoClick}>
              <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">GTV Assessor</h4>
              <p className="text-zinc-400 text-[10px] leading-relaxed italic">AI-driven platform for UK Global Talent Visa readiness assessment.</p>
           </div>
        </div>
        
        <p className="text-[9px] text-zinc-400 font-black tracking-widest uppercase">&copy; {new Date().getFullYear()} GTV Assessor. PROUDLY BUILT FOR TALENTS.</p>
        <div className="flex justify-center gap-6 mt-6">
          <button onClick={() => startTransition(() => setShowPrivacy(true))} className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest hover:text-zinc-600">Privacy Policy</button>
        </div>
      </footer>

      {showPrivacy && <PrivacyPolicy onClose={() => startTransition(() => setShowPrivacy(false))} />}
      {showAdmin && <AdminDashboard onClose={() => startTransition(() => setShowAdmin(false))} isDemoMode={isDemoMode} onToggleDemoMode={handleToggleDemo} />}
    </div>
  );
};

export default App;
