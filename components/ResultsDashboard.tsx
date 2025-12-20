
import React from 'react';
import { AnalysisResult, AssessmentData } from '../types.ts';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ResultsDashboardProps {
  result: AnalysisResult;
  data: AssessmentData;
  isPremium: boolean;
  onUpgrade: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, data, isPremium, onUpgrade }) => {
  if (!result || !data) return null;

  const chartData = [{ name: 'Prob', value: result.probabilityScore || 0, fill: '#D97706' }];

  return (
    <div className="max-w-5xl mx-auto py-10 md:py-20 px-4 md:px-6 animate-scale-up">
      {isPremium && (
        <div className="mb-8 md:mb-12 p-6 md:p-8 bg-green-50 border border-green-100 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 text-green-800 animate-fade-in">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center text-xl shadow-inner">
              <i className="fas fa-check"></i>
            </div>
            <div>
              <p className="font-black text-xs uppercase tracking-widest mb-1">Premium Roadmap Unlocked</p>
              <p className="text-sm font-medium italic opacity-80">Full analysis & invoice sent to <strong>{data.email}</strong></p>
            </div>
          </div>
          <button onClick={() => window.print()} className="w-full md:w-auto px-6 py-2 bg-green-800 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg active:scale-95">Print Report</button>
        </div>
      )}

      <div className="bg-white rounded-[32px] md:rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-zinc-50 overflow-hidden">
        <div className="p-6 md:p-16">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 md:mb-24 gap-12">
            <div className="space-y-4 md:space-y-6 flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="w-10 h-[2px] bg-amber-500"></span>
                <span className="text-amber-500 font-black text-[10px] uppercase tracking-widest">Eligibility Scorecard</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif italic text-zinc-900 leading-tight">{data.name}</h1>
              <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed italic">{data.endorsementRoute} Analysis</p>
            </div>
            <div className="w-48 h-48 md:w-64 md:h-64 relative bg-zinc-50 rounded-[32px] md:rounded-[40px] flex items-center justify-center shadow-inner">
               <div className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="85%" outerRadius="100%" data={chartData} startAngle={90} endAngle={450}>
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={20} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center relative z-10">
                <span className="text-4xl md:text-5xl font-black block">{result.probabilityScore}%</span>
                <span className="text-[8px] md:text-[9px] font-black text-zinc-400 uppercase tracking-widest opacity-60">Success Probability</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 bg-[#F9F9F9] rounded-[24px] md:rounded-[40px] border border-zinc-100 mb-12 md:mb-20 shadow-sm">
            <span className="text-[10px] md:text-[11px] font-black text-zinc-300 uppercase tracking-widest mb-4 md:6 block text-center md:text-left">Executive AI Verdict</span>
            <p className="text-xl md:text-2xl text-zinc-800 leading-relaxed font-serif italic text-center md:text-left">"{result.summary}"</p>
          </div>

          {!isPremium ? (
            <div className="bg-zinc-900 p-8 md:p-16 rounded-[32px] md:rounded-[48px] text-center text-white space-y-8 shadow-2xl animate-fade-in overflow-hidden">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500 text-2xl mx-auto"><i className="fas fa-lock"></i></div>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Unlock Your Full Roadmap</h3>
              <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto font-medium italic">Our AI detected critical gaps. Unlock the mapping of evidence criteria and 5 tactical modifications used by top visa consultants.</p>
              <button onClick={onUpgrade} className="w-full md:w-auto px-12 py-5 bg-white text-zinc-900 font-black rounded-2xl uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl active:scale-95">Get Full Report • $19</button>
            </div>
          ) : (
            <div className="space-y-16 md:space-y-24 animate-fade-in">
               <section>
                <h2 className="text-xl md:text-2xl font-black mb-8 md:mb-10 text-zinc-900 uppercase tracking-tighter border-l-4 border-amber-500 pl-6">Criteria Breakdown</h2>
                <div className="grid gap-6">
                  {[...result.mandatoryCriteria, ...result.optionalCriteria].map((c, i) => (
                    <div key={i} className="p-8 md:p-10 bg-zinc-50 rounded-[24px] md:rounded-[32px] border border-zinc-100">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                        <h4 className="font-black text-zinc-800 uppercase tracking-tight text-sm md:text-base">{c.title}</h4>
                        <span className={`px-4 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest ${c.met ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{c.met ? 'Satisfied' : 'High Risk'}</span>
                      </div>
                      <p className="text-zinc-500 italic font-medium leading-relaxed text-sm md:text-base">"{c.reasoning}"</p>
                    </div>
                  ))}
                </div>
              </section>
              <section className="bg-zinc-900 p-8 md:p-16 rounded-[32px] md:rounded-[48px] text-white">
                <h2 className="text-xl md:text-2xl font-black mb-10 md:mb-12 uppercase tracking-tighter italic text-amber-500">Modification Steps</h2>
                <div className="space-y-6 md:space-y-8">
                  {result.recommendations?.map((rec, i) => (
                    <div key={i} className="flex gap-4 md:gap-6 items-start pb-6 md:pb-8 border-b border-zinc-800 last:border-0">
                      <span className="text-amber-500 font-serif italic text-3xl md:text-4xl opacity-40 flex-shrink-0">0{i+1}</span>
                      <p className="text-base md:text-lg text-zinc-300 leading-relaxed italic">{rec}</p>
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
