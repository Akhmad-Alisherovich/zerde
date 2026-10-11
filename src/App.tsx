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
import { ResearchPage } from './pages/ResearchPage';
import { EthicsPage } from './pages/EthicsPage';
import { PostersPage } from './pages/PostersPage';
import { ExhibitionPage } from './pages/ExhibitionPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Keep the Three.js viewer out of the initial bundle for the text-first routes.
const ARGalleryPage = React.lazy(() => import('./pages/ARGalleryPage').then(module => ({ default: module.ARGalleryPage })));

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
            <Route path="ar-gallery" element={<React.Suspense fallback={<div role="status" className="min-h-[50vh] flex items-center justify-center p-6 text-center text-white">AR галереясы жүктелуде…</div>}><ARGalleryPage /></React.Suspense>} />
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
