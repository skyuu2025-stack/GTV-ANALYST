import React, { useState, useEffect } from 'react';
import { fetchAllLeads, fetchAllAssessments, supabase } from '../supabaseService.ts';
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
  onToggleDemoMode: (enabled: boolean) => void;
  isDemoMode: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onToggleDemoMode, isDemoMode }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leads' | 'assessments' | 'assets'>('leads');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const BUNDLE_ID = "com.gtvassessor.ai";
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
        
        const cloudLeads = (lRes.data || []).map(l => ({ ...l, source: 'cloud' as const }));
        const cloudAssessments = (aRes.data || []).map(a => ({ ...a, source: 'cloud' as const }));

        const leadMap = new Map();
        [...cloudLeads, ...localLeads].forEach(l => {
          if (!leadMap.has(l.email)) leadMap.set(l.email, l);
        });

        setLeads(Array.from(leadMap.values()));
        setAssessments([...cloudAssessments, ...localAssessments]);
      } else {
        setLeads(localLeads);
        setAssessments(localAssessments);
        setErrorMsg("Supabase Offline: Showing Local Storage only.");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setLeads(localLeads);
      setAssessments(localAssessments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isConnected]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied!`);
  };

  const setupReviewerMode = () => {
    const demoData = {
      name: "App Store Reviewer",
      email: "tester@apple.com",
      endorsementRoute: "Digital Technology (Technical)",
      jobTitle: "Senior Solutions Architect",
      yearsOfExperience: "10+ years (Leader)",
      personalStatement: "Led international teams in developing distributed systems. Published patents. Speaking at global summits.",
      hasEvidence: true
    };
    localStorage.setItem('gtv_autofill', JSON.stringify(demoData));
    onToggleDemoMode(true);
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[120] bg-white overflow-y-auto safe-top safe-bottom p-6 animate-scale-up">
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-8 sticky top-0 bg-white z-20">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-zinc-900">Cloud Command</h2>
            <div className="flex items-center gap-2 mt-1">
               <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
               <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                 {isConnected ? 'Database Connected' : 'Local Only'}
               </p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors shadow-lg">
             <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Technical Health Alert Section */}
        <div className="bg-red-50 border border-red-200 p-6 rounded-[2rem] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-[10px] animate-pulse">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <h3 className="text-red-900 font-black uppercase text-xs tracking-widest">Webhook Health Warning</h3>
          </div>
          <p className="text-red-800 text-[11px] italic leading-relaxed font-medium">
            Stripe has reported <span className="font-black">800+ failed delivery attempts</span> to your root URL endpoint (https://gtvassessor.com). 
            As this is a serverless frontend application, <span className="font-black">you must remove the Webhook endpoint</span> from your Stripe Dashboard 
            (Developers > Webhooks) to prevent account flags and stop delivery failure emails. 
            The app uses a client-side verification flow and does not require active webhooks.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 p-2 bg-zinc-50 rounded-3xl w-fit">
          <button onClick={() => setActiveTab('leads')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-400'}`}>Leads ({leads.length})</button>
          <button onClick={() => setActiveTab('assessments')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'assessments' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-400'}`}>Records ({assessments.length})</button>
          <button onClick={() => setActiveTab('assets')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'assets' ? 'bg-[#D4AF37] text-white shadow-xl' : 'text-zinc-400'}`}><i className="fas fa-rocket mr-2"></i> Assets</button>
        </div>

        {activeTab === 'assets' ? (
          <div className="space-y-8 animate-fade-in">
             <div className="bg-zinc-900 text-white p-10 rounded-[3rem] border border-zinc-800">
                <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
                   <div className="space-y-4">
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter text-[#D4AF37]">Apple Store Config</h3>
                      <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 w-fit">
                         <div className="space-y-0.5">
                           <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Bundle ID</p>
                           <p className="text-xs font-bold font-mono text-zinc-200">{BUNDLE_ID}</p>
                         </div>
                         <button onClick={() => copyToClipboard(BUNDLE_ID, "Bundle ID")} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10"><i className="fas fa-copy text-xs"></i></button>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <button onClick={setupReviewerMode} className="px-6 py-3 bg-green-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Reviewer Auto-Fill</button>
                      <button onClick={() => onToggleDemoMode(!isDemoMode)} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isDemoMode ? 'bg-[#D4AF37] text-white' : 'bg-zinc-800 text-zinc-400'}`}>Demo Mode</button>
                   </div>
                </div>
             </div>
             <AssetGenerator />
          </div>
        ) : (
           <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-sm space-y-8">
             {errorMsg && (
               <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl text-[10px] font-bold uppercase border border-amber-100">
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
                   <div className="flex items-center gap-4">
                     {'score' in item && <span className="px-3 py-1 bg-white rounded-lg text-amber-600 font-black text-xs border border-zinc-100">{item.score}%</span>}
                     <span className="text-[8px] font-black text-zinc-300 uppercase">{item.source}</span>
                   </div>
                 </div>
               ))}
               {(activeTab === 'leads' ? leads : assessments).length === 0 && !loading && (
                  <div className="text-center py-20 opacity-20 italic text-sm">No data synchronized.</div>
               )}
             </div>
           </div>
        )}

        <button onClick={onClose} className="w-full py-6 bg-zinc-900 text-white font-black rounded-3xl uppercase tracking-widest text-xs shadow-2xl">Return</button>
      </div>
    </div>
  );
};

export default AdminDashboard;