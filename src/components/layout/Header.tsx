import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  Compass, 
  Layers, 
  Bot, 
  Film, 
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
    { to: '/media-gallery', label: 'AR галерея', icon: Film },
    { to: '/research', label: 'Зерттеу', icon: BarChart2 },
    { to: '/ethics', label: 'Этика', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#051B44]/95 backdrop-blur-md border-b border-[#00BFFF]/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 min-h-20 py-2">
          
          {/* Logo & School Badge */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-gradient-to-br from-[#062B65] to-[#0B357A] border border-[#D49A35]/50 flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform">
              <img 
                src="/assets/ornament-icon.svg" 
                alt="Зерде логотипі" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="hidden min-[390px]:flex text-[10px] uppercase tracking-normal text-[#D49A35] font-semibold items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#D49A35]" />
                  ЗЕРДЕ 2026 • 7-СЫНЫП
                </span>
                <span className="hidden xl:inline px-1.5 py-0.2 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded text-[10px] text-[#00E5FF]">
                  «Озат» ЛИЦЕЙІ
                </span>
              </div>
              <h1 className="text-xs sm:text-base md:text-lg font-bold text-[#F8FCFF] group-hover:text-[#00BFFF] transition-colors leading-snug">
                <span className="min-[390px]:hidden lg:inline">ЗЕРДЕ</span>
                <span className="hidden min-[390px]:inline lg:hidden">{PROJECT_INFO.title}</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 shrink-0" aria-label="Негізгі мәзір">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-2.5 py-2 min-h-10 rounded-xl text-xs font-semibold transition-all flex items-center whitespace-nowrap ${
                    isActive
                      ? 'bg-[#00BFFF] text-[#051B44] shadow-cyan-glow font-bold'
                      : 'text-slate-200 hover:text-[#00BFFF] hover:bg-[#062B65]/80'
                  }`
                }
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Mobile hamburger button */}
          <div className="lg:hidden flex items-center shrink-0">
            <button
              onClick={() => setMobileMenuOpen(open => !open)}
              className="min-w-11 min-h-11 flex items-center justify-center rounded-xl text-slate-200 hover:text-white hover:bg-[#062B65] transition-colors border border-white/10"
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
        <nav id="mobile-navigation" aria-label="Қосымша мәзір" className="lg:hidden bg-[#062B65] border-b border-[#00BFFF]/30 px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] space-y-1.5 max-h-[calc(100dvh-5rem)] overflow-y-auto animate-fadeIn">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 min-h-11 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#00BFFF] text-[#051B44] font-bold'
                    : 'text-slate-200 hover:bg-[#0B357A] hover:text-[#00BFFF]'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};
