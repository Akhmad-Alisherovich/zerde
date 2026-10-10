import fs from 'node:fs/promises';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

globalThis.self = globalThis;
globalThis.createImageBitmap = async () => ({ width: 512, height: 512, close() {} });
for (const [file, time, names] of [
  ['asar', 7.8, ['elder-helper-hand_l', 'elder-helper-hand_r', 'west-helper-hand_l', 'east-helper-hand_r', 'bakan', 'shanyraq']],
  ['tusaukeser', 6, ['ceremony-elder-hand_l', 'ceremony-elder-hand_r', 'supporting-parent-hand_l', 'supporting-parent-hand_r', 'toddler-hand_l', 'toddler-hand_r', 'ceremony-scissors']],
]) {
  const bytes = await fs.readFile(`public/models/${file}.glb`);
  const gltf = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
  if (gltf.animations[0]) {
    const mixer = new THREE.AnimationMixer(gltf.scene);
    mixer.clipAction(gltf.animations[0]).play();
    mixer.setTime(time);
  }
  gltf.scene.updateMatrixWorld(true);
  console.log(file, 'time', time);
  for (const name of names) {
    const object = gltf.scene.getObjectByName(name);
    console.log(name, object?.getWorldPosition(new THREE.Vector3()).toArray().map(n => +n.toFixed(3)));
  }
}
