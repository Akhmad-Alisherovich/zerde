import { NodeIO } from '@gltf-transform/core';
import { dedup, prune, weld, join, resample, unweld, tangents } from '@gltf-transform/functions';
import fs from 'node:fs/promises';
import mikktspace from 'mikktspace';
const { generateTangents } = mikktspace;
// Portable glTF 2.0: intentionally no Draco/Meshopt extension, so the same files
// can be loaded by the site's GLTFLoader and passed to native AR viewers.
const io = new NodeIO();
const results = [];
const names = process.argv.slice(2);
for (const name of names.length ? names : ['asar', 'nauryz', 'tusaukeser', 'besikke-salu', 'betashar', 'syrga-salu', 'bata-beru', 'shashu', 'qymyzmuryndyq']) {
  try { await fs.access(`public/models/${name}.glb`); } catch { continue; }
  const doc = await io.read(`public/models/${name}.glb`);
  await doc.transform(dedup(), weld(), join({ keepNamed: false }), unweld(), tangents({ generateTangents }), weld(), resample(), prune());
  await io.write(`public/models/${name}.glb`, doc);
  const root = doc.getRoot();
  const stat = { file: `${name}.glb`, bytes: (await fs.stat(`public/models/${name}.glb`)).size,
    meshes: root.listMeshes().length, triangles: root.listMeshes().reduce((sum, mesh) => sum + mesh.listPrimitives().reduce((s,p) => s + p.getIndices().getCount()/3, 0),0),
    skins: root.listSkins().length, bones: root.listSkins().reduce((s,skin) => s+skin.listJoints().length,0),
    animationChannels: root.listAnimations().reduce((s,a) => s+a.listChannels().length,0) };
  results.push(stat); console.log(stat);
}
const previous = JSON.parse(await fs.readFile('public/models/asset-stats.json', 'utf8'));
await fs.writeFile('public/models/asset-stats.json', JSON.stringify([...previous.filter(item => !results.some(next => next.file === item.file)), ...results], null, 2));
