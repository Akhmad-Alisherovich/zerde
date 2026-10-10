import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface HotspotData {
  id: string;
  name: string;
  meaning: string;
  position: THREE.Vector3;
}
export interface SceneAsset {
  url: string;
  title: string;
  stageLabels: string[];
  duration: number;
  hotspots: Record<string, { name: string; meaning: string }>;
}
const yurtHotspots = {
  kerege: { name: 'Кереге', meaning: 'Жиналмалы торлы қабырға. Ағаш сағанақтар қайыспен байланысады. Үлгінің өлшемдері оқу реконструкциясына арналған.' },
  door: { name: 'Сықырлауық', meaning: 'Ағаш есік пен оның жақтауы керегенің екі шетіне бекітіледі.' },
  shanyraq: { name: 'Шаңырақ', meaning: 'Уықтың қаламдығы кіретін көздері бар төбе шеңбері. Күлдіреуіштер түндікті ұстайды.' },
  bakan: { name: 'Бақан', meaning: 'Шаңырақты уақытша көтеріп ұстауға арналған ашалы тірек. Ол киіз үйдің тұрақты орталық бағаны емес.' },
  uyk: { name: 'Уық', meaning: 'Иілген ағаштар кереге басын шаңырақпен жалғайды. Кереге тұсындағы иіні мен шаңыраққа кіретін ұшы көрсетілген.' },
  kiiz: { name: 'Киіз жабын', meaning: 'Туырлық қабырғаны, үзік төбені жабады. Түндік шаңырақтың үстіне тартылады. Оқу үшін кейбір жабындар ашық көрсетілген.' },
  community: { name: 'Бірлескен еңбек', meaning: 'Асар — қауымның бір-біріне ерікті түрде көмектесуі. Кейіпкерлердің киімі мен қозғалысы суретші және этнограф тексеруін қажет етеді.' },
};
export const SCENE_ASSETS: Record<string, SceneAsset> = {
  'ar-asar': { url: '/models/asar.glb', title: 'Асар', duration: 16,
    stageLabels: ['Керегені құру', 'Шаңырақты көтеру', 'Уықтарды бекіту', 'Киізбен жабу'], hotspots: yurtHotspots },
  'ar-nauryz': { url: '/models/nauryz.glb', title: 'Наурыз', duration: 0, stageLabels: [], hotspots: { ...yurtHotspots,
    dastarkhan: { name: 'Дастарқан', meaning: 'Мерекелік ортақ дастарқан қонақжайлық пен бірлікті білдіреді. Ашық киіз үй оқу мақсатында ішкі көріністі көрсетеді.' },
    baursak: { name: 'Астау мен бауырсақ', meaning: 'Ойылған ағаш астау мен майға пісірілген бауырсақ. Тағам пішіндері өңір мен отбасыға қарай өзгереді.' },
    kozhe: { name: 'Наурыз көже', meaning: 'Наурыз көженің жеті дәмі туралы дәстүр бар. Нақты құрамы өңір мен отбасыға қарай өзгереді; жеті тостаған жеті міндетті рецептті білдірмейді.' },
    vessels: { name: 'Дәстүрлі ыдыстар', meaning: 'Ағаш тостаған, тері ыдыс және самаурын. Үлгі бір тарихи кезеңнің нақты музей экспонаты ретінде ұсынылмайды.' },
  } },
  'ar-tusaukeser': { url: '/models/tusaukeser.glb', title: 'Тұсаукесер', duration: 12,
    stageLabels: ['Дайындық: ала жіп', 'Тұсауды кесу', 'Алғашқы қадам'], hotspots: {
      'ala-zhip': { name: 'Ала жіп', meaning: 'Ақ пен қарадан есілген ала жіп адалдықты, «біреудің ала жібін аттамауды» білдіреді.' },
      scissors: { name: 'Тұсауды кесу', meaning: 'Рәсімде тұсау кесіліп, балаға ақ жол тіленеді. Қозғалыс — оқу анимациясы; балалармен іс жүзінде орындауға арналған нұсқаулық емес.' },
      community: { name: 'Бала мен жақындары', meaning: 'Алғашқы қадамдарды жақындары қолдайды. Тұсаукесердің орындалуы отбасылық және өңірлік дәстүрге қарай өзгереді.' },
    } },
};
export function getSceneAsset(id: string): SceneAsset {
  const asset = SCENE_ASSETS[id];
  if (!asset) throw new Error(`Белгісіз 3D сценарий: ${id}`);
  return asset;
}
export function disposeScene(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const skeletons = new Set<THREE.Skeleton>();
  root.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    if (object instanceof THREE.SkinnedMesh) skeletons.add(object.skeleton);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials.add(material);
      for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
    }
  });
  textures.forEach(t => { const source = t.source?.data; if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) source.close(); t.dispose(); });
  skeletons.forEach(s => s.dispose());
  materials.forEach(m => m.dispose()); geometries.forEach(g => g.dispose());
}
export async function loadScene(id: string, progress?: (percentage: number) => void): Promise<GLTF> {
  const result = await new GLTFLoader().loadAsync(getSceneAsset(id).url, event => {
    if (event.total) progress?.(Math.round(event.loaded / event.total * 100));
  });
  result.scene.traverse(object => {
    if (object instanceof THREE.Mesh) { object.castShadow = true; object.receiveShadow = true; }
  });
  return result;
}
export function getHotspots(root: THREE.Object3D, id: string): HotspotData[] {
  const definitions = getSceneAsset(id).hotspots;
  const found = new Map<string, HotspotData>();
  root.updateMatrixWorld(true);
  root.traverse(object => {
    const key = object.userData.hotspot as string | undefined;
    if (!key || !definitions[key] || found.has(key)) return;
    const box = new THREE.Box3().setFromObject(object);
    const position = box.isEmpty() ? object.getWorldPosition(new THREE.Vector3()) : box.getCenter(new THREE.Vector3());
    found.set(key, { id: key, ...definitions[key], position });
  });
  return [...found.values()];
}
export function selectHotspot(object: THREE.Object3D, hotspots: HotspotData[]): HotspotData | null {
  let current: THREE.Object3D | null = object;
  while (current) {
    const key = current.userData.hotspot;
    if (key) return hotspots.find(h => h.id === key) ?? null;
    current = current.parent;
  }
  return null;
}
