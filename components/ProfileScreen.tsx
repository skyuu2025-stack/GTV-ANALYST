import React, { useState, useRef } from 'react';
import { UserProfile, AppStep } from '../types.ts';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdate: (user: Partial<UserProfile>) => void;
  onLogin: (method: string) => void;
  onHome: () => void;
  onChat: () => void;
  onNavigate: (step: AppStep) => void;
}

type SubView = 'main' | 'privacy' | 'notifications' | 'help';

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onUpdate, onLogin, onHome, onChat, onNavigate }) => {
  const [activeSubView, setActiveSubView] = useState<SubView>('main');
  const [isEditingSignature, setIsEditingSignature] = useState(false);
  const [tempSignature, setTempSignature] = useState(user.signature);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        className="w-10 h-10 flex items-center justify-center bg-zinc-50 rounded-full active:scale-90 transition-transform text-zinc-400 hover:text-zinc-900"
        title="Return to Home"
      >
        <i className="fas fa-house text-sm"></i>
      </button>
    </div>
  );

  const renderPrivacy = () => (
    <div className="animate-fade-in space-y-6">
      {renderHeader('Privacy & Security')}
      <div className="space-y-4">
        <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Encryption Status</h3>
          <div className="flex items-center gap-3 text-green-600">
            <i className="fas fa-lock"></i>
            <span className="text-xs font-bold uppercase italic">End-to-End Encrypted (AES-256)</span>
          </div>
          <p className="mt-3 text-[10px] text-zinc-500 font-medium leading-relaxed">
            All your audit documents and personal information are encrypted before being processed by the AI engine.
          </p>
        </div>

        <div className="bg-white border border-zinc-100 p-6 rounded-3xl space-y-4">
          <button 
            onClick={() => onUpdate({ incognitoMode: !user.incognitoMode })}
            className="w-full flex justify-between items-center outline-none group"
          >
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-700">Incognito Audit</span>
            <div className={`w-10 h-5 rounded-full relative transition-all duration-300 ${user.incognitoMode ? 'bg-zinc-900' : 'bg-zinc-200'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${user.incognitoMode ? 'left-6' : 'left-1'}`}></div>
            </div>
          </button>
          <button 
            onClick={() => onUpdate({ faceIdEnabled: !user.faceIdEnabled })}
            className="w-full flex justify-between items-center outline-none group"
          >
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-700">Face ID / Touch ID</span>
            <div className={`w-10 h-5 rounded-full relative transition-all duration-300 ${user.faceIdEnabled ? 'bg-zinc-900' : 'bg-zinc-200'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${user.faceIdEnabled ? 'left-6' : 'left-1'}`}></div>
            </div>
          </button>
        </div>

        <button className="w-full py-5 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 rounded-2xl border border-red-100 mt-8 active:scale-[0.98] transition-all">
          Request Data Deletion
        </button>
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
                className="w-full flex items-center justify-between p-6 bg-white border border-zinc-100 rounded-3xl active:scale-[0.98] transition-all"
              >
                <div className="space-y-1 text-left">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-900">{item.label}</h4>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase">{item.desc}</p>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isEnabled ? 'bg-amber-600' : 'bg-zinc-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isEnabled ? 'left-7' : 'left-1'}`}></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderHelp = () => {
    const helpItems = [
      { icon: 'fa-book', label: 'Endorsement Handbooks', sub: 'Official UK Gov PDF Library', url: 'https://www.gov.uk/global-talent', type: 'external' },
      { icon: 'fa-envelope', label: 'Email Support', sub: '24h Response', url: 'mailto:skyuu2025@gmail.com', type: 'external' },
      { icon: 'fa-circle-question', label: 'GTV Wiki', sub: 'In-Depth Knowledge Base', step: AppStep.GUIDE_GENERAL, type: 'internal' }
    ];

    return (
      <div className="animate-fade-in space-y-6">
        {renderHeader('Help & Support')}
        <div className="space-y-4">
          <div className="bg-zinc-900 p-8 rounded-[2.5rem] text-white space-y-4">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-amber-500">Need Expert Eyes?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              Connect with our GTV Concierge for immediate AI guidance or book a session with a human specialist.
            </p>
            <button 
              onClick={onChat}
              className="w-full py-4 bg-white text-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform"
            >
              Chat with Concierge
            </button>
          </div>

          <div className="grid gap-3">
            {helpItems.map((item, i) => {
              if (item.type === 'internal') {
                return (
                  <button 
                    key={i} 
                    onClick={() => onNavigate(item.step!)}
                    className="flex items-center justify-between p-6 bg-white border border-zinc-100 rounded-3xl active:bg-zinc-50 transition-colors group no-underline text-left w-full"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-zinc-50 rounded-xl text-zinc-400 group-hover:text-amber-600 transition-colors">
                        <i className={`fas ${item.icon}`}></i>
                      </div>
                      <div className="text-left">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-900">{item.label}</h4>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase">{item.sub}</p>
                      </div>
                    </div>
                    <i className="fas fa-chevron-right text-[9px] text-zinc-200 group-hover:text-zinc-400 transition-colors"></i>
                  </button>
                );
              }
              return (
                <a 
                  key={i} 
                  href={item.url}
                  target={item.url?.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-6 bg-white border border-zinc-100 rounded-3xl active:bg-zinc-50 transition-colors group no-underline"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-zinc-50 rounded-xl text-zinc-400 group-hover:text-amber-600 transition-colors">
                      <i className={`fas ${item.icon}`}></i>
                    </div>
                    <div className="text-left">
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-900">{item.label}</h4>
                      <p className="text-[8px] text-zinc-400 font-bold uppercase">{item.sub}</p>
                    </div>
                  </div>
                  <i className="fas fa-external-link-alt text-[9px] text-zinc-200 group-hover:text-zinc-400 transition-colors"></i>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (activeSubView === 'privacy') return <div className="px-6 pb-24">{renderPrivacy()}</div>;
  if (activeSubView === 'notifications') return <div className="px-6 pb-24">{renderNotifications()}</div>;
  if (activeSubView === 'help') return <div className="px-6 pb-24">{renderHelp()}</div>;

  return (
    <div className="px-6 py-8 animate-fade-in space-y-8 pb-24">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div 
            className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden cursor-pointer active:scale-95 transition-transform"
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
            className="absolute bottom-0 right-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md active:scale-90 transition-transform"
          >
            <i className="fas fa-camera text-[10px]"></i>
          </button>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900">
            {user.isLoggedIn ? user.name : "Guest Profile"}
          </h2>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            {user.isLoggedIn ? user.email : "Sign in to save your audit progress"}
          </p>
        </div>
      </div>

      {/* Signature Section */}
      <div className="bg-zinc-50 rounded-[2rem] p-6 border border-zinc-100 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Personal Signature</span>
          {!isEditingSignature && (
            <button onClick={() => setIsEditingSignature(true)} className="text-[8px] font-black text-amber-600 uppercase tracking-widest underline decoration-2 underline-offset-4">
              Edit
            </button>
          )}
        </div>
        {isEditingSignature ? (
          <div className="space-y-3">
            <textarea
              value={tempSignature}
              onChange={(e) => setTempSignature(e.target.value)}
              placeholder="What's your visa goal?"
              className="w-full bg-white border border-zinc-200 rounded-xl p-4 text-xs font-medium italic outline-none focus:ring-2 focus:ring-amber-500"
              rows={2}
            />
            <div className="flex gap-2">
              <button onClick={handleSaveSignature} className="flex-1 py-2 bg-zinc-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">Save</button>
              <button onClick={() => setIsEditingSignature(false)} className="flex-1 py-2 border border-zinc-200 text-zinc-400 rounded-lg text-[9px] font-black uppercase tracking-widest">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="text-zinc-600 italic font-medium text-xs leading-relaxed">
            {user.signature || "Set a signature to personalize your GTV roadmap..."}
          </p>
        )}
      </div>

      {/* Quick Login Section */}
      {!user.isLoggedIn && (
        <div className="space-y-4">
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block text-center mb-6">Quick Login Options</span>
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => onLogin('apple')}
              className="w-full flex items-center justify-between px-6 py-4 bg-zinc-900 text-white rounded-2xl shadow-lg active:scale-95 transition-all"
            >
              <div className="flex items-center gap-4">
                <i className="fa-brands fa-apple text-lg"></i>
                <span className="text-[11px] font-black uppercase tracking-widest italic">Continue with Apple</span>
              </div>
              <i className="fas fa-chevron-right text-[10px] opacity-30"></i>
            </button>

            <button 
              onClick={() => onLogin('google')}
              className="w-full flex items-center justify-between px-6 py-4 bg-white border border-zinc-100 text-zinc-900 rounded-2xl shadow-sm active:scale-95 transition-all"
            >
              <div className="flex items-center gap-4">
                <i className="fa-brands fa-google text-amber-600"></i>
                <span className="text-[11px] font-black uppercase tracking-widest italic">Continue with Google</span>
              </div>
              <i className="fas fa-chevron-right text-[10px] opacity-10"></i>
            </button>

            <button 
              onClick={() => onLogin('phone')}
              className="w-full flex items-center justify-between px-6 py-4 bg-zinc-50 border border-zinc-100 text-zinc-600 rounded-2xl active:scale-95 transition-all"
            >
              <div className="flex items-center gap-4">
                <i className="fas fa-phone text-sm"></i>
                <span className="text-[11px] font-black uppercase tracking-widest italic">One-click Phone/Email</span>
              </div>
              <i className="fas fa-bolt text-[10px] text-amber-500"></i>
            </button>
          </div>
        </div>
      )}

      {/* Profile Settings List */}
      <div className="space-y-3 pt-4">
        {[
          { id: 'privacy', icon: 'fa-shield-halved', label: 'Privacy & Security' },
          { id: 'notifications', icon: 'fa-bell', label: 'Notification Settings' },
          { id: 'help', icon: 'fa-circle-info', label: 'Help & Support' }
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => setActiveSubView(item.id as SubView)}
            className="w-full flex items-center justify-between px-6 py-5 bg-white border border-zinc-50 rounded-2xl hover:bg-zinc-50 transition-colors active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <i className={`fas ${item.icon} text-zinc-300`}></i>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700 italic">{item.label}</span>
            </div>
            <i className="fas fa-chevron-right text-[8px] text-zinc-200"></i>
          </button>
        ))}
      </div>

      {user.isLoggedIn && (
        <button 
          onClick={() => onUpdate({ isLoggedIn: false })}
          className="w-full py-5 text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition-colors"
        >
          Sign Out
        </button>
      )}
    </div>
  );
};

export default ProfileScreen;