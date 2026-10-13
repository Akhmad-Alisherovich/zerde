import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { ResearchPage } from './pages/ResearchPage';
import { EthicsPage } from './pages/EthicsPage';
import { PostersPage } from './pages/PostersPage';
import { ExhibitionPage } from './pages/ExhibitionPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Lazy load MediaGalleryPage
const MediaGalleryPage = React.lazy(() => import('./pages/MediaGalleryPage').then(module => ({ default: module.MediaGalleryPage })));

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
            <Route path="media-gallery" element={<React.Suspense fallback={<div role="status" className="min-h-[50vh] flex items-center justify-center p-6 text-center text-white font-serif">Медиа галерея жүктелуде…</div>}><MediaGalleryPage /></React.Suspense>} />
            <Route path="ar-gallery" element={<Navigate to="/media-gallery" replace />} />
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
