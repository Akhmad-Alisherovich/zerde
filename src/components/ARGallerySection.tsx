import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Maximize2, 
  Download, 
  Eye, 
  Rotate3d, 
  Info, 
  Layers, 
  CheckCircle2, 
  Camera, 
  Compass, 
  Sparkles, 
  Printer, 
  X,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Film
} from 'lucide-react';
import { AR_SCENARIOS_DATA } from '../data/traditionsData';
import { ARScenario } from '../types';
import { Interactive3DViewer } from './ar/Interactive3DViewer';
import { WebARCameraViewer } from './ar/WebARCameraViewer';
import { CeremonyCinematicViewer } from './media/CeremonyCinematicViewer';
import { getCulturalMedia } from '../data/culturalMediaData';

interface ARGallerySectionProps {
  initialScenarioId?: string;
}

export const ARGallerySection: React.FC<ARGallerySectionProps> = ({ initialScenarioId }) => {
  const [selectedScenario, setSelectedScenario] = useState<ARScenario>(
    AR_SCENARIOS_DATA.find(s => s.id === initialScenarioId) || AR_SCENARIOS_DATA[0]
  );
  const [viewMode, setViewMode] = useState<'3d-model' | 'cinematic-media' | 'webar-camera' | 'cultural-info'>('3d-model');
  const [showMarkerModal, setShowMarkerModal] = useState<boolean>(false);
  const markerTriggerRef = useRef<HTMLButtonElement>(null);
  const markerCloseRef = useRef<HTMLButtonElement>(null);

  const culturalMedia = getCulturalMedia(selectedScenario.traditionId);
  useEffect(() => {
    if (!showMarkerModal) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    markerCloseRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowMarkerModal(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => { window.removeEventListener('keydown', closeOnEscape); (markerTriggerRef.current ?? previousFocus)?.focus(); };
  }, [showMarkerModal]);

  useEffect(() => {
    if (initialScenarioId) {
      const found = AR_SCENARIOS_DATA.find(s => s.id === initialScenarioId);
      if (found) setSelectedScenario(found);
    }
  }, [initialScenarioId]);

  return (
    <section id="ar-gallery" className="py-16 bg-[#041535] relative border-t border-[#00BFFF]/15 text-[#F8FCFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#062B65] border border-[#00BFFF]/30 text-[#00BFFF] text-xs font-semibold uppercase tracking-wider mb-3">
            <Box className="w-3.5 h-3.5" />
            6-Бөлім • Кеңістіктік толықтырылған шынайылық (WebAR)
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif mb-4">
            Мәдени 3D көріністер мен WebAR галереясы
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Қазақ мәдениетін таныстыратын авторлық 3D оқу көріністері.
            GLB үлгілерін 360° айналдырып зерттеңіз. Қолдайтын құрылғыларда WebXR арқылы бетке орналастыруға болады; камера AR әлі құрылғыда тексерілмеген.
          </p>
        </div>

        {/* Scene tabs intentionally scroll within this row on narrow screens. */}
        <p className="sm:hidden text-xs text-slate-300 mb-2">Басқа сахналарды көру үшін қатарды көлденең сырғытыңыз →</p>
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-3 snap-x snap-mandatory" aria-label="3D салт-дәстүр сахналары" role="group" tabIndex={0}>
          {AR_SCENARIOS_DATA.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc)}
              className={`shrink-0 snap-start min-h-11 px-4 sm:px-5 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2.5 border ${
                selectedScenario.id === sc.id
                  ? 'bg-gradient-to-r from-[#00BFFF] to-[#0090C8] text-[#051B44] border-[#00BFFF] shadow-cyan-glow scale-105'
                  : 'bg-[#062B65]/80 text-slate-300 border-white/10 hover:border-[#00BFFF]/40 hover:bg-[#0B357A]'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-current" />
              <span>{sc.name}</span>
            </button>
          ))}
        </div>

        {/* View Mode Tabs (3D Preview vs Real Camera WebAR vs Cultural Info) */}
        <div className="max-w-full overflow-x-auto mb-8" role="group" aria-label="Көрініс режимдері" tabIndex={0}>
          <div className="p-1.5 rounded-2xl bg-[#051B44] border border-[#00BFFF]/30 flex sm:inline-flex items-center gap-1 shadow-lg min-w-max sm:mx-auto">
            <button
              onClick={() => setViewMode('3d-model')}
              className={`min-h-11 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === '3d-model'
                  ? 'bg-[#00BFFF] text-[#051B44] shadow-cyan-glow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Rotate3d className="w-4 h-4" />
              <span>1. 3D Интерактивті Үлгі</span>
            </button>

            {culturalMedia && (
              <button
                onClick={() => setViewMode('cinematic-media')}
                className={`min-h-11 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  viewMode === 'cinematic-media'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-purple-glow'
                    : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>2. Этнографиялық медиа</span>
              </button>
            )}

            <button
              onClick={() => setViewMode('webar-camera')}
              className={`min-h-11 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === 'webar-camera'
                  ? 'bg-[#D49A35] text-[#051B44] shadow-gold-glow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>3. WebAR (WebXR)</span>
            </button>

            <button
              onClick={() => setViewMode('cultural-info')}
              className={`min-h-11 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === 'cultural-info'
                  ? 'bg-white/20 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>4. Мәдени Талдау</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Display: Viewport (Left 7-8 cols) + Educational Sidebar (Right 4-5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Visual Display Area (Col 7 / 8) */}
          <div className="lg:col-span-8 min-w-0 space-y-4">
            
            {/* View Mode 1: Interactive 3D Model with Three.js */}
            {viewMode === '3d-model' && (
              <Interactive3DViewer key={selectedScenario.id} scenarioId={selectedScenario.id} />
            )}

            {/* View Mode 2: Real Camera WebAR with Marker Tracking */}
            {viewMode === 'webar-camera' && (
              <WebARCameraViewer key={selectedScenario.id}
                scenarioId={selectedScenario.id}
                onFallbackTo3D={() => setViewMode('3d-model')}
              />
            )}

            {/* View Mode: Cinematic Media with Keyframes & Closeups */}
            {viewMode === 'cinematic-media' && culturalMedia && (
              <CeremonyCinematicViewer key={selectedScenario.id} media={culturalMedia} />
            )}

            {/* View Mode 4: Detailed Cultural Reference Artwork */}
            {viewMode === 'cultural-info' && (
              <div className="glass-panel rounded-3xl overflow-hidden border border-[#00BFFF]/30 p-6 space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10">
                  <img
                    src={selectedScenario.imagePreview}
                    alt={selectedScenario.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                    <div>
                      <span className="text-[11px] font-mono text-[#00E5FF] uppercase tracking-wider block">
                         {selectedScenario.imagePreview.startsWith('/assets/scene_') ? 'Қолданбадағы 3D сахна кадры' : 'Референс иллюстрациясы (2D)'}
                      </span>
                      <h3 className="text-xl font-bold text-white font-serif">{selectedScenario.name}</h3>
                      <p className="text-xs text-amber-200 mt-1">{selectedScenario.subtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#051B44] border border-white/10 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-[#00E5FF] block mb-1">Мәдени сипаттамасы:</strong>
                  {selectedScenario.sceneDescription}
                </div>
              </div>
            )}

            {/* Mode Explanation & Distinction Badge */}
            <div className="p-4 rounded-2xl bg-[#051B44]/80 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Ғылыми ашықтық:</strong> 3D үлгі — GLB торлы моделі. WebXR бет іздеуін пайдаланады; нақты құрылғыда тексеру қажет.
                </span>
              </div>

              <button
                ref={markerTriggerRef}
                onClick={() => setShowMarkerModal(true)}
                className="min-h-11 px-3 rounded-xl bg-[#062B65] hover:bg-[#0B357A] text-[#00E5FF] border border-[#00BFFF]/30 flex items-center gap-1.5 transition-colors font-medium text-xs ml-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Бұрынғы Hiro үлгісі</span>
              </button>
            </div>

          </div>

          {/* Educational Task & Criteria Sidebar (Col 4 / 5) */}
          <div className="lg:col-span-4 min-w-0 space-y-6">
            
            {/* Scenario Summary Card */}
            <div className="glass-panel p-6 rounded-3xl border border-[#00BFFF]/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-[#00BFFF]/20 border border-[#00BFFF]/40 text-[#00E5FF] text-[10px] font-bold font-mono uppercase">
                  {selectedScenario.markerType}
                </span>
                <span className="text-xs text-amber-300 font-semibold">
                  3D Кеңістік
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white font-serif">
                  {selectedScenario.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedScenario.sceneDescription}
                </p>
              </div>

              {/* Key Action Flow */}
              <div className="p-3.5 rounded-2xl bg-[#051B44] border border-white/10">
                <span className="text-[10px] font-bold text-[#D49A35] uppercase tracking-wider block mb-1">
                  Негізгі әрекеттік желісі:
                </span>
                <div className="text-xs font-bold text-white">
                  {selectedScenario.keyAction}
                </div>
              </div>

              {/* Student Task */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#062B65] to-[#041638] border border-[#00BFFF]/30">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#00E5FF] uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-4 h-4 text-[#D49A35]" />
                  <span>Оқушыға арналған тапсырма:</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {selectedScenario.studentTask}
                </p>
              </div>

              {/* Acceptance Criteria */}
              <div className="p-4 rounded-2xl bg-[#030F26] border border-white/10 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Қабылдау критерийлері («Зерде» 2026):</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {selectedScenario.acceptanceCriteria}
                </p>
              </div>

              {culturalMedia && viewMode !== 'cinematic-media' && (
                <button
                  onClick={() => setViewMode('cinematic-media')}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Film className="w-4 h-4" />
                  <span>Этнографиялық медиа мен жақын пландарды ашу</span>
                </button>
              )}
            </div>

            {/* Cultural Objects in this scene */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <h4 className="text-xs font-bold text-[#D49A35] uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00BFFF]" />
                Осы көріністегі 3D мәдени нысандар:
              </h4>

              <div className="space-y-2.5">
                {selectedScenario.interactiveObjects.map((obj, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#041535] border border-white/5 text-xs">
                    <strong className="block text-white font-medium mb-0.5">
                      • {obj.name}
                    </strong>
                    <span className="text-slate-400 text-[11px] leading-relaxed">
                      {obj.description}
                    </span>
                  </div>
                ))}
              </div>

              {selectedScenario.id === 'ar-asar' && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h5 className="text-[11px] font-bold text-[#00E5FF] uppercase tracking-wider mb-2">
                    Киіз үй құрудың 4 негізгі кезеңі:
                  </h5>
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="p-2 rounded-lg bg-white/5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#00BFFF]/20 text-[#00E5FF] flex items-center justify-center font-bold text-[10px]">1</span>
                      <span><strong>Кереге құру:</strong> Кереге қанаттарын шеңберлеп жайып, босағаға бекіту.</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#D49A35]/20 text-[#D49A35] flex items-center justify-center font-bold text-[10px]">2</span>
                      <span><strong>Шаңырақ көтеру:</strong> Ақсақал ашалы бақанмен шаңырақты ортаға тіреу.</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center font-bold text-[10px]">3</span>
                      <span><strong>Уық қадау:</strong> Уықтарды шаңырақ көзіне сұғып, керегеге байлау.</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">4</span>
                      <span><strong>Киіз жабу:</strong> Туырлық, үзік, түндік жауып, басқұр тартып бекіту.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Hiro Marker Printable Modal */}
      {showMarkerModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn" role="dialog" aria-modal="true" aria-label="Hiro маркері">
          <div className="glass-panel p-4 sm:p-8 rounded-3xl max-w-lg w-full max-h-[calc(100dvh-1.5rem)] overflow-y-auto border border-[#00BFFF]/40 text-center relative">
            <button
              ref={markerCloseRef}
              onClick={() => setShowMarkerModal(false)}
              className="absolute top-2 right-2 min-w-11 min-h-11 flex items-center justify-center text-slate-400 hover:text-white"
              aria-label="Терезені жабу"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-2 font-serif">
              Hiro Маркері (AR.js Баспалық Қалыбы)
            </h3>
            <p className="text-xs text-slate-300 mb-6">
              Бұл бұрынғы нұсқадан сақталған баспа үлгісі. Қазіргі WebXR режимі Hiro маркерін танымайды және қолданбайды.
            </p>

            <div className="w-full max-w-64 aspect-square bg-white p-4 rounded-2xl mx-auto mb-6 flex items-center justify-center border-4 border-slate-300 shadow-xl">
              <img src="/assets/hiro-marker.svg" alt="Hiro Marker" className="w-full h-full" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/assets/hiro-marker.svg"
                download="hiro-marker.svg"
                className="flex-1 min-h-11 px-4 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] text-xs font-bold flex items-center justify-center gap-2 shadow-cyan-glow transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Маркерді SVG жүктеу</span>
              </a>
              <button
                onClick={() => window.print()}
                className="min-h-11 px-4 rounded-xl bg-[#D49A35] hover:bg-[#F3BE5E] text-[#051B44] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-gold-glow"
              >
                <Printer className="w-4 h-4" />
                <span>Басып шығару (A4)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
