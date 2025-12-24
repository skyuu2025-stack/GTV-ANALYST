import React, { useState, useRef, useEffect } from 'react';
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

  useEffect(() => {
    const autofillData = localStorage.getItem('gtv_autofill');
    if (autofillData) {
      const parsed = JSON.parse(autofillData);
      setFormData(parsed);
      setFileList(["evidence_01.pdf", "press_clipping.jpg", "award_letter.pdf"]);
      localStorage.removeItem('gtv_autofill');
    }
  }, []);

  const handleUploadClick = () => {
    if (fileList.length >= 6) return;
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
    // Reset submitting state if error occurs (usually handled by props but safe to have a timeout)
    setTimeout(() => setIsSubmitting(false), 5000);
  };

  const enterSandboxMode = () => {
    localStorage.setItem('gtv_demo_mode', 'true');
    window.location.reload();
  };

  const getEvidenceGuidance = (route: string) => {
    if (route.includes('Fashion')) {
      return "Critical: Lookbooks, runway press clippings, award certificates, and high-impact commercial look-sheets.";
    }
    if (route.includes('Digital Technology')) {
      return "Critical: GitHub/Lab profiles, project portfolios, patent filings, business performance metrics, or high-level technical architecture docs.";
    }
    if (route.includes('Visual Arts') || route.includes('Architecture')) {
      return "Critical: Exhibition catalogs, portfolio images, project contracts, major commission proof, or design competition awards.";
    }
    if (route.includes('Music') || route.includes('Film')) {
      return "Critical: Distribution agreements, credit lists (IMDb), festival selection letters, media reviews, or broadcast confirmation.";
    }
    return "Upload high-impact professional evidence (PDF/JPG) mapped to your chosen endorsement criteria.";
  };

  const isQuotaError = error === "QUOTA_EXCEEDED";

  return (
    <div className="max-w-[800px] mx-auto py-6 md:py-16 px-4 md:px-6 animate-scale-up">
      <div className="bg-white rounded-[1.5rem] md:rounded-[32px] shadow-sm md:shadow-[0_4px_30px_rgba(0,0,0,0.04)] overflow-hidden border border-zinc-100 p-6 md:p-12">
        {error && (
          <div className="mb-8 p-6 bg-amber-50/50 border border-amber-200 rounded-[2rem] animate-fade-in" role="alert">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700">
                <i className="fas fa-robot text-lg" aria-hidden="true"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-amber-700 uppercase tracking-[0.2em]">System Status</span>
                <p className="text-sm font-bold text-amber-900">
                  {isQuotaError ? "High Traffic Volume Detected" : "Service Interruption"}
                </p>
              </div>
            </div>
            
            <p className="text-zinc-700 text-xs leading-relaxed mb-6 font-medium italic">
              {isQuotaError 
                ? "The AI engine is currently busy (quota reached). Please try again in 1 minute, or use Sandbox Mode to complete your audit." 
                : error}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                type="button"
                onClick={() => window.location.reload()}
                className="flex-1 bg-white border border-amber-300 text-amber-900 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-50 transition-all active:scale-95 focus:ring-2 focus:ring-amber-500"
              >
                <i className="fas fa-rotate-right mr-2" aria-hidden="true"></i> Retry
              </button>
              {isQuotaError && (
                <button 
                  type="button"
                  onClick={enterSandboxMode}
                  className="flex-1 bg-zinc-900 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all active:scale-95 focus:ring-2 focus:ring-amber-500"
                >
                  <i className="fas fa-flask mr-2" aria-hidden="true"></i> Enter Sandbox Mode
                </button>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
                <label htmlFor="name-input" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Candidate Name</label>
                <input 
                  id="name-input"
                  required 
                  aria-required="true"
                  type="text" 
                  placeholder="Full legal name"
                  value={formData.name} 
                  onChange={e => setFormData(p => ({...p, name: e.target.value}))} 
                  className="w-full border-b border-zinc-200 py-3 outline-none focus:border-[#B48F27] text-base font-medium placeholder:text-zinc-300 transition-colors bg-transparent"
                />
             </div>
             <div className="space-y-2">
                <label htmlFor="email-input" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email Address</label>
                <input 
                  id="email-input"
                  required 
                  aria-required="true"
                  type="email" 
                  placeholder="Results email"
                  value={formData.email} 
                  onChange={e => setFormData(p => ({...p, email: e.target.value}))} 
                  className="w-full border-b border-zinc-200 py-3 outline-none focus:border-[#B48F27] text-base font-medium placeholder:text-zinc-300 transition-colors bg-transparent"
                />
             </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="route-select" className="flex items-center gap-3 text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest">
              <i className="fas fa-briefcase text-zinc-400" aria-hidden="true"></i>
              Endorsement Route
            </label>
            <div className="relative">
              <select
                id="route-select"
                value={formData.endorsementRoute}
                onChange={e => setFormData(prev => ({ ...prev, endorsementRoute: e.target.value }))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-4 text-zinc-800 font-bold focus:ring-2 focus:ring-[#B48F27] outline-none appearance-none cursor-pointer"
              >
                <option>Arts & Culture (Fashion Design)</option>
                <option>Arts & Culture (Visual Arts)</option>
                <option>Arts & Culture (Music)</option>
                <option>Digital Technology (Technical)</option>
                <option>Digital Technology (Business)</option>
                <option>Architecture</option>
                <option>Film & Television</option>
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none text-[10px]" aria-hidden="true"></i>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="job-title-input" className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest">Job Title</label>
              <input
                id="job-title-input"
                type="text"
                value={formData.jobTitle}
                onChange={e => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                placeholder="e.g. Principal Architect"
                className="w-full border-b border-zinc-200 py-3 text-base font-medium text-zinc-900 placeholder:text-zinc-300 focus:border-[#B48F27] outline-none bg-transparent"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="experience-select" className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest">Experience</label>
              <div className="relative">
                <select
                  id="experience-select"
                  value={formData.yearsOfExperience}
                  onChange={e => setFormData(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                  className="w-full bg-transparent border-b border-zinc-200 py-3 text-base font-medium text-zinc-800 outline-none appearance-none cursor-pointer focus:border-[#B48F27]"
                >
                  <option>0-3 years (Emerging)</option>
                  <option>3-10 years (Professional)</option>
                  <option>10+ years (Leader)</option>
                </select>
                <i className="fas fa-chevron-down absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none text-[10px]" aria-hidden="true"></i>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="statement-textarea" className="flex items-center gap-3 text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest">
              <i className="far fa-user text-zinc-400" aria-hidden="true"></i>
              Impact Summary
            </label>
            <textarea
              id="statement-textarea"
              required
              aria-required="true"
              rows={4}
              value={formData.personalStatement}
              onChange={e => setFormData(prev => ({ ...prev, personalStatement: e.target.value }))}
              placeholder="Describe your career highlights, impact and achievements..."
              className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl p-4 md:p-6 text-zinc-700 text-sm font-medium focus:ring-2 focus:ring-[#B48F27] outline-none resize-none placeholder:text-zinc-300 transition-all"
            />
          </div>

          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label id="evidence-label" className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest">Evidence Documents</label>
                <span className="text-[8px] font-black text-amber-700 uppercase tracking-widest" aria-live="polite">{6 - fileList.length} Slots Left</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium italic bg-zinc-50 p-3 rounded-lg border border-zinc-100 leading-relaxed transition-all duration-300">
                <i className="fas fa-info-circle mr-2 text-amber-500"></i>
                {getEvidenceGuidance(formData.endorsementRoute)}
              </p>
            </div>

            <input 
              type="file" 
              multiple 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.png,.jpg,.jpeg" 
              aria-labelledby="evidence-label"
            />
            
            <div className="flex flex-col gap-4">
              <button 
                type="button"
                onClick={handleUploadClick} 
                className="w-full h-32 md:h-48 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all bg-white border-2 border-dashed border-zinc-200 hover:border-amber-300 active:bg-zinc-50 focus:ring-2 focus:ring-amber-500"
                aria-label="Upload evidence files (Max 6)"
              >
                {!isUploading ? (
                  <>
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${fileList.length > 0 ? 'bg-green-600 text-white shadow-lg' : 'bg-zinc-50 text-zinc-400'}`}>
                      <i className={`fas ${fileList.length > 0 ? 'fa-check' : 'fa-plus'}`} aria-hidden="true"></i>
                    </div>
                    <span className="text-[8px] font-black text-zinc-500 uppercase">Add Evidence</span>
                  </>
                ) : <div className="w-6 h-6 border-2 border-t-amber-600 rounded-full animate-spin" aria-label="Uploading..."></div>}
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list" aria-label="Uploaded evidence list">
                {fileList.map((name, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl animate-fade-in" role="listitem">
                    <span className="text-[10px] font-bold text-zinc-800 truncate pr-4">{name}</span>
                    <button 
                      type="button" 
                      onClick={() => removeFile(i)} 
                      className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-red-600 active:scale-90 transition-transform"
                      aria-label={`Remove file ${name}`}
                    >
                      <i className="fas fa-times text-[10px]" aria-hidden="true"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 md:py-6 bg-zinc-900 text-white font-black rounded-2xl md:rounded-3xl transition-all shadow-xl active:scale-95 uppercase tracking-widest text-sm italic mt-8 disabled:bg-zinc-400 focus:ring-4 focus:ring-amber-500"
            aria-label={isSubmitting ? "Analysis in progress" : "Run Expert Analysis"}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-circle-notch animate-spin" aria-hidden="true"></i>
                Analyzing...
              </span>
            ) : 'Run Expert Analysis'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssessmentForm;