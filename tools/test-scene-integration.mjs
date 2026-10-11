import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SCENE_ASSETS, getHotspots, selectHotspot, disposeScene } from '../src/components/ar/SceneAssets.ts';
// Headless structural test only. Bitmap handles are stubs; no GPU or visual QA.
globalThis.self = globalThis;
globalThis.createImageBitmap = async () => ({ width: 512, height: 512, close() {} });
const results = [];
for (const [id, definition] of Object.entries(SCENE_ASSETS)) {
  const bytes = await fs.readFile(`public${definition.url}`);
  const gltf = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
  const root = gltf.scene;
  const spots = getHotspots(root, id);
  assert(spots.length >= (id === 'ar-bata-beru' ? 2 : 3), `Missing selectable objects in ${id}`);
  for (const spot of spots) {
    let candidate;
    root.traverse(object => { if (object.userData.hotspot === spot.id) candidate = object; });
    assert(candidate);
    assert.equal(selectHotspot(candidate, spots).id, spot.id);
    assert(Number.isFinite(spot.position.length()));
  }
  let skinCount = 0;
  root.traverse(object => { if (object instanceof THREE.SkinnedMesh) { skinCount++; assert.equal(object.skeleton.bones.length, 53); } });
  assert(skinCount >= 2);
  if (definition.duration) {
    const mixer = new THREE.AnimationMixer(root);
    const action = mixer.clipAction(gltf.animations[0]); action.setLoop(THREE.LoopOnce,1); action.clampWhenFinished = true; action.play();
    if (id === 'ar-asar') {
      const crown = root.getObjectByName('shanyraq'), poles = root.getObjectByName('uyk'), felt = root.getObjectByName('kiiz'), support = root.getObjectByName('bakan');
      assert(crown && poles && felt && support);
      const lift = root.getObjectByName('shanyraq-lift');
      const hinge = root.getObjectByName('uyk-hinge-0');
      const panel = root.getObjectByName('felt-set-0');
      const section = root.getObjectByName('kerege-section-0');
      assert(lift && hinge && panel && section);
      assert.equal(crown.parent, lift);
      assert.equal(support.parent, lift); // same pivot keeps crown on its fork
      const crownCentre = () => { root.updateMatrixWorld(true); return crown.getWorldPosition(new THREE.Vector3()); };
      mixer.setTime(0);
      const y0 = crownCentre().y;
      const sectionOffset = section.position.length();
      assert(y0 < .2 && sectionOffset > .3 && hinge.scale.x < .01 && panel.scale.x < .01);
      mixer.setTime(4); assert(section.position.length() < .001);
      mixer.setTime(8); assert(crownCentre().y > y0 + 2 && support.scale.x > .9 && panel.scale.x < .01);
      mixer.setTime(12); assert(hinge.scale.x > .9 && hinge.quaternion.angleTo(new THREE.Quaternion()) < .001 && panel.scale.x < .01,
        `uyk=${hinge.scale.x}, angle=${hinge.quaternion.angleTo(new THREE.Quaternion())}, felt=${panel.scale.x}`);
      mixer.setTime(15.999); assert(panel.scale.x > .9 && support.scale.x < .01);
      mixer.setTime(15.999); assert(panel.scale.x > .9 && support.scale.x < .01, 'Finished pose must survive repeated browser render frames');
      mixer.setTime(0); assert(crownCentre().y < .2 && panel.scale.x < .01); // rewind
    } else if (id === 'ar-tusaukeser') {
      const child = root.getObjectByName('toddler'), rope = root.getObjectByName('ala-zhip'), blade = root.getObjectByName('scissor-blade-1');
      assert(child && rope && blade);
      mixer.setTime(4); const q = blade.quaternion.clone(); const z = child.position.z;
      mixer.setTime(6); assert(q.angleTo(blade.quaternion) > .2);
      mixer.setTime(8); assert(rope.position.y < -.07);
      const cut = root.getObjectByName('cut-ala-zhip'); assert(cut && cut.scale.x > .99); assert(rope.scale.x < .01);
      mixer.setTime(12); assert(child.position.z > z + .9);
      mixer.setTime(0); assert(Math.abs(child.position.z + .6) < .001);
    } else {
      const marked = id === 'ar-besikke-salu' ? 'infant' : id === 'ar-betashar' ? 'bridal-veil'
        : id === 'ar-syrga-salu' ? 'right-earring' : id === 'ar-bata-beru' ? 'blessing-elder-upperarm_l'
        : id === 'ar-shashu' ? 'sweet-0' : 'serving-jug';
      const target = root.getObjectByName(marked); assert(target, `Missing key moving object ${marked}`);
      mixer.setTime(0); const start = { position: target.position.clone(), rotation: target.quaternion.clone() };
      mixer.setTime(id === 'ar-betashar' ? 10 : id === 'ar-qymyzmuryndyq' ? 6.5 : 7.8);
      assert(target.position.distanceTo(start.position) > .03 || target.quaternion.angleTo(start.rotation) > .08,
        `${id} did not visibly move at middle stage`);
      mixer.setTime(0);
      assert(target.position.distanceTo(start.position) < .001 && target.quaternion.angleTo(start.rotation) < .001,
        `${id} did not rewind`);
    }
    mixer.stopAllAction(); mixer.uncacheRoot(root);
  }
  let disposed = 0;
  const geometry = new Set(); root.traverse(o => { if (o instanceof THREE.Mesh) geometry.add(o.geometry); });
  geometry.forEach(g => g.addEventListener('dispose', () => disposed++));
  disposeScene(root); assert.equal(disposed, geometry.size, 'Every owned geometry must be disposed exactly once');
  results.push({ scenario: id, gltfLoader: 'passed', selectableHotspots: spots.length, skinnedMeshes: skinCount,
    animation: definition.duration ? 'movement, stage endpoints and rewind passed' : 'static', disposal: 'passed',
    bitmapDecode: 'stubbed', rendering: 'not tested' });
}
await fs.mkdir('docs/validation', { recursive:true });
await fs.writeFile('docs/validation/integration-tests.json', JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
