
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
  const isConnected = !!supabase;

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    
    const localLeads: Lead[] = JSON.parse(localStorage.getItem('gtv_newsletter_leads') || '[]').map((l: any, i: number) => ({
      id: `local-lead-${i}`,
      email: l.email,
      created_at: l.date || new Date().toISOString(),
      source: 'local' as const
    }));

    const localAssessments: AssessmentRecord[] = [];
    try {
      const savedData = localStorage.getItem('gtv_assessment_data');
      const savedResult = localStorage.getItem('gtv_analysis_result');
      if (savedData && savedResult) {
        const d = JSON.parse(savedData);
        const r = JSON.parse(savedResult);
        localAssessments.push({
          id: 'local-session',
          name: d.name,
          email: d.email,
          route: d.endorsementRoute,
          score: r.probabilityScore,
          created_at: new Date().toISOString(),
          source: 'local' as const
        });
      }
    } catch (e) {
      console.warn("Failed to parse local assessment data", e);
    }

    try {
      if (isConnected) {
        const [lRes, aRes] = await Promise.all([
          fetchAllLeads(),
          fetchAllAssessments()
        ]);
        setLeads((lRes.data || []).map(l => ({ ...l, source: 'cloud' as const })));
        setAssessments([...(aRes.data || []).map(a => ({ ...a, source: 'cloud' as const })), ...localAssessments]);
      } else {
        setLeads(localLeads);
        setAssessments(localAssessments);
        setErrorMsg("Database Offline: Check Netlify Build Settings.");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isConnected]);

  const renderConfigGuide = () => (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Critical Step Warning */}
      <div className="bg-red-50 border-2 border-red-100 p-8 rounded-[2.5rem] space-y-4">
        <h3 className="text-red-900 font-black uppercase italic tracking-tighter flex items-center gap-3">
          <i className="fas fa-exclamation-triangle text-xl"></i>
          配置生效的关键最后一步
        </h3>
        <p className="text-red-700 text-xs font-bold leading-relaxed italic">
          如果您已经在 Netlify 添加了变量但网页仍报错，请务必执行：<br/>
          <span className="text-red-900 underline">Netlify 控制台 -> Deploys -> Trigger deploy -> Clear cache and deploy site.</span><br/>
          前端变量是在打包时注入的，不重新部署代码永远不会生效。
        </p>
      </div>

      <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">部署状态自检</h3>
          <div className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {isConnected ? 'Connected' : 'Action Required'}
          </div>
        </div>

        <div className="grid gap-3">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-[10px] text-zinc-500 font-black uppercase">VITE_SUPABASE_URL</span>
              <span className={`text-[10px] font-black uppercase ${envStatus.hasUrl ? 'text-green-500' : 'text-red-500'}`}>
                {envStatus.hasUrl ? 'OK' : 'MISSING'}
              </span>
            </div>
          </div>
          
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-[10px] text-zinc-500 font-black uppercase">VITE_SUPABASE_ANON_KEY</span>
              <span className={`text-[10px] font-black uppercase ${envStatus.hasKey ? 'text-green-500' : 'text-red-500'}`}>
                {envStatus.hasKey ? 'OK' : 'MISSING'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[120] bg-white overflow-y-auto safe-top safe-bottom p-6 animate-scale-up">
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-8 sticky top-0 bg-white z-20">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic text-zinc-900">Cloud Command</h2>
          <button onClick={onClose} className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors shadow-lg">
             <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="flex flex-wrap gap-4 p-2 bg-zinc-50 rounded-3xl w-fit">
          <button onClick={() => setActiveTab('leads')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-400'}`}>Leads ({leads.length})</button>
          <button onClick={() => setActiveTab('assessments')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'assessments' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-400'}`}>Records ({assessments.length})</button>
          <button onClick={() => setActiveTab('config')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'config' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-400'}`}>System Config</button>
        </div>

        {activeTab === 'config' ? renderConfigGuide() : (
          <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-sm space-y-8">
             {errorMsg && (
               <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-bold uppercase border border-red-100 text-center animate-shake">
                  <i className="fas fa-exclamation-triangle mr-2"></i> {errorMsg}
               </div>
             )}
             <div className="grid gap-4">
               {(activeTab === 'leads' ? leads : assessments).map((item: any) => (
                 <div key={item.id} className="p-4 bg-zinc-50 rounded-2xl flex justify-between items-center group hover:bg-zinc-100 transition-colors">
                   <div className="flex items-center gap-3">
                     <span className={`w-2 h-2 rounded-full ${item.source === 'local' ? 'bg-amber-400' : 'bg-blue-400'}`}></span>
                     <span className="font-bold text-sm text-zinc-700">{item.email}</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
