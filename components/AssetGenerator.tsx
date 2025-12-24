
import React, { useRef, useEffect, useState } from 'react';
import { generateAILogo } from '../geminiService.ts';

const AssetGenerator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");

  const drawIcon = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background - Deep Professional Black
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle Neural Pattern (Static Version)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.05)';
    ctx.lineWidth = 1;
    for(let i=0; i<20; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random()*1024, Math.random()*1024);
      ctx.lineTo(Math.random()*1024, Math.random()*1024);
      ctx.stroke();
    }

    // Subtle Gradient Overlay
    const grd = ctx.createLinearGradient(0, 0, 1024, 1024);
    grd.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    grd.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 1024, 1024);

    // Main Circle Border - Golden
    ctx.beginPath();
    ctx.arc(512, 512, 420, 0, Math.PI * 2);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 15;
    ctx.stroke();

    // The "G" Logo - Visual Correction
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 620px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const centerX = 522; 
    const centerY = 535;

    ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
    ctx.shadowBlur = 40;
    ctx.fillText('G', centerX, centerY);
    
    ctx.shadowBlur = 0;
  };

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(drawIcon);
    } else {
      setTimeout(drawIcon, 500);
    }
  }, []);

  const downloadIcon = (src: string | HTMLCanvasElement, name: string) => {
    const link = document.createElement('a');
    link.download = `${name}.png`;
    link.href = typeof src === 'string' ? src : src.toDataURL('image/png');
    link.click();
  };

  const handleAIGeneration = async (style: string) => {
    setIsGenerating(true);
    const msgs = [
      "Analyzing global talent motifs...",
      "Synthesizing neural pathways...",
      "Refining golden ratio geometry...",
      "Applying 2025 AI aesthetic filters..."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      setLoadingMsg(msgs[i % msgs.length]);
      i++;
    }, 2000);

    try {
      const img = await generateAILogo(style);
      setAiImage(img);
    } catch (err) {
      alert("AI Studio is busy. Please try again in a moment.");
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Static Canvas Generator */}
      <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm space-y-8">
        <div className="flex justify-between items-center">
           <h3 className="font-black text-xl uppercase tracking-tighter italic text-zinc-900">Icon Studio (Static)</h3>
           <button 
             onClick={() => canvasRef.current && downloadIcon(canvasRef.current, 'app-icon-static')}
             className="px-6 py-3 bg-zinc-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
           >
             Download 1024px PNG
           </button>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-64 h-64 bg-zinc-50 rounded-[2.5rem] overflow-hidden shadow-inner flex items-center justify-center p-4">
             <canvas 
               ref={canvasRef} 
               width="1024" 
               height="1024" 
               className="w-full h-full rounded-[1.5rem]"
             />
          </div>
          <div className="flex-1 space-y-4">
             <p className="text-zinc-500 text-sm font-medium italic">Standard production icon. Deep onyx background, white "G", golden orbital ring. Hand-aligned for visual center perfection.</p>
          </div>
        </div>
      </div>

      {/* AI Evolution Lab */}
      <div className="bg-zinc-900 p-10 rounded-[3rem] border border-zinc-800 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
           <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter italic text-amber-500">AI Logo Evolution</h3>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Gemini 2.5 Flash Rendering</p>
           </div>
           <div className="flex gap-4">
              <button 
                onClick={() => handleAIGeneration('tech')}
                disabled={isGenerating}
                className="px-6 py-3 bg-white text-zinc-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-microchip"></i>}
                Tech Style
              </button>
              <button 
                onClick={() => handleAIGeneration('global')}
                disabled={isGenerating}
                className="px-6 py-3 border border-zinc-700 text-zinc-400 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-zinc-500 hover:text-white transition-all disabled:opacity-50"
              >
                Global Style
              </button>
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-center min-h-[300px] relative z-10">
          <div className="w-72 h-72 bg-black/40 border border-zinc-800 rounded-[3rem] overflow-hidden flex items-center justify-center relative group">
            {isGenerating ? (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest animate-pulse">{loadingMsg}</p>
              </div>
            ) : aiImage ? (
              <>
                <img src={aiImage} alt="AI Generated Logo" className="w-full h-full object-cover animate-fade-in" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => downloadIcon(aiImage, 'gtv-ai-logo')}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-zinc-900 shadow-xl active:scale-90 transition-transform"
                    title="Download AI Concept"
                  >
                    <i className="fas fa-download"></i>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center px-10">
                <i className="fas fa-sparkles text-zinc-700 text-4xl mb-4"></i>
                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em]">Ready for Synthesis</p>
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-6">
             <div className="space-y-2">
                <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Model Guidelines</span>
                <p className="text-zinc-400 text-sm font-medium italic leading-relaxed">
                  Generates 1024px PNG assets with "Neural Pathways" and "Global Silhouettes" embedded into the classic GTV gold ring. Ideal for high-definition branding and splash screens.
                </p>
             </div>
             
             <div className="grid grid-cols-2 gap-4 pt-4 opacity-40">
                <div className="h-px bg-zinc-800"></div>
                <div className="h-px bg-zinc-800"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetGenerator;
