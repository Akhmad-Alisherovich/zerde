import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  BookOpen, 
  Layers, 
  Bot, 
  Maximize2, 
  BarChart2, 
  ShieldCheck, 
  Printer, 
  ArrowRight, 
  CheckCircle2, 
  Compass,
  Award
} from 'lucide-react';
import { PROJECT_INFO } from '../data/researchData';
import { TRADITIONS_DATA } from '../data/traditionsData';

export const HomePage: React.FC = () => {
  const hubCards = [
    {
      title: 'Зерттеу Өзектілігі',
      subtitle: 'Мәселе, зерттеу сұрағы және салыстырмалы матрица',
      to: '/relevance',
      icon: BookOpen,
      color: '#00BFFF',
      badge: '2-Бөлім'
    },
    {
      title: '4 Байланысты Модуль',
      subtitle: 'Цифрлық оқу логикасы: Карточка → ЖИ/AR → Тапсырма → Бағалау',
      to: '/modules',
      icon: Layers,
      color: '#00E5FF',
      badge: '3-Бөлім'
    },
    {
      title: '6 Этномәдени Дәстүр',
      subtitle: 'Наурыз, Көрісу, Тұсаукесер, Беташар, Асар, Ерулік карточкалары',
      to: '/traditions',
      icon: Sparkles,
      color: '#D49A35',
      badge: '4-Бөлім'
    },
    {
      title: 'ЖИ Оқу Көмекшісі',
      subtitle: 'Тексерілген білім қорымен шектелген чатбот және 10 сынақтық сұрақ',
      to: '/ai-assistant',
      icon: Bot,
      color: '#38D2FF',
      badge: '5-Бөлім'
    },
    {
      title: 'AR Кеңістіктік Галерея',
      subtitle: '3D интерактивті үлгілер, парта үстіндегі WebAR және Hiro маркері',
      to: '/ar-gallery',
      icon: Maximize2,
      color: '#00BFFF',
      badge: '6-Бөлім'
    },
    {
      title: 'Ғылыми Зерттеу мен Нәтиже',
      subtitle: 'A/B тәжірибе дизайны, 5 әдіснама және сараптамалық хаттама',
      to: '/research',
      icon: BarChart2,
      color: '#F3BE5E',
      badge: '7–9 Бөлімдер'
    },
    {
      title: 'Этика мен Қауіпсіздік',
      subtitle: 'Ата-ана келісімі, анонимділік, ЖИ декларациясы (2026 ережесі)',
      to: '/ethics',
      icon: ShieldCheck,
      color: '#10B981',
      badge: '11-Бөлім'
    },
    {
      title: '3 Баспа Көрме Плакаты',
      subtitle: 'Ғылыми стендке арналған жоғары ажыратымдылықтағы баспа нұсқалары',
      to: '/posters',
      icon: Printer,
      color: '#D49A35',
      badge: 'Баспа (Print)'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Cinematic Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/kazakh_landscape.jpg"
            alt="Қазақстан табиғаты, киіз үй және қыран"
            className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08] scale-105 transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051B44] via-[#051B44]/70 to-[#062B65]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#051B44]/90 via-transparent to-[#051B44]/80" />
          
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 191, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 191, 255, 0.4) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          
          {/* Competition Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-[#D49A35]/40 text-[#D49A35] text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 shadow-gold-glow animate-pulse">
            <Sparkles className="w-4 h-4 text-[#D49A35]" />
            <span>{PROJECT_INFO.competition} • Секция: {PROJECT_INFO.section}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F8FCFF] font-serif leading-[1.15] mb-4 drop-shadow-lg">
            <span className="block text-[#DDF5FF] text-xl sm:text-2xl md:text-3xl font-sans font-medium tracking-widest text-[#00BFFF] uppercase mb-2">
              Ғылыми зерттеу жобасы
            </span>
            <span className="bg-gradient-to-r from-[#F8FCFF] via-[#DDF5FF] to-[#D49A35] bg-clip-text text-transparent">
              {PROJECT_INFO.title}
            </span>
          </h1>

          {/* Subtitle pill */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="inline-block px-5 py-2.5 rounded-2xl bg-[#062B65]/80 backdrop-blur-md border border-[#00BFFF]/40 shadow-cyan-glow">
              <p className="text-sm sm:text-lg md:text-xl font-semibold text-[#00E5FF] tracking-wide">
                {PROJECT_INFO.subtitle}
              </p>
            </div>
          </div>

          {/* Author & Supervisor Card */}
          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-6 py-3 rounded-2xl glass-panel border border-white/10 mb-10 text-xs sm:text-sm text-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-[#D49A35] font-semibold">Орындаған:</span>
              <span className="text-[#F8FCFF] font-medium">{PROJECT_INFO.author.name}</span>
              <span className="text-[#00BFFF]/80">({PROJECT_INFO.author.grade})</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <span className="text-[#D49A35] font-semibold">Жетекшісі:</span>
              <span className="text-[#F8FCFF] font-medium">{PROJECT_INFO.supervisor.name}</span>
              <span className="text-slate-400">({PROJECT_INFO.supervisor.role})</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2 text-slate-300">
              <span>{PROJECT_INFO.school}, {PROJECT_INFO.region}</span>
            </div>
          </div>

          {/* 3 Main Action Triggers linking to independent routes */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-14">
            <Link
              to="/relevance"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold text-[#051B44] bg-[#00BFFF] hover:bg-[#38D2FF] shadow-cyan-glow flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Жобамен танысу</span>
            </Link>

            <Link
              to="/modules"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold text-[#F8FCFF] bg-[#062B65]/90 hover:bg-[#0B357A] border border-[#00BFFF]/40 hover:border-[#00BFFF] flex items-center justify-center gap-2 transition-all shadow-glass"
            >
              <Bot className="w-4 h-4 text-[#00BFFF]" />
              <span>Цифрлық өнім (ЖИ + AR)</span>
            </Link>

            <Link
              to="/research"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold text-[#DDF5FF] bg-transparent hover:bg-white/5 border border-[#D49A35]/50 hover:border-[#D49A35] flex items-center justify-center gap-2 transition-all"
            >
              <Layers className="w-4 h-4 text-[#D49A35]" />
              <span>Зерттеу дизайны мен нәтижелері</span>
            </Link>
          </div>

          {/* Quick stats pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto text-left">
            <Link to="/traditions" className="p-4 rounded-xl glass-panel border border-[#00BFFF]/20 flex items-start gap-3 hover:border-[#00BFFF] transition-colors">
              <div className="p-2 rounded-lg bg-[#00BFFF]/10 text-[#00BFFF] shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold text-white">6 Карточка</div>
                <div className="text-xs text-slate-300">Тексерілген этномәдени қор</div>
              </div>
            </Link>

            <Link to="/ai-assistant" className="p-4 rounded-xl glass-panel border border-[#00BFFF]/20 flex items-start gap-3 hover:border-[#00BFFF] transition-colors">
              <div className="p-2 rounded-lg bg-[#00BFFF]/10 text-[#00BFFF] shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold text-white">ЖИ-Көмекші</div>
                <div className="text-xs text-slate-300">Дерекке шектелген алгоритм</div>
              </div>
            </Link>

            <Link to="/ar-gallery" className="p-4 rounded-xl glass-panel border border-[#00BFFF]/20 flex items-start gap-3 hover:border-[#00BFFF] transition-colors">
              <div className="p-2 rounded-lg bg-[#00BFFF]/10 text-[#00BFFF] shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold text-white">3 AR Көрініс</div>
                <div className="text-xs text-slate-300">Маркерлік кеңістіктік үлгі</div>
              </div>
            </Link>

            <Link to="/research" className="p-4 rounded-xl glass-panel border border-[#D49A35]/30 flex items-start gap-3 hover:border-[#D49A35] transition-colors">
              <div className="p-2 rounded-lg bg-[#D49A35]/15 text-[#D49A35] shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold text-white">A/B Тәжірибесі</div>
                <div className="text-xs text-slate-300">Ғылыми салыстыру өлшемі</div>
              </div>
            </Link>
          </div>

        </div>
      </section>

      {/* 2. Navigation Hub: Explore the Independent Pages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#D49A35] font-bold">
            Навигациялық орталық
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif mt-2 mb-4">
            Жоба Бөлімдеріне Шолу
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Әрбір бөлім өз алдына толыққанды дербес бет ретінде жұмыс істейді. 
            Қажетті бағытты таңдап, тереңірек танысыңыз:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {hubCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Link
                key={i}
                to={card.to}
                className="group p-6 rounded-3xl glass-card flex flex-col justify-between transform hover:-translate-y-1.5 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors"
                      style={{ backgroundColor: `${card.color}20`, color: card.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-slate-300">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#00BFFF] transition-colors mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {card.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#00BFFF]">
                  <span>Бетке өту</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Spotlight: 6 Traditions Mini Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-[#00BFFF]/30">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#00BFFF] font-bold">
                Этномәдени қор
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Қазақ Салт-Дәстүрлерінің 6 Оқу Карточкасы
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
                Әрбір дәстүрдің тарихи мағынасы, тәрбиелік құндылығы, рефлексия сұрағы және ғылыми сілтемесі дербес бетте берілген.
              </p>
            </div>
            <Link
              to="/traditions"
              className="px-6 py-3 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] text-xs sm:text-sm font-bold flex items-center gap-2 shadow-cyan-glow shrink-0 transition-all"
            >
              <span>Барлық 6 карточканы ашу</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {TRADITIONS_DATA.map((t) => (
              <Link
                key={t.id}
                to={`/traditions/${t.id}`}
                className="group p-3 rounded-2xl bg-[#041638] border border-white/10 hover:border-[#00BFFF]/50 flex flex-col items-center text-center transition-all"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden mb-2 relative">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-1 left-1 px-1 rounded bg-black/70 text-[9px] font-mono text-[#00E5FF]">
                    {t.code}
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-[#00BFFF] transition-colors">{t.name}</h4>
                <div className="text-[10px] text-[#D49A35] truncate max-w-full mt-0.5">{t.coreValue}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Cinematic Exhibition Feature */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-[#00BFFF]/40 shadow-2xl">
          <div className="aspect-[16/9] sm:aspect-[21/9] w-full bg-slate-900 relative">
            <img
              src="/assets/holographic_book.jpg"
              alt="Сандық кітап пен голограммалық дәстүрлер"
              className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#051B44] via-black/40 to-transparent" />
            
            <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end max-w-3xl">
              <span className="text-xs uppercase tracking-widest text-[#00E5FF] font-bold mb-2">
                Интерактивті Ғылыми Экспозиция • 2026
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-serif mb-3">
                «Технологияның міндеті – дәстүрді өзгерту емес, оның мәнін түсінуге көмектесу»
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
                Жоба ғылыми қазылар алқасына таныстыруға, мектеп сыныптарында қолдануға және көрме стендтеріне басып шығаруға толық дайын.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/exhibition"
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-[#051B44] bg-[#00BFFF] hover:bg-[#38D2FF] shadow-cyan-glow flex items-center gap-2 transition-all transform hover:scale-105"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Толық экранды Қазылар Режиміне өту</span>
                </Link>

                <Link
                  to="/posters"
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#062B65]/90 hover:bg-[#0B357A] border border-[#D49A35] flex items-center gap-2 transition-all"
                >
                  <Printer className="w-4 h-4 text-[#D49A35]" />
                  <span>3 Баспа Көрме Плакатын көру</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
