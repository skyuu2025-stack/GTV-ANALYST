import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, AppStep, AssessmentData, AnalysisResult } from '../types.ts';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdate: (user: Partial<UserProfile>) => void;
  onLogin: (method: string) => void;
  onHome: () => void;
  onChat: () => void;
  onNavigate: (step: AppStep) => void;
}

type SubView = 'main' | 'privacy' | 'notifications' | 'help' | 'edit_profile';
type AuthMethod = 'none' | 'apple' | 'google' | 'email' | 'phone';

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onUpdate, onLogin, onHome, onChat, onNavigate }) => {
  const [activeSubView, setActiveSubView] = useState<SubView>('main');
  const [isAuthenticating, setIsAuthenticating] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<AuthMethod>('none');
  const [isSimulatingBiometric, setIsSimulatingBiometric] = useState(false);
  const [isLocked, setIsLocked] = useState(user.faceIdEnabled && activeSubView === 'main');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const [lastAssessment, setLastAssessment] = useState<{data: AssessmentData, result: AnalysisResult} | null>(null);

  useEffect(() => {
    if (user.incognitoMode) {
      setLastAssessment(null);
      return;
    }

    const data = localStorage.getItem('gtv_assessment_data');
    const result = localStorage.getItem('gtv_analysis_result');
    if (data && result) {
      setLastAssessment({
        data: JSON.parse(data),
        result: JSON.parse(result)
      });
    } else {
      setLastAssessment(null);
    }
  }, [user.incognitoMode]);

  useEffect(() => {
    if (isLocked) {
      const timer = setTimeout(() => {
        setIsLocked(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLocked]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginTrigger = (method: string) => {
    // If Face ID is enabled, simulate a check before proceeding
    if (user.faceIdEnabled) {
      setIsSimulatingBiometric(true);
      setTimeout(() => {
        setIsSimulatingBiometric(false);
        setIsAuthenticating(method);
        setTimeout(() => {
          onLogin(method);
          setIsAuthenticating(null);
          setAuthMethod('none');
        }, 1200);
      }, 1000);
    } else {
      setIsAuthenticating(method);
      setTimeout(() => {
        onLogin(method);
        setIsAuthenticating(null);
        setAuthMethod('none');
      }, 1200);
    }
  };

  const handleToggleFaceId = () => {
    setIsSimulatingBiometric(true);
    // Simulate biometric confirmation for the toggle itself
    setTimeout(() => {
      onUpdate({ faceIdEnabled: !user.faceIdEnabled });
      setIsSimulatingBiometric(false);
    }, 800);
  };

  const handleDataDeletion = () => {
    setIsDeleting(true);
    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }, 1500);
  };

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in space-y-8">
        <div className="relative">
          <div className="w-28 h-28 border-[0.5px] border-zinc-100 rounded-full flex items-center justify-center shadow-2xl bg-white">
            <i className="fas fa-face-viewfinder text-4xl text-amber-600 animate-pulse"></i>
          </div>
          <div className="absolute inset-0 border-t-2 border-amber-600 rounded-full animate-spin"></div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-zinc-900">Encrypted Access</h3>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Verifying Biometrics...</p>
        </div>
      </div>
    );
  }

  const renderHeader = (title: string) => (
    <div className="flex items-center justify-between mb-8 sticky top-0 bg-[#FDFDFD] py-4 z-10 border-b border-zinc-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setActiveSubView('main')}
          className="w-10 h-10 flex items-center justify-center bg-zinc-50 rounded-full active:scale-90 transition-transform"
        >
          <i className="fas fa-chevron-left text-zinc-900"></i>
        </button>
        <h2 className="text-xl font-black uppercase italic tracking-tighter text-zinc-900">{title}</h2>
      </div>
      <button 
        onClick={onHome}
        className="w-10 h-10 flex items-center justify-center bg-zinc-50 rounded-full active:scale-90 transition-transform text-zinc-400"
      >
        <i className="fas fa-house text-sm"></i>
      </button>
    </div>
  );

  const renderEditProfile = () => (
    <div className="animate-fade-in space-y-6">
      {renderHeader('My Information')}
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Full Legal Name</label>
          <input 
            type="text" 
            value={user.name} 
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 font-bold text-zinc-800 outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Professional Email</label>
          <input 
            type="email" 
            value={user.email} 
            onChange={(e) => onUpdate({ email: e.target.value })}
            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 font-bold text-zinc-800 outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <button 
          onClick={() => setActiveSubView('main')}
          className="w-full py-5 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest mt-4 shadow-xl"
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="animate-fade-in space-y-6">
      {renderHeader('Privacy & Security')}
      <div className="space-y-4">
        <div className="bg-white border border-zinc-100 p-8 rounded-[2.5rem] space-y-8 shadow-sm">
          {/* Biometric Toggle Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-zinc-900 italic">Face ID / Touch ID</h3>
              <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest italic leading-tight">Strict verification for all logins</p>
            </div>
            <button 
              onClick={handleToggleFaceId}
              disabled={isSimulatingBiometric}
              className={`w-14 h-7 rounded-full relative transition-all duration-500 ${user.faceIdEnabled ? 'bg-[#e67e00]' : 'bg-zinc-200'} ${isSimulatingBiometric ? 'opacity-50' : ''}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-sm ${user.faceIdEnabled ? 'left-8' : 'left-1'}`}>
                {isSimulatingBiometric && <i className="fas fa-circle-notch animate-spin text-[8px] flex items-center justify-center h-full text-amber-600"></i>}
              </div>
            </button>
          </div>

          <button 
            onClick={() => onUpdate({ incognitoMode: !user.incognitoMode })}
            className="w-full flex justify-between items-center outline-none group"
          >
            <div className="space-y-1 text-left">
              <span className="text-[11px] font-black uppercase tracking-[0.1em] text-zinc-900 italic">Incognito Audit</span>
              <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest italic leading-tight">No data persistence in local engine</p>
            </div>
            <div className={`w-14 h-7 rounded-full relative transition-all duration-300 ${user.incognitoMode ? 'bg-[#e67e00]' : 'bg-zinc-200'}`}>
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm ${user.incognitoMode ? 'left-8' : 'left-1'}`}></div>
            </div>
          </button>
        </div>

        {!showDeleteConfirm ? (
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-6 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] bg-red-50/50 rounded-3xl border border-red-100 mt-8 active:scale-[0.98] transition-all"
          >
            Request Data Deletion
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 p-8 rounded-[2.5rem] space-y-6 mt-8 animate-fade-in shadow-xl">
            <div className="text-center space-y-2">
              <p className="text-[11px] font-black text-red-900 uppercase tracking-widest text-center">Delete All Personal Data?</p>
              <p className="text-[10px] text-red-700/60 font-medium italic text-center leading-relaxed">This action will wipe your entire assessment history and cannot be undone.</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleDataDeletion}
                disabled={isDeleting}
                className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? 'Scrubbing...' : 'Confirm'}
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 py-4 bg-white text-zinc-400 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderNotifications = () => {
    const notifItems = [
      { key: 'notifVisaDeadline', label: 'Visa Deadline Alerts', desc: 'Get notified 90 days before expiry' },
      { key: 'notifAuditProgress', label: 'Audit Progress', desc: 'Real-time AI scanning updates' },
      { key: 'notifPolicyChanges', label: 'Policy Changes', desc: 'UK Home Office regulation news' },
      { key: 'notifMarketing', label: 'Marketing', desc: 'Special offers and success stories' }
    ];

    return (
      <div className="animate-fade-in space-y-6">
        {renderHeader('Notifications')}
        <div className="space-y-4">
          {notifItems.map((item) => {
            const isEnabled = !!(user as any)[item.key];
            return (
              <button 
                key={item.key} 
                onClick={() => onUpdate({ [item.key]: !isEnabled })}
                className="w-full flex items-center justify-between p-8 bg-white border border-zinc-100 rounded-[2.5rem] active:scale-[0.98] transition-all shadow-sm"
              >
                <div className="space-y-1.5 text-left">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-zinc-900 italic">{item.label}</h4>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tight">{item.desc}</p>
                </div>
                <div className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${isEnabled ? 'bg-[#e67e00]' : 'bg-zinc-200'}`}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm ${isEnabled ? 'left-8' : 'left-1'}`}></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderHelp = () => (
    <div className="animate-fade-in space-y-6">
      {renderHeader('Help & Support')}
      <div className="space-y-4">
        <div className="bg-zinc-900 p-8 rounded-[2.5rem] text-white space-y-4">
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-amber-500 text-center">Professional Concierge</h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-medium text-center">
            Connect with a human GTV specialist or utilize our priority AI chat for immediate guidance.
          </p>
          <button 
            onClick={onChat}
            className="w-full py-4 bg-white text-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 shadow-xl"
          >
            Open Chat Portal
          </button>
        </div>
        <div className="p-8 bg-zinc-50 rounded-[2.5rem] space-y-2 border border-zinc-100">
           <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest text-center">Technical Documentation</h4>
           <button onClick={() => onNavigate(AppStep.API_DOCS)} className="w-full py-3 text-amber-600 text-[11px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4">View API Reference</button>
        </div>
      </div>
    </div>
  );

  if (activeSubView === 'privacy') return <div className="px-6 pb-24">{renderPrivacy()}</div>;
  if (activeSubView === 'notifications') return <div className="px-6 pb-24">{renderNotifications()}</div>;
  if (activeSubView === 'help') return <div className="px-6 pb-24">{renderHelp()}</div>;
  if (activeSubView === 'edit_profile') return <div className="px-6 pb-24">{renderEditProfile()}</div>;

  return (
    <div className="px-6 py-8 animate-fade-in space-y-10 pb-24">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="relative">
          <div 
            className="w-28 h-28 bg-zinc-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl overflow-hidden cursor-pointer active:scale-95 transition-transform"
            onClick={handleImageClick}
          >
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <i className="fas fa-user text-zinc-300 text-4xl"></i>
            )}
          </div>
          <button 
            onClick={handleImageClick}
            className="absolute bottom-0 right-0 w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md active:scale-90 transition-transform"
          >
            <i className="fas fa-camera text-xs"></i>
          </button>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
              {user.name}
            </h2>
            {user.isLoggedIn && (
              <button onClick={() => setActiveSubView('edit_profile')} className="text-amber-600 text-[10px] ml-2">
                <i className="fas fa-pen-to-square"></i>
              </button>
            )}
          </div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
            {user.email || (user.isLoggedIn ? "Account Active" : "Guest Identification")}
          </p>
        </div>
      </div>

      {/* Own Information Widget */}
      {lastAssessment && (
        <div 
          onClick={() => onNavigate(AppStep.RESULTS_FREE)}
          className="bg-zinc-900 p-8 rounded-[3rem] border border-zinc-800 space-y-6 cursor-pointer active:scale-95 transition-all shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 rounded-full blur-3xl -z-0"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Active Roadmap</span>
              <h3 className="text-white text-lg font-black uppercase italic tracking-tighter leading-tight">{lastAssessment.data.endorsementRoute}</h3>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black text-white">{lastAssessment.result.probabilityScore}%</span>
              <p className="text-[7px] text-zinc-500 uppercase font-black">Score</p>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between relative z-10 border-t border-white/5">
             <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic group-hover:text-white transition-colors">Continue To Analysis</span>
             <i className="fas fa-arrow-right text-amber-600 text-sm group-hover:translate-x-1 transition-transform"></i>
          </div>
        </div>
      )}

      {/* SPEC-MATCHED Login Section */}
      {!user.isLoggedIn && (
        <div className="space-y-6 max-w-sm mx-auto w-full px-2 min-h-[260px] flex flex-col justify-center">
          {isAuthenticating || isSimulatingBiometric ? (
            <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in py-10">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-zinc-50 border-t-amber-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className={`fas ${isSimulatingBiometric ? 'fa-face-viewfinder text-amber-600 animate-pulse' : 'fa-shield-halved text-zinc-200'} text-lg`}></i>
                </div>
              </div>
              <div className="text-center space-y-1.5">
                <p className="text-[13px] font-black text-zinc-900 uppercase tracking-[0.2em] italic">
                  {isSimulatingBiometric ? 'BIOMETRIC SCAN' : 'SECURELY CONNECTING'}
                </p>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                  {isSimulatingBiometric ? 'CONFIRMING IDENTITY...' : 'VERIFYING PROFESSIONAL IDENTITY...'}
                </p>
              </div>
            </div>
          ) : authMethod !== 'none' ? (
            /* Credential Entry Mode */
            <div className="space-y-6 animate-fade-in">
              <button 
                onClick={() => setAuthMethod('none')}
                className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2"
              >
                <i className="fas fa-chevron-left"></i> Change Method
              </button>
              
              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-zinc-900">
                  {authMethod === 'email' ? 'Email Login' : 'Phone Verification'}
                </h3>
                
                {authMethod === 'email' ? (
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="ENTER EMAIL"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 font-black italic text-zinc-800 text-[13px] outline-none"
                    />
                    <input 
                      type="password" 
                      placeholder="ENTER PASSWORD"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 font-black italic text-zinc-800 text-[13px] outline-none"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input 
                      type="tel" 
                      placeholder="PHONE NUMBER"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 font-black italic text-zinc-800 text-[13px] outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="6-DIGIT CODE"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 font-black italic text-zinc-800 text-[13px] outline-none text-center tracking-[0.5em]"
                    />
                  </div>
                )}
                
                <button 
                  onClick={() => handleLoginTrigger(authMethod)}
                  className="w-full py-5 bg-zinc-900 text-white rounded-full font-black uppercase italic tracking-widest text-[13px] shadow-xl active:scale-95 transition-all"
                >
                  {authMethod === 'email' ? 'CONNECT ACCOUNT' : 'VERIFY & SIGN IN'}
                </button>
              </div>
            </div>
          ) : (
            /* Selection Mode */
            <>
              <span className="text-[11px] font-black text-zinc-400/80 uppercase tracking-[0.25em] block text-center mb-1">CONNECT PROFESSIONAL IDENTITY</span>
              <div className="flex flex-col gap-3.5">
                {/* Apple Login */}
                <button 
                  onClick={() => handleLoginTrigger('apple')}
                  className="w-full flex items-center justify-between px-10 py-5.5 bg-[#0a0a0a] text-white rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.12)] active:scale-[0.97] transition-all group border border-black"
                >
                  <div className="flex items-center gap-6">
                    <i className="fa-brands fa-apple text-2xl"></i>
                    <span className="text-[13px] font-black uppercase italic tracking-[0.05em] pt-0.5">CONTINUE WITH APPLE</span>
                  </div>
                  <i className="fas fa-chevron-right text-[11px] text-zinc-700 group-hover:text-white transition-colors"></i>
                </button>

                {/* Google Login */}
                <button 
                  onClick={() => handleLoginTrigger('google')}
                  className="w-full flex items-center justify-between px-10 py-5.5 bg-white border border-zinc-100 text-[#0a0a0a] rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] active:scale-[0.97] transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <i className="fa-brands fa-google text-2xl text-[#EA4335]"></i>
                    <span className="text-[13px] font-black uppercase italic tracking-[0.05em] pt-0.5">CONTINUE WITH GOOGLE</span>
                  </div>
                  <i className="fas fa-chevron-right text-[11px] text-zinc-100 group-hover:text-zinc-300 transition-colors"></i>
                </button>

                {/* Phone/Email Login */}
                <div className="grid grid-cols-2 gap-3.5">
                   <button 
                    onClick={() => setAuthMethod('email')}
                    className="flex flex-col items-center justify-center p-5 bg-white border border-zinc-100 text-[#0a0a0a] rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] active:scale-[0.97] transition-all group"
                  >
                    <i className="fas fa-envelope text-lg text-zinc-300 mb-2 group-hover:text-zinc-900"></i>
                    <span className="text-[10px] font-black uppercase italic tracking-[0.05em]">EMAIL</span>
                  </button>
                  <button 
                    onClick={() => setAuthMethod('phone')}
                    className="flex flex-col items-center justify-center p-5 bg-white border border-zinc-100 text-[#0a0a0a] rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] active:scale-[0.97] transition-all group"
                  >
                    <i className="fas fa-phone-alt text-lg text-zinc-300 mb-2 group-hover:text-zinc-900"></i>
                    <span className="text-[10px] font-black uppercase italic tracking-[0.05em]">PHONE</span>
                    <i className="fas fa-bolt text-[10px] text-[#e67e00] absolute top-3 right-4"></i>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Security Quick Access Toggle */}
      <div className="bg-white border border-zinc-50 p-6 rounded-[2.5rem] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
            <i className={`fas ${user.faceIdEnabled ? 'fa-face-viewfinder text-amber-600 animate-pulse' : 'fa-face-viewfinder text-zinc-300'}`}></i>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-[11px] font-black uppercase tracking-tight text-zinc-900 italic">Biometric Access</h4>
            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest italic">{user.faceIdEnabled ? 'ENFORCED' : 'OFF'}</p>
          </div>
        </div>
        <button 
          onClick={handleToggleFaceId}
          disabled={isSimulatingBiometric}
          className={`w-14 h-7 rounded-full relative transition-all duration-500 ${user.faceIdEnabled ? 'bg-[#e67e00]' : 'bg-zinc-200'}`}
        >
          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-sm ${user.faceIdEnabled ? 'left-8' : 'left-1'}`}>
            {isSimulatingBiometric && <i className="fas fa-circle-notch animate-spin text-[8px] flex items-center justify-center h-full text-amber-600"></i>}
          </div>
        </button>
      </div>

      {/* Profile Settings List */}
      <div className="space-y-3 pt-6">
        {[
          { id: 'edit_profile', icon: 'fa-user-pen', label: 'Identity & Information', iconColor: 'text-amber-600' },
          { id: 'privacy', icon: 'fa-shield-halved', label: 'Privacy & Security', iconColor: 'text-zinc-400' },
          { id: 'notifications', icon: 'fa-bell', label: 'Notification Settings', iconColor: 'text-amber-500' },
          { id: 'help', icon: 'fa-circle-question', label: 'Help & Support', iconColor: 'text-zinc-400' }
        ].map((item) => (
          <button 
            key={item.id} 
            onClick={() => setActiveSubView(item.id as SubView)}
            disabled={!!isAuthenticating || isSimulatingBiometric}
            className={`w-full flex items-center justify-between px-8 py-6 bg-white border border-zinc-50 rounded-[2.2rem] hover:bg-zinc-50 active:scale-[0.98] shadow-sm group transition-all ${isAuthenticating || isSimulatingBiometric ? 'opacity-40 grayscale pointer-events-none' : ''}`}
          >
            <div className="flex items-center gap-5">
              <i className={`fas ${item.icon} ${item.iconColor} transition-colors`}></i>
              <span className="text-[11px] font-black uppercase tracking-widest text-zinc-800 italic">{item.label}</span>
            </div>
            <i className="fas fa-chevron-right text-[9px] text-zinc-200"></i>
          </button>
        ))}
      </div>

      {user.isLoggedIn && (
        <button 
          onClick={() => onUpdate({ isLoggedIn: false, name: 'Guest User', profileImage: undefined })}
          className="w-full py-8 text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition-colors active:scale-95"
        >
          Sign Out of Account
        </button>
      )}
    </div>
  );
};

export default ProfileScreen;