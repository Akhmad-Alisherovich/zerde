import React from 'react';
import { 
  Sparkles, 
  Award, 
  School, 
  BookOpen, 
  Presentation, 
  Layers, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { RESEARCH_CORE } from '../data/researchData';

export const NoveltyValueSection: React.FC = () => {
  return (
    <section id="novelty" className="py-20 bg-[#051B44] relative border-t border-[#00BFFF]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#062B65] border border-[#D49A35]/40 text-[#D49A35] text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            10-Бөлім • Жаңалық пен Құндылық
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif mb-4">
            Жобалық Жаңалығы мен Практикалық Маңызы
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Технология мен дәстүрдің тоғысуы: теориялық тұрғыдан жаңа оқу циклі және 
            мектеп тәжірибесіне бірден енгізуге дайын қолданбалы өнім.
          </p>
        </div>

        {/* 2 Main Visual Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Panel 1: Жобалық Жаңалығы */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[#00BFFF]/40 flex flex-col justify-between relative overflow-hidden shadow-cyan-glow">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00BFFF]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#00BFFF]/20 text-[#00BFFF] flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-[#00E5FF] tracking-wider">
                    Ғылыми-әдістемелік ерекшелік
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Жобалық Жаңалығы
                  </h3>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#041535]/90 border border-[#00BFFF]/20 text-sm text-[#F8FCFF] leading-relaxed mb-6 font-medium">
                «{RESEARCH_CORE.novelty}»
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#00BFFF]/15 text-[#00BFFF] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-white">Дерекке қатаң бағындырылған ЖИ:</strong>
                    <p className="text-slate-300 text-xs mt-0.5">
                      Чатбот ойдан шығармайды (галлюцинация жоқ), әр сөзін бекітілген оқу карточкасы кодымен дәйектейді.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#00BFFF]/15 text-[#00BFFF] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-white">Көрнекі этнографиялық медиа кешен:</strong>
                    <p className="text-slate-300 text-xs mt-0.5">
                      Салт-дәстүр рәсімдерінің заттық мәні (ала жіп, дастарқан, шаңырақ, сәукеле) жоғары ажыратымдылықтағы этнографиялық суреттер мен танымдық бейнероликтер түрінде беріледі.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#00BFFF]/15 text-[#00BFFF] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-white">Өлшенетін педагогикалық цикл:</strong>
                    <p className="text-slate-300 text-xs mt-0.5">
                      Жай визуализациямен шектелмей, 10 ұпайлық жүйе және 1 апталық есте сақтау (retention) сынағымен тексеріледі.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 text-xs text-[#00BFFF] flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#00BFFF]" />
              <span>«Зерде» талабына сай авторлық бірегей архитектура</span>
            </div>
          </div>

          {/* Panel 2: Практикалық Маңызы */}
          <div className="glass-panel-gold p-8 sm:p-10 rounded-3xl border border-[#D49A35]/40 flex flex-col justify-between relative overflow-hidden shadow-gold-glow">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D49A35]/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#D49A35]/25 text-[#D49A35] flex items-center justify-center">
                  <School className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-[#D49A35] tracking-wider">
                    Мектеп өмірінде қолданылуы
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Практикалық Маңызы
                  </h3>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {RESEARCH_CORE.practicalValue.map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#041535]/80 border border-white/10 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#D49A35]/20 text-[#D49A35] shrink-0 mt-0.5">
                      {i === 0 ? <Presentation className="w-5 h-5" /> : i === 1 ? <BookOpen className="w-5 h-5" /> : <School className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        <span className="text-[10px] px-2 py-0.2 rounded bg-[#D49A35]/20 text-[#F3BE5E] font-semibold">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
              <strong className="text-[#F3BE5E] block mb-1">Қолжетімділік:</strong>
              Платформа арнайы қымбат AR көзілдіріктерін талап етпейді; кез келген оқушының смартфоны мен қарапайым басылған Hiro маркері арқылы жұмыс істей береді.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
