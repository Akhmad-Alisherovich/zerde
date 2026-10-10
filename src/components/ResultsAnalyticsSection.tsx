import React, { useState } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ShieldAlert,
  Sliders,
  FileSpreadsheet
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { REAL_EMPTY_STATE, ILLUSTRATIVE_SIMULATION_DATA } from '../data/mockExperimentData';

export const ResultsAnalyticsSection: React.FC = () => {
  const [dataMode, setDataMode] = useState<'real-empty' | 'illustrative-demo'>('real-empty');

  return (
    <section id="results" className="py-20 bg-[#062B65]/30 relative border-t border-[#00BFFF]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#051B44] border border-[#00BFFF]/30 text-[#00BFFF] text-xs font-semibold uppercase tracking-wider mb-3">
            <BarChart2 className="w-3.5 h-3.5" />
            9-Бөлім • Нәтижелер мен Аналитика
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif mb-4">
            Зерттеу Нәтижелері мен Салыстырмалы Талдау
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Кесте 6. Нәтижелерді жинақтау хаттамасы. Жоба ғылыми адалдық қағидасын қатаң ұстанады.
          </p>
        </div>

        {/* Data Mode Switcher Toggle */}
        <div className="max-w-xl mx-auto mb-12 p-1.5 rounded-2xl bg-[#041535] border border-white/10 flex items-center shadow-lg">
          <button
            onClick={() => setDataMode('real-empty')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              dataMode === 'real-empty'
                ? 'bg-[#00BFFF] text-[#051B44] shadow-cyan-glow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Реалды мәртебе (Бос күй)</span>
          </button>

          <button
            onClick={() => setDataMode('illustrative-demo')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              dataMode === 'illustrative-demo'
                ? 'bg-[#D49A35] text-[#051B44] shadow-gold-glow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Модельдік үлгі (Симуляция)</span>
          </button>
        </div>

        {/* MODE A: REAL EMPTY STATE (Honest scientific status) */}
        {dataMode === 'real-empty' && (
          <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-[#00BFFF]/30 animate-fadeIn">
            
            {/* Status Alert Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/30 flex items-start gap-4 mb-8">
              <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base sm:text-lg font-bold text-amber-300 mb-1">
                  {REAL_EMPTY_STATE.statusNotice}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {REAL_EMPTY_STATE.statusDetails}
                </p>
              </div>
            </div>

            {/* Table 6 Representation */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#00BFFF]/30 text-[#00BFFF] bg-[#051B44]/80">
                    <th className="py-3 px-4 font-bold">Көрсеткіш атауы</th>
                    <th className="py-3 px-4 font-bold">Өлшем бірлігі</th>
                    <th className="py-3 px-4 font-bold text-amber-300">Мәтіндік топ</th>
                    <th className="py-3 px-4 font-bold text-[#00E5FF]">ЖИ + AR цифрлық тобы</th>
                    <th className="py-3 px-4 font-bold text-slate-400">Мәртебесі</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-200">
                  {REAL_EMPTY_STATE.metrics.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-medium text-white">{row.metric}</td>
                      <td className="py-3 px-4 text-slate-400 font-mono">{row.unit}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-400 font-mono">—</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-400 font-mono">—</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-medium">
                          {row.note}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Scientific Explanation Callout */}
            <div className="p-4 rounded-xl bg-[#041535] border border-white/10 text-xs text-slate-300 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Неліктен деректер ойдан толтырылмады? </strong>
                2026–2027 жылғы жаңа «Зерде» конкурсының қатаң талабы бойынша, оқушы нақты өлшеу жүргізбейінше жалған сандар мен «жоба тиімді болды» деген асығыс қорытынды ұсына алмайды. Бұл нағыз ғылыми зерттеушінің этикалық қағидаты болып саналады.
              </div>
            </div>

          </div>
        )}

        {/* MODE B: ILLUSTRATIVE SIMULATION DATA (Clearly labeled) */}
        {dataMode === 'illustrative-demo' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Disclaimer pill */}
            <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{ILLUSTRATIVE_SIMULATION_DATA.simulationNotice}</span>
            </div>

            {/* Simulation Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Chart 1: Pre / Post / Retention Score */}
              <div className="glass-panel p-6 rounded-3xl border border-[#00BFFF]/30">
                <h3 className="text-base font-bold text-white mb-1">
                  Ұпайлардың динамикасы (10 ұпайлық шкала)
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Бастапқы тест, 15 минуттық оқудан кейінгі қорытынды тест және 1 аптадан кейінгі сақталу.
                </p>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ILLUSTRATIVE_SIMULATION_DATA.chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                      <XAxis dataKey="stage" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#94a3b8" domain={[0, 10]} tick={{ fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#051B44', borderColor: '#00BFFF', borderRadius: '12px', fontSize: '12px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="textGroup" name="Мәтіндік топ" fill="#F3BE5E" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="digitalGroup" name="ЖИ + AR тобы" fill="#00BFFF" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Gain & Loss comparison */}
              <div className="glass-panel p-6 rounded-3xl border border-[#00BFFF]/30 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    Жеке өсім (Gain) көрсеткіші
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Өсім = Қорытынды ұпай – Бастапқы ұпай. Модельдік мысалда цифрлық топта +4.2 ұпай өсім көрінеді.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-[#041535] border border-amber-500/30 text-center">
                      <div className="text-xs text-slate-400 mb-1">Мәтіндік топ өсімі</div>
                      <div className="text-3xl font-extrabold text-[#F3BE5E] font-mono">+2.6</div>
                      <div className="text-[11px] text-slate-400 mt-1">10 ұпай ішінде</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#062B65] border border-[#00BFFF]/50 text-center shadow-cyan-glow">
                      <div className="text-xs text-slate-300 mb-1">ЖИ + AR тобы өсімі</div>
                      <div className="text-3xl font-extrabold text-[#00E5FF] font-mono">+4.2</div>
                      <div className="text-[11px] text-[#00BFFF] mt-1">10 ұпай ішінде</div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                  <strong className="text-white block mb-0.5">Техникалық журнал:</strong>
                  Цифрлық топта 3 қатысушыда камера рұқсаты мен маркерді жоғалту бойынша уақытша кідіріс тіркелді.
                </div>
              </div>

            </div>

            {/* Simulation Table */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 overflow-x-auto">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D49A35] mb-3">
                Модельдік көрсеткіштердің толық кестесі
              </h4>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="py-2.5 px-3">Көрсеткіш</th>
                    <th className="py-2.5 px-3">Өлшемі</th>
                    <th className="py-2.5 px-3 text-[#F3BE5E]">Мәтіндік топ</th>
                    <th className="py-2.5 px-3 text-[#00E5FF]">ЖИ + AR тобы</th>
                    <th className="py-2.5 px-3">Түсініктеме</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {ILLUSTRATIVE_SIMULATION_DATA.metrics.map((r, i) => (
                    <tr key={i}>
                      <td className="py-2.5 px-3 font-medium text-white">{r.metric}</td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono">{r.unit}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-300">{r.textGroup}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#00E5FF]">{r.digitalGroup}</td>
                      <td className="py-2.5 px-3 text-slate-400">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
