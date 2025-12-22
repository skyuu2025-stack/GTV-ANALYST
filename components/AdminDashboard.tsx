import React, { useState, useEffect } from 'react';
import { fetchAllLeads, fetchAllAssessments, supabase, getEnvStatus } from '../supabaseService.ts';

interface Lead {
  id: number;
  email: string;
  created_at: string;
}

interface AssessmentRecord {
  id: number;
  name: string;
  email: string;
  route: string;
  score: number;
  created_at: string;
}

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leads' | 'assessments'>('leads');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const envStatus = getEnvStatus();
  const isConnected = !!supabase;

  const loadData = async () => {
    if (!isConnected) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const [lRes, aRes] = await Promise.all([
        fetchAllLeads(),
        fetchAllAssessments()
      ]);
      
      if (lRes.error || aRes.error) {
        setErrorMsg(lRes.error || aRes.error);
      }
      
      setLeads(lRes.data);
      setAssessments(aRes.data);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isConnected]);

  const copyEmails = () => {
    const list = activeTab === 'leads' ? leads : assessments;
    if (!list.length) return;
    const text = list.map(l => l.email).join('\n');
    navigator.clipboard.writeText(text);
    alert("Email list copied!");
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto safe-top safe-bottom p-6 animate-scale-up">
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-8 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Cloud Command</h2>
            <div className="flex items-center gap-2 mt-1">
               <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
               <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                 {isConnected ? 'Supabase Database Connected' : 'Database Offline'}
               </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={loadData}
                disabled={loading || !isConnected}
                className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-all active:scale-90 disabled:opacity-30"
                title="Refresh Data"
              >
                <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
             </button>
             <button onClick={onClose} className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors shadow-lg">
                <i className="fas fa-times"></i>
             </button>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex flex-col gap-3">
             <div className="flex items-center gap-3 text-red-600">
                <i className="fas fa-bug"></i>
                <h4 className="font-black uppercase text-xs tracking-widest">Database Fetch Error</h4>
             </div>
             <p className="text-xs text-red-500 font-medium">"{errorMsg}"</p>
             <p className="text-[10px] text-red-400 leading-relaxed italic">
                * Note: If data exists but you see 0 records, ensure you have disabled RLS (Row Level Security) or added a SELECT policy for 'anon' role in your Supabase dashboard.
             </p>
          </div>
        )}

        <div className="flex gap-4 p-2 bg-zinc-50 rounded-3xl w-fit">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-400'}`}
          >
            Leads ({leads.length})
          </button>
          <button 
            onClick={() => setActiveTab('assessments')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'assessments' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-400'}`}
          >
            Assessments ({assessments.length})
          </button>
        </div>

        {loading ? (
          <div className="py-40 text-center flex flex-col items-center gap-6">
            <div className="w-12 h-12 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">Synchronizing Live Data...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-xl uppercase tracking-tighter italic">
                {activeTab === 'leads' ? 'Subscriber Base' : 'Evaluation History'}
              </h3>
              <button 
                onClick={copyEmails} 
                disabled={leads.length === 0 && assessments.length === 0}
                className="px-6 py-3 bg-zinc-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-20"
              >
                Export Emails
              </button>
            </div>

            {activeTab === 'leads' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="flex justify-between items-center p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100">
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-800 text-sm">{lead.email}</span>
                      <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mt-1">
                        Captured: {new Date(lead.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {assessments.map((a) => (
                  <div key={a.id} className="flex flex-col md:flex-row justify-between md:items-center p-8 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                         <span className="font-black text-zinc-900 uppercase tracking-tight italic text-lg">{a.name}</span>
                         <span className="px-3 py-1 bg-white border border-zinc-200 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-400">{a.route}</span>
                      </div>
                      <p className="text-zinc-500 text-sm italic font-medium">{a.email}</p>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <span className="text-2xl font-black text-amber-600 block">{a.score}%</span>
                        <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">Score</span>
                      </div>
                      <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">
                        {new Date(a.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(activeTab === 'leads' ? leads.length : assessments.length) === 0 && (
              <div className="py-24 text-center opacity-40">
                <i className="fas fa-ghost text-5xl mb-4 text-zinc-200"></i>
                <p className="font-black uppercase tracking-[0.4em] text-xs">Waiting for your first conversion</p>
                <button onClick={loadData} className="mt-6 text-[9px] font-black uppercase tracking-widest underline underline-offset-4">Try Force Refresh</button>
              </div>
            )}
          </div>
        )}

        <button 
          onClick={onClose}
          className="w-full py-6 bg-zinc-900 text-white font-black rounded-3xl uppercase tracking-widest text-xs shadow-2xl hover:-translate-y-1 transition-all active:scale-95"
        >
          Close Terminal
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;