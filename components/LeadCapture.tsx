
import React, { useState } from 'react';
import { saveLead } from '../supabaseService.ts';

const LeadCapture: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    
    try {
      // 1. 保存至 Supabase
      await saveLead(email);
      
      // 2. 依然保留 LocalStorage 作为本地冗余
      const existingLeads = JSON.parse(localStorage.getItem('gtv_newsletter_leads') || '[]');
      localStorage.setItem('gtv_newsletter_leads', JSON.stringify([...existingLeads, { email, date: new Date().toISOString() }]));
      
      setStatus('success');
    } catch (err) {
      console.error("Subscription Error:", err);
      // 如果 Supabase 暂时不可用，我们依然在本地记录以防丢失客户
      const existingLeads = JSON.parse(localStorage.getItem('gtv_newsletter_leads') || '[]');
      localStorage.setItem('gtv_newsletter_leads', JSON.stringify([...existingLeads, { email, date: new Date().toISOString() }]));
      setStatus('success'); // 依然向用户显示成功，确保体验
    }
  };

  if (status === 'success') {
    return (
      <section className="py-24 px-6 text-center bg-white animate-fade-in">
        <div className="max-w-2xl mx-auto space-y-6 bg-zinc-50 p-12 rounded-[3.5rem] border border-zinc-100 shadow-sm">
          <div className="w-20 h-20 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-6 shadow-xl ring-8 ring-zinc-50">
            <i className="fas fa-check"></i>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic text-zinc-900">Priority List Confirmed</h2>
          <p className="text-zinc-500 font-medium italic max-w-sm mx-auto">The 2025 GTV Checklist is being processed for <span className="text-zinc-900 font-bold">{email}</span>. Expect delivery within 5 minutes.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 text-center bg-white">
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="space-y-4">
          <div className="inline-block px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest mb-4">
            Exclusive 2025 Guide
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-tight text-zinc-900">Secure the GTV <br/>Expert Checklist</h2>
          <p className="text-zinc-400 font-medium italic text-sm md:text-lg">Step-by-step roadmap to professional endorsement. Used by 5,000+ applicants.</p>
        </div>
        
        <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 p-2 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 shadow-inner">
          <div className="flex-grow relative">
            <input 
              type="email" 
              placeholder="Enter professional email" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              required
              className={`w-full bg-white border ${status === 'error' ? 'border-red-300' : 'border-transparent'} rounded-[2rem] px-8 py-5 outline-none focus:ring-1 focus:ring-amber-500 font-bold transition-all placeholder:text-zinc-300 text-zinc-800`} 
            />
            {status === 'error' && (
              <p className="absolute -bottom-10 left-6 text-[10px] text-red-500 font-black uppercase tracking-widest">Invalid email format</p>
            )}
          </div>
          <button 
            type="submit"
            disabled={status === 'loading'}
            className="bg-zinc-900 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-black transition-all active:scale-95 disabled:bg-zinc-400 min-w-[180px] shadow-xl"
          >
            {status === 'loading' ? (
              <i className="fas fa-circle-notch animate-spin"></i>
            ) : (
              'Send Checklist'
            )}
          </button>
        </form>
        <div className="flex items-center justify-center gap-6 opacity-30">
           <span className="text-[9px] font-black uppercase tracking-widest">No Spam</span>
           <span className="w-1 h-1 bg-zinc-400 rounded-full"></span>
           <span className="text-[9px] font-black uppercase tracking-widest">GDPR Compliant</span>
           <span className="w-1 h-1 bg-zinc-400 rounded-full"></span>
           <span className="text-[9px] font-black uppercase tracking-widest">2025 Ready</span>
        </div>
      </div>
    </section>
  );
};

export default LeadCapture;
