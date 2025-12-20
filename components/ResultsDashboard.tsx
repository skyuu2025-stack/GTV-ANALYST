
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
  const [pdfStatus, setPdfStatus] = useState<'none' | 'simulating' | 'done'>('none');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing Premium Report...');

  // 模拟邮件发送与报告生成进度
  useEffect(() => {
    if (isPremium) {
      setPdfStatus('simulating');
      let currentProgress = 0;
      
      const interval = setInterval(() => {
        currentProgress += Math.random() * 8;
        
        if (currentProgress < 30) setStatusMessage('Analyzing expert criteria...');
        else if (currentProgress < 60) setStatusMessage('Mapping evidence gaps...');
        else if (currentProgress < 90) setStatusMessage(`Finalizing PDF for ${data.email}...`);
        else if (currentProgress >= 100) {
          currentProgress = 100;
          setPdfStatus('done');
          setStatusMessage('Expert Roadmap Successfully Delivered.');
          clearInterval(interval);
        }
        
        setProgress(currentProgress);
      }, 250); // 总耗时约 3-4 秒

      return () => clearInterval(interval);
    }
  }, [isPremium, data.email]);

  if (!result || !data) return null;

  const chartData = [{ name: 'Prob', value: result.probabilityScore || 0, fill: '#D97706' }];

  return (
    <div className="max-w-5xl mx-auto py-6 md:py-20 px-3 md:px-6 animate-scale-up">
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white !important; padding: 0 !important; color: #1a1a1a !important; }
          .bg-white { background: white !important; }
          .bg-zinc-900 { background: #111 !important; color: white !important; -webkit-print-color-adjust: exact; }
          .rounded-[40px], .rounded-[64px], .rounded-[3rem] { border-radius: 12px !important; }
          .shadow-xl, .shadow-sm, .shadow-2xl { box-shadow: none !important; }
          .border { border: 1px solid #eee !important; }
          @page { margin: 1.5cm; }
          .print-header { display: flex !important; justify-between items-center border-bottom: 2px solid #D4AF37; margin-bottom: 2rem; padding-bottom: 1rem; }
        }
        .print-header { display: none; }
      `}</style>

      {/* 打印专有页眉 */}
      <div className="print-header">
        <div className="text-left">
          <h2 className="text-xl font-black uppercase tracking-widest">GTV Analyst</h2>
          <p className="text-[10px] font-bold text-zinc-400">EXPERT ELIGIBILITY REPORT</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-[10px] font-bold uppercase">{new Date().toLocaleDateString()}</p>
          <p className="text-[9px] text-zinc-300">CONFIDENTIAL</p>
        </div>
      </div>

      {/* 付费版：Premium 进度模拟信息栏 */}
      {isPremium && (
        <div className="mb-8 md:mb-16 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm animate-fade-in print:hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 flex-1 w-full">
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl transition-all duration-1000 ${pdfStatus === 'done' ? 'bg-green-600 text-white rotate-[360deg]' : 'bg-green-200 text-green-600 animate-pulse'}`}>
                <i className={`fas ${pdfStatus === 'done' ? 'fa-check-double' : 'fa-paper-plane'}`}></i>
              </div>
              <div className="flex-grow space-y-3">
                <div className="flex justify-between items-end">
                   <p className="font-black text-[10px] md:text-xs uppercase tracking-[0.2em] text-green-800">{statusMessage}</p>
                   <span className="text-[10px] font-black text-green-600">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 w-full bg-green-200/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-[11px] md:text-sm font-medium italic text-green-700/70">
                  {pdfStatus === 'done' ? `Report available for download and archived for ${data.email}` : 'Generating high-fidelity criteria mapping...'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => window.print()} 
              disabled={pdfStatus !== 'done'}
              className={`w-full md:w-auto px-10 py-5 font-black rounded-2xl uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg ${pdfStatus === 'done' ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-zinc-100 text-zinc-300 cursor-not-allowed'}`}
            >
              <i className="fas fa-file-pdf"></i> Download PDF Copy
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-[0_20px_80px_rgba(0,0,0,0.03)] border border-zinc-50 overflow-hidden relative">
        <div className="p-6 md:p-20">
          {/* 报告头部 */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 md:mb-32 gap-12">
            <div className="space-y-6 md:space-y-10 flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-5">
                <span className="w-12 h-[2px] bg-amber-500"></span>
                <span className="text-amber-500 font-black text-[10px] md:text-[12px] uppercase tracking-[0.3em]">Official AI Assessor</span>
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
              <div className="text-center relative z-10">
                <span className="text-5xl md:text-7xl font-black block text-zinc-900">{result.probabilityScore}%</span>
                <span className="text-[9px] md:text-[11px] font-black text-zinc-400 uppercase tracking-widest opacity-60">Visa Odds</span>
              </div>
            </div>
          </div>

          {/* 总结部分 */}
          <div className="p-10 md:p-20 bg-[#FBFBFB] rounded-[3rem] md:rounded-[5rem] border border-zinc-100 mb-16 md:mb-32 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <i className="fas fa-quote-right text-[10rem]"></i>
            </div>
            <span className="text-[11px] md:text-[13px] font-black text-amber-600 uppercase tracking-[0.4em] mb-8 block">Executive Verdict</span>
            <p className="text-2xl md:text-4xl text-zinc-800 leading-[1.6] font-serif italic relative z-10">"{result.summary}"</p>
          </div>

          {/* 内容展示区：根据付费状态切换 */}
          {!isPremium ? (
            <div className="bg-zinc-900 p-10 md:p-24 rounded-[3.5rem] md:rounded-[6rem] text-center text-white space-y-10 md:space-y-16 shadow-2xl animate-fade-in print:hidden border border-zinc-800">
              <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500 text-3xl mx-auto shadow-inner"><i className="fas fa-lock"></i></div>
              <div className="space-y-6">
                <h3 className="text-4xl md:text-6xl font-bold tracking-tight uppercase italic">Unlock Deep Analysis</h3>
                <p className="text-zinc-400 text-base md:text-2xl max-w-3xl mx-auto font-light italic leading-relaxed opacity-90">Access the expert criteria mapping and a tactical modification roadmap to secure your Global Talent endorsement.</p>
              </div>
              <button onClick={onUpgrade} className="px-16 py-7 bg-amber-600 text-white font-black rounded-3xl uppercase tracking-widest text-base hover:bg-amber-500 transition-all shadow-[0_20px_60px_rgba(217,119,6,0.3)] active:scale-95">Upgrade to Premium • $19</button>
            </div>
          ) : (
            <div className="space-y-24 md:space-y-40 animate-fade-in">
               {/* 证据标准分析 */}
               <section>
                <div className="flex items-center gap-8 mb-12 md:mb-20">
                  <div className="w-2.5 h-12 md:h-16 bg-amber-500 rounded-full"></div>
                  <h2 className="text-3xl md:text-5xl font-black text-zinc-900 uppercase tracking-tighter italic">Expert Criteria Mapping</h2>
                </div>
                <div className="grid gap-8 md:gap-14">
                  {[...result.mandatoryCriteria, ...result.optionalCriteria].map((c, i) => (
                    <div key={i} className="p-10 md:p-20 bg-zinc-50/50 rounded-[3rem] md:rounded-[5rem] border border-zinc-100 hover:bg-zinc-50 transition-all group">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-12 gap-6">
                        <div className="space-y-2">
                           <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic">Standard Requirement {i+1}</span>
                           <h4 className="font-black text-zinc-900 uppercase tracking-tight text-lg md:text-2xl italic group-hover:text-amber-600 transition-colors">{c.title}</h4>
                        </div>
                        <span className={`px-8 py-2.5 rounded-full text-[10px] md:text-[12px] font-black uppercase tracking-[0.25em] border shadow-sm ${c.met ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'}`}>
                          {c.met ? 'Evidence Sufficient' : 'Evidence Modification Required'}
                        </span>
                      </div>
                      <p className="text-zinc-500 italic font-medium leading-[1.8] text-base md:text-2xl border-t border-zinc-200/50 pt-10 md:pt-12">"{c.reasoning}"</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 战术建议 */}
              <section className="bg-zinc-900 p-12 md:p-28 rounded-[4rem] md:rounded-[7rem] text-white relative overflow-hidden border border-zinc-800">
                <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none rotate-12">
                   <i className="fas fa-chess-king text-[20rem]"></i>
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-16 md:mb-28 uppercase tracking-tighter italic text-amber-500 flex items-center gap-8 relative z-10">
                  <i className="fas fa-bolt text-2xl"></i>
                  Tactical Modification Roadmap
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
                <p className="text-[12px] text-zinc-400 font-black uppercase tracking-[0.5em] mb-4">Verified by GTV Analyst AI Engine</p>
                <p className="text-[10px] text-zinc-300 uppercase tracking-[0.2em] italic">Copyright © {new Date().getFullYear()} GTV Assessor. Not legal advice.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
