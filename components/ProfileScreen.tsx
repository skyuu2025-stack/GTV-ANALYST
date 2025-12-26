
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, AppStep } from '../types.ts';
import { supabase } from '../supabaseService.ts';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdate: (user: Partial<UserProfile>) => void;
  onLogin: (method: string) => void;
  onHome: () => void;
  onChat: () => void;
  onNavigate: (step: AppStep) => void;
}

type SubView = 'main' | 'privacy' | 'notifications' | 'help' | 'edit_profile' | 'auth_email' | 'verify_email';
type AuthState = 'idle' | 'sending' | 'pending' | 'verifying' | 'success' | 'link_sent';

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onUpdate, onLogin, onHome, onChat, onNavigate }) => {
  const [activeSubView, setActiveSubView] = useState<SubView>('main');
  const [emailInput, setEmailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [authState, setAuthState] = useState<AuthState>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user.isLoggedIn) {
      setActiveSubView('main');
      setAuthState('idle');
      setErrorMsg(null);
    }
  }, [user.isLoggedIn]);

  const handleRequestOtp = async () => {
    setErrorMsg(null);
    
    if (!supabase) {
      setErrorMsg("Identity service configuration missing.");
      return;
    }

    if (!emailInput.trim() || !emailInput.includes('@')) {
      setErrorMsg("Please enter a valid professional email address.");
      return;
    }
    
    setAuthState('sending');
    
    try {
      const currentOrigin = window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({ 
        email: emailInput.trim(), 
        options: { emailRedirectTo: `${currentOrigin}/` } 
      });
      
      if (error) throw error;
      setAuthState('link_sent');
    } catch (err: any) {
      console.error("Auth Request Error:", err);
      setErrorMsg(err.message || "Failed to dispatch login link.");
      setAuthState('idle');
    }
  };

  const renderHeader = (title: string) => (
    <div className="flex items-center justify-between mb-8 sticky top-0 bg-white/80 backdrop-blur-md py-4 z-10 border-b border-zinc-50 px-4">
      <div className="flex items-center gap-4">
        <button onClick={() => { setActiveSubView('main'); setAuthState('idle'); setErrorMsg(null); }} className="w-10 h-10 flex items-center justify-center bg-zinc-50 rounded-full active:scale-90 transition-transform">
          <i className="fas fa-chevron-left text-zinc-900"></i>
        </button>
        <h2 className="text-xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">{title}</h2>
      </div>
    </div>
  );

  const renderMagicLinkSent = (email: string) => (
    <div className="space-y-12 animate-fade-in text-center py-10 px-6">
      <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center text-white text-3xl mx-auto shadow-2xl mb-8">
        <i className="fas fa-paper-plane animate-pulse"></i>
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900">Email Sent</h3>
        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-[240px] mx-auto">
          Secure login link dispatched to:<br/>
          <span className="text-zinc-900 font-black">{email}</span>
        </p>
      </div>
      <button onClick={() => setAuthState('idle')} className="text-[10px] font-black text-amber-600 uppercase tracking-widest border-b border-amber-600 pb-1">Use different email</button>
    </div>
  );

  const renderMain = () => (
    <div className="px-6 py-8 animate-fade-in space-y-10 pb-32">
      <div className="flex flex-col items-center text-center space-y-6">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group w-28 h-28 bg-zinc-50 rounded-full flex items-center justify-center border-[6px] border-white shadow-2xl overflow-hidden relative cursor-pointer active:scale-95 transition-transform"
        >
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => onUpdate({ profileImage: reader.result as string });
              reader.readAsDataURL(file);
            }
          }} />
          {user.profileImage ? <img src={user.profileImage} className="w-full h-full object-cover" /> : <i className="fas fa-user text-zinc-100 text-4xl"></i>}
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">{user.isLoggedIn ? user.name : 'Guest User'}</h2>
          <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em]">{user.isLoggedIn ? 'Identity Connected' : 'Connect Email to Sync Results'}</p>
        </div>
      </div>

      <div className="space-y-6 max-w-sm mx-auto w-full">
        {!user.isLoggedIn && (
          <div className="space-y-4">
             <h3 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-2">Connect Identity</h3>
             <button onClick={() => setActiveSubView('auth_email')} className="w-full flex items-center justify-between px-10 py-5 bg-zinc-900 text-white rounded-3xl shadow-xl active:scale-95 transition-all">
                <span className="text-[10px] font-black uppercase tracking-widest">Connect via Email</span>
                <i className="fas fa-envelope text-amber-500"></i>
             </button>
          </div>
        )}

        <div className="space-y-4">
           <h3 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-2">Platform</h3>
           <button onClick={() => onNavigate(AppStep.ABOUT_US)} className="w-full flex items-center justify-between px-10 py-5 bg-white border border-zinc-100 text-zinc-900 rounded-3xl active:scale-95 transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest">Platform Info</span>
              <i className="fas fa-info-circle text-zinc-200"></i>
           </button>
           <button onClick={() => onNavigate(AppStep.PRIVACY)} className="w-full flex items-center justify-between px-10 py-5 bg-white border border-zinc-100 text-zinc-900 rounded-3xl active:scale-95 transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest">Privacy Policy</span>
              <i className="fas fa-shield-alt text-zinc-200"></i>
           </button>
        </div>

        {user.isLoggedIn && (
          <button onClick={() => { supabase?.auth.signOut(); onUpdate({ isLoggedIn: false }); }} className="w-full py-4 text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-500 transition-colors">Disconnect Account</button>
        )}
      </div>
    </div>
  );

  if (activeSubView === 'auth_email') return (
    <div className="min-h-screen bg-white">
      {renderHeader('EMAIL IDENTITY')}
      {authState === 'link_sent' ? renderMagicLinkSent(emailInput) : (
        <div className="px-6 space-y-8 mt-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Secure Email</label>
            <input 
              type="email" 
              placeholder="name@provider.com" 
              value={emailInput} 
              onChange={e => setEmailInput(e.target.value)} 
              className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-8 py-5 font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-amber-500" 
            />
          </div>
          {errorMsg && <p className="text-red-500 text-[10px] font-black text-center bg-red-50 py-3 rounded-xl">{errorMsg}</p>}
          <button 
            onClick={handleRequestOtp} 
            disabled={authState === 'sending' || !emailInput.includes('@')}
            className={`w-full py-6 bg-zinc-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-xl transition-all ${authState === 'sending' || !emailInput.includes('@') ? 'opacity-30' : 'active:scale-95'}`}
          >
            {authState === 'sending' ? <i className="fas fa-circle-notch animate-spin"></i> : 'Send Login Link'}
          </button>
        </div>
      )}
    </div>
  );

  return renderMain();
};

export default ProfileScreen;
