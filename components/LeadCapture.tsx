
import React, { useState } from 'react';

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
    
    // Simulate API call
    setTimeout(() => {
      // Store in localStorage as a backup lead capture method for the owner
      const existingLeads = JSON.parse(localStorage.getItem('gtv_newsletter_leads') || '[]');
      localStorage.setItem('gtv_newsletter_leads', JSON.stringify([...existingLeads, { email, date: new Date().toISOString() }]));
      
      setStatus('success');
    }, 1500);
  };

  if (status === 'success') {
    return (
      <section className="py-24 px-6 text-center bg-white animate-fade-in">
        <div className="max-w-2xl mx-auto space-y-6 bg-zinc-50 p-12 rounded-[3rem] border border-zinc-100">
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-green-100">
            <i className="fas fa-check"></i>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">You're on the list!</h2>
          <p className="text-zinc-500 font-medium italic">We've sent the 2025 GTV Checklist to <span className="text-zinc-900 font-bold">{email}</span>. Check your inbox soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 text-center bg-white">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="space-y-4">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic">Get the GTV 2025 Checklist</h2>
          <p className="text-zinc-500 font-medium italic">Join 5,000+ applicants receiving our weekly insights on endorsement trends and App early-access.</p>
        </div>
        
        <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <input 
              type="email" 
              placeholder="Your professional email" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              required
              className={`w-full bg-zinc-50 border ${status === 'error' ? 'border-red-300' : 'border-zinc-100'} rounded-2xl px-6 py-4 outline-none focus:ring-1 focus:ring-amber-500 font-medium transition-all`} 
            />
            {status === 'error' && (
              <p className="absolute -bottom-6 left-2 text-[10px] text-red-500 font-bold uppercase tracking-widest">Please enter a valid email</p>
            )}
          </div>
          <button 
            type="submit"
            disabled={status === 'loading'}
            className="bg-zinc-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all active:scale-95 disabled:bg-zinc-400 min-w-[160px]"
          >
            {status === 'loading' ? (
              <i className="fas fa-circle-notch animate-spin"></i>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
        <p className="text-[9px] text-zinc-300 font-bold uppercase tracking-[0.2em]">Join the elite global talent community. Zero spam.</p>
      </div>
    </section>
  );
};

export default LeadCapture;
