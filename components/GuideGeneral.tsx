import React from 'react';
import FAQSchema from './FAQSchema.tsx';
import { AppStep } from '../types.ts';

interface GuideProps {
  onStart: () => void;
  onNavigate: (step: AppStep) => void;
}

const GuideGeneral: React.FC<GuideProps> = ({ onStart, onNavigate }) => {
  const fields = [
    { 
      id: AppStep.GUIDE_TECH, 
      icon: 'fa-microchip', 
      title: 'Digital Technology', 
      body: 'Tech Nation',
      desc: 'For engineers, founders, and tech leaders.',
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      id: AppStep.GUIDE_FASHION, 
      icon: 'fa-shirt', 
      title: 'Fashion Design', 
      body: 'Arts Council England',
      desc: 'For designers with runway and press history.',
      color: 'bg-amber-50 text-amber-600'
    },
    { 
      id: AppStep.GUIDE_ARTS, 
      icon: 'fa-palette', 
      title: 'Arts & Culture', 
      body: 'Arts Council England',
      desc: 'Visual arts, dance, music, and literature.',
      color: 'bg-purple-50 text-purple-600'
    },
    { 
      id: AppStep.GUIDE_ARCH, 
      icon: 'fa-building-columns', 
      title: 'Architecture', 
      body: 'RIBA',
      desc: 'Leading architects and urban planners.',
      color: 'bg-zinc-50 text-zinc-600'
    },
    { 
      id: AppStep.GUIDE_FILM, 
      icon: 'fa-film', 
      title: 'Film & Television', 
      body: 'PACT',
      desc: 'Post-production, animation, and directing.',
      color: 'bg-red-50 text-red-600'
    },
    { 
      id: AppStep.GUIDE_SCIENCE, 
      icon: 'fa-flask', 
      title: 'Science & Research', 
      body: 'Royal Society / UKRI',
      desc: 'Academic leaders and research fellows.',
      color: 'bg-green-50 text-green-600'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 md:py-20 px-6 animate-fade-in space-y-16">
      <FAQSchema />
      
      {/* Hero Section */}
      <div className="space-y-6 text-center md:text-left">
        <div className="inline-block px-4 py-1.5 bg-zinc-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
          The Definitive Wiki
        </div>
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic text-zinc-900 leading-[0.85]">
          GLOBAL <br/> TALENT <br/> <span className="text-amber-600">ENCYCLOPEDIA</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-500 leading-relaxed italic font-medium max-w-2xl">
          Everything you need to know about the UK Global Talent Visa (GTV). 
          Navigate through endorsement bodies, criteria, and tactical insights.
        </p>
      </div>

      {/* Field Navigation Hub */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-zinc-900 rounded-full"></div>
          <h2 className="text-2xl font-black uppercase tracking-tight italic">Field-Specific Wikis</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map((field, i) => (
            <button
              key={i}
              onClick={() => onNavigate(field.id)}
              className="flex flex-col p-6 bg-white border border-zinc-100 rounded-[2.5rem] text-left hover:border-amber-200 hover:shadow-xl transition-all group"
            >
              <div className={`w-12 h-12 ${field.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <i className={`fas ${field.icon} text-lg`}></i>
              </div>
              <div className="space-y-1 mb-4">
                <h4 className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">{field.body}</h4>
                <h3 className="text-zinc-900 text-sm font-black uppercase tracking-tight italic">{field.title}</h3>
              </div>
              <p className="text-zinc-500 text-[11px] font-medium leading-relaxed italic line-clamp-2">
                {field.desc}
              </p>
              <div className="mt-6 flex items-center gap-2 text-[9px] font-black text-amber-600 uppercase tracking-widest">
                Explore Route <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* General Knowledge Sections */}
      <div className="grid gap-16 pt-12">
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic">Endorsement vs. Visa</h2>
          <div className="bg-zinc-50 p-8 rounded-[3rem] border border-zinc-100 space-y-4">
            <p className="text-zinc-600 leading-relaxed font-medium">
              The Global Talent route is a <span className="text-zinc-900 font-bold">two-stage process</span>.
            </p>
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">1</div>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-900">Endorsement</h4>
                <p className="text-[10px] text-zinc-500 font-medium italic">An expert body (e.g., Tech Nation) reviews your professional portfolio and impact.</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">2</div>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-900">Visa Application</h4>
                <p className="text-[10px] text-zinc-500 font-medium italic">Once endorsed, the Home Office performs identity, health, and security checks.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic">Common Global Talent Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Exceptional Talent', sub: 'Leaders with 5+ years experience', icon: 'fa-trophy' },
              { title: 'Exceptional Promise', sub: 'Emerging leaders / Early career', icon: 'fa-seedling' },
              { title: 'International Press', sub: 'Evidence of global recognition', icon: 'fa-newspaper' },
              { title: 'Industry Impact', sub: 'Patents, awards, or high revenue', icon: 'fa-chart-line' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-6 bg-white border border-zinc-100 rounded-3xl">
                <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400">
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900">{item.title}</h4>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-zinc-900 p-12 md:p-16 rounded-[4rem] text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl md:text-4xl font-black uppercase italic text-amber-500">Benchmark Your Profile</h2>
            <p className="text-zinc-400 text-sm md:text-lg italic font-medium max-w-xl mx-auto opacity-80">
              Don't guess your eligibility. Our AI evaluates your history against the exact frameworks mentioned in this Wiki.
            </p>
          </div>
          <button 
            onClick={onStart}
            className="w-full md:w-auto px-20 py-8 bg-white text-zinc-900 font-black rounded-[2rem] transition-all hover:bg-zinc-100 shadow-2xl text-sm tracking-widest uppercase italic active:scale-95"
          >
            Start Real-Time Audit
          </button>
        </section>
      </div>

      <footer className="pt-20 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">© 2025 GTV Assessor Wiki Hub</p>
        <div className="flex gap-6">
          <button 
            onClick={() => onNavigate(AppStep.PRIVACY)}
            className="text-[10px] font-black text-zinc-400 uppercase hover:text-zinc-900 transition-colors"
          >
            Privacy
          </button>
          <button 
            onClick={() => onNavigate(AppStep.CRITERIA)}
            className="text-[10px] font-black text-zinc-400 uppercase hover:text-zinc-900 transition-colors"
          >
            Criteria Mapping
          </button>
          <button 
            onClick={() => onNavigate(AppStep.API_DOCS)}
            className="text-[10px] font-black text-zinc-400 uppercase hover:text-zinc-900 transition-colors"
          >
            API Docs
          </button>
        </div>
      </footer>
    </div>
  );
};

export default GuideGeneral;