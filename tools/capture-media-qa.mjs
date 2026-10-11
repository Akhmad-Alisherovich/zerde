import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const chromePath = process.env.ZERDE_CHROME ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve('docs/validation/cinematic-media');
await fs.mkdir(outputDir, { recursive: true });

const origin = process.env.ZERDE_ORIGIN ?? 'http://127.0.0.1:5173';
console.log(`Using server origin: ${origin}`);

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'zerde-media-qa-'));
const chrome = spawn(chromePath, [
  '--headless=new',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-background-networking',
  '--disable-extensions',
  '--disable-gpu',
  '--enable-unsafe-swiftshader',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--remote-debugging-port=0',
  `--user-data-dir=${profile}`,
  '--window-size=1440,900',
  'about:blank'
], { windowsHide: true, stdio: 'ignore' });

let socket;
try {
  let devtoolsPort;
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      devtoolsPort = Number((await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]);
      if (devtoolsPort) break;
    } catch {
      await pause(150);
    }
  }
  if (!devtoolsPort) throw new Error('Chrome DevToolsActivePort was not created');

  const tabs = await (await fetch(`http://127.0.0.1:${devtoolsPort}/json/list`)).json();
  const tab = tabs.find(item => item.type === 'page');
  if (!tab) throw new Error('Chrome opened without a page target');

  socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  let sequence = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const reply = JSON.parse(event.data);
    const job = pending.get(reply.id);
    if (!job) return;
    pending.delete(reply.id);
    clearTimeout(job.timer);
    if (reply.error) job.reject(new Error(`${job.method}: ${reply.error.message}`));
    else job.resolve(reply.result);
  });

  function send(method, params = {}) {
    const id = ++sequence;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (pending.delete(id)) reject(new Error(`${method} timed out`));
      }, 45000);
      pending.set(id, { method, resolve, reject, timer });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }

  const evaluate = async expression =>
    (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.value;

  await send('Page.enable');
  await send('Runtime.enable');

  async function snap(url, filename, setupFn) {
    console.log(`Capturing: ${url} -> ${filename}`);
    await send('Page.navigate', { url: `${origin}${url}` });
    await pause(2200);
    if (setupFn) await setupFn();
    await pause(1000);
    const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const filepath = path.join(outputDir, filename);
    await fs.writeFile(filepath, Buffer.from(result.data, 'base64'));
    console.log(`Saved: ${filepath}`);
  }

  // 1. AR Gallery Betashar 3D Model
  await snap('/ar-gallery?scenario=ar-betashar', '01-ar-gallery-3d-betashar.png');

  // 2. AR Gallery Betashar Cinematic Media Tab
  await snap('/ar-gallery?scenario=ar-betashar', '02-ar-gallery-cinematic-betashar.png', async () => {
    await evaluate(`(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.innerText.includes('Этнографиялық медиа'));
      if (btn) btn.click();
    })()`);
  });

  // 3. AR Gallery Betashar Closeups Tab
  await snap('/ar-gallery?scenario=ar-betashar', '03-ar-gallery-closeups-betashar.png', async () => {
    await evaluate(`(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.innerText.includes('Этнографиялық медиа'));
      if (btn) btn.click();
    })()`);
    await pause(400);
    await evaluate(`(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.innerText.includes('Мәдени детальдар'));
      if (btn) btn.click();
    })()`);
  });

  // 4. Tradition Detail Page for Betashar
  await snap('/traditions/betashar', '04-tradition-detail-betashar.png', async () => {
    await evaluate(`window.scrollTo(0, 400)`);
  });

  // 5. Tradition Detail Page scrolled to Cinematic Viewer
  await snap('/traditions/betashar', '05-tradition-detail-cinematic-viewer.png', async () => {
    await evaluate(`(() => {
      const el = document.querySelector('h3.font-serif');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
  });

  // 6. Tradition Cards overview with new covers
  await snap('/traditions', '06-traditions-cards-overview.png', async () => {
    await evaluate(`window.scrollTo(0, 350)`);
  });

  // 7. Exhibition slide for cinematic media
  await snap('/exhibition', '07-exhibition-cinematic-slide.png', async () => {
    await evaluate(`(() => {
      const btns = [...document.querySelectorAll('button')];
      const slideBtn = btns.find(b => b.innerText.trim() === '6');
      if (slideBtn) slideBtn.click();
    })()`);
    await pause(500);
  });

  // 8. Nauryz AR Gallery Ethnographic Media Tab (with new serving kozhe visual)
  await snap('/ar-gallery?scenario=ar-nauryz', '09-ar-gallery-cinematic-nauryz.png', async () => {
    await evaluate(`(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.innerText.includes('Этнографиялық медиа'));
      if (btn) btn.click();
    })()`);
  });

  // 9. Nauryz Tradition Detail Page
  await snap('/traditions/nauryz', '10-tradition-detail-nauryz.png', async () => {
    await evaluate(`(() => {
      const el = document.querySelector('h3.font-serif');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
  });

  // 10. Mobile viewport check (390x844)
  console.log('Switching to mobile viewport (390x844)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await snap('/ar-gallery?scenario=ar-betashar', '08-mobile-ar-gallery-cinematic.png', async () => {
    await evaluate(`(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.innerText.includes('Этнографиялық медиа'));
      if (btn) btn.click();
      window.scrollTo(0, 500);
    })()`);
  });

  console.log('All QA captures completed successfully!');
} finally {
  try { socket?.close(); } catch {}
  try { chrome.kill(); } catch {}
  try { await fs.rm(profile, { recursive: true, force: true }); } catch {}
}
