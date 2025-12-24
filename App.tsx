import React, { useState, useEffect, useTransition, Suspense, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
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
import LocalSupportFinder from './components/LocalSupportFinder.tsx';
import SEOManager from './components/SEOManager.tsx';
import LiveChatWidget from './components/LiveChatWidget.tsx';

const MOCK_PREMIUM_RESULT: AnalysisResult = {
  probabilityScore: 92,
  summary: "Exceptional candidate profile demonstrating significant international impact in Artificial Intelligence.",
  mandatoryCriteria: [{ title: "Recognition as a Leader", met: true, reasoning: "Documented history of speaking at top-tier global AI summits." }],
  optionalCriteria: [{ title: "Innovation in Industry", met: true, reasoning: "Led multiple patent-pending AI projects." }],
  evidenceGap: ["None identified."],
  recommendations: ["Compile press mentions into a unified PDF portfolio."],
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
  const [isDemoMode, setIsDemoMode] = useState(() => {
    try {
      return localStorage.getItem('gtv_demo_mode') === 'true';
    } catch {
      return false;
    }
  });

  const logoClicks = useRef(0);
  const lastClickTime = useRef(0);

  const determineStepFromPath = (path: string): AppStep => {
    if (path === '/global-talent-visa') return AppStep.GUIDE_GENERAL;
    if (path === '/global-talent-visa-fashion') return AppStep.GUIDE_FASHION;
    if (path === '/global-talent-visa-tech') return AppStep.GUIDE_TECH;
    if (path === '/eligibility-check') return AppStep.FORM;
    return AppStep.LANDING;
  };

  const handleRouting = useCallback(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const isSuccess = params.get('success') === 'true';
    const hasPendingPayment = localStorage.getItem('gtv_pending_payment') === 'true';
    const hasExistingPremium = sessionStorage.getItem('gtv_is_premium') === 'true';

    startTransition(() => {
      if (isSuccess || (hasPendingPayment && path === '/') || hasExistingPremium) {
        setIsVerifyingPayment(true);
        try {
          const rawData = localStorage.getItem('gtv_assessment_data');
          const rawResult = localStorage.getItem('gtv_analysis_result');
          
          if (rawData && rawResult) {
            setAssessmentData(JSON.parse(rawData));
            setAnalysisResult(JSON.parse(rawResult));
            sessionStorage.setItem('gtv_is_premium', 'true');
            localStorage.removeItem('gtv_pending_payment');
            setStep(AppStep.RESULTS_PREMIUM);
          } else {
            setStep(AppStep.LANDING);
          }
        } catch (e) {
          setStep(AppStep.LANDING);
        }
        setIsVerifyingPayment(false);
        if (isSuccess) {
          try {
            window.history.replaceState({}, '', window.location.pathname);
          } catch (e) {
            console.warn('History API restricted', e);
          }
        }
        return;
      }

      setStep(determineStepFromPath(path));
    });
  }, []);

  useEffect(() => {
    handleRouting();
    window.addEventListener('popstate', handleRouting);
    return () => window.removeEventListener('popstate', handleRouting);
  }, [handleRouting]);

  const handleFormSubmit = async (data: AssessmentData, fileNames: string[]) => {
    setError(null);
    setAssessmentData(data);
    startTransition(() => setStep(AppStep.ANALYZING));

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
      saveAssessment(data, result).catch(() => {});
      startTransition(() => {
        setAnalysisResult(result);
        setStep(AppStep.RESULTS_FREE);
      });
    } catch (err: any) {
      setError(err.message);
      startTransition(() => setStep(AppStep.FORM));
    }
  };

  const navigateTo = (path: string) => {
    const nextStep = determineStepFromPath(path);
    try {
      window.history.pushState({}, '', path);
    } catch (e) {
      console.warn('History pushState failed', e);
    }
    startTransition(() => {
      setStep(nextStep);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastClickTime.current > 2000) {
      logoClicks.current = 0;
    }
    logoClicks.current += 1;
    lastClickTime.current = now;
    if (logoClicks.current >= 5) {
      setShowAdmin(true);
      logoClicks.current = 0;
    } else if (logoClicks.current === 1) {
      navigateTo('/');
    }
  };

  const renderContent = () => {
    switch (step) {
      case AppStep.LANDING:
        return (
          <>
            <Hero onStart={() => navigateTo('/eligibility-check')} />
            
            <section className="py-12 md:py-16 px-6 max-w-6xl mx-auto" id="how-it-works">
              <div className="text-center mb-8">
                <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em] mb-3">Framework</h3>
                <h2 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic">GTV Endorsement Engine</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center font-black text-base shadow-lg">1</div>
                  <h3 className="text-lg font-black italic uppercase tracking-tighter">Criteria Benchmarking</h3>
                  <p className="text-zinc-600 text-xs leading-relaxed">AI cross-references your profile against 2025 UK Home Office mandates.</p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center font-black text-base shadow-lg">2</div>
                  <h3 className="text-lg font-black italic uppercase tracking-tighter">Evidence Gap Mapping</h3>
                  <p className="text-zinc-600 text-xs leading-relaxed">Identify exactly which criteria require more documented proof.</p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center font-black text-base shadow-lg">3</div>
                  <h3 className="text-lg font-black italic uppercase tracking-tighter">Success Roadmap</h3>
                  <p className="text-zinc-600 text-xs leading-relaxed">Receive a custom tactical plan before formal submission.</p>
                </div>
              </div>
            </section>

            <section className="py-12 md:py-16 bg-zinc-50/50" id="routes">
              <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 space-y-5">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-[1.1]">GTV Eligibility <br/> for Leaders</h2>
                  <ul className="grid grid-cols-1 gap-2.5">
                    {["TECH NATION", "ARTS COUNCIL", "RIBA ARCHITECTURE"].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-zinc-100">
                        <i className="fas fa-check text-amber-700 text-[8px]"></i>
                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-900">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 w-full max-w-md">
                   <div className="bg-white rounded-3xl p-6 shadow-xl border border-zinc-100">
                      <div className="space-y-5">
                        <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-600 w-[82%]"></div>
                        </div>
                        <div className="flex justify-between items-end">
                           <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">GTV Readiness</span>
                           <span className="text-[9px] font-black text-zinc-900">82%</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </section>

            <LocalSupportFinder />
            <SocialProof />
            <FAQ />
            <LeadCapture />

            <section className="py-12 md:py-16 px-4">
              <div className="max-w-6xl mx-auto bg-zinc-900 rounded-[2.5rem] p-10 text-center text-white space-y-6 shadow-2xl">
                <h2 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter leading-tight">Check Eligibility</h2>
                <button 
                  onClick={() => navigateTo('/eligibility-check')}
                  className="px-10 py-4 bg-white text-zinc-900 font-black rounded-xl uppercase tracking-widest text-xs shadow-xl active:scale-95 italic"
                >
                  Start Assessment
                </button>
              </div>
            </section>
          </>
        );
      case AppStep.GUIDE_GENERAL: return <GuideGeneral onStart={() => navigateTo('/eligibility-check')} />;
      case AppStep.GUIDE_FASHION: return <GuideFashion onStart={() => navigateTo('/eligibility-check')} />;
      case AppStep.GUIDE_TECH: return <GuideTech onStart={() => navigateTo('/eligibility-check')} />;
      case AppStep.FORM: return <AssessmentForm onSubmit={handleFormSubmit} error={error} />;
      case AppStep.ANALYZING: return <LoadingState />;
      case AppStep.RESULTS_FREE:
      case AppStep.RESULTS_PREMIUM:
        return analysisResult && assessmentData ? (
          <ResultsDashboard result={analysisResult} data={assessmentData} isPremium={step === AppStep.RESULTS_PREMIUM} onUpgrade={() => startTransition(() => setStep(AppStep.PAYMENT))} />
        ) : null;
      case AppStep.PAYMENT:
        return assessmentData ? (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[60] overflow-y-auto">
            <PaymentModal email={assessmentData.email} onSuccess={() => startTransition(() => setStep(AppStep.RESULTS_PREMIUM))} onCancel={() => startTransition(() => setStep(AppStep.RESULTS_FREE))} />
          </div>
        ) : null;
      default: return null;
    }
  };

  return (
    <div className={`min-h-[100dvh] flex flex-col bg-[#FDFDFD] ${isPending || isVerifyingPayment ? 'opacity-50' : ''}`}>
      <SEOManager currentStep={step} />
      <header className="bg-white/80 backdrop-blur-md border-b border-zinc-100 sticky top-0 z-50 safe-top flex items-center justify-between px-6 h-[70px]">
        <div 
          className="flex items-center space-x-2 cursor-pointer py-2 select-none" 
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLogoClick(e as any); }}
        >
          <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-white font-black" aria-hidden="true">G</div>
          <span className="text-xs md:text-xl font-light tracking-widest uppercase text-zinc-800 leading-none">GTV <span className="font-black">Assessor</span></span>
        </div>
        <button 
          onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = '/'; }} 
          className="text-[7px] md:text-[9px] font-black text-zinc-600 uppercase tracking-widest border border-zinc-200 px-3 py-1.5 rounded-full hover:bg-zinc-50 transition-all"
        >
          Reset
        </button>
      </header>
      <main className="flex-grow">{renderContent()}</main>
      <footer className="bg-white border-t border-zinc-100 py-12 text-center">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
           <div className="space-y-3 text-center md:text-left">
              <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Resources</h4>
              <ul className="space-y-1.5 text-zinc-600 text-xs font-black italic">
                 <li><button onClick={() => navigateTo('/global-talent-visa')}>GTV Overview</button></li>
                 <li><button onClick={() => navigateTo('/global-talent-visa-fashion')}>Fashion Guide</button></li>
                 <li><button onClick={() => navigateTo('/global-talent-visa-tech')}>Tech Nation 2025</button></li>
              </ul>
           </div>
           <div className="space-y-3 text-center md:text-left">
              <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Support</h4>
              <ul className="space-y-1.5 text-zinc-600 text-xs font-black italic">
                 <li><a href="mailto:skyuu2025@gmail.com" className="hover:text-zinc-900 transition-colors">Email Support</a></li>
                 <li><a href="https://chat.whatsapp.com/Io8JuhicgTa1RAF0GgKTFU" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 transition-colors">WhatsApp Community</a></li>
              </ul>
           </div>
           <div className="space-y-3 text-center md:text-left">
              <h4 className="text-[9px] font-black text-zinc-900 uppercase tracking-widest">GTV AI</h4>
              <p className="text-zinc-500 text-[10px] italic">Professional evaluation engine for UK endorsement routes.</p>
           </div>
        </div>
        <p className="text-[8px] text-zinc-500 font-black tracking-widest uppercase">&copy; {new Date().getFullYear()} GTV Assessor.</p>
      </footer>
      <LiveChatWidget />
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} isDemoMode={isDemoMode} onToggleDemoMode={setIsDemoMode} />}
    </div>
  );
};

export default App;