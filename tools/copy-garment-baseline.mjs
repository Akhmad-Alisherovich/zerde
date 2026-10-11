// Preserve the original tracked browser frames before a new visual QA pass.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const output = path.resolve('docs/validation/garment-review/before');
fs.mkdirSync(output, { recursive: true });
for (const name of ['ceremony', 'faces', 'garment', 'hands', 'rear', 'close',
  'stage-1-front', 'stage-2-front', 'stage-3-front', 'stage-3-side']) {
  const filename = `betashar-${name}.png`;
  const source = `docs/validation/browser/${filename}`;
  try {
    const bytes = execFileSync('git', ['-c', `safe.directory=${process.cwd().replaceAll('\\', '/')}`,
      'show', `HEAD:${source}`]);
    fs.writeFileSync(path.join(output, filename), bytes);
    console.log(filename);
  } catch {
    // Earlier branches did not capture every viewpoint.
  }
}
