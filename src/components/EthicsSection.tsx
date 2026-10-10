import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  X
} from 'lucide-react';

export const EthicsSection: React.FC = () => {
  const [showDeclarationModal, setShowDeclarationModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  const ethicsPoints = [
    {
      icon: UserCheck,
      title: 'Ата-ананың жазбаша келісімі',
      desc: 'Сауалнама мен экспериментке 7-сынып оқушылары тек заңды өкілдерінің (ата-аналарының) ресми келісімімен ғана қатысады.',
      rule: '«Зерде» 5-қосымшасы'
    },
    {
      icon: Lock,
      title: 'Дербес деректерді даралау (Анонимділік)',
      desc: 'Барлық оқушылар жауаптары құпия кодталады (мыс: ОҚ-01). Оқушылардың аты-жөні, жеке телефондары жарияланбайды.',
      rule: 'Құпиялылық қағидасы'
    },
    {
      icon: ShieldCheck,
      title: 'ЖИ пайдалану декларациясы',
      desc: 'ЖИ тек құрылымдық және тілдік өңдеуге көмекші құрал ретінде пайдаланылды. Оқушы орнына ғылыми қорытынды жасалмады.',
      rule: '«Зерде» 4-қосымшасы'
    },
    {
      icon: AlertCircle,
      title: 'Жалған деректерден бас тарту',
      desc: 'Тәжірибе толық өткізілгенге дейін сандар мен статистика ойдан шығарылмайды; бос күйлер адал түрде «—» белгісімен беріледі.',
      rule: 'Академиялық адалдық'
    },
    {
      icon: FileCheck,
      title: 'Авторлық құқықты сақтау',
      desc: 'Көрнекі материалдар, фотолар, этнографиялық мәтіндер мен бағдарламалық кодтардың барлық дереккөздері қатаң түрде сілтенген.',
      rule: 'Зияткерлік меншік'
    },
    {
      icon: CheckCircle2,
      title: 'Қауіпсіз цифрлық орта',
      desc: 'AR сценарийлері физикалық тұрғыдан қауіпсіз мектеп партасында өткізіледі, сезімтал ғұрыптар мен қауіпті әрекеттер сахналанбайды.',
      rule: 'Психологиялық қауіпсіздік'
    }
  ];

  return (
    <section id="ethics" className="py-20 bg-[#062B65]/40 relative border-t border-[#00BFFF]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#051B44] border border-emerald-500/40 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            11-Бөлім • Этика мен Сенімділік
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif mb-4">
            Ғылыми Этика және Қауіпсіздік Кепілдігі
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            2026–2027 жылғы республикалық «Зерде» конкурсының ресми талаптарына толық сәйкестік. 
            Академиялық адалдық пен оқушылардың құқығын қорғау – жобаның басты ұстанымы.
          </p>
        </div>

        {/* 6 Ethics Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {ethicsPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-card p-6 rounded-3xl border border-white/10 hover:border-emerald-400/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {item.rule}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Triggers for Official Declarations */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setShowDeclarationModal(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white bg-[#062B65] hover:bg-[#0B357A] border border-[#00BFFF]/40 flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <FileText className="w-4 h-4 text-[#00BFFF]" />
            <span>Г Қосымшасы: ЖИ Декларациясы</span>
          </button>

          <button
            onClick={() => setShowSafetyModal(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-[#051B44] bg-emerald-400 hover:bg-emerald-300 flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Ғ Қосымшасы: Этика Бақылау Парағы</span>
          </button>
        </div>

        {/* Declaration Modal (Appendix Г) */}
        {showDeclarationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#081D47] border border-[#00BFFF]/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setShowDeclarationModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-white mb-2">
                Г Қосымшасы. ЖИ пайдалану туралы декларация
              </h3>
              <p className="text-xs text-slate-300 mb-6">
                «Зерде» конкурсының 4-қосымшасы бойынша ресми тіркеу формасы:
              </p>

              <div className="space-y-3 text-xs text-slate-200">
                <div className="p-3.5 rounded-xl bg-[#041535] border border-white/10">
                  <span className="font-bold text-[#00BFFF] block mb-1">ЖИ құралы мен нұсқасы:</span>
                  <span>ChatGPT (OpenAI, GPT-5.6 Sol / Claude) – тілдік және құрылымдық көмек.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#041535] border border-white/10">
                  <span className="font-bold text-[#00BFFF] block mb-1">Мақсаты мен шегі:</span>
                  <span>Бастапқы мәтінді жаңа ережеге сәйкестендіру, кесте/сызба үлгісін құру. Бастапқы зерттеу деректерін жасау үшін пайдаланылмайды.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#041535] border border-white/10">
                  <span className="font-bold text-[#00BFFF] block mb-1">Тексеру тәсілі:</span>
                  <span>Мәдени мазмұнды көрсетілген дереккөздермен (UNESCO, этнография) салыстыру.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#041535] border border-white/10">
                  <span className="font-bold text-[#00BFFF] block mb-1">Автордың (оқушының) жеке үлесі:</span>
                  <span>Оқушы әр бөлімді оқып, өз сөзімен түсіндіреді; нақты өлшеуді өзі жүргізеді; қорытынды мен күнделікті өзі толтырады.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Safety Modal (Appendix Ғ) */}
        {showSafetyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#081D47] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setShowSafetyModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-white mb-2">
                Ғ Қосымшасы. Этика және қауіпсіздікке дайындық парағы
              </h3>
              <p className="text-xs text-slate-300 mb-6">
                «Зерде» 5-қосымшасы бойынша толтырылған тексеру тармақтары:
              </p>

              <div className="space-y-2.5 text-xs text-slate-200">
                {[
                  { item: 'Ықтимал тәуекелдер алдын ала анықталды', status: 'ИӘ' },
                  { item: 'Сауалнама үшін ерікті және ата-ананың жазбаша келісімі алынады', status: 'ИӘ' },
                  { item: 'Дербес деректер кодталады және ашық ЖИ-ге енгізілмейді', status: 'ИӘ' },
                  { item: 'Жануарларға зиян келтіретін немесе қауіпті химиялық сынақ жоқ', status: 'Қолданылмайды' },
                  { item: 'Фото, дыбыс, суреттер және кодтың авторлық құқығы тексерілді', status: 'ИӘ' },
                  { item: 'Зерттеу күнделігі және бастапқы протоколдар сақталады', status: 'ИӘ' },
                  { item: 'ЖИ пайдалану туралы ресми декларация толтырылады', status: 'ИӘ' }
                ].map((row, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#041535] flex items-center justify-between border border-white/5">
                    <span>{row.item}</span>
                    <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
