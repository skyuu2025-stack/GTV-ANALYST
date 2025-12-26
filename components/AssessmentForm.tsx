
import React, { useState, useRef, useEffect } from 'react';
import { AssessmentData } from '../types.ts';

interface AssessmentFormProps {
  onSubmit: (data: AssessmentData, fileNames: string[]) => void;
  error: string | null;
  initialData?: { name: string; email: string };
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit, error, initialData }) => {
  const [formStep, setFormStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AssessmentData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    endorsementRoute: '',
    jobTitle: '',
    yearsOfExperience: '',
    personalStatement: '',
    hasEvidence: false
  });
  const [fileList, setFileList] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || initialData.name,
        email: prev.email || initialData.email
      }));
    }
  }, [initialData]);

  const handleNext = () => setFormStep(prev => prev + 1);
  const handleBack = () => setFormStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formStep < 3) {
      handleNext();
      return;
    }
    setIsSubmitting(true);
    onSubmit(formData, fileList);
  };

  const renderStep = () => {
    switch (formStep) {
      case 1:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900">Identity Check</h2>
              <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest">Step 1 of 3: Basic Details</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Legal Full Name</label>
                <input required type="text" placeholder="Full name as it appears on passport" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} className="w-full border-b border-zinc-200 py-4 outline-none focus:border-amber-600 text-lg font-bold bg-transparent" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email Address</label>
                <input required type="email" placeholder="Professional email address" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} className="w-full border-b border-zinc-200 py-4 outline-none focus:border-amber-600 text-lg font-bold bg-transparent" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900">Professional Profile</h2>
              <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest">Step 2 of 3: Endorsement Route</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Endorsement Body</label>
                <div className="relative group">
                  <select 
                    required 
                    value={formData.endorsementRoute} 
                    onChange={e => setFormData(p => ({...p, endorsementRoute: e.target.value}))} 
                    className="w-full bg-zinc-50 p-5 pr-12 rounded-2xl font-bold appearance-none border border-zinc-100 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-zinc-900 text-sm md:text-base leading-snug cursor-pointer group-hover:border-zinc-200"
                  >
                    <option value="" disabled>Please select route</option>
                    <optgroup label="Digital Technology (Tech Nation)">
                      <option value="Digital Tech (Technical)">Digital Tech (Technical)</option>
                      <option value="Digital Tech (Business)">Digital Tech (Business)</option>
                    </optgroup>
                    <optgroup label="Arts & Culture (Arts Council)">
                      <option value="Fashion Design">Fashion Design</option>
                      <option value="Visual Arts">Visual Arts</option>
                      <option value="Music">Music</option>
                      <option value="Stage & Performing Arts">Stage & Performing Arts</option>
                      <option value="Architecture (RIBA)">Architecture (RIBA)</option>
                      <option value="Film & Television (PACT)">Film & Television (PACT)</option>
                    </optgroup>
                    <optgroup label="Academic & Research">
                      <option value="Science & Medicine">Science & Medicine</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Humanities & Social Science">Humanities & Social Science</option>
                    </optgroup>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                    <i className="fas fa-chevron-down text-sm"></i>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Years of Experience</label>
                <div className="relative group">
                  <select 
                    required 
                    value={formData.yearsOfExperience} 
                    onChange={e => setFormData(p => ({...p, yearsOfExperience: e.target.value}))} 
                    className="w-full bg-zinc-50 p-5 pr-12 rounded-2xl font-bold appearance-none border border-zinc-100 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-zinc-900 text-sm md:text-base cursor-pointer group-hover:border-zinc-200"
                  >
                    <option value="" disabled>Please select level</option>
                    <option value="0-3 years (Emerging)">0-3 years (Emerging)</option>
                    <option value="3-10 years (Professional)">3-10 years (Professional)</option>
                    <option value="10+ years (Leader)">10+ years (Leader)</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                    <i className="fas fa-chevron-down text-sm"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900">Impact & Evidence</h2>
              <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest">Step 3 of 3: AI Submission</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Impact Summary</label>
                <textarea required rows={4} value={formData.personalStatement} onChange={e => setFormData(p => ({...p, personalStatement: e.target.value}))} placeholder="Summarize your key achievements and global impact..." className="w-full bg-zinc-50 p-5 rounded-[1.5rem] font-medium border border-zinc-100 outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-zinc-800" />
              </div>
              <div className="p-8 border-2 border-dashed border-zinc-100 rounded-[2.5rem] text-center bg-zinc-50/30">
                <i className="fas fa-cloud-arrow-up text-zinc-300 text-3xl mb-4"></i>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Upload Portfolios (PDF/JPG)</p>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-5 px-8 py-3 bg-zinc-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all">Browse Files</button>
                <input type="file" multiple ref={fileInputRef} className="hidden" onChange={e => {
                  const names = Array.from(e.target.files || []).map((f: File) => f.name);
                  setFileList(names);
                  setFormData(p => ({...p, hasEvidence: true}));
                }} />
                {fileList.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    {fileList.map((f, i) => <span key={i} className="px-3 py-1.5 bg-white border border-zinc-100 rounded-lg text-[9px] font-bold text-zinc-600 shadow-sm animate-scale-up">{f}</span>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 pb-20">
      <div className="mb-12 flex gap-2">
        {[1,2,3].map(s => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${formStep >= s ? 'bg-zinc-900' : 'bg-zinc-100'}`}></div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-16">
        {renderStep()}
        
        <div className="flex gap-4">
          {formStep > 1 && (
            <button type="button" onClick={handleBack} className="w-16 h-16 flex items-center justify-center border border-zinc-100 rounded-2xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 active:scale-95 transition-all">
              <i className="fas fa-chevron-left"></i>
            </button>
          )}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 py-5 bg-zinc-900 text-white font-black rounded-2xl uppercase tracking-widest text-[11px] italic shadow-xl hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-circle-notch animate-spin"></i> Initializing...
              </span>
            ) : formStep === 3 ? 'Generate Audit Report' : 'Continue'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-10 p-5 bg-amber-50 rounded-2xl border border-amber-100 animate-shake">
          <p className="text-amber-800 text-center font-black uppercase text-[10px] tracking-widest italic">{error}</p>
        </div>
      )}
    </div>
  );
};

export default AssessmentForm;
