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

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onUpdate, onLogin, onHome, onChat, onNavigate }) => {
  const [activeSubView, setActiveSubView] = useState<SubView>('main');
  const [isEditingSignature, setIsEditingSignature] = useState(false);
  const [tempSignature, setTempSignature] = useState(user.signature);
  const [isAuthenticating, setIsAuthenticating] = useState<string | null>(null);
  const [isSimulatingBiometric, setIsSimulatingBiometric] = useState(false);
  const [isLocked, setIsLocked] = useState(user.faceIdEnabled && activeSubView === 'main');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch local assessment for "Own Information" display
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

  // Handle Biometric Unlock Simulation
  useEffect(() => {
    if (isLocked) {
      const timer = setTimeout(() => {
        setIsLocked(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLocked]);

  const handleSaveSignature = () => {
    onUpdate({ signature: tempSignature });
    setIsEditingSignature(false);
  };

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
    setIsAuthenticating(method);
    setTimeout(() => {
      onLogin(method);
      setIsAuthenticating(null);
    }, 1200);
  };

  const handleToggleFaceId = () => {
    setIsSimulatingBiometric(true);
    // Simulate biometric check before toggling security settings
    setTimeout(() => {
      onUpdate({ faceIdEnabled: !user.faceIdEnabled });
      setIsSimulatingBiometric(false);
    }, 1200);
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
      <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in space-y-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-amber-600/20 rounded-full flex items-center justify-center animate-pulse">
            <i className="fas fa-face-viewfinder text-4xl text-amber-600"></i>
          </div>
          <div className="absolute inset-0 border-t-4 border-amber-600 rounded-full animate-spin"></div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-black uppercase italic tracking-tighter text-zinc-900">Identity Verification</h3>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Verifying Biometrics...</p>
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
          <button 
            onClick={() => onUpdate({ incognitoMode: !user.incognitoMode })}
            className="w-full flex justify-between items-center outline-none group"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.1em] text-zinc-800">Incognito Audit</span>
            <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${user.incognitoMode ? 'bg-[#e67e00]' : 'bg-zinc-900'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${user.incognitoMode ? 'left-7' : 'left-1'}`}></div>
            </div>
          </button>
          
          <button 
            onClick={handleToggleFaceId}
            disabled={isSimulatingBiometric}
            className="w-full flex justify-between items-center outline-none group"
          >
            <div className="flex flex-col items-start">
              <span className="text-[11px] font-black uppercase tracking-[0.1em] text-zinc-800">
                {isSimulatingBiometric ? 'Verifying Identity...' : 'Face ID / Touch ID'}
              </span>
              <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest mt-1 italic">Impacts Login & Profile Security</span>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${user.faceIdEnabled ? 'bg-[#e67e00]' : 'bg-zinc-900'} ${isSimulatingBiometric ? 'opacity-50' : ''}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${user.faceIdEnabled ? 'left-7' : 'left-1'}`}></div>
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
                  <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-zinc-900">{item.label}</h4>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tight">{item.desc}</p>
                </div>
                <div className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${isEnabled ? 'bg-[#e67e00]' : 'bg-zinc-200'}`}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${isEnabled ? 'left-8' : 'left-1'}`}></div>
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

      {/* Branded Quick Login Options - Enhanced for Specification */}
      {!user.isLoggedIn && (
        <div className="space-y-6 max-w-sm mx-auto w-full">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] block text-center mb-2">Connect Professional Identity</span>
          <div className="flex flex-col gap-3">
            {/* Apple Login - Black Pill, White Text, Italic Caps */}
            <button 
              onClick={() => handleLoginTrigger('apple')}
              disabled={!!isAuthenticating}
              className="w-full flex items-center justify-between px-8 py-5 bg-[#121212] text-white rounded-full shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-5">
                {isAuthenticating === 'apple' ? (
                  <i className="fas fa-circle-notch animate-spin text-lg"></i>
                ) : (
                  <i className="fa-brands fa-apple text-xl"></i>
                )}
                <span className="text-[11px] font-black uppercase italic tracking-widest">
                  {isAuthenticating === 'apple' ? 'CONNECTING...' : 'CONTINUE WITH APPLE'}
                </span>
              </div>
              <i className="fas fa-chevron-right text-[10px] text-white/40"></i>
            </button>

            {/* Google Login - White Pill, Black Text, Italic Caps */}
            <button 
              onClick={() => handleLoginTrigger('google')}
              disabled={!!isAuthenticating}
              className="w-full flex items-center justify-between px-8 py-5 bg-white border border-zinc-100 text-zinc-900 rounded-full shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-5">
                {isAuthenticating === 'google' ? (
                  <i className="fas fa-circle-notch animate-spin text-[#EA4335] text-lg"></i>
                ) : (
                  <i className="fa-brands fa-google text-xl text-[#EA4335]"></i>
                )}
                <span className="text-[11px] font-black uppercase italic tracking-widest">
                  {isAuthenticating === 'google' ? 'SYNCING...' : 'CONTINUE WITH GOOGLE'}
                </span>
              </div>
              <i className="fas fa-chevron-right text-[10px] text-zinc-200"></i>
            </button>

            {/* Phone/Email Login - White Pill, Black Text, Italic Caps, Bolt Icon */}
            <button 
              onClick={() => handleLoginTrigger('phone')}
              disabled={!!isAuthenticating}
              className="w-full flex items-center justify-between px-8 py-5 bg-white border border-zinc-100 text-zinc-900 rounded-full shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-5">
                {isAuthenticating === 'phone' ? (
                   <i className="fas fa-circle-notch animate-spin text-amber-500 text-lg"></i>
                ) : (
                  <i className="fas fa-phone-alt text-lg text-zinc-400"></i>
                )}
                <span className="text-[11px] font-black uppercase italic tracking-widest">
                  {isAuthenticating === 'phone' ? 'VERIFYING...' : 'ONE-CLICK PHONE/EMAIL'}
                </span>
              </div>
              <i className="fas fa-bolt text-[11px] text-[#e67e00]"></i>
            </button>
          </div>
        </div>
      )}

      {/* Profile Settings List */}
      <div className="space-y-3 pt-6">
        {[
          { id: 'edit_profile', icon: 'fa-user-pen', label: 'Identity & Information' },
          { id: 'privacy', icon: 'fa-shield-halved', label: 'Privacy & Security' },
          { id: 'notifications', icon: 'fa-bell', label: 'Notification Settings' },
          { id: 'help', icon: 'fa-circle-question', label: 'Help & Support' }
        ].map((item) => (
          <button 
            key={item.id} 
            onClick={() => setActiveSubView(item.id as SubView)}
            className="w-full flex items-center justify-between px-8 py-6 bg-white border border-zinc-50 rounded-[2rem] hover:bg-zinc-50 transition-colors active:scale-[0.98] transition-all shadow-sm group"
          >
            <div className="flex items-center gap-5">
              <i className={`fas ${item.icon} text-zinc-300 group-hover:text-amber-600 transition-colors`}></i>
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