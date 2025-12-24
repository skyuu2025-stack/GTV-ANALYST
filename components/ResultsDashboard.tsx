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
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  if (!result || !data) return null;

  const chartData = [{ name: 'Prob', value: result.probabilityScore || 0, fill: '#B45309' }];
  const steps = ["Initializing...", "Confirming...", "Generating...", "Delivering...", "Success"];

  const getTestimonials = () => {
    if (data.endorsementRoute.includes("Digital Technology")) return ROUTE_TESTIMONIALS["Digital Technology"];
    if (data.endorsementRoute.includes("Fashion")) return ROUTE_TESTIMONIALS["Fashion"];
    return ROUTE_TESTIMONIALS["Arts & Culture"];
  };

  const currentTestimonials = getTestimonials();

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
        <div className={`mb-8 md:mb-12 bg-white border border-zinc-100 p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-xl relative overflow-hidden transition-all duration-500 ${isDone ? 'ring-2 ring-green-500/20' : ''}`} role="region" aria-label="Report processing status">
          <div className="absolute top-0 left-0 h-1 bg-green-600 transition-all duration-300" style={{ width: `${progress}%` }} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
            <div className="flex items-center gap-4 md:gap-6 flex-1 w-full">
              <div className={`w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center text-sm md:text-xl shadow-inner transition-all duration-700 ${isDone ? 'bg-green-700 text-white' : 'bg-zinc-50 text-amber-600 animate-pulse'}`} aria-hidden="true">
                <i className={`fas ${isDone ? 'fa-check' : 'fa-satellite-dish'}`}></i>
              </div>
              <div className="flex-grow space-y-2 md:space-y-4">
                <div className="flex justify-between items-end">
                   <p className="font-black text-[9px] md:text-xs uppercase tracking-widest text-zinc-900">{steps[deliveryStep]}</p>
                   <span className="text-[9px] md:text-[10px] font-black text-zinc-500">{Math.round(progress)}%</span>
                </div>
                <div className="h-1 w-full bg-zinc-50 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-900 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => window.print()} 
              disabled={!isDone}
              className={`w-full md:w-auto px-8 py-4 md:px-12 md:py-5 font-black rounded-xl md:rounded-2xl uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${isDone ? 'bg-zinc-900 text-white active:bg-black' : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'}`}
              aria-label="Download your audit report as a PDF"
            >
              <i className="fas fa-file-pdf" aria-hidden="true"></i> Save PDF
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl md:rounded-[4rem] shadow-2xl border border-zinc-100 overflow-hidden relative" id="results-content">
        <div className="p-6 md:p-20">
          <div className="flex flex-col items-center md:flex-row md:justify-between mb-12 md:mb-16 gap-10 md:gap-12">
            <div className="space-y-4 md:space-y-6 flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="w-8 h-[2px] bg-amber-600"></span>
                <span className="text-amber-700 font-black text-[10px] uppercase tracking-[0.4em]">Official Verdict</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-serif italic text-zinc-900 leading-tight tracking-tight">{data.name}</h1>
              <p className="text-zinc-500 text-base md:text-2xl font-medium italic">{data.endorsementRoute}</p>
              
              {/* Social Sharing Section */}
              <div className="pt-8 flex flex-col items-center md:items-start gap-4 print:hidden">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Share Your Readiness Score</p>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleShare('twitter')}
                    className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-all active:scale-90"
                    aria-label="Share score on X (formerly Twitter)"
                  >
                    <i className="fa-brands fa-x-twitter" aria-hidden="true"></i>
                  </button>
                  <button 
                    onClick={() => handleShare('linkedin')}
                    className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-[#0077b5] hover:border-[#0077b5] transition-all active:scale-90"
                    aria-label="Share score on LinkedIn"
                  >
                    <i className="fa-brands fa-linkedin-in" aria-hidden="true"></i>
                  </button>
                  <button 
                    onClick={() => handleShare('facebook')}
                    className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-[#1877f2] hover:border-[#1877f2] transition-all active:scale-90"
                    aria-label="Share score on Facebook"
                  >
                    <i className="fa-brands fa-facebook-f" aria-hidden="true"></i>
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    className={`h-10 px-5 rounded-full border flex items-center gap-2 transition-all active:scale-95 ${copyFeedback ? 'bg-green-50 border-green-300 text-green-800' : 'border-zinc-200 text-zinc-500 hover:text-zinc-900'}`}
                    aria-label="Copy share link to clipboard"
                  >
                    <i className={`fas ${copyFeedback ? 'fa-check' : 'fa-link'} text-xs`} aria-hidden="true"></i>
                    <span className="text-[9px] font-black uppercase tracking-widest">{copyFeedback ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 relative bg-zinc-50 rounded-[3rem] md:rounded-[4rem] flex items-center justify-center shadow-inner" role="img" aria-label={`Eligibility Score Chart showing ${result.probabilityScore}% success rate`}>
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
                <span className="text-4xl md:text-6xl font-black block text-zinc-900" aria-hidden="true">{result.probabilityScore}%</span>
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest opacity-80">Success Rate</span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-16 bg-zinc-50 rounded-3xl md:rounded-[3rem] border border-zinc-100 mb-12 md:mb-20 shadow-inner relative overflow-hidden">
            <span className="text-[10px] font-black text-amber-700 uppercase tracking-[0.4em] mb-4 md:mb-6 block">Summary</span>
            <p className="text-lg md:text-3xl text-zinc-900 leading-relaxed font-serif italic relative z-10">"{result.summary}"</p>
          </div>

          {!isPremium ? (
            <div className="space-y-12">
              <div className="bg-zinc-900 p-8 md:p-20 rounded-3xl md:rounded-[4rem] text-center text-white space-y-8 md:space-y-12 shadow-2xl print:hidden border border-zinc-800">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-amber-600/10 border border-amber-600/30 rounded-full flex items-center justify-center text-amber-600 text-2xl md:text-4xl mx-auto shadow-inner animate-pulse">
                  <i className="fas fa-lock" aria-hidden="true"></i>
                </div>
                <div className="space-y-4 md:space-y-6">
                  <h3 className="text-2xl md:text-5xl font-black uppercase italic tracking-tighter">Premium Audit Locked</h3>
                  <p className="text-zinc-300 text-sm md:text-xl max-w-2xl mx-auto font-light italic leading-relaxed opacity-90">Evidence gaps identified. Unlock full mapping and tactical roadmap.</p>
                </div>
                <button 
                  onClick={onUpgrade} 
                  className="w-full md:w-auto px-10 py-5 md:px-14 md:py-7 bg-amber-600 text-white font-black rounded-2xl md:rounded-3xl uppercase tracking-widest text-sm md:text-base hover:bg-amber-500 transition-all shadow-xl active:scale-95 focus:ring-4 focus:ring-amber-500"
                  aria-label="Unlock the full premium GTV audit report for $19"
                >
                  Upgrade Report ($19)
                </button>
              </div>

              {/* Route-Specific Social Proof */}
              <div className="pt-12 md:pt-20 print:hidden">
                <div className="text-center mb-10">
                   <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2">The Community Impact</h3>
                   <h2 className="text-xl md:text-2xl font-black text-zinc-900 uppercase italic">Successful Endorsements in {data.endorsementRoute.split('(')[0].trim()}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {currentTestimonials.map((t, idx) => (
                    <div key={idx} className="bg-white p-6 md:p-8 rounded-3xl border border-zinc-100 shadow-sm flex flex-col justify-between">
                      <p className="text-zinc-600 italic font-medium leading-relaxed mb-6 text-sm md:text-base">"{t.text}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 font-black text-xs uppercase shadow-inner">
                           {t.name.charAt(0)}
                        </div>
                        <div>
                           <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">{t.name}</h4>
                           <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">{t.role} • {t.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-20 md:space-y-32">
               <section aria-labelledby="criteria-mapping-title">
                <div className="flex items-center gap-4 md:gap-6 mb-10 md:mb-12">
                  <div className="w-2 h-10 md:w-2.5 md:h-12 bg-amber-600 rounded-full"></div>
                  <h2 id="criteria-mapping-title" className="text-2xl md:text-4xl font-black text-zinc-900 uppercase tracking-tight italic">Criteria Mapping</h2>
                </div>
                <div className="grid gap-6 md:gap-10">
                  {[...result.mandatoryCriteria, ...result.optionalCriteria].map((c, i) => (
                    <div key={i} className="criteria-card p-6 md:p-10 bg-[#FCFCFC] rounded-2xl md:rounded-[3.5rem] border border-zinc-100 group">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
                        <div className="space-y-1">
                           <span className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest">Standard {i+1}</span>
                           <h4 className="font-black text-zinc-900 uppercase tracking-tight text-lg md:text-2xl italic">{c.title}</h4>
                        </div>
                        <span className={`px-4 py-1.5 md:px-7 md:py-2.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border shadow-sm ${c.met ? 'bg-green-50 text-green-800 border-green-300' : 'bg-amber-50 text-amber-800 border-amber-300'}`}>
                          {c.met ? 'Met' : 'Gap'}
                        </span>
                      </div>
                      <p className="text-zinc-600 italic font-medium leading-relaxed text-sm md:text-xl border-t border-zinc-50 pt-6 md:pt-10">"{c.reasoning}"</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-zinc-900 p-8 md:p-24 rounded-3xl md:rounded-[4.5rem] text-white border border-zinc-800" aria-labelledby="tactical-roadmap-title">
                <h2 id="tactical-roadmap-title" className="text-2xl md:text-4xl font-black mb-12 md:mb-20 uppercase tracking-tight italic text-amber-500">
                   Tactical Roadmap
                </h2>
                <div className="space-y-12 md:space-y-20">
                  {result.recommendations?.map((rec, i) => (
                    <div key={i} className="flex gap-6 md:gap-10 items-start pb-10 md:pb-16 border-b border-zinc-800 last:border-0">
                      <span className="text-amber-500 font-serif italic text-3xl md:text-8xl opacity-90 leading-none" aria-hidden="true">{i+1}</span>
                      <p className="text-base md:text-2xl text-zinc-300 leading-relaxed italic font-light tracking-wide pt-2 md:pt-4">{rec}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Premium Completion Message */}
              <div className="pt-20 text-center border-t border-zinc-50 print:hidden">
                 <h2 className="text-2xl md:text-3xl font-black text-zinc-900 uppercase italic mb-4">Good Luck, {data.name.split(' ')[0]}!</h2>
                 <p className="text-zinc-500 font-medium italic text-sm md:text-base max-w-xl mx-auto">
                   You are now equipped with the data required for a competitive UK endorsement. This roadmap reflects the highest standards of the 2025 Home Office criteria.
                 </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;