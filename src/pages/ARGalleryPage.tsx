import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Maximize2, ArrowRight, ArrowLeft, ChevronRight, Box, Compass, Sparkles } from 'lucide-react';
import { ARGallerySection } from '../components/ARGallerySection';

export const ARGalleryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialScenario = searchParams.get('scenario') || undefined;
  return (
    <div className="min-h-screen bg-[#051B44] text-[#F8FCFF]">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-[#041433] border-b border-[#00BFFF]/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link to="/" className="hover:text-[#00BFFF] transition-colors">Басты бет</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#00BFFF] font-semibold">AR галерея</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#062B65] border border-[#00BFFF]/30 text-[#00BFFF] text-xs font-semibold uppercase tracking-wider mb-2">
                <Box className="w-3.5 h-3.5" />
                6-Бөлім • Кеңістіктік толықтырылған шынайылық (AR)
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif">
                AR Кеңістіктік Визуализация Галереясы
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
                Оқушы партасындағы интерактивті 3D мәдени нысандар. Үш педагогикалық сценарий,
                GLB үлгілерін айналдыру, анимациялық кезеңдер және WebXR интеграциясы.
              </p>
            </div>

            <Link
              to="/research"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] font-bold text-xs sm:text-sm shadow-cyan-glow transition-all self-start md:self-auto shrink-0"
            >
              <span>Зерттеуге өту</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <ARGallerySection initialScenarioId={initialScenario} />

      {/* Bottom Route Navigation Bar */}
      <div className="bg-[#030F26] border-t border-[#00BFFF]/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/ai-assistant"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Алдыңғы: ЖИ-көмекші</span>
          </Link>

          <div className="text-xs text-slate-400 text-center">
            «Зерде» 2026 • WebAR & Spatial Visualization
          </div>

          <Link
            to="/research"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] text-xs sm:text-sm font-bold transition-all shadow-cyan-glow"
          >
            <span>Келесі: Зерттеу мен Нәтиже</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
