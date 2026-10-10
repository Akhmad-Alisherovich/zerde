import React, { useState } from 'react';
import { 
  GitBranch, 
  Clock, 
  Users, 
  FileCheck, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Scale,
  Brain,
  ShieldAlert
} from 'lucide-react';
import { RESEARCH_CORE } from '../data/researchData';

export const ResearchDesignSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2);

  const steps = [
    {
      num: 1,
      title: 'Бастапқы тест',
      badge: 'Pre-Test • 10 Ұпай',
      desc: 'Екі топтың да оқушыларына бірдей 10 ұпайлық бастапқы бақылау тапсырмасы және қысқа сауалнама беріледі.',
      details: 'Мақсаты: оқушылардың дәстүрлер туралы базалық білім деңгейін теңдестіру және бастапқы нүктені белгілеу.'
    },
    {
      num: 2,
      title: 'Топтарға бөлу',
      badge: 'A/B Бөлу • Рандомизация',
      desc: 'Оқушылар екі тең топқа бөлінеді: Мәтіндік топ және ЖИ + AR цифрлық тобы. Екеуіне де бірдей 6 дәстүр мазмұны ұсынылады.',
      details: 'Мәтіндік топ – басып шығарылған карточкалармен; Цифрлық топ – диалогтік ЖИ және AR көріністермен жұмыс істейді.'
    },
    {
      num: 3,
      title: '15 минуттық оқу',
      badge: 'Бірдей уақыт • 15 мин',
      desc: 'Екі топқа да қатаң түрде 15 минут бөлінеді. Уақыт факторы тең сақталады, осылайша мазмұнды меңгеру жылдамдығы бақыланады.',
      details: 'Зерттеуші мұғалім сырттай бақылап, техникалық ақауларды (егер болса) арнайы хаттамаға тіркейді.'
    },
    {
      num: 4,
      title: 'Қорытынды тест',
      badge: 'Post-Test • 10 Ұпай',
      desc: '15 минуттық оқу аяқталған бойда дәл сол өлшемдер бойынша 10 ұпайлық қорытынды тапсырма орындалады.',
      details: 'Өсімді есептеу: Жеке өсім = Қорытынды ұпай – Бастапқы ұпай. Жауаптардың мағыналық тереңдігі сараланады.'
    },
    {
      num: 5,
      title: '1 апталық сақталу',
      badge: 'Retention Test • 7 күн',
      desc: 'Дәл бір аптадан кейін ұқсас (бірақ дәл көшірме емес) сақталу тесті өткізіледі.',
      details: 'Мақсаты: технологияның әсері қысқа мерзімді әсер ме, әлде ұзақ мерзімді есте сақтауға шынайы ықпал ете ме – соны анықтау.'
    }
  ];

  return (
    <section id="research" className="py-20 bg-[#062B65]/40 relative border-t border-[#00BFFF]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#051B44] border border-[#00BFFF]/30 text-[#00BFFF] text-xs font-semibold uppercase tracking-wider mb-3">
            <GitBranch className="w-3.5 h-3.5" />
            7-Бөлім • Эксперимент дизайны
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif mb-4">
            Салыстырмалы Оқу Тәжірибесінің Дизайны (A/B Test)
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Сурет 2. Бірдей уақыт (15 мин) және бірдей мазмұн (6 дәстүр) негізінде цифрлық әдістің әсерін 
            ғылыми тұрғыдан өлшеуге арналған зерттеу хаттамасы.
          </p>
        </div>

        {/* Animated Research Flow Stepper */}
        <div className="relative mb-12">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-[#00BFFF]/30 via-[#D49A35]/50 to-[#00BFFF]/30 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
            {steps.map((st) => {
              const isSelected = activeStep === st.num;
              return (
                <div
                  key={st.num}
                  onClick={() => setActiveStep(st.num)}
                  className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#081D47] border-2 border-[#00BFFF] shadow-cyan-glow transform scale-105'
                      : 'glass-panel border border-white/10 hover:border-[#00BFFF]/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-[#00BFFF] text-[#051B44]' : 'bg-white/10 text-white'
                      }`}>
                        {st.num}
                      </span>
                      <span className="text-[10px] font-semibold text-[#D49A35]">
                        Қадам {st.num}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                      {st.title}
                    </h4>
                    <span className="inline-block text-[10px] font-medium text-[#00E5FF] px-2 py-0.5 rounded bg-[#00BFFF]/10 mb-2">
                      {st.badge}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual Split Schema: Text Group vs AI+AR Group */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-[#00BFFF]/30 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              2 Салыстырмалы Топтың Оқу Кеңістігі
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Екі топқа да берілетін мазмұн, уақыт және бағалау сұрақтары бірдей.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Group 1 */}
            <div className="p-6 rounded-2xl bg-[#041535] border border-amber-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-400" />
                    <h4 className="font-bold text-white text-base">Мәтіндік топ (Бақылау)</h4>
                  </div>
                  <span className="text-xs font-bold text-amber-300 px-2.5 py-0.5 rounded bg-amber-500/10">
                    Дәстүрлі оқу
                  </span>
                </div>
                <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                  <p>• <strong>Құралы:</strong> 6 басып шығарылған оқу карточкасы (мәтін мен сурет).</p>
                  <p>• <strong>Уақыты:</strong> Дәл 15 минут өзіндік оқу.</p>
                  <p>• <strong>Тапсырмасы:</strong> Қағаз парағындағы 10 ұпайлық тапсырманы толтыру.</p>
                  <p>• <strong>Кері байланыс:</strong> Тек тест нәтижесі шыққанда мұғалімнен.</p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 text-[11px] text-slate-400">
                Базалық салыстыру стандарты (Control group)
              </div>
            </div>

            {/* Group 2 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#062B65] to-[#082255] border border-[#00BFFF]/50 flex flex-col justify-between shadow-cyan-glow">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#00BFFF]/30">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#00BFFF]" />
                    <h4 className="font-bold text-white text-base">Цифрлық топ (ЖИ + AR)</h4>
                  </div>
                  <span className="text-xs font-bold text-[#00E5FF] px-2.5 py-0.5 rounded bg-[#00BFFF]/20">
                    Тәжірибелік топ
                  </span>
                </div>
                <div className="space-y-3 text-xs text-slate-200 leading-relaxed">
                  <p>• <strong>Құралы:</strong> ЖИ-чатботтан сұрау қою + 3 AR-сценарийді 3D кеңістікте көру.</p>
                  <p>• <strong>Уақыты:</strong> Дәл 15 минут интерактивті оқу.</p>
                  <p>• <strong>Тапсырмасы:</strong> Дәл сол 10 ұпайлық тапсырма + тәрбиелік мағынаны түсіндіру.</p>
                  <p>• <strong>Кері байланыс:</strong> ЖИ ұсынған жедел түсіндірме мен ойлану сұрақтары.</p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 text-[11px] text-[#00E5FF]">
                Инновациялық әдістеме (Experimental group)
              </div>
            </div>

          </div>
        </div>

        {/* Selected Step Detail Callout */}
        <div className="p-5 rounded-2xl bg-[#041535]/90 border border-white/10 text-xs sm:text-sm text-slate-300 flex items-start gap-3">
          <Brain className="w-5 h-5 text-[#00BFFF] shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-0.5">
              Таңдалған кезеңнің әдістемелік ерекшелігі ({steps[activeStep - 1].title}):
            </strong>
            <span>{steps[activeStep - 1].details}</span>
          </div>
        </div>

      </div>
    </section>
  );
};
