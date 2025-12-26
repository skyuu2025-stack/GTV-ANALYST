import React, { useState, useEffect, useTransition, useCallback, useRef } from 'react';
import { AppStep, AssessmentData, AnalysisResult, UserProfile } from './types.ts';
import { analyzeVisaEligibility } from './geminiService.ts';
import { saveAssessment } from './supabaseService.ts';
import Hero from './components/Hero.tsx';
import AssessmentForm from './components/AssessmentForm.tsx';
import LoadingState from './components/LoadingState.tsx';
import PaymentModal from './components/PaymentModal.tsx';
import ResultsDashboard from './components/ResultsDashboard.tsx';
import LocalSupportFinder from './components/LocalSupportFinder.tsx';
import SEOManager from './components/SEOManager.tsx';
import LiveChatWidget from './components/LiveChatWidget.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import GuideGeneral from './components/GuideGeneral.tsx';
import GuideFashion from './components/GuideFashion.tsx';
import GuideTech from './components/GuideTech.tsx';
import GuideArts from './components/GuideArts.tsx';
import GuideArchitecture from './components/GuideArchitecture.tsx';
import GuideFilm from './components/GuideFilm.tsx';
import GuideScience from './components/GuideScience.tsx';
import ProfileScreen from './components/ProfileScreen.tsx';
import PrivacyPolicy from './components/PrivacyPolicy.tsx';
import CriteriaMapping from './components/CriteriaMapping.tsx';
import ApiDocs from './components/ApiDocs.tsx';

const App: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'home' | 'geo' | 'chat' | 'profile'>('home');
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(() => sessionStorage.getItem('gtv_is_premium') === 'true');
  
  // User Profile State
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('gtv_user_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Guest User',
      email: '',
      signature: '',
      isLoggedIn: false,
      incognitoMode: false,
      faceIdEnabled: true,
      notifVisaDeadline: true,
      notifAuditProgress: true,
      notifPolicyChanges: true,
      notifMarketing: false
    };
  });

  const logoClicks = useRef(0);
  const lastClickTime = useRef(0);

  // Persist User Profile
  useEffect(() => {
    localStorage.setItem('gtv_user_profile', JSON.stringify(user));
  }, [user]);

  // Sync Tab with Step
  useEffect(() => {
    if (step === AppStep.LANDING) setActiveTab('home');
    if (step === AppStep.FORM || step === AppStep.RESULTS_FREE || step === AppStep.RESULTS_PREMIUM) {
       if (activeTab === 'home') setActiveTab('profile');
    }
  }, [step]);

  const handleFormSubmit = async (data: AssessmentData, fileNames: string[]) => {
    setError(null);
    setAssessmentData(data);
    startTransition(() => setStep(AppStep.ANALYZING));

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

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTime.current > 2000) logoClicks.current = 0;
    logoClicks.current += 1;
    lastClickTime.current = now;
    if (logoClicks.current >= 5) setShowAdmin(true);
  };

  const handleLogin = (method: string) => {
    startTransition(() => {
      setUser(prev => ({
        ...prev,
        isLoggedIn: true,
        name: method === 'apple' ? 'Apple User' : method === 'google' ? 'Google User' : 'Mobile User',
        email: method === 'apple' ? 'user@icloud.com' : 'user@gmail.com',
        profileImage: `https://i.pravatar.cc/150?u=${method}`
      }));
    });
  };

  const handleNavigate = (newStep: AppStep) => {
    startTransition(() => {
      setActiveTab('home');
      setStep(newStep);
    });
  };

  const handleReset = () => {
    startTransition(() => {
      setActiveTab('home');
      setStep(AppStep.LANDING);
      setError(null);
    });
  };

  const renderActiveScreen = () => {
    if (activeTab === 'geo') return <LocalSupportFinder />;
    if (activeTab === 'chat') return <div className="p-6"><LiveChatWidget inline /></div>;
    
    if (activeTab === 'profile') {
      return (
        <ProfileScreen 
          user={user} 
          onUpdate={(updates) => setUser(prev => ({ ...prev, ...updates }))}
          onLogin={handleLogin}
          onHome={() => { setActiveTab('home'); setStep(AppStep.LANDING); }}
          onChat={() => setActiveTab('chat')}
          onNavigate={handleNavigate}
        />
      );
    }

    switch (step) {
      case AppStep.LANDING:
        return <Hero onStart={() => setStep(AppStep.FORM)} />;
      case AppStep.FORM:
        return <AssessmentForm onSubmit={handleFormSubmit} error={error} />;
      case AppStep.ANALYZING:
        return <LoadingState />;
      case AppStep.RESULTS_FREE:
      case AppStep.RESULTS_PREMIUM:
        return analysisResult && assessmentData ? (
          <ResultsDashboard 
            result={analysisResult} 
            data={assessmentData} 
            isPremium={step === AppStep.RESULTS_PREMIUM || isPremium} 
            onUpgrade={() => setStep(AppStep.PAYMENT)} 
          />
        ) : null;
      case AppStep.PAYMENT:
        return assessmentData ? (
          <PaymentModal 
            email={assessmentData.email} 
            onSuccess={() => { setIsPremium(true); sessionStorage.setItem('gtv_is_premium', 'true'); setStep(AppStep.RESULTS_PREMIUM); }} 
            onCancel={() => setStep(AppStep.RESULTS_FREE)} 
          />
        ) : null;
      case AppStep.GUIDE_GENERAL:
        return <GuideGeneral onStart={() => setStep(AppStep.FORM)} onNavigate={handleNavigate} />;
      case AppStep.GUIDE_FASHION:
        return <GuideFashion onStart={() => setStep(AppStep.FORM)} onBack={() => setStep(AppStep.GUIDE_GENERAL)} />;
      case AppStep.GUIDE_TECH:
        return <GuideTech onStart={() => setStep(AppStep.FORM)} onBack={() => setStep(AppStep.GUIDE_GENERAL)} />;
      case AppStep.GUIDE_ARTS:
        return <GuideArts onStart={() => setStep(AppStep.FORM)} onBack={() => setStep(AppStep.GUIDE_GENERAL)} />;
      case AppStep.GUIDE_ARCH:
        return <GuideArchitecture onStart={() => setStep(AppStep.FORM)} onBack={() => setStep(AppStep.GUIDE_GENERAL)} />;
      case AppStep.GUIDE_FILM:
        return <GuideFilm onStart={() => setStep(AppStep.FORM)} onBack={() => setStep(AppStep.GUIDE_GENERAL)} />;
      case AppStep.GUIDE_SCIENCE:
        return <GuideScience onStart={() => setStep(AppStep.FORM)} onBack={() => setStep(AppStep.GUIDE_GENERAL)} />;
      case AppStep.PRIVACY:
        return <PrivacyPolicy onClose={() => setStep(AppStep.GUIDE_GENERAL)} />;
      case AppStep.CRITERIA:
        return <CriteriaMapping onBack={() => setStep(AppStep.GUIDE_GENERAL)} />;
      case AppStep.API_DOCS:
        return <ApiDocs onBack={() => setStep(AppStep.GUIDE_GENERAL)} />;
      default:
        return <Hero onStart={() => setStep(AppStep.FORM)} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FDFDFD]">
      <SEOManager currentStep={step} />
      
      <header className="app-header">
        <div className="flex items-center gap-2" onClick={handleLogoClick}>
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white text-[10px] font-black">G</div>
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-800">GTV Assessor</span>
        </div>
        <button 
          onClick={handleReset}
          className="text-[9px] font-black text-zinc-400 uppercase tracking-widest px-3 py-1.5 rounded-full border border-zinc-100 active:bg-zinc-50 transition-colors"
        >
          Reset
        </button>
      </header>

      <main className="app-content">
        <div className={`transition-opacity duration-300 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
          {renderActiveScreen()}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-zinc-100 flex items-center justify-around h-[70px] safe-bottom z-[90]">
        {[
          { id: 'home', icon: 'fa-house', label: 'Home' },
          { id: 'geo', icon: 'fa-location-dot', label: 'Experts' },
          { id: 'chat', icon: 'fa-comment-dots', label: 'Chat' },
          { id: 'profile', icon: 'fa-user', label: 'Profile' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id === 'home' && step !== AppStep.LANDING && step !== AppStep.FORM) {
                 if (
                   step === AppStep.GUIDE_GENERAL || 
                   step === AppStep.GUIDE_FASHION || 
                   step === AppStep.GUIDE_TECH ||
                   step === AppStep.GUIDE_ARTS ||
                   step === AppStep.GUIDE_ARCH ||
                   step === AppStep.GUIDE_FILM ||
                   step === AppStep.GUIDE_SCIENCE
                 ) {
                 } else {
                   setStep(AppStep.LANDING);
                 }
              }
            }}
            className={`flex flex-col items-center gap-1.5 transition-all active:scale-90 ${activeTab === tab.id ? 'text-zinc-900' : 'text-zinc-300'}`}
          >
            <i className={`fas ${tab.icon} text-lg`}></i>
            <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>

      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} isDemoMode={false} onToggleDemoMode={() => {}} />}
    </div>
  );
};

export default App;