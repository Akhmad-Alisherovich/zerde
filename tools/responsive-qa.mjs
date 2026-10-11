// Audit the built UI in Chrome at requested CSS viewport sizes. Captures real browser frames.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const origin = process.env.ZERDE_ORIGIN ?? 'http://127.0.0.1:5173';
const output = path.resolve('docs/validation/responsive');
const chromePath = process.env.ZERDE_CHROME ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sizes = [
  [320, 700], [360, 780], [390, 844], [430, 932],
  [768, 1024], [820, 1180], [1024, 768], [1440, 900],
  [844, 390], [932, 430], [1180, 820],
];
const routes = [
  '/', '/relevance', '/modules', '/traditions',
  '/traditions/besikke-salu', '/traditions/nauryz', '/traditions/korisu',
  '/traditions/tusaukeser', '/traditions/betashar', '/traditions/asar',
  '/traditions/erulik', '/traditions/syrga-salu', '/traditions/bata-beru',
  '/traditions/shashu', '/traditions/qymyzmuryndyq',
  '/ai-assistant', '/ar-gallery', '/research', '/ethics', '/posters', '/exhibition', '/missing',
];
const capturesOnly = process.argv.includes('--captures');
const interactionsOnly = process.argv.includes('--interactions');
const qualityOnly = process.argv.includes('--quality');
const chatOnly = process.argv.includes('--chat');
const tapOnly = process.argv.includes('--tap');
const checkedRoutes = interactionsOnly || qualityOnly || tapOnly ? [] : chatOnly ? ['/ai-assistant'] : capturesOnly ? ['/', '/ar-gallery', '/exhibition'] : routes;
const checkedSizes = chatOnly ? [[320,700],[390,844]] : capturesOnly ? [[844, 390], [1024, 768], [1440, 900]] : sizes;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
await fs.mkdir(output, { recursive: true });
const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'zerde-responsive-qa-'));
const chrome = spawn(chromePath, [
  '--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--disable-background-networking', '--disable-gpu', '--enable-unsafe-swiftshader',
  '--use-gl=angle', '--use-angle=swiftshader', '--remote-debugging-port=0',
  `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
let socket;
try {
  let port;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { port = Number((await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]); } catch { /* wait */ }
    if (port) break;
    await pause(150);
  }
  if (!port) throw new Error('Chrome did not open a debugging port');
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  const pending = new Map(); let sequence = 0;
  socket.addEventListener('message', event => {
    const reply = JSON.parse(event.data), task = pending.get(reply.id);
    if (!task) return;
    pending.delete(reply.id); clearTimeout(task.timer);
    if (reply.error) task.reject(new Error(`${task.method}: ${reply.error.message}`));
    else task.resolve(reply.result);
  });
  function send(method, params = {}) {
    const id = ++sequence;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out`)); }, 30000);
      pending.set(id, { resolve, reject, timer, method });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  const evaluate = async expression => (await send('Runtime.evaluate', {
    expression, returnByValue: true, awaitPromise: true,
  })).result?.value;
  await send('Page.enable'); await send('Runtime.enable');
  const waitUntil = async (expression, label, attempts = 120) => {
    for (let i = 0; i < attempts; i++) {
      if (await evaluate(expression)) return;
      await pause(200);
    }
    throw new Error(`Timed out: ${label}`);
  };
  const results = [];
  for (const route of checkedRoutes) {
    await send('Page.navigate', { url: origin + route });
    for (let i = 0; i < 100; i++) {
      if (await evaluate(`document.location.pathname === ${JSON.stringify(route)} && document.readyState === 'complete' && document.querySelector('#root')?.children.length > 0`)) break;
      await pause(100);
    }
    if (route === '/ar-gallery') {
      for (let i = 0; i < 100; i++) {
        if (await evaluate(`!!document.querySelector('canvas') && !document.body.innerText.includes('3D үлгі жүктелуде')`)) break;
        await pause(200);
      }
    }
    await pause(250);
    for (const [width, height] of checkedSizes) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
      await pause(100);
      const data = await evaluate(`(() => {
        const w = innerWidth;
        const offenders = [...document.querySelectorAll('body *')].filter(el => {
          const st = getComputedStyle(el), r = el.getBoundingClientRect();
          if (st.display === 'none' || st.position === 'fixed' || r.width === 0 || r.height === 0) return false;
          if (el.closest('[data-qa-ignore-overflow]')) return false;
          let parent = el.parentElement;
          while (parent && parent !== document.body) {
            const p = getComputedStyle(parent);
            if (['auto','scroll','hidden','clip'].includes(p.overflowX)) return false;
            parent = parent.parentElement;
          }
          return r.left < -2 || r.right > w + 2;
        }).slice(0, 8).map(el => ({tag:el.tagName.toLowerCase(), cls:String(el.className).slice(0,90), text:el.textContent.trim().slice(0,60), rect:[Math.round(el.getBoundingClientRect().left),Math.round(el.getBoundingClientRect().right)]}));
        const canvas = document.querySelector('canvas');
        const cr = canvas?.getBoundingClientRect();
        return { width:w, docWidth:document.documentElement.scrollWidth, bodyWidth:document.body.scrollWidth,
          rootWidth:document.querySelector('#root')?.scrollWidth, offenders,
          canvas:cr ? {css:[Math.round(cr.width),Math.round(cr.height)],bitmap:[canvas.width,canvas.height]} : null,
          fonts: ['Zerde Sans','Zerde Serif','Zerde Mono'].map(f => [f,document.fonts.check('16px "'+f+'"')]) };
      })()`);
      const row = { route, viewport: `${width}x${height}`, ...data };
      results.push(row);
      if (data.docWidth > width + 2 || data.width > width + 2 || data.offenders.length) console.log('OVERFLOW', JSON.stringify(row));
      const capture = (route === '/' && [320,390,820,1440].includes(width)) ||
        (route === '/ar-gallery' && [320,390,820,1440].includes(width)) ||
        (route === '/ai-assistant' && [320,390].includes(width)) ||
        (route === '/posters' && [320,820].includes(width)) ||
        (route === '/exhibition' && [320,820].includes(width));
      if (capture || capturesOnly) {
        if (route === '/ar-gallery') await evaluate('document.querySelector("canvas")?.scrollIntoView({block:"center"})');
        if (route === '/ai-assistant') await evaluate('document.querySelector("#chatbot .glass-panel")?.scrollIntoView({block:"start"})');
        await pause(route === '/ar-gallery' ? 500 : 100);
        const frame = await send('Page.captureScreenshot', { format:'png', fromSurface:true, captureBeyondViewport:false });
        const name = `${route.replaceAll('/','_') || 'home'}-${width}x${height}.png`;
        await fs.writeFile(path.join(output, name), Buffer.from(frame.data, 'base64'));
      }
    }
    console.log('DONE', route);
  }
  if (interactionsOnly) {
    const checks = [];
    await send('Emulation.setDeviceMetricsOverride', { width:390, height:844, deviceScaleFactor:1, mobile:true });
    await send('Emulation.setTouchEmulationEnabled', { enabled:true, maxTouchPoints:2 });
    await send('Page.navigate', { url: origin + '/' });
    await waitUntil(`location.pathname === '/' && !!document.querySelector('button[aria-controls="mobile-navigation"]')`, 'home navigation');
    await evaluate(`document.querySelector('button[aria-controls="mobile-navigation"]').click()`);
    if ((await evaluate(`document.querySelector('button[aria-controls="mobile-navigation"]').getAttribute('aria-expanded')`)) !== 'true') throw new Error('Menu did not open');
    await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`);
    if ((await evaluate(`document.querySelector('button[aria-controls="mobile-navigation"]').getAttribute('aria-expanded')`)) !== 'false') throw new Error('Escape did not close menu');
    checks.push('Mobile menu opens and closes with Escape');

    await send('Page.navigate', { url: origin + '/ar-gallery' });
    await waitUntil(`location.pathname === '/ar-gallery' && !!document.querySelector('canvas')`, 'gallery canvas');
    const allNames = await evaluate(`[...document.querySelectorAll('[aria-label="3D салт-дәстүр сахналары"] button')].map(x=>x.textContent.trim())`);
    const names = process.argv.includes('--quick') ? allNames.slice(0,1) : allNames;
    for (const name of names) {
      const found = await evaluate(`(() => {const b=[...document.querySelectorAll('[aria-label="3D салт-дәстүр сахналары"] button')].find(x=>x.textContent.trim() === ${JSON.stringify(name)}); b?.click(); return !!b;})()`);
      if (!found) throw new Error(`Missing tradition tab: ${name}`);
      await pause(300);
      await waitUntil(`!!document.querySelector('canvas') && !document.querySelector('canvas').parentElement.querySelector('[role="status"]')`, `scene ${name}`);
      const dimensions = await evaluate(`(() => {const c=document.querySelector('canvas'),r=c.getBoundingClientRect();return {css:[r.width,r.height],bitmap:[c.width,c.height]}})()`);
      if (Math.abs(dimensions.css[0] - dimensions.bitmap[0]) > 2 || Math.abs(dimensions.css[1] - dimensions.bitmap[1]) > 2) throw new Error(`Canvas size mismatch ${name}: ${JSON.stringify(dimensions)}`);
    }
    checks.push(`Switched and loaded ${names.length} scene tabs; canvas bitmap matches CSS size at 390px`);

    await evaluate(`document.querySelector('button[aria-label="Айналуды тоқтату"]')?.click();[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Кідірту')?.click();document.documentElement.style.scrollBehavior='auto';document.querySelector('canvas').scrollIntoView({block:'center',behavior:'instant'});window.__touchEvents=[];for(const type of ['pointerdown','pointermove','pointerup','click'])document.querySelector('canvas').addEventListener(type,e=>window.__touchEvents.push({type,id:e.pointerId}),true)`);
    await pause(250);
    const bounds = await evaluate(`(() => {const r=document.querySelector('canvas').getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})()`);
    if (bounds.y < 70 || bounds.y + bounds.h > 844) throw new Error(`Canvas is not within touch viewport: ${JSON.stringify(bounds)}`);
    const x = Math.round(bounds.x + bounds.w / 2), y = Math.round(bounds.y + bounds.h / 2);
    const frame = async () => (await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})).data;
    const before = await frame();
    await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
    for (let i=1;i<=8;i++) await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+i*10,y,id:1}]});
    await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await pause(400);
    const afterOrbit = await frame();
    if (before === afterOrbit) throw new Error('Touch orbit did not change browser frame');
    if (!await evaluate(`window.__touchEvents.some(x=>x.type==='pointermove')`)) throw new Error('Orbit gesture did not reach canvas');
    await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-30,y,id:1},{x:x+30,y,id:2}]});
    for (let i=1;i<=8;i++) await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-30-i*7,y,id:1},{x:x+30+i*7,y,id:2}]});
    await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await pause(400);
    const afterPinch = await frame();
    if (afterOrbit === afterPinch) throw new Error('Pinch did not change browser frame');
    if (!await evaluate(`new Set(window.__touchEvents.filter(x=>x.type==='pointerdown').map(x=>x.id)).size >= 2`)) throw new Error('Pinch did not reach canvas as two pointers');
    checks.push('One finger orbit and two finger pinch changed actual browser frames');

    if (process.argv.includes('--quick')) {
      if (await evaluate(`document.body.innerText.includes('Архитектуралық және тәрбиелік мәні')`)) throw new Error('Drag selected an object accidentally');
      await evaluate(`document.querySelector('button[aria-label="Бастапқы күй"]').click()`);
      await pause(400);
      let tapped = false;
      for (const [fx,fy] of [[.22,.35],[.38,.54],[.38,.42],[.64,.54],[.72,.45],[.28,.52]]) {
        const tx=Math.round(bounds.x+bounds.w*fx),ty=Math.round(bounds.y+bounds.h*fy);
        await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:tx,y:ty,id:3}]});
        await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
        await pause(200);
        if (await evaluate(`document.body.innerText.includes('Архитектуралық және тәрбиелік мәні')`)) { tapped=true; break; }
      }
      if (!tapped) throw new Error('Canvas tap did not select a hotspot at tested visible object positions');
      checks.push('Canvas drag did not select; a touch tap on model selected a hotspot');
    }

    const stageSelected = await evaluate(`(() => {const root=document.querySelector('canvas').closest('.glass-panel');const b=[...root.querySelectorAll('button')].find(x=>x.textContent.trim().startsWith('2. '));b?.click();return !!b})()`);
    if (!stageSelected) throw new Error('Second ceremony stage missing');
    const hotspotSelected = await evaluate(`(() => {const root=document.querySelector('canvas').closest('.glass-panel');const panel=[...root.children].find(x=>x.textContent?.trim().startsWith('3D Құрылымдық Бөлшектер'));const b=panel?.querySelector('button');b?.click();return {found:!!b,text:b?.textContent?.trim(),panel:panel?.textContent?.slice(0,100)}})()`);
    await pause(200);
    if (!hotspotSelected.found || !await evaluate(`document.body.innerText.includes('Архитектуралық және тәрбиелік мәні')`)) throw new Error(`Hotspot pill selection failed: ${JSON.stringify(hotspotSelected)}`);
    checks.push('Ceremony stage and keyboard reachable hotspot button responded');

    await send('Emulation.setDeviceMetricsOverride',{width:844,height:390,deviceScaleFactor:1,mobile:true});
    await pause(650);
    const landscape = await evaluate(`(() => {const c=document.querySelector('canvas'),r=c.getBoundingClientRect();return {css:[r.width,r.height],bitmap:[c.width,c.height]}})()`);
    if (Math.abs(landscape.css[0]-landscape.bitmap[0])>2 || Math.abs(landscape.css[1]-landscape.bitmap[1])>2) throw new Error(`Landscape canvas size mismatch: ${JSON.stringify(landscape)}`);
    checks.push('Landscape resize kept canvas CSS and drawing buffer synchronized');

    await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
    const arOpened = await evaluate(`(() => {const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('WebAR (WebXR)'));b?.click();return !!b})()`);
    if (!arOpened) throw new Error('WebAR tab missing');
    await waitUntil(`document.body.innerText.includes('Бұл шолушыда WebXR AR қолжетімсіз')`, 'WebXR unsupported guidance');
    await evaluate(`([...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='3D көрініске өту')).click()`);
    await waitUntil(`!!document.querySelector('canvas') && !!document.querySelector('canvas').closest('.glass-panel')`, '3D fallback');
    checks.push('Unsupported WebXR displays Kazakh guidance and returns to 3D');

    await send('Page.navigate',{url:origin+'/ai-assistant'});
    await waitUntil(`location.pathname === '/ai-assistant' && !!document.querySelector('input[placeholder^="Сұрағыңызды"]')`, 'chat input');
    await evaluate(`([...document.querySelectorAll('button')].find(x=>x.textContent.includes('Тұсаукесердегі ала жіп'))).click()`);
    await waitUntil(`document.body.innerText.includes('Тұсаукесердегі ала жіп нені білдіреді?')`, 'chat question');
    checks.push('Chat suggestion submitted at 390px');

    await send('Page.navigate',{url:origin+'/exhibition'});
    await waitUntil(`location.pathname === '/exhibition' && !!document.querySelector('button[aria-label="Келесі слайд"]')`, 'exhibition');
    await evaluate(`document.querySelector('button[aria-label="Келесі слайд"]').click()`);
    if (!await evaluate(`document.body.innerText.includes('2 / 9') || document.body.innerText.includes('2/9')`)) throw new Error('Next exhibition slide failed');
    checks.push('Exhibition next slide works at 390px');
    await fs.writeFile(path.join(output,'interaction-checks.json'),JSON.stringify(checks,null,2));
    checks.forEach(x=>console.log('PASS',x));
  }
  if (qualityOnly) {
    const checks = [];
    await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:3,mobile:true});
    await send('Page.navigate',{url:origin+'/ar-gallery'});
    await waitUntil(`location.pathname === '/ar-gallery' && !!document.querySelector('canvas') && !document.querySelector('canvas').parentElement.querySelector('[role="status"]')`,'quality gallery');
    const dimensions = () => evaluate(`(() => {const c=document.querySelector('canvas'),r=c.getBoundingClientRect();return {dpr:devicePixelRatio,css:[r.width,r.height],bitmap:[c.width,c.height]}})()`);
    let size = await dimensions();
    let ratio = size.bitmap[0]/size.css[0];
    if (Math.abs(size.dpr-3)>0.1 || Math.abs(ratio-1.5)>0.04) throw new Error(`Mobile DPR cap failed: ${JSON.stringify(size)}`);
    checks.push({check:'Mobile DPR 3 capped at 1.5',ratio:+ratio.toFixed(2),size});
    await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:2,mobile:false});
    await pause(500);
    size = await dimensions(); ratio=size.bitmap[0]/size.css[0];
    if (Math.abs(size.dpr-2)>0.1 || Math.abs(ratio-1.75)>0.04) throw new Error(`Desktop DPR cap failed: ${JSON.stringify(size)}`);
    checks.push({check:'Desktop DPR 2 capped at 1.75',ratio:+ratio.toFixed(2),size});
    await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await send('Page.navigate',{url:origin+'/ar-gallery'});
    await waitUntil(`location.pathname === '/ar-gallery' && !!document.querySelector('canvas')`,'reduced motion gallery');
    const motion = await evaluate(`({media:matchMedia('(prefers-reduced-motion: reduce)').matches,scroll:getComputedStyle(document.documentElement).scrollBehavior})`);
    if (!motion.media || motion.scroll !== 'auto') throw new Error(`Reduced motion failed: ${JSON.stringify(motion)}`);
    checks.push({check:'Reduced motion switches smooth scrolling off',...motion});
    const fontFaces = await evaluate(`(async () => {const sample='Әә Ғғ Ққ Ңң Өө Ұұ Үү Һһ Іі';const families=['Zerde Sans','Zerde Serif','Zerde Mono'];const weights=[400,500,600,700,800,900];const loaded=await Promise.all(families.flatMap(f=>weights.map(w=>document.fonts.load(w+' 16px "'+f+'"',sample))));return loaded.map(x=>x.length)})()`);
    if (fontFaces.some(count => count < 1)) throw new Error(`Font faces failed to load: ${JSON.stringify(fontFaces)}`);
    checks.push({check:'All 3 local families loaded at weights 400–900',faces:fontFaces.length});
    await evaluate(`([...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Бұрынғы Hiro үлгісі')).click()`);
    await pause(100);
    const focusedClose = await evaluate(`document.activeElement?.getAttribute('aria-label')`);
    if (focusedClose !== 'Терезені жабу') throw new Error(`Dialog did not take focus: ${focusedClose}`);
    await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`);
    await pause(100);
    const returnedFocus = await evaluate(`document.activeElement?.textContent.trim()`);
    if (returnedFocus !== 'Бұрынғы Hiro үлгісі') throw new Error(`Dialog did not return focus: ${returnedFocus}`);
    checks.push({check:'Dialog takes focus, Escape closes, focus returns to trigger'});
    await fs.writeFile(path.join(output,'quality-checks.json'),JSON.stringify(checks,null,2));
    checks.forEach(x=>console.log('PASS',x.check));
  }
  if (tapOnly) {
    await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
    await send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:2});
    await send('Page.navigate',{url:origin+'/ar-gallery'});
    await waitUntil(`location.pathname === '/ar-gallery' && !!document.querySelector('canvas') && !document.querySelector('canvas').parentElement.querySelector('[role="status"]')`,'tap gallery');
    await evaluate(`(() => {const c=document.querySelector('canvas');document.documentElement.style.scrollBehavior='auto';c.scrollIntoView({block:'center',behavior:'instant'});window.__tapEvents=[];for(const type of ['pointerdown','pointerup','pointercancel','click'])c.addEventListener(type,e=>window.__tapEvents.push({type,x:Math.round(e.clientX),y:Math.round(e.clientY),pointerId:e.pointerId,isPrimary:e.isPrimary}),true)})()`);
    await pause(250);
    const rect=await evaluate(`(() => {const r=document.querySelector('canvas').getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})()`);
    if (rect.y < 70 || rect.y + rect.h > 844) throw new Error(`Canvas is not within tap viewport: ${JSON.stringify(rect)}`);
    const points=[];
    for(const fy of [.35,.45,.55,.65,.75]) for(const fx of [.22,.34,.46,.58,.70,.82]) points.push([fx,fy]);
    let selectedByTouch=null,selectedByMouse=null;
    const selected = () => evaluate(`document.body.innerText.includes('Архитектуралық және тәрбиелік мәні')`);
    for(const [fx,fy] of points){
      const x=Math.round(rect.x+rect.w*fx),y=Math.round(rect.y+rect.h*fy);
      await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
      await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      await pause(70);
      if(await selected()){selectedByTouch={fx,fy,x,y};break;}
    }
    if(!selectedByTouch) for(const [fx,fy] of points){
      const x=Math.round(rect.x+rect.w*fx),y=Math.round(rect.y+rect.h*fy);
      await send('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',buttons:1,clickCount:1});
      await send('Input.dispatchMouseEvent',{type:'mouseReleased',x,y,button:'left',buttons:0,clickCount:1});
      await pause(70);
      if(await selected()){selectedByMouse={fx,fy,x,y};break;}
    }
    const events=await evaluate('window.__tapEvents');
    const result={rect,selectedByTouch,selectedByMouse,events:events.slice(0,35)};
    await fs.writeFile(path.join(output,'tap-diagnostics.json'),JSON.stringify(result,null,2));
    console.log(JSON.stringify({selectedByTouch,selectedByMouse,eventCount:events.length,firstEvents:events.slice(0,8)}));
  }
  if (!interactionsOnly && !qualityOnly && !tapOnly) {
    await fs.writeFile(path.join(output, chatOnly ? 'audit-chat.json' : capturesOnly ? 'audit-captures.json' : 'audit.json'), JSON.stringify(results, null, 2));
    console.log(`Audited ${results.length} route/viewport pairs`);
  }
} finally {
  socket?.close(); chrome.kill();
  if (path.resolve(profile).startsWith(path.resolve(os.tmpdir()) + path.sep)) {
    for (let i = 0; i < 10; i++) {
      try { await fs.rm(profile, {recursive:true,force:true}); break; } catch { await pause(300); }
    }
  }
}
