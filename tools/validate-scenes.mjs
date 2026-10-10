import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import validator from 'gltf-validator';
import { NodeIO } from '@gltf-transform/core';
const io = new NodeIO();
const reports = [];
for (const name of ['asar', 'nauryz', 'tusaukeser']) {
 const data = await fs.readFile(`public/models/${name}.glb`);
 const report = await validator.validateBytes(new Uint8Array(data), { uri: `${name}.glb`, maxIssues: 0 });
 reports.push({ name, ...report });
 console.log(name, { errors: report.issues.numErrors, warnings: report.issues.numWarnings, infos: report.issues.numInfos, messages: report.issues.messages.slice(0,3) });
 assert.equal(report.issues.numErrors, 0, `${name} glTF validation errors`);
 const doc = await io.read(`public/models/${name}.glb`); const root = doc.getRoot();
 assert(root.listTextures().length >= 10, 'Expected embedded PBR texture maps');
 assert(root.listSkins().length >= 2, 'Expected anatomical skinned human figures');
 const hotspots = new Set(root.listNodes().map(n=>n.getExtras().hotspot).filter(Boolean));
 for (const key of name==='asar'?['kerege','shanyraq','uyk','kiiz','bakan','door','community']:name==='nauryz'?['dastarkhan','baursak','kozhe','community']:['ala-zhip','scissors','community']) assert(hotspots.has(key), `Missing ${key}`);
 const animation=root.listAnimations()[0];
 if(name!=='nauryz') {
  assert(animation, 'Missing timeline');
  const ends=animation.listSamplers().map(s=>s.getInput().getMax([])[0]);
  assert.equal(Math.max(...ends), name==='asar'?16:12, 'Incorrect stage timeline');
  assert(animation.listChannels().some(c=>c.getTargetPath()==='translation'), 'No actual movement');
  assert(animation.listChannels().some(c=>c.getTargetPath()==='rotation'), 'No actual articulated rotation');
 }
}
await fs.mkdir('docs/validation', { recursive:true });
await fs.writeFile('docs/validation/gltf-validation.json', JSON.stringify(reports,null,2));
