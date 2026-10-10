import { NodeIO } from '@gltf-transform/core';
import { dedup, prune, weld, join, resample, unweld, tangents } from '@gltf-transform/functions';
import fs from 'node:fs/promises';
import mikktspace from 'mikktspace';
const { generateTangents } = mikktspace;
// Portable glTF 2.0: intentionally no Draco/Meshopt extension, so the same files
// can be loaded by the site's GLTFLoader and passed to native AR viewers.
const io = new NodeIO();
const results = [];
for (const name of ['asar', 'nauryz', 'tusaukeser']) {
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
await fs.writeFile('public/models/asset-stats.json', JSON.stringify(results, null, 2));
