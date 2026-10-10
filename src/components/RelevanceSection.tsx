import React from 'react';
import { 
  Lightbulb, 
  HelpCircle, 
  Target, 
  FileText, 
  Sparkles, 
  Check, 
  AlertCircle,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';
import { RESEARCH_CORE } from '../data/researchData';

export const RelevanceSection: React.FC = () => {
  return (
    <section id="relevance" className="py-20 bg-[#051B44] relative overflow-hidden border-t border-[#00BFFF]/15">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#00BFFF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#D49A35]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#062B65] border border-[#00BFFF]/30 text-[#00BFFF] text-xs font-semibold uppercase tracking-wider mb-3">
            <Lightbulb className="w-3.5 h-3.5" />
            2-Бөлім • Зерттеу өзектілігі мен сұрағы
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif mb-4">
            Өзектілігі, Мәселесі және Зерттеу Сұрағы
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Ұлттық мұраны жаттау емес – түсіну маңызды. Жоба дәстүрлердің тарихи мағынасын заманауи оқушының өмірімен және құндылықтарымен байланыстырады.
          </p>
        </div>

        {/* 3 Core Scientific Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* Card 1: Өзектілігі мен Мәселе */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-t-4 border-t-[#00BFFF] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#00BFFF]/15 text-[#00BFFF] flex items-center justify-center mb-5">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Зерттеу өзектілігі мен мәселесі</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {RESEARCH_CORE.problem}
              </p>
              <div className="p-3.5 rounded-xl bg-[#062B65]/70 border border-[#00BFFF]/20 text-xs text-[#DDF5FF] leading-relaxed">
                <strong className="text-[#00BFFF] block mb-1">Негізгі қайшылық:</strong>
                Оқулықтағы дәстүрлер көбіне құрғақ мәтін ретінде беріледі. Оқушы атауларды жаттағанымен, олардың қандай адамгершілік қасиетті тәрбиелейтінін түсіне бермейді.
              </div>
            </div>
          </div>

          {/* Card 2: Зерттеу сұрағы мен Болжам */}
          <div className="glass-panel-gold p-6 sm:p-8 rounded-2xl border-t-4 border-t-[#D49A35] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#D49A35]/20 text-[#D49A35] flex items-center justify-center mb-5">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Зерттеу сұрағы</h3>
              <p className="text-[#F8FCFF] text-sm font-medium leading-relaxed mb-4 italic p-3 rounded-lg bg-black/20 border border-[#D49A35]/30">
                «{RESEARCH_CORE.question}»
              </p>
              <div className="p-3.5 rounded-xl bg-[#081D47]/80 border border-[#D49A35]/30 text-xs text-slate-200 leading-relaxed">
                <strong className="text-[#D49A35] block mb-1">Ғылыми болжам (Гипотеза):</strong>
                {RESEARCH_CORE.hypothesis}
              </div>
            </div>
          </div>

          {/* Card 3: Зерттеу мақсаты мен Пәні */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-t-4 border-t-[#00E5FF] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/15 text-[#00E5FF] flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Зерттеу мақсаты</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {RESEARCH_CORE.aim}
              </p>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="text-[#00BFFF] font-bold">Нысаны:</span>
                  <span>{RESEARCH_CORE.object}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00BFFF] font-bold">Пәні:</span>
                  <span>{RESEARCH_CORE.subject}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Visual Comparison: Traditional Text vs Interactive AI + AR Digital */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-[#00BFFF]/30 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs uppercase tracking-widest text-[#00BFFF] font-semibold">Ғылыми салыстыру матрицасы</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Дәстүрлі мәтіндік оқу vs Интерактивті цифрлық анықтамалық
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Екі тәсіл де 15 минуттық бірдей оқу уақытында және бірдей 6 дәстүр мазмұнында тексеріледі.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Traditional Text-based Learning */}
            <div className="p-6 rounded-2xl bg-[#041535]/80 border border-slate-700/60 relative">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold text-white text-base">Мәтіндік топ (Бақылау тобы)</h4>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 text-xs font-medium">
                  Қалыпты әдіс • 15 мин
                </span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs shrink-0 mt-0.5">•</span>
                  <span>6 карточка тек парақта басылған мәтін ретінде оқылады.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs shrink-0 mt-0.5">•</span>
                  <span>Оқушы тек сырттай оқушы рөлінде қалады, кері байланыс оқытушы арқылы ғана жүреді.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs shrink-0 mt-0.5">•</span>
                  <span>Көрнекілік тек 2D статикалық иллюстрациялармен шектеледі.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs shrink-0 mt-0.5">•</span>
                  <span>Сұрақ қою мүмкіндігі оқулықпен немесе мұғалімнің уақытымен шектеулі.</span>
                </li>
              </ul>
            </div>

            {/* Right: Digital AI + AR Learning */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#062B65]/90 to-[#082255]/90 border border-[#00BFFF]/50 relative shadow-cyan-glow">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#00BFFF]/30">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#00BFFF]" />
                  <h4 className="font-bold text-white text-base">ЖИ + AR цифрлық тобы (Тәжірибелік топ)</h4>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#00BFFF]/20 text-[#00E5FF] text-xs font-semibold">
                  Интерактивті цикл • 15 мин
                </span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#00BFFF] shrink-0 mt-0.5" />
                  <span>Тексерілген 6 карточка мазмұнын ЖИ көмекшісі диалог арқылы түсіндіреді.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#00BFFF] shrink-0 mt-0.5" />
                  <span>Наурыз, тұсаукесер, асар дәстүрлерін AR маркері арқылы 3D кеңістікте көреді.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#00BFFF] shrink-0 mt-0.5" />
                  <span>Әр тақырып соңында нақты өмірмен байланыстыратын рефлексия сұрағы ұсынылады.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#00BFFF] shrink-0 mt-0.5" />
                  <span>ЖИ тек карточка қорына сүйеніп, қате болжамдар мен галлюцинацияны болдырмайды.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Scientific Honesty Alert */}
          <div className="mt-6 p-4 rounded-xl bg-[#051B44] border border-[#D49A35]/40 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#D49A35] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-[#D49A35] font-semibold">Ғылыми ескерту: </strong>
              Интерфейстің заманауи әрі қызықты болуы білім артқанын өздігінен дәлелдемейді. 
              Цифрлық әдістің мәтіндік әдістен шынайы артықшылығы тек нақты тәжірибелік өлшеу (Pre-test, Post-test, 1 апталық Retention) жүргізілгенде ғана ғылыми тұрғыдан қорытындыланады.
            </div>
          </div>
        </div>

        {/* 4 Content Selection Principles */}
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-[#D49A35] font-semibold">Әдістемелік негіз</span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Мазмұнды іріктеудің 4 қағидасы
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-card border border-white/10">
            <div className="text-[#00BFFF] font-bold text-sm mb-2 flex items-center gap-1.5">
              <span>01.</span> Деректік нақтылық
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Әрбір дәстүрдің мағынасы UNESCO және академиялық этнографиялық дереккөздермен салыстырылады.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-white/10">
            <div className="text-[#00BFFF] font-bold text-sm mb-2 flex items-center gap-1.5">
              <span>02.</span> Жасқа сәйкестік
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              7-сынып оқушысының қабылдау деңгейіне сай. Сезімтал немесе күрделі рәсімдер қысқа мәтіндік деңгейде қалады.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-white/10">
            <div className="text-[#00BFFF] font-bold text-sm mb-2 flex items-center gap-1.5">
              <span>03.</span> Өңірлік ерекшелік
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Бір рәсімді бүкіл елде өзгермейтін жалғыз нұсқа деп ұсынбай, өңірлік айырмашылықтар (Батыс, Сарыарқа) ескеріледі.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-white/10">
            <div className="text-[#00BFFF] font-bold text-sm mb-2 flex items-center gap-1.5">
              <span>04.</span> Тәрбиелік мағына
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              «Бұл дәстүр қандай адамгершілік немесе қоғамдық құндылықты білдіреді?» деген негізгі тәрбиелік сұраққа жауап береді.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
