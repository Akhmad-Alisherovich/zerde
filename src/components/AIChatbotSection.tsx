import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RotateCcw,
  BookOpen,
  Info
} from 'lucide-react';
import { answerKnowledgeQuestion, TEST_QUESTIONS } from '../data/chatbotKnowledge';
import { CHATBOT_RUBRIC } from '../data/researchData';
import { useChatbot } from '../context/ChatbotContext';

interface AIChatbotSectionProps {
  initialQuery?: string;
}

export const AIChatbotSection: React.FC<AIChatbotSectionProps> = ({ initialQuery }) => {
  const { messages, sendMessage, resetChat: contextResetChat } = useChatbot();
  const [inputVal, setInputVal] = useState('');
  const [showRubric, setShowRubric] = useState(false);
  const [selectedTestQuestionId, setSelectedTestQuestionId] = useState<number | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [chatHeight, setChatHeight] = useState(650);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const updateHeight = () => setChatHeight(Math.min(650, Math.max(260, viewport.height - 112)));
    updateHeight();
    viewport.addEventListener('resize', updateHeight);
    return () => viewport.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    if (initialQuery) {
      sendMessage(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    const messagesPane = chatMessagesRef.current;
    if (messagesPane) messagesPane.scrollTop = messagesPane.scrollHeight;
  }, [messages]);

  const handleSendQuery = (textToSend: string) => {
    if (!textToSend.trim()) return;
    sendMessage(textToSend);
    setInputVal('');
  };

  const handleRunTestCase = (item: typeof TEST_QUESTIONS[0]) => {
    setSelectedTestQuestionId(item.id);
    sendMessage(item.question);
  };

  const resetChat = () => {
    contextResetChat();
    setSelectedTestQuestionId(null);
  };

  const suggestions = [
    'Тұсаукесердегі ала жіп нені білдіреді?',
    'Асар мен еруліктің айырмашылығы қандай?',
    'Ерулік – бірлесіп үй салу ма?',
    'Наурыздың негізгі тәрбиелік мәні қандай?',
    'Көкпар туралы айтып берші' // intentional out of scope query
  ];

  return (
    <section id="chatbot" className="py-20 bg-[#062B65]/30 relative border-t border-[#00BFFF]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#051B44] border border-[#00BFFF]/30 text-[#00BFFF] text-xs font-semibold uppercase tracking-wider mb-3">
            <Bot className="w-3.5 h-3.5" />
            5-Бөлім • Дерекке негізделген ЖИ
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8FCFF] font-serif mb-4">
            ЖИ Этномәдени Оқу Көмекшісі
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Бұл чатбот тек 6 тексерілген карточка негізінде жауап береді. Ойдан дерек қоспайды, 
            әр жауабына карточка кодын тіркейді және ойлану сұрағын қояды.
          </p>
        </div>

        {/* Main 2-column layout: Chat Interface + 10-Question Test Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Chat Window (Col 7) */}
          <div className="lg:col-span-7 min-w-0 flex flex-col glass-panel rounded-3xl border border-[#00BFFF]/30 overflow-hidden shadow-2xl relative scroll-mt-24" style={{ height: chatHeight }}>
            
            {/* Chat Header */}
            <div className="p-4 sm:p-5 bg-[#051B44]/90 border-b border-[#00BFFF]/20 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <img
                    src="/assets/ai_assistant_robot.jpg"
                    alt="ЖИ Көмекші"
                    className="w-11 h-11 rounded-2xl object-cover border border-[#00BFFF]/40 shadow-cyan-glow"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#051B44] rounded-full" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white flex flex-wrap items-center gap-1.5">
                    Этно-ЖИ Көмекші
                    <span className="hidden sm:inline text-[10px] font-semibold px-2 py-0.5 rounded bg-[#00BFFF]/20 text-[#00E5FF]">
                      Grounded AI
                    </span>
                  </h3>
                  <div className="text-xs text-slate-300 leading-snug">
                    Білім қоры: 6 карточка (N01–E01) • Академиялық қауіпсіздік
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRubric(!showRubric)}
                  className="min-h-11 px-3 rounded-lg text-xs font-semibold bg-[#062B65] text-[#00BFFF] border border-[#00BFFF]/30 hover:border-[#00BFFF] transition-colors"
                  title="Бағалау рубрикасын көру"
                >
                  Рубрика
                </button>
                <button
                  onClick={resetChat}
                  className="min-w-11 min-h-11 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                  title="Чатты тазалау"
                  aria-label="Чатты тазалау"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div ref={chatMessagesRef} className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fadeIn`}
                >
                  <div
                    className={`max-w-[95%] sm:max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#00BFFF] text-[#051B44] font-medium rounded-br-none shadow-md'
                        : msg.isOutOfScope
                        ? 'bg-[#1D1E3A] border border-amber-500/40 text-slate-200 rounded-bl-none'
                        : 'bg-[#041638] border border-[#00BFFF]/25 text-slate-100 rounded-bl-none shadow-glass'
                    }`}
                  >
                    {/* Header tags for bot */}
                    {msg.sender === 'bot' && (
                      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10 text-[11px]">
                        <span className="font-bold flex items-center gap-1">
                          {msg.isOutOfScope ? (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                              <span className="text-amber-400">Білім қорынан тыс сұрақ</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5 text-[#00BFFF]" />
                              <span className="text-[#00BFFF]">Дерекке шектелген жауап</span>
                            </>
                          )}
                        </span>
                        {msg.sourceCode && (
                          <span className="px-2 py-0.5 rounded bg-[#00BFFF]/20 text-[#00E5FF] font-mono text-[10px]">
                            {msg.sourceCode}
                          </span>
                        )}
                      </div>
                    )}

                    <p>{msg.text}</p>

                    {/* Reflection Prompt block */}
                    {msg.reflectionPrompt && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 text-xs text-[#F3BE5E] bg-white/5 p-2 rounded-xl flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#D49A35]" />
                        <div>
                          <strong className="block text-[#D49A35] text-[10px] uppercase tracking-wider">
                            Ойлану сұрағы:
                          </strong>
                          <span>{msg.reflectionPrompt}</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-2 text-right text-[10px] opacity-60">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Suggestions Pills */}
            <div className="px-4 py-2 bg-[#041535]/70 border-t border-white/5 overflow-x-auto whitespace-nowrap flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium shrink-0">Ұсыныстар:</span>
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSendQuery(sug)}
                  className="px-2.5 min-h-11 rounded-lg text-xs bg-[#062B65] hover:bg-[#0B357A] text-slate-300 hover:text-[#00BFFF] border border-white/10 shrink-0 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery(inputVal);
              }}
              className="p-3 sm:p-4 bg-[#051B44] border-t border-[#00BFFF]/20 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onFocus={(e) => window.setTimeout(() => e.target.scrollIntoView({ block: 'end' }), 150)}
                placeholder="Сұрағыңызды жазыңыз (мыс: Асар деген не?)..."
                className="flex-1 min-w-0 min-h-11 px-3 py-2 rounded-xl bg-[#041535] border border-white/15 text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#00BFFF] transition-colors"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="min-w-11 min-h-11 flex items-center justify-center rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-cyan-glow"
                aria-label="Сұрақты жіберу"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

          </div>

          {/* Right Panel: Appendix Ә — 10-Question Technical Test & Rubric (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 10 Test Cases */}
            <div className="glass-panel p-6 rounded-3xl border border-[#00BFFF]/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#D49A35]" />
                  <h3 className="text-base font-bold text-white">
                    Ә Қосымшасы: 10 Сұрақтық Сынақ
                  </h3>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#D49A35]/20 text-[#D49A35] font-bold">
                  20/20 балл
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-4">
                Ғылыми тексеруге арналған ресми 10 сұрақ. Кез келгенін басып, ЖИ-дің мағына дәлдігі мен қауіпсіздігін тексеріңіз:
              </p>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {TEST_QUESTIONS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleRunTestCase(t)}
                    className={`w-full text-left p-3 rounded-xl text-xs transition-all border flex items-start justify-between gap-2 ${
                      selectedTestQuestionId === t.id
                        ? 'bg-[#00BFFF]/15 border-[#00BFFF] text-white shadow-sm'
                        : 'bg-[#041638]/70 border-white/10 text-slate-300 hover:border-[#00BFFF]/40 hover:bg-[#062B65]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#00BFFF]">№{t.id}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                          {t.category}
                        </span>
                        <span className="text-[10px] text-[#D49A35] font-mono">
                          [{t.targetCard}]
                        </span>
                      </div>
                      <div className="font-medium text-slate-100">{t.question}</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 shrink-0 mt-1">
                      ✓ 2 балл
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rubric Card summary */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#062B65] to-[#041738] border border-white/10">
              <h4 className="text-xs font-bold text-[#00BFFF] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00BFFF]" />
                ЖИ-жауабын тексерудің 4 шарты
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li>• <strong>Мағына дәлдігі:</strong> 7-сыныпқа сай дұрыс анықтама (2 балл)</li>
                <li>• <strong>Дерекке сүйену:</strong> Карточка коды мен дереккөзді көрсету (2 балл)</li>
                <li>• <strong>Тіл сапасы:</strong> Қысқа, түсінікті қазақ тілі (2 балл)</li>
                <li>• <strong>Белгісіздік:</strong> Білмегенін ойдан құрастырмай ашық айту (2 балл)</li>
              </ul>
            </div>

          </div>

        </div>

        {/* Rubric Modal */}
        {showRubric && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#00BFFF]/40 max-w-2xl w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">
                  Кесте 1. ЖИ-чатбот жауабын тексеру рубрикасы
                </h3>
                <button
                  onClick={() => setShowRubric(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#00BFFF]/30 text-[#00BFFF]">
                      <th className="py-2.5 px-3">Өлшем</th>
                      <th className="py-2.5 px-3">0 балл</th>
                      <th className="py-2.5 px-3">1 балл</th>
                      <th className="py-2.5 px-3 text-emerald-400 font-bold">2 балл</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-200">
                    {CHATBOT_RUBRIC.map((r, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-semibold text-white">{r.criterion}</td>
                        <td className="py-2.5 px-3 text-red-300/80">{r.zeroScore}</td>
                        <td className="py-2.5 px-3 text-amber-200/80">{r.oneScore}</td>
                        <td className="py-2.5 px-3 text-emerald-300 font-medium">{r.twoScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-[11px] text-slate-400 text-right">
                Дереккөз: Жоба құжаттамасы және «Зерде» 2026 ережесі
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
