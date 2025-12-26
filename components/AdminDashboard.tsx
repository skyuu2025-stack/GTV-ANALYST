
import React, { useState, useEffect } from 'react';
import { fetchAllLeads, fetchAllAssessments, supabase, getEnvStatus } from '../supabaseService.ts';
import AssetGenerator from './AssetGenerator.tsx';

interface Lead {
  id: string | number;
  email: string;
  created_at: string;
  source?: 'cloud' | 'local';
}

interface AssessmentRecord {
  id: string | number;
  name: string;
  email: string;
  route: string;
  score: number;
  created_at: string;
  source?: 'cloud' | 'local';
}

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leads' | 'assessments' | 'assets' | 'config'>('leads');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const envStatus = getEnvStatus();

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (supabase) {
        const [lRes, aRes] = await Promise.all([
          fetchAllLeads(),
          fetchAllAssessments()
        ]);
        setLeads((lRes.data || []).map(l => ({ ...l, source: 'cloud' as const })));
        setAssessments((aRes.data || []).map(a => ({ ...a, source: 'cloud' as const })));
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderConfigGuide = () => (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 space-y-6">
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">System Diagnostic</h3>
        
        <div className="grid gap-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
            <span className="text-[10px] text-zinc-500 font-black uppercase">Supabase Connection</span>
            <span className={`text-[10px] font-black uppercase ${envStatus.initialized ? 'text-green-400' : 'text-red-400'}`}>
              {envStatus.initialized ? 'Online' : 'Disconnected'}
            </span>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
             <span className="text-[10px] text-zinc-500 font-black uppercase block">Supabase Endpoint</span>
             <code className="text-white text-[10px] font-mono break-all">{envStatus.urlValue}</code>
          </div>
        </div>

        <div className="p-6 bg-zinc-800 rounded-2xl space-y-4">
           <h4 className="text-white font-black text-xs uppercase italic tracking-tight">Redirect Policy</h4>
           <p className="text-zinc-400 text-[10px] italic">Authorized Origin: <span className="text-white select-all">{window.location.origin}</span></p>
           <p className="text-zinc-500 text-[8px]">Ensure this origin is added to your Supabase Auth Redirect Allow List.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[120] bg-white overflow-y-auto safe-top safe-bottom p-6 animate-scale-up">
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-8 sticky top-0 bg-white z-20">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic text-zinc-900">Admin Console</h2>
          <button onClick={onClose} className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center shadow-xl">
             <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="flex flex-wrap gap-3 p-1.5 bg-zinc-50 rounded-[2rem] w-fit">
          <button onClick={() => setActiveTab('leads')} className={`px-10 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-400'}`}>Leads ({leads.length})</button>
          <button onClick={() => setActiveTab('assessments')} className={`px-10 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'assessments' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-400'}`}>Audits ({assessments.length})</button>
          <button onClick={() => setActiveTab('assets')} className={`px-10 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'assets' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-400'}`}>Assets</button>
          <button onClick={() => setActiveTab('config')} className={`px-10 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'config' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-400'}`}>System</button>
        </div>

        {activeTab === 'config' ? renderConfigGuide() : activeTab === 'assets' ? <AssetGenerator /> : (
          <div className="bg-white rounded-[3rem] p-8 border border-zinc-100 shadow-sm space-y-6">
             {loading ? (
               <div className="py-20 flex flex-col items-center gap-4">
                 <div className="w-10 h-10 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Fetching Data...</p>
               </div>
             ) : (
               <div className="grid gap-3">
                 {(activeTab === 'leads' ? leads : assessments).map((item: any) => (
                   <div key={item.id} className="p-5 bg-zinc-50 rounded-2xl flex justify-between items-center border border-transparent hover:border-zinc-200 transition-all">
                     <div>
                       <span className="font-black text-sm text-zinc-900">{item.email}</span>
                       <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">ID: {item.id}</p>
                     </div>
                     <span className="text-[9px] font-black text-zinc-300 uppercase tracking-tighter">
                       {new Date(item.created_at).toLocaleDateString()}
                     </span>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
