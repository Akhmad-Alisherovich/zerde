import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Bot, 
  Menu, 
  X, 
  BookOpen, 
  BarChart2, 
  ShieldCheck, 
  Sparkles,
  Award,
  Film
} from 'lucide-react';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#hero', label: 'Басты бет', icon: Compass },
    { href: '#relevance', label: 'Өзектілігі', icon: BookOpen },
    { href: '#modules', label: '4 Модуль', icon: Layers },
    { href: '#cards', label: '6 Дәстүр', icon: Sparkles },
    { href: '#chatbot', label: 'ЖИ-Көмекші', icon: Bot },
    { href: '/media-gallery', label: 'Фото және видео', icon: Film },
    { href: '#research', label: 'Зерттеу', icon: BarChart2 },
    { href: '#ethics', label: 'Этика мен Қауіпсіздік', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#051B44]/90 backdrop-blur-md border-b border-[#00BFFF]/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & School Badge */}
          <a href="#hero" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#062B65] to-[#0B357A] border border-[#D49A35]/50 flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform">
              <img 
                src="/assets/ornament-icon.svg" 
                alt="Зерде логотипі" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-widest text-[#D49A35] font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#D49A35]" />
                  ЗЕРДЕ 2026 • 7-СЫНЫП
                </span>
                <span className="px-1.5 py-0.2 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded text-[10px] text-[#00BFFF]">
                  «Озат» ЛИЦЕЙІ
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-[#F8FCFF] group-hover:text-[#00BFFF] transition-colors leading-tight">
                Ұлттық дәстүрлердің жаңа өмірі
              </h1>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-[#00BFFF] hover:bg-[#062B65]/60 transition-all flex items-center space-x-1.5"
              >
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Mobile hamburger button */}
          <div className="xl:hidden flex items-center space-x-2">
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
        <div className="xl:hidden bg-[#062B65] border-b border-[#00BFFF]/30 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-[#0B357A] hover:text-[#00BFFF]"
            >
              <item.icon className="w-4 h-4 text-[#00BFFF]" />
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
