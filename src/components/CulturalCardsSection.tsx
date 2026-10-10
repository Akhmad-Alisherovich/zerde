import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  ExternalLink, 
  Maximize2, 
  X, 
  Bot, 
  Box, 
  Tag, 
  Share2,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { TRADITIONS_DATA } from '../data/traditionsData';
import { Tradition } from '../types';

interface CulturalCardsSectionProps {
  onAskChatbot: (traditionName: string) => void;
  onOpenARScenario: (scenarioId: string) => void;
}

export const CulturalCardsSection: React.FC<CulturalCardsSectionProps> = ({
  onAskChatbot,
  onOpenARScenario
}) => {
  const [selectedTradition, setSelectedTradition] = useState<Tradition | null>(null);
  const [filterTag, setFilterTag] = useState<string>('Барлығы');

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
    <section id="cards" className="py-20 bg-[#051B44] relative border-t border-[#00BFFF]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#062B65] border border-[#D49A35]/40 text-[#D49A35] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            4-Бөлім • Тексерілген этномәдени қор
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif mb-4">
            Алты Интерактивті Оқу Карточкасы
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Әр карточка академиялық дереккөздерге сүйеніп әзірленген. Карточканы басып, толық тәрбиелік мағынасын және рефлексия сұрағын ашыңыз.
          </p>

          {/* Tags Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
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

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTraditions.map((tradition) => (
            <div
              key={tradition.id}
              onClick={() => setSelectedTradition(tradition)}
              className="group glass-card rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between transform hover:-translate-y-1.5 transition-all duration-300"
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
                  {tradition.hasArScenario && (
                    <span className="px-2 py-0.5 rounded-lg bg-[#D49A35]/90 backdrop-blur-md text-[11px] font-bold text-[#051B44] flex items-center gap-1 shadow-sm">
                      <Box className="w-3 h-3" />
                      AR бар
                    </span>
                  )}
                </div>

                {/* Core Value Pill */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="px-3 py-1.5 rounded-xl bg-[#062B65]/90 backdrop-blur-md border border-[#D49A35]/40 text-xs text-[#F3BE5E] font-medium flex items-center gap-1.5 shadow-sm">
                    <Bookmark className="w-3.5 h-3.5 text-[#D49A35] shrink-0" />
                    <span className="truncate">Құндылық: {tradition.coreValue}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#00BFFF] transition-colors mb-1.5">
                    {tradition.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mb-3">
                    {tradition.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-200 line-clamp-3 leading-relaxed mb-4">
                    {tradition.description}
                  </p>
                </div>

                {/* Footer of card */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[#00BFFF] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Толығырақ оқу <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Дереккөз: [{tradition.sourceRef}]
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Modal */}
        {selectedTradition && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div 
              className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#081D47] rounded-3xl border border-[#00BFFF]/40 shadow-2xl p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedTradition(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                aria-label="Жабу"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] mb-6 bg-slate-900 border border-[#00BFFF]/20">
                <img
                  src={selectedTradition.image}
                  alt={selectedTradition.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-[#051B44]/90 backdrop-blur-md border border-[#00BFFF]/40 text-sm font-extrabold text-[#00E5FF]">
                    Карточка: {selectedTradition.code}
                  </span>
                  {selectedTradition.hasArScenario && (
                    <span className="px-2.5 py-1 rounded-lg bg-[#D49A35] text-xs font-bold text-[#051B44] flex items-center gap-1">
                      <Box className="w-3.5 h-3.5" /> AR сценарийі бар
                    </span>
                  )}
                </div>
              </div>

              {/* Header */}
              <div className="mb-4">
                <div className="text-xs uppercase tracking-widest text-[#D49A35] font-semibold mb-1">
                  {selectedTradition.subtitle}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {selectedTradition.name}
                </h3>
              </div>

              {/* Core Value Box */}
              <div className="p-4 rounded-xl bg-[#062B65]/80 border border-[#D49A35]/30 mb-5 flex items-start gap-3">
                <Bookmark className="w-5 h-5 text-[#D49A35] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#D49A35] uppercase tracking-wider">
                    Негізгі құндылық:
                  </div>
                  <div className="text-sm font-semibold text-[#F8FCFF]">
                    {selectedTradition.coreValue}
                  </div>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-4 text-sm text-slate-200 leading-relaxed mb-6">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#00BFFF] font-bold mb-1">
                    Қысқаша анықтамасы (Жоба карточкасы):
                  </h4>
                  <p className="p-3.5 rounded-xl bg-[#041535]/80 border border-white/5">
                    {selectedTradition.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#00BFFF] font-bold mb-1">
                    Тәрбиелік және мәдени терең мағынасы:
                  </h4>
                  <p className="p-3.5 rounded-xl bg-[#041535]/80 border border-white/5">
                    {selectedTradition.deepMeaning}
                  </p>
                </div>
              </div>

              {/* Reflection Question */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0B357A]/80 to-[#062B65]/80 border border-[#00BFFF]/40 mb-6 flex items-start gap-3">
                <HelpCircle className="w-6 h-6 text-[#00BFFF] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#00BFFF] uppercase tracking-wider mb-1">
                    Ойлану сұрағы (Рефлексия тапсырмасы):
                  </div>
                  <p className="text-sm sm:text-base font-medium text-white italic">
                    «{selectedTradition.reflectionQuestion}»
                  </p>
                </div>
              </div>

              {/* Source Reference */}
              <div className="p-3 rounded-xl bg-[#041535] border border-white/5 text-xs text-slate-400 mb-6 flex items-center justify-between">
                <span>
                  <strong>Дереккөз [{selectedTradition.sourceRef}]:</strong> {selectedTradition.source}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    const tName = selectedTradition.name;
                    setSelectedTradition(null);
                    onAskChatbot(tName);
                  }}
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl text-xs sm:text-sm font-bold text-[#051B44] bg-[#00BFFF] hover:bg-[#38D2FF] flex items-center justify-center gap-2 shadow-cyan-glow transition-all"
                >
                  <Bot className="w-4 h-4" />
                  <span>ЖИ-көмекшіден сұрау</span>
                </button>

                {selectedTradition.hasArScenario && selectedTradition.arScenarioId && (
                  <button
                    onClick={() => {
                      const scId = selectedTradition.arScenarioId!;
                      setSelectedTradition(null);
                      onOpenARScenario(scId);
                    }}
                    className="w-full sm:flex-1 py-3 px-5 rounded-xl text-xs sm:text-sm font-bold text-[#F8FCFF] bg-[#062B65] hover:bg-[#0B357A] border border-[#D49A35] flex items-center justify-center gap-2 transition-all"
                  >
                    <Box className="w-4 h-4 text-[#D49A35]" />
                    <span>AR көрінісін ашу</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedTradition(null)}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Жабу
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
