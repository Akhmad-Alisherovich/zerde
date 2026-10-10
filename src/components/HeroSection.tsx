import React from 'react';
import { ArrowDown, Sparkles, Bot, Layers, Compass, BookOpen, CheckCircle2 } from 'lucide-react';
import { PROJECT_INFO } from '../data/researchData';

export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Deep Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/kazakh_landscape.jpg"
          alt="Қазақстан табиғаты, киіз үй және қыран"
          className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08] scale-105 transform duration-1000 ease-out"
        />
        {/* Layered gradients for legibility & atmospheric glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#051B44] via-[#051B44]/70 to-[#062B65]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#051B44]/90 via-transparent to-[#051B44]/80" />
        
        {/* Cyan grid overlay effect */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 191, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 191, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        
        {/* Competition Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-[#D49A35]/40 text-[#D49A35] text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 shadow-gold-glow animate-pulse">
          <Sparkles className="w-4 h-4 text-[#D49A35]" />
          <span>{PROJECT_INFO.competition} • Секция: {PROJECT_INFO.section}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F8FCFF] font-serif leading-[1.15] mb-4 drop-shadow-lg">
          <span className="block text-[#DDF5FF] text-xl sm:text-2xl md:text-3xl font-sans font-medium tracking-widest text-[#00BFFF] uppercase mb-2">
            Ғылыми зерттеу жобасы
          </span>
          <span className="bg-gradient-to-r from-[#F8FCFF] via-[#DDF5FF] to-[#D49A35] bg-clip-text text-transparent">
            {PROJECT_INFO.title}
          </span>
        </h1>

        {/* Subtitle pill */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="inline-block px-5 py-2.5 rounded-2xl bg-[#062B65]/80 backdrop-blur-md border border-[#00BFFF]/40 shadow-cyan-glow">
            <p className="text-sm sm:text-lg md:text-xl font-semibold text-[#00E5FF] tracking-wide">
              {PROJECT_INFO.subtitle}
            </p>
          </div>
        </div>

        {/* Author & Supervisor Card */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-6 py-3 rounded-2xl glass-panel border border-white/10 mb-10 text-xs sm:text-sm text-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-[#D49A35] font-semibold">Орындаған:</span>
            <span className="text-[#F8FCFF] font-medium">{PROJECT_INFO.author.name}</span>
            <span className="text-[#00BFFF]/80">({PROJECT_INFO.author.grade})</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="text-[#D49A35] font-semibold">Жетекшісі:</span>
            <span className="text-[#F8FCFF] font-medium">{PROJECT_INFO.supervisor.name}</span>
            <span className="text-slate-400">({PROJECT_INFO.supervisor.role})</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2 text-slate-300">
            <span>{PROJECT_INFO.school}, {PROJECT_INFO.region}</span>
          </div>
        </div>

        {/* 3 Main Action Triggers */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-14">
          <a
            href="#relevance"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold text-[#051B44] bg-[#00BFFF] hover:bg-[#38D2FF] shadow-cyan-glow flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>Жобамен танысу</span>
          </a>

          <a
            href="#modules"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold text-[#F8FCFF] bg-[#062B65]/90 hover:bg-[#0B357A] border border-[#00BFFF]/40 hover:border-[#00BFFF] flex items-center justify-center gap-2 transition-all shadow-glass"
          >
            <Bot className="w-4 h-4 text-[#00BFFF]" />
            <span>Цифрлық өнім (ЖИ + AR)</span>
          </a>

          <a
            href="#research"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold text-[#DDF5FF] bg-transparent hover:bg-white/5 border border-[#D49A35]/50 hover:border-[#D49A35] flex items-center justify-center gap-2 transition-all"
          >
            <Layers className="w-4 h-4 text-[#D49A35]" />
            <span>Зерттеу дизайны мен нәтижелері</span>
          </a>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto text-left">
          <div className="p-4 rounded-xl glass-panel border border-[#00BFFF]/20 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#00BFFF]/10 text-[#00BFFF] shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-white">6 Карточка</div>
              <div className="text-xs text-slate-300">Тексерілген этномәдени білім қоры</div>
            </div>
          </div>

          <div className="p-4 rounded-xl glass-panel border border-[#00BFFF]/20 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#00BFFF]/10 text-[#00BFFF] shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-white">ЖИ-Көмекші</div>
              <div className="text-xs text-slate-300">Дерекке шектелген түсіндіру логикасы</div>
            </div>
          </div>

          <div className="p-4 rounded-xl glass-panel border border-[#00BFFF]/20 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#00BFFF]/10 text-[#00BFFF] shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-white">3 AR Көрініс</div>
              <div className="text-xs text-slate-300">Маркерлік интерактивті кеңістік</div>
            </div>
          </div>

          <div className="p-4 rounded-xl glass-panel border border-[#D49A35]/30 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#D49A35]/15 text-[#D49A35] shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-white">A/B Тәжірибесі</div>
              <div className="text-xs text-slate-300">Бастапқы, қорытынды және сақталу тесті</div>
            </div>
          </div>
        </div>

      </div>

      {/* Down Scroll Indicator */}
      <a 
        href="#relevance"
        className="absolute bottom-3 left-1/2 transform -translate-x-1/2 p-2 rounded-full text-slate-400 hover:text-[#00BFFF] transition-colors z-10 animate-bounce"
        aria-label="Төмен жылжу"
      >
        <ArrowDown className="w-5 h-5" />
      </a>
    </section>
  );
};
