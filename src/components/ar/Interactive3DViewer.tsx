import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { disposeScene, getHotspots, getSceneAsset, loadScene, selectHotspot, HotspotData } from './SceneAssets';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Sparkles, 
  Eye, 
  Info
} from 'lucide-react';

interface Interactive3DViewerProps {
  scenarioId: string;
}

type CameraPreset = 'general' | 'top' | 'close' | 'faces' | 'clothing' | 'hands' | 'orbit';

export const Interactive3DViewer: React.FC<Interactive3DViewerProps> = ({ scenarioId }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // States
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null);
  const [hotspotsList, setHotspotsList] = useState<HotspotData[]>([]);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [tusaukeserStage, setTusaukeserStage] = useState<number>(1);
  const [asarStage, setAsarStage] = useState<number>(1);
  const [additionalStage, setAdditionalStage] = useState<number>(1);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('general');
  const [showMuseumPhoto, setShowMuseumPhoto] = useState<boolean>(false);
  const photoTriggerRef = useRef<HTMLButtonElement>(null);
  const photoCloseRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!showMuseumPhoto) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    photoCloseRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowMuseumPhoto(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => { window.removeEventListener('keydown', closeOnEscape); (photoTriggerRef.current ?? previousFocus)?.focus(); };
  }, [showMuseumPhoto]);

  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [replay, setReplay] = useState(0);
  const [timelineTime, setTimelineTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const autoRotateRef = useRef(isAutoRotating);
  const timelineRef = useRef({ time: 0, target: 4, running: true });
  const asset = getSceneAsset(scenarioId);
  useEffect(() => { autoRotateRef.current = isAutoRotating; }, [isAutoRotating]);

  // High-Resolution Museum Reference Data
  const referencePhotos: Record<string, { image: string; title: string; desc: string }> = {
    'ar-nauryz': {
      image: '/assets/nauryz_dastarkhan_ar.jpg',
      title: 'Наурыз мерекелік дастарханы (2D референс)',
      desc: 'Қайыңнан ойылған астау, қызарған бауырсақтар, дәстүрлі наурыз көже тостағандары, жез самаурын және оюлы текемет кілем.'
    },
    'ar-tusaukeser': {
      image: '/assets/tusaukeser_shoes.jpg',
      title: 'Тұсаукесер рәсімі (2D референс)',
      desc: 'Ақ пен қара жүннен өрілген киелі Ала жіп, сәбидің оюлы былғары кебісі мен үкілі тақиясы, ақ жол матасы және күміс қайшы.'
    },
    'ar-asar': {
      image: '/assets/tradition_asar.jpg',
      title: 'Асар — Шаңырақ көтеру (2D референс)',
      desc: 'Ақсақал мен ауыл жастарының киіз үй шаңырағын ашалы бақанмен көтеріп, уықтарды шану сәтінің референс иллюстрациясы.'
    }
  };

  // Three.js instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const activePointersRef = useRef(new Set<number>());
  const pointerDraggedRef = useRef(false);

  // One renderer and owned GLB per mounted scenario; async loads are cancellation-safe.
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    let cancelled = false;
    let renderer: THREE.WebGLRenderer;
    setLoadState('loading'); setLoadError(''); setLoadProgress(0);
    setHotspotsList([]); setSelectedHotspot(null); setTimelineTime(0);
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); }
    catch { setLoadState('error'); setLoadError('WebGL қолжетімсіз. Басқа қолдайтын шолушыны қолданыңыз.'); return; }
    const scene = new THREE.Scene(); scene.background = new THREE.Color('#24333d');
    const camera = new THREE.PerspectiveCamera(45, 1, .05, 80);
    if (scenarioId === 'ar-betashar') camera.position.set(2.8, 2.35, 4.0);
    else camera.position.set(5.3, 3.6, 6);
    const pixelRatio = () => Math.min(window.devicePixelRatio || 1, window.innerWidth < 900 ? 1.5 : 1.75);
    renderer.setPixelRatio(pixelRatio());
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true; controls.target.set(0, 1, 0);
    controls.touches.ONE = THREE.TOUCH.ROTATE;
    controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
    const stopAutoRotate = () => setIsAutoRotating(false);
    controls.addEventListener('start', stopAutoRotate);
    controls.maxPolarAngle = Math.PI / 2 - .015;
    controls.minDistance = 1.8; controls.maxDistance = 14; controls.autoRotateSpeed = .65;
    scene.add(new THREE.HemisphereLight('#dceaff', '#7e704f', 2.0));
    const sun = new THREE.DirectionalLight('#fff0d8', 3);
    sun.position.set(-3, 7, 5); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { near: .1, far: 20, left: -5, right: 5, top: 5, bottom: -5 });
    sun.shadow.normalBias = .02; sun.shadow.bias = -.0001; scene.add(sun);
    const fill = new THREE.DirectionalLight('#bed9ef', .7); fill.position.set(3, 3, -4); scene.add(fill);
    const root = new THREE.Group(); scene.add(root);
    sceneRef.current = scene; cameraRef.current = camera; rendererRef.current = renderer;
    controlsRef.current = controls; rootGroupRef.current = root;
    let mixer: THREE.AnimationMixer | null = null;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let previous = performance.now(), lastUI = 0;
    const resize = () => {
      const width = Math.max(1, container.clientWidth), height = Math.max(1, container.clientHeight);
      const canvasHeight = canvas.getBoundingClientRect().height;
      const actualHeight = Math.max(1, canvasHeight || height);
      renderer.setPixelRatio(pixelRatio());
      renderer.setSize(width, actualHeight, false); camera.aspect = width / actualHeight; camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize); observer.observe(container); resize();
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);
    window.addEventListener('fullscreenchange', resize);
    loadScene(scenarioId, percent => { if (!cancelled) setLoadProgress(percent); }).then(gltf => {
      if (cancelled) { disposeScene(gltf.scene); return; }
      root.add(gltf.scene);
      if (gltf.animations.length) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[0]);
        action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true; action.play();
        // AnimationMixer disables a LoopOnce action after sampling the exact
        // clip end. Repeated render frames would otherwise restore the bind pose.
        mixer.setTime(Math.min(timelineRef.current.time, asset.duration - .001));
      }
      setHotspotsList(getHotspots(gltf.scene, scenarioId)); setLoadState('ready');
    }).catch(error => {
      if (!cancelled) { setLoadState('error'); setLoadError(`GLB үлгісін жүктеу мүмкін болмады: ${error.message}`); }
    });
    renderer.setAnimationLoop(() => {
      const now = performance.now(); const delta = Math.min((now - previous) / 1000, .1); previous = now;
      const timeline = timelineRef.current;
      if (mixer && timeline.running) {
        timeline.time = Math.min(timeline.target, timeline.time + (reduceMotion ? asset.duration : delta));
        mixer.setTime(Math.min(timeline.time, asset.duration - .001));
        if (timeline.time >= timeline.target) { timeline.running = false; setIsPlaying(false); }
      } else if (mixer) mixer.setTime(Math.min(timeline.time, asset.duration - .001));
      if (now - lastUI > 120) { setTimelineTime(timeline.time); lastUI = now; }
      controls.autoRotate = autoRotateRef.current && !reduceMotion; controls.update(); renderer.render(scene, camera);
    });
    return () => {
      cancelled = true; observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('orientationchange', resize);
      window.removeEventListener('fullscreenchange', resize);
      renderer.setAnimationLoop(null); controls.removeEventListener('start', stopAutoRotate); controls.dispose();
      if (mixer) { mixer.stopAllAction(); mixer.uncacheRoot(mixer.getRoot()); }
      disposeScene(root); sun.shadow.dispose();
      renderer.dispose();
      sceneRef.current = null; cameraRef.current = null; rendererRef.current = null;
      controlsRef.current = null; rootGroupRef.current = null;
    };
  }, [scenarioId, retryCount]);

  useEffect(() => {
    setIsAutoRotating(scenarioId !== 'ar-betashar');
    setCameraPreset('general');
  }, [scenarioId]);

  useEffect(() => {
    const stage = scenarioId === 'ar-asar' ? asarStage : scenarioId === 'ar-tusaukeser' ? tusaukeserStage : additionalStage;
    timelineRef.current = { time: (stage - 1) * 4, target: stage * 4, running: asset.duration > 0 };
    setIsPlaying(asset.duration > 0);
  }, [scenarioId, asarStage, tusaukeserStage, additionalStage, replay]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (pointerDraggedRef.current || Math.hypot(e.clientX - pointerStartRef.current.x, e.clientY - pointerStartRef.current.y) > 8) return;
    if (!cameraRef.current || !rootGroupRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2((e.clientX - rect.left) / rect.width * 2 - 1,
      -(e.clientY - rect.top) / rect.height * 2 + 1), cameraRef.current);
    for (const hit of ray.intersectObject(rootGroupRef.current, true)) {
      if (!hit.object.visible) continue;
      const spot = selectHotspot(hit.object, hotspotsList);
      if (spot) { setSelectedHotspot(spot); setIsAutoRotating(false); break; }
    }
  };

  // Camera Presets
  const applyCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    if (!cameraRef.current || !controlsRef.current) return;

    if (preset === 'general') {
      setIsAutoRotating(false);
      if (scenarioId === 'ar-betashar') cameraRef.current.position.set(2.8, 2.35, 4.0);
      else cameraRef.current.position.set(5.3, 3.6, 6);
      controlsRef.current.target.set(0, scenarioId === 'ar-betashar' ? 1.0 : 0.7, 0);
    } else if (preset === 'top') {
      setIsAutoRotating(false);
      cameraRef.current.position.set(0.1, 7.5, 0.1);
      controlsRef.current.target.set(0, 0.7, 0);
    } else if (preset === 'close') {
      setIsAutoRotating(false);
      cameraRef.current.position.set(1.4, 1.4, 1.6);
      controlsRef.current.target.set(0, 1.0, 0);
    } else if (preset === 'faces') {
      setIsAutoRotating(false);
      cameraRef.current.position.set(-.20, 1.65, 2.35);
      controlsRef.current.target.set(-.20, 1.53, -.08);
    } else if (preset === 'clothing') {
      setIsAutoRotating(false);
      cameraRef.current.position.set(-.58, 1.25, 2.35);
      controlsRef.current.target.set(-.58, .90, 0);
    } else if (preset === 'hands') {
      setIsAutoRotating(false);
      cameraRef.current.position.set(1.28, 1.37, 2.05);
      controlsRef.current.target.set(.98, 1.07, -.16);
    } else if (preset === 'orbit') {
      setIsAutoRotating(true);
    }
    controlsRef.current.update();
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const factor = direction === 'in' ? 0.82 : 1.22;
    const offset = cameraRef.current.position.clone().sub(controlsRef.current.target);
    offset.setLength(THREE.MathUtils.clamp(offset.length() * factor, controlsRef.current.minDistance, controlsRef.current.maxDistance));
    cameraRef.current.position.copy(controlsRef.current.target).add(offset);
    controlsRef.current.update();
  };

  return (
    <div className="flex flex-col h-full relative rounded-3xl overflow-hidden border border-[#00BFFF]/30 glass-panel shadow-2xl bg-[#03112E]">
      
      {/* 3D Canvas Viewport */}
      <div 
        ref={containerRef} 
        className="w-full relative flex flex-col xl:block xl:h-[620px]"
      >
        <canvas 
          ref={canvasRef} 
          onPointerDown={e => {
            if (e.isPrimary || activePointersRef.current.size === 0) {
              activePointersRef.current.clear();
              pointerStartRef.current = { x: e.clientX, y: e.clientY };
              pointerDraggedRef.current = false;
            }
            activePointersRef.current.add(e.pointerId);
            if (activePointersRef.current.size > 1) pointerDraggedRef.current = true;
          }}
          onPointerMove={e => {
            if (activePointersRef.current.has(e.pointerId) && Math.hypot(e.clientX - pointerStartRef.current.x, e.clientY - pointerStartRef.current.y) > 8)
              pointerDraggedRef.current = true;
          }}
          onPointerUp={e => { activePointersRef.current.delete(e.pointerId); }}
          onPointerCancel={e => { activePointersRef.current.delete(e.pointerId); pointerDraggedRef.current = true; }}
          onClick={handleCanvasClick}
          className="w-full h-[clamp(300px,58svh,500px)] xl:h-full block cursor-grab active:cursor-grabbing touch-none"
          aria-label="3D үлгі: бір саусақпен бұрыңыз, екі саусақпен жақындатыңыз"
        />

        {loadState !== 'ready' && <div className="absolute inset-0 z-30 bg-[#051B44]/95 flex flex-col items-center justify-center p-6 text-center" role="status">
          <p className="text-white font-bold">{loadState === 'loading' ? `3D үлгі жүктелуде… ${loadProgress}%` : loadError}</p>
          {loadState === 'error' && <>
            <button onClick={() => setRetryCount(count => count + 1)} className="min-h-11 px-4 mt-4 rounded-xl bg-[#00BFFF] text-[#051B44] font-bold">Қайта жүктеу</button>
            <a href={asset.url} className="text-cyan-300 mt-3 min-h-11 inline-flex items-center" download>GLB файлын жүктеу</a>
          </>}
        </div>}
        {/* Top Left Badge & Educational Label */}
        <div className="absolute top-2 left-2 xl:top-4 xl:left-4 z-10 flex flex-col gap-1 pointer-events-none max-w-[calc(100%-1rem)]">
          <div className="inline-flex items-center gap-1.5 px-2 xl:px-3 py-1 rounded-xl bg-[#051B44]/90 backdrop-blur-md border border-[#D49A35]/50 text-[#D49A35] text-[11px] xl:text-xs font-bold shadow-gold-glow">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>3D оқу реконструкциясы • GLB</span>
          </div>
          <span className="sr-only">
            Кез келген бұрыштан 360° еркін айналдырыңыз, жақындатыңыз
          </span>
        </div>

        {/* Top Right Viewport Controls & Camera Presets */}
        <div className="relative xl:absolute xl:top-4 xl:right-4 z-10 flex flex-wrap items-center justify-center gap-2 p-2 xl:p-0 bg-[#051B44] xl:bg-transparent">
          <p className="w-full xl:hidden text-center text-xs text-slate-300">1 саусақпен бұрыңыз · 2 саусақпен жақындатыңыз</p>
          {/* Museum Photographic Reference Button */}
          {referencePhotos[scenarioId] && <button
            ref={photoTriggerRef}
            onClick={() => setShowMuseumPhoto(true)}
            className="min-h-11 flex items-center gap-1.5 px-3 rounded-xl bg-[#051B44]/90 hover:bg-[#062B65] border border-[#D49A35]/60 text-[#D49A35] text-xs font-bold transition-all shadow-gold-glow backdrop-blur-md"
            title="2D референсті көру"
          >
            <Eye className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="hidden sm:inline">2D референс</span>
          </button>}

          {/* Camera Presets Selector */}
          <div className="order-last xl:order-none flex items-center max-w-full overflow-x-auto bg-[#051B44]/90 rounded-xl border border-white/15 p-1 backdrop-blur-md" aria-label="Камера көріністері">
            {(scenarioId === 'ar-betashar' ? [
              { id: 'general', label: 'Рәсім' },
              { id: 'close', label: 'Жақын' },
              { id: 'faces', label: 'Бет' },
              { id: 'clothing', label: 'Киім' },
              { id: 'hands', label: 'Қол' },
            ] : [
              { id: 'general', label: 'Жалпы' },
              { id: 'top', label: 'Төбеден' },
              { id: 'close', label: 'Жақын' },
            ]).map((p) => (
              <button
                key={p.id}
                onClick={() => applyCameraPreset(p.id as CameraPreset)}
                className={`min-w-11 min-h-11 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  cameraPreset === p.id && !isAutoRotating
                    ? 'bg-[#00BFFF] text-[#051B44] font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Auto-rotate toggle */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`min-w-11 min-h-11 flex items-center justify-center rounded-xl border backdrop-blur-md transition-all ${
              isAutoRotating
                ? 'bg-[#00BFFF] text-[#051B44] border-[#00BFFF] shadow-cyan-glow'
                : 'bg-[#062B65]/80 text-slate-200 border-white/15 hover:bg-[#062B65]'
            }`}
            title={isAutoRotating ? 'Айналуды тоқтату' : '360° авто-айналуды қосу'}
            aria-label={isAutoRotating ? 'Айналуды тоқтату' : '360° авто-айналуды қосу'}
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Zoom In */}
          <button
            onClick={() => handleZoom('in')}
            className="min-w-11 min-h-11 flex items-center justify-center rounded-xl bg-[#062B65]/80 hover:bg-[#062B65] text-slate-200 border border-white/15 backdrop-blur-md transition-colors"
            title="Жақындату"
            aria-label="Жақындату"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => handleZoom('out')}
            className="min-w-11 min-h-11 flex items-center justify-center rounded-xl bg-[#062B65]/80 hover:bg-[#062B65] text-slate-200 border border-white/15 backdrop-blur-md transition-colors"
            title="Алыстату"
            aria-label="Алыстату"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset View */}
          <button
            onClick={() => applyCameraPreset('general')}
            className="min-w-11 min-h-11 flex items-center justify-center rounded-xl bg-[#062B65]/80 hover:bg-[#062B65] text-slate-200 border border-white/15 backdrop-blur-md transition-colors"
            title="Бастапқы күй"
            aria-label="Бастапқы күй"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* ASAR 4-STAGE INTERACTIVE ASSEMBLY CONTROLS */}
        {scenarioId === 'ar-asar' && (
          <div className="relative xl:absolute xl:bottom-4 xl:left-4 xl:right-4 z-10 flex flex-col items-center gap-2 p-2 xl:p-0 bg-[#051B44] xl:bg-transparent">
            
            {/* Stage title & info banner */}
            <div className="max-w-full px-3 py-2 rounded-xl bg-[#051B44]/95 border border-[#00BFFF]/40 text-xs text-slate-200 backdrop-blur-md flex flex-wrap items-center justify-center gap-1 shadow-lg text-center">
              <span className="font-bold text-[#00E5FF]">Асар кезеңі:</span>
              <span>
                {asarStage === 1 && '1. Керегені құру — Дөңгелек қабырғаны ашып, сықырлауықты орнату'}
                {asarStage === 2 && '2. Шаңырақты көтеру — Ақсақал ашалы бақанмен төбеге көтереді'}
                {asarStage === 3 && '3. Уықтарды бекіту — Кереге басы мен шаңырақ көзіне уық байлау'}
                {asarStage === 4 && '4. Киізбен жабу — Туырлық, үзік, түндік пен басқұр тартылады'}
              </span>
            </div>

            {/* Stage Buttons */}
            <div className="p-1.5 rounded-2xl bg-[#051B44]/95 border border-[#D49A35]/50 backdrop-blur-md flex flex-wrap items-center justify-center gap-1 shadow-2xl max-w-2xl w-full">
              {[
                { stage: 1, label: '1. Кереге құру' },
                { stage: 2, label: '2. Шаңырақ көтеру' },
                { stage: 3, label: '3. Уық бекіту' },
                { stage: 4, label: '4. Киізбен жабу' },
              ].map((s) => (
                <button
                  key={s.stage}
                  onClick={() => { setAsarStage(s.stage); setReplay(v => v + 1); }}
                  className={`flex-1 basis-[calc(50%-0.25rem)] xl:basis-auto min-w-0 min-h-11 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                    asarStage === s.stage
                      ? 'bg-gradient-to-r from-[#D49A35] to-[#F3BE5E] text-[#051B44] shadow-gold-glow'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

          </div>
        )}

        {/* TUSAUKESER 3-STAGE SWITCHER */}
        {scenarioId === 'ar-tusaukeser' && (
          <div className="relative xl:absolute xl:bottom-4 xl:left-4 xl:right-4 z-10 flex justify-center p-2 xl:p-0 bg-[#051B44] xl:bg-transparent">
            <div className="p-1.5 rounded-2xl bg-[#051B44]/95 border border-[#D49A35]/50 backdrop-blur-md flex flex-wrap items-center gap-1 shadow-2xl max-w-lg w-full">
              {[
                { stage: 1, label: '1. Дайындық (Ала жіп)' },
                { stage: 2, label: '2. Тұсауды кесу' },
                { stage: 3, label: '3. Алғашқы қадам' },
              ].map((s) => (
                <button
                  key={s.stage}
                  onClick={() => { setTusaukeserStage(s.stage); setReplay(v => v + 1); }}
                  className={`flex-1 basis-[calc(50%-0.25rem)] xl:basis-auto min-w-0 min-h-11 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                    tusaukeserStage === s.stage
                      ? 'bg-gradient-to-r from-[#D49A35] to-[#F3BE5E] text-[#051B44] shadow-gold-glow'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {asset.stageLabels.length > 0 && scenarioId !== 'ar-asar' && scenarioId !== 'ar-tusaukeser' && (
          <div className="relative xl:absolute xl:bottom-4 xl:left-4 xl:right-4 z-10 flex justify-center p-2 xl:p-0 bg-[#051B44] xl:bg-transparent">
            <div className="p-1.5 rounded-2xl bg-[#051B44]/95 border border-[#D49A35]/50 backdrop-blur-md flex flex-wrap items-center gap-1 shadow-2xl max-w-2xl w-full">
              {asset.stageLabels.map((label, index) => (
                <button key={label} onClick={() => { setAdditionalStage(index + 1); setReplay(v => v + 1); }}
                  className={`flex-1 basis-[calc(50%-0.25rem)] xl:basis-auto min-w-0 min-h-11 px-2 rounded-xl text-xs font-bold text-center ${additionalStage === index + 1
                    ? 'bg-gradient-to-r from-[#D49A35] to-[#F3BE5E] text-[#051B44]'
                    : 'text-slate-300 hover:bg-white/5'}`}>
                  {index + 1}. {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected 3D Hotspot / Mesh Detail Modal */}
        {selectedHotspot && (
          <div className="hidden xl:block xl:absolute xl:bottom-28 mx-2 xl:mx-auto xl:left-4 xl:right-4 max-w-md z-20 animate-slideUp">
            <div className="p-5 rounded-2xl bg-[#051E4E]/95 backdrop-blur-xl border border-[#00BFFF]/60 shadow-2xl text-white relative">
              <button
                onClick={() => setSelectedHotspot(null)}
                className="absolute top-2 right-2 min-w-11 min-h-11 text-slate-400 hover:text-white text-xs flex items-center justify-center"
                aria-label="Жабу"
              >
                ✕
              </button>
              <div className="flex items-center gap-2 mb-1.5 text-[#00E5FF] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#D49A35]" />
                <span>Архитектуралық және тәрбиелік мәні</span>
              </div>
              <h4 className="text-base font-bold text-white mb-2 font-serif">
                {selectedHotspot.name}
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedHotspot.meaning}
              </p>
              {asset.sourceUrl && <a className="inline-block mt-3 text-xs text-[#00E5FF] underline" href={asset.sourceUrl}
                target="_blank" rel="noopener noreferrer">Дереккөз: {asset.sourceTitle}</a>}
            </div>
          </div>
        )}

      </div>

      {asset.duration > 0 && <div className="p-4 bg-[#051B44] flex flex-wrap gap-3 items-center text-xs text-slate-200 border-t border-white/10">
        <button disabled={loadState !== 'ready'} className="px-3 min-h-11 bg-[#062B65] rounded-xl disabled:opacity-40" onClick={() => {
          if (isPlaying) { timelineRef.current.running = false; setIsPlaying(false); }
          else { const t = timelineRef.current; if (t.time >= asset.duration) t.time = 0; t.target = asset.duration; t.running = true; setIsPlaying(true); }
        }}>{isPlaying ? 'Кідірту' : 'Барлық кезеңді ойнату'}</button>
        <input aria-label="Анимация уақыты" className="flex-1 min-w-[100px] min-h-11 accent-[#D49A35]" type="range" min="0" max={asset.duration} step="0.05" value={timelineTime} onChange={e => {
          const time = Number(e.target.value); timelineRef.current = { time, target: time, running: false }; setTimelineTime(time); setIsPlaying(false);
        }} />
        <span className="font-mono">{timelineTime.toFixed(1)} / {asset.duration} с</span>
      </div>}
      <div className="px-4 py-3 text-[11px] text-slate-300 bg-[#03112E] border-t border-white/10">
        Авторлық 3D оқу үлгісі. Киім, қозғалыс пен этнографиялық дәлдік сарапшы тексеруін қажет етеді.
        <a href={asset.url} download className="ml-2 text-[#00E5FF] underline">GLB жүктеу</a>
      </div>
      {/* Museum Photographic Reference Comparison Modal */}
      {showMuseumPhoto && referencePhotos[scenarioId] && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4" role="dialog" aria-modal="true" aria-label="2D референс иллюстрациясы">
          <div className="glass-panel p-4 sm:p-6 rounded-3xl max-w-2xl w-full max-h-[calc(100dvh-1.5rem)] overflow-y-auto border border-[#D49A35]/50 text-white animate-slideUp relative shadow-2xl">
            <button
              ref={photoCloseRef}
              onClick={() => setShowMuseumPhoto(false)}
              className="absolute top-2 right-2 min-h-11 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
              aria-label="Жабу"
            >
              ✕ Жабу
            </button>

            <div className="flex items-center gap-2 mb-3 text-[#D49A35] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#00E5FF]" />
              <span>2D референс иллюстрациясы</span>
            </div>

            <h3 className="text-xl font-bold font-serif mb-2">
              {referencePhotos[scenarioId].title}
            </h3>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/20 mb-4">
              <img
                src={referencePhotos[scenarioId].image}
                alt={referencePhotos[scenarioId].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-3 py-1 rounded-lg bg-black/70 text-[10px] text-amber-300 font-mono border border-white/10">
                2D иллюстрация — өлшемдік дереккөз емес
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed mb-4">
              {referencePhotos[scenarioId].desc}
            </p>

            <div className="p-3 rounded-xl bg-[#03112E] border border-white/10 text-[11px] text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#00BFFF] shrink-0 mt-0.5" />
              <span>
                <strong>Ашықтық:</strong> Бұл — 2D иллюстрация. 3D үлгінің өлшемдері мен тарихи дәлдігі сарапшы тарапынан расталмаған.
              </span>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowMuseumPhoto(false)}
                className="min-h-11 px-5 rounded-xl bg-gradient-to-r from-[#D49A35] to-[#F3BE5E] text-[#051B44] text-xs font-bold shadow-gold-glow"
              >
                Интерактивті 3D үлгіге оралу
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Interactive Component Pills */}
      <div className="p-4 bg-[#051B44] border-t border-[#00BFFF]/20">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#D49A35] uppercase tracking-wider">
            <Info className="w-3.5 h-3.5 text-[#00BFFF]" />
            <span>3D Құрылымдық Бөлшектер (Таңдап зерттеңіз):</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {hotspotsList.length} негізгі бөлшек
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {hotspotsList.map((spot) => (
            <button
              key={spot.id}
              onClick={() => {
                setSelectedHotspot(spot);
                setIsAutoRotating(false);
              }}
              className={`min-h-11 px-3 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                selectedHotspot?.id === spot.id
                  ? 'bg-[#00BFFF] text-[#051B44] border-[#00BFFF] font-bold shadow-cyan-glow'
                  : 'bg-[#062B65]/70 text-slate-200 border-white/10 hover:border-[#00BFFF]/50 hover:bg-[#0B357A]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
              <span>{spot.name.split('(')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedHotspot && <div className="xl:hidden p-4 bg-[#08285c] border-t border-[#00BFFF]/40" role="status">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#00E5FF]">Архитектуралық және тәрбиелік мәні</p>
            <h4 className="text-base font-bold text-white mt-1">{selectedHotspot.name}</h4>
          </div>
          <button onClick={() => setSelectedHotspot(null)} className="min-w-11 min-h-11 rounded-xl bg-white/10 text-white" aria-label="Бөлшек сипаттамасын жабу">✕</button>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed mt-2">{selectedHotspot.meaning}</p>
        {asset.sourceUrl && <a className="inline-flex min-h-11 items-center text-sm text-[#00E5FF] underline" href={asset.sourceUrl}
          target="_blank" rel="noopener noreferrer">Дереккөз: {asset.sourceTitle}</a>}
      </div>}

    </div>
  );
};
