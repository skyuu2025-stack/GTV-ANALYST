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
import GuideGeneral from './components/GuideGeneral.tsx';
import GuideFashion from './components/GuideFashion.tsx';

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

  const handleRouting = () => {
    const path = window.location.pathname;
    if (path === '/global-talent-visa') {
      setStep(AppStep.GUIDE_GENERAL);
    } else if (path === '/global-talent-visa-fashion') {
      setStep(AppStep.GUIDE_FASHION);
    } else {
      setStep(AppStep.LANDING);
    }
  };

  useEffect(() => {
    handleRouting();
    window.addEventListener('popstate', handleRouting);
    return () => window.removeEventListener('popstate', handleRouting);
  }, []);

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
        setStep(AppStep.RESULTS_FREE);
      }, 2000);
      return;
    }

    try {
      const result = await analyzeVisaEligibility(data, fileNames);
      localStorage.setItem('gtv_assessment_data', JSON.stringify(data));
      localStorage.setItem('gtv_analysis_result', JSON.stringify(result));
      saveAssessment(data, result).catch(err => {
        console.warn("Supabase Save failed (likely RLS), but proceeding to results:", err);
      });
      setAnalysisResult(result);
      setStep(AppStep.RESULTS_FREE);
    } catch (err: any) {
      setError(err.message);
      setStep(AppStep.FORM);
    }
  };

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    handleRouting();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
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
          onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = window.location.pathname; }} 
          className="text-[9px] font-black text-zinc-400 uppercase tracking-widest border border-zinc-100 px-4 py-2 rounded-full hover:bg-zinc-50 transition-colors"
        >
          Reset Session
        </button>
      </header>

      <main className="flex-grow">
        {step === AppStep.LANDING && (
          <>
            <Hero onStart={() => setStep(AppStep.FORM)} />
            
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

            <section className="py-24 bg-zinc-50 px-6">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
                <div className="md:w-1/2 space-y-8">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">Who Should Use <br/>GTV Assessor?</h2>
                  <p className="text-zinc-600 text-lg italic leading-relaxed">The UK Global Talent Visa endorsement process is highly selective. An early-stage AI evaluation helps you avoid weak submissions.</p>
                  <ul className="grid grid-cols-1 gap-4">
                    {["Fashion designers and creative professionals", "Digital technology specialists and founders", "Artists, curators, and musicians", "Researchers and academic professionals"].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-zinc-100 font-bold uppercase text-[11px] tracking-widest">
                        <i className="fas fa-check-circle text-[#D4AF37]"></i> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:w-1/2 bg-white p-10 rounded-[3rem] shadow-2xl border border-zinc-100 rotate-2">
                  <div className="space-y-6">
                    <div className="w-full h-4 bg-zinc-50 rounded-full overflow-hidden"><div className="w-4/5 h-full bg-[#D4AF37]"></div></div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      <span>Eligibility Score</span>
                      <span className="text-zinc-900">82% (High Readiness)</span>
                    </div>
                    <div className="pt-6 border-t border-zinc-50 space-y-4">
                       <div className="h-2 w-full bg-zinc-50 rounded-full"></div>
                       <div className="h-2 w-3/4 bg-zinc-50 rounded-full"></div>
                       <div className="h-2 w-1/2 bg-zinc-50 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <SocialProof />
            <FAQ />
            <LeadCapture />

            <section className="py-24 px-6 text-center bg-zinc-900 text-white rounded-[4rem] mx-4 mb-24 overflow-hidden relative">
              <div className="absolute inset-0 bg-amber-600/5 blur-[100px]"></div>
              <div className="relative z-10 space-y-10">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">Start Your Global Talent Visa Assessment Today</h2>
                <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-light italic">Get a clear picture of your chances and a tailored evidence map before you apply.</p>
                <button 
                  onClick={() => { setStep(AppStep.FORM); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-16 py-7 bg-white text-zinc-900 font-black rounded-3xl uppercase tracking-widest text-sm hover:bg-zinc-100 transition-all shadow-2xl active:scale-95"
                >
                  Start Assessment
                </button>
              </div>
            </section>
          </>
        )}
        {step === AppStep.GUIDE_GENERAL && <GuideGeneral onStart={() => setStep(AppStep.FORM)} />}
        {step === AppStep.GUIDE_FASHION && <GuideFashion onStart={() => setStep(AppStep.FORM)} />}
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
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-left">
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Resources</h4>
              <ul className="space-y-2">
                 <li><button onClick={() => navigateTo('/global-talent-visa')} className="text-zinc-500 hover:text-zinc-900 text-xs font-bold italic transition-colors">Visa Overview Guide</button></li>
                 <li><button onClick={() => navigateTo('/global-talent-visa-fashion')} className="text-zinc-500 hover:text-zinc-900 text-xs font-bold italic transition-colors">Fashion Designer Guide</button></li>
                 <li><button onClick={() => setStep(AppStep.LANDING)} className="text-zinc-500 hover:text-zinc-900 text-xs font-bold italic transition-colors">Home Page</button></li>
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
              <p className="text-zinc-400 text-[10px] leading-relaxed italic">AI-driven platform for UK Global Talent Visa readiness assessment. Empowering international talent through data transparency.</p>
           </div>
        </div>
        
        <p className="text-[9px] text-zinc-400 font-black tracking-widest uppercase">&copy; {new Date().getFullYear()} GTV Assessor. PROUDLY BUILT FOR TALENTS.</p>
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