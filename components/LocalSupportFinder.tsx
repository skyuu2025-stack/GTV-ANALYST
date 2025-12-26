import React, { useState } from 'react';
import { searchLocalVisaSupport } from '../geminiService.ts';

const GLOBAL_HUBS = [
  { name: "London", region: "UK", desc: "Global Talent Visa Headquarters", focus: "Main Endorsement Hub", success: "94%" },
  { name: "Dubai", region: "UAE", desc: "MENA Innovation & Startup Hub", focus: "Business & Tech Routes", success: "88%" },
  { name: "San Francisco", region: "USA", desc: "Silicon Valley Innovation Stream", focus: "Tech Nation Leaders", success: "91%" },
  { name: "Singapore", region: "Singapore", desc: "APAC Technology & Fintech Hub", focus: "Technical Talent", success: "86%" }
];

const LocalSupportFinder: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{text: string, grounding: any[]} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFindSupport = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await searchLocalVisaSupport(latitude, longitude);
          setResults(data);
        } catch (err: any) {
          setError(err.message || "Failed to locate advisors.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Location access denied. Please use our global hub directory below.");
        setLoading(false);
      }
    );
  };

  return (
    <section className="py-12 md:py-16 px-6 max-w-6xl mx-auto" id="local-support" itemScope itemType="https://schema.org/LocalBusiness" aria-labelledby="local-support-title">
      <div className="bg-zinc-900 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 text-white border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-[80px] -z-0"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Proximity Intelligence</h3>
              <h2 id="local-support-title" className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic leading-[0.9]" itemProp="name">Locate Expert GTV Support</h2>
              <p className="text-zinc-400 text-xs md:text-lg italic font-medium max-w-xl opacity-90 leading-relaxed" itemProp="description">
                Our AI-driven GEO engine maps your profile to certified UK Global Talent Visa consultants and solicitors in your immediate region.
              </p>
            </div>

            <div aria-live="polite" className="pt-2">
              {!results ? (
                <div className="space-y-4">
                  <button 
                    onClick={handleFindSupport}
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-4 bg-white text-zinc-900 font-black rounded-xl uppercase tracking-widest text-[10px] hover:bg-zinc-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl active:scale-95 focus:ring-4 focus:ring-amber-500"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-circle-notch animate-spin" aria-hidden="true"></i>
                        Scanning Local Area...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-location-crosshairs" aria-hidden="true"></i>
                        Find Local Advisors
                      </>
                    )}
                  </button>
                  {error && <p className="text-amber-500 text-[9px] font-bold uppercase tracking-widest italic">{error}</p>}
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-zinc-300 text-xs md:text-sm leading-relaxed italic whitespace-pre-wrap">
                    {results.text}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {results.grounding.map((chunk: any, i: number) => {
                      if (!chunk.maps) return null;
                      const snippets = chunk.maps.placeAnswerSources?.reviewSnippets || [];
                      
                      return (
                        <a 
                          key={i} 
                          href={chunk.maps.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-xl group hover:border-amber-400 hover:shadow-2xl transition-all block no-underline decoration-transparent"
                          aria-label={`View ${chunk.maps.title || "Visa Specialist"} on Google Maps`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="space-y-1 pr-4">
                              <h4 className="text-zinc-900 font-black text-sm uppercase tracking-tight group-hover:text-amber-700 transition-colors">
                                {chunk.maps.title || "Visa Specialist"}
                              </h4>
                              <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">GTV Legal Partner</p>
                            </div>
                            <div className="px-4 py-2 bg-zinc-50 rounded-xl text-zinc-500 text-[9px] font-black uppercase tracking-widest group-hover:bg-zinc-900 group-hover:text-white transition-all flex items-center gap-2 shrink-0">
                              <i className="fas fa-map-marker-alt"></i> Directions
                            </div>
                          </div>
                          
                          {snippets.length > 0 ? (
                            <div className="space-y-3 mt-4">
                              <div className="flex items-center gap-2">
                                <span className="text-[8px] font-black text-zinc-300 uppercase tracking-[0.2em]">Verified Feedback</span>
                                <div className="h-px flex-1 bg-zinc-50"></div>
                              </div>
                              {snippets.slice(0, 1).map((s: any, idx: number) => (
                                <p key={idx} className="text-zinc-600 text-[11px] italic leading-relaxed border-l-2 border-amber-200 pl-3">
                                  "{s.text}"
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p className="text-zinc-400 text-[10px] italic font-medium mt-4">Highly rated immigration consultancy in your area.</p>
                          )}
                          <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-amber-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            Open in Maps <i className="fas fa-arrow-right text-[8px]"></i>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                  
                  <button 
                    onClick={() => setResults(null)} 
                    className="w-full text-center py-4 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] hover:text-white transition-colors border border-white/10 rounded-2xl"
                  >
                    Reset Location Search
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 lg:border-l lg:border-white/5 lg:pl-12">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Global Support Directory</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GLOBAL_HUBS.map(hub => (
                <div 
                  key={hub.name} 
                  className="p-5 rounded-2xl border transition-all flex flex-col justify-between h-full min-h-[140px] bg-white/5 border-white/5 hover:border-white/20 relative group"
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="text-amber-500 font-black text-[9px] uppercase tracking-widest">{hub.name}</p>
                      <span className="text-[7px] font-black text-green-500 uppercase">{hub.success} Success</span>
                    </div>
                    <p className="text-white font-bold text-[10px] uppercase tracking-tight">{hub.region}</p>
                    <p className="text-zinc-500 text-[9px] italic leading-tight line-clamp-2 min-h-[2.4em]">{hub.desc}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                    <p className="text-zinc-600 text-[7px] font-black uppercase tracking-[0.2em]">
                      {hub.focus}
                    </p>
                    <i className="fas fa-chevron-right text-[8px] text-zinc-800 group-hover:text-white transition-colors"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalSupportFinder;