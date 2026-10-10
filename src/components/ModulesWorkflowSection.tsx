import React, { useState } from 'react';
import { 
  FileText, 
  Bot, 
  Box, 
  CheckSquare, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Info,
  ChevronRight
} from 'lucide-react';

export const ModulesWorkflowSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const modules = [
    {
      id: 1,
      title: '6 Оқу карточкасы',
      code: 'Модуль 1',
      subtitle: 'Тексерілген этномәдени білім қоры',
      icon: FileText,
      color: '#00BFFF',
      role: 'Мазмұндық іргетас',
      description: 'UNESCO және ғылыми этнографиялық дереккөздерге сүйенген 6 негізгі салт-дәстүр: Наурыз, Көрісу, Тұсаукесер, Беташар, Асар, Ерулік.',
      inputs: 'Академиялық әдебиеттер, мұрағат деректері, өңірлік ерекшеліктер',
      outputs: 'Деректер коды (N01-E01), қысқа түсініктеме, құндылықтық мәні, рефлексия сұрақтары',
      qualityRule: 'Анықтама қысқа (3–5 сөйлем); тәрбиелік мәні айқын; кемінде бір ғылыми дереккөзге байланысты.'
    },
    {
      id: 2,
      title: 'ЖИ-Көмекші & AR-Көрініс',
      code: 'Модуль 2',
      subtitle: 'Интерактивті түсіндіру және кеңістіктік модель',
      icon: Bot,
      color: '#00E5FF',
      role: 'Технологиялық жеткізуші',
      description: 'ЖИ-чатбот тек 6 карточка білім қорымен шектеліп жауап береді. Үш AR-сценарий (Наурыз, Тұсаукесер, Асар) үстел үстіндегі 3D модель арқылы ұсынылады.',
      inputs: 'Оқушы сұрағы, физикалық Hiro маркері, веб-камера',
      outputs: 'Дерекке сүйенген ЖИ жауабы, 3D кеңістіктік визуалдау, ойлану сұрағы',
      qualityRule: 'ЖИ белгісіз сұраққа ойдан қоспайды ("деректе жоқ"); AR.js нысандары орнықты көрінеді.'
    },
    {
      id: 3,
      title: 'Оқушы тапсырмасы',
      code: 'Модуль 3',
      subtitle: 'Белсенді танымдық және рефлексивті әрекет',
      icon: CheckSquare,
      color: '#D49A35',
      role: 'Әрекеттік бекіту',
      description: 'Оқушы дәстүрдің тек атауын жаттап қана қоймай, әрекет пен құндылықты сәйкестендіреді және өз өмірінен (сыныптан, мектептен) мысал келтіреді.',
      inputs: 'ЖИ-ден алған жауап, AR көріністі бақылау нәтижесі',
      outputs: 'Оқушының өз сөзімен түсіндірген жауабы, өмірлік мысалдар, рефлексия',
      qualityRule: 'Тапсырмалар жаттауға емес, мағынасын түсінуге және өмірмен байланыстыруға бағытталады.'
    },
    {
      id: 4,
      title: 'Бағалау мен Сақталу',
      code: 'Модуль 4',
      subtitle: '10 ұпайлық өлшеу және сапалық күнделік',
      icon: ShieldCheck,
      color: '#38D2FF',
      role: 'Ғылыми өлшеу құралы',
      description: 'Бастапқы тест (10 ұпай), 15 минуттық оқудан кейінгі қорытынды тест (10 ұпай) және 1 аптадан кейінгі есте сақтау (retention) тесті.',
      inputs: 'Оқушы тест жауаптары, қызығушылық сауалнамасы (1-5)',
      outputs: 'Жеке және топтық өсім (Gain), ұзақ мерзімді сақталу көрсеткіші, техникалық ақау саны',
      qualityRule: 'Аты-жөнсіз кодтау, дербес деректерді қорғау, жалған нәтиже қоспау.'
    }
  ];

  return (
    <section id="modules" className="py-20 bg-[#062B65]/40 relative border-t border-[#00BFFF]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#051B44] border border-[#00BFFF]/30 text-[#00BFFF] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            3-Бөлім • Төрт байланысты модуль
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif mb-4">
            Жобаның Цифрлық Оқу Логикасы
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Әрбір элемент бір-бірімен тығыз байланысқан біртұтас 4 қадамдық педагогикалық жүйе құрайды:
            <strong className="text-[#00BFFF] block mt-1">
              Тексерілген деректер → Түсіндіру құралы → Танымдық әрекет → Ғылыми бағалау
            </strong>
          </p>
        </div>

        {/* Workflow Diagram Buttons / Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            const isSelected = activeStep === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveStep(m.id)}
                className={`p-5 rounded-2xl text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#081D47] border-2 border-[#00BFFF] shadow-cyan-glow transform scale-[1.02]'
                    : 'bg-[#062B65]/70 border border-white/10 hover:border-[#00BFFF]/40 hover:bg-[#081D47]/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-[#00BFFF]">
                      {m.code}
                    </span>
                    <span className="text-xs font-bold text-slate-400">0{m.id} / 04</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#00BFFF]/10 text-[#00BFFF] flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">{m.title}</h4>
                  <p className="text-xs text-slate-300 line-clamp-2">{m.subtitle}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-medium text-[#00BFFF]">
                  <span>Толығырақ көру</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Inspector Card for Selected Module */}
        {(() => {
          const mod = modules.find((m) => m.id === activeStep) || modules[0];
          const Icon = mod.icon;
          return (
            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-[#00BFFF]/40 relative overflow-hidden animate-fadeIn">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Left side details */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#00BFFF]/20 text-[#00BFFF] flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs text-[#D49A35] font-bold uppercase tracking-wider">
                        {mod.code} • {mod.role}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        {mod.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                    {mod.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-[#041535]/80 border border-white/10">
                      <div className="text-xs font-semibold text-[#00BFFF] mb-1">Кіріс параметрлері (Inputs):</div>
                      <p className="text-xs text-slate-300">{mod.inputs}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#041535]/80 border border-white/10">
                      <div className="text-xs font-semibold text-[#D49A35] mb-1">Шығыс нәтижесі (Outputs):</div>
                      <p className="text-xs text-slate-300">{mod.outputs}</p>
                    </div>
                  </div>
                </div>

                {/* Right side quality rule banner */}
                <div className="w-full lg:w-80 shrink-0 p-5 rounded-2xl bg-gradient-to-br from-[#081D47] to-[#041330] border border-[#00BFFF]/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#00BFFF] uppercase tracking-wider mb-2">
                      <ShieldCheck className="w-4 h-4" />
                      Сапа мен Қауіпсіздік талабы
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed mb-4">
                      {mod.qualityRule}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D49A35]" />
                      Кезең: {activeStep} / 4
                    </span>
                    <button
                      onClick={() => setActiveStep(activeStep < 4 ? activeStep + 1 : 1)}
                      className="text-[#00BFFF] hover:underline font-semibold flex items-center gap-1"
                    >
                      Келесі қадам <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

      </div>
    </section>
  );
};
