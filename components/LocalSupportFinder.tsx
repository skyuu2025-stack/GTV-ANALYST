
import React, { useState } from 'react';
import { searchLocalVisaSupport } from '../geminiService.ts';

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
        setError("Location access denied. Please enable GPS.");
        setLoading(false);
      }
    );
  };

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto" id="local-support">
      <div className="bg-zinc-900 rounded-[3rem] p-10 md:p-16 text-white border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -z-0"></div>
        
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Proximity Intelligence</h3>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">Find Global Talent Support Nearby</h2>
            <p className="text-zinc-400 text-sm md:text-lg italic font-medium max-w-xl">
              Our GEO-engine connects you with top-rated immigration specialists, solicitors, and professional talent communities in your current location.
            </p>
          </div>

          {!results ? (
            <button 
              onClick={handleFindSupport}
              disabled={loading}
              className="px-10 py-5 bg-white text-zinc-900 font-black rounded-2xl uppercase tracking-widest text-[11px] hover:bg-zinc-100 transition-all flex items-center gap-4 disabled:opacity-50 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
            >
              {loading ? (
                <>
                  <i className="fas fa-circle-notch animate-spin"></i>
                  Locating Experts...
                </>
              ) : (
                <>
                  <i className="fas fa-location-crosshairs"></i>
                  Scan for Local GTV Experts
                </>
              )}
            </button>
          ) : (
            <div className="space-y-8 animate-fade-in">
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-zinc-300 text-sm leading-relaxed italic">
                {results.text}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.grounding.map((chunk: any, i: number) => {
                  if (!chunk.maps) return null;
                  return (
                    <a 
                      key={i}
                      href={chunk.maps.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-5 bg-white rounded-2xl flex flex-col gap-2 hover:scale-[1.02] transition-transform shadow-lg group"
                    >
                      <span className="text-zinc-900 font-black text-xs uppercase tracking-tight truncate group-hover:text-amber-600 transition-colors">
                        {chunk.maps.title || "Visa Advisor"}
                      </span>
                      <div className="flex items-center gap-2">
                        <i className="fas fa-map-marker-alt text-amber-500 text-[10px]"></i>
                        <span className="text-zinc-400 text-[9px] font-bold uppercase tracking-widest">Open in Maps</span>
                      </div>
                    </a>
                  );
                })}
              </div>
              
              <button onClick={() => setResults(null)} className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] hover:text-white transition-colors">Reset Search</button>
            </div>
          )}

          {error && (
            <p className="text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-400/10 p-4 rounded-xl border border-red-400/20">
              <i className="fas fa-exclamation-triangle mr-2"></i> {error}
            </p>
          )}
        </div>
      </div>
      <div className="mt-8 text-center">
         <p className="text-[9px] text-zinc-300 font-black uppercase tracking-widest">Searching locally for: Immigration Solicitors, Visa Consultants, Legal Aid</p>
      </div>
    </section>
  );
};

export default LocalSupportFinder;
