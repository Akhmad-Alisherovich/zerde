import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  ChevronUp, 
  X
} from 'lucide-react';
import { PROJECT_INFO, REFERENCES_LIST } from '../../data/researchData';

export const Footer: React.FC = () => {
  const [showRefModal, setShowRefModal] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#03112E] border-t border-[#00BFFF]/20 text-slate-300 py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Project Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#062B65] border border-[#D49A35]/50 flex items-center justify-center">
                <img src="/assets/ornament-icon.svg" alt="Зерде" className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#D49A35] uppercase tracking-wider block">
                  {PROJECT_INFO.competition}
                </span>
                <h3 className="text-base font-bold text-white">
                  {PROJECT_INFO.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
              Қазақ халқының бай этномәдени мұрасын жасанды интеллект және заманауи көрнекі медиа-технологиялар 
              арқылы жаңғыртуға арналған ғылыми-тәжірибелік зерттеу жобасы.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => setShowRefModal(true)}
                className="px-3 py-1.5 rounded-lg bg-[#062B65] hover:bg-[#0B357A] text-[#00BFFF] border border-[#00BFFF]/30 flex items-center gap-1.5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Пайдаланылған 8 дереккөзді қарау</span>
              </button>
            </div>
          </div>

          {/* Col 2: Author & Supervisor */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Зерттеу авторлары
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <div className="text-[#D49A35] font-semibold">Орындаған:</div>
                <div className="text-white font-medium">{PROJECT_INFO.author.name}</div>
                <div className="text-slate-400 text-[11px]">{PROJECT_INFO.author.grade}</div>
              </div>

              <div>
                <div className="text-[#D49A35] font-semibold">Жетекшісі:</div>
                <div className="text-white font-medium">{PROJECT_INFO.supervisor.name}</div>
                <div className="text-slate-400 text-[11px]">{PROJECT_INFO.supervisor.role}</div>
              </div>

              <div className="pt-1 text-[11px] text-slate-400">
                {PROJECT_INFO.school}<br />
                {PROJECT_INFO.region}
              </div>
            </div>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Беттерге өту
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/traditions" className="hover:text-[#00BFFF] transition-colors">
                  • 6 Оқу карточкасы
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-[#00BFFF] transition-colors">
                  • ЖИ-көмекші сынағы
                </Link>
              </li>
              <li>
                <Link to="/media-gallery" className="hover:text-[#00BFFF] transition-colors">
                  • Фото және видео галереясы
                </Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-[#00BFFF] transition-colors">
                  • Салыстырмалы зерттеу дизайны
                </Link>
              </li>
              <li>
                <Link to="/ethics" className="hover:text-[#00BFFF] transition-colors">
                  • Этика мен қауіпсіздік
                </Link>
              </li>
              <li>
                <Link to="/modules" className="hover:text-[#00BFFF] transition-colors">
                  • 4 Байланысты модуль
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {PROJECT_INFO.year} «Зерде» ғылыми жобасы • Теміртау, Қазақстан.
          </div>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Жоғарыға қайту</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Bibliography Modal */}
      {showRefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#081D47] border border-[#00BFFF]/40 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto relative">
            <button
              onClick={() => setShowRefModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-2">
              Пайдаланылған Дереккөздер Тізімі
            </h3>
            <p className="text-xs text-slate-300 mb-6">
              Жоба жұмысында дәйектелген ресми академиялық және халықаралық әдебиеттер:
            </p>

            <div className="space-y-3 text-xs text-slate-200">
              {REFERENCES_LIST.map((ref) => (
                <div key={ref.id} className="p-3.5 rounded-xl bg-[#041535] border border-white/5 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-[#00BFFF]/20 text-[#00BFFF] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    {ref.id}
                  </span>
                  <div>
                    <strong className="text-white block mb-0.5">{ref.author} {ref.title}</strong>
                    <span className="text-slate-400">{ref.details}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </footer>
  );
};
