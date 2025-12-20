import React, { useState, useRef } from 'react';
import { AssessmentData } from '../types.ts';

interface AssessmentFormProps {
  onSubmit: (data: AssessmentData, fileNames: string[]) => void;
  error: string | null;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AssessmentData>({
    name: '',
    email: '',
    endorsementRoute: 'Arts & Culture (Fashion Design)',
    jobTitle: '',
    yearsOfExperience: '0-3 years (Emerging)',
    personalStatement: '',
    hasEvidence: false
  });
  const [isUploading, setIsUploading] = useState(false);
  const [fileList, setFileList] = useState<string[]>([]);

  const handleUploadClick = () => {
    if (fileList.length >= 6) {
      alert("Maximum of 6 evidence items reached.");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setIsUploading(true);
      const remainingSlots = 6 - fileList.length;
      // Fix: Cast Array.from(selectedFiles) to File[] to avoid 'unknown' type error when accessing 'name' property.
      const newFiles = (Array.from(selectedFiles) as File[])
        .slice(0, remainingSlots)
        .map(f => f.name);

      setTimeout(() => {
        setIsUploading(false);
        setFileList(prev => [...prev, ...newFiles]);
        setFormData(prev => ({ ...prev, hasEvidence: true }));
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 800);
    }
  };

  const removeFile = (index: number) => {
    const newList = fileList.filter((_, i) => i !== index);
    setFileList(newList);
    if (newList.length === 0) setFormData(prev => ({ ...prev, hasEvidence: false }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.personalStatement) {
      alert("Please fill in all required fields (Name, Email, Impact Summary).");
      return;
    }
    setIsSubmitting(true);
    onSubmit(formData, fileList);
  };

  return (
    <div className="max-w-[800px] mx-auto py-16 px-6 animate-scale-up">
      <div className="bg-white rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.04)] overflow-hidden border border-zinc-100 p-12">
        {error && (
          <div className="mb-10 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600 animate-fade-in">
            <i className="fas fa-exclamation-circle text-xl"></i>
            <p className="text-sm font-bold tracking-tight">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-3">
                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.15em]">Candidate Name</label>
                <input 
                  required 
                  type="text" 
                  placeholder="Full legal name"
                  value={formData.name} 
                  onChange={e => setFormData(p => ({...p, name: e.target.value}))} 
                  className="w-full border-b border-zinc-100 py-3 outline-none focus:border-[#D4AF37] text-base font-medium placeholder:text-zinc-200 transition-colors bg-transparent"
                />
             </div>
             <div className="space-y-3">
                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.15em]">Email Address</label>
                <input 
                  required 
                  type="email" 
                  placeholder="Results & Invoice email"
                  value={formData.email} 
                  onChange={e => setFormData(p => ({...p, email: e.target.value}))} 
                  className="w-full border-b border-zinc-100 py-3 outline-none focus:border-[#D4AF37] text-base font-medium placeholder:text-zinc-200 transition-colors bg-transparent"
                />
             </div>
          </div>

          <div className="space-y-5">
            <label className="flex items-center gap-3 text-[13px] font-bold text-[#1A1A1A] uppercase tracking-wide">
              <i className="fas fa-briefcase text-zinc-400"></i>
              Endorsement Route
            </label>
            <div className="relative">
              <select
                value={formData.endorsementRoute}
                onChange={e => setFormData(prev => ({ ...prev, endorsementRoute: e.target.value }))}
                className="w-full bg-[#F8F9FA] border border-zinc-200 rounded-xl px-5 py-4 text-zinc-800 font-semibold focus:ring-1 focus:ring-[#D4AF37] outline-none appearance-none cursor-pointer"
              >
                <option>Arts & Culture (Fashion Design)</option>
                <option>Arts & Culture (Visual Arts)</option>
                <option>Arts & Culture (Music)</option>
                <option>Digital Technology (Technical)</option>
                <option>Digital Technology (Business)</option>
                <option>Architecture</option>
                <option>Film & Television</option>
              </select>
              <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none text-xs"></i>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-5">
              <label className="text-[13px] font-bold text-[#1A1A1A] uppercase tracking-wide">Current Job Title</label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={e => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                placeholder="e.g. Creative Director"
                className="w-full border-b border-zinc-100 py-4 text-lg font-medium text-zinc-900 placeholder:text-zinc-200 focus:border-[#D4AF37] outline-none transition-all bg-transparent"
              />
            </div>
            <div className="space-y-5">
              <label className="text-[13px] font-bold text-[#1A1A1A] uppercase tracking-wide">Years of Experience</label>
              <div className="relative">
                <select
                  value={formData.yearsOfExperience}
                  onChange={e => setFormData(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                  className="w-full bg-transparent border-b border-zinc-100 py-4 text-lg font-medium text-zinc-800 outline-none appearance-none cursor-pointer"
                >
                  <option>0-3 years (Emerging)</option>
                  <option>3-10 years (Professional)</option>
                  <option>10+ years (Leader)</option>
                </select>
                <i className="fas fa-chevron-down absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none text-xs"></i>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <label className="flex items-center gap-3 text-[13px] font-bold text-[#1A1A1A] uppercase tracking-wide">
              <i className="far fa-user text-zinc-400"></i>
              Personal Statement / Impact Summary
            </label>
            <textarea
              required
              rows={5}
              value={formData.personalStatement}
              onChange={e => setFormData(prev => ({ ...prev, personalStatement: e.target.value }))}
              placeholder="Briefly describe your significant achievements, international recognition, and why you are a leader in your field..."
              className="w-full bg-white border border-zinc-200 rounded-2xl p-6 text-zinc-600 text-base font-medium focus:ring-1 focus:ring-[#D4AF37] outline-none resize-none placeholder:text-zinc-200 leading-relaxed shadow-sm"
            />
          </div>

          <div className="space-y-8 pt-4">
            <div className="flex justify-between items-end">
              <label className="flex items-center gap-3 text-[13px] font-bold text-[#1A1A1A] uppercase tracking-wide">
                <i className="far fa-file-alt text-zinc-400"></i>
                Evidence Documents
              </label>
              <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">{6 - fileList.length} Slots Available</span>
            </div>

            <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-2xl p-6 flex gap-5 shadow-sm">
              <div className="text-[#D97706] mt-1">
                <i className="far fa-lightbulb text-xl"></i>
              </div>
              <div className="space-y-1">
                <h4 className="text-[12px] font-black text-zinc-800 uppercase tracking-wider">Recommended Evidence:</h4>
                <p className="text-[13px] text-zinc-500 font-medium leading-relaxed">
                  Upload PDF or Images of lookbooks, press, exhibition flyers, or international awards.
                </p>
              </div>
            </div>

            <input 
              type="file" 
              multiple 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.png,.jpg,.jpeg"
            />
            
            <div className="flex flex-wrap gap-8 items-start">
              <div 
                onClick={handleUploadClick}
                className={`w-full md:w-64 h-80 rounded-[40px] flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group relative bg-white ${fileList.length > 0 ? 'dashed-border-amber shadow-sm' : 'dashed-border hover:bg-zinc-50'}`}
              >
                {!isUploading ? (
                  <>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${fileList.length > 0 ? 'bg-[#22C55E] text-white shadow-lg' : 'bg-zinc-50 text-zinc-300 group-hover:text-[#D97706]'}`}>
                      <i className={`fas ${fileList.length > 0 ? 'fa-check' : 'fa-arrow-up-from-bracket'} text-2xl`}></i>
                    </div>
                    <div className="text-center">
                      <p className={`text-[18px] font-black uppercase tracking-[0.3em] ${fileList.length > 0 ? 'text-[#A1A1AA]' : 'text-zinc-300'}`}>
                        {fileList.length > 0 ? 'READY' : 'UPLOAD'}
                      </p>
                      <p className="text-[10px] font-black text-[#E4E4E7] uppercase tracking-[0.2em] -mt-1">ADD FILE</p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-zinc-50 border-t-amber-500 rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest animate-pulse">Syncing...</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-[320px] space-y-4">
                {fileList.map((name, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-[#F9FAFB] border border-zinc-100 rounded-2xl group animate-fade-in hover:border-amber-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#D4AF37]">
                        <i className="fas fa-file-contract"></i>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-zinc-800 truncate max-w-[220px]">{name}</span>
                        <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Verified</span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeFile(i)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-300 hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                      <i className="fas fa-trash-alt text-[10px]"></i>
                    </button>
                  </div>
                ))}
                {fileList.length === 0 && (
                  <div className="h-full min-h-[200px] flex items-center justify-center border-2 border-dashed border-zinc-50 rounded-[32px] p-12 text-zinc-200">
                    <div className="text-center opacity-30">
                      <i className="fas fa-cloud-upload-alt text-4xl mb-4"></i>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Evidence Items Found</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-7 font-bold rounded-2xl transition-all shadow-xl active:scale-[0.98] text-base uppercase tracking-widest mt-12 ${isSubmitting ? 'bg-zinc-400 cursor-not-allowed' : 'bg-[#1A1A1A] hover:bg-black text-white'}`}
          >
            {isSubmitting ? 'Initializing AI Engine...' : 'Run Expert AI Analysis'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssessmentForm;