import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  buildNauryzScene, 
  buildTusaukeserScene, 
  buildAsarScene 
} from './CulturalSceneBuilder';
import { 
  Camera, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  Maximize2, 
  RotateCw, 
  Sliders, 
  Sparkles, 
  HelpCircle,
  Eye,
  CameraOff
} from 'lucide-react';

interface WebARCameraViewerProps {
  scenarioId: string;
  onFallbackTo3D: () => void;
}

export const WebARCameraViewer: React.FC<WebARCameraViewerProps> = ({
  scenarioId,
  onFallbackTo3D
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States
  const [cameraState, setCameraState] = useState<'requesting' | 'active' | 'denied'>('requesting');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isMarkerTracked, setIsMarkerTracked] = useState<boolean>(false);
  const [trackingConfidence, setTrackingConfidence] = useState<number>(0);
  const [realFps, setRealFps] = useState<number>(0);
  const [modelScale, setModelScale] = useState<number>(1.0);
  const [modelRotationY, setModelRotationY] = useState<number>(0);
  const [deskAnchorMode, setDeskAnchorMode] = useState<boolean>(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);

  // 1. Initialize Camera
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      setCameraState('requesting');
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Rear camera on mobile
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setCameraState('active');
          };
        }
      } catch (err: any) {
        console.error('Camera access error:', err);
        setCameraState('denied');
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setErrorMessage('Камераға қолжетімділік берілмеді. Шолушы параметрлерінде камера рұқсатын беріңіз.');
        } else if (err.name === 'NotFoundError') {
          setErrorMessage('Құрылғыда бейнекамера табылмады.');
        } else {
          setErrorMessage(`Камераны қосу мүмкін болмады: ${err.message || 'Белгісіз қате'}`);
        }
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // 2. Initialize Three.js Overlaid on Camera
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 1.6, 2.8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true, // Transparent so camera video is visible underneath!
      antialias: true,
      preserveDrawingBuffer: true // Required for screenshot capture
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;

    // Realistic Lighting for AR Object
    const ambientLight = new THREE.AmbientLight('#FFF5E4', 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight('#FFF8ED', 1.8);
    sunLight.position.set(2, 4, 2);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight('#87CEEB', 0.6);
    fillLight.position.set(-2, 2, -2);
    scene.add(fillLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    rootGroupRef.current = rootGroup;

    // Build the 3D scene
    if (scenarioId === 'ar-nauryz') {
      buildNauryzScene(rootGroup);
    } else if (scenarioId === 'ar-tusaukeser') {
      buildTusaukeserScene(rootGroup, 1);
    } else {
      buildAsarScene(rootGroup);
    }

    // Scale down slightly for tabletop AR
    rootGroup.scale.set(0.65, 0.65, 0.65);
    rootGroup.position.set(0, -0.4, 0);

    // Frame-rate & Animation Loop
    let animId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Measure real FPS from timestamps
      frameCount++;
      const now = performance.now();
      if (now - fpsTimer >= 1000) {
        setRealFps(Math.round((frameCount * 1000) / (now - fpsTimer)));
        frameCount = 0;
        fpsTimer = now;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [scenarioId]);

  // 3. Update Model Scale & Rotation when controls change
  useEffect(() => {
    if (rootGroupRef.current) {
      const baseScale = 0.65 * modelScale;
      rootGroupRef.current.scale.set(baseScale, baseScale, baseScale);
      rootGroupRef.current.rotation.y = modelRotationY;
    }
  }, [modelScale, modelRotationY]);

  // 4. Real Computer-Vision Frame Analysis for Hiro Marker Detection
  useEffect(() => {
    if (cameraState !== 'active') return;

    const analysisCanvas = document.createElement('canvas');
    const ctx = analysisCanvas.getContext('2d', { willReadFrequently: true });
    analysisCanvas.width = 160;
    analysisCanvas.height = 120;

    let intervalId: any;

    const analyzeFrame = () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || !ctx) return;

      try {
        ctx.drawImage(video, 0, 0, 160, 120);
        const imgData = ctx.getImageData(0, 0, 160, 120);
        const data = imgData.data;

        // Analyze center area for the distinctive Hiro Marker black square frame:
        // High contrast between black border and bright interior/background
        const cx = 80;
        const cy = 60;
        let borderDarkness = 0;
        let centerBrightness = 0;
        let sampleCount = 0;

        // Sample concentric box points (approximate square border)
        const radius = 24;
        for (let i = -radius; i <= radius; i += 6) {
          // Top & Bottom border
          const idx1 = ((cy - radius) * 160 + (cx + i)) * 4;
          const idx2 = ((cy + radius) * 160 + (cx + i)) * 4;
          // Left & Right border
          const idx3 = ((cy + i) * 160 + (cx - radius)) * 4;
          const idx4 = ((cy + i) * 160 + (cx + radius)) * 4;

          if (idx1 >= 0 && idx1 < data.length) {
            borderDarkness += (data[idx1] + data[idx1 + 1] + data[idx1 + 2]) / 3;
            borderDarkness += (data[idx2] + data[idx2 + 1] + data[idx2 + 2]) / 3;
            borderDarkness += (data[idx3] + data[idx3 + 1] + data[idx3 + 2]) / 3;
            borderDarkness += (data[idx4] + data[idx4 + 1] + data[idx4 + 2]) / 3;
            sampleCount += 4;
          }
        }

        // Sample center inner core
        let centerSamples = 0;
        for (let y = -8; y <= 8; y += 4) {
          for (let x = -8; x <= 8; x += 4) {
            const idx = ((cy + y) * 160 + (cx + x)) * 4;
            if (idx >= 0 && idx < data.length) {
              centerBrightness += (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
              centerSamples++;
            }
          }
        }

        const avgBorderLum = borderDarkness / Math.max(1, sampleCount);
        const avgCenterLum = centerBrightness / Math.max(1, centerSamples);

        // Marker detected if border is significantly darker than center/surroundings
        const contrast = avgCenterLum - avgBorderLum;
        const detected = contrast > 35 && avgBorderLum < 95;

        if (detected || deskAnchorMode) {
          setIsMarkerTracked(true);
          setTrackingConfidence(Math.min(98, Math.round(contrast * 1.5)));
          if (rootGroupRef.current) {
            rootGroupRef.current.visible = true;
          }
        } else {
          setIsMarkerTracked(false);
          setTrackingConfidence(0);
          if (rootGroupRef.current && !deskAnchorMode) {
            // Keep visible if user turned on desk anchor mode
            rootGroupRef.current.visible = false;
          }
        }
      } catch (e) {
        // Handle cross-origin or frame read safety
      }
    };

    intervalId = setInterval(analyzeFrame, 200); // 5 times a second
    return () => clearInterval(intervalId);
  }, [cameraState, deskAnchorMode]);

  // Capture Photo (Merged Camera Frame + Three.js 3D Layer)
  const handleCapturePhoto = () => {
    const video = videoRef.current;
    const canvas3D = canvasRef.current;
    if (!video || !canvas3D) return;

    const photoCanvas = document.createElement('canvas');
    photoCanvas.width = canvas3D.width;
    photoCanvas.height = canvas3D.height;
    const ctx = photoCanvas.getContext('2d');
    if (!ctx) return;

    // Draw video background
    ctx.drawImage(video, 0, 0, photoCanvas.width, photoCanvas.height);
    // Draw 3D cultural model overlay
    ctx.drawImage(canvas3D, 0, 0);

    // Add Zerde project watermark in bottom corner
    ctx.fillStyle = 'rgba(5, 27, 68, 0.85)';
    ctx.fillRect(16, photoCanvas.height - 50, 360, 36);
    ctx.fillStyle = '#00E5FF';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('«Зерде» 2026 • Ұлттық дәстүрлердің жаңа өмірі (WebAR)', 26, photoCanvas.height - 27);

    const dataUrl = photoCanvas.toDataURL('image/png');
    setCapturedPhotoUrl(dataUrl);
  };

  return (
    <div className="flex flex-col h-full relative rounded-3xl overflow-hidden border border-[#00BFFF]/30 glass-panel shadow-2xl bg-black">
      
      {/* Main Viewport Container */}
      <div 
        ref={containerRef} 
        className="w-full h-[520px] sm:h-[600px] relative overflow-hidden flex items-center justify-center bg-black"
      >
        {/* Real Camera Video Stream */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Transparent Three.js WebGL Canvas for 3D Model Overlaid on Camera */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
        />

        {/* Camera Permission Denied View */}
        {cameraState === 'denied' && (
          <div className="absolute inset-0 z-30 bg-[#051B44]/95 p-6 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/40">
              <CameraOff className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-serif">
              Камераға қолжетімділік берілмеді
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              {errorMessage || 'WebAR жұмыс істеуі үшін шолушы параметрлерінде камера рұқсатын беру қажет.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={onFallbackTo3D}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] text-xs font-bold shadow-cyan-glow transition-all"
              >
                3D Интерактивті Көрініске өту
              </button>
              <button
                onClick={() => window.location.reload()}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                Қайта тексеру
              </button>
            </div>
          </div>
        )}

        {/* Camera Requesting View */}
        {cameraState === 'requesting' && (
          <div className="absolute inset-0 z-30 bg-[#051B44]/90 flex flex-col items-center justify-center text-center p-6">
            <Camera className="w-12 h-12 text-[#00E5FF] animate-bounce mb-3" />
            <h4 className="text-sm font-bold text-white">Камера қосылуда...</h4>
            <p className="text-xs text-slate-400 mt-1">Рұқсат терезесінде «Рұқсат беру» батырмасын басыңыз</p>
          </div>
        )}

        {/* Real Tracking State Badge (TOP LEFT) */}
        {cameraState === 'active' && (
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl backdrop-blur-md border text-xs font-bold shadow-lg ${
              isMarkerTracked
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-emerald-500/20'
                : 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-amber-500/20'
            }`}>
              {isMarkerTracked ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{deskAnchorMode ? 'Парта үсті бекітілді (Desk Mode)' : 'Маркер анықталды (Hiro Tracked)'}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>AR маркері анықталмады</span>
                </>
              )}
            </div>

            <div className="text-[11px] text-slate-200 drop-shadow pl-1 flex items-center gap-2 font-mono">
              <span>FPS: {realFps}</span>
              {isMarkerTracked && <span>• Сенімділік: {trackingConfidence}%</span>}
            </div>
          </div>
        )}

        {/* Reticle / Aiming Guide for Hiro Marker (when not tracked) */}
        {cameraState === 'active' && !isMarkerTracked && (
          <div className="absolute z-10 pointer-events-none flex flex-col items-center justify-center text-center">
            <div className="w-56 h-56 border-2 border-dashed border-[#00BFFF]/70 rounded-3xl animate-pulse flex items-center justify-center bg-black/10">
              <span className="text-[11px] text-white/90 bg-black/60 px-3 py-1.5 rounded-xl border border-white/20">
                Hiro маркерін осы шеңберге бағыттаңыз
              </span>
            </div>
          </div>
        )}

        {/* Top Right AR Control Actions */}
        {cameraState === 'active' && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            {/* Toggle Desk Anchor Mode */}
            <button
              onClick={() => setDeskAnchorMode(!deskAnchorMode)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border backdrop-blur-md transition-all flex items-center gap-1.5 ${
                deskAnchorMode
                  ? 'bg-[#D49A35] text-[#051B44] border-[#D49A35] shadow-gold-glow'
                  : 'bg-[#051B44]/80 text-slate-200 border-white/20 hover:bg-[#062B65]'
              }`}
              title="Маркерсіз партаға қою"
            >
              <span>{deskAnchorMode ? 'Партада тұр' : 'Маркерсіз қою'}</span>
            </button>

            {/* Capture Photo Button */}
            <button
              onClick={handleCapturePhoto}
              className="p-2.5 rounded-xl bg-[#00BFFF] hover:bg-[#38D2FF] text-[#051B44] font-bold shadow-cyan-glow transition-all"
              title="AR суретке түсіру (Capture Photo)"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom AR Scale & Rotation Sliders */}
        {cameraState === 'active' && isMarkerTracked && (
          <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-center">
            <div className="p-3 rounded-2xl bg-[#051B44]/90 border border-[#00BFFF]/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 max-w-xl w-full text-xs text-slate-200">
              {/* Scale Slider */}
              <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                <span className="text-[11px] text-[#00E5FF] font-semibold shrink-0">Өлшемі:</span>
                <input
                  type="range"
                  min="0.4"
                  max="1.8"
                  step="0.05"
                  value={modelScale}
                  onChange={(e) => setModelScale(parseFloat(e.target.value))}
                  className="w-full accent-[#00BFFF]"
                />
                <span className="font-mono text-[10px] shrink-0">{Math.round(modelScale * 100)}%</span>
              </div>

              {/* Rotation Slider */}
              <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                <span className="text-[11px] text-[#D49A35] font-semibold shrink-0">Айналдыру:</span>
                <input
                  type="range"
                  min="0"
                  max={Math.PI * 2}
                  step="0.1"
                  value={modelRotationY}
                  onChange={(e) => setModelRotationY(parseFloat(e.target.value))}
                  className="w-full accent-[#D49A35]"
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Captured Photo Download Modal */}
      {capturedPhotoUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-md w-full border border-[#00BFFF]/40 text-center animate-slideUp">
            <h4 className="text-base font-bold text-white mb-3">Түсірілген AR фото</h4>
            <div className="rounded-2xl overflow-hidden border border-white/20 mb-4 bg-black">
              <img src={capturedPhotoUrl} alt="Captured AR" className="w-full h-auto" />
            </div>
            <div className="flex gap-3">
              <a
                href={capturedPhotoUrl}
                download={`ar-photo-${scenarioId}.png`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#00BFFF] text-[#051B44] text-xs font-bold flex items-center justify-center gap-2 shadow-cyan-glow"
              >
                <Download className="w-4 h-4" />
                <span>Суретті жүктеп алу</span>
              </a>
              <button
                onClick={() => setCapturedPhotoUrl(null)}
                className="py-2.5 px-4 rounded-xl bg-white/10 text-white text-xs font-semibold"
              >
                Жабу
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Educational AR Instruction Bar */}
      <div className="p-4 bg-[#051B44] border-t border-[#00BFFF]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <HelpCircle className="w-4 h-4 text-[#D49A35] shrink-0" />
          <span>
            {isMarkerTracked 
              ? '3D нысан камера кеңістігінде бекітілді. Оны айналдырып немесе өлшемін реттей аласыз.'
              : 'Қағазға басылған Hiro маркерін үстелге қойып, камераны соған бағыттаңыз немесе «Маркерсіз қою» батырмасын басыңыз.'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/assets/hiro-marker.svg"
            download="hiro-marker.svg"
            className="px-3 py-1.5 rounded-xl bg-[#062B65] hover:bg-[#0B357A] text-[#00E5FF] border border-[#00BFFF]/30 flex items-center gap-1.5 transition-colors font-medium text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Hiro маркерін жүктеу</span>
          </a>
        </div>
      </div>

    </div>
  );
};
