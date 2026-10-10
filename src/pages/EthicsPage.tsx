import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ArrowLeft, ChevronRight, Lock, UserCheck, FileCheck, Award, Printer } from 'lucide-react';
import { EthicsSection } from '../components/EthicsSection';
import { ConclusionSection } from '../components/ConclusionSection';

export const EthicsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#051B44] text-[#F8FCFF]">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-[#041433] border-b border-[#00BFFF]/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link to="/" className="hover:text-[#00BFFF] transition-colors">Басты бет</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#00BFFF] font-semibold">Этика мен қауіпсіздік</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#062B65] border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                11-Бөлім • Академиялық тазалық пен қауіпсіздік
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif">
                Зерттеу Этикасы және Сандық Қауіпсіздік
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
                «Зерде» 2026 ережесіне сай ата-ана келісімі, оқушылар дербес деректерінің анонимділігі, 
                ЖИ декларациясы және жас ерекшелігіне сай қауіпсіз цифрлық орта қағидаттары.
              </p>
            </div>

            <Link
              to="/posters"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] font-bold text-xs sm:text-sm shadow-cyan-glow transition-all self-start md:self-auto shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>3 Көрме плакатына өту</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 1. Ethics Section */}
      <EthicsSection />

      {/* 2. Conclusion & Author Reflection Section */}
      <ConclusionSection 
        onOpenExhibition={() => navigate('/exhibition')}
        onOpenPosters={() => navigate('/posters')}
      />

      {/* Bottom Route Navigation Bar */}
      <div className="bg-[#030F26] border-t border-[#00BFFF]/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/research"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Алдыңғы: Зерттеу мен Нәтиже</span>
          </Link>

          <div className="text-xs text-slate-400 text-center">
            «Зерде» 2026 • Академиялық тазалық пен этика хаттамасы
          </div>

          <Link
            to="/posters"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] text-xs sm:text-sm font-bold transition-all shadow-cyan-glow"
          >
            <span>Келесі: 3 Плакат (Баспа)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
