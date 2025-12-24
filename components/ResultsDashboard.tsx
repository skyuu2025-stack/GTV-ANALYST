import React, { useState, useEffect } from 'react';
import { AnalysisResult, AssessmentData } from '../types.ts';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ResultsDashboardProps {
  result: AnalysisResult;
  data: AssessmentData;
  isPremium: boolean;
  onUpgrade: () => void;
}

const ROUTE_TESTIMONIALS: Record<string, { name: string; role: string; text: string; location: string }[]> = {
  "Digital Technology": [
    { name: "Arjun M.", role: "CTO & Founder", text: "The AI correctly identified that my 'innovation' evidence was too weak. Following the roadmap got me endorsed in record time.", location: "Bangalore" },
    { name: "Sarah L.", role: "Senior Data Scientist", text: "Tech Nation criteria are daunting. This tool mapped my patents and GitHub contributions to the exact standards required.", location: "San Francisco" }
  ],
  "Fashion": [
    { name: "Elena R.", role: "Creative Director", text: "Mapping my runway press to the Arts Council standards was easy with this audit. It precisely highlighted what was missing.", location: "Milan" },
    { name: "James K.", role: "Luxury Brand Lead", text: "The roadmap for evidence gaps is a lifesaver. It took the guesswork out of my endorsement application.", location: "London" }
  ],
  "Arts & Culture": [
    { name: "Mikhail V.", role: "Visual Artist", text: "I finally understood how to prove 'international recognition'. The AI audit is worth every penny for the clarity it provides.", location: "Berlin" },
    { name: "Chloe T.", role: "Orchestral Conductor", text: "A professional and precise way to benchmark your career. The tactical roadmap is exactly what a high-stakes application needs.", location: "New York" }
  ]
};

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, data, isPremium, onUpgrade }) => {
  const [deliveryStep, setDeliveryStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isPremium) {
      let currentProgress = 0;
      // Accelerated interval from 300ms to 150ms and larger random jumps
      const interval = setInterval(() => {
        currentProgress += Math.random() * 25; // Faster increment
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
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isPremium]);

  const shareUrl = "https://gtvassessor.com";
  const shareText = `I just received my UK Global Talent Visa eligibility score: ${result.probabilityScore}%! Check your GTV readiness with this AI audit:`;

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    let url = '';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyToClipboard = () => {
    const finalUrl = window.location.origin.includes('gtvassessor') ? shareUrl : window.location.origin;
    navigator.clipboard.writeText(`${shareText} ${finalUrl}`);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  if (!result || !data) return null;

  const chartData = [{ name: 'Prob', value: result.probabilityScore || 0, fill: '#B45309' }];
  const steps = ["Processing...", "Validating...", "Generating...", "Preparing...", "Complete"];

  const getTestimonials = () => {
    if (data.endorsementRoute.includes("Digital Technology")) return ROUTE_TESTIMONIALS["Digital Technology"];
    if (data.endorsementRoute.includes("Fashion")) return ROUTE_TESTIMONIALS["Fashion"];
    return ROUTE_TESTIMONIALS["Arts & Culture"];
  };

  const currentTestimonials = getTestimonials();

  return (
    <div className="max-w-5xl mx-auto py-4 md:py-12 px-4 md:px-6 animate-fade-in">
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white !important; color: #111 !important; margin: 0; padding: 0; }
          .criteria-card { page-break-inside: avoid; margin-bottom: 20px; }
        }
      `}</style>

      {isPremium && (
        <div className={`mb-8 md:mb-10 bg-white border border-zinc-100 p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden transition-all duration-500 ${isDone ? 'ring-2 ring-green-500/20' : ''}`} role="region">
          <div className="absolute top-0 left-0 h-1 bg-green-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1 w-full">
              <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-sm shadow-inner transition-all duration-500 ${isDone ? 'bg-green-700 text-white' : 'bg-zinc-50 text-amber-600 animate-pulse'}`}>
                <i className={`fas ${isDone ? 'fa-check' : 'fa-satellite-dish'}`}></i>
              </div>
              <div className="flex-grow space-y-2">
                <div className="flex justify-between items-end">
                   <p className="font-black text-[9px] uppercase tracking-widest text-zinc-900">{steps[deliveryStep]}</p>
                   <span className="text-[9px] font-black text-zinc-500">{Math.round(progress)}%</span>
                </div>
                <div className="h-1 w-full bg-zinc-50 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-900 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => window.print()} 
              disabled={!isDone}
              className={`w-full md:w-auto px-8 py-4 font-black rounded-xl uppercase tracking-widest text-[9px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg ${isDone ? 'bg-zinc-900 text-white hover:bg-black' : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'}`}
            >
              <i className="fas fa-file-pdf"></i> Save Report
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-xl border border-zinc-100 overflow-hidden relative" id="results-content">
        <div className="p-6 md:p-12">
          <div className="flex flex-col items-center md:flex-row md:justify-between mb-10 md:mb-12 gap-8">
            <div className="space-y-4 flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="w-6 h-[2px] bg-amber-600"></span>
                <span className="text-amber-700 font-black text-[9px] uppercase tracking-[0.4em]">Expert Verdict</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif italic text-zinc-900 leading-tight tracking-tight">{data.name}</h1>
              <p className="text-zinc-500 text-base md:text-xl font-medium italic">{data.endorsementRoute}</p>
              
              <div className="pt-6 flex flex-col items-center md:items-start gap-3 print:hidden">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Share Readiness Score</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleShare('twitter')} className="w-9 h-9 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-all"><i className="fa-brands fa-x-twitter"></i></button>
                  <button onClick={() => handleShare('linkedin')} className="w-9 h-9 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-[#0077b5] transition-all"><i className="fa-brands fa-linkedin-in"></i></button>
                  <button onClick={copyToClipboard} className={`h-9 px-4 rounded-full border flex items-center gap-2 transition-all ${copyFeedback ? 'bg-green-50 border-green-300 text-green-800' : 'border-zinc-200 text-zinc-500'}`}>
                    <i className={`fas ${copyFeedback ? 'fa-check' : 'fa-link'} text-[10px]`}></i>
                    <span className="text-[8px] font-black uppercase tracking-widest">{copyFeedback ? 'Copied' : 'Link'}</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="w-48 h-48 sm:w-56 sm:h-56 relative bg-zinc-50 rounded-[3rem] flex items-center justify-center shadow-inner">
               <div className="absolute inset-0 p-4">
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
                <span className="text-4xl md:text-5xl font-black block text-zinc-900">{result.probabilityScore}%</span>
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest opacity-80">Readiness</span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10 bg-zinc-50 rounded-[2rem] border border-zinc-100 mb-10 md:mb-16 shadow-inner">
            <span className="text-[9px] font-black text-amber-700 uppercase tracking-[0.4em] mb-3 md:mb-4 block">Summary</span>
            <p className="text-base md:text-2xl text-zinc-900 leading-relaxed font-serif italic">"{result.summary}"</p>
          </div>

          {!isPremium ? (
            <div className="space-y-10">
              <div className="bg-zinc-900 p-8 md:p-16 rounded-[2.5rem] text-center text-white space-y-6 md:space-y-8 shadow-2xl print:hidden border border-zinc-800">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-600/10 border border-amber-600/30 rounded-full flex items-center justify-center text-amber-600 text-xl mx-auto animate-pulse">
                  <i className="fas fa-lock"></i>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl md:text-4xl font-black uppercase italic tracking-tighter">Full Audit Locked</h3>
                  <p className="text-zinc-300 text-xs md:text-lg max-w-xl mx-auto font-light italic leading-relaxed opacity-90">Evidence mapping and tactical success roadmap available in premium.</p>
                </div>
                <button 
                  onClick={onUpgrade} 
                  className="w-full md:w-auto px-10 py-4 bg-amber-600 text-white font-black rounded-xl uppercase tracking-widest text-[10px] hover:bg-amber-500 transition-all shadow-xl active:scale-95"
                >
                  Unlock Premium Report ($19)
                </button>
              </div>

              <div className="pt-10 print:hidden">
                <div className="text-center mb-8">
                   <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em]">Success Stories</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentTestimonials.map((t, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                      <p className="text-zinc-600 italic font-medium leading-relaxed mb-4 text-xs md:text-sm">"{t.text}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 font-black text-[10px] uppercase">{t.name.charAt(0)}</div>
                        <div>
                           <h4 className="text-[9px] font-black text-zinc-900 uppercase tracking-widest">{t.name}</h4>
                           <p className="text-[7px] font-bold text-zinc-400 uppercase tracking-widest">{t.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-16 md:space-y-24">
               <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-amber-600 rounded-full"></div>
                  <h2 className="text-xl md:text-3xl font-black text-zinc-900 uppercase tracking-tight italic">Criteria Mapping</h2>
                </div>
                <div className="grid gap-5">
                  {[...result.mandatoryCriteria, ...result.optionalCriteria].map((c, i) => (
                    <div key={i} className="criteria-card p-6 md:p-8 bg-[#FCFCFC] rounded-[2rem] border border-zinc-100">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[9px] font-black text-zinc-900 uppercase tracking-tight italic">{c.title}</span>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${c.met ? 'bg-green-50 text-green-800 border-green-300' : 'bg-amber-50 text-amber-800 border-amber-300'}`}>
                          {c.met ? 'Met' : 'Gap'}
                        </span>
                      </div>
                      <p className="text-zinc-600 italic font-medium leading-relaxed text-xs md:text-lg border-t border-zinc-50 pt-6">"{c.reasoning}"</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-zinc-900 p-8 md:p-16 rounded-[3rem] text-white border border-zinc-800">
                <h2 className="text-xl md:text-3xl font-black mb-10 md:mb-16 uppercase tracking-tight italic text-amber-500">Tactical Roadmap</h2>
                <div className="space-y-8 md:space-y-12">
                  {result.recommendations?.map((rec, i) => (
                    <div key={i} className="flex gap-6 items-start pb-8 border-b border-zinc-800 last:border-0">
                      <span className="text-amber-500 font-serif italic text-4xl md:text-6xl opacity-90 leading-none">{i+1}</span>
                      <p className="text-sm md:text-xl text-zinc-300 leading-relaxed italic font-light tracking-wide pt-1">{rec}</p>
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