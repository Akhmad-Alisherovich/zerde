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
  sourceUrl?: string;
  sourceTitle?: string;
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
const cutawayYurtHotspots = Object.fromEntries(
  Object.entries(yurtHotspots).filter(([key]) => key !== 'door' && key !== 'bakan'),
);
export const SCENE_ASSETS: Record<string, SceneAsset> = {
  'ar-besikke-salu': { url: '/models/besikke-salu.glb', title: 'Бесікке салу', duration: 12,
    sourceUrl: 'https://www.nmrk.kz/en/structure/scientific-activity/national-list/656/', sourceTitle: 'ҚР Ұлттық музейі',
    stageLabels: ['Бесікті жабдықтау', 'Сәбиді бөлеу', 'Отбасының ақ тілегі'], hotspots: {
      besik: { name: 'Бесік', meaning: 'Ағаш бесік — нәрестені бөлеуге арналған дәстүрлі орын. Бұл үлгінің өлшемі мен өрнегі нақты тарихи жәдігерден алынбаған.' },
      bedding: { name: 'Бесік төсеніштері', meaning: 'Сәбиді бөлеу алдында бесік жабдықталады. Мата мен қабаттардың осы орналасуы — авторлық оқу түсіндірмесі.' },
      arch: { name: 'Бесік доғасы', meaning: 'Бесіктің үстіңгі ағаш доғасы жабынды ұстауға арналған. Көрсетілген пішін белгілі бір музей бұйымының дәл көшірмесі емес.' },
      cover: { name: 'Жабынды', meaning: 'Жұқа мата сәбидің үстіне жабылады. Ою мен мата түрі өңірге және отбасына қарай өзгереді.' },
      swaddle: { name: 'Сәбидің орауы', meaning: 'Сәбиді бөлеу сахнадағы екінші кезеңде көрсетілген. Қозғалыс медициналық нұсқаулық ретінде қолданылмайды.' },
      community: { name: 'Отбасы мүшелері', meaning: 'Бесікке салу туыстар мен жақындарды жинайды; рәсімді сыйлы, тәжірибелі әйел жүргізетін нұсқалар сипатталған.' },
    } },
  'ar-betashar': { url: '/models/betashar.glb', title: 'Беташар', duration: 12,
    sourceUrl: 'https://ich.unesco.org/en/RL/betashar-traditional-wedding-ritual-01746', sourceTitle: 'UNESCO',
    stageLabels: ['Келінді қарсы алу', 'Ақын жыры мен сәлем', 'Бетті ашу'], hotspots: {
      dress: { name: 'Қалыңдық киімі', meaning: 'Қабатталған мерекелік киімнің оқу үлгісі. Өңірлік және тарихи пішіндері әртүрлі.' },
      headdress: { name: 'Бас киім', meaning: 'Салтанатты бас киімнің авторлық түсіндірмесі; нақты экспонат көшірмесі емес.' },
      veil: { name: 'Жабынды', meaning: 'UNESCO сипаттамасында келіннің беті жабылып, рәсім соңында ашылатыны көрсетілген.' },
      dombyra: { name: 'Домбыра', meaning: 'Ақын жыр айтуы мүмкін. Мұнда екі ішекті ағаш аспаптың оқу моделі берілген.' },
      community: { name: 'Туыстар', meaning: 'Беташар жаңа әулетпен таныстыруға және сыйластық білдіруге арналған.' },
    } },
  'ar-syrga-salu': { url: '/models/syrga-salu.glb', title: 'Сырға салу', duration: 12,
    sourceUrl: 'https://www.gov.kz/memleket/entities/digital-nauryz/press/news/details/1186602', sourceTitle: 'ҚР мемлекеттік материалы',
    stageLabels: ['Отбасылар кездесуі', 'Сырғаны ұсыну', 'Сырға тағу'], hotspots: {
      earrings: { name: 'Сырға', meaning: 'Құдалық келісімін білдіретін сый. Бұл металл пішіні авторлық, музей бұйымының көшірмесі емес.' },
      tray: { name: 'Ұсыну табағы', meaning: 'Сахнаны түсіндіру үшін қосылған ағаш ыдыс; рәсімнің міндетті белгісі ретінде ұсынылмайды.' },
      community: { name: 'Отбасы өкілдері', meaning: 'Сырға салуға жігіт жағы мен қыздың отбасы қатысатын нұсқа құжатталған.' },
    } },
  'ar-bata-beru': { url: '/models/bata-beru.glb', title: 'Бата беру', duration: 12,
    sourceUrl: 'https://www.gov.kz/memleket/entities/aktobe-til/press/news/details/867725', sourceTitle: 'ҚР мемлекеттік материалы',
    stageLabels: ['Жиналу', 'Ізгі тілек', 'Батаны аяқтау'], hotspots: {
      table: { name: 'Дастарқан', meaning: 'Отбасылық жиынның оқу кеңістігі. Бата әртүрлі жағдайда беріледі.' },
      community: { name: 'Бата беруші және тыңдаушылар', meaning: 'Бата сөзінің мазмұны мен орындалуы жағдайға қарай өзгереді. Авторлық үлгі тілек: «Ынтымақтарың артып, еңбектерің жемісті болсын!» Бұл сөз тарихи тұлғаға телінбейді.' },
    } },
  'ar-shashu': { url: '/models/shashu.glb', title: 'Шашу', duration: 12,
    sourceUrl: 'https://www.gov.kz/memleket/entities/mfa-prague/press/article/details/113244?lang=kk', sourceTitle: 'ҚР СІМ материалы',
    stageLabels: ['Тәттілерді дайындау', 'Шашу шашу', 'Қуанышқа ортақтасу'], hotspots: {
      container: { name: 'Тәтті ыдысы', meaning: 'Мерекеде шашылатын тәттілерге арналған ағаш ыдыс.' },
      sweets: { name: 'Шашу тәттілері', meaning: 'Шашу қуанышты бөлісуді білдіреді. Мұнда жеке 3D нысандар ұшады және жерге қонады.' },
      community: { name: 'Қарсы алушылар', meaning: 'Шашу үйлену және басқа қуаныш рәсімдерінде де кездеседі.' },
    } },
  'ar-qymyzmuryndyq': { url: '/models/qymyzmuryndyq.glb', title: 'Қымызмұрындық', duration: 12,
    sourceUrl: 'https://www.gov.kz/memleket/entities/vko-cultura-arhiv/press/news/details/1019876', sourceTitle: 'ШҚО музей-қорығы',
    stageLabels: ['Ыдыстарды әзірлеу', 'Қымыз құю', 'Дәм тату'], hotspots: {
      saba: { name: 'Саба үлгісі', meaning: 'Қымыз сақтайтын былғары ыдыс. Көрсетілген пішін мен тігіс белгілі бір экспонаттан көшірілмеген.' },
      bowls: { name: 'Ағаш тостағандар', meaning: 'Қымыз ұсынуға арналған шағын ағаш ыдыстардың оқу үлгісі.' },
      jug: { name: 'Құю ыдысы', meaning: 'Қымызды тостағанға ұсыну қозғалысын түсіндіретін ыдыс.' },
      qymyz: { name: 'Қымыз', meaning: 'Маусымның алғашқы қымызынан дәм тату дәстүрдің негізгі мазмұны.' },
      vessels: { name: 'Дастарқан', meaning: 'Қауымның жиналуын көрсететін шағын үстел; барлық жергілікті рәсімде бірдей болмайды.' },
      community: { name: 'Үй иесі мен қонақтар', meaning: 'Қымызмұрындықта жұрт алғашқы қымыздан дәм татып, бір-біріне тілек айтады.' },
    } },
  'ar-asar': { url: '/models/asar.glb', title: 'Асар', duration: 16,
    stageLabels: ['Керегені құру', 'Шаңырақты көтеру', 'Уықтарды бекіту', 'Киізбен жабу'], hotspots: yurtHotspots },
  'ar-nauryz': { url: '/models/nauryz.glb', title: 'Наурыз', duration: 0, stageLabels: [], hotspots: { ...cutawayYurtHotspots,
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
    if (object instanceof THREE.Mesh) {
      if (!object.geometry.boundingSphere) object.geometry.computeBoundingSphere();
      // Tiny embroidery, lashings and facial details add a full shadow draw
      // while changing no readable silhouette at the current scene scale.
      object.castShadow = (object.geometry.boundingSphere?.radius ?? 0) >= .09;
      object.receiveShadow = true;
    }
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
