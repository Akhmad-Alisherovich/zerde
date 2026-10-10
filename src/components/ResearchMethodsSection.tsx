import React, { useState } from 'react';
import { 
  ClipboardList, 
  Eye, 
  TrendingUp, 
  Scale, 
  BarChart, 
  FileText, 
  CheckCircle2, 
  X,
  HelpCircle
} from 'lucide-react';
import { RESEARCH_METHODS } from '../data/researchData';

export const ResearchMethodsSection: React.FC = () => {
  const [showAppendixModal, setShowAppendixModal] = useState(false);

  const iconsMap: Record<string, any> = {
    Scale: Scale,
    FolderTree: FileText,
    LayoutGrid: Eye,
    ClipboardList: ClipboardList,
    TrendingUp: TrendingUp
  };

  return (
    <section id="methods" className="py-20 bg-[#051B44] relative border-t border-[#00BFFF]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#062B65] border border-[#00BFFF]/30 text-[#00BFFF] text-xs font-semibold uppercase tracking-wider mb-3">
            <ClipboardList className="w-3.5 h-3.5" />
            8-Бөлім • Ғылыми әдіснама
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif mb-4">
            Зерттеу Әдістері мен Құралдары
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Жобада теориялық жинақтау, педагогикалық жобалау және эмпирикалық салыстырмалы өлшеудің 
            өзара үйлесімді 5 нақты әдісі қолданылады.
          </p>
        </div>

        {/* 5 Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {RESEARCH_METHODS.map((m, idx) => {
            const Icon = iconsMap[m.iconName] || ClipboardList;
            return (
              <div
                key={m.id}
                className="glass-card p-6 rounded-3xl border border-white/10 hover:border-[#00BFFF]/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#00BFFF]/15 text-[#00BFFF] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#D49A35]">
                      Әдіс №{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {m.kzTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <div className="text-[11px] font-bold text-[#00BFFF] uppercase tracking-wider mb-2">
                    Негізгі әрекеттер:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {m.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}

          {/* 6th Card: Appendix Trigger */}
          <div className="glass-panel-gold p-6 rounded-3xl border border-[#D49A35]/40 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#D49A35]/20 text-[#D49A35] flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                А Қосымшасы: Бағалау Тапсырмалары
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                Оқушылардың білімін бағалауға арналған нақты сауалнама сұрақтары, 10 ұпайлық тапсырмалар 
                және бағалау кілтімен танысыңыз.
              </p>
            </div>

            <button
              onClick={() => setShowAppendixModal(true)}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-[#051B44] bg-[#D49A35] hover:bg-[#F3BE5E] flex items-center justify-center gap-2 shadow-gold-glow transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>А Қосымшасын қарау</span>
            </button>
          </div>
        </div>

        {/* Appendix Modal */}
        {showAppendixModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#081D47] border border-[#00BFFF]/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setShowAppendixModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-white mb-2">
                А Қосымшасы: Қысқа сауалнама және бақылау тапсырмалары
              </h3>
              <p className="text-xs text-slate-300 mb-6">
                «Зерде» талаптары бойынша әзірленген ресми бағалау парағы (Туребаева А., 2026).
              </p>

              <div className="space-y-4 text-xs text-slate-200">
                <div className="p-4 rounded-xl bg-[#041535] border border-white/10">
                  <h4 className="font-bold text-[#00BFFF] mb-2">1. Бастапқы сауалнама (3 сұрақ):</h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                    <li>Қандай екі ұлттық дәстүрді атай аласың?</li>
                    <li>Осы дәстүрлердің қандай тәрбиелік мағынасы бар?</li>
                    <li>Бұрын оқу үшін ЖИ немесе AR қолдандың ба? (Иә / Жоқ / Білмеймін)</li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl bg-[#041535] border border-white/10">
                  <h4 className="font-bold text-[#D49A35] mb-2">2. 10 Ұпайлық бақылау тапсырмалары:</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li>• <strong>1-тапсырма (2 ұпай):</strong> Наурыздағы бір әрекетті ата және оның қандай құндылықты білдіретінін түсіндір.</li>
                    <li>• <strong>2-тапсырма (2 ұпай):</strong> Көрісу күнінің мағынасын және үлкендерге сәлем берудің мәнін түсіндір.</li>
                    <li>• <strong>3-тапсырма (2 ұпай):</strong> Тұсаукесерде балаға қандай тілек айтылады? Оны күнделікті өмір мысалымен байланыстыр.</li>
                    <li>• <strong>4-тапсырма (2 ұпай):</strong> Беташар келінді кімдермен таныстырады және оған қандай өсиет айтылады?</li>
                    <li>• <strong>5-тапсырма (2 ұпай):</strong> Асар мен Еруліктің ұқсастығы мен айырмасын түсіндір.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#062B65]/70 border border-[#00BFFF]/30">
                  <h4 className="font-bold text-white mb-1">Бағалау кілті (Рубрика):</h4>
                  <p className="text-slate-300">
                    <strong>2 ұпай:</strong> Мағынасы дұрыс, түсіндіруі немесе өмірлік мысалы орынды.<br />
                    <strong>1 ұпай:</strong> Бір бөлігі дұрыс, бірақ толық емес.<br />
                    <strong>0 ұпай:</strong> Қате немесе жауап жоқ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
