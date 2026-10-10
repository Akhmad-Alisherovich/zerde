import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  buildNauryzScene, 
  buildTusaukeserScene, 
  buildAsarScene, 
  HotspotData 
} from './CulturalSceneBuilder';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  ChevronLeft, 
  Compass, 
  Eye, 
  CheckCircle2, 
  Info,
  Maximize2
} from 'lucide-react';

interface Interactive3DViewerProps {
  scenarioId: string;
}

export const Interactive3DViewer: React.FC<Interactive3DViewerProps> = ({ scenarioId }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // States
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null);
  const [hotspotsList, setHotspotsList] = useState<HotspotData[]>([]);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [tusaukeserStage, setTusaukeserStage] = useState<number>(1);
  const [asarStage, setAsarStage] = useState<number>(3); // Default to full assembly skeleton (Stage 3)
  const [cameraPreset, setCameraPreset] = useState<'general' | 'top' | 'close' | 'orbit'>('general');
  const [showMuseumPhoto, setShowMuseumPhoto] = useState<boolean>(false);

  // High-Resolution Museum Reference Data
  const referencePhotos: Record<string, { image: string; title: string; desc: string }> = {
    'ar-nauryz': {
      image: '/assets/nauryz_dastarkhan_ar.jpg',
      title: 'Наурыз мерекелік дастарханы (Мұражайлық фото-эталон)',
      desc: 'Қайыңнан ойылған астау, қызарған бауырсақтар, дәстүрлі наурыз көже тостағандары, жез самаурын және оюлы текемет кілем.'
    },
    'ar-tusaukeser': {
      image: '/assets/tusaukeser_shoes.jpg',
      title: 'Тұсаукесер рәсімі (Мұражайлық фото-эталон)',
      desc: 'Ақ пен қара жүннен өрілген киелі Ала жіп, сәбидің оюлы былғары кебісі мен үкілі тақиясы, ақ жол матасы және күміс қайшы.'
    },
    'ar-asar': {
      image: '/assets/tradition_asar.jpg',
      title: 'Асар — Шаңырақ көтеру (Мұражайлық фото-эталон)',
      desc: 'Ақсақал мен ауыл жастарының киіз үй шаңырағын ашалы бақанмен көтеріп, уықтарды шану сәтінің шынайы этнографиялық реконструкциясы.'
    }
  };

  // Three.js instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const hotspotSpritesRef = useRef<THREE.Group | null>(null);

  // Setup Three.js Scene with Museum Daylighting
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene with Steppe Sky Tone
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#03112E');
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      60
    );
    camera.position.set(3.4, 2.5, 3.8);
    cameraRef.current = camera;

    // 3. Renderer with ACES Tone Mapping & Soft Shadows
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Keep camera above ground
    controls.minDistance = 1.4;
    controls.maxDistance = 7.5;
    controls.target.set(0, 0.7, 0);
    controlsRef.current = controls;

    // 5. Natural Steppe Daylight Illumination
    // Sky and ground ambient light (Hemisphere)
    const hemiLight = new THREE.HemisphereLight('#FFF6E5', '#3A4F2A', 1.1);
    scene.add(hemiLight);

    // Warm direct steppe sunlight (casting soft shadows)
    const sunLight = new THREE.DirectionalLight('#FFF9EE', 2.0);
    sunLight.position.set(4.5, 6.0, 3.5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0001;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 15;
    sunLight.shadow.camera.left = -4;
    sunLight.shadow.camera.right = 4;
    sunLight.shadow.camera.top = 4;
    sunLight.shadow.camera.bottom = -4;
    scene.add(sunLight);

    // Subtle sky fill light from north-west
    const fillLight = new THREE.DirectionalLight('#8AC5E8', 0.75);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);

    // Root group for cultural models
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    rootGroupRef.current = rootGroup;

    // Hotspot pins group
    const hotspotGroup = new THREE.Group();
    scene.add(hotspotGroup);
    hotspotSpritesRef.current = hotspotGroup;

    // 6. Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.autoRotate = isAutoRotating;
        controlsRef.current.autoRotateSpeed = 1.1;
        controlsRef.current.update();
      }

      // Gentle pulsing of 3D hotspot pins
      const time = performance.now() * 0.003;
      hotspotGroup.children.forEach((child, idx) => {
        const s = 1.0 + Math.sin(time + idx * 1.5) * 0.12;
        child.scale.set(s, s, s);
      });

      renderer.render(scene, camera);
    };
    animate();

    // 7. Resize handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update scene models when scenarioId, tusaukeserStage, or asarStage changes
  useEffect(() => {
    const rootGroup = rootGroupRef.current;
    const hotspotGroup = hotspotSpritesRef.current;
    if (!rootGroup || !hotspotGroup) return;

    let spots: HotspotData[] = [];

    if (scenarioId === 'ar-nauryz') {
      spots = buildNauryzScene(rootGroup);
      if (controlsRef.current && cameraRef.current) {
        cameraRef.current.position.set(2.6, 2.0, 2.8);
        controlsRef.current.target.set(0, 0.45, 0);
      }
    } else if (scenarioId === 'ar-tusaukeser') {
      spots = buildTusaukeserScene(rootGroup, tusaukeserStage);
      if (controlsRef.current && cameraRef.current) {
        cameraRef.current.position.set(2.1, 1.6, 2.4);
        controlsRef.current.target.set(0, 0.4, 0.3);
      }
    } else if (scenarioId === 'ar-asar') {
      spots = buildAsarScene(rootGroup, asarStage);
      if (controlsRef.current && cameraRef.current) {
        cameraRef.current.position.set(3.4, 2.5, 3.8);
        controlsRef.current.target.set(0, 0.9, 0);
      }
    }

    setHotspotsList(spots);
    setSelectedHotspot(null);

    // Rebuild visual 3D pin meshes for hotspots
    while (hotspotGroup.children.length > 0) {
      hotspotGroup.remove(hotspotGroup.children[0]);
    }

    spots.forEach((spot) => {
      const pin = new THREE.Group();
      pin.position.copy(spot.position);

      // Gold outer ring
      const ringGeo = new THREE.TorusGeometry(0.09, 0.016, 8, 18);
      const ringMat = new THREE.MeshBasicMaterial({ color: '#D49A35' });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      pin.add(ring);

      // Cyan core glowing sphere
      const sphereGeo = new THREE.SphereGeometry(0.048, 12, 12);
      const sphereMat = new THREE.MeshBasicMaterial({ color: '#00E5FF' });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      pin.add(sphere);

      pin.userData = { hotspot: spot };
      hotspotGroup.add(pin);
    });

  }, [scenarioId, tusaukeserStage, asarStage]);

  // Click on 3D canvas to select a hotspot or 3D component via raycaster
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    const hotspotGroup = hotspotSpritesRef.current;
    const rootGroup = rootGroupRef.current;
    if (!canvas || !camera || !hotspotGroup || !rootGroup) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    // Check hotspot pins first
    const pinIntersects = raycaster.intersectObjects(hotspotGroup.children, true);
    if (pinIntersects.length > 0) {
      let current: THREE.Object3D | null = pinIntersects[0].object;
      while (current && !current.userData?.hotspot) {
        current = current.parent;
      }
      if (current?.userData?.hotspot) {
        setSelectedHotspot(current.userData.hotspot);
        setIsAutoRotating(false);
        return;
      }
    }

    // Check 3D mesh components directly
    const meshIntersects = raycaster.intersectObjects(rootGroup.children, true);
    if (meshIntersects.length > 0) {
      let hit: THREE.Object3D | null = meshIntersects[0].object;
      while (hit && !hit.name && hit.parent !== rootGroup) {
        hit = hit.parent;
      }

      if (hit?.name) {
        const matchingSpot = hotspotsList.find(s => 
          (hit!.name.includes('shanyraq') && s.id.includes('shanyraq')) ||
          (hit!.name.includes('kerege') && s.id.includes('kerege')) ||
          (hit!.name.includes('uyk') && s.id.includes('uyk')) ||
          (hit!.name.includes('bakan') && s.id.includes('bakan')) ||
          (hit!.name.includes('kiiz') && s.id.includes('kiiz')) ||
          (hit!.name.includes('dastarkhan') && s.id.includes('dastarkhan')) ||
          (hit!.name.includes('astau') && s.id.includes('baursak')) ||
          (hit!.name.includes('kozhe') && s.id.includes('kozhe'))
        );

        if (matchingSpot) {
          setSelectedHotspot(matchingSpot);
          setIsAutoRotating(false);
        }
      }
    }
  };

  // Camera Presets
  const applyCameraPreset = (preset: 'general' | 'top' | 'close' | 'orbit') => {
    setCameraPreset(preset);
    if (!cameraRef.current || !controlsRef.current) return;

    if (preset === 'general') {
      setIsAutoRotating(false);
      cameraRef.current.position.set(3.4, 2.5, 3.8);
      controlsRef.current.target.set(0, 0.7, 0);
    } else if (preset === 'top') {
      setIsAutoRotating(false);
      cameraRef.current.position.set(0.1, 4.8, 0.1);
      controlsRef.current.target.set(0, 0.7, 0);
    } else if (preset === 'close') {
      setIsAutoRotating(false);
      cameraRef.current.position.set(1.4, 1.4, 1.6);
      controlsRef.current.target.set(0, 1.0, 0);
    } else if (preset === 'orbit') {
      setIsAutoRotating(true);
    }
    controlsRef.current.update();
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const factor = direction === 'in' ? 0.82 : 1.22;
    cameraRef.current.position.multiplyScalar(factor);
    controlsRef.current.update();
  };

  return (
    <div className="flex flex-col h-full relative rounded-3xl overflow-hidden border border-[#00BFFF]/30 glass-panel shadow-2xl bg-[#03112E]">
      
      {/* 3D Canvas Viewport */}
      <div 
        ref={containerRef} 
        className="w-full h-[540px] sm:h-[620px] relative cursor-grab active:cursor-grabbing"
      >
        <canvas 
          ref={canvasRef} 
          onClick={handleCanvasClick}
          className="w-full h-full block" 
        />

        {/* Top Left Badge & Educational Label */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#051B44]/90 backdrop-blur-md border border-[#D49A35]/50 text-[#D49A35] text-xs font-bold shadow-gold-glow">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Музейлік 3D Реконструкция</span>
          </div>
          <span className="text-[11px] text-slate-300 drop-shadow pl-1">
            Кез келген бұрыштан 360° еркін айналдырыңыз, жақындатыңыз
          </span>
        </div>

        {/* Top Right Viewport Controls & Camera Presets */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {/* Museum Photographic Reference Button */}
          <button
            onClick={() => setShowMuseumPhoto(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#051B44]/90 hover:bg-[#062B65] border border-[#D49A35]/60 text-[#D49A35] text-xs font-bold transition-all shadow-gold-glow backdrop-blur-md"
            title="Мұражайлық фото-эталонды көру"
          >
            <Eye className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="hidden sm:inline">Фото-Эталон</span>
          </button>

          {/* Camera Presets Selector */}
          <div className="hidden sm:flex items-center bg-[#051B44]/90 rounded-xl border border-white/15 p-1 backdrop-blur-md">
            {[
              { id: 'general', label: 'Жалпы' },
              { id: 'top', label: 'Төбеден' },
              { id: 'close', label: 'Жақын' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => applyCameraPreset(p.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
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
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
              isAutoRotating
                ? 'bg-[#00BFFF] text-[#051B44] border-[#00BFFF] shadow-cyan-glow'
                : 'bg-[#062B65]/80 text-slate-200 border-white/15 hover:bg-[#062B65]'
            }`}
            title={isAutoRotating ? 'Айналуды тоқтату' : '360° авто-айналуды қосу'}
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Zoom In */}
          <button
            onClick={() => handleZoom('in')}
            className="p-2.5 rounded-xl bg-[#062B65]/80 hover:bg-[#062B65] text-slate-200 border border-white/15 backdrop-blur-md transition-colors"
            title="Жақындату"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => handleZoom('out')}
            className="p-2.5 rounded-xl bg-[#062B65]/80 hover:bg-[#062B65] text-slate-200 border border-white/15 backdrop-blur-md transition-colors"
            title="Алыстату"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset View */}
          <button
            onClick={() => applyCameraPreset('general')}
            className="p-2.5 rounded-xl bg-[#062B65]/80 hover:bg-[#062B65] text-slate-200 border border-white/15 backdrop-blur-md transition-colors"
            title="Бастапқы күй"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* ASAR 4-STAGE INTERACTIVE ASSEMBLY CONTROLS */}
        {scenarioId === 'ar-asar' && (
          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col items-center gap-2">
            
            {/* Stage title & info banner */}
            <div className="px-4 py-1.5 rounded-full bg-[#051B44]/95 border border-[#00BFFF]/40 text-xs text-slate-200 backdrop-blur-md flex items-center gap-2 shadow-lg">
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
                  onClick={() => setAsarStage(s.stage)}
                  className={`flex-1 min-w-[110px] py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
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
          <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-center">
            <div className="p-1.5 rounded-2xl bg-[#051B44]/95 border border-[#D49A35]/50 backdrop-blur-md flex items-center gap-1 shadow-2xl max-w-lg w-full">
              {[
                { stage: 1, label: '1. Дайындық (Ала жіп)' },
                { stage: 2, label: '2. Тұсауды кесу' },
                { stage: 3, label: '3. Алғашқы қадам' },
              ].map((s) => (
                <button
                  key={s.stage}
                  onClick={() => setTusaukeserStage(s.stage)}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
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

        {/* Selected 3D Hotspot / Mesh Detail Modal */}
        {selectedHotspot && (
          <div className="absolute bottom-24 sm:bottom-28 left-4 right-4 max-w-md mx-auto z-20 animate-slideUp">
            <div className="p-5 rounded-2xl bg-[#051E4E]/95 backdrop-blur-xl border border-[#00BFFF]/60 shadow-2xl text-white relative">
              <button
                onClick={() => setSelectedHotspot(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white text-xs p-1"
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
            </div>
          </div>
        )}

      </div>

      {/* Museum Photographic Reference Comparison Modal */}
      {showMuseumPhoto && referencePhotos[scenarioId] && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-2xl w-full border border-[#D49A35]/50 text-white animate-slideUp relative shadow-2xl">
            <button
              onClick={() => setShowMuseumPhoto(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
              aria-label="Жабу"
            >
              ✕ Жабу
            </button>

            <div className="flex items-center gap-2 mb-3 text-[#D49A35] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#00E5FF]" />
              <span>Тарихи-этнографиялық мұражайлық фото-эталон</span>
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
                Ғылыми эталондық фото-реконструкция
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed mb-4">
              {referencePhotos[scenarioId].desc}
            </p>

            <div className="p-3 rounded-xl bg-[#03112E] border border-white/10 text-[11px] text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#00BFFF] shrink-0 mt-0.5" />
              <span>
                <strong>Ғылыми сәйкестік:</strong> Веб-қосымшадағы интерактивті 3D үлгі осы нақты тарихи бұйымдар мен киім пішімдерінің геометриялық пропорциялары бойынша қалпына келтірілген.
              </span>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowMuseumPhoto(false)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D49A35] to-[#F3BE5E] text-[#051B44] text-xs font-bold shadow-gold-glow"
              >
                Интерактивті 3D үлгіге оралу
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Interactive Component Pills */}
      <div className="p-4 bg-[#051B44] border-t border-[#00BFFF]/20">
        <div className="flex items-center justify-between mb-2">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
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

    </div>
  );
};
