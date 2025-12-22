import React, { useRef, useEffect } from 'react';

const AssetGenerator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawIcon = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background - Deep Professional Black
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, 1024, 1024);

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

    // The "G" Logo
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 600px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
    ctx.shadowBlur = 40;
    ctx.fillText('G', 512, 512);
  };

  useEffect(() => {
    drawIcon();
  }, []);

  const downloadIcon = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'app-icon-1024.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm space-y-8">
      <div className="flex justify-between items-center">
         <h3 className="font-black text-xl uppercase tracking-tighter italic text-zinc-900">Icon Studio</h3>
         <button 
           onClick={downloadIcon}
           className="px-6 py-3 bg-[#D4AF37] text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg"
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
           <p className="text-zinc-500 text-sm font-medium italic">This generator creates a production-ready 1024x1024 icon file for the App Store. The design uses a deep onyx background with a centered white serif "G" inside a golden orbital ring.</p>
           <div className="flex gap-4">
              <div className="flex flex-col items-center">
                 <div className="w-12 h-12 bg-black rounded-xl border border-zinc-100 flex items-center justify-center text-white text-xs font-black">G</div>
                 <span className="text-[8px] font-bold text-zinc-300 mt-1">iOS Home</span>
              </div>
              <div className="flex flex-col items-center">
                 <div className="w-8 h-8 bg-black rounded-lg border border-zinc-100 flex items-center justify-center text-white text-[8px] font-black">G</div>
                 <span className="text-[8px] font-bold text-zinc-300 mt-1">Settings</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AssetGenerator;