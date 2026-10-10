import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  BookOpen, 
  Bot, 
  Layers, 
  CheckCircle2, 
  Scale, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight,
  Maximize2,
  FileText
} from 'lucide-react';
import { PROJECT_INFO } from '../data/researchData';
import { TRADITIONS_DATA } from '../data/traditionsData';

export const PostersPage: React.FC = () => {
  const [activePoster, setActivePoster] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#051B44] text-[#F8FCFF]">
      {/* Top Banner / Breadcrumb (hidden when printing) */}
      <div className="bg-[#041433] border-b border-[#00BFFF]/20 py-8 px-4 sm:px-6 lg:px-8 no-print">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link to="/" className="hover:text-[#00BFFF] transition-colors">Басты бет</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#00BFFF] font-semibold">3 Плакат (Баспа)</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#062B65] border border-[#D49A35]/40 text-[#D49A35] text-xs font-semibold uppercase tracking-wider mb-2">
                <Printer className="w-3.5 h-3.5" />
                Стендтік Қорғау • Баспалық Плакаттар
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif">
                3 Ғылыми Көрме Плакаты (A1 / A2 Баспа Форматы)
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
                «Зерде» 2026 стендтік қорғауына арналған жоғары ажыратымдылықтағы 3 ғылыми плакат. 
                Қағазға басып шығаруға, PDF форматында сақтауға немесе үлкейтіп зерттеуге болады.
              </p>
            </div>

            <Link
              to="/exhibition"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] font-bold text-xs sm:text-sm shadow-cyan-glow transition-all self-start md:self-auto shrink-0"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Көрме режиміне өту</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Control Bar (hidden when printing) */}
      <div className="sticky top-20 z-30 p-4 bg-[#051B44]/95 border-b border-[#00BFFF]/30 backdrop-blur-md no-print shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Poster Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 1, label: 'Плакат 1: Тұжырымдама мен Жүйе' },
              { id: 2, label: 'Плакат 2: Өзектілігі мен Мақсаты' },
              { id: 3, label: 'Плакат 3: Өнім, Әдіс, Эксперимент' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePoster(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activePoster === tab.id
                    ? 'bg-[#00BFFF] text-[#051B44] shadow-cyan-glow'
                    : 'bg-[#062B65] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="flex items-center bg-[#062B65] rounded-xl border border-white/10 p-1">
              <button
                onClick={() => setZoomLevel(Math.max(0.6, Number((zoomLevel - 0.1).toFixed(1))))}
                className="p-1.5 text-slate-300 hover:text-white"
                title="Кішірейту"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono px-2 text-white font-bold">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(Math.min(1.4, Number((zoomLevel + 0.1).toFixed(1))))}
                className="p-1.5 text-slate-300 hover:text-white"
                title="Үлкейту"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#D49A35] hover:bg-[#F3BE5E] text-[#051B44] text-xs font-bold flex items-center gap-2 shadow-gold-glow transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Басып шығару (Print / PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Poster Viewing Canvas */}
      <div className="py-12 px-4 flex justify-center items-start overflow-x-auto min-h-screen">
        <div 
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
          className="transition-transform duration-200"
        >
          
          {/* ========================================================================= */}
          {/* POSTER 1: ТҰЖЫРЫМДАМА ЖӘНЕ 4 МОДУЛЬ */}
          {/* ========================================================================= */}
          {activePoster === 1 && (
            <div className="poster-page w-[760px] min-h-[1080px] bg-white text-[#051B44] rounded-3xl shadow-2xl overflow-hidden border-8 border-[#062B65] flex flex-col justify-between font-sans relative">
              
              {/* Header Hero Graphic */}
              <div className="relative h-60 bg-[#062B65] overflow-hidden">
                <img
                  src="/assets/banner_concept.png"
                  alt="Banner concept reference"
                  className="w-full h-full object-cover object-top opacity-30 filter saturate-150"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#062B65]/80 via-[#062B65]/60 to-[#062B65]" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-center">
                  <div className="flex justify-between items-center text-white/80 text-[11px] font-bold tracking-widest uppercase">
                    <span>{PROJECT_INFO.school}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D49A35] text-[#051B44] font-extrabold">ЗЕРДЕ 2026</span>
                  </div>

                  <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-wide font-serif leading-tight">
                      ҰЛТТЫҚ ДӘСТҮРЛЕРДІҢ ЖАҢА ӨМІРІ
                    </h1>
                    <div className="inline-block mt-2 px-4 py-1.5 rounded-xl bg-[#00BFFF]/20 border border-[#00BFFF] text-[#00E5FF] font-bold text-xs uppercase tracking-wider">
                      ЖИ МЕН AR НЕГІЗІНДЕГІ ИНТЕРАКТИВТІ ЭТНОМӘДЕНИ АНЫҚТАМАЛЫҚ
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-200 font-medium">
                    Зерттеу жобасы • Секция: Этномәдениеттану және мәдени мұра
                  </div>
                </div>
              </div>

              {/* Poster 1 Body */}
              <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                
                {/* Ribbon 1: Цифрлық оқу логикасы */}
                <div className="rounded-2xl border-2 border-[#00BFFF]/30 bg-[#F0F9FF] p-4 text-center">
                  <div className="text-xs font-extrabold text-[#062B65] uppercase tracking-wider mb-3 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D49A35]" />
                    Жобаның Цифрлық Оқу Логикасы
                  </div>

                  {/* 5-step flow arrows */}
                  <div className="grid grid-cols-5 gap-2 items-center text-[10px] text-[#051B44]">
                    <div className="p-2 rounded-xl bg-white border border-[#00BFFF]/30 shadow-sm flex flex-col items-center">
                      <BookOpen className="w-5 h-5 text-[#00BFFF] mb-1" />
                      <span className="font-bold">Сенімді дереккөздер</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-[#00BFFF]/30 shadow-sm flex flex-col items-center">
                      <FileText className="w-5 h-5 text-[#D49A35] mb-1" />
                      <span className="font-bold">6 оқу карточкасы</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-[#00BFFF] shadow-md flex flex-col items-center bg-[#DDF5FF]">
                      <Bot className="w-5 h-5 text-[#00BFFF] mb-1" />
                      <span className="font-extrabold text-[#062B65]">ЖИ + AR көрініс</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-[#00BFFF]/30 shadow-sm flex flex-col items-center">
                      <Layers className="w-5 h-5 text-[#00BFFF] mb-1" />
                      <span className="font-bold">Оқушы тапсырмасы</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-[#00BFFF]/30 shadow-sm flex flex-col items-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
                      <span className="font-bold">Тест + рефлексия</span>
                    </div>
                  </div>
                </div>

                {/* 4 Connected Modules Grid */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#062B65] mb-3 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#00BFFF]" />
                    4 Негізгі Байланысты Модуль
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-6 h-6 rounded-lg bg-[#062B65] text-white flex items-center justify-center font-bold text-xs">1</span>
                        <h4 className="font-bold text-xs text-[#062B65]">6 Оқу карточкасы</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Ұлттық дәстүрлер бойынша 6 тақырып, қысқа әрі мазмұнды ақпарат. Тәрбиелік мәні мен ойлану сұрағы қамтылған.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-6 h-6 rounded-lg bg-[#00BFFF] text-[#051B44] flex items-center justify-center font-bold text-xs">2</span>
                        <h4 className="font-bold text-xs text-[#062B65]">ЖИ-чатбот көмекшісі</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Сұрақтарға жауап береді, дәстүрдің мәнін қарапайым тілмен түсіндіреді. Карточка қорымен қатаң шектелген.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-6 h-6 rounded-lg bg-[#D49A35] text-[#051B44] flex items-center justify-center font-bold text-xs">3</span>
                        <h4 className="font-bold text-xs text-[#062B65]">3 AR-сценарий</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Дәстүрлерді 3D форматта көру, парта үстіндегі интерактивті көріністер арқылы заттық мәнін зерттеу.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">4</span>
                        <h4 className="font-bold text-xs text-[#062B65]">Салыстырмалы зерттеу</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Дәстүр мен қазіргі заман арасындағы құндылықтар байланысын және оқушының есте сақтау деңгейін талдау.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Жобаның идеясы Banner */}
                <div className="p-4 rounded-2xl bg-[#062B65] text-white flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#D49A35] text-[#051B44] flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#D49A35] uppercase tracking-wider mb-0.5">
                      Жобаның басты идеясы
                    </h4>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Бұл жоба қазақ халқының ұлттық дәстүрлерін оқушыға түсінікті, қызықты және заманауи форматта таныстыруға бағытталған. ЖИ мен AR технологиялары дәстүрдің тәрбиелік мағынасын тереңірек түсінуге көмектеседі.
                    </p>
                  </div>
                </div>

                {/* Visual Artwork Feature of Book & Holograms */}
                <div className="rounded-2xl overflow-hidden border border-slate-200 h-44 relative bg-slate-900">
                  <img
                    src="/assets/holographic_book.jpg"
                    alt="Digital Hologram Book"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white drop-shadow">
                      Интерактивті цифрлық анықтамалықтың визуалды архитектурасы
                    </span>
                  </div>
                </div>

              </div>

              {/* Poster 1 Footer */}
              <div className="p-4 bg-[#062B65] text-white text-xs flex justify-between items-center border-t border-[#00BFFF]/30">
                <div>
                  <strong>Орындаған:</strong> {PROJECT_INFO.author.name}, {PROJECT_INFO.author.grade}
                </div>
                <div>
                  <strong>Жетекшісі:</strong> {PROJECT_INFO.supervisor.name}
                </div>
                <div>
                  <strong>{PROJECT_INFO.region}, {PROJECT_INFO.year}</strong>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* POSTER 2: ӨЗЕКТІЛІГІ, МАҚСАТЫ, МІНДЕТТЕРІ */}
          {/* ========================================================================= */}
          {activePoster === 2 && (
            <div className="poster-page w-[760px] min-h-[1080px] bg-white text-[#051B44] rounded-3xl shadow-2xl overflow-hidden border-8 border-[#062B65] flex flex-col justify-between font-sans relative">
              
              {/* Header Hero Graphic */}
              <div className="relative h-56 bg-[#062B65] overflow-hidden">
                <img
                  src="/assets/banner_relevance.png"
                  alt="Banner relevance reference"
                  className="w-full h-full object-cover object-top opacity-30 filter saturate-150"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#062B65]/80 via-[#062B65]/60 to-[#062B65]" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-center">
                  <div className="flex justify-between items-center text-white/80 text-[11px] font-bold tracking-widest uppercase">
                    <span>{PROJECT_INFO.school}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D49A35] text-[#051B44] font-extrabold">ЗЕРДЕ 2026</span>
                  </div>

                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide font-serif leading-tight">
                      ӨЗЕКТІЛІГІ, МАҚСАТЫ, МІНДЕТТЕРІ
                    </h1>
                    <div className="inline-block mt-2 px-3 py-1 rounded-xl bg-[#00BFFF]/20 border border-[#00BFFF] text-[#00E5FF] font-bold text-xs uppercase tracking-wider">
                      ҒЫЛЫМИ-ӘДІСТЕМЕЛІК НЕГІЗДЕМЕ
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-200">
                    Тақырыбы: Ұлттық дәстүрлердің жаңа өмірі
                  </div>
                </div>
              </div>

              {/* Poster 2 Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                
                {/* 1. Өзектілігі */}
                <div className="p-4 rounded-2xl bg-[#F0F9FF] border border-[#00BFFF]/30">
                  <div className="flex items-center gap-2 mb-1.5 text-xs font-extrabold text-[#062B65] uppercase">
                    <Sparkles className="w-4 h-4 text-[#00BFFF]" />
                    Өзектілігі
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Ұлттық дәстүрлерді қазіргі оқушыға қызықты, түсінікті және заманауи форматта ұсыну маңызды. Жоба мәдени мұраны сақтауға және оған қызығушылықты арттыруға бағытталған.
                  </p>
                </div>

                {/* 2. Зерттеу сұрағы */}
                <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#D49A35]/40">
                  <div className="flex items-center gap-2 mb-1.5 text-xs font-extrabold text-[#B45309] uppercase">
                    <Scale className="w-4 h-4 text-[#D49A35]" />
                    Зерттеу сұрағы
                  </div>
                  <p className="text-xs font-semibold text-[#051B44] leading-relaxed italic">
                    «Бірдей мазмұн жағдайында ЖИ мен AR қолданылған цифрлық материал дәстүрді түсіну және есте сақтауға қалай әсер етеді?»
                  </p>
                </div>

                {/* 3. Мақсаты */}
                <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-1.5 text-xs font-extrabold text-emerald-800 uppercase">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Зерттеу мақсаты
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Ұлттық дәстүрлерді түсіндіруге арналған интерактивті этномәдени анықтамалықтың прототипін әзірлеу және оның оқу әсерін тексерудің жасқа сай әдістемесін ұсыну.
                  </p>
                </div>

                {/* 4. Зерттеу міндеттері (1-4) */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#062B65] mb-2.5">
                    Зерттеу міндеттері
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2 shadow-sm">
                      <span className="w-5 h-5 rounded-lg bg-[#062B65] text-white flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
                      <span className="text-slate-700 text-[11px]">Ұлттық дәстүрлер бойынша 6 қысқа оқу карточкасын дайындау.</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2 shadow-sm">
                      <span className="w-5 h-5 rounded-lg bg-[#00BFFF] text-[#051B44] flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
                      <span className="text-slate-700 text-[11px]">ЖИ-чатбот пен 3 AR-сценарий әзірлеу.</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2 shadow-sm">
                      <span className="w-5 h-5 rounded-lg bg-[#D49A35] text-[#051B44] flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
                      <span className="text-slate-700 text-[11px]">Сауалнама және бағалау құралдарын құрастыру.</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2 shadow-sm">
                      <span className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">4</span>
                      <span className="text-slate-700 text-[11px]">Нәтижелерді талдап, жетілдіру жолдарын ұсыну.</span>
                    </div>
                  </div>
                </div>

                {/* 5. Жобалық жаңалығы */}
                <div className="p-4 rounded-2xl bg-[#062B65] text-white flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#00BFFF] text-[#051B44] flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider mb-0.5">
                      Жобалық Жаңалығы
                    </h4>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Тексерілген дәстүр карточкасын, ЖИ-жауапты, AR-көріністі және зерттеу тапсырмасын бір оқу цикліне біріктіру.
                    </p>
                  </div>
                </div>

                {/* Bottom Artwork */}
                <div className="rounded-2xl overflow-hidden border border-slate-200 h-36 relative bg-slate-900">
                  <img
                    src="/assets/kazakh_landscape.jpg"
                    alt="Kazakhstan Nature"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[11px] font-bold text-white">
                      Мәдени мұра мен болашақ білімнің үйлесімі
                    </span>
                  </div>
                </div>

              </div>

              {/* Poster 2 Footer */}
              <div className="p-4 bg-[#062B65] text-white text-xs flex justify-between items-center border-t border-[#00BFFF]/30">
                <div>
                  <strong>Орындаған:</strong> {PROJECT_INFO.author.name}, {PROJECT_INFO.author.grade}
                </div>
                <div>
                  <strong>Жетекшісі:</strong> {PROJECT_INFO.supervisor.name}
                </div>
                <div>
                  <strong>{PROJECT_INFO.region}, {PROJECT_INFO.year}</strong>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* POSTER 3: ӨНІМ, ӘДІС, ЭКСПЕРИМЕНТ (Matches banner 3) */}
          {/* ========================================================================= */}
          {activePoster === 3 && (
            <div className="poster-page w-[760px] min-h-[1080px] bg-white text-[#051B44] rounded-3xl shadow-2xl overflow-hidden border-8 border-[#062B65] flex flex-col justify-between font-sans relative">
              
              {/* Header Hero Graphic */}
              <div className="relative h-56 bg-[#062B65] overflow-hidden">
                <img
                  src="/assets/banner_results.png"
                  alt="Banner results reference"
                  className="w-full h-full object-cover object-top opacity-30 filter saturate-150"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#062B65]/80 via-[#062B65]/60 to-[#062B65]" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-center">
                  <div className="flex justify-between items-center text-white/80 text-[11px] font-bold tracking-widest uppercase">
                    <span>{PROJECT_INFO.school}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D49A35] text-[#051B44] font-extrabold">ЗЕРДЕ 2026</span>
                  </div>

                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide font-serif leading-tight">
                      ӨНІМ, ӘДІС, НӘТИЖЕ ЖӘНЕ ЭТИКА
                    </h1>
                    <div className="inline-block mt-2 px-3 py-1 rounded-xl bg-[#00BFFF]/20 border border-[#00BFFF] text-[#00E5FF] font-bold text-xs uppercase tracking-wider">
                      ҚОЛДАНБАЛЫ ЗЕРТТЕУ ПРАКТИКАСЫ
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-200">
                    Этно-анықтамалық, ЖИ-чатбот, WebAR және академиялық этика
                  </div>
                </div>
              </div>

              {/* Poster 3 Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                
                {/* 6 Traditions Row */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#062B65] mb-1.5 flex items-center justify-between">
                    <span>6 Этномәдени тақырып (Оқу карточкалары):</span>
                    <span className="text-emerald-700 font-bold">N01 - E01</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5 text-center text-[10px]">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-[#062B65]">
                      Наурыз (N01)
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-[#062B65]">
                      Көрісу (K01)
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-[#062B65]">
                      Тұсаукесер (T01)
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-[#062B65]">
                      Беташар (B01)
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-[#062B65]">
                      Асар (A01)
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-[#062B65]">
                      Ерулік (E01)
                    </div>
                  </div>
                </div>

                {/* 3 AR Scenarios */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#062B65] mb-1.5">
                    3 AR-көрініс (AR.js маркерлік кеңістігі):
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="p-2.5 rounded-xl bg-[#F0FDF4] border border-emerald-500/30">
                      <strong className="block text-emerald-800">Наурыз</strong>
                      <span className="text-slate-600">Мерекелік ортақ дастарқан</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FFFBEB] border border-[#D49A35]/30">
                      <strong className="block text-amber-800">Тұсаукесер</strong>
                      <span className="text-slate-600">Ала жіп және ақ жол</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#EFF6FF] border border-[#00BFFF]/30">
                      <strong className="block text-[#062B65]">Асар</strong>
                      <span className="text-slate-600">Шаңырақ көтеру моделі</span>
                    </div>
                  </div>
                </div>

                {/* Зерттеу әдістері */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#062B65] mb-1.5">
                    Зерттеу әдістері:
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <div className="font-bold text-[#062B65]">Сауалнама</div>
                      <div className="text-slate-500 text-[9px]">Бастапқы білім</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <div className="font-bold text-[#062B65]">Бақылау</div>
                      <div className="text-slate-500 text-[9px]">Оқу процесі</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <div className="font-bold text-[#062B65]">Бағалау</div>
                      <div className="text-slate-500 text-[9px]">Pre/Post 10 ұпай</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <div className="font-bold text-[#062B65]">Салыстыру</div>
                      <div className="text-slate-500 text-[9px]">A/B өсімі</div>
                    </div>
                  </div>
                </div>

                {/* Негізгі құндылықтар 4-тік */}
                <div className="p-3.5 rounded-2xl bg-[#062B65] text-white">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#D49A35] mb-2 text-center">
                    Дәстүрлер тәрбиелейтін негізгі 4 құндылық:
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-1.5 rounded-xl bg-white/10 font-bold text-white">Татулық</div>
                    <div className="p-1.5 rounded-xl bg-white/10 font-bold text-[#D49A35]">Сыйластық</div>
                    <div className="p-1.5 rounded-xl bg-white/10 font-bold text-[#00E5FF]">Адалдық</div>
                    <div className="p-1.5 rounded-xl bg-white/10 font-bold text-emerald-400">Ынтымақ</div>
                  </div>
                </div>

                {/* QR Code and Hiro Marker print slot */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-2xl border-2 border-dashed border-[#00BFFF]/50 bg-slate-50 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-300 mb-1 flex items-center justify-center">
                      <img src="/assets/hiro-marker.svg" alt="Hiro Marker" className="w-14 h-14" />
                    </div>
                    <span className="text-[10px] font-bold text-[#062B65]">AR Hiro Маркері</span>
                    <span className="text-[9px] text-slate-500">Камерамен қарау орны</span>
                  </div>

                  <div className="p-3 rounded-2xl border-2 border-dashed border-[#D49A35]/50 bg-slate-50 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-300 mb-1 flex items-center justify-center">
                      <img src="/assets/ornament-icon.svg" alt="Digital App QR" className="w-14 h-14" />
                    </div>
                    <span className="text-[10px] font-bold text-[#062B65]">Цифрлық қосымша</span>
                    <span className="text-[9px] text-slate-500">QR-код арқылы өту</span>
                  </div>
                </div>

              </div>

              {/* Poster 3 Footer */}
              <div className="p-4 bg-[#062B65] text-white text-xs flex justify-between items-center border-t border-[#00BFFF]/30">
                <div><strong>Орындаған:</strong> {PROJECT_INFO.author.name}, {PROJECT_INFO.author.grade}</div>
                <div><strong>Жетекшісі:</strong> {PROJECT_INFO.supervisor.name}</div>
                <div><strong>{PROJECT_INFO.region}, {PROJECT_INFO.year}</strong></div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Bottom Route Navigation Bar (hidden when printing) */}
      <div className="bg-[#030F26] border-t border-[#00BFFF]/20 py-8 px-4 sm:px-6 lg:px-8 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/ethics"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Алдыңғы: Этика мен қауіпсіздік</span>
          </Link>

          <div className="text-xs text-slate-400 text-center">
            «Зерде» 2026 • Ғылыми көрме стендінің баспалық плакаттары
          </div>

          <Link
            to="/exhibition"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] text-xs sm:text-sm font-bold transition-all shadow-cyan-glow"
          >
            <span>Келесі: Көрме режимі</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
