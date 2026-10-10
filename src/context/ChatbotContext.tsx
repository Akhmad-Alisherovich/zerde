import React, { createContext, useContext, useState } from 'react';
import { ChatMessage } from '../types';
import { answerKnowledgeQuestion } from '../data/chatbotKnowledge';

interface ChatbotContextType {
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  resetChat: () => void;
}

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome',
    sender: 'bot',
    text: 'Сәлеметсіз бе! Мен – ұлттық дәстүрлер бойынша дерекке негізделген ЖИ-көмекшімін. Менің білім қорым 6 тексерілген оқу карточкасымен шектелген. Наурыз, Көрісу, Тұсаукесер, Беташар, Асар немесе Ерулік туралы кез келген сұрағыңызды қойыңыз!',
    timestamp: '10:00',
    reflectionPrompt: 'Сіз бүгін қай дәстүрдің мағынасын білгіңіз келеді?'
  }
];

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const sendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const response = answerKnowledgeQuestion(textToSend);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceCode: response.cardCode,
        sourceRef: response.sourceRef,
        reflectionPrompt: response.reflectionPrompt,
        isOutOfScope: response.isOutOfScope
      };
      setMessages(prev => [...prev, botMsg]);
    }, 450);
  };

  const resetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: 'Сұхбат жаңартылды. Қандай ұлттық дәстүрдің мағынасы қызықтырады?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reflectionPrompt: 'Өзіңіз білетін бір дәстүрдің тәрбиелік мәні туралы сұрап көріңіз.'
      }
    ]);
  };

  return (
    <ChatbotContext.Provider value={{ messages, sendMessage, resetChat }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};
