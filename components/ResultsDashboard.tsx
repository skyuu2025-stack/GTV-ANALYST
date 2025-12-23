
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
  const steps = ["Initializing...", "Confirming...", "Generating...", "Delivering...", "Success"];

  return (
    <div className="max-w-5xl mx-auto py-4 md:py-16 px-4 md:px-6 animate-fade-in">
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white !important; color: #111 !important; margin: 0; padding: 0; }
          .criteria-card { page-break-inside: avoid; margin-bottom: 20px; }
        }
      `}</style>

      {isPremium && (
        <div className={`mb-8 md:mb-12 bg-white border border-zinc-100 p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-xl relative overflow-hidden transition-all duration-500 ${isDone ? 'ring-2 ring-green-500/20' : ''}`}>
          <div className="absolute top-0 left-0 h-1 bg-green-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
            <div className="flex items-center gap-4 md:gap-6 flex-1 w-full">
              <div className={`w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center text-sm md:text-xl shadow-inner transition-all duration-700 ${isDone ? 'bg-green-600 text-white' : 'bg-zinc-50 text-amber-500 animate-pulse'}`}>
                <i className={`fas ${isDone ? 'fa-check' : 'fa-satellite-dish'}`}></i>
              </div>
              <div className="flex-grow space-y-2 md:space-y-4">
                <div className="flex justify-between items-end">
                   <p className="font-black text-[9px] md:text-xs uppercase tracking-widest text-zinc-800">{steps[deliveryStep]}</p>
                   <span className="text-[9px] md:text-[10px] font-black text-zinc-400">{Math.round(progress)}%</span>
                </div>
                <div className="h-1 w-full bg-zinc-50 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-900 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => window.print()} 
              disabled={!isDone}
              className={`w-full md:w-auto px-8 py-4 md:px-12 md:py-5 font-black rounded-xl md:rounded-2xl uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${isDone ? 'bg-zinc-900 text-white active:bg-black' : 'bg-zinc-100 text-zinc-300 cursor-not-allowed'}`}
            >
              <i className="fas fa-file-pdf"></i> Save PDF
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl md:rounded-[4rem] shadow-2xl border border-zinc-50 overflow-hidden relative">
        <div className="p-6 md:p-20">
          <div className="flex flex-col items-center md:flex-row md:justify-between mb-12 md:mb-24 gap-10 md:gap-12">
            <div className="space-y-4 md:space-y-6 flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="w-8 h-[2px] bg-amber-500"></span>
                <span className="text-amber-500 font-black text-[10px] uppercase tracking-[0.4em]">Official Verdict</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-serif italic text-zinc-900 leading-tight tracking-tight">{data.name}</h1>
              <p className="text-zinc-400 text-base md:text-2xl font-medium italic opacity-80">{data.endorsementRoute}</p>
            </div>
            <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 relative bg-zinc-50 rounded-[3rem] md:rounded-[4rem] flex items-center justify-center shadow-inner">
               <div className="absolute inset-0 p-4 md:p-5">
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
                <span className="text-4xl md:text-6xl font-black block text-zinc-900">{result.probabilityScore}%</span>
                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest opacity-60">Success Rate</span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-16 bg-zinc-50 rounded-3xl md:rounded-[3rem] border border-zinc-100 mb-12 md:mb-20 shadow-inner relative overflow-hidden">
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em] mb-4 md:mb-6 block">Summary</span>
            <p className="text-lg md:text-3xl text-zinc-800 leading-relaxed font-serif italic relative z-10">"{result.summary}"</p>
          </div>

          {!isPremium ? (
            <div className="bg-zinc-900 p-8 md:p-20 rounded-3xl md:rounded-[4rem] text-center text-white space-y-8 md:space-y-12 shadow-2xl print:hidden border border-zinc-800">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-amber-600/10 border border-amber-600/20 rounded-full flex items-center justify-center text-amber-600 text-2xl md:text-4xl mx-auto shadow-inner animate-pulse"><i className="fas fa-lock"></i></div>
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-2xl md:text-5xl font-black uppercase italic tracking-tighter">Premium Audit Locked</h3>
                <p className="text-zinc-400 text-sm md:text-xl max-w-2xl mx-auto font-light italic leading-relaxed">Evidence gaps identified. Unlock full mapping and tactical roadmap.</p>
              </div>
              <button onClick={onUpgrade} className="w-full md:w-auto px-10 py-5 md:px-14 md:py-7 bg-amber-600 text-white font-black rounded-2xl md:rounded-3xl uppercase tracking-widest text-sm md:text-base hover:bg-amber-500 transition-all shadow-xl active:scale-95">Upgrade Report ($19)</button>
            </div>
          ) : (
            <div className="space-y-20 md:space-y-32">
               <section>
                <div className="flex items-center gap-4 md:gap-6 mb-10 md:mb-12">
                  <div className="w-2 h-10 md:w-2.5 md:h-12 bg-amber-500 rounded-full"></div>
                  <h2 className="text-2xl md:text-4xl font-black text-zinc-900 uppercase tracking-tight italic">Criteria Mapping</h2>
                </div>
                <div className="grid gap-6 md:gap-10">
                  {[...result.mandatoryCriteria, ...result.optionalCriteria].map((c, i) => (
                    <div key={i} className="criteria-card p-6 md:p-10 bg-[#FCFCFC] rounded-2xl md:rounded-[3.5rem] border border-zinc-100 group">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
                        <div className="space-y-1">
                           <span className="text-[8px] md:text-[10px] font-black text-zinc-300 uppercase tracking-widest">Standard {i+1}</span>
                           <h4 className="font-black text-zinc-900 uppercase tracking-tight text-lg md:text-2xl italic">{c.title}</h4>
                        </div>
                        <span className={`px-4 py-1.5 md:px-7 md:py-2.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border shadow-sm ${c.met ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {c.met ? 'Met' : 'Gap'}
                        </span>
                      </div>
                      <p className="text-zinc-500 italic font-medium leading-relaxed text-sm md:text-xl border-t border-zinc-100 pt-6 md:pt-10">"{c.reasoning}"</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-zinc-900 p-8 md:p-24 rounded-3xl md:rounded-[4.5rem] text-white border border-zinc-800">
                <h2 className="text-2xl md:text-4xl font-black mb-12 md:mb-20 uppercase tracking-tight italic text-amber-500">
                   Tactical Roadmap
                </h2>
                <div className="space-y-12 md:space-y-20">
                  {result.recommendations?.map((rec, i) => (
                    <div key={i} className="flex gap-6 md:gap-10 items-start pb-10 md:pb-16 border-b border-zinc-800 last:border-0">
                      <span className="text-amber-500 font-serif italic text-3xl md:text-8xl opacity-80 leading-none">{i+1}</span>
                      <p className="text-base md:text-2xl text-zinc-300 leading-relaxed italic font-light tracking-wide pt-2 md:pt-4">{rec}</p>
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
