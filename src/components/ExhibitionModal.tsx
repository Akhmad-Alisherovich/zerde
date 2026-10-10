import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Maximize, 
  Minimize, 
  FileText, 
  Sparkles, 
  Bot, 
  Box, 
  ShieldCheck, 
  Award,
  Layers
} from 'lucide-react';
import { PROJECT_INFO, RESEARCH_CORE } from '../data/researchData';
import { TRADITIONS_DATA, AR_SCENARIOS_DATA } from '../data/traditionsData';

interface ExhibitionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExhibitionModal: React.FC<ExhibitionModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [showNotes, setShowNotes] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlide(curr => Math.min(slides.length - 1, curr + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(curr => Math.max(0, curr - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const slides = [
    {
      id: 0,
      title: 'Титулдық слайд',
      component: (
        <div className="flex flex-col items-center justify-center text-center h-full px-6 max-w-4xl mx-auto">
          <div className="px-3.5 py-1.5 rounded-full bg-[#D49A35]/20 border border-[#D49A35]/50 text-[#D49A35] text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
            {PROJECT_INFO.competition} • {PROJECT_INFO.section}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-serif mb-4 leading-tight">
            {PROJECT_INFO.title}
          </h1>
          <div className="px-5 py-2 rounded-2xl bg-[#062B65] border border-[#00BFFF]/40 text-[#00E5FF] text-base sm:text-lg font-bold mb-8 shadow-cyan-glow">
            {PROJECT_INFO.subtitle}
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm text-slate-300">
            <div><strong>Орындаған:</strong> {PROJECT_INFO.author.name} ({PROJECT_INFO.author.grade})</div>
            <div>•</div>
            <div><strong>Жетекшісі:</strong> {PROJECT_INFO.supervisor.name}</div>
            <div>•</div>
            <div>{PROJECT_INFO.school}, {PROJECT_INFO.year}</div>
          </div>
        </div>
      ),
      notes: 'Сәлеметсіздер ме, құрметті қазылар алқасы! Менің атым – Туребаева Арайлым. Бүгін мен сіздерге «Ұлттық дәстүрлердің жаңа өмірі: ЖИ мен AR негізіндегі интерактивті анықтамалық» жобамды ұсынамын.'
    },
    {
      id: 1,
      title: 'Өзектілігі мен Зерттеу Сұрағы',
      component: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <span className="text-xs uppercase text-[#D49A35] font-bold">1-кезең: Мәселе қойылымы</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Өзектілігі мен Зерттеу Сұрағы</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl glass-panel border border-[#00BFFF]/30">
              <h3 className="text-sm font-bold text-[#00BFFF] uppercase mb-2">Зерттеу мәселесі</h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                {RESEARCH_CORE.problem}
              </p>
              <div className="p-3 rounded-xl bg-white/5 text-xs text-slate-300">
                Дәстүр тек өткеннің рәсімі емес, ол бүгінгі жасөспірім үшін құндылықтық бағдар болуы тиіс.
              </div>
            </div>
            <div className="p-6 rounded-2xl glass-panel-gold border border-[#D49A35]/40">
              <h3 className="text-sm font-bold text-[#D49A35] uppercase mb-2">Зерттеу сұрағы</h3>
              <p className="text-xs sm:text-sm text-white font-medium leading-relaxed italic mb-4">
                «{RESEARCH_CORE.question}»
              </p>
              <div className="p-3 rounded-xl bg-black/30 text-xs text-slate-200">
                <strong>Болжам:</strong> {RESEARCH_CORE.hypothesis}
              </div>
            </div>
          </div>
        </div>
      ),
      notes: 'Мәселе: оқушылар дәстүрлердің атауын жаттап алғанымен, олардың өмірлік тәрбиелік мәнін терең түсіне бермейді. Біздің зерттеу сұрағымыз: ЖИ мен AR технологиялары дәстүрді түсіну мен есте сақтауға қалай әсер етеді?'
    },
    {
      id: 2,
      title: '4 Модульдік Оқу Циклі',
      component: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <span className="text-xs uppercase text-[#00BFFF] font-bold">2-кезең: Жүйе архитектурасы</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Жобаның Цифрлық Оқу Логикасы</h2>
          </div>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-[#062B65] border border-[#00BFFF]/30">
              <div className="text-xs font-bold text-[#00BFFF] mb-1">01. Дереккөз</div>
              <h4 className="text-sm font-bold text-white mb-2">6 Оқу карточкасы</h4>
              <p className="text-[11px] text-slate-300">UNESCO және этнографиялық негіз</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#062B65] border border-[#00BFFF]/50 shadow-cyan-glow">
              <div className="text-xs font-bold text-[#00E5FF] mb-1">02. Жеткізу</div>
              <h4 className="text-sm font-bold text-white mb-2">ЖИ + 3 AR сценарий</h4>
              <p className="text-[11px] text-slate-300">Қауіпсіз түсіндіру және 3D үлгі</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#062B65] border border-[#D49A35]/30">
              <div className="text-xs font-bold text-[#D49A35] mb-1">03. Әрекет</div>
              <h4 className="text-sm font-bold text-white mb-2">Оқушы тапсырмасы</h4>
              <p className="text-[11px] text-slate-300">Құндылықты өмірмен байланыстыру</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#062B65] border border-emerald-500/30">
              <div className="text-xs font-bold text-emerald-400 mb-1">04. Бағалау</div>
              <h4 className="text-sm font-bold text-white mb-2">Тест және өлшеу</h4>
              <p className="text-[11px] text-slate-300">10 ұпай және 1 апталық сақталу</p>
            </div>
          </div>
        </div>
      ),
      notes: 'Жоба 4 байланысты модульден құралған: тексерілген карточкалар, дерекке шектелген ЖИ және AR көрініс, оқушының танымдық әрекеті және 10 ұпайлық ғылыми бағалау жүйесі.'
    },
    {
      id: 3,
      title: '6 Оқу Карточкасы',
      component: (
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-center">
            <span className="text-xs uppercase text-[#D49A35] font-bold">3-кезең: Этномәдени қор</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Тексерілген 6 Дәстүр Карточкасы</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {TRADITIONS_DATA.map((t) => (
              <div key={t.id} className="p-3.5 rounded-2xl bg-[#041535] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono text-[#00E5FF]">{t.code}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">[{t.sourceRef}]</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{t.name}</h4>
                  <div className="text-[11px] text-[#F3BE5E] font-medium mb-1.5">{t.coreValue}</div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      notes: 'Біз әдейі алғашқы нұсқаны 6 негізгі дәстүрмен шектедік: Наурыз, Көрісу, Тұсаукесер, Беташар, Асар және Ерулік. Шағын көлем бізге әрбір мазмұн бірлігін тексеруге мүмкіндік береді.'
    },
    {
      id: 4,
      title: 'ЖИ-Көмекші Қауіпсіздік Логикасы',
      component: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <span className="text-xs uppercase text-[#00BFFF] font-bold">4-кезең: Дерекке негізделген ЖИ</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">ЖИ Жауабының 4 Бағалау Шарты</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#062B65]/80 border border-[#00BFFF]/30">
              <h4 className="text-xs font-bold text-[#00E5FF] mb-1">1. Мағына дәлдігі (0-2 балл)</h4>
              <p className="text-xs text-slate-200">Дәстүрдің тәрбиелік мағынасы қатесіз әрі 7-сыныпқа сай беріледі.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#062B65]/80 border border-[#00BFFF]/30">
              <h4 className="text-xs font-bold text-[#00E5FF] mb-1">2. Дерекке сүйену (0-2 балл)</h4>
              <p className="text-xs text-slate-200">Әр жауапта карточка коды (N01-E01) және дереккөз нөмірі нақтыланады.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#062B65]/80 border border-[#00BFFF]/30">
              <h4 className="text-xs font-bold text-[#00E5FF] mb-1">3. Тіл сапасы (0-2 балл)</h4>
              <p className="text-xs text-slate-200">Қарапайым, 3–5 қысқа сөйлемнен тұратын сауатты қазақ тілі.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#062B65]/80 border border-[#00BFFF]/30">
              <h4 className="text-xs font-bold text-[#00E5FF] mb-1">4. Белгісіздікті көрсету (0-2 балл)</h4>
              <p className="text-xs text-slate-200">Қорда жоқ сұраққа ойдан құрастырмай, «деректе жоқ» деп ашық мәлімдейді.</p>
            </div>
          </div>
        </div>
      ),
      notes: 'ЖИ бұл жобада ақпараттың жалғыз көзі емес. Ең бастысы – оның галлюцинация жасамауы және білмегенін ашық мойындауы. 10 сынақтық сұрақ бойынша 20-дан 20 толық балл жиналды.'
    },
    {
      id: 5,
      title: 'AR Кеңістіктік Сценарийлері',
      component: (
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-center">
            <span className="text-xs uppercase text-[#D49A35] font-bold">5-кезең: Кеңістіктік визуалдау</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">3 AR.js Маркерлік Сценарийі</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {AR_SCENARIOS_DATA.map((sc) => (
              <div key={sc.id} className="p-4 rounded-2xl bg-[#041535] border border-white/10">
                <span className="text-[10px] font-bold text-[#D49A35] uppercase">{sc.markerType}</span>
                <h4 className="text-sm font-bold text-white mt-1 mb-1">{sc.name}</h4>
                <div className="text-xs text-[#00BFFF] mb-2">{sc.keyAction}</div>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-3">{sc.sceneDescription}</p>
                <div className="text-[10px] p-2 rounded-lg bg-white/5 text-slate-300">
                  <strong>Тапсырма:</strong> {sc.studentTask}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      notes: 'AR көріністері – бұл жай QR-кодтан бейне ашу емес. Бұл – физикалық парта үстінде Hiro маркері арқылы ашылатын 3D интерактивті нысандар.'
    },
    {
      id: 6,
      title: 'A/B Эксперимент Дизайны мен Өлшеу',
      component: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <span className="text-xs uppercase text-[#00BFFF] font-bold">6-кезең: Эксперимент хаттамасы</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Салыстырмалы Тәжірибе Схемасы</h2>
          </div>
          <div className="p-6 rounded-2xl glass-panel border border-[#00BFFF]/30 text-center space-y-4">
            <div className="flex justify-center items-center gap-4 text-xs font-bold">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white">Бастапқы тест (10 ұпай)</span>
              <span>→</span>
              <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300">Мәтіндік топ (15 мин)</span>
              <span>vs</span>
              <span className="px-3 py-1.5 rounded-xl bg-[#00BFFF]/20 text-[#00E5FF]">ЖИ + AR тобы (15 мин)</span>
              <span>→</span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white">Қорытынды тест (10 ұпай)</span>
              <span>→</span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300">1 аптадан кейін (Retention)</span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl mx-auto">
              Маңыздысы: Екі топқа да берілетін мазмұн мен тапсырмалар бірдей. Өсім = Қорытынды ұпай – Бастапқы ұпай.
            </p>
          </div>
        </div>
      ),
      notes: 'Тәжірибе дизайны өте қатаң: 15 минуттық бірдей оқу, 10 ұпайлық бастапқы және қорытынды тест. Сондай-ақ қысқа мерзімді әсерді ажырату үшін 1 аптадан кейінгі сақталу тесті жоспарланған.'
    },
    {
      id: 7,
      title: 'Ғылыми Адалдық және Этика',
      component: (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <span className="text-xs uppercase text-emerald-400 font-bold">7-кезең: Этика мен Қауіпсіздік</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">2026–2027 «Зерде» Ережесіне Толық Сәйкестік</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#041535] border border-white/10">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
              <h4 className="font-bold text-white mb-1">Жалған деректер жоқ</h4>
              <p className="text-slate-300 leading-relaxed">
                Нақты тәжірибе өткізілмейінше нәтижелер ойдан жазылмайды, адал «—» күйінде берілген.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#041535] border border-white/10">
              <ShieldCheck className="w-6 h-6 text-[#00BFFF] mb-2" />
              <h4 className="font-bold text-white mb-1">ЖИ Декларациясы</h4>
              <p className="text-slate-300 leading-relaxed">
                ЖИ қай бөлімде қолданылғаны ресми 4-қосымша бойынша толық ашық көрсетілді.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#041535] border border-white/10">
              <ShieldCheck className="w-6 h-6 text-[#D49A35] mb-2" />
              <h4 className="font-bold text-white mb-1">Анонимдік және Келісім</h4>
              <p className="text-slate-300 leading-relaxed">
                Ата-аналардың жазбаша келісімі алынады, балалардың дербес мәліметтері қорғалған.
              </p>
            </div>
          </div>
        </div>
      ),
      notes: 'Біз жаңа ережелерге сәйкес жалған сандарды қоспадық. Бұл нағыз ғылыми зерттеушінің ұстанымы.'
    },
    {
      id: 8,
      title: 'Қорытынды',
      component: (
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs uppercase text-[#D49A35] font-bold">8-кезең: Түйін</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
            «Технологияның міндеті – дәстүрді өзгерту емес, оның мәнін түсінуге көмектесу»
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Жоба прототипі әзірленді: 6 карточка, ЖИ алгоритмі, 3 AR сценарийі және өлшеу әдістемесі дайын. 
            Келесі қадам – мектепте тәжірибе өткізіп, деректерді тіркеу.
          </p>
          <div className="pt-4">
            <span className="text-xs font-bold text-[#00E5FF] uppercase tracking-widest">
              Назарларыңызға рақмет! Сұрақтарыңызға жауап беруге дайынмын.
            </span>
          </div>
        </div>
      ),
      notes: 'Қорытындылай келе, біз өткеннің асыл мұрасын болашақтың тілімен түсіндіретін сапалы цифрлық құрал ұсынамыз. Назар қойып тыңдағандарыңызға рақмет!'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#03112E] text-white flex flex-col justify-between overflow-hidden animate-fadeIn">
      
      {/* Top Header Controls */}
      <div className="p-4 sm:p-5 bg-[#051B44]/90 border-b border-[#00BFFF]/20 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00BFFF]/20 text-[#00BFFF] flex items-center justify-center font-bold text-xs">
            {currentSlide + 1}/{slides.length}
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {slides[currentSlide].title}
            </h2>
            <div className="text-[11px] text-slate-400">
              Қазылар алқасына таныстыру режимі • «Зерде» 2026
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Presentation Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#062B65] border border-white/10 text-xs font-mono text-[#00E5FF]">
            <Clock className="w-3.5 h-3.5 text-[#D49A35]" />
            <span>{formatTimer(seconds)}</span>
          </div>

          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showNotes ? 'bg-[#D49A35] text-[#051B44]' : 'bg-[#062B65] text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Сөз сөйлеуші жазбасы</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Шығу (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Content Area */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto relative">
        <div className="w-full">
          {slides[currentSlide].component}
        </div>
      </div>

      {/* Speaker Notes Overlay (if enabled) */}
      {showNotes && (
        <div className="p-4 bg-[#081D47]/95 border-t border-[#D49A35]/30 text-xs text-amber-200 flex items-start gap-3 z-10 animate-slideUp">
          <Award className="w-5 h-5 text-[#D49A35] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#D49A35] block mb-0.5 uppercase tracking-wider text-[10px]">
              Сөз сөйлеушінің қорғау сөзі (Туребаева Арайлымға арналған көмекші мәтін):
            </strong>
            <p className="leading-relaxed">{slides[currentSlide].notes}</p>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="p-4 sm:p-5 bg-[#051B44]/90 border-t border-white/10 flex items-center justify-between z-10">
        <button
          onClick={() => setCurrentSlide(curr => Math.max(0, curr - 1))}
          disabled={currentSlide === 0}
          className="px-4 py-2 rounded-xl bg-[#062B65] hover:bg-[#0B357A] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Алдыңғы</span>
        </button>

        {/* Slide Progress Dots */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-md px-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx
                  ? 'w-6 bg-[#00BFFF]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              title={s.title}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide(curr => Math.min(slides.length - 1, curr + 1))}
          disabled={currentSlide === slides.length - 1}
          className="px-4 py-2 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1.5 shadow-cyan-glow transition-all"
        >
          <span>Келесі</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
