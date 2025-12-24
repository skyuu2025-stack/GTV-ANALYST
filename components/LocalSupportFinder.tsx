import React, { useState, useEffect } from 'react';
import { searchLocalVisaSupport } from '../geminiService.ts';

const GLOBAL_HUBS = [
  { name: "London", region: "UK", desc: "Global Talent Visa Headquarters", focus: "Main Endorsement Hub", slug: "london-visa-help" },
  { name: "Dubai", region: "UAE", desc: "MENA Innovation & Startup Hub", focus: "Business & Tech Routes", slug: "dubai-visa-help" },
  { name: "San Francisco", region: "USA", desc: "Silicon Valley Innovation Stream", focus: "Tech Nation Leaders", slug: "sf-global-talent" },
  { name: "Singapore", region: "Singapore", desc: "APAC Technology & Fintech Hub", focus: "Technical Talent", slug: "singapore-visa-support" }
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
          setError(err.message);
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
    <section className="py-16 md:py-24 px-6 max-w-6xl mx-auto" id="local-support" itemScope itemType="https://schema.org/LocalBusiness" aria-labelledby="local-support-title">
      <div className="bg-zinc-900 rounded-[3rem] md:rounded-[4rem] p-10 md:p-20 text-white border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-[100px] -z-0"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Proximity Intelligence</h3>
              <h2 id="local-support-title" className="text-3xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.9]" itemProp="name">Locate Expert GTV Support</h2>
              <p className="text-zinc-400 text-sm md:text-xl italic font-medium max-w-xl opacity-90 leading-relaxed" itemProp="description">
                Our AI-driven GEO engine maps your profile to certified UK Global Talent Visa consultants and solicitors in your immediate region.
              </p>
            </div>

            <div aria-live="polite" className="pt-4">
              {!results ? (
                <button 
                  onClick={handleFindSupport}
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-5 bg-white text-zinc-900 font-black rounded-2xl uppercase tracking-widest text-[11px] hover:bg-zinc-100 transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl active:scale-95 focus:ring-4 focus:ring-amber-500"
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
              ) : (
                <div className="space-y-8 animate-fade-in">
                  <div className="p-8 bg-white/5 border border-white/10 rounded-3xl text-zinc-300 text-sm md:text-lg leading-relaxed italic">
                    {results.text}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {results.grounding.map((chunk: any, i: number) => {
                      if (!chunk.maps) return null;
                      return (
                        <a 
                          key={i}
                          href={chunk.maps.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-6 bg-white rounded-2xl flex flex-col gap-3 hover:scale-[1.03] transition-all shadow-xl group border border-zinc-100"
                        >
                          <span className="text-zinc-900 font-black text-sm uppercase tracking-tight truncate group-hover:text-amber-700 transition-colors">
                            {chunk.maps.title || "Visa Advisor"}
                          </span>
                          <div className="flex items-center gap-2">
                            <i className="fas fa-external-link-alt text-amber-600 text-[10px]" aria-hidden="true"></i>
                            <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">Maps Direction</span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                  
                  <button 
                    onClick={() => setResults(null)} 
                    className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] hover:text-white transition-colors"
                  >
                    Reset Location Search
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8 lg:border-l lg:border-white/5 lg:pl-16">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Global Support Directory</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GLOBAL_HUBS.map(hub => (
                <div 
                  key={hub.name} 
                  id={hub.name.toLowerCase()}
                  className="p-6 rounded-3xl border transition-all flex flex-col justify-between h-full min-h-[150px] bg-white/5 border-white/5 hover:border-white/20"
                >
                  <div className="space-y-1">
                    <p className="text-amber-500 font-black text-[10px] uppercase tracking-widest">{hub.name}</p>
                    <p className="text-white font-bold text-xs uppercase tracking-tight">{hub.region}</p>
                    <p className="text-zinc-500 text-[10px] italic leading-tight line-clamp-2 min-h-[2.4em]">{hub.desc}</p>
                  </div>
                  <p className="text-zinc-600 text-[8px] font-black uppercase tracking-[0.2em] mt-4 border-t border-white/5 pt-2">
                    {hub.focus}
                  </p>
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