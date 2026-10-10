import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Maximize2, 
  Printer, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  PenTool, 
  Save, 
  Layers,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConclusionSectionProps {
  onOpenExhibition: () => void;
  onOpenPosters: () => void;
}

export const ConclusionSection: React.FC<ConclusionSectionProps> = ({
  onOpenExhibition,
  onOpenPosters
}) => {
  const [reflection1, setReflection1] = useState('Салт-дәстүрлердің жай ғана тарихи рәсім емес, терең адамгершілік және тәрбиелік құндылық екенін түсіндім. Деректерді UNESCO мен ғылыми кітаптардан тексерудің маңызын үйрендім.');
  const [reflection2, setReflection2] = useState('ЖИ-чатботтың ойдан дерек қоспауын (галлюцинация жасамауын) қамтамасыз ету қиын болды. Оны шешу үшін білім қорын қатаң 6 карточкамен шектеп, тексеру рубрикасын енгіздік.');
  const [reflection3, setReflection3] = useState('Бастапқыда барлық дәстүрлерге бірден AR жасауды ойлаған едік. Бірақ ғылыми кеңесшіммен ақылдаса келе, сапалы зерттеу үшін 3 негізгі сценариймен шектеліп, әдістемені тереңдету дұрыс деп таптық.');
  const [reflection4, setReflection4] = useState('Болашақта тәжірибеден кейін оқушыларға арналған 3D моделдердің санын көбейтіп, AR ашылмайтын ескі телефондар үшін жеңілдетілген нұсқаны дамытамын.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveReflection = () => {
    setSavedSuccess(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <section id="conclusion" className="py-20 bg-[#051B44] relative border-t border-[#00BFFF]/15 overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-[#00BFFF]/10 via-[#062B65]/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#062B65] border border-[#D49A35]/40 text-[#D49A35] text-xs font-semibold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            12-Бөлім • Қорытынды және Рефлексия
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif mb-4">
            Жобаның Қорытындысы мен Келесі Қадамдар
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            «Технологияның міндеті – дәстүрді өзгертіп көрсету емес, оның мәнін қазіргі ұрпаққа түсінуге көмектесу.»
          </p>
        </div>

        {/* Readiness Matrix: Done vs To Do */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Done Panel */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Дайын болған нәтижелер (Done)</h3>
                <span className="text-xs text-emerald-400">Толық әзірленген және құжатталған</span>
              </div>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>6 Тексерілген оқу карточкасы:</strong> Ғылыми деректерге негізделген мазмұндық қор.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>ЖИ-чатботтың жауап беру алгоритмі:</strong> 10 сұрақтық сапа рубрикасы және шектеулер.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>3 AR-сценарий (Наурыз, Тұсаукесер, Асар):</strong> AR.js маркерлік кеңістігі мен 3D үлгілері.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Зерттеу мен бағалау әдістемесі:</strong> A/B салыстырмалы тәжірибе хаттамасы мен тестілері.</span>
              </li>
            </ul>
          </div>

          {/* To Do Panel */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D49A35]/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#D49A35]/20 text-[#D49A35] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Кезектегі ғылыми қадамдар (To Do)</h3>
                <span className="text-xs text-[#D49A35]">Тәжірибе кезеңінде орындалатын міндеттер</span>
              </div>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full border border-slate-500 shrink-0 mt-0.5" />
                <span><strong>Нақты оқушылармен тәжірибе:</strong> 7-сыныптың 2 тобымен (15+15) эксперимент жүргізу.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full border border-slate-500 shrink-0 mt-0.5" />
                <span><strong>Зерттеу күнделігін толтыру:</strong> Сынақтар барысындағы қиындықтарды күнделікке тіркеу.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full border border-slate-500 shrink-0 mt-0.5" />
                <span><strong>Нақты сандық деректерді талдау:</strong> Тек жиналған тест нәтижелерінен кейін ресми қорытынды жасау.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Cinematic Digital Book Exhibition Scene */}
        <div className="relative rounded-3xl overflow-hidden border border-[#00BFFF]/40 shadow-2xl mb-16">
          <div className="aspect-[16/9] sm:aspect-[21/9] w-full bg-slate-900 relative">
            <img
              src="/assets/holographic_book.jpg"
              alt="Сандық кітап пен голограммалық дәстүрлер"
              className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#051B44] via-black/40 to-transparent" />
            
            <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end max-w-3xl">
              <span className="text-xs uppercase tracking-widest text-[#00E5FF] font-bold mb-2">
                Цифрлық Экспозиция • 2026
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-serif mb-3">
                Өткеннің Құндылықтары – Болашақтың Тілінде
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
                Жасанды интеллект пен толықтырылған шынайылық дәстүрлерді музей сөресінен шығарып, 
                жас буынның көкейіне қондыратын интерактивті көпірге айналды.
              </p>

              {/* CTAs in the banner */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={onOpenExhibition}
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-[#051B44] bg-[#00BFFF] hover:bg-[#38D2FF] shadow-cyan-glow flex items-center gap-2 transition-all transform hover:scale-105"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Қазылар алқасына таныстыру режимі</span>
                </button>

                <button
                  onClick={onOpenPosters}
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#062B65]/90 hover:bg-[#0B357A] border border-[#D49A35] flex items-center gap-2 transition-all"
                >
                  <Printer className="w-4 h-4 text-[#D49A35]" />
                  <span>3 Баспа Плакатын көру</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Author Reflection Form (Appendix В) */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#D49A35]/20 text-[#D49A35] flex items-center justify-center">
              <PenTool className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-[#D49A35] tracking-wider">
                В Қосымшасы • Зерттеу Күнделігі
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Автор Рефлексиясы (Туребаева Арайлым, 7 «А»)
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#00BFFF] block">
                1) Осы жобада мен ең көп үйренгенім:
              </label>
              <textarea
                value={reflection1}
                onChange={(e) => setReflection1(e.target.value)}
                rows={3}
                className="w-full p-3.5 rounded-xl bg-[#041535] border border-white/15 text-xs text-white focus:outline-none focus:border-[#00BFFF] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#00BFFF] block">
                2) Маған қиын болған жұмыс кезеңі және оны қалай шештім:
              </label>
              <textarea
                value={reflection2}
                onChange={(e) => setReflection2(e.target.value)}
                rows={3}
                className="w-full p-3.5 rounded-xl bg-[#041535] border border-white/15 text-xs text-white focus:outline-none focus:border-[#00BFFF] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#D49A35] block">
                3) Алғашқы ойымнан өзгерткен бір шешімім:
              </label>
              <textarea
                value={reflection3}
                onChange={(e) => setReflection3(e.target.value)}
                rows={3}
                className="w-full p-3.5 rounded-xl bg-[#041535] border border-white/15 text-xs text-white focus:outline-none focus:border-[#D49A35] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#D49A35] block">
                4) Егер жобаны қайта жасасам, нені жетілдіремін:
              </label>
              <textarea
                value={reflection4}
                onChange={(e) => setReflection4(e.target.value)}
                rows={3}
                className="w-full p-3.5 rounded-xl bg-[#041535] border border-white/15 text-xs text-white focus:outline-none focus:border-[#D49A35] transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-[11px] text-slate-400">
              Бұл жазбалар зерттеу күнделігіне сақталып, қорғау кезінде көрсетіледі.
            </span>
            <button
              onClick={handleSaveReflection}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#D49A35] hover:bg-[#F3BE5E] text-[#051B44] flex items-center gap-2 shadow-gold-glow transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{savedSuccess ? 'Күнделікке сақталды!' : 'Жазбаны бекіту'}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
