import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Camera, CameraOff, RefreshCw, Download } from 'lucide-react';
import { disposeScene, getSceneAsset, loadScene } from './SceneAssets';

interface WebARCameraViewerProps { scenarioId: string; onFallbackTo3D: () => void }

/** WebXR is the tracking provider. No contrast heuristic, simulated confidence or fake desk anchor. */
export const WebARCameraViewer: React.FC<WebARCameraViewerProps> = ({ scenarioId, onFallbackTo3D }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sessionRef = useRef<XRSession | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const reticleRef = useRef<THREE.Mesh | null>(null);
  const placementRef = useRef(false);
  const replayRef = useRef(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'starting' | 'scanning' | 'placed' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [scale, setScale] = useState(.15);
  const [rotation, setRotation] = useState(0);
  const [active, setActive] = useState(false);
  const asset = getSceneAsset(scenarioId);

  useEffect(() => {
    let cancelled = false;
    setSupported(null);
    if (!window.isSecureContext || !navigator.xr) { setSupported(false); return; }
    navigator.xr.isSessionSupported('immersive-ar').then(value => { if (!cancelled) setSupported(value); })
      .catch(() => { if (!cancelled) setSupported(false); });
    return () => { cancelled = true; };
  }, [scenarioId]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    let cancelled = false;
    let hitSource: XRHitTestSource | undefined;
    let xrReference: XRReferenceSpace | undefined;
    let mixer: THREE.AnimationMixer | undefined;
    let animationTime = 0;
    let lastTime = 0;
    let renderer: THREE.WebGLRenderer;
    setStatus('loading'); setMessage(''); setActive(false); placementRef.current = false;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true }); }
    catch { setStatus('error'); setMessage('WebGL қолжетімсіз.'); return; }
    rendererRef.current = renderer;
    renderer.xr.enabled = true; renderer.xr.setReferenceSpaceType('local');
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, .01, 30);
    scene.add(new THREE.HemisphereLight('#eef4ff', '#675d48', 2.5));
    const light = new THREE.DirectionalLight('#fff0df', 2); light.position.set(2, 5, 3); scene.add(light);
    const model = new THREE.Group(); model.visible = false; model.scale.setScalar(.15); scene.add(model); modelRef.current = model;
    // Surface aiming indicator is UI, independent of the cultural meshes.
    const reticle = new THREE.Mesh(new THREE.RingGeometry(.075, .09, 40).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#00e5ff', side: THREE.DoubleSide }));
    reticle.matrixAutoUpdate = false; reticle.visible = false; scene.add(reticle); reticleRef.current = reticle;
    const resize = () => {
      if (renderer.xr.isPresenting) return;
      const c = containerRef.current; if (!c) return;
      renderer.setSize(Math.max(1, c.clientWidth), Math.max(1, c.clientHeight));
      camera.aspect = c.clientWidth / Math.max(1, c.clientHeight); camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize); observer.observe(containerRef.current); resize();
    const overlay = overlayRef.current;
    const preventXRSelect = (event: Event) => event.preventDefault();
    overlay?.addEventListener('beforexrselect', preventXRSelect);
    loadScene(scenarioId).then(gltf => {
      if (cancelled) { disposeScene(gltf.scene); return; }
      model.add(gltf.scene);
      if (gltf.animations[0]) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[0]); action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true; action.play();
        mixer.setTime(asset.duration); // Initial AR model is fully assembled.
      }
      setStatus('ready');
    }).catch(error => { if (!cancelled) { setStatus('error'); setMessage(`GLB жүктелмеді: ${error.message}`); } });

    const onSessionEnd = () => {
      if (cancelled) return;
      hitSource?.cancel(); hitSource = undefined; xrReference = undefined;
      sessionRef.current = null; placementRef.current = false; model.visible = false; reticle.visible = false;
      if (!cancelled) { setActive(false); setStatus('ready'); resize(); }
    };
    const onSessionStart = async () => {
      if (cancelled) return;
      const session = renderer.xr.getSession(); if (!session) return;
      sessionRef.current = session; session.addEventListener('end', onSessionEnd, { once: true });
      session.addEventListener('select', () => {
        if (cancelled || placementRef.current || !reticle.visible) return;
        model.position.setFromMatrixPosition(reticle.matrix); model.visible = true;
        placementRef.current = true; reticle.visible = false; setStatus('placed');
      });
      try {
        const viewer = await session.requestReferenceSpace('viewer');
        const reference = await session.requestReferenceSpace('local');
        if (!session.requestHitTestSource) throw new Error('Hit-test API қолжетімсіз.');
        const source = await session.requestHitTestSource({ space: viewer });
        if (cancelled || sessionRef.current !== session) { source?.cancel(); return; }
        xrReference = reference; hitSource = source; setStatus('scanning'); setActive(true);
      } catch (error) {
        if (!cancelled) { setMessage(error instanceof Error ? error.message : 'AR қадағалауын қосу мүмкін болмады.'); setStatus('error'); }
        await session.end().catch(() => undefined);
      }
    };
    renderer.xr.addEventListener('sessionstart', onSessionStart);
    renderer.setAnimationLoop((time, frame) => {
      const delta = lastTime ? Math.min((time - lastTime) / 1000, .1) : 0; lastTime = time;
      if (frame && hitSource && xrReference && !placementRef.current) {
        const hit = frame.getHitTestResults(hitSource)[0]; const pose = hit?.getPose(xrReference);
        reticle.visible = Boolean(pose); if (pose) reticle.matrix.fromArray(pose.transform.matrix);
      }
      if (replayRef.current && mixer) {
        animationTime = Math.min(asset.duration, animationTime + delta); mixer.setTime(animationTime);
        if (animationTime >= asset.duration) { replayRef.current = false; animationTime = 0; }
      } else animationTime = 0;
      renderer.render(scene, camera);
    });
    return () => {
      cancelled = true; observer.disconnect(); overlay?.removeEventListener('beforexrselect', preventXRSelect); renderer.setAnimationLoop(null);
      renderer.xr.removeEventListener('sessionstart', onSessionStart);
      hitSource?.cancel(); const session = sessionRef.current; sessionRef.current = null;
      if (session) void session.end().catch(() => undefined);
      if (mixer) { mixer.stopAllAction(); mixer.uncacheRoot(mixer.getRoot()); }
      disposeScene(scene); renderer.dispose();
      rendererRef.current = null; modelRef.current = null; reticleRef.current = null;
    };
  }, [scenarioId]);

  useEffect(() => { modelRef.current?.scale.setScalar(scale); }, [scale]);
  useEffect(() => { if (modelRef.current) modelRef.current.rotation.y = rotation; }, [rotation]);

  const startAR = async () => {
    const renderer = rendererRef.current;
    if (!navigator.xr || !renderer || status !== 'ready') return;
    setStatus('starting'); setMessage('');
    let session: XRSession | undefined;
    try {
      session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'],
        ...(overlayRef.current ? { domOverlay: { root: overlayRef.current } } : {}),
      });
      // Permission may resolve after component unmount.
      if (rendererRef.current !== renderer) { await session.end(); return; }
      sessionRef.current = session;
      await renderer.xr.setSession(session);
    } catch (error) {
      if (session) await session.end().catch(() => undefined);
      if (rendererRef.current === renderer) {
        setStatus('ready'); setMessage(error instanceof Error ? error.message : 'AR сессиясы ашылмады.');
      }
    }
  };
  const place = () => {
    const model = modelRef.current, reticle = reticleRef.current;
    if (!model || !reticle?.visible) return;
    model.position.setFromMatrixPosition(reticle.matrix); model.visible = true;
    placementRef.current = true; reticle.visible = false; setStatus('placed');
  };
  const nativeARLink = (() => {
    if (!window.isSecureContext || !/Android/i.test(navigator.userAgent)) return null;
    const modelURL = new URL(asset.url, window.location.origin).href;
    if (!modelURL.startsWith('https://')) return null;
    return `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(modelURL)}&mode=ar_preferred&title=${encodeURIComponent(asset.title)}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(window.location.href)};end;`;
  })();
  return <div className="rounded-3xl overflow-hidden border border-[#00BFFF]/30 bg-[#03112E]">
    <div ref={containerRef} className="relative h-[540px] sm:h-[620px]">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div ref={overlayRef} className="absolute inset-0 pointer-events-none p-5 flex flex-col justify-between text-white">
        <div className="p-3 rounded-xl bg-[#051B44]/90 max-w-md pointer-events-auto" role="status">
          <strong className="text-[#00E5FF] text-sm">{asset.title} • WebXR</strong>
          <p className="text-xs mt-2 text-slate-200">{active ? (status === 'placed' ? 'Үлгі қойылды. Құрылғыны айналдырып зерттеңіз.' : 'Жарық бетке бағыттаңыз. Белгі пайда болғанда экранды түртіңіз.') : 'Камера AR бұл ортада тексерілмеген. Қолдау құрылғы мен шолушыға байланысты.'}</p>
        </div>
        {!active && <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
          <div className="max-w-sm p-6 rounded-2xl bg-[#051B44]/95 border border-[#00BFFF]/30 pointer-events-auto">
            {supported ? <Camera className="w-10 h-10 mx-auto text-cyan-300 mb-4" /> : <CameraOff className="w-10 h-10 mx-auto text-amber-300 mb-4" />}
            <p className="text-sm mb-4">{status === 'loading' ? 'GLB үлгісі жүктелуде…' : supported === null ? 'WebXR қолдауы тексерілуде…' : supported ? 'AR сессиясын іске қосу' : 'Бұл шолушыда WebXR AR қолжетімсіз. 3D режимінде үлгіні зерттеуге болады.'}</p>
            {supported && <button onClick={startAR} disabled={status !== 'ready'} className="bg-[#00BFFF] text-[#051B44] px-4 py-2 rounded-xl font-bold text-sm disabled:opacity-40">{status === 'starting' ? 'Сессия ашылуда…' : 'AR іске қосу'}</button>}
            {nativeARLink && <a href={nativeARLink} className="block text-cyan-300 text-xs underline mt-4">Android Scene Viewer арқылы ашу (тексерілмеген)</a>}
            <button onClick={onFallbackTo3D} className="block mx-auto mt-4 text-xs underline text-slate-200">3D көрініске өту</button>
            {message && <p role="alert" className="text-xs text-amber-200 mt-4 break-words">{message}</p>}
          </div>
        </div>}
        {active && <div className="pointer-events-auto bg-[#051B44]/90 rounded-xl p-3 text-xs flex flex-wrap gap-3 items-center" onClick={e => e.stopPropagation()}>
          {status === 'scanning' && <button onClick={place} className="px-3 py-2 bg-cyan-500 rounded-lg text-slate-950 font-bold">Бетке қою</button>}
          <button aria-label="Қайта орналастыру" onClick={() => { placementRef.current = false; if (modelRef.current) modelRef.current.visible = false; setStatus('scanning'); }}><RefreshCw className="w-4 h-4" /></button>
          <label>Өлшем <input aria-label="AR өлшемі" type="range" min="0.05" max="0.5" step="0.01" value={scale} onChange={e => setScale(Number(e.target.value))} className="w-24 accent-cyan-400 ml-2" /></label>
          <label>Бұру <input aria-label="AR бұрылуы" type="range" min="0" max={Math.PI*2} step="0.05" value={rotation} onChange={e => setRotation(Number(e.target.value))} className="w-24 accent-amber-400 ml-2" /></label>
          {asset.duration > 0 && <button onClick={() => { replayRef.current = true; }} className="underline">Кезеңдерді ойнату</button>}
          <button onClick={() => void sessionRef.current?.end()} className="ml-auto px-3 py-2 bg-white/10 rounded-lg">AR жабу</button>
        </div>}
      </div>
    </div>
    <div className="p-4 text-xs text-slate-300 border-t border-white/10">
      WebXR бет іздеуін қолданады; Hiro маркерін пайдаланбайды. Камераға қолжетімділік AR сессиясын іске қосқанда сұралады.
      <a href={asset.url} download className="ml-2 inline-flex items-center gap-1 text-cyan-300"><Download className="w-3 h-3" />GLB жүктеу</a>
    </div>
  </div>;
};
