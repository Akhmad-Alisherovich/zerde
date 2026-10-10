import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChatbotProvider } from './context/ChatbotContext';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { MainLayout } from './components/layout/MainLayout';

// Page components
import { HomePage } from './pages/HomePage';
import { RelevancePage } from './pages/RelevancePage';
import { ModulesPage } from './pages/ModulesPage';
import { TraditionsPage } from './pages/TraditionsPage';
import { TraditionDetailPage } from './pages/TraditionDetailPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ARGalleryPage } from './pages/ARGalleryPage';
import { ResearchPage } from './pages/ResearchPage';
import { EthicsPage } from './pages/EthicsPage';
import { PostersPage } from './pages/PostersPage';
import { ExhibitionPage } from './pages/ExhibitionPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <ChatbotProvider>
        <ScrollToTop />
        <Routes>
          {/* Main Layout Shell for standard content pages */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="relevance" element={<RelevancePage />} />
            <Route path="modules" element={<ModulesPage />} />
            <Route path="traditions" element={<TraditionsPage />} />
            <Route path="traditions/:id" element={<TraditionDetailPage />} />
            <Route path="ai-assistant" element={<AIAssistantPage />} />
            <Route path="ar-gallery" element={<ARGalleryPage />} />
            <Route path="research" element={<ResearchPage />} />
            <Route path="ethics" element={<EthicsPage />} />
            <Route path="posters" element={<PostersPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Dedicated full-screen presentation mode for jury defense */}
          <Route path="exhibition" element={<ExhibitionPage />} />
        </Routes>
      </ChatbotProvider>
    </BrowserRouter>
  );
}

export default App;
