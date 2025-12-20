
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
  const [pdfStatus, setPdfStatus] = useState<'none' | 'sending' | 'sent'>('none');

  useEffect(() => {
    if (isPremium) {
      setPdfStatus('sending');
      const timer = setTimeout(() => setPdfStatus('sent'), 3000);
      return () => clearTimeout(timer);
    }
  }, [isPremium]);

  if (!result || !data) return null;

  const chartData = [{ name: 'Prob', value: result.probabilityScore || 0, fill: '#D97706' }];

  return (
    <div className="max-w-5xl mx-auto py-6 md:py-20 px-3 md:px-6 animate-scale-up">
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          .shadow-inner, .shadow-sm, .shadow-xl, .shadow-2xl { shadow: none !important; box-shadow: none !important; }
          .bg-zinc-900 { background-color: #18181b !important; color: white !important; }
          .rounded-[32px], .rounded-[48px] { border-radius: 12px !important; }
          .md\\:p-16 { padding: 2rem !important; }
          @page { margin: 1cm; }
        }
      `}</style>

      {isPremium && (
        <div className="mb-8 md:mb-12 p-5 md:p-8 bg-green-50 border border-green-100 rounded-[24px] md:rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 text-green-800 animate-fade-in print:hidden">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-xl shadow-inner transition-colors duration-500 ${pdfStatus === 'sent' ? 'bg-green-100 text-green-600' : 'bg-green-100/50 text-green-400'}`}>
              <i className={`fas ${pdfStatus === 'sent' ? 'fa-check' : 'fa-envelope animate-bounce'}`}></i>
            </div>
            <div className="flex-grow">
              <p className="font-black text-[9px] md:text-xs uppercase tracking-[0.2em] mb-1">
                {pdfStatus === 'sent' ? 'Full PDF Sent' : 'Generating PDF Report...'}
              </p>
              <div className="relative h-1 w-full bg-green-200/50 rounded-full overflow-hidden mt-1">
                <div 
                  className={`absolute top-0 left-0 h-full bg-green-500 transition-all duration-[3000ms] ease-out ${pdfStatus === 'sending' ? 'w-full' : 'w-full'}`}
                  style={{ width: pdfStatus === 'sent' ? '100%' : '30%' }}
                ></div>
              </div>
              <p className="text-[10px] md:text-sm font-medium italic opacity-80 mt-2">To: <strong>{data.email}</strong></p>
            </div>
          </div>
          <button 
            onClick={() => window.print()} 
            className="w-full md:w-auto px-8 py-3 bg-green-800 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg active:scale-95 flex items-center justify-center gap-3"
          >
            <i className="fas fa-file-pdf"></i> Download PDF Copy
          </button>
        </div>
      )}

      <div className="bg-white rounded-[24px] md:rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-zinc-50 overflow-hidden">
        <div className="p-5 md:p-16">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 md:mb-24 gap-8 md:gap-12">
            <div className="space-y-3 md:space-y-6 flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="w-8 h-[2px] bg-amber-500"></span>
                <span className="text-amber-500 font-black text-[9px] md:text-[10px] uppercase tracking-widest">Eligibility Scorecard</span>
              </div>
              <h1 className="text-3xl md:text-6xl font-serif italic text-zinc-900 leading-tight">{data.name}</h1>
              <p className="text-zinc-400 text-sm md:text-xl font-medium leading-relaxed italic">{data.endorsementRoute}</p>
            </div>
            <div className="w-40 h-40 md:w-64 md:h-64 relative bg-zinc-50 rounded-[28px] md:rounded-[40px] flex items-center justify-center shadow-inner">
               <div className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="85%" outerRadius="100%" data={chartData} startAngle={90} endAngle={450}>
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={20} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center relative z-10">
                <span className="text-3xl md:text-5xl font-black block">{result.probabilityScore}%</span>
                <span className="text-[7px] md:text-[9px] font-black text-zinc-400 uppercase tracking-widest opacity-60">Success Probability</span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-12 bg-[#F9F9F9] rounded-[20px] md:rounded-[40px] border border-zinc-100 mb-10 md:mb-20 shadow-sm">
            <span className="text-[9px] md:text-[11px] font-black text-zinc-300 uppercase tracking-widest mb-3 md:6 block text-center md:text-left italic underline underline-offset-4 decoration-amber-500/30">Executive AI Verdict</span>
            <p className="text-lg md:text-2xl text-zinc-800 leading-relaxed font-serif italic text-center md:text-left">"{result.summary}"</p>
          </div>

          {!isPremium ? (
            <div className="bg-zinc-900 p-7 md:p-16 rounded-[28px] md:rounded-[48px] text-center text-white space-y-6 md:space-y-8 shadow-2xl animate-fade-in overflow-hidden print:hidden">
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500 text-xl mx-auto"><i className="fas fa-lock"></i></div>
              <h3 className="text-2xl md:text-4xl font-bold tracking-tight uppercase italic">Unlock Your Roadmap</h3>
              <p className="text-zinc-400 text-xs md:text-lg max-w-xl mx-auto font-medium italic leading-relaxed opacity-80">Our AI detected critical profile gaps. Access the exact evidence criteria mapping and 5 tactical modifications used by senior visa consultants.</p>
              <button onClick={onUpgrade} className="w-full md:w-auto px-10 py-5 bg-amber-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs md:text-sm hover:scale-105 transition-all shadow-xl active:scale-95">Get Full Analysis • $19</button>
            </div>
          ) : (
            <div className="space-y-12 md:space-y-24 animate-fade-in">
               <section>
                <div className="flex items-center gap-4 mb-6 md:mb-10">
                  <div className="w-1.5 h-8 bg-amber-500 rounded-full"></div>
                  <h2 className="text-lg md:text-2xl font-black text-zinc-900 uppercase tracking-tighter italic">Criteria Mapping Analysis</h2>
                </div>
                <div className="grid gap-4 md:gap-6">
                  {[...result.mandatoryCriteria, ...result.optionalCriteria].map((c, i) => (
                    <div key={i} className="p-6 md:p-10 bg-zinc-50 rounded-[20px] md:rounded-[32px] border border-zinc-100 hover:border-amber-100 transition-colors">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 md:mb-4 gap-2">
                        <h4 className="font-black text-zinc-800 uppercase tracking-tight text-xs md:text-base italic">Requirement: {c.title}</h4>
                        <span className={`px-4 py-1 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest border ${c.met ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{c.met ? 'Met' : 'Risk Detected'}</span>
                      </div>
                      <p className="text-zinc-500 italic font-medium leading-relaxed text-xs md:text-base border-t border-zinc-100 pt-4 mt-2">"{c.reasoning}"</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-zinc-900 p-7 md:p-16 rounded-[28px] md:rounded-[48px] text-white">
                <h2 className="text-lg md:text-2xl font-black mb-10 md:mb-12 uppercase tracking-tighter italic text-amber-500 flex items-center gap-4">
                  <i className="fas fa-bolt text-sm"></i>
                  Tactical Modification Steps
                </h2>
                <div className="space-y-6 md:space-y-10">
                  {result.recommendations?.map((rec, i) => (
                    <div key={i} className="flex gap-4 md:gap-8 items-start pb-6 md:pb-10 border-b border-zinc-800 last:border-0">
                      <div className="flex flex-col items-center">
                        <span className="text-amber-500 font-serif italic text-2xl md:text-4xl opacity-80 leading-none">0{i+1}</span>
                        <div className="w-[1px] h-full bg-amber-500/20 mt-2"></div>
                      </div>
                      <p className="text-sm md:text-lg text-zinc-300 leading-relaxed italic font-light tracking-wide">{rec}</p>
                    </div>
                  ))}
                </div>
              </section>
              
              <div className="text-center pt-8 border-t border-zinc-50 hidden print:block">
                <p className="text-[8px] text-zinc-300 font-black uppercase tracking-[0.4em]">Official AI Assessment Report • GTV Analyst</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
