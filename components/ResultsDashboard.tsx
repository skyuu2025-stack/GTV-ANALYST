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
  const [wechatFeedback, setWechatFeedback] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isPremium) {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 25;
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

  // Use dynamic origin to prevent 404/Page Not Found errors
  const getShareUrl = () => {
    return window.location.origin;
  };

  const shareText = `I just received my UK Global Talent Visa eligibility score: ${result.probabilityScore}%! Check your GTV readiness with this AI audit:`;

  const copyToClipboard = () => {
    const finalUrl = getShareUrl();
    navigator.clipboard.writeText(`${shareText} ${finalUrl}`);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleShare = (platform: 'wechat' | 'linkedin' | 'facebook') => {
    let url = '';
    const encodedUrl = encodeURIComponent(getShareUrl());
    const encodedText = encodeURIComponent(shareText);

    switch (platform) {
      case 'wechat':
        copyToClipboard();
        setWechatFeedback(true);
        setTimeout(() => setWechatFeedback(false), 2000);
        return;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
    }
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
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
        .blur-overlay {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
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
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2">
                <p className="text-zinc-500 text-sm md:text-lg font-medium italic">{data.endorsementRoute}</p>
                <span className="hidden md:block w-1.5 h-1.5 bg-zinc-200 rounded-full"></span>
                <span className="text-[10px] font-black text-zinc-900 uppercase tracking-widest bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100 inline-block">
                  Field: {result.fieldAnalysis}
                </span>
              </div>
              
              <div className="pt-6 flex flex-col items-center md:items-start gap-3 print:hidden">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Share Readiness Score</p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleShare('wechat')} 
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${wechatFeedback ? 'bg-green-50 border-green-300 text-green-600' : 'border-zinc-200 text-zinc-500 hover:text-[#07C160]'}`}
                    title="Share on WeChat"
                  >
                    <i className={`fa-brands ${wechatFeedback ? 'fa-check' : 'fa-weixin'}`}></i>
                  </button>
                  <button 
                    onClick={() => handleShare('linkedin')} 
                    className="w-9 h-9 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-[#0077b5] transition-all"
                    title="Share on LinkedIn"
                  >
                    <i className="fa-brands fa-linkedin-in"></i>
                  </button>
                  <button 
                    onClick={copyToClipboard} 
                    className={`h-9 px-4 rounded-full border flex items-center gap-2 transition-all ${copyFeedback ? 'bg-green-50 border-green-300 text-green-800' : 'border-zinc-200 text-zinc-500'}`}
                    title="Copy Link"
                  >
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
            <span className="text-[9px] font-black text-amber-700 uppercase tracking-[0.4em] mb-3 md:mb-4 block">Summary Verdict</span>
            <p className="text-base md:text-2xl text-zinc-900 leading-relaxed font-serif italic">"{result.summary}"</p>
          </div>

          <div className="space-y-12 md:space-y-16 mb-16">
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-8 bg-amber-600 rounded-full"></div>
                <h2 className="text-xl md:text-3xl font-black text-zinc-900 uppercase tracking-tight italic">Criteria Benchmark Audit</h2>
              </div>
              
              {!isPremium && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 animate-fade-in">
                  <i className="fas fa-info-circle text-amber-600"></i>
                  <p className="text-[10px] font-bold text-amber-900 uppercase tracking-tight italic leading-snug">
                    Displaying partial audit. Upgrade to unlock full evidence mapping and tactical reasoning for each criterion.
                  </p>
                </div>
              )}

              <div className="grid gap-5">
                {[...result.mandatoryCriteria, ...result.optionalCriteria].map((c, i) => (
                  <div key={i} className={`criteria-card p-6 md:p-8 bg-[#FCFCFC] rounded-[2rem] border transition-all ${isPremium ? 'border-zinc-100' : 'border-zinc-50 hover:border-zinc-200'}`}>
                    <div className="flex justify-between items-center mb-6">
                      <div className="space-y-1">
                        <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest">{i < result.mandatoryCriteria.length ? 'Mandatory Requirement' : 'Optional Requirement'}</span>
                        <h4 className="text-[11px] md:text-sm font-black text-zinc-900 uppercase tracking-tight italic">{c.title}</h4>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm ${c.met ? 'bg-green-50 text-green-800 border-green-300' : 'bg-amber-50 text-amber-800 border-amber-300'}`}>
                        {c.met ? 'Potential Met' : 'Evidence Gap'}
                      </span>
                    </div>
                    
                    <div className="relative">
                      {!isPremium && (
                        <div className="absolute inset-0 blur-overlay flex items-center justify-center z-10 rounded-xl">
                          <button onClick={onUpgrade} className="bg-zinc-900 text-white px-5 py-2 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl active:scale-95">
                            Unlock Reasoning
                          </button>
                        </div>
                      )}
                      <p className={`text-zinc-600 italic font-medium leading-relaxed text-xs md:text-lg border-t border-zinc-50 pt-6 transition-all ${!isPremium ? 'opacity-20 blur-[1px] select-none' : ''}`}>
                        {c.reasoning}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {isPremium ? (
              <section className="bg-zinc-900 p-8 md:p-16 rounded-[3rem] text-white border border-zinc-800 shadow-2xl animate-fade-in">
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
            ) : (
              <div className="bg-zinc-900 p-8 md:p-16 rounded-[2.5rem] text-center text-white space-y-6 md:space-y-8 shadow-2xl print:hidden border border-zinc-800">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-600/10 border border-amber-600/30 rounded-full flex items-center justify-center text-amber-600 text-xl mx-auto animate-pulse">
                  <i className="fas fa-lock"></i>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl md:text-4xl font-black uppercase italic tracking-tighter">Full Evidence Audit Locked</h3>
                  <p className="text-zinc-300 text-xs md:text-lg max-w-xl mx-auto font-light italic leading-relaxed opacity-90">
                    Get your detailed evidence gap mapping, criteria-by-criteria reasoning, and the 5-step tactical success roadmap.
                  </p>
                </div>
                
                {result.evidenceGap && result.evidenceGap.length > 0 && (
                  <div className="max-w-md mx-auto bg-white/5 p-6 rounded-2xl border border-white/10 text-left">
                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest block mb-2">Priority Evidence Gap Preview</span>
                    <p className="text-zinc-200 text-xs italic font-medium leading-relaxed">
                      "1. {result.evidenceGap[0]}"
                    </p>
                    <p className="text-zinc-500 text-[8px] mt-4 uppercase font-black tracking-widest text-center">Plus {result.evidenceGap.length - 1} more identified gaps in premium report.</p>
                  </div>
                )}

                <button 
                  onClick={onUpgrade} 
                  className="w-full md:w-auto px-10 py-4 bg-amber-600 text-white font-black rounded-xl uppercase tracking-widest text-[10px] hover:bg-amber-500 transition-all shadow-xl active:scale-95"
                >
                  Unlock Premium Report ($19)
                </button>
              </div>
            )}
          </div>

          {!isPremium && (
            <div className="pt-10 print:hidden border-t border-zinc-100">
              <div className="text-center mb-8">
                 <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em]">Route Success Stories</h3>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;