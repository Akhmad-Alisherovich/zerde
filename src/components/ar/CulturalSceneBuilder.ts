import * as THREE from 'three';
import { 
  createKazakhOrnamentTexture, 
  createWoodTexture, 
  createAlaZhipTexture, 
  createAqZholTexture,
  createFeltTexture,
  createBasqurTexture,
  createSteppeGroundTexture,
  createBaursakTexture
} from './textureUtils';
import { 
  createKazakhElderCharacter, 
  createKazakhYouthCharacter,
  createKazakhChildCharacter
} from './CharacterModelBuilder';

export interface HotspotData {
  id: string;
  name: string;
  meaning: string;
  position: THREE.Vector3;
}

/**
 * Creates an authentic curved Kazakh roof pole (Уық)
 * with the signature lower knee bend (иіні), smooth shaft (сабы),
 * tapered tip (қаламдығы), and base fastening ribbon (уықбау).
 */
function createCurvedUyk(
  startPos: THREE.Vector3, 
  endPos: THREE.Vector3, 
  woodMat: THREE.Material,
  cordMat: THREE.Material
): THREE.Group {
  const uykGroup = new THREE.Group();

  // Calculate curve control points:
  // 1. Base at kerege head notch
  // 2. Knee bend (иіні) curving upward-inward at ~40 degrees
  // 3. Straight shaft ascending to shanyraq socket
  // 4. Chamfered tip (қаламдығы)
  const dir = endPos.clone().sub(startPos);
  const kneePos = startPos.clone().add(
    new THREE.Vector3(dir.x * 0.15, 0.28, dir.z * 0.15)
  );

  const curve = new THREE.CatmullRomCurve3([
    startPos,
    kneePos,
    startPos.clone().lerp(endPos, 0.6),
    endPos
  ]);

  // Smooth tapered tube geometry along curve
  const tubeGeo = new THREE.TubeGeometry(curve, 16, 0.022, 8, false);
  const tubeMesh = new THREE.Mesh(tubeGeo, woodMat);
  tubeMesh.castShadow = true;
  uykGroup.add(tubeMesh);

  // Fastening cord at base (Уықбау) tightly binding uyk to kerege head
  const cordGeo = new THREE.TorusGeometry(0.038, 0.012, 6, 16);
  const cordMesh = new THREE.Mesh(cordGeo, cordMat);
  cordMesh.position.copy(startPos);
  cordMesh.rotation.x = Math.PI / 2;
  uykGroup.add(cordMesh);

  return uykGroup;
}

/**
 * Builds Scene 1: Наурыз мерекелік дастарханы (Museum Standard)
 */
export function buildNauryzScene(rootGroup: THREE.Group): HotspotData[] {
  while (rootGroup.children.length > 0) {
    rootGroup.remove(rootGroup.children[0]);
  }

  const hotspots: HotspotData[] = [];

  // Textures
  const carpetTex = createKazakhOrnamentTexture('#8B1E0F', '#D49A35', '#083B66');
  const woodTex = createWoodTexture(true);
  const lightWoodTex = createWoodTexture(false);
  const feltTex = createFeltTexture(true);
  const basqurTex = createBasqurTexture();
  const baursakTex = createBaursakTexture();

  // 1. Traditional Tekemet / Felt Rug Floor (Текемет)
  const floorGeo = new THREE.CylinderGeometry(2.6, 2.6, 0.05, 48);
  const floorMat = new THREE.MeshStandardMaterial({
    map: carpetTex,
    roughness: 0.85,
    metalness: 0.05
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.position.y = -0.025;
  floorMesh.receiveShadow = true;
  rootGroup.add(floorMesh);

  // 2. Yurt background curved wall with Basqur belt (Киіз үй керегесі, туырлық және басқұр)
  const wallGeo = new THREE.CylinderGeometry(2.5, 2.5, 1.8, 48, 1, true, -Math.PI * 0.75, Math.PI * 1.5);
  const wallMat = new THREE.MeshStandardMaterial({
    map: feltTex,
    roughness: 0.9,
    side: THREE.BackSide
  });
  const wallMesh = new THREE.Mesh(wallGeo, wallMat);
  wallMesh.position.y = 0.9;
  wallMesh.receiveShadow = true;
  rootGroup.add(wallMesh);

  // Decorative Basqur Belt wrapping the interior upper wall
  const basqurGeo = new THREE.CylinderGeometry(2.48, 2.48, 0.18, 48, 1, true, -Math.PI * 0.75, Math.PI * 1.5);
  const basqurMat = new THREE.MeshStandardMaterial({
    map: basqurTex,
    roughness: 0.75,
    side: THREE.BackSide
  });
  const basqurMesh = new THREE.Mesh(basqurGeo, basqurMat);
  basqurMesh.position.y = 1.68;
  rootGroup.add(basqurMesh);

  // Decorative Wall Tapestry (Тұскиіз) on the wall
  const tapestryGeo = new THREE.CylinderGeometry(2.46, 2.46, 1.0, 32, 1, true, -Math.PI * 0.45, Math.PI * 0.9);
  const tapestryMat = new THREE.MeshStandardMaterial({
    map: carpetTex,
    roughness: 0.8,
    side: THREE.BackSide
  });
  const tapestryMesh = new THREE.Mesh(tapestryGeo, tapestryMat);
  tapestryMesh.position.y = 1.0;
  rootGroup.add(tapestryMesh);

  // Ceiling curved struts (Уықтар) arching into center
  const domeMat = new THREE.MeshStandardMaterial({ color: '#8A4222', roughness: 0.55 });
  for (let i = 0; i < 22; i++) {
    const angle = -Math.PI * 0.75 + (i / 21) * Math.PI * 1.5;
    const start = new THREE.Vector3(Math.sin(angle) * 2.45, 1.8, Math.cos(angle) * 2.45);
    const end = new THREE.Vector3(Math.sin(angle) * 0.6, 2.4, Math.cos(angle) * 0.6);
    const uyk = createCurvedUyk(start, end, domeMat, new THREE.MeshBasicMaterial({ color: '#D49A35' }));
    rootGroup.add(uyk);
  }

  // Quilted Sitting Cushions (Құрақ көрпешелер) circularly placed around table
  const cushionMat1 = new THREE.MeshStandardMaterial({ color: '#8B1E0F', roughness: 0.75 });
  const cushionMat2 = new THREE.MeshStandardMaterial({ color: '#0F52BA', roughness: 0.75 });
  for (let c = 0; c < 6; c++) {
    const cAngle = (c / 6) * Math.PI * 2;
    // Skip direct front view for camera clarity
    if (c === 4 || c === 5) continue;
    const cushion = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.35, 0.08, 16),
      c % 2 === 0 ? cushionMat1 : cushionMat2
    );
    cushion.position.set(Math.cos(cAngle) * 1.6, 0.04, Math.sin(cAngle) * 1.6);
    cushion.receiveShadow = true;
    rootGroup.add(cushion);
  }

  // 3. Festive Low Round Dastarkhan Table (Дөңгелек оюлы үстел)
  const tableGroup = new THREE.Group();
  tableGroup.name = 'dastarkhan-table';
  const tableTopGeo = new THREE.CylinderGeometry(1.12, 1.12, 0.08, 48);
  const tableMat = new THREE.MeshStandardMaterial({
    map: woodTex,
    roughness: 0.35,
    metalness: 0.12
  });
  const tableTop = new THREE.Mesh(tableTopGeo, tableMat);
  tableTop.position.y = 0.36;
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  tableGroup.add(tableTop);

  // Inlaid Brass Ornamental Rim
  const rimGeo = new THREE.TorusGeometry(1.12, 0.022, 8, 48);
  const rimMat = new THREE.MeshStandardMaterial({ color: '#D49A35', metalness: 0.88, roughness: 0.22 });
  const tableRim = new THREE.Mesh(rimGeo, rimMat);
  tableRim.rotation.x = Math.PI / 2;
  tableRim.position.y = 0.36;
  tableGroup.add(tableRim);

  // 4 Carved Table Legs (Оюлы аяқтар)
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2 + Math.PI / 4;
    const legGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.36, 14);
    const leg = new THREE.Mesh(legGeo, tableMat);
    leg.position.set(Math.cos(angle) * 0.78, 0.18, Math.sin(angle) * 0.78);
    leg.castShadow = true;
    tableGroup.add(leg);
  }
  rootGroup.add(tableGroup);

  // 4. Center Carved Platter with Baursaks (Астау және Бауырсақтар)
  const astauGroup = new THREE.Group();
  astauGroup.name = 'astau-baursak';
  // Oblong boat-shaped birch astau
  const astauGeo = new THREE.CylinderGeometry(0.38, 0.26, 0.08, 32);
  const astauMat = new THREE.MeshStandardMaterial({
    map: lightWoodTex,
    roughness: 0.45
  });
  const astauMesh = new THREE.Mesh(astauGeo, astauMat);
  astauMesh.scale.set(1.4, 1.0, 0.85); // Oblong oval astau
  astauMesh.position.y = 0.44;
  astauMesh.castShadow = true;
  astauGroup.add(astauMesh);

  // Astau handles on ends (Тұтқалары)
  const handleL = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.016, 6, 16), astauMat);
  handleL.position.set(-0.55, 0.45, 0);
  handleL.rotation.y = Math.PI / 2;
  astauGroup.add(handleL);

  const handleR = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.016, 6, 16), astauMat);
  handleR.position.set(0.55, 0.45, 0);
  handleR.rotation.y = Math.PI / 2;
  astauGroup.add(handleR);

  // 24+ Golden Puffed Baursaks piled inside Astau
  const baursakMat = new THREE.MeshStandardMaterial({
    map: baursakTex,
    roughness: 0.45,
    metalness: 0.05
  });

  const baursakPositions = [
    // Layer 1
    [-0.25, 0.47, 0.0], [0.25, 0.47, 0.0], [0.0, 0.47, 0.1], [0.0, 0.47, -0.1],
    [-0.15, 0.47, 0.1], [0.15, 0.47, 0.1], [-0.15, 0.47, -0.1], [0.15, 0.47, -0.1],
    [-0.32, 0.47, 0.05], [0.32, 0.47, -0.05],
    // Layer 2
    [-0.1, 0.52, 0.0], [0.1, 0.52, 0.0], [0.0, 0.52, 0.05], [0.0, 0.52, -0.05],
    [-0.2, 0.52, 0.05], [0.2, 0.52, -0.05],
    // Top pyramid
    [0.0, 0.56, 0.0], [-0.07, 0.56, 0.03], [0.07, 0.56, -0.03]
  ];

  baursakPositions.forEach(([bx, by, bz]) => {
    // Randomized organic pill/rhomboid shape for baursak
    const bMesh = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 8), baursakMat);
    bMesh.scale.set(1.2 + Math.random() * 0.2, 0.8 + Math.random() * 0.2, 1.1 + Math.random() * 0.2);
    bMesh.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5);
    bMesh.position.set(bx, by, bz);
    bMesh.castShadow = true;
    astauGroup.add(bMesh);
  });
  rootGroup.add(astauGroup);

  // 5. Bowls of Nauryz Kozhe (Наурыз көже құйылған тостағандар)
  const bowlGeo = new THREE.CylinderGeometry(0.125, 0.065, 0.1, 24);
  const bowlMat = new THREE.MeshStandardMaterial({
    map: lightWoodTex,
    roughness: 0.35,
    metalness: 0.08
  });
  const kozheMat = new THREE.MeshStandardMaterial({
    color: '#E8DEC8', // Creamy ayrán broth with barley grains
    roughness: 0.45
  });

  const bowlAngles = [-Math.PI * 0.6, -Math.PI * 0.2, Math.PI * 0.2, Math.PI * 0.6];
  bowlAngles.forEach((bAng, idx) => {
    const bowlGroup = new THREE.Group();
    bowlGroup.name = `kozhe-bowl-${idx + 1}`;
    const bx = Math.cos(bAng) * 0.72;
    const bz = Math.sin(bAng) * 0.72;

    const bowl = new THREE.Mesh(bowlGeo, bowlMat);
    bowl.position.set(bx, 0.45, bz);
    bowl.castShadow = true;
    bowlGroup.add(bowl);

    // Kozhe liquid surface inside bowl
    const liquid = new THREE.Mesh(new THREE.CircleGeometry(0.115, 20), kozheMat);
    liquid.rotation.x = -Math.PI / 2;
    liquid.position.set(bx, 0.495, bz);
    bowlGroup.add(liquid);

    // Carved wooden spoon beside bowl (Оюлы ағаш қасық)
    const spoon = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.01, 0.16), bowlMat);
    spoon.position.set(bx + 0.14, 0.405, bz);
    spoon.rotation.y = bAng + 0.5;
    bowlGroup.add(spoon);

    rootGroup.add(bowlGroup);
  });

  // 6. Leather Kumis Flask (Торсық) on table
  const torsyqGroup = new THREE.Group();
  torsyqGroup.name = 'torsyq-leather';
  const torsyqMat = new THREE.MeshStandardMaterial({
    color: '#3B1E0E',
    roughness: 0.45,
    metalness: 0.1
  });

  // Torso / Belly of torsyq
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), torsyqMat);
  belly.scale.set(0.9, 1.2, 0.6);
  belly.position.set(-0.72, 0.52, 0.2);
  torsyqGroup.add(belly);

  // Twin curved horns (Мүйіздері)
  const hornL = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.022, 8, 16, Math.PI), torsyqMat);
  hornL.position.set(-0.8, 0.6, 0.2);
  hornL.rotation.z = Math.PI / 4;
  torsyqGroup.add(hornL);

  const hornR = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.022, 8, 16, Math.PI), torsyqMat);
  hornR.position.set(-0.64, 0.6, 0.2);
  hornR.rotation.z = -Math.PI / 4;
  torsyqGroup.add(hornR);

  // Silver stopper
  const stopper = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.04, 10), rimMat);
  stopper.position.set(-0.72, 0.68, 0.2);
  torsyqGroup.add(stopper);

  rootGroup.add(torsyqGroup);

  // 7. Traditional Brass Samovar (Жез самаурын)
  const samovarGroup = new THREE.Group();
  samovarGroup.name = 'brass-samovar';
  const brassMat = new THREE.MeshStandardMaterial({
    color: '#D4AF37',
    metalness: 0.92,
    roughness: 0.18
  });

  // Base
  const sBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.06, 20), brassMat);
  sBase.position.set(0.68, 0.43, -0.2);
  samovarGroup.add(sBase);

  // Body urn
  const sBody = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 20), brassMat);
  sBody.scale.set(1.0, 1.3, 1.0);
  sBody.position.set(0.68, 0.6, -0.2);
  sBody.castShadow = true;
  samovarGroup.add(sBody);

  // Chimney & Crown
  const sChimney = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.18, 16), brassMat);
  sChimney.position.set(0.68, 0.85, -0.2);
  samovarGroup.add(sChimney);

  // Teapot on top (Шәйнек)
  const teapot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), new THREE.MeshStandardMaterial({ color: '#A82518', roughness: 0.3 }));
  teapot.position.set(0.68, 0.98, -0.2);
  samovarGroup.add(teapot);

  // Spigot & Handles
  const spigot = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08, 8), brassMat);
  spigot.rotation.x = Math.PI / 2;
  spigot.position.set(0.68, 0.52, -0.06);
  samovarGroup.add(spigot);

  rootGroup.add(samovarGroup);

  // Hotspots
  hotspots.push({
    id: 'nauryz-kozhe',
    name: 'Наурыз көже (7 қасиетті дәм)',
    meaning: 'Жеті түрлі табиғи тағамнан (су, ет, тұз, май, ұн, дәнді дақыл, сүт/айран) жасалған киелі ас. Өмірдің 7 бастауын, молшылық пен бірлікті білдіреді.',
    position: new THREE.Vector3(Math.cos(bowlAngles[0]) * 0.72, 0.6, Math.sin(bowlAngles[0]) * 0.72)
  });

  hotspots.push({
    id: 'astau-baursak',
    name: 'Астау мен Бауырсақ (Береке нышаны)',
    meaning: 'Тұтас қайың ағашынан ойылған дәстүрлі астау және алтын күндей дөңгеленген ыстық бауырсақтар – қазақ пейілінің кеңдігі мен дархан дастарханы.',
    position: new THREE.Vector3(0, 0.65, 0)
  });

  hotspots.push({
    id: 'torsyq-leather',
    name: 'Торсық (Қымыз құятын былғары ыдыс)',
    meaning: 'Жылқы немесе түйе терісінен оюланып тігілген, қымызды салқын әрі бабында сақтайтын көшпелілердің экологиялық таза ыдысы.',
    position: new THREE.Vector3(-0.72, 0.75, 0.2)
  });

  hotspots.push({
    id: 'brass-samovar',
    name: 'Жез самаурын (Ыстық ықылас пен шай дәстүрі)',
    meaning: 'Қазақ дастарханындағы шай рәсімі – қонақжайлылықтың, сұхбат пен ақжарқын көңілдің ажырамас белгісі.',
    position: new THREE.Vector3(0.68, 0.9, -0.2)
  });

  hotspots.push({
    id: 'tekemet-floor',
    name: 'Текемет (Оюлы киіз кілем)',
    meaning: 'Қой жүнінен басылып, үстіне «қошқар мүйіз» оюлары салынған көне ұлттық кілем. Жылулық пен сұлулықтың үйлесімі.',
    position: new THREE.Vector3(1.2, 0.1, 1.2)
  });

  return hotspots;
}

/**
 * Builds Scene 2: Тұсаукесер — алғашқы қадам (Museum Standard)
 * stage:
 *   1 = Дайындық (Ала жіп байлау)
 *   2 = Тұсауды кесу (Ала жіпті күміс қайшымен кесу сәті)
 *   3 = Алғашқы қадам (Ақ жолмен жүру және таңдау заттары)
 */
export function buildTusaukeserScene(rootGroup: THREE.Group, stage = 1): HotspotData[] {
  while (rootGroup.children.length > 0) {
    rootGroup.remove(rootGroup.children[0]);
  }

  const hotspots: HotspotData[] = [];

  // Textures
  const alaZhipTex = createAlaZhipTexture();
  const aqZholTex = createAqZholTexture();
  const carpetTex = createKazakhOrnamentTexture('#8B1E0F', '#D49A35', '#083B66');

  // 1. Base Steppe Carpet (Текемет)
  const floorGeo = new THREE.CylinderGeometry(2.6, 2.6, 0.05, 36);
  const floorMat = new THREE.MeshStandardMaterial({
    map: carpetTex,
    roughness: 0.85
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -0.025;
  floor.receiveShadow = true;
  rootGroup.add(floor);

  // 2. White Felt Runner (Ақ жол)
  const runnerGeo = new THREE.PlaneGeometry(0.85, 3.2);
  const runnerMat = new THREE.MeshStandardMaterial({
    map: aqZholTex,
    roughness: 0.75
  });
  const runner = new THREE.Mesh(runnerGeo, runnerMat);
  runner.rotation.x = -Math.PI / 2;
  runner.position.set(0, 0.005, 0.35);
  runner.receiveShadow = true;
  rootGroup.add(runner);

  // Scattered sweets & silver coins for "Шашу"
  const candyMat1 = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.3 });
  const candyMat2 = new THREE.MeshStandardMaterial({ color: '#D4AF37', metalness: 0.85, roughness: 0.2 });
  for (let s = 0; s < 25; s++) {
    const sx = (Math.random() - 0.5) * 0.7;
    const sz = -0.3 + Math.random() * 2.2;
    const candy = new THREE.Mesh(
      new THREE.SphereGeometry(0.016, 6, 6),
      s % 2 === 0 ? candyMat1 : candyMat2
    );
    candy.position.set(sx, 0.015, sz);
    rootGroup.add(candy);
  }

  // 3. Authentic Kazakh Toddler Figure (1 жасар бала)
  const childGroup = createKazakhChildCharacter(stage);
  const childZ = stage === 3 ? 0.65 : -0.2;
  childGroup.position.set(0, 0, childZ);
  rootGroup.add(childGroup);

  // 4. Honored Elder / Cutter (Тұсау кесуші қария)
  if (stage <= 2) {
    // Stooping or kneeling beside the child
    const cutterGroup = new THREE.Group();
    cutterGroup.name = 'elder-cutter';
    cutterGroup.position.set(0.48, 0, -0.2);
    cutterGroup.rotation.y = -Math.PI * 0.65;

    const elder = createKazakhElderCharacter();
    elder.scale.set(0.9, 0.9, 0.9);
    cutterGroup.add(elder);
    rootGroup.add(cutterGroup);
  } else {
    // Stage 3: Elder standing proudly at the side, clapping & blessing
    const blesserGroup = new THREE.Group();
    blesserGroup.name = 'elder-blesser';
    blesserGroup.position.set(0.75, 0, 0.2);
    blesserGroup.rotation.y = -Math.PI * 0.5;

    const elder = createKazakhElderCharacter();
    blesserGroup.add(elder);
    rootGroup.add(blesserGroup);
  }

  // 5. Braided Black-and-White Wool Rope (Ала жіп — 3D Double Strand)
  const zhipMat = new THREE.MeshStandardMaterial({
    map: alaZhipTex,
    roughness: 0.82
  });

  if (stage === 1) {
    // Tied in figure-eight knot around child's ankles
    const tieTorus = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.024, 10, 32), zhipMat);
    tieTorus.name = 'ala-zhip';
    tieTorus.position.set(0, 0.08, -0.2);
    tieTorus.rotation.x = Math.PI / 2;
    tieTorus.castShadow = true;
    rootGroup.add(tieTorus);

    // Dangling tasselled rope ends
    const tasselL = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.15, 8), zhipMat);
    tasselL.position.set(-0.06, 0.04, -0.08);
    tasselL.rotation.x = 0.4;
    rootGroup.add(tasselL);

    const tasselR = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.15, 8), zhipMat);
    tasselR.position.set(0.06, 0.04, -0.08);
    tasselR.rotation.x = 0.4;
    rootGroup.add(tasselR);
  } else if (stage === 2) {
    // Cut in the middle with frayed curly fiber ends
    const leftCut = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.16, 8), zhipMat);
    leftCut.position.set(-0.1, 0.06, -0.2);
    leftCut.rotation.z = 0.45;
    rootGroup.add(leftCut);

    const rightCut = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.16, 8), zhipMat);
    rightCut.position.set(0.1, 0.06, -0.2);
    rightCut.rotation.z = -0.45;
    rootGroup.add(rightCut);
  } else {
    // Fallen to the side as child walks ahead
    const fallen1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.28, 8), zhipMat);
    fallen1.position.set(-0.3, 0.015, -0.15);
    fallen1.rotation.y = 0.8;
    rootGroup.add(fallen1);

    const fallen2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.28, 8), zhipMat);
    fallen2.position.set(0.3, 0.015, -0.15);
    fallen2.rotation.y = -0.7;
    rootGroup.add(fallen2);
  }

  // 6. Ceremonial Silver Scissors (Күміс қайшы) & Silver Tray
  const trayMat = new THREE.MeshStandardMaterial({ color: '#E8E8E8', metalness: 0.92, roughness: 0.18 });
  const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 0.025, 24), trayMat);
  tray.position.set(0.48, 0.015, -0.2);
  tray.receiveShadow = true;
  rootGroup.add(tray);

  const scissorMat = new THREE.MeshStandardMaterial({ color: '#DCDCDC', metalness: 0.95, roughness: 0.12 });
  const blade1 = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.006, 0.15), scissorMat);
  const blade2 = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.006, 0.15), scissorMat);

  if (stage === 2) {
    // Active cutting position at the child's feet
    blade1.position.set(0.02, 0.08, -0.18);
    blade1.rotation.y = 0.35;
    blade2.position.set(-0.02, 0.08, -0.18);
    blade2.rotation.y = -0.35;
    rootGroup.add(blade1);
    rootGroup.add(blade2);
  } else {
    // Resting on silver tray
    blade1.position.set(0.48, 0.035, -0.2);
    blade1.rotation.y = 0.2;
    blade2.position.set(0.48, 0.035, -0.2);
    blade2.rotation.y = -0.2;
    rootGroup.add(blade1);
    rootGroup.add(blade2);
  }

  // 7. Choice Objects at end of runner: Book, Dombyra, Kamshy (Кітап, Домбыра, Қамшы)
  const choiceGroup = new THREE.Group();
  choiceGroup.name = 'choice-objects';
  choiceGroup.position.set(0, 0, 1.55);

  // Low carved tray table
  const choiceTable = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.04, 0.4),
    new THREE.MeshStandardMaterial({ color: '#4A2111', roughness: 0.4 })
  );
  choiceTable.position.y = 0.02;
  choiceGroup.add(choiceTable);

  // Book (Кітап — Білім мен ғылым жолы)
  const book = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.05, 0.28),
    new THREE.MeshStandardMaterial({ color: '#122F5D', roughness: 0.5 })
  );
  book.position.set(-0.3, 0.05, 0);
  choiceGroup.add(book);

  // Gold page edges
  const pages = new THREE.Mesh(
    new THREE.BoxGeometry(0.21, 0.04, 0.27),
    new THREE.MeshStandardMaterial({ color: '#D4AF37', metalness: 0.8, roughness: 0.3 })
  );
  pages.position.set(-0.3, 0.05, 0);
  choiceGroup.add(pages);

  // Dombyra (Домбыра — Өнер мен мәдениет)
  const dombyraBody = new THREE.Mesh(
    new THREE.ConeGeometry(0.09, 0.28, 16),
    new THREE.MeshStandardMaterial({ color: '#8A4222', roughness: 0.4 })
  );
  dombyraBody.rotation.x = Math.PI / 2;
  dombyraBody.position.set(0, 0.05, -0.05);
  choiceGroup.add(dombyraBody);

  const dombyraNeck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.016, 0.016, 0.32, 8),
    new THREE.MeshStandardMaterial({ color: '#5C2D16', roughness: 0.4 })
  );
  dombyraNeck.rotation.x = Math.PI / 2;
  dombyraNeck.position.set(0, 0.05, 0.22);
  choiceGroup.add(dombyraNeck);

  // Kamshy (Қамшы — Батырлық пен көшбасшылық)
  const whipHandle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.022, 0.26, 8),
    new THREE.MeshStandardMaterial({ color: '#2B1207', roughness: 0.35 })
  );
  whipHandle.rotation.z = Math.PI / 2;
  whipHandle.position.set(0.3, 0.05, 0);
  choiceGroup.add(whipHandle);

  const whipLash = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.008, 0.18, 8),
    new THREE.MeshStandardMaterial({ color: '#140D0B', roughness: 0.5 })
  );
  whipLash.rotation.x = Math.PI / 3;
  whipLash.position.set(0.3, 0.04, 0.1);
  choiceGroup.add(whipLash);

  rootGroup.add(choiceGroup);

  // Hotspots
  hotspots.push({
    id: 'ala-zhip',
    name: 'Ала жіп (Адалдық пен әділдік ұстанымы)',
    meaning: 'Ақ пен қара жүннен өрілген ала жіп – «ешкімнің ала жібін аттамасын, өмірде адал, әділ болсын» деген терең тәрбиелік өсиетті білдіреді.',
    position: new THREE.Vector3(0, 0.25, -0.2)
  });

  hotspots.push({
    id: 'aq-zhol',
    name: 'Ақ жол (Жарқын болашаққа бағыт)',
    meaning: 'Баланың алдына төселген ақ мата немесе ақ киіз – өмір жолы ашық, кіршіксіз таза, бақытты болсын деген ізгі тілек.',
    position: new THREE.Vector3(0, 0.12, 0.7)
  });

  hotspots.push({
    id: 'choice-objects',
    name: 'Таңдау заттары (Кітап, Домбыра, Қамшы)',
    meaning: 'Бала таңдаған бұйымға қарап (кітап – ғылым мен білім, домбыра – өнер, қамшы – қайрат пен ел қорғау), оның болашақ бейімін болжаған.',
    position: new THREE.Vector3(0, 0.25, 1.55)
  });

  return hotspots;
}

/**
 * Builds Scene 3: Асар — бірлескен еңбек (Museum-Quality Kazakh Yurt Reconstruction)
 * stage:
 *   1 = Керегені жаю және құру (Lattice walls assembled in circle, doorframe set, shanyraq on ground)
 *   2 = Шаңырақты көтеру (Elder raises shanyraq high with Bakan pole; Youth stabilizes with 4 cardinal uyks)
 *   3 = Уықтарды бекіту (Full radial structure of curved uyks slotted and tied; youths active)
 *   4 = Киізбен жабу (Felt coverings tuwyrlyq, uzik, tundik & basqur belts installed)
 */
export function buildAsarScene(rootGroup: THREE.Group, stage = 3): HotspotData[] {
  while (rootGroup.children.length > 0) {
    rootGroup.remove(rootGroup.children[0]);
  }

  const hotspots: HotspotData[] = [];

  // PBR Materials
  const woodMat = new THREE.MeshStandardMaterial({
    map: createWoodTexture(false),
    roughness: 0.55,
    metalness: 0.08
  });
  const darkWoodMat = new THREE.MeshStandardMaterial({
    map: createWoodTexture(true),
    roughness: 0.5,
    metalness: 0.12
  });
  const shanyraqMat = new THREE.MeshStandardMaterial({
    color: '#9C431A',
    roughness: 0.45,
    metalness: 0.15
  });
  const feltWallMat = new THREE.MeshStandardMaterial({
    map: createFeltTexture(true),
    roughness: 0.92,
    side: THREE.DoubleSide
  });
  const feltRoofMat = new THREE.MeshStandardMaterial({
    map: createFeltTexture(false),
    roughness: 0.92,
    side: THREE.DoubleSide
  });
  const basqurMat = new THREE.MeshStandardMaterial({
    map: createBasqurTexture(),
    roughness: 0.75
  });
  const cordMat = new THREE.MeshStandardMaterial({
    color: '#D49A35',
    roughness: 0.7
  });
  const steppeMat = new THREE.MeshStandardMaterial({
    map: createSteppeGroundTexture(),
    roughness: 0.95
  });

  // 1. Vast Steppe Grassland Ground (Сарыарқа кең даласы)
  const groundGeo = new THREE.CylinderGeometry(3.4, 3.4, 0.06, 48);
  const ground = new THREE.Mesh(groundGeo, steppeMat);
  ground.position.y = -0.03;
  ground.receiveShadow = true;
  rootGroup.add(ground);

  // 2. Кереге (Authentic Diamond Lattice Walls - 6 қанат торкөз қабырға)
  const keregeGroup = new THREE.Group();
  keregeGroup.name = 'kerege-structure';
  const wallRadius = 1.78;
  const keregeHeight = 1.15;
  const totalSlats = 44; // Dense authentic crisscross lattice

  // Rawhide tie rivet material (Түйенің көгі)
  const rawhideMat = new THREE.MeshStandardMaterial({ color: '#2B1A0E', roughness: 0.8 });

  for (let s = 0; s < totalSlats; s++) {
    // Leave front opening for carved wooden doorframe (Сықырлауық орны)
    if (s >= 19 && s <= 24) continue;

    const angle = (s / totalSlats) * Math.PI * 2;
    const wx = Math.cos(angle) * wallRadius;
    const wz = Math.sin(angle) * wallRadius;

    // Positive tilt willow slat (+45°)
    const slat1 = new THREE.Mesh(new THREE.BoxGeometry(0.024, keregeHeight * 1.1, 0.015), woodMat);
    slat1.position.set(wx, keregeHeight / 2, wz);
    slat1.rotation.y = angle;
    slat1.rotation.z = 0.32;
    slat1.castShadow = true;
    keregeGroup.add(slat1);

    // Negative tilt willow slat crossing over (-45°)
    const slat2 = new THREE.Mesh(new THREE.BoxGeometry(0.024, keregeHeight * 1.1, 0.015), woodMat);
    slat2.position.set(wx, keregeHeight / 2, wz);
    slat2.rotation.y = angle;
    slat2.rotation.z = -0.32;
    slat2.castShadow = true;
    keregeGroup.add(slat2);

    // Rawhide rivet pin (Көк) at intersection
    const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), rawhideMat);
    rivet.position.set(wx, keregeHeight / 2, wz);
    keregeGroup.add(rivet);

    // Kerege head notch (Керегенің басы / құлағы) where uyk knee rests
    const headNotch = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.035, 0.028), darkWoodMat);
    headNotch.position.set(wx, keregeHeight, wz);
    keregeGroup.add(headNotch);
  }

  // Traditional Carved Doorframe (Сықырлауық / Маңдайша / Босаға)
  const doorGroup = new THREE.Group();
  doorGroup.name = 'doorframe-sykyrlauyq';
  const doorPostHeight = keregeHeight + 0.18;

  // Left Post (Сол босаға)
  const postL = new THREE.Mesh(new THREE.BoxGeometry(0.1, doorPostHeight, 0.1), darkWoodMat);
  postL.position.set(-0.42, doorPostHeight / 2, -wallRadius);
  doorGroup.add(postL);

  // Right Post (Оң босаға)
  const postR = new THREE.Mesh(new THREE.BoxGeometry(0.1, doorPostHeight, 0.1), darkWoodMat);
  postR.position.set(0.42, doorPostHeight / 2, -wallRadius);
  doorGroup.add(postR);

  // Carved Lintel (Маңдайша)
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.12, 0.1), darkWoodMat);
  lintel.position.set(0, keregeHeight + 0.12, -wallRadius);
  doorGroup.add(lintel);

  // Carved Horn Ornament on Lintel
  const lintelOrnament = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.022, 6, 16, Math.PI), cordMat);
  lintelOrnament.position.set(0, keregeHeight + 0.18, -wallRadius + 0.02);
  lintelOrnament.rotation.z = Math.PI;
  doorGroup.add(lintelOrnament);

  // Threshold (Табалдырық)
  const threshold = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.08, 0.1), darkWoodMat);
  threshold.position.set(0, 0.04, -wallRadius);
  doorGroup.add(threshold);

  // Two Carved Wooden Door Leaves (Екі жармалы есік)
  const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.38, keregeHeight + 0.02, 0.035), woodMat);
  doorL.position.set(-0.2, (keregeHeight + 0.02) / 2 + 0.04, -wallRadius + 0.02);
  doorGroup.add(doorL);

  const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.38, keregeHeight + 0.02, 0.035), woodMat);
  doorR.position.set(0.2, (keregeHeight + 0.02) / 2 + 0.04, -wallRadius + 0.02);
  doorGroup.add(doorR);

  keregeGroup.add(doorGroup);
  rootGroup.add(keregeGroup);

  // 3. Шаңырақ (Crown Ring - Ұлыстың киесі)
  const shanyraqGroup = new THREE.Group();
  shanyraqGroup.name = 'shanyraq-crown';
  const shanyraqHeight = stage === 1 ? 0.22 : 2.35;

  // Thick steam-bent birch rim (Тоғын)
  const rimGeo = new THREE.TorusGeometry(0.52, 0.05, 16, 48);
  const shanyraqRim = new THREE.Mesh(rimGeo, shanyraqMat);
  shanyraqRim.rotation.x = Math.PI / 2;
  shanyraqRim.castShadow = true;
  shanyraqGroup.add(shanyraqRim);

  // Dome Arched Crossbars (Күлдіреуіштер — күмбез пішінді имектер)
  for (let k = -3; k <= 3; k++) {
    if (k === 0) continue;
    const offset = k * 0.12;
    const chordLen = Math.sqrt(Math.max(0.08, 0.52 * 0.52 - offset * offset)) * 2;

    // Upward bulging arched crossbar
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, chordLen, 8), shanyraqMat);
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, 0.035, offset);
    bar.castShadow = true;
    shanyraqGroup.add(bar);

    const crossBar = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, chordLen, 8), shanyraqMat);
    crossBar.rotation.x = Math.PI / 2;
    crossBar.position.set(offset, 0.035, 0);
    crossBar.castShadow = true;
    shanyraqGroup.add(crossBar);
  }

  // Sockets around outer rim for roof poles (Уық көздері — 32 ойық)
  for (let h = 0; h < 32; h++) {
    const holeAngle = (h / 32) * Math.PI * 2;
    const hole = new THREE.Mesh(
      new THREE.BoxGeometry(0.032, 0.026, 0.022),
      new THREE.MeshBasicMaterial({ color: '#2B1207' })
    );
    hole.position.set(Math.cos(holeAngle) * 0.55, 0, Math.sin(holeAngle) * 0.55);
    hole.rotation.y = -holeAngle;
    shanyraqGroup.add(hole);
  }

  shanyraqGroup.position.set(0, shanyraqHeight, stage === 1 ? 1.1 : 0);
  rootGroup.add(shanyraqGroup);

  // 4. Бақан (Lifting Support Pole - Ашалы бақан)
  // Present in stages 2 and 3 held by the Elder
  const bakanGroup = new THREE.Group();
  bakanGroup.name = 'bakan-pole';
  if (stage === 2 || stage === 3) {
    const bakanPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.048, 0.065, 2.38, 14),
      darkWoodMat
    );
    bakanPole.position.set(0.06, 1.19, 0.04);
    bakanPole.castShadow = true;
    bakanGroup.add(bakanPole);

    // Two-pronged wooden fork (Аша бақан) cradling the shanyraq rim
    const forkL = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.18, 8), darkWoodMat);
    forkL.position.set(0.02, 2.38, 0.1);
    forkL.rotation.x = 0.38;
    bakanGroup.add(forkL);

    const forkR = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.18, 8), darkWoodMat);
    forkR.position.set(0.1, 2.38, 0.02);
    forkR.rotation.z = -0.38;
    bakanGroup.add(forkR);

    rootGroup.add(bakanGroup);
  }

  // 5. Уықтар (Curved Radial Roof Poles)
  // Stage 2: 4 cardinal stabilizing poles (Төрт құбылалық уық)
  // Stage 3 & 4: Full array of 32 curved radial poles
  const uykGroup = new THREE.Group();
  uykGroup.name = 'uyk-poles';

  const uykCount = stage === 2 ? 4 : (stage >= 3 ? 32 : 0);
  for (let u = 0; u < uykCount; u++) {
    const uAngle = stage === 2 
      ? (u * Math.PI) / 2 + Math.PI / 4 
      : (u / 32) * Math.PI * 2;

    // Leave gap above door opening
    if (stage >= 3 && u >= 14 && u <= 18) continue;

    const sx = Math.cos(uAngle) * wallRadius;
    const sz = Math.sin(uAngle) * wallRadius;
    const ex = Math.cos(uAngle) * 0.52;
    const ez = Math.sin(uAngle) * 0.52;

    const start = new THREE.Vector3(sx, keregeHeight, sz);
    const end = new THREE.Vector3(ex, 2.35, ez);

    // Authentic curved uyk with knee bend and fastening cord
    const uyk = createCurvedUyk(start, end, woodMat, cordMat);
    uykGroup.add(uyk);
  }
  rootGroup.add(uykGroup);

  // 6. Киіз жабындар (Felt Coverings & Basqur Belts)
  // Exclusively in Stage 4
  if (stage === 4) {
    const feltGroup = new THREE.Group();
    feltGroup.name = 'kiiz-coverings';

    // Wall Felt (Туырлық) - Wrapping the kerege
    const tuwyrlyqGeo = new THREE.CylinderGeometry(wallRadius + 0.04, wallRadius + 0.04, keregeHeight, 48, 1, true, -Math.PI * 0.75, Math.PI * 1.5);
    const tuwyrlyq = new THREE.Mesh(tuwyrlyqGeo, feltWallMat);
    tuwyrlyq.position.y = keregeHeight / 2;
    tuwyrlyq.castShadow = true;
    tuwyrlyq.receiveShadow = true;
    feltGroup.add(tuwyrlyq);

    // Roof Felt (Үзік) - Sloping cone from kerege to shanyraq rim
    const uzikGeo = new THREE.CylinderGeometry(0.52, wallRadius + 0.05, 2.35 - keregeHeight, 48, 1, true, -Math.PI * 0.75, Math.PI * 1.5);
    const uzik = new THREE.Mesh(uzikGeo, feltRoofMat);
    uzik.position.y = keregeHeight + (2.35 - keregeHeight) / 2;
    uzik.castShadow = true;
    uzik.receiveShadow = true;
    feltGroup.add(uzik);

    // Broad Patterned Ribbon Belt (Басқұр) wrapping around the yurt waist
    const waistBeltGeo = new THREE.CylinderGeometry(wallRadius + 0.055, wallRadius + 0.055, 0.18, 48, 1, true, -Math.PI * 0.75, Math.PI * 1.5);
    const waistBelt = new THREE.Mesh(waistBeltGeo, basqurMat);
    waistBelt.position.y = keregeHeight;
    feltGroup.add(waistBelt);

    // Crown Felt Flap (Түндік) over shanyraq
    const tundikGeo = new THREE.BoxGeometry(0.9, 0.02, 0.9);
    const tundik = new THREE.Mesh(tundikGeo, feltRoofMat);
    tundik.position.set(0, 2.45, 0);
    feltGroup.add(tundik);

    rootGroup.add(feltGroup);
  }

  // 7. Authentic Kazakh Characters (Асаршылар)
  const charactersGroup = new THREE.Group();
  charactersGroup.name = 'asar-community';

  if (stage === 1) {
    // Stage 1: Two youths stretching and fastening the kerege sections
    const helper1 = createKazakhYouthCharacter('#A83A27');
    helper1.position.set(-wallRadius + 0.35, 0, 0.5);
    helper1.rotation.y = Math.PI / 3;
    charactersGroup.add(helper1);

    const helper2 = createKazakhYouthCharacter('#2B5A3E');
    helper2.position.set(wallRadius - 0.35, 0, 0.5);
    helper2.rotation.y = -Math.PI / 3;
    charactersGroup.add(helper2);
  } else if (stage === 2) {
    // Stage 2: Elder lifting shanyraq with bakan in center
    const elder = createKazakhElderCharacter();
    elder.position.set(0.12, 0, -0.08);
    charactersGroup.add(elder);

    // Youth bringing the first stabilizing uyk
    const youth = createKazakhYouthCharacter('#A83A27');
    youth.position.set(1.25, 0, 0.85);
    youth.rotation.y = -Math.PI / 4;
    charactersGroup.add(youth);
  } else if (stage === 3) {
    // Stage 3: Elder holding center bakan pole, two youths active with uyks
    const elder = createKazakhElderCharacter();
    elder.position.set(0.12, 0, -0.08);
    charactersGroup.add(elder);

    // Youth 1: hoisting and slotting an uyk upward
    const youth1 = createKazakhYouthCharacter('#A83A27');
    youth1.position.set(1.15, 0, 0.9);
    youth1.rotation.y = -Math.PI / 4;
    charactersGroup.add(youth1);

    // Youth 2: fastening uyk base to кереге
    const youth2 = createKazakhYouthCharacter('#2B5A3E');
    youth2.position.set(-1.15, 0, 0.75);
    youth2.rotation.y = Math.PI / 3;
    charactersGroup.add(youth2);
  } else {
    // Stage 4: Elder and youth admiring the completed yurt
    const elder = createKazakhElderCharacter();
    elder.position.set(1.2, 0, -wallRadius - 0.45);
    elder.rotation.y = Math.PI * 0.85;
    charactersGroup.add(elder);

    const youth = createKazakhYouthCharacter('#A83A27');
    youth.position.set(-1.2, 0, -wallRadius - 0.45);
    youth.rotation.y = -Math.PI * 0.85;
    charactersGroup.add(youth);
  }

  rootGroup.add(charactersGroup);

  // Hotspots for real 3D components
  hotspots.push({
    id: 'shanyraq-symbol',
    name: 'Шаңырақ (Отбасы мен ел бірлігі)',
    meaning: 'Киіз үйдің төбесіндегі дөңгелек тоғын мен күлдіреуіш – ұрпақтар сабақтастығы, шаңырақтың беріктігі мен бүкіл халықтың тыныштығының киелі нышаны.',
    position: new THREE.Vector3(0, shanyraqHeight + 0.1, 0)
  });

  hotspots.push({
    id: 'kerege-wall',
    name: 'Кереге (Торкөз қабырға — қоғам тірегі)',
    meaning: 'Талдан иіліп, түйенің көгімен көктелген жиналмалы тор қабырға. Бір-бірімен айқасқан сағанақтар бүкіл шаңырақ пен уықтарды ұстап тұратын берік іргетас.',
    position: new THREE.Vector3(wallRadius, keregeHeight * 0.6, 0)
  });

  if (stage === 2 || stage === 3) {
    hotspots.push({
      id: 'bakan-support',
      name: 'Бақанмен көтеру (Ауызбіршілік пен құрмет)',
      meaning: 'Ауыр шаңырақты жалғыз адам көтере алмайды. Оны ортаға қойылған мықты ашалы бақанмен ақсақал көтеріп, жастар жан-жағынан уық сұққанда ғана үй бой түзейді.',
      position: new THREE.Vector3(0.08, 1.45, 0.08)
    });
  }

  if (stage >= 3) {
    hotspots.push({
      id: 'uyk-poles',
      name: 'Уықтар (Байланыстырушы имек сырықтар)',
      meaning: 'Шаңырақ пен керегені жалғайтын имек сырықтар. Иіні кереге басына уықбаумен байланады, қаламдығы шаңырақ көзіне қадалады.',
      position: new THREE.Vector3(0.9, 1.8, 0.6)
    });
  }

  if (stage === 4) {
    hotspots.push({
      id: 'kiiz-coverings',
      name: 'Киіз жабындар (Туырлық, Үзік, Түндік)',
      meaning: 'Қой жүнінен басылған ақ киіз жабындар киіз үйді желден, суықтан және ыстықтан қорғайды. Басқұр белдеулері оны мызғымас етіп тартады.',
      position: new THREE.Vector3(0, 1.85, 1.3)
    });
  }

  hotspots.push({
    id: 'asar-people',
    name: 'Асаршылар (Ақысыз ерікті жәрдем)',
    meaning: 'Асар – ауыл адамдарының бір үйге қиын жұмысты (үй тігу, шөп шабу) ақысыз, өзара қолдау ниетімен бірлесіп бітіруі. «Бірлік түбі – береке» ұстанымы.',
    position: new THREE.Vector3(0.3, 1.1, 0.4)
  });

  return hotspots;
}
