
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
            <Helmet>
               <title>{`UK Global Talent Visa AI Assessment 2025: Tech Nation & Arts Council Audit`}</title>
               <meta name="description" content="Official AI evaluation for UK Global Talent Visa. Instant criteria mapping for Tech Nation endorsement and Arts Council routes. Start your roadmap today." />
            </Helmet>
            <FAQSchema />
            <Hero onStart={() => navigateTo('/eligibility-check')} />
            
            <section className="py-16 md:py-24 px-6 max-w-6xl mx-auto" id="how-it-works">
              <div className="text-center mb-12 md:mb-16">
                <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4">Framework</h3>
                <h2 className="text-2xl md:text-6xl font-black tracking-tighter uppercase italic">GTV Endorsement Engine</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
                <div className="space-y-4 md:space-y-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center font-black text-lg md:text-xl shadow-lg">1</div>
                  <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter">Criteria Benchmarking</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">Our AI cross-references your professional profile against the latest 2025 UK Home Office and Tech Nation/Arts Council mandates.</p>
                </div>
                <div className="space-y-4 md:space-y-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center font-black text-lg md:text-xl shadow-lg">2</div>
                  <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter">Evidence Gap Mapping</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">Identify exactly which mandatory or optional criteria require more documented proof for a successful GTV endorsement.</p>
                </div>
                <div className="space-y-4 md:space-y-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center font-black text-lg md:text-xl shadow-lg">3</div>
                  <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter">Success Roadmap</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">Receive a custom tactical plan to strengthen your UK Global Talent Visa application before formal submission.</p>
                </div>
              </div>
            </section>

            <section className="py-16 md:py-24 bg-zinc-50/50 overflow-hidden" id="routes">
              <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-16">
                <div className="flex-1 space-y-6 md:space-y-8">
                  <h2 className="text-3xl md:text-6xl font-black tracking-tighter uppercase italic leading-[1.1] md:leading-[0.95]">GTV Eligibility <br className="hidden md:block"/> for Leaders</h2>
                  <p className="text-zinc-500 text-base md:text-lg italic leading-relaxed">The UK Global Talent Visa is for the world's best. Avoid rejection by auditing your profile for:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3 md:gap-4">
                    {[
                      "TECH NATION ROUTES",
                      "ARTS COUNCIL FASHION",
                      "VISUAL ARTS LEADERS",
                      "RIBA ARCHITECTURE"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border border-zinc-100 shadow-sm">
                        <div className="w-5 h-5 bg-amber-50 rounded-full flex items-center justify-center text-[8px] text-amber-600 shrink-0">
                          <i className="fas fa-check"></i>
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 w-full max-w-md relative">
                   <div className="bg-white rounded-3xl md:rounded-[3rem] p-6 md:p-8 shadow-2xl border border-zinc-100 animate-fade-in">
                      <div className="space-y-6">
                        <div className="h-1.5 md:h-2 w-full bg-zinc-50 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 w-[82%]"></div>
                        </div>
                        <div className="flex justify-between items-end">
                           <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-zinc-400">GTV Readiness</span>
                           <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-900">82%</span>
                        </div>
                        <div className="space-y-3 pt-4 md:pt-6 border-t border-zinc-50">
                           {["Leadership: Pass", "Innovation: Pass", "Media: Gap"].map((t, i) => (
                             <div key={i} className="flex items-center gap-2">
                               <div className={`w-2 h-2 rounded-full ${i < 2 ? 'bg-green-500' : 'bg-amber-500'} opacity-50`}></div>
                               <span className="text-[8px] md:text-[9px] font-black text-zinc-500 uppercase tracking-widest">{t}</span>
                             </div>
                           ))}
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

            <section className="py-16 md:py-24 px-4 md:px-6">
              <div className="max-w-6xl mx-auto bg-zinc-900 rounded-3xl md:rounded-[4rem] p-8 md:p-24 text-center text-white space-y-8 md:space-y-12 shadow-2xl border border-zinc-800 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/5 to-transparent"></div>
                <h2 className="text-2xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight relative z-10">Check Your UK Eligibility</h2>
                <p className="text-zinc-400 text-base md:text-2xl italic font-light max-w-2xl mx-auto relative z-10 opacity-80">Get a definitive expert audit of your probability of success for endorsement.</p>
                <button 
                  onClick={() => navigateTo('/eligibility-check')}
                  className="w-full md:w-auto px-10 py-5 md:px-12 md:py-6 bg-white text-zinc-900 font-black rounded-2xl md:rounded-3xl uppercase tracking-widest text-xs md:text-sm hover:bg-zinc-100 transition-all shadow-xl active:scale-95 relative z-10 italic"
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
      case AppStep.FORM: return (
        <>
          <Helmet>
             <title>{`GTV Eligibility Intake | UK Global Talent Visa Assessment`}</title>
             <meta name="description" content="Secure intake form for GTV eligibility analysis." />
          </Helmet>
          <FAQSchema items={[{ question: "Is this GTV check accurate?", answer: "Our AI uses the latest 2025 UK Home Office criteria." }]} />
          <AssessmentForm onSubmit={handleFormSubmit} error={error} />
        </>
      );
      case AppStep.ANALYZING: return <LoadingState />;
      case AppStep.RESULTS_FREE:
      case AppStep.RESULTS_PREMIUM:
        return analysisResult && assessmentData ? (
          <>
            <Helmet>
               <title>{`Eligibility Score: ${analysisResult.probabilityScore}% | GTV Expert Report`}</title>
               <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <ResultsDashboard result={analysisResult} data={assessmentData} isPremium={step === AppStep.RESULTS_PREMIUM} onUpgrade={() => startTransition(() => setStep(AppStep.PAYMENT))} />
          </>
        ) : null;
      case AppStep.PAYMENT:
        return assessmentData ? (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[60] overflow-y-auto animate-fade-in custom-scrollbar">
            <PaymentModal email={assessmentData.email} onSuccess={() => startTransition(() => setStep(AppStep.RESULTS_PREMIUM))} onCancel={() => startTransition(() => setStep(AppStep.RESULTS_FREE))} />
          </div>
        ) : null;
      default: return null;
    }
  };

  return (
    <div className={`min-h-[100dvh] flex flex-col bg-[#FDFDFD] transition-opacity duration-300 ${isPending || isVerifyingPayment ? 'opacity-50' : 'opacity-100'}`}>
      <SEOManager />
      <header className="bg-white/80 backdrop-blur-md border-b border-zinc-100 sticky top-0 z-50 safe-top flex items-center justify-between px-4 md:px-12 h-[calc(70px+var(--sat))]">
        <div 
          className="flex items-center space-x-2 md:space-x-3 cursor-pointer py-2 select-none" 
          onClick={handleLogoClick}
          role="button"
          aria-label="Home"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-900 rounded-full flex items-center justify-center text-white font-black shadow-md">G</div>
          <div className="flex flex-col">
            <span className="text-xs md:text-xl font-light tracking-widest uppercase text-zinc-800 leading-none">GTV <span className="font-black">Assessor</span></span>
          </div>
        </div>
        <button onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = '/'; }} className="text-[7px] md:text-[9px] font-black text-zinc-400 uppercase tracking-widest border border-zinc-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full hover:bg-zinc-50 active:scale-95 transition-all">Reset</button>
      </header>
      <main className="flex-grow">{renderContent()}</main>
      <footer className="bg-white border-t border-zinc-100 py-12 md:py-24 text-left pb-[calc(24px+var(--sab))]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-16 md:mb-24">
           <div className="space-y-4 md:space-y-6">
              <h4 className="text-[9px] md:text-[10px] font-black text-zinc-900 uppercase tracking-widest">Resources</h4>
              <ul className="space-y-2 md:space-y-3">
                 <li><button onClick={() => navigateTo('/global-talent-visa')} className="text-zinc-500 hover:text-zinc-900 text-xs md:text-sm font-black italic transition-colors text-left">GTV Overview</button></li>
                 <li><button onClick={() => navigateTo('/global-talent-visa-fashion')} className="text-zinc-500 hover:text-zinc-900 text-xs md:text-sm font-black italic transition-colors text-left">Fashion Guide</button></li>
                 <li><button onClick={() => navigateTo('/global-talent-visa-tech')} className="text-zinc-500 hover:text-zinc-900 text-xs md:text-sm font-black italic transition-colors text-left">Tech Nation 2025</button></li>
              </ul>
           </div>
           <div className="space-y-4 md:space-y-6">
              <h4 className="text-[9px] md:text-[10px] font-black text-zinc-900 uppercase tracking-widest">Support</h4>
              <ul className="space-y-2 md:space-y-3">
                 <li><a href="mailto:support@gtvassessor.com" className="text-zinc-500 hover:text-zinc-900 text-xs md:text-sm font-black italic transition-colors block text-left">Email Support</a></li>
                 <li><a href="https://chat.whatsapp.com/GTV" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-900 text-xs md:text-sm font-black italic transition-colors block text-left">WhatsApp Community</a></li>
              </ul>
           </div>
           <div className="space-y-4 md:space-y-6">
              <h4 className="text-[9px] md:text-[10px] font-black text-zinc-900 uppercase tracking-widest">GTV AI Engine</h4>
              <p className="text-zinc-400 text-[10px] md:text-xs leading-relaxed italic font-medium">Advanced algorithmic platform for UK Global Talent Visa readiness analysis.</p>
           </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 border-t border-zinc-50 pt-8 flex flex-col items-center gap-6">
          <p className="text-[8px] md:text-[9px] text-zinc-400 font-black tracking-widest uppercase">&copy; {new Date().getFullYear()} GTV Assessor.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => setShowPrivacy(true)} className="text-[8px] md:text-[9px] font-black text-zinc-300 uppercase tracking-widest hover:text-zinc-900">Privacy Policy</button>
            <span className="w-px h-3 bg-zinc-100"></span>
            <button onClick={() => setShowPrivacy(true)} className="text-[8px] md:text-[9px] font-black text-zinc-300 uppercase tracking-widest hover:text-zinc-900">Terms</button>
          </div>
        </div>
      </footer>
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} isDemoMode={isDemoMode} onToggleDemoMode={setIsDemoMode} />}
    </div>
  );
};

export default App;
