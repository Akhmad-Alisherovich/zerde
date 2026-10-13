import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Film, ArrowRight, ArrowLeft, ChevronRight, Image as ImageIcon, Sparkles } from 'lucide-react';
import { MediaGallerySection } from '../components/media/MediaGallerySection';

export const MediaGalleryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  // Support both new `tradition` query param and legacy `scenario` query param
  const scenarioParam = searchParams.get('scenario');
  const traditionParam = searchParams.get('tradition');
  
  // If legacy scenarioParam like 'ar-betashar', map to 'betashar'
  const resolvedTraditionId = traditionParam || (scenarioParam ? scenarioParam.replace(/^ar-/, '') : undefined);

  // Tab param if supplied (?tab=videos | photos | analysis)
  const tabParam = searchParams.get('tab');
  const resolvedTab = (tabParam === 'videos' || tabParam === 'analysis' || tabParam === 'photos') ? tabParam : 'photos';

  return (
    <div className="min-h-screen bg-[#051B44] text-[#F8FCFF]">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-[#041433] border-b border-[#00BFFF]/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4" aria-label="Нан қиқымдары">
            <Link to="/" className="hover:text-[#00BFFF] transition-colors">Басты бет</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#00BFFF] font-semibold">Фото және видео</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#062B65] border border-[#00BFFF]/30 text-[#00BFFF] text-xs font-semibold uppercase tracking-wider mb-2">
                <Film className="w-3.5 h-3.5" />
                6-Бөлім • Фото және бейне кешені
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif">
                Қазақтың ұлттық дәстүрлері: фото және бейне галерея
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
                Ұлттық салт-дәстүрлерді көрнекі суреттер мен танымдық бейнероликтер арқылы зерттеңіз.
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
      <MediaGallerySection 
        initialTraditionId={resolvedTraditionId} 
        initialTab={resolvedTab}
      />

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

          <div className="text-xs text-slate-400 text-center font-serif">
            «Зерде» 2026 • Ұлттық мәдени мұра және визуалды кешен
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
