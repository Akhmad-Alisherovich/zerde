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
  assert(spots.length >= 3, `Missing selectable objects in ${id}`);
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
      mixer.setTime(0); const y0 = crown.position.y; assert(felt.scale.x < .01);
      mixer.setTime(8); assert(crown.position.y > y0 + 2); assert(felt.scale.x < .01);
      mixer.setTime(12); assert(poles.scale.x > .9); assert(felt.scale.x < .01);
      mixer.setTime(16); assert(felt.scale.x > .9); assert(support.scale.x < .01);
      mixer.setTime(4); assert(crown.position.y < .3); // rewind really restores earlier stages
    } else {
      const child = root.getObjectByName('toddler'), rope = root.getObjectByName('ala-zhip'), blade = root.getObjectByName('scissor-blade-1');
      assert(child && rope && blade);
      mixer.setTime(4); const q = blade.quaternion.clone(); const z = child.position.z;
      mixer.setTime(6); assert(q.angleTo(blade.quaternion) > .2);
      mixer.setTime(8); assert(rope.position.y < -.07);
      const cut = root.getObjectByName('cut-ala-zhip'); assert(cut && cut.scale.x > .99); assert(rope.scale.x < .01);
      mixer.setTime(12); assert(child.position.z > z + .9);
      mixer.setTime(0); assert(Math.abs(child.position.z + .6) < .001);
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
