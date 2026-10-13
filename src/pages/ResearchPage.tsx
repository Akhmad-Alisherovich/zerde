import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, ArrowRight, ArrowLeft, ChevronRight, GitBranch, ClipboardList, ShieldAlert } from 'lucide-react';
import { ResearchDesignSection } from '../components/ResearchDesignSection';
import { ResearchMethodsSection } from '../components/ResearchMethodsSection';
import { ResultsAnalyticsSection } from '../components/ResultsAnalyticsSection';

export const ResearchPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#051B44] text-[#F8FCFF]">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-[#041433] border-b border-[#00BFFF]/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link to="/" className="hover:text-[#00BFFF] transition-colors">Басты бет</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#00BFFF] font-semibold">Зерттеу</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#062B65] border border-[#D49A35]/40 text-[#D49A35] text-xs font-semibold uppercase tracking-wider mb-2">
                <BarChart2 className="w-3.5 h-3.5" />
                7–9 Бөлімдер • Ғылыми Әдіснама мен Нәтиже
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif">
                Ғылыми Зерттеу, Әдістер және Сараптама
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
                Дәстүрлі оқыту мен ЖИ+AR кешенін салыстырмалы тексеру дизайны (A/B эксперименті).
                5 кешенді ғылыми әдіс және нәтижелерді бұрмаламау туралы академиялық хаттама.
              </p>
            </div>

            <Link
              to="/ethics"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] font-bold text-xs sm:text-sm shadow-cyan-glow transition-all self-start md:self-auto shrink-0"
            >
              <span>Этика мен қауіпсіздікке өту</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 1. Research Design Section */}
      <ResearchDesignSection />

      {/* 2. Research Methods Section */}
      <ResearchMethodsSection />

      {/* 3. Results & Analytics Section */}
      <ResultsAnalyticsSection />

      {/* Bottom Route Navigation Bar */}
      <div className="bg-[#030F26] border-t border-[#00BFFF]/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/media-gallery"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Алдыңғы: Фото және видео</span>
          </Link>

          <div className="text-xs text-slate-400 text-center">
            «Зерде» 2026 • Ғылыми эксперименттік әдіснама
          </div>

          <Link
            to="/ethics"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] text-xs sm:text-sm font-bold transition-all shadow-cyan-glow"
          >
            <span>Келесі: Этика мен қауіпсіздік</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
