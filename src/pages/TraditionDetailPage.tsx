import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  ChevronRight, 
  BookOpen, 
  Maximize2, 
  Bot, 
  HelpCircle, 
  Bookmark, 
  CheckCircle2, 
  Tag, 
  Share2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { TRADITIONS_DATA, AR_SCENARIOS_DATA } from '../data/traditionsData';
import { useChatbot } from '../context/ChatbotContext';
import { getCulturalMedia } from '../data/culturalMediaData';
import { CeremonyCinematicViewer } from '../components/media/CeremonyCinematicViewer';

export const TraditionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sendMessage } = useChatbot();

  const traditionIndex = TRADITIONS_DATA.findIndex(t => t.id === id);
  const tradition = TRADITIONS_DATA[traditionIndex];

  if (!tradition) {
    return (
      <div className="min-h-screen bg-[#051B44] text-[#F8FCFF] flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-3xl max-w-md text-center border border-[#00BFFF]/30">
          <BookOpen className="w-12 h-12 text-[#00BFFF] mx-auto mb-4" />
          <h2 className="text-xl font-bold font-serif mb-2">Дәстүр табылмады</h2>
          <p className="text-sm text-slate-300 mb-6">
            Көрсетілген салт-дәстүр бойынша оқу карточкасы табылмады.
          </p>
          <Link
            to="/traditions"
            className="px-5 py-2.5 rounded-xl bg-[#00BFFF] text-[#051B44] font-bold text-xs shadow-cyan-glow"
          >
            Барлық 6 дәстүр тізіміне оралу
          </Link>
        </div>
      </div>
    );
  }

  const prevTradition = traditionIndex > 0 ? TRADITIONS_DATA[traditionIndex - 1] : null;
  const nextTradition = traditionIndex < TRADITIONS_DATA.length - 1 ? TRADITIONS_DATA[traditionIndex + 1] : null;
  const arScenario = tradition.arScenarioId ? AR_SCENARIOS_DATA.find(s => s.id === tradition.arScenarioId) : null;
  const culturalMedia = getCulturalMedia(tradition.id);

  const handleAskAI = () => {
    const prompt = `${tradition.name} дәстүрінің тәрбиелік мәні мен мағынасы қандай?`;
    sendMessage(prompt);
    navigate('/ai-assistant');
  };

  return (
    <div className="min-h-screen bg-[#051B44] text-[#F8FCFF]">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-[#041433] border-b border-[#00BFFF]/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link to="/" className="hover:text-[#00BFFF] transition-colors">Басты бет</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/traditions" className="hover:text-[#00BFFF] transition-colors">6 Дәстүр</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#00BFFF] font-semibold">{tradition.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-lg bg-[#00BFFF]/20 border border-[#00BFFF]/40 text-xs font-mono font-bold text-[#00E5FF]">
                  {tradition.code} КАРТОЧКАСЫ
                </span>
                {tradition.tags.includes('UNESCO') && (
                  <span className="px-3 py-1 rounded-lg bg-[#D49A35]/20 border border-[#D49A35]/40 text-xs font-bold text-[#D49A35]">
                    UNESCO Адамзат Мұрасы
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif">
                {tradition.name}
              </h1>
              <p className="text-amber-300 text-sm sm:text-base font-medium mt-1">
                {tradition.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAskAI}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] font-bold text-xs sm:text-sm shadow-cyan-glow transition-all"
              >
                <Bot className="w-4 h-4" />
                <span>ЖИ-ден осы дәстүрді сұрау</span>
              </button>

              {tradition.hasArScenario && (
                <Link
                  to={`/ar-gallery?scenario=${tradition.arScenarioId}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D49A35] hover:bg-[#F3BE5E] text-[#051B44] font-bold text-xs sm:text-sm shadow-gold-glow transition-all"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>AR Галерея</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Detail Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Artwork & Highlights (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-3 rounded-3xl border border-[#00BFFF]/30 overflow-hidden shadow-2xl relative group">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900">
                <picture>
                  {culturalMedia?.coverImageWebp && <source srcSet={culturalMedia.coverImageWebp} type="image/webp" />}
                  <img
                    src={culturalMedia?.coverImage || tradition.image}
                    alt={tradition.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[11px] font-mono text-[#00E5FF] uppercase tracking-wider">
                    {culturalMedia ? 'Этнографиялық көрнекілік' : 'Түпнұсқа иллюстрациясы'}
                  </div>
                  <div className="text-sm font-semibold">{tradition.name} – бейнелік кеңістігі</div>
                </div>
              </div>

              {/* Core Value Callout */}
              <div className="p-4 bg-[#051B44]/90 rounded-2xl border border-white/10 mt-3">
                <div className="text-[11px] text-[#D49A35] font-bold uppercase tracking-wider mb-1">
                  Негізгі құндылық ұстанымы:
                </div>
                <div className="text-base font-bold text-white">
                  «{tradition.coreValue}»
                </div>
              </div>
            </div>

            {/* AR Scenario Card (if applicable) */}
            {arScenario && (
              <div className="glass-panel p-6 rounded-3xl border border-[#00BFFF]/40 shadow-cyan-glow/20 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#00BFFF]/20 text-[#00BFFF]">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">AR 3D Сценарийі бар</h4>
                      <p className="text-[11px] text-slate-300">{arScenario.name}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    WebAR Ready
                  </span>
                </div>
                
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  {arScenario.sceneDescription}
                </p>

                <div className="p-3 rounded-xl bg-[#041535] border border-white/10 text-xs mb-4">
                  <span className="text-[#00BFFF] font-semibold block mb-1">Оқушы тапсырмасы:</span>
                  <span className="text-slate-300">{arScenario.studentTask}</span>
                </div>

                <Link
                  to={`/ar-gallery?scenario=${arScenario.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#0090C8] hover:from-[#38D2FF] hover:to-[#00BFFF] text-[#051B44] font-bold text-xs flex items-center justify-center gap-2 shadow-cyan-glow transition-all"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Бұл сценарийді AR Галереясында ашу</span>
                </Link>
              </div>
            )}

            {/* Tags list */}
            <div className="glass-panel p-5 rounded-3xl border border-white/10">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#00BFFF]" />
                Байланысты тақырыптар мен тегтер:
              </h4>
              <div className="flex flex-wrap gap-2">
                {tradition.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Deep Cultural Knowledge, Reflection, Source (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Scientific & Educational Definition */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#00BFFF]/30">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00BFFF] uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4" />
                Оқулықтық және ғылыми түсініктеме
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 font-serif">
                Дәстүрдің тәрбиелік негізі
              </h2>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                {tradition.description}
              </p>
            </div>

            {/* 2. Deep Cultural and Historical Meaning */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#D49A35]/30 bg-gradient-to-br from-[#062B65]/40 to-[#041738]/60">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D49A35] uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                Терең тарихи және рухани мәні
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 font-serif">
                Ұрпақтар сабақтастығы мен халық даналығы
              </h2>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                {tradition.deepMeaning}
              </p>
            </div>

            {/* 3. Reflection Question Box */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#00BFFF]/50 bg-gradient-to-br from-[#051E4E] to-[#041638] shadow-lg relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-[#00BFFF]/20 text-[#00BFFF] shrink-0">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider mb-1">
                    7-сынып оқушысына арналған ойлану сұрағы
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                    «{tradition.reflectionQuestion}»
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Бұл сұрақ дәстүрдің тарихи мазмұнын қазіргі күнделікті мектеп өмірімен, 
                    адамгершілік қарым-қатынаспен байланыстырып, сыни ойлауды дамытады.
                  </p>

                  <button
                    onClick={handleAskAI}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] text-xs font-bold shadow-cyan-glow transition-all"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Бұл сұрақты ЖИ-көмекшімен талқылау</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Academic Citation Box */}
            <div className="p-5 rounded-2xl bg-[#041433] border border-white/10 text-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-400 font-semibold">
                  <Bookmark className="w-4 h-4 text-[#D49A35]" />
                  <span>Ресми ғылыми дереккөз:</span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">
                  Ref #{tradition.sourceRef}
                </span>
              </div>
              <p className="text-slate-300 italic font-mono text-[11px] leading-relaxed">
                {tradition.source}
              </p>
            </div>

          </div>

        </div>

        {/* Cultural Cinematic Media & Macro Closeups */}
        {culturalMedia && (
          <div className="mt-12 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#062B65] border border-[#00BFFF]/40 text-[#00E5FF] text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D49A35]" />
                  Этномәдени кешен & Жақын пландар
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
                  {tradition.name} рәсімінің визуалды оқу галереясы
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Рәсімнің маңызды кезеңдері, дәстүрлі киім-кешек, сәукеле, ағаш бұйымдары мен ұлттық ою-өрнектердің шынайы көрнекілігі.
                </p>
              </div>
            </div>
            <CeremonyCinematicViewer media={culturalMedia} />
          </div>
        )}

        {/* Previous & Next Tradition Navigation */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevTradition ? (
            <Link
              to={`/traditions/${prevTradition.id}`}
              className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-[#00BFFF]/40 flex items-center gap-3 transition-all group"
            >
              <div className="p-2 rounded-xl bg-white/5 group-hover:bg-[#00BFFF]/20 text-[#00BFFF]">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Алдыңғы дәстүр</div>
                <div className="text-sm font-bold text-white group-hover:text-[#00BFFF] transition-colors">
                  {prevTradition.name} ({prevTradition.code})
                </div>
              </div>
            </Link>
          ) : (
            <Link
              to="/traditions"
              className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-[#00BFFF]/40 flex items-center gap-3 transition-all group"
            >
              <div className="p-2 rounded-xl bg-white/5 group-hover:bg-[#00BFFF]/20 text-[#00BFFF]">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Тізімге оралу</div>
                <div className="text-sm font-bold text-white group-hover:text-[#00BFFF] transition-colors">
                  Барлық 6 дәстүр тізімі
                </div>
              </div>
            </Link>
          )}

          {nextTradition ? (
            <Link
              to={`/traditions/${nextTradition.id}`}
              className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-[#00BFFF]/40 flex items-center justify-between text-right gap-3 transition-all group"
            >
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Келесі дәстүр</div>
                <div className="text-sm font-bold text-white group-hover:text-[#00BFFF] transition-colors">
                  {nextTradition.name} ({nextTradition.code})
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 group-hover:bg-[#00BFFF]/20 text-[#00BFFF]">
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          ) : (
            <Link
              to="/ai-assistant"
              className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-[#00BFFF]/40 flex items-center justify-between text-right gap-3 transition-all group"
            >
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Келесі бөлім</div>
                <div className="text-sm font-bold text-white group-hover:text-[#00BFFF] transition-colors">
                  ЖИ-көмекшіге өту
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 group-hover:bg-[#00BFFF]/20 text-[#00BFFF]">
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
