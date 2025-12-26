
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
    
    // Load local redundant data first
    const localLeads: Lead[] = JSON.parse(localStorage.getItem('gtv_newsletter_leads') || '[]').map((l: any, i: number) => ({
      id: `local-lead-${i}`,
      email: l.email,
      created_at: l.date || new Date().toISOString(),
      source: 'local' as const
    }));

    try {
      if (supabase) {
        const [lRes, aRes] = await Promise.all([
          fetchAllLeads(),
          fetchAllAssessments()
        ]);
        setLeads((lRes.data || []).map(l => ({ ...l, source: 'cloud' as const })));
        setAssessments((aRes.data || []).map(a => ({ ...a, source: 'cloud' as const })));
      } else {
        setLeads(localLeads);
        setErrorMsg("Supabase Offline: System configuration is incomplete.");
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
    <div className="space-y-10 animate-fade-in pb-10">
      <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">System Configuration</h3>
          <div className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${envStatus.initialized ? 'bg-green-500 text-white' : 'bg-red-500 text-white animate-pulse'}`}>
            {envStatus.initialized ? 'Online' : 'Config Error'}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 font-black uppercase">SUPABASE_URL</span>
              <span className={`text-[10px] font-black uppercase ${envStatus.hasUrl ? 'text-green-400' : 'text-red-400'}`}>
                {envStatus.hasUrl ? 'Found' : 'Missing'}
              </span>
            </div>
            {envStatus.hasUrl && <code className="text-[10px] text-zinc-400 font-mono truncate">{envStatus.urlValue}</code>}
          </div>
          
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 font-black uppercase">SUPABASE_ANON_KEY</span>
              <span className={`text-[10px] font-black uppercase ${envStatus.hasKey ? 'text-green-400' : 'text-red-400'}`}>
                {envStatus.hasKey ? 'Found' : 'Missing'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-4">
           <h4 className="text-amber-400 font-black text-xs uppercase italic tracking-tight">Fixing Redirect Issues (Localhost Error)</h4>
           <ol className="text-zinc-400 text-[10px] italic leading-relaxed space-y-3 list-decimal pl-4 font-medium">
             <li>Go to Supabase Dashboard -> Authentication -> URL Configuration</li>
             <li>Add <span className="text-white">{window.location.origin}/</span> to the <span className="text-white">Redirect Allow List</span>.</li>
             <li>Ensure <span className="text-white">Site URL</span> is set to your production domain, not localhost.</li>
           </ol>
        </div>

        {!envStatus.initialized && (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl space-y-4">
            <h4 className="text-red-400 font-black text-xs uppercase italic tracking-tight">Configuration Guide</h4>
            <ol className="text-zinc-400 text-[10px] italic leading-relaxed space-y-3 list-decimal pl-4 font-medium">
              <li>Add <span className="text-white">SUPABASE_URL</span> and <span className="text-white">SUPABASE_ANON_KEY</span> to your deployment environment variables.</li>
              <li>Re-deploy the application to ensure variables are injected into the runtime.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[120] bg-white overflow-y-auto safe-top safe-bottom p-6 animate-scale-up">
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-8 sticky top-0 bg-white z-20">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic text-zinc-900">Admin Console</h2>
          <button onClick={onClose} className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:bg-black transition-all shadow-xl">
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
             {errorMsg && (
               <div className="p-5 bg-amber-50 text-amber-600 rounded-2xl text-[10px] font-black uppercase border border-amber-100 text-center animate-shake">
                  <i className="fas fa-exclamation-triangle mr-2"></i> {errorMsg}
               </div>
             )}
             
             {loading ? (
               <div className="py-20 flex flex-col items-center gap-4">
                 <div className="w-10 h-10 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Fetching Cloud Data...</p>
               </div>
             ) : (
               <div className="grid gap-3">
                 {(activeTab === 'leads' ? leads : assessments).map((item: any) => (
                   <div key={item.id} className="p-5 bg-zinc-50 rounded-2xl flex justify-between items-center group hover:bg-zinc-100 transition-all border border-transparent hover:border-zinc-200">
                     <div className="flex items-center gap-4">
                       <span className={`w-2.5 h-2.5 rounded-full ${item.source === 'local' ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'}`}></span>
                       <div>
                         <span className="font-black text-sm text-zinc-900">{item.email}</span>
                         <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                           {item.source === 'local' ? 'Stored Locally Only' : `Synced Cloud ID: ${item.id}`}
                         </p>
                       </div>
                     </div>
                     <span className="text-[9px] font-black text-zinc-300 uppercase tracking-tighter">
                       {new Date(item.created_at).toLocaleDateString()}
                     </span>
                   </div>
                 ))}
                 
                 {(activeTab === 'leads' ? leads : assessments).length === 0 && (
                   <div className="py-20 text-center space-y-4">
                      <i className="fas fa-folder-open text-zinc-100 text-5xl"></i>
                      <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">No records found</p>
                   </div>
                 )}
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
