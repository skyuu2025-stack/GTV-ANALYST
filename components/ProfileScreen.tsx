
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, AppStep } from '../types.ts';
import { supabase, signInWithGoogle, signInWithApple, getEnvStatus } from '../supabaseService.ts';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdate: (user: Partial<UserProfile>) => void;
  onLogin: (method: string) => void;
  onHome: () => void;
  onChat: () => void;
  onNavigate: (step: AppStep) => void;
}

type SubView = 'main' | 'privacy' | 'notifications' | 'help' | 'edit_profile' | 'auth_email' | 'auth_phone' | 'verify_email';
type AuthState = 'idle' | 'sending' | 'pending' | 'verifying' | 'success' | 'link_sent';

const COUNTRY_CODES = [
  { code: '+44', name: 'UK' },
  { code: '+1', name: 'US/CA' },
  { code: '+86', name: 'CN' },
  { code: '+66', name: 'TH' },
  { code: '+971', name: 'UAE' },
  { code: '+65', name: 'SG' },
  { code: '+91', name: 'IN' },
  { code: '+84', name: 'VN' },
  { code: '+62', name: 'ID' },
  { code: '+60', name: 'MY' },
  { code: '+63', name: 'PH' },
  { code: '+82', name: 'KR' },
  { code: '+81', name: 'JP' },
  { code: '+852', name: 'HK' },
].sort((a, b) => a.name.localeCompare(b.name));

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onUpdate, onLogin, onHome, onChat, onNavigate }) => {
  const [activeSubView, setActiveSubView] = useState<SubView>('main');
  const [phone, setPhone] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [countryCode, setCountryCode] = useState('+86');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [authState, setAuthState] = useState<AuthState>('idle');
  const [resendTimer, setResendTimer] = useState(0);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const envStatus = getEnvStatus();

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg("Image too large. Please select a file under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...codeDigits];
    newDigits[index] = value.slice(-1);
    setCodeDigits(newDigits);
    if (value && index < 5) digitRefs.current[index + 1]?.focus();
    if (newDigits.every(d => d !== '')) {
      if (activeSubView === 'auth_phone') handleVerifyCode(newDigits.join(''), 'sms');
      else handleVerifyCode(newDigits.join(''), 'email');
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) digitRefs.current[index - 1]?.focus();
  };

  const handleRequestOtp = async (type: 'email' | 'sms') => {
    setErrorMsg(null);
    if (type === 'sms' && !phone.trim()) {
      setErrorMsg("Please enter your mobile number");
      return;
    }
    if (type === 'email' && (!emailInput.trim() || !emailInput.includes('@'))) {
      setErrorMsg("Please enter a valid email address");
      return;
    }
    
    if (!supabase) {
      setErrorMsg(envStatus.configError);
      return;
    }

    setAuthState('sending');
    
    try {
      const payload = type === 'sms' 
        ? { phone: `${countryCode}${phone.trim().replace(/\D/g, '')}` }
        : { email: emailInput.trim(), options: { emailRedirectTo: window.location.origin } };

      const { error } = await supabase.auth.signInWithOtp(payload);
      if (error) throw error;
      
      if (type === 'email') {
        setAuthState('link_sent');
      } else {
        setAuthState('pending');
        setResendTimer(60);
        setTimeout(() => digitRefs.current[0]?.focus(), 100);
      }
    } catch (err: any) {
      console.error("Auth Request Error:", err);
      setErrorMsg(err.message || "Request failed. Please try again later.");
      setAuthState('idle');
    }
  };

  const handleVerifyCode = async (fullCode: string, type: 'sms' | 'email') => {
    if (!supabase) return;
    setAuthState('verifying');
    setErrorMsg(null);

    try {
      const verifyPayload: any = {
        token: fullCode,
        type: type,
      };

      if (type === 'sms') {
        verifyPayload.phone = `${countryCode}${phone.trim().replace(/\D/g, '')}`;
      } else {
        verifyPayload.email = emailInput.trim();
      }

      const { data, error } = await supabase.auth.verifyOtp(verifyPayload);
      if (error) throw error;
      
      if (data.user) {
        setAuthState('success');
        setTimeout(() => {
          setActiveSubView('main');
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg("Invalid code or session expired.");
      setAuthState('pending');
      setCodeDigits(['', '', '', '', '', '']);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    setErrorMsg(null);
    try {
      const response = provider === 'google' 
        ? await signInWithGoogle() 
        : await signInWithApple();
      
      if (!response) throw new Error("Service initialization failed.");
      if (response.error) throw response.error;
    } catch (err: any) {
      console.error(`OAuth ${provider} Error:`, err);
      if (err.message && err.message.includes("VITE_")) {
        setErrorMsg("⚠️ 配置错误：代码未读到 SUPABASE 变量。\n修复：请在 Netlify 设置变量后，重新部署并选择 'Clear cache and deploy site'。");
      } else {
        setErrorMsg(err.message || `Login failed. Check ${provider} configuration.`);
      }
    }
  };

  const renderHeader = (title: string) => (
    <div className="flex items-center justify-between mb-10 sticky top-0 bg-white/80 backdrop-blur-md py-4 z-10 border-b border-zinc-50 px-2">
      <div className="flex items-center gap-4">
        <button onClick={() => { setActiveSubView('main'); setAuthState('idle'); setErrorMsg(null); setCodeDigits(['', '', '', '', '', '']); }} className="w-10 h-10 flex items-center justify-center bg-zinc-50 rounded-full active:scale-90 transition-transform">
          <i className="fas fa-chevron-left text-zinc-900"></i>
        </button>
        <h2 className="text-xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">{title}</h2>
      </div>
    </div>
  );

  const renderOtpInput = (target: string, type: 'sms' | 'email') => (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center space-y-2">
         <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Verification code sent to</p>
         <h3 className="text-lg font-black text-zinc-900">{target}</h3>
      </div>
      
      <div className="flex justify-between gap-3 px-2">
        {codeDigits.map((digit, idx) => (
          <input
            key={idx}
            ref={el => digitRefs.current[idx] = el}
            type="text"
            maxLength={1}
            inputMode="numeric"
            value={digit}
            onChange={e => handleDigitChange(idx, e.target.value)}
            onKeyDown={e => handleKeyDown(idx, e)}
            className="w-12 h-16 md:w-16 md:h-20 bg-zinc-50 border border-zinc-100 rounded-2xl text-center text-2xl font-black text-zinc-900 outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
          />
        ))}
      </div>
      
      {errorMsg && <p className="text-red-500 text-[10px] font-black text-center bg-red-50 py-3 rounded-xl animate-shake whitespace-pre-wrap">{errorMsg}</p>}
      
      <div className="flex flex-col items-center gap-4">
        <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">
          {resendTimer > 0 ? `Resend available in ${resendTimer}s` : (
            <button onClick={() => handleRequestOtp(type)} className="text-amber-600 hover:text-amber-700 underline">Resend Code</button>
          )}
        </p>
        <button 
           onClick={() => setAuthState('idle')} 
           className="text-center text-[9px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors"
        >
          Back to edit {type === 'sms' ? 'phone' : 'email'}
        </button>
      </div>
    </div>
  );

  const renderMagicLinkSent = (email: string) => (
    <div className="space-y-12 animate-fade-in text-center py-10">
      <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center text-white text-3xl mx-auto shadow-2xl mb-8">
        <i className="fas fa-paper-plane animate-pulse"></i>
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900">Check Your Email</h3>
        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-[240px] mx-auto">
          We've sent a magic login link to<br/>
          <span className="text-zinc-900 font-black">{email}</span>
        </p>
      </div>
      <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 text-left space-y-3">
        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Troubleshooting:</p>
        <p className="text-zinc-600 text-[10px] italic leading-relaxed">
          1. 请点击邮件中的确认链接（Confirm link）即可自动登录本系统。<br/>
          2. 如果您更倾向使用“6位数字验证码”，请在 Supabase 后台 Auth -> Providers -> Email 中启用 "Enable Email OTP" 并关闭 "Confirm Email"。
        </p>
      </div>
      <button 
        onClick={() => setAuthState('idle')} 
        className="text-[10px] font-black text-amber-600 uppercase tracking-widest border-b border-amber-600 pb-1"
      >
        Try another email
      </button>
    </div>
  );

  if (activeSubView === 'auth_phone') return <div className="min-h-screen bg-white">{renderHeader('PHONE LOGIN')}{renderOtpInput(`${countryCode}${phone}`, 'sms')}</div>;
  if (activeSubView === 'auth_email') return <div className="min-h-screen bg-white">{renderHeader('EMAIL LOGIN')}{authState === 'link_sent' ? renderMagicLinkSent(emailInput) : renderEmailAuth()}</div>;

  return (
    <div className="px-6 py-8 animate-fade-in space-y-10 pb-32">
      <div className="flex flex-col items-center text-center space-y-6">
        <div 
          onClick={handleAvatarClick}
          className="group w-28 h-28 bg-zinc-50 rounded-full flex items-center justify-center border-[6px] border-white shadow-2xl overflow-hidden relative cursor-pointer active:scale-95 transition-transform ring-2 ring-zinc-50 hover:ring-amber-200"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
           {user.profileImage ? (
             <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover animate-fade-in" />
           ) : (
             <i className="fas fa-user text-zinc-100 text-4xl"></i>
           )}
           <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <i className="fas fa-camera text-white text-xl"></i>
           </div>
           <div className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full border-2 border-zinc-50 shadow-lg flex items-center justify-center">
              <i className="fas fa-plus text-zinc-900 text-[10px]"></i>
           </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
            {user.isLoggedIn ? user.name : 'Guest User'}
          </h2>
          <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em]">
            {user.isLoggedIn ? 'Identity Connected' : 'Click Avatar to Activate'}
          </p>
        </div>
      </div>

      <div className="space-y-8 max-w-sm mx-auto w-full">
        {!user.isLoggedIn && (
          <div className="space-y-4">
            <h3 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-4 mb-2">Connect Identity</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleOAuthLogin('apple')}
                className="flex flex-col items-center justify-center gap-2 px-6 py-5 bg-zinc-900 text-white rounded-[2rem] shadow-lg active:scale-95 transition-all"
              >
                <i className="fa-brands fa-apple text-lg"></i>
                <span className="text-[9px] font-black uppercase tracking-widest">Apple</span>
              </button>

              <button 
                onClick={() => handleOAuthLogin('google')}
                className="flex flex-col items-center justify-center gap-2 px-6 py-5 bg-white border border-zinc-100 text-zinc-900 rounded-[2rem] shadow-sm active:scale-95 transition-all"
              >
                <i className="fa-brands fa-google text-base"></i>
                <span className="text-[9px] font-black uppercase tracking-widest">Google</span>
              </button>
            </div>

            <button 
              onClick={() => setActiveSubView('auth_email')}
              className="w-full flex items-center justify-between px-10 py-5 bg-white border border-zinc-100 text-zinc-500 rounded-[2rem] active:scale-95 transition-all group hover:bg-zinc-100"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 text-zinc-900">Email Login</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Magic Link or OTP</span>
              </div>
              <i className="fas fa-envelope text-zinc-200 group-hover:text-zinc-400"></i>
            </button>
            
            <button 
              onClick={() => setActiveSubView('auth_phone')}
              className="w-full flex items-center justify-between px-10 py-5 bg-zinc-50 text-zinc-500 border border-zinc-100 rounded-[2rem] active:scale-95 transition-all group hover:bg-zinc-100"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 text-zinc-900">Mobile Login</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">SMS Verification</span>
              </div>
              <i className="fas fa-shield-halved text-zinc-200 group-hover:text-zinc-400"></i>
            </button>

            {errorMsg && (
              <div className="p-5 bg-red-50 text-red-600 rounded-2xl text-[9px] font-black uppercase tracking-widest leading-relaxed border border-red-100 animate-shake whitespace-pre-wrap">
                <i className="fas fa-exclamation-triangle mr-2"></i> {errorMsg}
              </div>
            )}
            
            {!envStatus.initialized && (
               <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 space-y-2">
                 <p className="text-[8px] font-black text-amber-700 uppercase tracking-widest">环境自检 (Diagnosis):</p>
                 <p className="text-[8px] text-amber-600 italic leading-relaxed">
                   Supabase 配置未就绪。请确认变量名为 VITE_SUPABASE_URL，并在 Netlify 部署时选择 'Clear cache'。
                 </p>
               </div>
            )}
          </div>
        )}

        {/* Security Section */}
        <div className="space-y-4">
          <h3 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-4 mb-2">Security & Privacy</h3>
          <div className="bg-white border border-zinc-100 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-50">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-black text-zinc-900 uppercase tracking-tight">Face ID / Biometric</span>
                <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Verify identity on launch</span>
              </div>
              <button 
                onClick={() => onUpdate({ faceIdEnabled: !user.faceIdEnabled })}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${user.faceIdEnabled ? 'bg-amber-500' : 'bg-zinc-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${user.faceIdEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
            
            <div className="flex items-center justify-between px-8 py-6">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-black text-zinc-900 uppercase tracking-tight">Incognito Mode</span>
                <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Don't save audit locally</span>
              </div>
              <button 
                onClick={() => onUpdate({ incognitoMode: !user.incognitoMode })}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${user.incognitoMode ? 'bg-zinc-900' : 'bg-zinc-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${user.incognitoMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Support Section */}
        <div className="space-y-4">
          <h3 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-4 mb-2">Information</h3>
          <button 
            onClick={() => onNavigate(AppStep.ABOUT_US)} 
            className="w-full flex items-center justify-between px-10 py-5 bg-white border border-zinc-100 text-zinc-900 rounded-[2rem] shadow-sm hover:shadow-md transition-all active:scale-95"
          >
             <span className="text-[10px] font-black uppercase tracking-widest">Platform Info</span>
             <i className="fas fa-circle-info text-zinc-200"></i>
          </button>
          
          <button 
            onClick={() => onNavigate(AppStep.PRIVACY)} 
            className="w-full flex items-center justify-between px-10 py-5 bg-white border border-zinc-100 text-zinc-900 rounded-[2rem] shadow-sm hover:shadow-md transition-all active:scale-95"
          >
             <span className="text-[10px] font-black uppercase tracking-widest">Data Privacy Policy</span>
             <i className="fas fa-shield-alt text-zinc-200"></i>
          </button>
        </div>

        {user.isLoggedIn && (
          <button 
            onClick={() => {
              supabase?.auth.signOut();
              onUpdate({ isLoggedIn: false, email: '', name: 'Guest User', profileImage: undefined });
              localStorage.removeItem('gtv_is_premium');
            }}
            className="w-full py-4 text-[10px] font-black text-red-400 uppercase tracking-[0.3em] hover:text-red-500 transition-colors"
          >
            Disconnect Identity
          </button>
        )}
      </div>
    </div>
  );

  function renderEmailAuth() {
    return (
      <div className="space-y-8 animate-fade-in px-4 mt-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Secure Email Address</label>
          <input 
            type="email" 
            placeholder="name@company.com" 
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-8 py-5 font-bold text-zinc-900 text-base outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
          />
        </div>
        
        {errorMsg && <p className="text-red-500 text-[10px] font-black text-center animate-shake whitespace-pre-wrap">{errorMsg}</p>}

        <button 
          onClick={() => handleRequestOtp('email')}
          disabled={authState === 'sending' || !emailInput.includes('@')}
          className={`w-full py-8 bg-zinc-900 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4 transition-all ${authState === 'sending' || !emailInput.includes('@') ? 'opacity-30' : 'active:scale-[0.97]'}`}
        >
          {authState === 'sending' ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            'Get Login Link / Code'
          )}
        </button>
      </div>
    );
  }
};

export default ProfileScreen;
