import React, { useState, useEffect } from 'react';
import { AnalysisResult, AssessmentData } from '../types.ts';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ResultsDashboardProps {
  result: AnalysisResult;
  data: AssessmentData;
  isPremium: boolean;
  onUpgrade: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, data, isPremium, onUpgrade }) => {
  const [deliveryStep, setDeliveryStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isPremium) {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 15;
        if (currentProgress < 33) setDeliveryStep(1); 
        else if (currentProgress < 66) setDeliveryStep(2); 
        else if (currentProgress < 95) setDeliveryStep(3); 
        if (currentProgress >= 100) {
          currentProgress = 100;
          setIsDone(true);
          setDeliveryStep(4); 
          clearInterval(interval);
        }
        setProgress(currentProgress);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isPremium]);

  if (!result || !data) return null;

  const chartData = [{ name: 'Prob', value: result.probabilityScore || 0, fill: '#D97706' }];
  const steps = ["Initializing...", "Confirming Payment...", "Generating Roadmap...", `Emailing to ${data.email}...`, "Delivered Successfully"];

  return (
    <div className="max-w-5xl mx-auto py-6 md:py-16 px-3 md:px-6 animate-fade-in">
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white !important; color: #111 !important; margin: 0; padding: 0; }
          .criteria-card { page-break-inside: avoid; margin-bottom: 20px; }
        }
      `}</style>

      {isPremium && (
        <div className={`mb-12 bg-white border border-zinc-100 p-6 md:p-10 rounded-[3rem] shadow-xl relative overflow-hidden transition-all duration-500 ${isDone ? 'ring-2 ring-green-500/20' : ''}`}>
          <div className="absolute top-0 left-0 h-1 bg-green-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-6 flex-1 w-full">
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl shadow-inner transition-all duration-700 ${isDone ? 'bg-green-600 text-white shadow-green-200' : 'bg-zinc-50 text-amber-500 animate-pulse'}`}>
                <i className={`fas ${isDone ? 'fa-check' : 'fa-satellite-dish'}`}></i>
              </div>
              <div className="flex-grow space-y-4">
                <div className="flex justify-between items-end">
                   <p className="font-black text-[11px] md:text-xs uppercase tracking-[0.2em] text-zinc-800">{steps[deliveryStep]}</p>
                   <span className="text-[10px] font-black text-zinc-400">{Math.round(progress)}%</span>
                </div>
                <div className="h-1 w-full bg-zinc-50 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-900 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => window.print()} 
              disabled={!isDone}
              className={`w-full md:w-auto px-12 py-5 font-black rounded-2xl uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl ${isDone ? 'bg-zinc-900 text-white hover:bg-black hover:-translate-y-1' : 'bg-zinc-100 text-zinc-300 cursor-not-allowed'}`}
            >
              <i className="fas fa-file-pdf"></i> Save Expert PDF
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-zinc-50 overflow-hidden relative">
        <div className="p-6 md:p-20">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24 gap-12">
            <div className="space-y-6 flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-5">
                <span className="w-12 h-[2px] bg-amber-500"></span>
                <span className="text-amber-500 font-black text-[10px] md:text-[12px] uppercase tracking-[0.4em]">Official Verdict</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif italic text-zinc-900 leading-[1.1] tracking-tighter">{data.name}</h1>
              <p className="text-zinc-400 text-lg md:text-2xl font-medium italic opacity-80">{data.endorsementRoute}</p>
            </div>
            <div className="w-64 h-64 md:w-72 md:h-72 relative bg-zinc-50 rounded-[4rem] flex items-center justify-center shadow-inner">
               <div className="absolute inset-0 p-5">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart innerRadius="88%" outerRadius="100%" data={chartData} startAngle={90} endAngle={450}>
                      <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                      <RadialBar background dataKey="value" cornerRadius={30} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="text-center">
                <span className="text-5xl md:text-6xl font-black block text-zinc-900">{result.probabilityScore}%</span>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest opacity-60">Success Rate</span>
              </div>
            </div>
          </div>

          <div className="p-10 md:p-16 bg-zinc-50 rounded-[3rem] border border-zinc-100 mb-20 shadow-inner relative overflow-hidden">
            <span className="text-[11px] font-black text-amber-600 uppercase tracking-[0.4em] mb-6 block">Professional Summary</span>
            <p className="text-2xl md:text-3xl text-zinc-800 leading-[1.6] font-serif italic relative z-10">"{result.summary}"</p>
          </div>

          {!isPremium ? (
            <div className="bg-zinc-900 p-10 md:p-20 rounded-[4rem] text-center text-white space-y-12 shadow-2xl print:hidden border border-zinc-800">
              <div className="w-24 h-24 bg-amber-600/10 border border-amber-600/20 rounded-full flex items-center justify-center text-amber-600 text-4xl mx-auto shadow-inner animate-pulse"><i className="fas fa-lock"></i></div>
              <div className="space-y-6">
                <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Premium Audit Locked</h3>
                <p className="text-zinc-400 text-base md:text-xl max-w-2xl mx-auto font-light italic leading-relaxed">Specific evidence gaps identified. Unlock full mapping and tactical roadmap.</p>
              </div>
              <button onClick={onUpgrade} className="px-14 py-7 bg-amber-600 text-white font-black rounded-3xl uppercase tracking-widest text-base hover:bg-amber-500 transition-all shadow-[0_25px_60px_rgba(217,119,6,0.35)] active:scale-95">Upgrade Report for $19</button>
            </div>
          ) : (
            <div className="space-y-32">
               <section>
                <div className="flex items-center gap-6 mb-12">
                  <div className="w-2.5 h-12 bg-amber-500 rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-black text-zinc-900 uppercase tracking-tighter italic">Criteria Mapping</h2>
                </div>
                <div className="grid gap-10">
                  {[...result.mandatoryCriteria, ...result.optionalCriteria].map((c, i) => (
                    <div key={i} className="criteria-card p-10 bg-[#FCFCFC] rounded-[3.5rem] border border-zinc-100 group">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div className="space-y-2">
                           <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Mapping Standard {i+1}</span>
                           <h4 className="font-black text-zinc-900 uppercase tracking-tight text-xl md:text-2xl italic group-hover:text-amber-600 transition-colors">{c.title}</h4>
                        </div>
                        <span className={`px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${c.met ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {c.met ? 'Evidence Strong' : 'Gap Found'}
                        </span>
                      </div>
                      <p className="text-zinc-500 italic font-medium leading-[1.9] text-base md:text-xl border-t border-zinc-100 pt-10">"{c.reasoning}"</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-zinc-900 p-12 md:p-24 rounded-[4.5rem] text-white border border-zinc-800">
                <h2 className="text-3xl md:text-4xl font-black mb-20 uppercase tracking-tighter italic text-amber-500">
                  <i className="fas fa-chess-knight mr-4"></i> Tactical Roadmap
                </h2>
                <div className="space-y-20">
                  {result.recommendations?.map((rec, i) => (
                    <div key={i} className="flex gap-10 items-start pb-16 border-b border-zinc-800 last:border-0">
                      <span className="text-amber-500 font-serif italic text-5xl md:text-8xl opacity-80 leading-none">{i+1}</span>
                      <p className="text-lg md:text-2xl text-zinc-300 leading-relaxed italic font-light tracking-wide pt-4">{rec}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;