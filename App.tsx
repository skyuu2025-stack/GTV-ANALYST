import React, { useState, useEffect, useTransition, Suspense, useCallback, useRef } from 'react';
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

  // Admin click trigger state
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
    // Determine the next step immediately
    const nextStep = determineStepFromPath(path);
    
    // 1. Attempt to update URL
    try {
      window.history.pushState({}, '', path);
    } catch (e) {
      console.warn('History pushState failed (environment restricted)', e);
    }
    
    // 2. Explicitly update state to ensure UI jump
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
            <FAQSchema />
            <Hero onStart={() => navigateTo('/eligibility-check')} />
            
            {/* How it works */}
            <section className="py-24 px-6 max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4">Official Criteria Scan</h3>
                <h2 className="text-3xl md:text-6xl font-black tracking-tighter uppercase italic">How GTV Assessor Works</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center font-black text-xl">1</div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">AI-Powered Eligibility Analysis</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">Our system evaluates your achievements, recognition, and professional impact based on official UK Global Talent Visa criteria.</p>
                </div>
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center font-black text-xl">2</div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Identify Strengths and Weaknesses</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">Understand exactly where your profile stands and which requirements need more evidence before your final submission.</p>
                </div>
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center font-black text-xl">3</div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Actionable Improvement Guidance</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">Receive a 5-phase tactical roadmap tailored to your specific field (Tech, Arts, or Research) to maximize success.</p>
                </div>
              </div>
            </section>

            {/* Who should use */}
            <section className="py-24 bg-zinc-50/50 overflow-hidden">
              <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 space-y-8">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.95]">Who should use <br/> GTV Assessor?</h2>
                  <p className="text-zinc-500 text-lg italic leading-relaxed">The UK Global Talent Visa endorsement process is highly selective. An early-stage AI evaluation helps you avoid weak submissions.</p>
                  <ul className="space-y-4">
                    {[
                      "FASHION DESIGNERS AND CREATIVE PROFESSIONALS",
                      "DIGITAL TECHNOLOGY SPECIALISTS AND FOUNDERS",
                      "ARTISTS, CURATORS, AND MUSICIANS",
                      "RESEARCHERS AND ACADEMIC PROFESSIONALS"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
                        <div className="w-5 h-5 bg-amber-50 rounded-full flex items-center justify-center text-[8px] text-amber-600">
                          <i className="fas fa-check"></i>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 w-full max-w-md relative">
                   <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-zinc-100 animate-fade-in">
                      <div className="space-y-6">
                        <div className="h-2 w-full bg-zinc-50 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 w-[82%]"></div>
                        </div>
                        <div className="flex justify-between items-end">
                           <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Eligibility Score</span>
                           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">82% (High Readiness)</span>
                        </div>
                        <div className="space-y-3 pt-6 border-t border-zinc-50">
                           <div className="flex items-center gap-2">
                             <div className="w-3 h-3 bg-green-500 rounded-full opacity-50"></div>
                             <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Leadership Profile: Confirmed</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <div className="w-3 h-3 bg-green-500 rounded-full opacity-50"></div>
                             <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Innovation Record: Strong</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <div className="w-3 h-3 bg-amber-500 rounded-full opacity-50"></div>
                             <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Media Gap: 1 Clipping Needed</span>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </section>

            <SocialProof />
            <FAQ />
            <LeadCapture />

            {/* Final CTA */}
            <section className="py-24 px-6">
              <div className="max-w-6xl mx-auto bg-zinc-900 rounded-[4rem] p-12 md:p-24 text-center text-white space-y-12 shadow-2xl border border-zinc-800 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/5 to-transparent"></div>
                <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none relative z-10">Start Your Global Talent Visa Assessment Today</h2>
                <p className="text-zinc-400 text-lg md:text-2xl italic font-light max-w-2xl mx-auto relative z-10">Get a clear picture of your chances and a tailored evidence map before you apply.</p>
                <button 
                  onClick={() => navigateTo('/eligibility-check')}
                  className="px-12 py-6 bg-white text-zinc-900 font-black rounded-3xl uppercase tracking-widest text-sm hover:bg-zinc-100 transition-all shadow-xl active:scale-95 relative z-10 italic"
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
          <FAQSchema items={[{ question: "Is this GTV check accurate?", answer: "Our AI uses the latest 2025 UK Home Office criteria." }]} />
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
            <PaymentModal email={assessmentData.email} onSuccess={() => startTransition(() => setStep(AppStep.RESULTS_PREMIUM))} onCancel={() => startTransition(() => setStep(AppStep.RESULTS_FREE))} />
          </div>
        ) : null;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#FDFDFD] transition-opacity duration-300 ${isPending || isVerifyingPayment ? 'opacity-50' : 'opacity-100'}`}>
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-40 safe-top flex items-center justify-between px-6 md:px-12 h-[calc(80px+var(--sat))]">
        <div 
          className="flex items-center space-x-3 cursor-pointer group py-2 pr-10 select-none" 
          onClick={handleLogoClick}
          role="button"
          aria-label="Home and Admin Access"
        >
          <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-white font-black shadow-lg transition-transform group-hover:scale-105">G</div>
          <div className="flex flex-col">
            <span className="text-sm md:text-xl font-light tracking-widest uppercase text-zinc-800">GTV <span className="font-black">Assessor</span></span>
          </div>
        </div>
        <button onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = '/'; }} className="text-[9px] font-black text-zinc-400 uppercase tracking-widest border border-zinc-100 px-4 py-2 rounded-full hover:bg-zinc-50 transition-colors">Reset Session</button>
      </header>

      <main className="flex-grow">
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-zinc-100 py-24 text-left">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
           <div className="space-y-6">
              <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.3em]">Resources</h4>
              <ul className="space-y-3">
                 <li><button onClick={() => navigateTo('/global-talent-visa')} className="text-zinc-500 hover:text-zinc-900 text-sm font-black italic transition-colors text-left">Visa Overview Guide</button></li>
                 <li><button onClick={() => navigateTo('/global-talent-visa-fashion')} className="text-zinc-500 hover:text-zinc-900 text-sm font-black italic transition-colors text-left">Fashion Designer Guide</button></li>
                 <li><button onClick={() => navigateTo('/global-talent-visa-tech')} className="text-zinc-500 hover:text-zinc-900 text-sm font-black italic transition-colors text-left">Digital Tech Guide</button></li>
                 <li><button onClick={() => navigateTo('/')} className="text-zinc-500 hover:text-zinc-900 text-sm font-black italic transition-colors text-left">Home Page</button></li>
              </ul>
           </div>
           <div className="space-y-6">
              <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.3em]">Connect</h4>
              <ul className="space-y-3">
                 <li><a href="https://chat.whatsapp.com/GTV" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-900 text-sm font-black italic transition-colors block text-left">WhatsApp Community</a></li>
                 <li><a href="mailto:support@gtvassessor.com" className="text-zinc-500 hover:text-zinc-900 text-sm font-black italic transition-colors block text-left">Email Support</a></li>
              </ul>
           </div>
           <div className="space-y-6">
              <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.3em]">GTV Assessor</h4>
              <p className="text-zinc-400 text-xs leading-relaxed italic font-medium">AI-driven platform for UK Global Talent Visa readiness assessment. Empowering international talent through data transparency.</p>
           </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 border-t border-zinc-50 pt-12 flex flex-col items-center gap-8">
          <p className="text-[9px] text-zinc-400 font-black tracking-widest uppercase">&copy; {new Date().getFullYear()} GTV Assessor. PROUDLY BUILT FOR TALENTS.</p>
          <div className="flex items-center gap-8">
            <button onClick={() => setShowPrivacy(true)} className="text-[9px] font-black text-zinc-300 uppercase tracking-widest hover:text-zinc-900 transition-colors">Privacy Policy</button>
            <span className="w-px h-3 bg-zinc-100"></span>
            <button onClick={() => setShowPrivacy(true)} className="text-[9px] font-black text-zinc-300 uppercase tracking-widest hover:text-zinc-900 transition-colors">Terms of Service</button>
          </div>
        </div>
      </footer>
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} isDemoMode={isDemoMode} onToggleDemoMode={setIsDemoMode} />}
    </div>
  );
};

export default App;