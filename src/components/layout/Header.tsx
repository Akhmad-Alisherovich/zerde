import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  Compass, 
  Layers, 
  Bot, 
  Maximize2, 
  Printer, 
  Menu, 
  X, 
  BookOpen, 
  BarChart2, 
  ShieldCheck, 
  Sparkles,
  Award
} from 'lucide-react';
import { PROJECT_INFO } from '../../data/researchData';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: '/', label: 'Басты бет', icon: Compass, end: true },
    { to: '/relevance', label: 'Өзектілігі', icon: BookOpen },
    { to: '/modules', label: '4 Модуль', icon: Layers },
    { to: '/traditions', label: '6 Дәстүр', icon: Sparkles },
    { to: '/ai-assistant', label: 'ЖИ-көмекші', icon: Bot },
    { to: '/ar-gallery', label: 'AR галерея', icon: Maximize2 },
    { to: '/research', label: 'Зерттеу', icon: BarChart2 },
    { to: '/ethics', label: 'Этика', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#051B44]/95 backdrop-blur-md border-b border-[#00BFFF]/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 min-h-20 py-2">
          
          {/* Logo & School Badge */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-gradient-to-br from-[#062B65] to-[#0B357A] border border-[#D49A35]/50 flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform">
              <img 
                src="/assets/ornament-icon.svg" 
                alt="Зерде логотипі" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="hidden min-[390px]:flex text-[10px] uppercase tracking-normal text-[#D49A35] font-semibold items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#D49A35]" />
                  ЗЕРДЕ 2026 • 7-СЫНЫП
                </span>
                <span className="hidden 2xl:inline px-1.5 py-0.2 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded text-[10px] text-[#00BFFF]">
                  «Озат» ЛИЦЕЙІ
                </span>
              </div>
              <h1 className="text-xs sm:text-base md:text-lg font-bold text-[#F8FCFF] group-hover:text-[#00BFFF] transition-colors leading-snug">
                <span className="min-[390px]:hidden xl:inline">ЗЕРДЕ</span>
                <span className="hidden min-[390px]:inline xl:hidden">{PROJECT_INFO.title}</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-0.5 shrink-0" aria-label="Негізгі мәзір">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-2 py-2 min-h-11 rounded-lg text-xs font-semibold transition-all flex items-center whitespace-nowrap ${
                    isActive
                      ? 'bg-[#00BFFF] text-[#051B44] shadow-cyan-glow'
                      : 'text-slate-200 hover:text-[#00BFFF] hover:bg-[#062B65]/70'
                  }`
                }
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Action CTAs: Posters & Exhibition Mode */}
          <div className="hidden 2xl:flex items-center space-x-2.5 shrink-0">
            <NavLink
              to="/posters"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs font-semibold border flex items-center space-x-2 transition-all ${
                  isActive
                    ? 'bg-[#D49A35] text-[#051B44] border-[#D49A35] shadow-gold-glow'
                    : 'text-[#DDF5FF] bg-[#062B65]/80 hover:bg-[#0B357A] border-[#00BFFF]/30 hover:border-[#00BFFF]'
                }`
              }
              title="3 көрме плакатын қарау және басып шығару"
            >
              <Printer className="w-4 h-4 text-[#00BFFF]" />
              <span>3 Плакат (Баспа)</span>
            </NavLink>

            <Link
              to="/exhibition"
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#051B44] bg-gradient-to-r from-[#00BFFF] to-[#00E5FF] hover:from-[#38D2FF] hover:to-[#00BFFF] flex items-center space-x-2 shadow-cyan-glow transition-all transform hover:scale-105"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Көрме режимі</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="2xl:hidden flex items-center gap-2 shrink-0">
            <Link
              to="/posters"
              className="sm:hidden min-w-11 min-h-11 flex items-center justify-center rounded-lg bg-[#062B65] text-[#00BFFF] border border-[#00BFFF]/30"
              title="Плакаттар"
              aria-label="Плакаттарды ашу"
            >
              <Printer className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(open => !open)}
              className="min-w-11 min-h-11 flex items-center justify-center rounded-lg text-slate-200 hover:text-white hover:bg-[#062B65] transition-colors"
              aria-label={mobileMenuOpen ? 'Мәзірді жабу' : 'Мәзірді ашу'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <nav id="mobile-navigation" aria-label="Қосымша мәзір" className="2xl:hidden bg-[#062B65] border-b border-[#00BFFF]/30 px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] space-y-1.5 max-h-[calc(100dvh-5rem)] overflow-y-auto animate-fadeIn">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 min-h-11 rounded-lg text-sm font-semibold ${
                  isActive
                    ? 'bg-[#00BFFF] text-[#051B44]'
                    : 'text-slate-200 hover:bg-[#0B357A] hover:text-[#00BFFF]'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <div className="pt-4 border-t border-[#00BFFF]/20 flex flex-col gap-2">
            <Link
              to="/posters"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-11 px-2 rounded-lg text-sm font-semibold text-[#DDF5FF] bg-[#0B357A] border border-[#00BFFF]/40 flex items-center justify-center space-x-2 text-center"
            >
              <Printer className="w-4 h-4 text-[#00BFFF]" />
              <span>3 Ғылыми Көрме Плакаты (Баспа)</span>
            </Link>
            <Link
              to="/exhibition"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-11 px-2 rounded-lg text-sm font-bold text-[#051B44] bg-[#00BFFF] flex items-center justify-center space-x-2 text-center"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Толық экранды Көрме режимі</span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};
