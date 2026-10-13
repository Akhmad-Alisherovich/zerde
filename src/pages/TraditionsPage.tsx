import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight, 
  BookOpen, 
  Film, 
  Bot, 
  HelpCircle,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { TRADITIONS_DATA } from '../data/traditionsData';

export const TraditionsPage: React.FC = () => {
  const [filterTag, setFilterTag] = useState<string>('Барлығы');
  const navigate = useNavigate();

  const tags = ['Барлығы', 'Мереке', 'Отбасы', 'Ынтымақ', 'Қонақжайлық', 'UNESCO'];

  const filteredTraditions = TRADITIONS_DATA.filter(t => {
    if (filterTag === 'Барлығы') return true;
    if (filterTag === 'Мереке') return t.tags.includes('Мереке') || t.tags.includes('Амал');
    if (filterTag === 'Отбасы') return t.tags.includes('Отбасы') || t.tags.includes('Бала тәрбиесі');
    if (filterTag === 'Ынтымақ') return t.tags.includes('Ынтымақ') || t.tags.includes('Бірлік');
    if (filterTag === 'Қонақжайлық') return t.tags.includes('Қонақжайлық') || t.tags.includes('Көршілік');
    if (filterTag === 'UNESCO') return t.tags.includes('UNESCO');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#051B44] text-[#F8FCFF]">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-[#041433] border-b border-[#00BFFF]/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link to="/" className="hover:text-[#00BFFF] transition-colors">Басты бет</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#00BFFF] font-semibold">6 Дәстүр</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#062B65] border border-[#D49A35]/40 text-[#D49A35] text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                4-Бөлім • Тексерілген этномәдени қор
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif">
                Алты Интерактивті Ұлттық Дәстүр
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
                Әр карточка UNESCO және академиялық дереккөздерге негізделген. Төмендегі карточкаларды басу арқылы
                олардың терең тәрбиелік мағынасын, ғылыми дәйектемесін және рефлексиялық сұрақтарын жеке бетте зерттеңіз.
              </p>
            </div>

            <Link
              to="/ai-assistant"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] font-bold text-xs sm:text-sm shadow-cyan-glow transition-all self-start md:self-auto shrink-0"
            >
              <Bot className="w-4 h-4" />
              <span>ЖИ-көмекшіге өту</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Tags Filter */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-white/10">
            <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#00BFFF]" />
              Сүзгі:
            </span>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterTag === tag
                    ? 'bg-[#00BFFF] text-[#051B44] shadow-cyan-glow'
                    : 'bg-[#062B65]/70 text-slate-300 hover:text-white hover:bg-[#0B357A]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6 Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTraditions.map((tradition) => (
            <div
              key={tradition.id}
              onClick={() => navigate(`/traditions/${tradition.id}`)}
              className="group glass-card rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between transform hover:-translate-y-2 transition-all duration-300 border border-[#00BFFF]/20 hover:border-[#00BFFF]/60 shadow-xl"
            >
              {/* Card Image with Badges */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                <img
                  src={tradition.image}
                  alt={tradition.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081D47] via-transparent to-black/30" />
                
                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#051B44]/90 backdrop-blur-md border border-[#00BFFF]/40 text-xs font-extrabold text-[#00E5FF] shadow-sm">
                    {tradition.code}
                  </span>
                  {tradition.tags.includes('UNESCO') && (
                    <span className="px-2 py-0.5 rounded-lg bg-[#D49A35]/90 text-[10px] font-bold text-[#051B44] shadow-sm">
                      UNESCO
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00BFFF]/80 backdrop-blur-md text-[#051B44] text-[10px] font-bold shadow-sm">
                  <Film className="w-3 h-3" />
                  <span>Фото & Бейне</span>
                </div>

                {/* Bottom Card Title Overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-xl font-bold text-white font-serif group-hover:text-[#00BFFF] transition-colors">
                    {tradition.name}
                  </h3>
                  <div className="text-xs text-amber-300/90 font-medium">
                    {tradition.subtitle}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="inline-block px-2.5 py-1 rounded-md bg-[#00BFFF]/10 border border-[#00BFFF]/25 text-[11px] text-[#00E5FF] font-semibold mb-2">
                    Негізгі құндылық: {tradition.coreValue}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {tradition.description}
                  </p>
                </div>

                {/* Reflection Question Hint */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 text-[#D49A35] font-semibold mb-1">
                    <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Ойлану сұрағы:</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                    "{tradition.reflectionQuestion}"
                  </p>
                </div>

                {/* Open Action Button */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#00BFFF] group-hover:text-white">
                  <span>Толық карточканы ашу</span>
                  <div className="w-7 h-7 rounded-lg bg-[#00BFFF]/20 flex items-center justify-center group-hover:bg-[#00BFFF] group-hover:text-[#051B44] transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Route Navigation Bar */}
      <div className="bg-[#030F26] border-t border-[#00BFFF]/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/modules"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Алдыңғы: 4 Модуль</span>
          </Link>

          <div className="text-xs text-slate-400 text-center">
            «Зерде» 2026 • 6 Этномәдени Оқу Карточкасы
          </div>

          <Link
            to="/ai-assistant"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] text-xs sm:text-sm font-bold transition-all shadow-cyan-glow"
          >
            <span>Келесі: ЖИ-көмекші</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
