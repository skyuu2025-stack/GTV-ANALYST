
import React from 'react';
import { AnalysisResult, AssessmentData } from '../types';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ResultsDashboardProps {
  result: AnalysisResult;
  data: AssessmentData;
  isPremium: boolean;
  onUpgrade: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, data, isPremium, onUpgrade }) => {
  const chartData = [{ name: 'Prob', value: result.probabilityScore, fill: '#D97706' }];

  return (
    <div className="max-w-5xl mx-auto py-20 px-6 animate-scale-up">
      {isPremium && (
        <div className="mb-12 p-8 bg-green-50 border border-green-100 rounded-3xl flex items-center justify-between gap-6 text-green-800 animate-fade-in">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl shadow-inner"><i className="fas fa-check"></i></div>
            <div>
              <p className="font-black text-xs uppercase tracking-widest mb-1">Premium Roadmap Unlocked</p>
              <p className="text-sm font-medium italic opacity-80">Full analysis delivered to <strong>{data.email}</strong></p>
            </div>
          </div>
          <button onClick={() => window.print()} className="px-6 py-2 bg-green-800 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg">Print Report</button>
        </div>
      )}

      <div className="bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-zinc-50 overflow-hidden">
        <div className="p-16">
          <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-12">
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-3">
                <span className="w-10 h-[2px] bg-amber-500"></span>
                <span className="text-amber-500 font-black text-[10px] uppercase tracking-widest">Eligibility Scorecard</span>
              </div>
              <h1 className="text-6xl font-serif italic text-zinc-900 leading-tight">{data.name}</h1>
              <p className="text-zinc-400 text-xl font-medium leading-relaxed italic">{data.endorsementRoute} Analysis</p>
            </div>
            <div className="w-64 h-64 relative bg-zinc-50 rounded-[40px] flex items-center justify-center shadow-inner">
               <div className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="85%" outerRadius="100%" data={chartData} startAngle={90} endAngle={450}>
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={20} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center relative z-10">
                <span className="text-5xl font-black block">{result.probabilityScore}%</span>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest opacity-60">Success Probability</span>
              </div>
            </div>
          </div>

          <div className="p-12 bg-[#F9F9F9] rounded-[40px] border border-zinc-100 mb-20 shadow-sm">
            <span className="text-[11px] font-black text-zinc-300 uppercase tracking-widest mb-6 block">Executive AI Verdict</span>
            <p className="text-2xl text-zinc-800 leading-relaxed font-serif italic">"{result.summary}"</p>
          </div>

          {!isPremium ? (
            <div className="bg-zinc-900 p-16 rounded-[48px] text-center text-white space-y-8 shadow-2xl animate-fade-in">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500 text-2xl mx-auto"><i className="fas fa-lock"></i></div>
              <h3 className="text-4xl font-bold tracking-tight">Unlock Your Full Roadmap</h3>
              <p className="text-zinc-400 text-lg max-w-xl mx-auto font-medium italic">Our AI detected critical gaps. Unlock the mapping of evidence criteria and 5 tactical modifications used by top visa consultants.</p>
              <button onClick={onUpgrade} className="px-12 py-6 bg-white text-zinc-900 font-black rounded-2xl uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl">Get Full Report • $19</button>
            </div>
          ) : (
            <div className="space-y-24 animate-fade-in">
               <section>
                <h2 className="text-2xl font-black mb-10 text-zinc-900 uppercase tracking-tighter border-l-4 border-amber-500 pl-6">Criteria Breakdown</h2>
                <div className="grid gap-6">
                  {result.mandatoryCriteria.map((c, i) => (
                    <div key={i} className="p-10 bg-zinc-50 rounded-[32px] border border-zinc-100">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-black text-zinc-800 uppercase tracking-tight">{c.title}</h4>
                        <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${c.met ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{c.met ? 'Satisfied' : 'High Risk'}</span>
                      </div>
                      <p className="text-zinc-500 italic font-medium leading-relaxed">"{c.reasoning}"</p>
                    </div>
                  ))}
                </div>
              </section>
              <section className="bg-zinc-900 p-16 rounded-[48px] text-white">
                <h2 className="text-2xl font-black mb-12 uppercase tracking-tighter italic text-amber-500">Modification Steps</h2>
                <div className="space-y-8">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-6 items-start pb-8 border-b border-zinc-800 last:border-0">
                      <span className="text-amber-500 font-serif italic text-4xl opacity-40">0{i+1}</span>
                      <p className="text-lg text-zinc-300 leading-relaxed italic">{rec}</p>
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
