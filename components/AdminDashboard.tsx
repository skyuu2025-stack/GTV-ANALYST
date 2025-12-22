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

  // Toggle visual guide for screenshots
  const toggleGuide = (type: '16pm' | '14p') => {
    const target = showGuides === type ? 'none' : type;
    setShowGuides(target);
    if (target !== 'none') {
        onClose(); // Close dashboard to let user see the app with guide
        alert(`Screenshot Guide Active. Use browser F12 (Mobile View) and set resolution to ${type === '16pm' ? '1290x2796' : '1284x2778'}`);
    }
  };

  return (
    <>
      {/* Global Screenshot Guides (Visible when Dashboard is closed but guide is active) */}
      {showGuides !== 'none' && (
        <div 
          className="fixed inset-0 z-[9999] pointer-events-none border-[20px] border-amber-500/30 flex items-center justify-center animate-fade-in"
          onClick={() => setShowGuides('none')}
        >
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl pointer-events-auto cursor-pointer">
            Guide: {showGuides === '16pm' ? 'iPhone 16 Pro Max (1290x2796)' : 'iPhone 14 Plus (1284x2778)'} | Click to Exit
          </div>
          {/* Safe area guides */}
          <div className="w-full h-full border-x-[50px] border-black/5 opacity-50"></div>
        </div>
      )}

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
               <button onClick={onClose} className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors shadow-lg">
                  <i className="fas fa-times"></i>
               </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 p-2 bg-zinc-50 rounded-3xl w-fit">
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
            <button 
              onClick={() => setActiveTab('assets')}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'assets' ? 'bg-[#D4AF37] text-white shadow-xl' : 'text-zinc-400'}`}
            >
              <i className="fas fa-rocket mr-2"></i> App Store Assets
            </button>
          </div>

          {activeTab === 'assets' ? (
            <div className="space-y-8 animate-fade-in">
               <div className="bg-zinc-900 text-white p-10 rounded-[3rem] border border-zinc-800">
                  <div className="flex justify-between items-start mb-10">
                     <div className="space-y-2">
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">Screenshot Mode</h3>
                        <p className="text-zinc-500 text-xs font-medium max-w-md">Bypass AI calls and inject perfect data for your App Store screenshots.</p>
                     </div>
                     <button 
                        onClick={() => onToggleDemoMode(!isDemoMode)}
                        className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isDemoMode ? 'bg-green-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                     >
                        {isDemoMode ? 'Demo ON' : 'Demo OFF'}
                     </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <button 
                       onClick={() => toggleGuide('16pm')}
                       className="p-6 bg-zinc-800 rounded-2xl text-left hover:bg-zinc-700 transition-colors border border-zinc-700 group"
                     >
                        <i className="fas fa-mobile-screen-button text-amber-500 mb-4 block text-xl"></i>
                        <h4 className="font-black uppercase tracking-widest text-[10px]">6.9" iPhone Guide</h4>
                        <p className="text-zinc-500 text-[9px] font-bold mt-1">FOR 1290 x 2796 PX</p>
                     </button>
                     <button 
                       onClick={() => toggleGuide('14p')}
                       className="p-6 bg-zinc-800 rounded-2xl text-left hover:bg-zinc-700 transition-colors border border-zinc-700 group"
                     >
                        <i className="fas fa-mobile-screen-button text-amber-500 mb-4 block text-xl"></i>
                        <h4 className="font-black uppercase tracking-widest text-[10px]">6.7" iPhone Guide</h4>
                        <p className="text-zinc-500 text-[9px] font-bold mt-1">FOR 1284 x 2778 PX</p>
                     </button>
                  </div>
               </div>
               
               <AssetGenerator />
            </div>
          ) : loading ? (
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
    </>
  );
};

export default AdminDashboard;