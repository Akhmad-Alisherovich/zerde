import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft, Sparkles, BookOpen, Bot, Maximize2 } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#051B44] text-[#F8FCFF] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00BFFF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D49A35]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="glass-panel p-8 sm:p-12 rounded-3xl max-w-lg w-full text-center border border-[#00BFFF]/30 shadow-2xl relative z-10">
        <div className="w-20 h-20 rounded-3xl bg-[#062B65] border border-[#00BFFF]/40 flex items-center justify-center mx-auto mb-6 shadow-cyan-glow">
          <Compass className="w-10 h-10 text-[#00E5FF] animate-spin" style={{ animationDuration: '15s' }} />
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-[#D49A35]/20 border border-[#D49A35]/40 text-[#D49A35] text-xs font-mono font-bold uppercase tracking-wider mb-3">
          Қате 404 • Бет Табылмады
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white mb-3">
          Іздеген бетіңіз табылмады
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed mb-8">
          Сіз сұраған мекенжай жоба құрылымында жоқ немесе жылжытылған болуы мүмкін.
          Төмендегі негізгі бөлімдер арқылы зерттеуді жалғастыра аласыз:
        </p>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8 text-xs font-semibold">
          <Link
            to="/traditions"
            className="p-3 rounded-2xl bg-[#041535] border border-white/10 hover:border-[#00BFFF]/40 hover:bg-[#062B65] text-slate-200 hover:text-[#00BFFF] flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#D49A35]" />
            <span>6 Дәстүр</span>
          </Link>

          <Link
            to="/ai-assistant"
            className="p-3 rounded-2xl bg-[#041535] border border-white/10 hover:border-[#00BFFF]/40 hover:bg-[#062B65] text-slate-200 hover:text-[#00BFFF] flex items-center gap-2 transition-all"
          >
            <Bot className="w-4 h-4 text-[#00BFFF]" />
            <span>ЖИ-көмекші</span>
          </Link>

          <Link
            to="/ar-gallery"
            className="p-3 rounded-2xl bg-[#041535] border border-white/10 hover:border-[#00BFFF]/40 hover:bg-[#062B65] text-slate-200 hover:text-[#00BFFF] flex items-center gap-2 transition-all"
          >
            <Maximize2 className="w-4 h-4 text-[#00BFFF]" />
            <span>AR галерея</span>
          </Link>

          <Link
            to="/research"
            className="p-3 rounded-2xl bg-[#041535] border border-white/10 hover:border-[#00BFFF]/40 hover:bg-[#062B65] text-slate-200 hover:text-[#00BFFF] flex items-center gap-2 transition-all"
          >
            <BookOpen className="w-4 h-4 text-[#D49A35]" />
            <span>Зерттеу</span>
          </Link>
        </div>

        {/* Return to Home Button */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] font-bold text-sm shadow-cyan-glow transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Басты бетке оралу</span>
        </Link>
      </div>
    </div>
  );
};
