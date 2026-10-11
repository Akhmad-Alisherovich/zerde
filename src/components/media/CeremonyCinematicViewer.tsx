import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Info, 
  Layers, 
  Film, 
  Camera, 
  ZoomIn, 
  X, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft
} from 'lucide-react';
import { CulturalMediaItem, CulturalCloseup, CulturalKeyframe } from '../../data/culturalMediaData';

interface CeremonyCinematicViewerProps {
  media: CulturalMediaItem;
  currentStageIndex?: number;
  onStageChange?: (index: number) => void;
}

export const CeremonyCinematicViewer: React.FC<CeremonyCinematicViewerProps> = ({
  media,
  currentStageIndex = 0,
  onStageChange
}) => {
  const hasVideo = Boolean(media.veoMotion?.videoUrl);
  const [activeTab, setActiveTab] = useState<'video' | 'timeline' | 'closeups'>(
    hasVideo ? 'video' : 'timeline'
  );
  const [activeStage, setActiveStage] = useState<number>(currentStageIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedCloseup, setSelectedCloseup] = useState<CulturalCloseup | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [isZoomedModalOpen, setIsZoomedModalOpen] = useState<boolean>(false);
  
  // Video playback ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  // Sync tab if video availability changes
  useEffect(() => {
    if (hasVideo && activeTab !== 'video' && activeTab !== 'timeline' && activeTab !== 'closeups') {
      setActiveTab('video');
    } else if (!hasVideo && activeTab === 'video') {
      setActiveTab('timeline');
    }
  }, [hasVideo, activeTab]);

  // Sync with external stage index if passed
  useEffect(() => {
    if (typeof currentStageIndex === 'number' && currentStageIndex >= 0 && currentStageIndex < media.keyframes.length) {
      setActiveStage(currentStageIndex);
    }
  }, [currentStageIndex, media.keyframes.length]);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Auto-play keyframes if isPlaying is true and not reduced motion
  useEffect(() => {
    if (!isPlaying || prefersReducedMotion || activeTab !== 'timeline') return;
    const interval = setInterval(() => {
      setActiveStage((prev) => {
        const next = (prev + 1) % media.keyframes.length;
        onStageChange?.(next);
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, prefersReducedMotion, activeTab, media.keyframes.length, onStageChange]);

  const currentKeyframe: CulturalKeyframe = media.keyframes[activeStage] || media.keyframes[0];

  const handleSelectStage = (index: number) => {
    setActiveStage(index);
    onStageChange?.(index);
  };

  const handlePrevStage = () => {
    const prev = activeStage > 0 ? activeStage - 1 : media.keyframes.length - 1;
    handleSelectStage(prev);
  };

  const handleNextStage = () => {
    const next = (activeStage + 1) % media.keyframes.length;
    handleSelectStage(next);
  };

  return (
    <div className="glass-panel rounded-3xl border border-[#00BFFF]/30 overflow-hidden shadow-2xl bg-[#041535]/95 text-[#F8FCFF]">
      
      {/* Sub-navigation bar inside Media Viewer */}
      <div className="border-b border-white/10 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 bg-[#030F26]/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#00BFFF]/20 text-[#00E5FF]">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-[#00E5FF] uppercase tracking-wider block">
              Этнографиялық медиа
            </span>
            <h4 className="text-sm font-bold text-white font-serif">{media.name} – Көрнекі кешен</h4>
          </div>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#051B44] border border-white/10 text-xs">
          {hasVideo && (
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'video'
                  ? 'bg-[#00BFFF] text-[#051B44] shadow-cyan-glow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Бейне-көрініс</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'bg-[#00BFFF] text-[#051B44] shadow-cyan-glow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Рәсім кезеңдері ({media.keyframes.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('closeups')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'closeups'
                ? 'bg-[#D49A35] text-[#051B44] shadow-gold-glow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Мәдени детальдар ({media.closeups.length})</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="p-4 sm:p-6 space-y-4">
        
        {/* Tab: Real Video Player (When Video URL exists) */}
        {hasVideo && activeTab === 'video' && (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-[#00BFFF]/30 shadow-inner group">
              <video
                ref={videoRef}
                src={media.veoMotion.videoUrl}
                poster={media.veoMotion.posterWebp || media.veoMotion.posterUrl}
                controls
                playsInline
                preload="none"
                className="w-full h-full object-cover"
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              >
                Браузеріңіз бұл бейнені қолдамайды.
              </video>
            </div>

            <div className="p-4 rounded-2xl bg-[#051B44] border border-white/10 space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-white font-serif">{media.veoMotion.title}</h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{media.veoMotion.actionDescription}</p>
            </div>
          </div>
        )}

        {/* Tab: Timeline & Keyframe Sequence */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            {/* Viewport Frame */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-[#00BFFF]/20 shadow-inner group">
              <picture>
                <source srcSet={currentKeyframe.imageWebp} type="image/webp" />
                <img
                  src={currentKeyframe.image}
                  alt={currentKeyframe.title}
                  className="w-full h-full object-cover transition-opacity duration-500"
                  loading="eager"
                />
              </picture>

              {/* Gradient Overlay & Captions */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-4 sm:p-6 pointer-events-none">
                
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2 pointer-events-auto">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#051B44]/90 backdrop-blur-md border border-[#00BFFF]/40 text-xs font-mono font-bold text-[#00E5FF]">
                      {currentKeyframe.stageLabel}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#00BFFF]/20 backdrop-blur-md border border-[#00BFFF]/40 text-[11px] text-[#00E5FF] font-medium">
                      Этнографиялық көрнекілік
                    </span>
                  </div>

                  <button
                    onClick={() => setIsZoomedModalOpen(true)}
                    className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white/90 hover:text-white transition-colors backdrop-blur-md border border-white/20"
                    title="Толық экранда көру"
                    aria-label="Толық экранда көру"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Caption & Action Details */}
                <div className="pointer-events-auto">
                  <h3 className="text-lg sm:text-2xl font-extrabold text-white font-serif drop-shadow-md">
                    {currentKeyframe.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-3xl leading-relaxed drop-shadow">
                    {currentKeyframe.actionDetails}
                  </p>
                </div>
              </div>

              {/* Prev / Next Arrows */}
              <button
                onClick={handlePrevStage}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all opacity-80 group-hover:opacity-100"
                aria-label="Алдыңғы кезең"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextStage}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all opacity-80 group-hover:opacity-100"
                aria-label="Келесі кезең"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Playback Controls & Stage Buttons */}
            <div className="p-4 rounded-2xl bg-[#051B44] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Play / Pause & Prev / Next */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`min-h-10 px-4 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                    isPlaying
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : 'bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] shadow-cyan-glow'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Аялдату' : 'Авто-көрсету'}</span>
                </button>

                <button
                  onClick={() => handleSelectStage(0)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                  title="Басынан бастау"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {prefersReducedMotion && (
                  <span className="text-[11px] text-slate-400 italic">
                    (Жеңілдетілген қозғалыс белсенді)
                  </span>
                )}
              </div>

              {/* Stage Stepper Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
                {media.keyframes.map((kf, idx) => (
                  <button
                    key={kf.id}
                    onClick={() => handleSelectStage(idx)}
                    className={`min-h-9 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                      activeStage === idx
                        ? 'bg-[#00BFFF]/20 border-[#00BFFF] text-[#00E5FF] shadow-sm'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{idx + 1}. {kf.title.split('&')[0].trim()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Close-up Cultural Details */}
        {activeTab === 'closeups' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {media.closeups.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedCloseup(item)}
                  className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-[#D49A35]/60 transition-all cursor-pointer group flex flex-col justify-between bg-[#051B44]/80"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                    <picture>
                      <source srcSet={item.imageWebp} type="image/webp" />
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                      <div className="text-white">
                        <span className="text-[10px] font-mono text-[#D49A35] uppercase tracking-wider block">
                          Этнографиялық деталь • Қолөнер
                        </span>
                        <h4 className="text-base font-bold font-serif">{item.title}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-[#D49A35] font-semibold">
                      <span>Толық мәдени мағынасын ашу</span>
                      <ZoomIn className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#062B65]/50 border border-[#00BFFF]/30 text-xs text-slate-300 flex items-start gap-3">
              <Info className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
              <p>
                <strong>Қолөнер мен өрнек:</strong> Бұл жақын пландар ұлттық киім-кешектегі алтын зер кестені, зергерлік күміс бұйымдарды, оюлы ағаш астау мен ожаудың құрылымын табиғи жарықпен көрсетеді.
              </p>
            </div>
          </div>
        )}

        {/* Provenance & Academic Transparency Notice */}
        <div className="p-4 rounded-2xl bg-[#030F26] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-2.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-[11px] sm:text-xs">
              <strong>Этнографиялық негіздеме:</strong> {media.provenance.disclaimer}
            </p>
          </div>
          <div className="text-[10px] text-slate-400 font-mono shrink-0">
            Дереккөз: {media.provenance.researchSources[0]?.split('.')[0] || 'Этнография'}
          </div>
        </div>

      </div>

      {/* Modal for Closeup Inspection */}
      {selectedCloseup && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="glass-panel max-w-2xl w-full rounded-3xl border border-[#D49A35]/50 overflow-hidden shadow-2xl bg-[#051B44]">
            <div className="relative aspect-video bg-black">
              <picture>
                <source srcSet={selectedCloseup.imageWebp} type="image/webp" />
                <img
                  src={selectedCloseup.image}
                  alt={selectedCloseup.title}
                  className="w-full h-full object-contain"
                />
              </picture>
              <button
                onClick={() => setSelectedCloseup(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
                aria-label="Жабу"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#D49A35]">
                <span>ЭТНОГРАФИЯЛЫҚ ТАЛДАУ</span>
              </div>
              <h3 className="text-xl font-bold text-white font-serif">{selectedCloseup.title}</h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {selectedCloseup.culturalDetails}
              </p>
              
              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setSelectedCloseup(null)}
                  className="px-4 py-2 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] font-bold text-xs"
                >
                  Түсінікті
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Zoom Modal for Keyframe */}
      {isZoomedModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-5xl w-full space-y-3">
            <div className="flex items-center justify-between text-white">
              <h3 className="text-lg font-bold font-serif">{currentKeyframe.title}</h3>
              <button
                onClick={() => setIsZoomedModalOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Жабу"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/20">
              <picture>
                <source srcSet={currentKeyframe.imageWebp} type="image/webp" />
                <img
                  src={currentKeyframe.image}
                  alt={currentKeyframe.title}
                  className="w-full h-full object-contain"
                />
              </picture>
            </div>

            <p className="text-xs text-slate-300 text-center">
              {currentKeyframe.actionDetails}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
