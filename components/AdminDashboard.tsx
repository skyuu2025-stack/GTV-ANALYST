import React, { useState, useEffect } from 'react';
import { fetchAllLeads, fetchAllAssessments, supabase, getEnvStatus } from '../supabaseService.ts';
import AssetGenerator from './AssetGenerator.tsx';

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
  onToggleDemoMode: (enabled: boolean) => void;
  isDemoMode: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onToggleDemoMode, isDemoMode }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leads' | 'assessments' | 'assets'>('leads');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showGuides, setShowGuides] = useState<'none' | '16pm' | '14p'>('none');
  
  const BUNDLE_ID = "com.gtvassessor.ai";
  const isConnected = !!supabase;

  const RLS_SQL = `-- STEP 1: Enable RLS on tables
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- STEP 2: Remove old policies if any
DROP POLICY IF EXISTS "Allow Public Insert" ON assessments;
DROP POLICY IF EXISTS "Allow Public Select" ON assessments;
DROP POLICY IF EXISTS "Allow Public Leads Insert" ON leads;
DROP POLICY IF EXISTS "Allow Public Leads Select" ON leads;

-- STEP 3: Create public access policies
CREATE POLICY "Allow Public Insert" ON assessments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Public Select" ON assessments FOR SELECT USING (true);
CREATE POLICY "Allow Public Leads Insert" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Public Leads Select" ON leads FOR SELECT USING (true);`;

  const loadData = async () => {
    if (!isConnected) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const [lRes, aRes] = await Promise.all([
        fetchAllLeads(),
        fetchAllAssessments()
      ]);
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied! Please paste it correctly.`);
  };

  const setupReviewerMode = () => {
    const demoData = {
      name: "App Store Reviewer",
      email: "tester@apple.com",
      endorsementRoute: "Digital Technology (Technical)",
      jobTitle: "Senior Solutions Architect",
      yearsOfExperience: "10+ years (Leader)",
      personalStatement: "Led international teams in developing distributed database systems. Published 3 patents in cloud computing. Speaking at AWS re:Invent and Google Cloud Next.",
      hasEvidence: true
    };
    localStorage.setItem('gtv_autofill', JSON.stringify(demoData));
    onToggleDemoMode(true);
    onClose();
    window.location.reload();
  };

  const toggleGuide = (type: '16pm' | '14p') => {
    const target = showGuides === type ? 'none' : type;
    setShowGuides(target);
    if (target !== 'none') {
        onClose(); 
        alert(`Screenshot Guide Active. Use browser F12 (Mobile View) and set resolution to ${type === '16pm' ? '1290x2796' : '1284x2778'}`);
    }
  };

  return (
    <>
      {showGuides !== 'none' && (
        <div className="fixed inset-0 z-[9999] pointer-events-none border-[20px] border-[#D4AF37]/30 flex items-center justify-center animate-fade-in" onClick={() => setShowGuides('none')}>
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl pointer-events-auto cursor-pointer">
            Guide Active | Click to Exit
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-[100] bg-white overflow-y-auto safe-top safe-bottom p-6 animate-scale-up">
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-8 sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic text-zinc-900">Cloud Command</h2>
              <div className="flex items-center gap-2 mt-1">
                 <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                   {isConnected ? 'Database Connected' : 'Database Offline'}
                 </p>
              </div>
            </div>
            <button onClick={onClose} className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors shadow-lg">
               <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="flex flex-wrap gap-4 p-2 bg-zinc-50 rounded-3xl w-fit">
            <button onClick={() => setActiveTab('leads')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-400'}`}>Leads</button>
            <button onClick={() => setActiveTab('assessments')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'assessments' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-400'}`}>Assessments</button>
            <button onClick={() => setActiveTab('assets')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'assets' ? 'bg-[#D4AF37] text-white shadow-xl' : 'text-zinc-400'}`}><i className="fas fa-rocket mr-2"></i> Assets</button>
          </div>

          {activeTab === 'assets' ? (
            <div className="space-y-8 animate-fade-in">
               <div className="bg-zinc-900 text-white p-10 rounded-[3rem] border border-zinc-800">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
                     <div className="space-y-4">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-[#D4AF37]">Apple Store Config</h3>
                          <p className="text-zinc-500 text-xs font-medium max-w-md italic">Use this for your App Store Connect submission.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 w-fit">
                           <div className="space-y-0.5">
                             <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Bundle Identifier</p>
                             <p className="text-xs font-bold font-mono text-zinc-200">{BUNDLE_ID}</p>
                           </div>
                           <button onClick={() => copyToClipboard(BUNDLE_ID, "Bundle ID")} className="w-10 h-10 bg-white/10 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center border border-white/10" title="Copy for Apple Console"><i className="fas fa-copy text-xs"></i></button>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <button onClick={setupReviewerMode} className="px-6 py-3 bg-green-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-xl">
                          Auto-Fill Reviewer Data
                        </button>
                        <button onClick={() => onToggleDemoMode(!isDemoMode)} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isDemoMode ? 'bg-[#D4AF37] text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                          {isDemoMode ? 'Sandbox Active' : 'Sandbox Ready'}
                        </button>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <button onClick={() => toggleGuide('16pm')} className="p-6 bg-zinc-800 rounded-2xl text-left hover:bg-zinc-700 transition-colors border border-zinc-700 group">
                        <i className="fas fa-camera-retro text-[#D4AF37] mb-4 block text-xl"></i>
                        <h4 className="font-black uppercase tracking-widest text-[10px]">6.9" Snapshot Mode</h4>
                        <p className="text-zinc-500 text-[9px] font-bold mt-1 uppercase">For App Store Connect</p>
                     </button>
                     <button onClick={() => toggleGuide('14p')} className="p-6 bg-zinc-800 rounded-2xl text-left hover:bg-zinc-700 transition-colors border border-zinc-700 group">
                        <i className="fas fa-camera-retro text-[#D4AF37] mb-4 block text-xl"></i>
                        <h4 className="font-black uppercase tracking-widest text-[10px]">6.7" Snapshot Mode</h4>
                        <p className="text-zinc-500 text-[9px] font-bold mt-1 uppercase">For App Store Connect</p>
                     </button>
                  </div>
               </div>

               <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-200 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs">
                      <i className="fas fa-terminal"></i>
                    </div>
                    <h4 className="font-black uppercase tracking-tighter italic text-amber-800">Supabase RLS Fixer (Run in SQL Editor)</h4>
                  </div>
                  <p className="text-amber-700/70 text-[11px] font-medium leading-relaxed">If your app says "row violates security policy", it means your database is locked. DO NOT run the bundle ID in SQL editor. Copy the script below instead.</p>
                  <button 
                    onClick={() => copyToClipboard(RLS_SQL, "Correct SQL Script")}
                    className="w-full py-5 bg-zinc-900 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
                  >
                    <i className="fas fa-copy"></i> Copy Database Fix Script
                  </button>
               </div>
               
               <AssetGenerator />
            </div>
          ) : (
             <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-sm space-y-8">
               <div className="flex justify-between items-center">
                <h3 className="font-black text-xl uppercase tracking-tighter italic text-zinc-900">{activeTab === 'leads' ? 'User Database' : 'Assessment History'}</h3>
                <button onClick={() => copyToClipboard((activeTab === 'leads' ? leads : assessments).map(l => l.email).join('\n'), "Export Data")} className="px-6 py-3 bg-zinc-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Export to CSV</button>
               </div>
               
               {errorMsg && (
                 <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-bold uppercase border border-red-100">
                    <i className="fas fa-exclamation-triangle mr-2"></i> Error: {errorMsg}
                 </div>
               )}

               <div className="grid gap-4">
                 {(activeTab === 'leads' ? leads : assessments).slice(0, 10).map((item: any) => (
                   <div key={item.id} className="p-4 bg-zinc-50 rounded-2xl flex justify-between items-center group hover:bg-zinc-100 transition-colors">
                     <span className="font-bold text-sm text-zinc-700">{item.email}</span>
                     {'score' in item && <span className="px-3 py-1 bg-white rounded-lg text-amber-600 font-black text-xs border border-zinc-100">{item.score}%</span>}
                   </div>
                 ))}
                 {(activeTab === 'leads' ? leads : assessments).length === 0 && !loading && (
                    <div className="text-center py-20 opacity-20 italic text-sm">No synchronized data found. Run SQL fix script.</div>
                 )}
               </div>
             </div>
          )}

          <button onClick={onClose} className="w-full py-6 bg-zinc-900 text-white font-black rounded-3xl uppercase tracking-widest text-xs shadow-2xl">Return to Terminal</button>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;