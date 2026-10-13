import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Image as ImageIcon, 
  Film, 
  BookOpen, 
  Maximize2, 
  Minimize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  Info,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { 
  PHOTO_GALLERY_DATA, 
  VIDEO_GALLERY_DATA, 
  ALL_TRADITION_FILTERS, 
  PhotoMediaItem, 
  VideoMediaItem 
} from '../../data/mediaGalleryData';
import { TRADITIONS_DATA } from '../../data/traditionsData';

interface MediaGallerySectionProps {
  initialTraditionId?: string;
  initialTab?: 'photos' | 'videos' | 'analysis';
}

export const MediaGallerySection: React.FC<MediaGallerySectionProps> = ({
  initialTraditionId,
  initialTab = 'photos'
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'photos' | 'videos' | 'analysis'>(initialTab);
  
  // Selected tradition filter
  const [selectedTradition, setSelectedTradition] = useState<string>(
    initialTraditionId || 'all'
  );

  // Sync if initialTraditionId changes
  useEffect(() => {
    if (initialTraditionId) {
      setSelectedTradition(initialTraditionId);
    }
  }, [initialTraditionId]);

  // ==========================================
  // 1. PHOTO GALLERY & LIGHTBOX STATE
  // ==========================================
  const filteredPhotos = selectedTradition === 'all'
    ? PHOTO_GALLERY_DATA
    : PHOTO_GALLERY_DATA.filter(p => p.traditionId === selectedTradition);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxZoom(1);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setLightboxZoom(1);
  };

  const showNextPhoto = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
    setLightboxZoom(1);
  }, [lightboxIndex, filteredPhotos.length]);

  const showPrevPhoto = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    setLightboxZoom(1);
  }, [lightboxIndex, filteredPhotos.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextPhoto();
      if (e.key === 'ArrowLeft') showPrevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, showNextPhoto, showPrevPhoto]);

  // ==========================================
  // 2. VIDEO GALLERY & PLAYER STATE
  // ==========================================
  const filteredVideos = selectedTradition === 'all'
    ? VIDEO_GALLERY_DATA
    : VIDEO_GALLERY_DATA.filter(v => v.traditionId === selectedTradition);

  const [selectedVideo, setSelectedVideo] = useState<VideoMediaItem>(
    filteredVideos[0] || VIDEO_GALLERY_DATA[0]
  );

  // Video element controls
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Sync selected video if list changes
  useEffect(() => {
    if (filteredVideos.length > 0 && !filteredVideos.some(v => v.id === selectedVideo.id)) {
      setSelectedVideo(filteredVideos[0]);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [filteredVideos, selectedVideo.id]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => setHasError(true));
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsLoading(false);
    setHasError(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  // ==========================================
  // 3. CULTURAL ANALYSIS FILTER
  // ==========================================
  const filteredAnalysis = selectedTradition === 'all'
    ? TRADITIONS_DATA
    : TRADITIONS_DATA.filter(t => t.id === selectedTradition);

  return (
    <section id="media-gallery" className="py-12 bg-[#041535] relative text-[#F8FCFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-[#00BFFF]/20">
          
          {/* Main 3 Tabs */}
          <div className="p-1.5 rounded-2xl bg-[#051B44] border border-[#00BFFF]/30 flex items-center gap-1.5 shadow-lg w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex-1 sm:flex-none min-h-11 px-4 sm:px-6 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'photos'
                  ? 'bg-[#00BFFF] text-[#051B44] shadow-cyan-glow'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>1. Суреттер ({filteredPhotos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`flex-1 sm:flex-none min-h-11 px-4 sm:px-6 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'videos'
                  ? 'bg-[#D49A35] text-[#051B44] shadow-gold-glow'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>2. Бейнероликтер ({filteredVideos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex-1 sm:flex-none min-h-11 px-4 sm:px-6 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'analysis'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>3. Мәдени талдау ({filteredAnalysis.length})</span>
            </button>
          </div>

          {/* Quick Counter */}
          <div className="text-xs text-slate-400 font-mono flex items-center gap-2 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#D49A35]" />
            <span>Этнографиялық қор: <strong>11 салт-дәстүр</strong></span>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {ALL_TRADITION_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedTradition(f.id)}
                className={`min-h-9 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedTradition === f.id
                    ? 'bg-[#00BFFF]/20 border-[#00BFFF] text-[#00E5FF] shadow-sm font-bold'
                    : 'bg-[#051B44]/60 border-white/10 text-slate-300 hover:text-white hover:bg-[#062B65]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================
            TAB 1: PHOTO GALLERY (СУРЕТТЕР)
        ======================================================== */}
        {activeTab === 'photos' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPhotos.map((item, idx) => (
                <div
                  key={item.id}
                  className="glass-card rounded-3xl overflow-hidden border border-white/10 hover:border-[#00BFFF]/60 transition-all duration-300 group flex flex-col justify-between bg-[#051B44]/80 shadow-xl hover:-translate-y-1"
                >
                  {/* Photo Container */}
                  <div 
                    onClick={() => openLightbox(idx)}
                    className="relative aspect-[4/3] overflow-hidden bg-slate-950 cursor-pointer"
                  >
                    <picture>
                      {item.imageWebp && <source srcSet={item.imageWebp} type="image/webp" />}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </picture>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-4 pointer-events-none">
                      <div className="flex items-center justify-between gap-2 pointer-events-auto">
                        <span className="px-2.5 py-1 rounded-lg bg-[#051B44]/90 backdrop-blur-md border border-[#00BFFF]/40 text-[11px] font-mono font-bold text-[#00E5FF]">
                          {item.traditionName}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[10px] text-amber-300 font-medium border border-white/10">
                          {item.categoryLabel}
                        </span>
                      </div>

                      <div className="pointer-events-auto">
                        <h4 className="text-base sm:text-lg font-bold text-white font-serif drop-shadow-md">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="p-3 rounded-xl bg-[#030F26] border border-white/5 text-[11px] text-slate-300">
                        <strong className="text-[#D49A35] block mb-0.5">Мәдени маңызы:</strong>
                        <span>{item.significance}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <button
                        onClick={() => openLightbox(idx)}
                        className="text-xs text-[#00BFFF] hover:text-[#38D2FF] font-semibold flex items-center gap-1.5 transition-colors group/btn"
                      >
                        <Maximize2 className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                        <span>Толық өлшемде көру</span>
                      </button>

                      <Link
                        to={`/traditions/${item.traditionId}`}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <span>Дәстүр беті</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Lightbox Modal */}
            {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
              <div 
                className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
                role="dialog"
                aria-modal="true"
                onClick={closeLightbox}
              >
                <div 
                  className="relative max-w-5xl w-full max-h-[92vh] flex flex-col justify-between bg-[#041535] rounded-3xl border border-[#00BFFF]/40 overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Top Bar */}
                  <div className="p-4 bg-[#030F26] border-b border-white/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-[#00BFFF]/20 border border-[#00BFFF]/40 text-[#00E5FF] text-xs font-mono font-bold">
                        {filteredPhotos[lightboxIndex].traditionName}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white font-serif truncate max-w-md">
                        {filteredPhotos[lightboxIndex].title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono">
                        {lightboxIndex + 1} / {filteredPhotos.length}
                      </span>

                      <button
                        onClick={() => setLightboxZoom(prev => prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                        title="Масштабтау"
                        aria-label="Масштабтау"
                      >
                        {lightboxZoom > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={closeLightbox}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="Жабу"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Main Image Display */}
                  <div className="relative flex-1 overflow-auto bg-black flex items-center justify-center min-h-[45vh] max-h-[60vh] p-2">
                    <picture>
                      {filteredPhotos[lightboxIndex].imageWebp && (
                        <source srcSet={filteredPhotos[lightboxIndex].imageWebp} type="image/webp" />
                      )}
                      <img
                        src={filteredPhotos[lightboxIndex].image}
                        alt={filteredPhotos[lightboxIndex].title}
                        style={{ transform: `scale(${lightboxZoom})` }}
                        className="max-h-[58vh] max-w-full object-contain transition-transform duration-200 select-none"
                      />
                    </picture>

                    {/* Prev / Next Buttons */}
                    <button
                      onClick={showPrevPhoto}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-110"
                      aria-label="Алдыңғы сурет"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      onClick={showNextPhoto}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-110"
                      aria-label="Келесі сурет"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Bottom Caption */}
                  <div className="p-4 sm:p-5 bg-[#030F26] border-t border-white/10 space-y-2">
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {filteredPhotos[lightboxIndex].description}
                    </p>
                    <div className="text-xs text-[#D49A35]">
                      <strong>Мәдени мәні:</strong> {filteredPhotos[lightboxIndex].significance}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: VIDEO GALLERY (БЕЙНЕРОЛИКТЕР)
        ======================================================== */}
        {activeTab === 'videos' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Main Video Viewport & Player */}
            <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-[#D49A35]/40 shadow-2xl bg-[#041535]">
              <div 
                ref={videoContainerRef}
                className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner group"
              >
                {/* If video has a playable URL */}
                {selectedVideo.videoUrl ? (
                  <>
                    <video
                      ref={videoRef}
                      src={selectedVideo.videoUrl}
                      poster={selectedVideo.poster}
                      playsInline
                      preload="metadata"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onWaiting={() => setIsLoading(true)}
                      onPlaying={() => setIsLoading(false)}
                      onError={() => { setHasError(true); setIsLoading(false); }}
                      className="w-full h-full object-cover"
                      onClick={togglePlay}
                    />

                    {/* Loading State Spinner */}
                    {isLoading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}

                    {/* Error State */}
                    {hasError && (
                      <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                        <Info className="w-8 h-8 text-amber-400" />
                        <h4 className="font-bold">Бейнені жүктеу кезінде кідіріс болды</h4>
                        <p className="text-xs text-slate-300 max-w-md">Файл желіде әлі өңделуде немесе байланыс үзілді.</p>
                        <button
                          onClick={() => { setHasError(false); videoRef.current?.load(); }}
                          className="px-4 py-2 rounded-xl bg-[#00BFFF] text-[#051B44] font-bold text-xs"
                        >
                          Қайта көру
                        </button>
                      </div>
                    )}

                    {/* Custom Player Controls Bar */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-4 space-y-2 transition-opacity duration-300">
                      
                      {/* Scrubber Progress Bar */}
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={0}
                          max={duration || 100}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00BFFF]"
                          aria-label="Уақыт сызығы"
                        />
                      </div>

                      {/* Controls Buttons */}
                      <div className="flex items-center justify-between text-white text-xs">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={togglePlay}
                            className="p-2 rounded-xl bg-[#00BFFF] text-[#051B44] hover:bg-[#38D2FF] font-bold transition-transform active:scale-95"
                            aria-label={isPlaying ? 'Аялдату' : 'Ойнату'}
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={toggleMute}
                              className="p-1.5 text-slate-300 hover:text-white transition-colors"
                              aria-label={isMuted ? 'Дыбысты қосу' : 'Дыбысты өшіру'}
                            >
                              {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                            <input
                              type="range"
                              min={0}
                              max={1}
                              step={0.05}
                              value={isMuted ? 0 : volume}
                              onChange={handleVolumeChange}
                              className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00BFFF] hidden sm:block"
                              aria-label="Дыбыс деңгейі"
                            />
                          </div>

                          <span className="font-mono text-[11px] text-slate-300">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={toggleFullscreen}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                            aria-label="Толық экран"
                          >
                            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Standby / Reconstruction State */
                  <div className="relative w-full h-full flex flex-col justify-between p-6">
                    <img 
                      src={selectedVideo.poster} 
                      alt={selectedVideo.title}
                      className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45]"
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-[#D49A35]/20 border border-[#D49A35]/40 text-[#D49A35] text-xs font-mono font-bold">
                        {selectedVideo.traditionName} • Бейнематериал
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-black/60 text-slate-300 text-xs font-mono">
                        Ұзақтығы: {selectedVideo.duration}
                      </span>
                    </div>

                    <div className="relative z-10 max-w-2xl space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
                        {selectedVideo.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {selectedVideo.description}
                      </p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-[#00E5FF] shrink-0" />
                        <span><strong>Мәдени жазба:</strong> {selectedVideo.culturalNote}</span>
                      </div>
                      <span className="text-[11px] text-amber-300 font-medium">
                        Қазіргі нұсқа: Танымдық кадрлар галереясы қолжетімді
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Information Card */}
              <div className="mt-4 p-4 rounded-2xl bg-[#030F26] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="text-sm font-bold text-white font-serif">{selectedVideo.title}</h4>
                  <p className="text-slate-300 text-xs mt-0.5">{selectedVideo.culturalNote}</p>
                </div>
                <Link
                  to={`/traditions/${selectedVideo.traditionId}`}
                  className="px-4 py-2 rounded-xl bg-[#00BFFF]/20 hover:bg-[#00BFFF]/30 text-[#00E5FF] font-bold text-xs border border-[#00BFFF]/40 flex items-center gap-1.5 shrink-0"
                >
                  <span>Осы дәстүрдің оқу беті</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Video List Playlist */}
            <div>
              <h3 className="text-lg font-bold text-white font-serif mb-4 flex items-center gap-2">
                <Film className="w-4 h-4 text-[#D49A35]" />
                <span>Бейнероликтер тізімі ({filteredVideos.length})</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVideos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => {
                      setSelectedVideo(vid);
                      setIsPlaying(false);
                      setCurrentTime(0);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3.5 items-center ${
                      selectedVideo.id === vid.id
                        ? 'bg-[#062B65] border-[#D49A35] shadow-gold-glow'
                        : 'bg-[#051B44]/70 border-white/10 hover:border-white/20 hover:bg-[#051B44]'
                    }`}
                  >
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-black shrink-0">
                      <img src={vid.poster} alt={vid.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/80 rounded text-[9px] font-mono text-white">
                        {vid.duration}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono text-[#D49A35] uppercase block">
                        {vid.traditionName}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate font-serif">
                        {vid.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                        {vid.culturalNote}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 3: CULTURAL ANALYSIS (МӘДЕНИ ТАЛДАУ)
        ======================================================== */}
        {activeTab === 'analysis' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAnalysis.map((trad) => (
                <div
                  key={trad.id}
                  className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 hover:border-[#00BFFF]/40 transition-all bg-[#051B44]/80 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#00BFFF]/20 border border-[#00BFFF]/40 text-[#00E5FF] text-xs font-mono font-bold">
                        {trad.code}
                      </span>
                      <span className="text-xs text-[#D49A35] font-semibold">
                        {trad.coreValue}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white font-serif">{trad.name}</h3>
                      <p className="text-xs text-amber-200 mt-0.5">{trad.subtitle}</p>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
                      <p>{trad.description}</p>
                      <div className="p-3.5 rounded-2xl bg-[#030F26] border border-white/5 text-xs text-slate-300 space-y-1">
                        <strong className="text-[#00E5FF] block">Терең мәдени мәні:</strong>
                        <p>{trad.deepMeaning}</p>
                      </div>
                    </div>

                    {trad.reflectionQuestion && (
                      <div className="p-3.5 rounded-2xl bg-[#062B65]/60 border border-[#D49A35]/30 text-xs text-slate-200 flex items-start gap-2.5">
                        <HelpCircle className="w-4 h-4 text-[#D49A35] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#D49A35] block mb-0.5">Ойлану сұрағы:</strong>
                          <span>{trad.reflectionQuestion}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-[11px] text-slate-400 italic font-mono truncate max-w-xs">
                      Дереккөз: {trad.source}
                    </span>

                    <Link
                      to={`/traditions/${trad.id}`}
                      className="px-4 py-2 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] font-bold transition-all flex items-center gap-1.5 shadow-cyan-glow"
                    >
                      <span>Толық оқу карточкасы</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
