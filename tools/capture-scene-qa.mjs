// Browser evidence for the running Vite app. Uses Chrome DevTools Protocol
// directly so no test framework or browser extension is required.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const chromePath = process.env.ZERDE_CHROME ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const origin = process.env.ZERDE_ORIGIN ?? 'http://127.0.0.1:5173';
const output = path.resolve('docs/validation/browser');
await fs.mkdir(output, { recursive: true });
const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'zerde-3d-qa-'));
const chrome = spawn(chromePath, [
  '--headless=new', '--no-first-run', '--no-default-browser-check',
  '--disable-background-networking', '--disable-extensions', '--disable-gpu',
  '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  '--window-size=1440,1250', 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
try {
  let port;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      port = Number((await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]);
      if (port) break;
    } catch { /* Chrome has not opened its endpoint yet. */ }
    await pause(150);
  }
  if (!port) throw new Error('Chrome DevToolsActivePort was not created');
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const tab = tabs.find(item => item.type === 'page');
  if (!tab) throw new Error('Chrome opened without a page target');
  socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
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
      const timer = setTimeout(() => { if (pending.delete(id)) reject(new Error(`${method} timed out`)); }, 30000);
      pending.set(id, { method, resolve, reject, timer });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  const evaluate = async expression => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.value;
  async function waitForModel() {
    for (let attempt = 0; attempt < 100; attempt++) {
      const loaded = await evaluate(`!!document.querySelector('canvas') && !document.body.innerText.includes('GLB үлгісі жүктелуде')`);
      if (loaded) { await pause(1300); return; }
      await pause(250);
    }
    throw new Error('Model did not become ready in browser');
  }
  async function screenshot(label) {
    await evaluate(`document.querySelector('canvas')?.scrollIntoView({block:'center'})`);
    await pause(300);
    const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, fromSurface: true });
    const file = path.join(output, `${label}.png`);
    await fs.writeFile(file, Buffer.from(result.data, 'base64'));
    console.log(file);
  }
  async function navigate(scenario) {
    await send('Page.navigate', { url: `${origin}/ar-gallery?scenario=${scenario}` });
    await waitForModel();
  }
  async function clickLabel(label) {
    const clicked = await evaluate(`(() => { const button = [...document.querySelectorAll('button')].find(el => el.textContent.trim() === ${JSON.stringify(label)}); if (!button) return false; button.click(); return true; })()`);
    if (!clicked) throw new Error(`Button not found: ${label}`);
    await pause(150); // Allow React's stage effect before the precise timeline input.
  }
  async function scrub(time) {
    const applied = await evaluate(`(() => { const input = document.querySelector('input[aria-label="Анимация уақыты"]'); if (!input) return null; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,${time}); input.dispatchEvent(new Event('input',{bubbles:true})); input.dispatchEvent(new Event('change',{bubbles:true})); return input.value; })()`);
    if (Number(applied) !== time) throw new Error(`Timeline scrub did not set ${time}: ${applied}`);
    await pause(350);
  }
  async function orbit(pixels) {
    const rect = await evaluate(`(() => { const r = document.querySelector('canvas').getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; })()`);
    const x = Math.round(rect.x + rect.width / 2), y = Math.round(rect.y + rect.height / 2);
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1 });
    for (let step = 1; step <= 12; step++) await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: x + Math.round(step * pixels / 12), y, button: 'left', buttons: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: x + pixels, y, button: 'left', buttons: 0, clickCount: 1 });
    await pause(900);
  }
  const measurements = [];
  async function measure(label) {
    const snapshot = () => evaluate(`(() => ({ draws: window.__zerdeQa?.draws ?? 0, frames: window.__zerdeQa?.frames ?? 0, now: performance.now(), resource: performance.getEntriesByType('resource').filter(item => item.name.endsWith('.glb')).map(item => ({name:item.name.split('/').pop(), durationMs:+item.duration.toFixed(1), transferSize:item.transferSize})) }))()`);
    const before = await snapshot();
    await pause(2500);
    const after = await snapshot();
    const seconds = (after.now - before.now) / 1000;
    const frames = after.frames - before.frames;
    measurements.push({ scene: label, environment: 'Chrome headless SwiftShader on local Vite', sampleSeconds: +seconds.toFixed(2), animationFrames: frames,
      rafPerSecond: +(frames / seconds).toFixed(1), drawCallsPerRaf: frames ? +((after.draws - before.draws) / frames).toFixed(1) : null,
      glbResource: after.resource.at(-1) ?? null });
  }
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `(() => {
    window.__zerdeQa = { draws: 0, frames: 0 };
    for (const Context of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
      if (!Context) continue;
      for (const key of ['drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced']) {
        if (!Object.prototype.hasOwnProperty.call(Context.prototype,key)) continue;
        const original=Context.prototype[key];
        Context.prototype[key]=function(...args) { window.__zerdeQa.draws++; return original.apply(this,args); };
      }
    }
    const beat=() => { window.__zerdeQa.frames++; requestAnimationFrame(beat); };
    requestAnimationFrame(beat);
  })();` });
  await navigate('ar-asar');
  await scrub(3.8); await screenshot('asar-stage-1-front');
  await clickLabel('2. Шаңырақ көтеру'); await scrub(7.8); await screenshot('asar-stage-2-front');
  await clickLabel('3. Уық бекіту'); await scrub(11.8); await screenshot('asar-stage-3-front');
  await clickLabel('4. Киізбен жабу'); await scrub(16); await screenshot('asar-stage-4-front');
  await measure('asar');
  // Orbit the actual canvas about half a turn for a rear inspection.
  await orbit(288); await screenshot('asar-stage-4-rear');
  await navigate('ar-nauryz'); await screenshot('nauryz-front'); await measure('nauryz');
  await orbit(144); await screenshot('nauryz-side');
  await navigate('ar-tusaukeser'); await scrub(3.8); await screenshot('tusaukeser-stage-1');
  await clickLabel('2. Тұсауды кесу'); await scrub(7.8); await screenshot('tusaukeser-stage-2');
  await clickLabel('3. Алғашқы қадам'); await scrub(12); await screenshot('tusaukeser-stage-3'); await measure('tusaukeser');
  await orbit(144); await screenshot('tusaukeser-stage-3-side');
  await fs.writeFile(path.join(output, 'browser-metrics.json'), JSON.stringify(measurements, null, 2));
} finally {
  socket?.close();
  chrome.kill();
  // The path is created directly beneath the OS temporary directory above.
  const tempRoot = path.resolve(os.tmpdir());
  if (path.resolve(profile).startsWith(tempRoot + path.sep)) {
    for (let attempt = 0; attempt < 10; attempt++) {
      try { await fs.rm(profile, { recursive: true, force: true }); break; }
      catch { await pause(300); }
    }
  }
}
