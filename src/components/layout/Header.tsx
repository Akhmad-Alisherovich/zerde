import React, { useState } from 'react';
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
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & School Badge */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#062B65] to-[#0B357A] border border-[#D49A35]/50 flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform">
              <img 
                src="/assets/ornament-icon.svg" 
                alt="Зерде логотипі" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] uppercase tracking-widest text-[#D49A35] font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#D49A35]" />
                  ЗЕРДЕ 2026 • 7-СЫНЫП
                </span>
                <span className="px-1.5 py-0.2 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded text-[10px] text-[#00BFFF]">
                  «Озат» ЛИЦЕЙІ
                </span>
              </div>
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-[#F8FCFF] group-hover:text-[#00BFFF] transition-colors leading-tight">
                {PROJECT_INFO.title}
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-1.5">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
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
          <div className="hidden sm:flex items-center space-x-2.5">
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
          <div className="xl:hidden flex items-center space-x-2">
            <Link
              to="/posters"
              className="sm:hidden p-2 rounded-lg bg-[#062B65] text-[#00BFFF] border border-[#00BFFF]/30"
              title="Плакаттар"
            >
              <Printer className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-[#062B65] transition-colors"
              aria-label="Мәзірді ашу"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#062B65] border-b border-[#00BFFF]/30 px-4 pt-3 pb-6 space-y-1.5 animate-fadeIn">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
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
              className="w-full py-2.5 rounded-lg text-xs font-semibold text-[#DDF5FF] bg-[#0B357A] border border-[#00BFFF]/40 flex items-center justify-center space-x-2"
            >
              <Printer className="w-4 h-4 text-[#00BFFF]" />
              <span>3 Ғылыми Көрме Плакаты (Баспа)</span>
            </Link>
            <Link
              to="/exhibition"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-lg text-xs font-bold text-[#051B44] bg-[#00BFFF] flex items-center justify-center space-x-2"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Толық экранды Көрме режимі</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
