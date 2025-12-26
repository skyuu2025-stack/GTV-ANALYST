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
    endorsementRoute: 'Digital Technology (Technical)',
    jobTitle: '',
    yearsOfExperience: '3-10 years (Professional)',
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
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Identity Check</h2>
              <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest">Step 1 of 3: Basic Details</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Legal Full Name</label>
                <input required type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} className="w-full border-b border-zinc-200 py-4 outline-none focus:border-amber-600 text-lg font-bold bg-transparent" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email Address</label>
                <input required type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} className="w-full border-b border-zinc-200 py-4 outline-none focus:border-amber-600 text-lg font-bold bg-transparent" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Professional Profile</h2>
              <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest">Step 2 of 3: Endorsement Route</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Endorsement Body</label>
                <select value={formData.endorsementRoute} onChange={e => setFormData(p => ({...p, endorsementRoute: e.target.value}))} className="w-full bg-zinc-50 p-4 rounded-xl font-bold appearance-none border border-zinc-100">
                  <option>Digital Technology (Technical)</option>
                  <option>Digital Technology (Business)</option>
                  <option>Arts & Culture (Visual Arts)</option>
                  <option>Arts & Culture (Fashion Design)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Years of Experience</label>
                <select value={formData.yearsOfExperience} onChange={e => setFormData(p => ({...p, yearsOfExperience: e.target.value}))} className="w-full bg-zinc-50 p-4 rounded-xl font-bold appearance-none border border-zinc-100">
                  <option>0-3 years (Emerging)</option>
                  <option>3-10 years (Professional)</option>
                  <option>10+ years (Leader)</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Impact & Evidence</h2>
              <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest">Step 3 of 3: AI Submission</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Impact Summary</label>
                <textarea required rows={4} value={formData.personalStatement} onChange={e => setFormData(p => ({...p, personalStatement: e.target.value}))} placeholder="Key achievements and global impact..." className="w-full bg-zinc-50 p-4 rounded-2xl font-medium border border-zinc-100" />
              </div>
              <div className="p-6 border-2 border-dashed border-zinc-100 rounded-[2rem] text-center">
                <i className="fas fa-cloud-arrow-up text-zinc-300 text-3xl mb-3"></i>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Upload Portfolios (PDF/JPG)</p>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-4 px-6 py-2 bg-zinc-900 text-white rounded-full text-[10px] font-black uppercase">Browse</button>
                <input type="file" multiple ref={fileInputRef} className="hidden" onChange={e => {
                  const names = Array.from(e.target.files || []).map((f: File) => f.name);
                  setFileList(names);
                  setFormData(p => ({...p, hasEvidence: true}));
                }} />
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {fileList.map((f, i) => <span key={i} className="px-2 py-1 bg-zinc-50 rounded text-[8px] font-bold">{f}</span>)}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 pb-20">
      <div className="mb-10 flex gap-2">
        {[1,2,3].map(s => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${formStep >= s ? 'bg-zinc-900' : 'bg-zinc-100'}`}></div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {renderStep()}
        
        <div className="flex gap-4">
          {formStep > 1 && (
            <button type="button" onClick={handleBack} className="w-16 h-16 flex items-center justify-center border border-zinc-100 rounded-2xl text-zinc-400 active:scale-95 transition-all">
              <i className="fas fa-chevron-left"></i>
            </button>
          )}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 py-5 bg-zinc-900 text-white font-black rounded-2xl uppercase tracking-widest text-[11px] italic shadow-xl active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : formStep === 3 ? 'Finalize Audit' : 'Continue'}
          </button>
        </div>
      </form>

      {error && <p className="mt-8 text-amber-600 text-center font-black uppercase text-[10px] tracking-widest italic">{error}</p>}
    </div>
  );
};

export default AssessmentForm;