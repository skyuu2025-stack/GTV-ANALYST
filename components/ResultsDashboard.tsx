
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
  const [progress, setProgress] = useState(0);

  // 模拟邮件发送过程
  useEffect(() => {
    if (isPremium) {
      setPdfStatus('sending');
      let current = 0;
      const interval = setInterval(() => {
        current += Math.random() * 10;
        if (current >= 100) {
          current = 100;
          setPdfStatus('sent');
          clearInterval(interval);
        }
        setProgress(current);
      }, 250);
      return () => clearInterval(interval);
    }
  }, [isPremium]);

  if (!result || !data) return null;

  const chartData = [{ name: 'Prob', value: result.probabilityScore || 0, fill: '#D97706' }];

  return (
    <div className="max-w-5xl mx-auto py-6 md:py-20 px-3 md:px-6 animate-scale-up">
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white !important; padding: 0 !important; -webkit-print-color-adjust: exact; }
          .shadow-inner, .shadow-sm, .shadow-xl, .shadow-2xl, .shadow-lg { box-shadow: none !important; }
          .bg-white { background: white !important; }
          .bg-zinc-900 { background: #1a1a1a !important; color: white !important; }
          .rounded-[24px], .rounded-[40px], .rounded-[48px] { border-radius: 8px !important; }
          .border { border: 1px solid #eee !important; }
          @page { margin: 1cm; size: A4; }
          .print-header { display: block !important; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; margin-bottom: 30px; }
        }
        .print-header { display: none; }
      `}</style>

      {/* 专家报告页眉 (仅打印可见) */}
      <div className="print-header">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest">GTV Analyst</h2>
            <p className="text-[10px] text-zinc-400 font-bold">Confidential Assessment Report</p>
          </div>
          <p className="text-[10px] text-zinc-400 font-bold uppercase">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* 付费版专用：模拟 PDF 发送状态栏 */}
      {isPremium && (
        <div className="mb-10 p-6 md:p-10 bg-green-50 border border-green-100 rounded-[2rem] md:rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 text-green-900 animate-fade-in print:hidden shadow-sm">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className={`w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-xl shadow-inner transition-all duration-1000 ${pdfStatus === 'sent' ? 'bg-green-600 text-white' : 'bg-green-200 text-green-600'}`}>
              <i className={`fas ${pdfStatus === 'sent' ? 'fa-check-double' : 'fa-paper-plane animate-pulse'}`}></i>
            </div>
            <div className="flex-grow space-y-3">
              <p className="font-black text-[10px] md:text-xs uppercase tracking-[0.25em] mb-1">
                {pdfStatus === 'sent' ? 'Premium PDF Delivered' : 'Transmitting Expert Strategy...'}
              </p>
              <div className="relative h-2 w-full bg-green-200/50 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-[11px] md:text-sm font-medium italic opacity-70">
                {pdfStatus === 'sent' ? `Your roadmap has been sent to ${data.email}` : `Finalizing PDF rendering... ${Math.round(progress)}%`}
              </p>
            </div>
          </div>
          <button 
            onClick={() => window.print()} 
            className={`w-full md:w-auto px-10 py-5 bg-green-700 text-white text-[11px] font-black rounded-2xl uppercase tracking-[0.2em] shadow-lg hover:bg-green-800 transition-all active:scale-95 flex items-center justify-center gap-3 ${pdfStatus === 'sent' ? 'opacity-100 scale-100' : 'opacity-50 scale-95 cursor-not-allowed'}`}
          >
            <i className="fas fa-file-pdf"></i> Download PDF Copy
          </button>
        </div>
      )}

      <div className="bg-white rounded-[2rem] md:rounded-[4rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-zinc-50 overflow-hidden">
        <div className="p-6 md:p-20">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 md:mb-32 gap-12">
            <div className="space-y-6 md:space-y-10 flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-5">
                <span className="w-12 h-[2px] bg-amber-500"></span>
                <span className="text-amber-500 font-black text-[10px] md:text-[12px] uppercase tracking-[0.3em]">Official Assessment</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-serif italic text-zinc-900 leading-[1.1] tracking-tighter">{data.name}</h1>
              <p className="text-zinc-400 text-lg md:text-3xl font-medium leading-relaxed italic opacity-80">{data.endorsementRoute}</p>
            </div>
            <div className="w-56 h-56 md:w-80 md:h-80 relative bg-zinc-50 rounded-[3rem] md:rounded-[5rem] flex items-center justify-center shadow-inner group">
               <div className="absolute inset-0 p-5">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="88%" outerRadius="100%" data={chartData} startAngle={90} endAngle={450}>
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={30} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center relative z-10 transition-transform group-hover:scale-110 duration-500">
                <span className="text-5xl md:text-7xl font-black block text-zinc-900">{result.probabilityScore}%</span>
                <span className="text-[9px] md:text-[11px] font-black text-zinc-400 uppercase tracking-widest opacity-60">Success Odds</span>
              </div>
            </div>
          </div>

          <div className="p-10 md:p-20 bg-[#FBFBFB] rounded-[3rem] md:rounded-[5rem] border border-zinc-100 mb-16 md:mb-32 shadow-sm relative">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <i className="fas fa-quote-right text-[10rem]"></i>
            </div>
            <span className="text-[11px] md:text-[13px] font-black text-amber-600 uppercase tracking-[0.4em] mb-8 block text-center md:text-left">Executive Verdict</span>
            <p className="text-2xl md:text-4xl text-zinc-800 leading-[1.6] font-serif italic text-center md:text-left relative z-10">"{result.summary}"</p>
          </div>

          {!isPremium ? (
            <div className="bg-zinc-900 p-10 md:p-24 rounded-[3.5rem] md:rounded-[6rem] text-center text-white space-y-10 md:space-y-16 shadow-2xl animate-fade-in print:hidden border border-zinc-800 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
              <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500 text-3xl mx-auto shadow-inner"><i className="fas fa-lock"></i></div>
              <div className="space-y-6">
                <h3 className="text-4xl md:text-6xl font-bold tracking-tight uppercase italic">Unlock Your Criteria Mapping</h3>
                <p className="text-zinc-400 text-base md:text-2xl max-w-3xl mx-auto font-light italic leading-relaxed opacity-90">Our AI has mapped your profile against Home Office guidance. Access the full breakdown of mandatory criteria and 5 tactical modification steps used by consultants.</p>
              </div>
              <button onClick={onUpgrade} className="w-full md:w-auto px-16 py-7 bg-amber-600 text-white font-black rounded-3xl uppercase tracking-widest text-base hover:bg-amber-500 transition-all shadow-[0_20px_60px_rgba(217,119,6,0.3)] active:scale-95">Reveal Premium Report • $19</button>
            </div>
          ) : (
            <div className="space-y-24 md:space-y-40 animate-fade-in">
               <section>
                <div className="flex items-center gap-8 mb-12 md:mb-20">
                  <div className="w-2.5 h-12 md:h-16 bg-amber-500 rounded-full"></div>
                  <h2 className="text-3xl md:text-5xl font-black text-zinc-900 uppercase tracking-tighter italic">Deep Criteria Analysis</h2>
                </div>
                <div className="grid gap-8 md:gap-14">
                  {[...result.mandatoryCriteria, ...result.optionalCriteria].map((c, i) => (
                    <div key={i} className="p-10 md:p-20 bg-zinc-50/50 rounded-[3rem] md:rounded-[5rem] border border-zinc-100 hover:bg-zinc-50 transition-all group relative overflow-hidden">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-12 gap-6">
                        <div className="space-y-2">
                           <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic">Criterion {i+1}</span>
                           <h4 className="font-black text-zinc-900 uppercase tracking-tight text-lg md:text-2xl italic group-hover:text-amber-600 transition-colors">{c.title}</h4>
                        </div>
                        <span className={`px-8 py-2.5 rounded-full text-[10px] md:text-[12px] font-black uppercase tracking-[0.25em] border shadow-sm ${c.met ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'}`}>
                          {c.met ? 'Met' : 'Risk Flagged'}
                        </span>
                      </div>
                      <p className="text-zinc-500 italic font-medium leading-[1.8] text-base md:text-2xl border-t border-zinc-200/50 pt-10 md:pt-12">"{c.reasoning}"</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-zinc-900 p-12 md:p-28 rounded-[4rem] md:rounded-[7rem] text-white relative overflow-hidden border border-zinc-800">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <h2 className="text-3xl md:text-5xl font-black mb-16 md:mb-28 uppercase tracking-tighter italic text-amber-500 flex items-center gap-8 relative z-10">
                  <i className="fas fa-bolt text-2xl"></i>
                  Tactical Modification Steps
                </h2>
                <div className="space-y-12 md:space-y-24">
                  {result.recommendations?.map((rec, i) => (
                    <div key={i} className="flex gap-8 md:gap-16 items-start pb-12 md:pb-24 border-b border-zinc-800 last:border-0 relative z-10">
                      <div className="flex flex-col items-center">
                        <span className="text-amber-500 font-serif italic text-4xl md:text-8xl opacity-90 leading-none">0{i+1}</span>
                        <div className="w-[1px] h-full bg-amber-500/20 mt-8"></div>
                      </div>
                      <p className="text-lg md:text-3xl text-zinc-300 leading-relaxed italic font-light tracking-wide">{rec}</p>
                    </div>
                  ))}
                </div>
              </section>
              
              <div className="text-center pt-20 pb-10 border-t border-zinc-100 hidden print:block">
                <p className="text-[12px] text-zinc-400 font-black uppercase tracking-[0.5em] mb-4">GTV Analyst • Official AI Assessment Report</p>
                <p className="text-[10px] text-zinc-300 uppercase tracking-[0.2em] italic">Generated for {data.name} • {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
