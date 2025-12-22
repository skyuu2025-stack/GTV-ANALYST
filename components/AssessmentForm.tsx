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
      alert("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    onSubmit(formData, fileList);
    // Reset submission state if error occurs (handled by parent but this allows retry)
    setTimeout(() => setIsSubmitting(false), 3000);
  };

  return (
    <div className="max-w-[800px] mx-auto py-10 md:py-16 px-4 md:px-6 animate-scale-up">
      <div className="bg-white rounded-[2rem] md:rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.04)] overflow-hidden border border-zinc-100 p-8 md:p-12">
        {error && (
          <div className="mb-10 p-6 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4 text-amber-800 animate-fade-in">
            <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center shrink-0">
              <i className="fas fa-robot text-sm"></i>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">AI Engine Notice</p>
              <p className="text-sm font-bold tracking-tight leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10 md:space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">Candidate Name</label>
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
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">Email Address</label>
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

          <div className="space-y-4">
            <label className="flex items-center gap-3 text-[11px] font-black text-[#1A1A1A] uppercase tracking-widest">
              <i className="fas fa-briefcase text-zinc-300"></i>
              Endorsement Route
            </label>
            <div className="relative">
              <select
                value={formData.endorsementRoute}
                onChange={e => setFormData(prev => ({ ...prev, endorsementRoute: e.target.value }))}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-800 font-bold focus:ring-1 focus:ring-[#D4AF37] outline-none appearance-none cursor-pointer"
              >
                <option>Arts & Culture (Fashion Design)</option>
                <option>Arts & Culture (Visual Arts)</option>
                <option>Arts & Culture (Music)</option>
                <option>Digital Technology (Technical)</option>
                <option>Digital Technology (Business)</option>
                <option>Architecture</option>
                <option>Film & Television</option>
              </select>
              <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 pointer-events-none text-[10px]"></i>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-[#1A1A1A] uppercase tracking-widest">Current Job Title</label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={e => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                placeholder="e.g. Creative Director"
                className="w-full border-b border-zinc-100 py-3 text-base font-medium text-zinc-900 placeholder:text-zinc-200 focus:border-[#D4AF37] outline-none transition-all bg-transparent"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[11px] font-black text-[#1A1A1A] uppercase tracking-widest">Years of Experience</label>
              <div className="relative">
                <select
                  value={formData.yearsOfExperience}
                  onChange={e => setFormData(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                  className="w-full bg-transparent border-b border-zinc-100 py-3 text-base font-medium text-zinc-800 outline-none appearance-none cursor-pointer"
                >
                  <option>0-3 years (Emerging)</option>
                  <option>3-10 years (Professional)</option>
                  <option>10+ years (Leader)</option>
                </select>
                <i className="fas fa-chevron-down absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 pointer-events-none text-[10px]"></i>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 text-[11px] font-black text-[#1A1A1A] uppercase tracking-widest">
              <i className="far fa-user text-zinc-300"></i>
              Personal Statement / Impact Summary
            </label>
            <textarea
              required
              rows={4}
              value={formData.personalStatement}
              onChange={e => setFormData(prev => ({ ...prev, personalStatement: e.target.value }))}
              placeholder="Briefly describe your significant achievements, international recognition, and why you are a leader in your field..."
              className="w-full bg-zinc-50/50 border border-zinc-100 rounded-2xl p-6 text-zinc-600 text-sm md:text-base font-medium focus:ring-1 focus:ring-[#D4AF37] outline-none resize-none placeholder:text-zinc-200 leading-relaxed transition-all"
            />
          </div>

          <div className="space-y-8 pt-4">
            <div className="flex justify-between items-end">
              <label className="flex items-center gap-3 text-[11px] font-black text-[#1A1A1A] uppercase tracking-widest">
                <i className="far fa-file-alt text-zinc-300"></i>
                Evidence Documents
              </label>
              <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">{6 - fileList.length} Slots Left</span>
            </div>

            <div className="bg-amber-50/50 border border-amber-100/50 rounded-2xl p-5 flex gap-4">
              <div className="text-amber-500 mt-0.5">
                <i className="fas fa-info-circle text-sm"></i>
              </div>
              <p className="text-[11px] text-amber-700 font-bold leading-relaxed uppercase tracking-tight">
                Upload lookbooks, press links, or award letters. Max 6 items.
              </p>
            </div>

            <input 
              type="file" 
              multiple 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.png,.jpg,.jpeg"
            />
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div 
                onClick={handleUploadClick}
                className={`w-full md:w-48 h-48 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group relative bg-white border-2 border-dashed ${fileList.length > 0 ? 'border-amber-200 shadow-sm' : 'border-zinc-100 hover:border-amber-200 hover:bg-zinc-50'}`}
              >
                {!isUploading ? (
                  <>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${fileList.length > 0 ? 'bg-green-500 text-white' : 'bg-zinc-50 text-zinc-300 group-hover:text-amber-500'}`}>
                      <i className={`fas ${fileList.length > 0 ? 'fa-check' : 'fa-plus'} text-lg`}></i>
                    </div>
                    <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest group-hover:text-amber-500 transition-colors">Add Evidence</span>
                  </>
                ) : (
                  <div className="w-8 h-8 border-2 border-zinc-100 border-t-amber-500 rounded-full animate-spin"></div>
                )}
              </div>

              <div className="flex-1 w-full space-y-3">
                {fileList.map((name, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-100 rounded-xl group animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="text-amber-500 text-xs">
                        <i className="fas fa-file-pdf"></i>
                      </div>
                      <span className="text-[11px] font-bold text-zinc-800 truncate max-w-[150px] md:max-w-[300px]">{name}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-zinc-300 hover:text-red-500 transition-colors"
                    >
                      <i className="fas fa-times text-[10px]"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-6 md:py-8 font-black rounded-3xl transition-all shadow-xl active:scale-[0.98] text-sm md:text-base uppercase tracking-[0.2em] italic mt-8 ${isSubmitting ? 'bg-zinc-400 cursor-not-allowed text-white/50' : 'bg-zinc-900 hover:bg-black text-white'}`}
          >
            {isSubmitting ? 'Analyzing Data...' : 'Run Expert AI Analysis'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssessmentForm;