import * as THREE from 'three';
import { 
  createChapanFabricTexture, 
  createFaceTexture 
} from './textureUtils';

/**
 * Creates an authentic sculpted human hand with distinct fingers (5 articulated fingers)
 * capable of physically gripping a pole (bakan / uyk) or holding scissors.
 */
function createArticulatedHand(
  skinMat: THREE.Material, 
  isGraspingPole = true, 
  isLeft = false
): THREE.Group {
  const hand = new THREE.Group();
  const sign = isLeft ? -1 : 1;

  // 1. Palm / Metacarpal base
  const palmGeo = new THREE.BoxGeometry(0.065, 0.08, 0.028);
  const palm = new THREE.Mesh(palmGeo, skinMat);
  palm.position.set(0, 0, 0);
  hand.add(palm);

  // Thenar eminence (chubby muscle at base of thumb)
  const thenar = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), skinMat);
  thenar.position.set(-0.028 * sign, -0.015, 0.008);
  hand.add(thenar);

  // 2. Opposable Thumb (2 articulated segments)
  const thumbGroup = new THREE.Group();
  thumbGroup.position.set(-0.032 * sign, -0.01, 0.005);
  thumbGroup.rotation.z = 0.45 * sign;
  thumbGroup.rotation.y = isGraspingPole ? -0.5 * sign : 0;

  const thumbP1 = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.012, 0.035, 8), skinMat);
  thumbP1.position.y = 0.018;
  thumbGroup.add(thumbP1);

  const thumbP2 = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.011, 0.03, 8), skinMat);
  thumbP2.position.set(0, 0.04, isGraspingPole ? -0.01 : 0);
  if (isGraspingPole) thumbP2.rotation.x = -0.5;
  thumbGroup.add(thumbP2);

  hand.add(thumbGroup);

  // 3. Four Articulated Fingers (Index, Middle, Ring, Pinky)
  const fingerOffsets = [
    { x: -0.022 * sign, len: 0.036, r: 0.009 }, // Index
    { x: -0.007 * sign, len: 0.04,  r: 0.0095 }, // Middle
    { x: 0.008 * sign,  len: 0.037, r: 0.009 }, // Ring
    { x: 0.022 * sign,  len: 0.03,  r: 0.008 }, // Pinky
  ];

  fingerOffsets.forEach((cfg) => {
    const finger = new THREE.Group();
    finger.position.set(cfg.x, 0.04, 0);

    if (isGraspingPole) {
      // Curled natural grip around pole
      // Proximal Phalanx
      const p1 = new THREE.Mesh(new THREE.CylinderGeometry(cfg.r, cfg.r, cfg.len * 0.45, 6), skinMat);
      p1.position.set(0, cfg.len * 0.22, 0);
      p1.rotation.x = -0.6;
      finger.add(p1);

      // Middle Phalanx
      const p2 = new THREE.Mesh(new THREE.CylinderGeometry(cfg.r * 0.9, cfg.r, cfg.len * 0.35, 6), skinMat);
      p2.position.set(0, cfg.len * 0.45, -0.018);
      p2.rotation.x = -1.3;
      finger.add(p2);

      // Distal Phalanx (Fingertip)
      const p3 = new THREE.Mesh(new THREE.CylinderGeometry(cfg.r * 0.8, cfg.r * 0.9, cfg.len * 0.3, 6), skinMat);
      p3.position.set(0, cfg.len * 0.5, -0.032);
      p3.rotation.x = -1.9;
      finger.add(p3);
    } else {
      // Extended or relaxed hand
      const fMesh = new THREE.Mesh(new THREE.CylinderGeometry(cfg.r * 0.85, cfg.r, cfg.len, 6), skinMat);
      fMesh.position.y = cfg.len * 0.5;
      finger.add(fMesh);
    }

    hand.add(finger);
  });

  return hand;
}

/**
 * Creates authentic traditional Kazakh riding boots (Саптама етік)
 * with contoured shaft, ankle flex, low heel, and signature upturned pointed toe (қисық бас).
 */
function createAuthenticKazakhBoot(
  bootMat: THREE.Material, 
  goldTrimMat: THREE.Material,
  isLeft = false
): THREE.Group {
  const boot = new THREE.Group();
  const sign = isLeft ? -1 : 1;

  // 1. High Boot Shaft (Қонышы)
  const shaftGeo = new THREE.CylinderGeometry(0.08, 0.068, 0.38, 14);
  const shaft = new THREE.Mesh(shaftGeo, bootMat);
  shaft.position.y = 0.22;
  boot.add(shaft);

  // Decorative gold embroidery band along top collar
  const collarGeo = new THREE.CylinderGeometry(0.082, 0.082, 0.03, 14);
  const collar = new THREE.Mesh(collarGeo, goldTrimMat);
  collar.position.y = 0.4;
  boot.add(collar);

  // 2. Ankle contour
  const ankle = new THREE.Mesh(new THREE.SphereGeometry(0.062, 10, 10), bootMat);
  ankle.position.set(0, 0.06, 0.01);
  boot.add(ankle);

  // 3. Foot & Sole base (Табаны)
  const foot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.065, 0.19), bootMat);
  foot.position.set(0, 0.035, 0.06);
  boot.add(foot);

  // Thick leather sole
  const soleMat = new THREE.MeshStandardMaterial({ color: '#140D0B', roughness: 0.85 });
  const sole = new THREE.Mesh(new THREE.BoxGeometry(0.106, 0.02, 0.22), soleMat);
  sole.position.set(0, 0.01, 0.06);
  boot.add(sole);

  // Traditional Low Wooden/Leather Heel (Өкшесі)
  const heel = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.035, 10), soleMat);
  heel.position.set(0, 0.018, -0.025);
  boot.add(heel);

  // Signature Upturned Pointed Toe (Қисық бас тұмсығы)
  const toeTipGeo = new THREE.ConeGeometry(0.045, 0.09, 10);
  const toeTip = new THREE.Mesh(toeTipGeo, bootMat);
  toeTip.rotation.x = -Math.PI / 3; // Curves upwards
  toeTip.position.set(0.005 * sign, 0.05, 0.16);
  boot.add(toeTip);

  return boot;
}

/**
 * Creates an authentic sculpted Kazakh head with 3D facial features:
 * sculpted nose, realistic eyes with iris/pupil, 3D mustache, and flowing beard.
 */
function createSculptedKazakhHead(
  isElder = false, 
  skinMat: THREE.Material,
  faceTex: THREE.Texture,
  furMat?: THREE.Material,
  velvetMat?: THREE.Material,
  goldMat?: THREE.Material
): THREE.Group {
  const headGroup = new THREE.Group();

  // Cranium base
  const headGeo = new THREE.SphereGeometry(0.13, 20, 20);
  const headMesh = new THREE.Mesh(headGeo, new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.6 }));
  headMesh.rotation.y = -Math.PI / 2; // Face forward
  headGroup.add(headMesh);

  // 3D Sculpted Nose with bridge and nostrils
  const noseGroup = new THREE.Group();
  noseGroup.position.set(0, 0, 0.125);
  const noseBridge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.022, 0.065, 8),
    skinMat
  );
  noseBridge.rotation.x = 0.25;
  noseGroup.add(noseBridge);

  const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), skinMat);
  noseTip.position.set(0, -0.028, 0.018);
  noseGroup.add(noseTip);

  // Left & Right Nostril wings
  const nostrilL = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), skinMat);
  nostrilL.position.set(-0.016, -0.03, 0.012);
  noseGroup.add(nostrilL);

  const nostrilR = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), skinMat);
  nostrilR.position.set(0.016, -0.03, 0.012);
  noseGroup.add(nostrilR);

  headGroup.add(noseGroup);

  // 3D Sculpted Ears
  const earL = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.028, 0.06, 8), skinMat);
  earL.position.set(-0.13, 0, 0);
  earL.rotation.z = 0.2;
  headGroup.add(earL);

  const earR = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.028, 0.06, 8), skinMat);
  earR.position.set(0.13, 0, 0);
  earR.rotation.z = -0.2;
  headGroup.add(earR);

  // 3D Beard and Mustache for Elder (Ақсақалдың күміс ақ сақалы мен мұрты)
  if (isElder) {
    const beardMat = new THREE.MeshStandardMaterial({ 
      color: '#EFEFEF', 
      roughness: 0.8,
      metalness: 0.05
    });

    // Sculpted Mustache (Мұрт) curving over the lips
    const mustacheL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.005, 0.07, 8),
      beardMat
    );
    mustacheL.position.set(-0.035, -0.048, 0.13);
    mustacheL.rotation.z = -Math.PI / 4;
    mustacheL.rotation.y = 0.3;
    headGroup.add(mustacheL);

    const mustacheR = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.005, 0.07, 8),
      beardMat
    );
    mustacheR.position.set(0.035, -0.048, 0.13);
    mustacheR.rotation.z = Math.PI / 4;
    mustacheR.rotation.y = -0.3;
    headGroup.add(mustacheR);

    // Multi-layered Flowing Beard (Ақ сақал)
    const beardGroup = new THREE.Group();
    beardGroup.position.set(0, -0.065, 0.08);

    // Chin core
    const beardCore = new THREE.Mesh(
      new THREE.ConeGeometry(0.085, 0.26, 12),
      beardMat
    );
    beardCore.rotation.x = 0.22;
    beardCore.position.set(0, -0.1, 0.04);
    beardGroup.add(beardCore);

    // Left flowing lock
    const lockL = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.2, 8), beardMat);
    lockL.position.set(-0.04, -0.09, 0.03);
    lockL.rotation.z = -0.15;
    lockL.rotation.x = 0.2;
    beardGroup.add(lockL);

    // Right flowing lock
    const lockR = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.2, 8), beardMat);
    lockR.position.set(0.04, -0.09, 0.03);
    lockR.rotation.z = 0.15;
    lockR.rotation.x = 0.2;
    beardGroup.add(lockR);

    headGroup.add(beardGroup);
  }

  // Traditional Fur-Trimmed Noble Hat (Бөрік / Тымақ)
  if (furMat && velvetMat && goldMat) {
    const hatGroup = new THREE.Group();
    hatGroup.position.y = 0.08;

    // Thick Fox/Sable Fur Brim (Қалың бұлғын/түлкі терісі)
    const furBrim = new THREE.Mesh(
      new THREE.TorusGeometry(0.136, 0.048, 10, 24),
      furMat
    );
    furBrim.rotation.x = Math.PI / 2;
    hatGroup.add(furBrim);

    // Velvet Crown (Барқыт төбесі)
    const crown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.135, 0.15, 18),
      velvetMat
    );
    crown.position.y = 0.09;
    hatGroup.add(crown);

    // Golden Finial / Tassel (Алтын шашақ)
    const tassel = new THREE.Mesh(
      new THREE.SphereGeometry(0.022, 10, 10),
      goldMat
    );
    tassel.position.y = 0.18;
    hatGroup.add(tassel);

    headGroup.add(hatGroup);
  }

  return headGroup;
}

/**
 * Creates an anatomically proportioned, authentic Kazakh Elder character (Ақсақал)
 * with layered chapan, leather belt with engraved plaques, 5-fingered hands, and boots.
 */
export function createKazakhElderCharacter(): THREE.Group {
  const character = new THREE.Group();
  character.name = 'elder-aksakal';

  // Materials
  const faceTex = createFaceTexture(true);
  const chapanTex = createChapanFabricTexture('#122F5D');
  const skinMat = new THREE.MeshStandardMaterial({ 
    color: '#E5AF82', 
    roughness: 0.6 
  });
  const chapanMat = new THREE.MeshStandardMaterial({ 
    map: chapanTex, 
    roughness: 0.65 
  });
  const goldTrimMat = new THREE.MeshStandardMaterial({ 
    color: '#D49A35', 
    metalness: 0.75, 
    roughness: 0.28 
  });
  const bootMat = new THREE.MeshStandardMaterial({ 
    color: '#211612', 
    roughness: 0.45 
  });
  const furMat = new THREE.MeshStandardMaterial({ 
    color: '#422817', 
    roughness: 0.95 
  });
  const velvetHatMat = new THREE.MeshStandardMaterial({ 
    color: '#5C1414', 
    roughness: 0.7 
  });

  // 1. Authentic Riding Boots (Саптама етік)
  const leftBoot = createAuthenticKazakhBoot(bootMat, goldTrimMat, true);
  leftBoot.position.set(-0.16, 0, 0.04);
  character.add(leftBoot);

  const rightBoot = createAuthenticKazakhBoot(bootMat, goldTrimMat, false);
  rightBoot.position.set(0.16, 0, -0.04);
  character.add(rightBoot);

  // 2. Legs / Trousers (Шалбар)
  const legMat = new THREE.MeshStandardMaterial({ color: '#2B231D', roughness: 0.7 });
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.42, 12), legMat);
  leftLeg.position.set(-0.16, 0.48, 0.02);
  character.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.42, 12), legMat);
  rightLeg.position.set(0.16, 0.48, -0.02);
  character.add(rightLeg);

  // 3. Layered Chapan Coat (Ұлттық зерлі шапан)
  const torsoGroup = new THREE.Group();

  // Flared Chapan Hem (Шапанның етегі)
  const skirtGeo = new THREE.CylinderGeometry(0.24, 0.36, 0.64, 18);
  const skirt = new THREE.Mesh(skirtGeo, chapanMat);
  skirt.position.y = 0.76;
  torsoGroup.add(skirt);

  // Gold embroidered hem fringe
  const skirtFringe = new THREE.Mesh(
    new THREE.TorusGeometry(0.36, 0.02, 8, 20),
    goldTrimMat
  );
  skirtFringe.rotation.x = Math.PI / 2;
  skirtFringe.position.y = 0.45;
  torsoGroup.add(skirtFringe);

  // Upper Chest / Torso (Шапанның кеудесі)
  const chestGeo = new THREE.CylinderGeometry(0.28, 0.23, 0.48, 18);
  const chest = new THREE.Mesh(chestGeo, chapanMat);
  chest.position.y = 1.18;
  torsoGroup.add(chest);

  // Broad Gold Embroidered Lapels (Шапанның өңірі)
  const lapelL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.76, 0.025), goldTrimMat);
  lapelL.position.set(-0.065, 1.08, 0.24);
  torsoGroup.add(lapelL);

  const lapelR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.76, 0.025), goldTrimMat);
  lapelR.position.set(0.065, 1.08, 0.24);
  torsoGroup.add(lapelR);

  // Traditional Leather Belt with Silver Plaques (Кісе белдік)
  const beltMat = new THREE.MeshStandardMaterial({ color: '#2B1A0E', roughness: 0.5 });
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.245, 0.245, 0.08, 18), beltMat);
  belt.position.y = 0.96;
  torsoGroup.add(belt);

  // Silver Buckle (Күміс айылбас)
  const silverMat = new THREE.MeshStandardMaterial({ color: '#E8E8E8', metalness: 0.9, roughness: 0.2 });
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.07, 0.035), silverMat);
  buckle.position.set(0, 0.96, 0.25);
  torsoGroup.add(buckle);

  // Hanging Silver Plaques (Салпыншақтар)
  for (let p = -2; p <= 2; p++) {
    if (p === 0) continue;
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.06, 0.015), silverMat);
    plaque.position.set(p * 0.06, 0.9, 0.24);
    torsoGroup.add(plaque);
  }

  character.add(torsoGroup);

  // 4. Arms Raised Grasping the Central Bakan Pole (Қолдар мен бақанды ұстау)
  // Left Arm
  const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.35, 12), chapanMat);
  leftUpperArm.position.set(-0.31, 1.28, 0.08);
  leftUpperArm.rotation.set(-0.65, 0.2, 0.42);
  character.add(leftUpperArm);

  const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.34, 12), chapanMat);
  leftForearm.position.set(-0.24, 1.52, 0.22);
  leftForearm.rotation.set(-1.15, 0.3, -0.2);
  character.add(leftForearm);

  // Embroidered Cuff (Жеңсе)
  const cuffL = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.04, 12), goldTrimMat);
  cuffL.position.set(-0.16, 1.62, 0.28);
  cuffL.rotation.set(-1.15, 0.3, -0.2);
  character.add(cuffL);

  // Articulated 5-fingered Left Hand gripping pole
  const leftHand = createArticulatedHand(skinMat, true, true);
  leftHand.position.set(-0.11, 1.66, 0.31);
  leftHand.rotation.set(0.3, -0.4, 0.8);
  character.add(leftHand);

  // Right Arm
  const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.35, 12), chapanMat);
  rightUpperArm.position.set(0.31, 1.28, 0.08);
  rightUpperArm.rotation.set(-0.55, -0.2, -0.42);
  character.add(rightUpperArm);

  const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.34, 12), chapanMat);
  rightForearm.position.set(0.24, 1.52, 0.22);
  rightForearm.rotation.set(-1.05, -0.3, 0.2);
  character.add(rightForearm);

  const cuffR = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.04, 12), goldTrimMat);
  cuffR.position.set(0.16, 1.62, 0.28);
  cuffR.rotation.set(-1.05, -0.3, 0.2);
  character.add(cuffR);

  // Articulated 5-fingered Right Hand gripping pole
  const rightHand = createArticulatedHand(skinMat, true, false);
  rightHand.position.set(0.11, 1.66, 0.31);
  rightHand.rotation.set(0.3, 0.4, -0.8);
  character.add(rightHand);

  // 5. Sculpted Head with Realistic Facial Features, Mustache & Flowing Beard
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.12, 12), skinMat);
  neck.position.y = 1.44;
  character.add(neck);

  const head = createSculptedKazakhHead(true, skinMat, faceTex, furMat, velvetHatMat, goldTrimMat);
  head.position.y = 1.54;
  character.add(head);

  character.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  return character;
}

/**
 * Creates an authentic Kazakh Youth character (Жас көмекші)
 * Action: Raising and slotting the curved Uyk roof pole into the Shanyraq socket.
 */
export function createKazakhYouthCharacter(color = '#9C3826'): THREE.Group {
  const character = new THREE.Group();
  character.name = 'youth-helper';

  const faceTex = createFaceTexture(false);
  const vestTex = createChapanFabricTexture(color);
  const skinMat = new THREE.MeshStandardMaterial({ color: '#EFC298', roughness: 0.58 });
  const vestMat = new THREE.MeshStandardMaterial({ map: vestTex, roughness: 0.65 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: '#F2EDE2', roughness: 0.7 });
  const bootMat = new THREE.MeshStandardMaterial({ color: '#2C1D17', roughness: 0.42 });
  const goldTrimMat = new THREE.MeshStandardMaterial({ color: '#D49A35', metalness: 0.7, roughness: 0.3 });
  const taqiyaMat = new THREE.MeshStandardMaterial({ color: '#144634', roughness: 0.65 });

  // 1. Authentic Boots
  const leftBoot = createAuthenticKazakhBoot(bootMat, goldTrimMat, true);
  leftBoot.position.set(-0.14, 0, 0);
  character.add(leftBoot);

  const rightBoot = createAuthenticKazakhBoot(bootMat, goldTrimMat, false);
  rightBoot.position.set(0.14, 0, 0.1);
  character.add(rightBoot);

  // 2. Legs / Trousers
  const legMat = new THREE.MeshStandardMaterial({ color: '#3B3028', roughness: 0.65 });
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.46, 12), legMat);
  leftLeg.position.set(-0.14, 0.33, 0);
  character.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.46, 12), legMat);
  rightLeg.position.set(0.14, 0.33, 0.08);
  character.add(rightLeg);

  // 3. Torso (Beshpent vest over traditional linen shirt)
  const torsoGroup = new THREE.Group();

  // Shirt with loose sleeves
  const shirt = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.19, 0.56, 16), shirtMat);
  shirt.position.y = 0.82;
  torsoGroup.add(shirt);

  // Traditional Fitted Vest (Бешпент)
  const vest = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.21, 0.46, 16), vestMat);
  vest.position.y = 0.88;
  torsoGroup.add(vest);

  // Gold trim along vest edges
  const vestTrim = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.46, 0.02), goldTrimMat);
  vestTrim.position.set(0, 0.88, 0.22);
  torsoGroup.add(vestTrim);

  // Leather Belt
  const belt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.215, 0.215, 0.06, 16),
    new THREE.MeshStandardMaterial({ color: '#1F120A' })
  );
  belt.position.y = 0.7;
  torsoGroup.add(belt);

  character.add(torsoGroup);

  // 4. Arms Raised Guiding and Hoisting the Uyk Pole Upward
  // Left arm holding middle of pole
  const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.34, 10), shirtMat);
  leftUpperArm.position.set(-0.25, 1.25, 0.12);
  leftUpperArm.rotation.set(-1.1, 0.2, -0.35);
  character.add(leftUpperArm);

  const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.32, 10), shirtMat);
  leftForearm.position.set(-0.2, 1.48, 0.3);
  leftForearm.rotation.set(-1.4, 0.3, -0.2);
  character.add(leftForearm);

  const leftHand = createArticulatedHand(skinMat, true, true);
  leftHand.position.set(-0.14, 1.62, 0.42);
  leftHand.rotation.set(-0.4, 0.3, 0.5);
  character.add(leftHand);

  // Right arm guiding upper shaft
  const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.34, 10), shirtMat);
  rightUpperArm.position.set(0.24, 1.3, 0.14);
  rightUpperArm.rotation.set(-1.3, -0.2, 0.3);
  character.add(rightUpperArm);

  const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.35, 10), shirtMat);
  rightForearm.position.set(0.18, 1.58, 0.34);
  rightForearm.rotation.set(-1.5, -0.2, 0.2);
  character.add(rightForearm);

  const rightHand = createArticulatedHand(skinMat, true, false);
  rightHand.position.set(0.12, 1.76, 0.48);
  rightHand.rotation.set(-0.5, -0.3, -0.5);
  character.add(rightHand);

  // 5. Head Looking Upwards with Kazakh Skullcap (Тақия)
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.1, 10), skinMat);
  neck.position.y = 1.38;
  character.add(neck);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.48, 0.02);
  headGroup.rotation.x = -0.25; // Looking upward toward shanyraq!

  const head = createSculptedKazakhHead(false, skinMat, faceTex);
  headGroup.add(head);

  // Traditional Embroidered Skullcap (Тақия)
  const taqiya = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.13, 0.08, 18),
    taqiyaMat
  );
  taqiya.position.y = 0.08;
  headGroup.add(taqiya);

  const taqiyaTrim = new THREE.Mesh(
    new THREE.TorusGeometry(0.13, 0.012, 6, 20),
    goldTrimMat
  );
  taqiyaTrim.rotation.x = Math.PI / 2;
  taqiyaTrim.position.y = 0.04;
  headGroup.add(taqiyaTrim);

  character.add(headGroup);

  character.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  return character;
}

/**
 * Creates an authentic Kazakh Toddler (1 жасар бүлдіршін) for Tusaukeser
 * with baby anatomy proportions, embroidered chapan, owl feathers, and stage poses.
 */
export function createKazakhChildCharacter(stage = 1): THREE.Group {
  const childGroup = new THREE.Group();
  childGroup.name = 'kazakh-toddler';

  const skinMat = new THREE.MeshStandardMaterial({ color: '#FCD7B8', roughness: 0.5 });
  const chapanMat = new THREE.MeshStandardMaterial({ color: '#1052BA', roughness: 0.55 });
  const goldTrimMat = new THREE.MeshStandardMaterial({ color: '#D49A35', metalness: 0.75, roughness: 0.25 });
  const bootMat = new THREE.MeshStandardMaterial({ color: '#8C1D18', roughness: 0.4 });
  const hatMat = new THREE.MeshStandardMaterial({ color: '#7A1322', roughness: 0.65 });

  // 1. Soft Leather Toddler Booties (Балалар кебісі)
  const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.065, 0.14), bootMat);
  leftBoot.position.set(-0.085, 0.035, stage === 3 ? 0.06 : 0.02);
  childGroup.add(leftBoot);

  const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.065, 0.14), bootMat);
  rightBoot.position.set(0.085, 0.035, stage === 3 ? 0.16 : 0.02);
  childGroup.add(rightBoot);

  // 2. Toddler Legs
  const legMat = new THREE.MeshStandardMaterial({ color: '#D4AF37', roughness: 0.6 });
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.22, 10), legMat);
  leftLeg.position.set(-0.085, 0.16, stage === 3 ? 0.03 : 0);
  childGroup.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.22, 10), legMat);
  rightLeg.position.set(0.085, 0.16, stage === 3 ? 0.09 : 0);
  childGroup.add(rightLeg);

  // 3. Torso with Silk Embroidered Chapan
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.19, 0.38, 16), chapanMat);
  body.position.y = 0.42;
  childGroup.add(body);

  const trim = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.38, 0.02), goldTrimMat);
  trim.position.set(0, 0.42, 0.17);
  childGroup.add(trim);

  // 4. Arms (Balanced for walking or holding out)
  const armRotZ = stage === 3 ? 0.65 : 0.35;
  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.038, 0.26, 10), chapanMat);
  leftArm.position.set(-0.19, 0.44, 0.04);
  leftArm.rotation.z = armRotZ;
  leftArm.rotation.x = -0.3;
  childGroup.add(leftArm);

  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), skinMat);
  leftHand.position.set(-0.28, 0.48, 0.14);
  childGroup.add(leftHand);

  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.038, 0.26, 10), chapanMat);
  rightArm.position.set(0.19, 0.44, 0.04);
  rightArm.rotation.z = -armRotZ;
  rightArm.rotation.x = -0.3;
  childGroup.add(rightArm);

  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), skinMat);
  rightHand.position.set(0.28, 0.48, 0.14);
  childGroup.add(rightHand);

  // 5. Chubby Toddler Head with Owl Feathered Skullcap (Үкілі тақия)
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.68;

  // Chubby baby cranium & cheeks
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.125, 18, 18), skinMat);
  headGroup.add(head);

  // Chubby cheeks
  const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), skinMat);
  cheekL.position.set(-0.065, -0.025, 0.075);
  headGroup.add(cheekL);

  const cheekR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), skinMat);
  cheekR.position.set(0.065, -0.025, 0.075);
  headGroup.add(cheekR);

  // Button nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 8), skinMat);
  nose.position.set(0, 0, 0.125);
  headGroup.add(nose);

  // Big cute baby eyes
  [-0.04, 0.04].forEach(ex => {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.015, 8, 8),
      new THREE.MeshStandardMaterial({ color: '#1A0D06' })
    );
    eye.position.set(ex, 0.025, 0.115);
    headGroup.add(eye);
  });

  // Traditional Velvet Taqiya (Үкілі тақия)
  const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.125, 0.09, 16), hatMat);
  hat.position.y = 0.09;
  headGroup.add(hat);

  // Sacred Owl Feather (Үкі қауырсыны — көз тимесін деп тағылған)
  const featherMat = new THREE.MeshStandardMaterial({ color: '#FAF7EE', roughness: 0.9 });
  const feather = new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.18, 8), featherMat);
  feather.position.set(0, 0.22, -0.02);
  feather.rotation.x = -0.25;
  headGroup.add(feather);

  childGroup.add(headGroup);

  childGroup.traverse(o => {
    if (o instanceof THREE.Mesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });

  return childGroup;
}
