import * as THREE from 'three';

/**
 * Generates an authentic Kazakh ornamental canvas texture (Қошқар мүйіз / Текемет pattern)
 * High-resolution 1024x1024 with crisp vector-like curves, border friezes, and wool texture
 */
export function createKazakhOrnamentTexture(primaryColor = '#8B0000', secondaryColor = '#D49A35', bgColor = '#004D7A'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background with subtle wool felt weave
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 1024, 1024);

  // Wool felt fibrous microtexture
  for (let i = 0; i < 6000; i++) {
    const fx = Math.random() * 1024;
    const fy = Math.random() * 1024;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
    ctx.fillRect(fx, fy, 2, 2);
  }

  // Double outer border frame
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 24;
  ctx.strokeRect(32, 32, 960, 960);

  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 14;
  ctx.strokeRect(58, 58, 908, 908);

  // Border Running Dog / Single Horn wave pattern (Ирек / Сыңар мүйіз)
  ctx.fillStyle = secondaryColor;
  for (let p = 70; p < 950; p += 40) {
    // Top & Bottom border
    ctx.beginPath();
    ctx.arc(p, 46, 8, 0, Math.PI * 2);
    ctx.arc(p, 978, 8, 0, Math.PI * 2);
    ctx.fill();
    // Left & Right border
    ctx.beginPath();
    ctx.arc(46, p, 8, 0, Math.PI * 2);
    ctx.arc(978, p, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Function to draw authentic Ram's Horn (Қошқар мүйіз)
  const drawHorn = (cx: number, cy: number, scale: number, rotation: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);

    // Left spiral horn
    ctx.beginPath();
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.arc(-50, 0, 48, 0, Math.PI, true);
    ctx.arc(-80, 0, 28, 0, Math.PI * 1.5, false);
    ctx.stroke();

    // Right spiral horn
    ctx.beginPath();
    ctx.arc(50, 0, 48, Math.PI, 0, false);
    ctx.arc(80, 0, 28, Math.PI, Math.PI * 1.5, true);
    ctx.stroke();

    // Inner contour with primary accent
    ctx.beginPath();
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 8;
    ctx.arc(-50, 0, 40, 0, Math.PI, true);
    ctx.arc(50, 0, 40, Math.PI, 0, false);
    ctx.stroke();

    // Central diamond jewel (Тұмар)
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.moveTo(0, -36);
    ctx.lineTo(36, 0);
    ctx.lineTo(0, 36);
    ctx.lineTo(-36, 0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 6;
    ctx.stroke();

    // Central golden dot
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Center 4-way monumental ornament (Төртқұлақ / Қошқар мүйіз)
  drawHorn(512, 512, 2.4, 0);
  drawHorn(512, 512, 2.4, Math.PI / 2);
  drawHorn(512, 512, 2.4, Math.PI);
  drawHorn(512, 512, 2.4, (Math.PI * 3) / 2);

  // Four corner ornaments
  drawHorn(200, 200, 1.3, Math.PI / 4);
  drawHorn(824, 200, 1.3, -Math.PI / 4);
  drawHorn(200, 824, 1.3, (Math.PI * 3) / 4);
  drawHorn(824, 824, 1.3, -(Math.PI * 3) / 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generates photorealistic procedural wood texture for tables, astau, and yurt wooden frame
 * Rich annular rings, fine grain streaks, and organic knots
 */
export function createWoodTexture(isDark = false): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const baseColor = isDark ? '#4A2111' : '#94532D';
  const grainColor = isDark ? '#2E1207' : '#6E381A';
  const highlightColor = isDark ? '#6B351E' : '#B86F3E';

  // Base stain
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 1024, 1024);

  // Fine linear wood fibers
  for (let y = 0; y < 1024; y += 3) {
    const wave = Math.sin(y * 0.02) * 15 + Math.sin(y * 0.08) * 6;
    const alpha = (Math.sin(y * 0.04) + 1.2) * 0.22;
    ctx.fillStyle = grainColor;
    ctx.globalAlpha = alpha;
    ctx.fillRect(0, y, 1024, 2);

    if (y % 12 === 0) {
      ctx.fillStyle = highlightColor;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(0, y + wave * 0.1, 1024, 1);
    }
  }
  ctx.globalAlpha = 1.0;

  // Natural wood knots with concentric rings
  const knots = [
    { x: 260, y: 280, rx: 35, ry: 65, rot: 0.2 },
    { x: 740, y: 420, rx: 42, ry: 80, rot: -0.25 },
    { x: 380, y: 780, rx: 30, ry: 55, rot: 0.15 },
  ];

  knots.forEach(({ x, y, rx, ry, rot }) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    // Concentric growth rings
    for (let r = 1; r <= 8; r++) {
      ctx.beginPath();
      ctx.ellipse(0, 0, (rx * r) / 8, (ry * r) / 8, 0, 0, Math.PI * 2);
      ctx.strokeStyle = grainColor;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.45;
      ctx.stroke();
    }

    // Knot core
    ctx.beginPath();
    ctx.ellipse(0, 0, rx * 0.25, ry * 0.25, 0, 0, Math.PI * 2);
    ctx.fillStyle = grainColor;
    ctx.globalAlpha = 0.85;
    ctx.fill();

    ctx.restore();
  });
  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generates braided black-and-white wool rope texture (Ала жіп)
 * Detailed interwoven dual-strand wool fibers
 */
export function createAlaZhipTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const strandWidth = 32;
  for (let x = 0; x < 512; x += strandWidth * 2) {
    // White wool strand (Natural ivory sheep wool)
    ctx.fillStyle = '#F4EFE6';
    ctx.fillRect(x, 0, strandWidth, 128);

    // Diagonal twist shading
    const gradW = ctx.createLinearGradient(x, 0, x + strandWidth, 0);
    gradW.addColorStop(0, 'rgba(0,0,0,0.18)');
    gradW.addColorStop(0.5, 'rgba(255,255,255,0.4)');
    gradW.addColorStop(1, 'rgba(0,0,0,0.22)');
    ctx.fillStyle = gradW;
    ctx.fillRect(x, 0, strandWidth, 128);

    // Black/Dark camel wool strand
    ctx.fillStyle = '#1C1916';
    ctx.fillRect(x + strandWidth, 0, strandWidth, 128);

    const gradB = ctx.createLinearGradient(x + strandWidth, 0, x + strandWidth * 2, 0);
    gradB.addColorStop(0, 'rgba(0,0,0,0.5)');
    gradB.addColorStop(0.5, 'rgba(80,70,60,0.3)');
    gradB.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = gradB;
    ctx.fillRect(x + strandWidth, 0, strandWidth, 128);
  }

  // Realistic wool fiber frizz along the braid
  for (let i = 0; i < 1500; i++) {
    const fx = Math.random() * 512;
    const fy = Math.random() * 128;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)';
    ctx.fillRect(fx, fy, 2, 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 1);
  return texture;
}

/**
 * Generates white felt runner texture with red/gold border (Ақ жол)
 */
export function createAqZholTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Pure white/ivory clean felt
  ctx.fillStyle = '#FCFAF7';
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft wool fiber noise
  for (let i = 0; i < 4000; i++) {
    const fx = Math.random() * 1024;
    const fy = Math.random() * 1024;
    ctx.fillStyle = 'rgba(215, 205, 190, 0.15)';
    ctx.fillRect(fx, fy, 2, 2);
  }

  // Traditional Red border friezes
  ctx.fillStyle = '#991B1B';
  ctx.fillRect(0, 0, 68, 1024);
  ctx.fillRect(956, 0, 68, 1024);

  // Gold trim borders
  ctx.fillStyle = '#D49A35';
  ctx.fillRect(68, 0, 16, 1024);
  ctx.fillRect(940, 0, 16, 1024);

  // Kazakh wave/spiral ornament on red border
  ctx.fillStyle = '#FFFFFF';
  for (let y = 32; y < 1024; y += 64) {
    ctx.beginPath();
    ctx.arc(34, y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(990, y, 14, 0, Math.PI * 2);
    ctx.fill();

    // Golden dot inside
    ctx.fillStyle = '#D49A35';
    ctx.beginPath();
    ctx.arc(34, y, 6, 0, Math.PI * 2);
    ctx.arc(990, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generates authentic natural felt covering texture (Ақ киіз: Туырлық / Үзік / Түндік)
 */
export function createFeltTexture(withPattern = true): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Natural warm unbleached sheep wool felt
  ctx.fillStyle = '#ECE5D8';
  ctx.fillRect(0, 0, 1024, 1024);

  // Realistic wool fiber flecks
  for (let i = 0; i < 12000; i++) {
    const nx = Math.random() * 1024;
    const ny = Math.random() * 1024;
    const isDark = Math.random() > 0.65;
    ctx.fillStyle = isDark ? 'rgba(165, 150, 130, 0.3)' : 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(nx, ny, 2, 2);
  }

  // Kazakh embroidered lower fringe band (Жосалы жиек)
  if (withPattern) {
    ctx.fillStyle = '#781D15';
    ctx.fillRect(0, 920, 1024, 104);

    ctx.fillStyle = '#D49A35';
    ctx.fillRect(0, 896, 1024, 24);

    // Ornamental horn arch along hem
    ctx.fillStyle = '#ECE5D8';
    for (let x = 40; x < 1024; x += 80) {
      ctx.beginPath();
      ctx.arc(x, 972, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#D49A35';
      ctx.beginPath();
      ctx.arc(x, 972, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ECE5D8';
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generates traditional wide woven yurt belt texture (Басқұр & Белдеу)
 * Woven jacquard wool ribbon with vibrant geometric motifs
 */
export function createBasqurTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Woven crimson wool ground
  ctx.fillStyle = '#6E1616';
  ctx.fillRect(0, 0, 1024, 128);

  // Gold outer borders
  ctx.fillStyle = '#D49A35';
  ctx.fillRect(0, 0, 1024, 12);
  ctx.fillRect(0, 116, 1024, 12);

  // Dark indigo inner stripe
  ctx.fillStyle = '#06255B';
  ctx.fillRect(0, 12, 1024, 8);
  ctx.fillRect(0, 108, 1024, 8);

  // Intricate diamond and horn repeat pattern
  for (let x = 32; x < 1024; x += 64) {
    // White diamond
    ctx.fillStyle = '#FAF5EC';
    ctx.beginPath();
    ctx.moveTo(x, 26);
    ctx.lineTo(x + 24, 64);
    ctx.lineTo(x, 102);
    ctx.lineTo(x - 24, 64);
    ctx.closePath();
    ctx.fill();

    // Red center
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.moveTo(x, 38);
    ctx.lineTo(x + 16, 64);
    ctx.lineTo(x, 90);
    ctx.lineTo(x - 16, 64);
    ctx.closePath();
    ctx.fill();

    // Turquoise diamond core
    ctx.fillStyle = '#00BFFF';
    ctx.beginPath();
    ctx.arc(x, 64, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 1);
  return texture;
}

/**
 * Generates Kazakh steppe terrain texture (Жусанды дала)
 */
export function createSteppeGroundTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Steppe grass green with golden earth undertones
  ctx.fillStyle = '#5A7341';
  ctx.fillRect(0, 0, 1024, 1024);

  // Grass tufts, wormwood sagebrush (жусан), and sandy earth patches
  for (let i = 0; i < 8000; i++) {
    const gx = Math.random() * 1024;
    const gy = Math.random() * 1024;
    const rnd = Math.random();
    if (rnd > 0.65) {
      ctx.fillStyle = 'rgba(175, 150, 92, 0.45)'; // dry steppe grass / feather grass (боз)
    } else if (rnd > 0.3) {
      ctx.fillStyle = 'rgba(62, 88, 38, 0.5)'; // fresh wild thyme / wormwood
    } else {
      ctx.fillStyle = 'rgba(115, 88, 54, 0.35)'; // warm loam soil
    }
    ctx.fillRect(gx, gy, 5, 4);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

/**
 * Generates detailed Kazakh Chapan / Clothing fabric texture with gold embroidery
 */
export function createChapanFabricTexture(baseColor = '#1B3B6F'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Velvet pile / twill weave
  for (let y = 0; y < 512; y += 4) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(0, y, 512, 1);
  }

  // Golden metallic embroidery motifs (Зерлі оюлар)
  ctx.strokeStyle = '#D49A35';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';

  const drawEmbroideredSpiral = (cx: number, cy: number) => {
    ctx.beginPath();
    ctx.arc(cx - 15, cy, 20, 0, Math.PI, true);
    ctx.arc(cx + 15, cy, 20, Math.PI, 0, false);
    ctx.stroke();

    ctx.fillStyle = '#FFE082';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  drawEmbroideredSpiral(128, 128);
  drawEmbroideredSpiral(384, 128);
  drawEmbroideredSpiral(128, 384);
  drawEmbroideredSpiral(384, 384);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generates golden-brown crust texture for freshly fried baursaks (Бауырсақ)
 */
export function createBaursakTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Golden delicious dough gradient
  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
  grad.addColorStop(0, '#E8AC43'); // puffed center
  grad.addColorStop(0.7, '#C87F1E'); // golden crust
  grad.addColorStop(1, '#8C4607'); // crispy fried edge
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Dough blister spots
  for (let i = 0; i < 40; i++) {
    const bx = Math.random() * 256;
    const by = Math.random() * 256;
    const br = Math.random() * 8 + 3;
    ctx.fillStyle = 'rgba(110, 48, 6, 0.35)';
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Generates detailed human face texture with authentic features and expressions
 */
export function createFaceTexture(isElder = false): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Warm Kazakh skin tone
  ctx.fillStyle = isElder ? '#E5AF82' : '#EFC298';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle cheek warmth & natural subsurface scattering tone
  ctx.fillStyle = 'rgba(215, 115, 90, 0.22)';
  ctx.beginPath();
  ctx.arc(130, 280, 70, 0, Math.PI * 2);
  ctx.arc(382, 280, 70, 0, Math.PI * 2);
  ctx.fill();

  // Eyebrows
  ctx.fillStyle = isElder ? '#5C554F' : '#261810';
  ctx.beginPath();
  ctx.ellipse(140, 160, 55, 16, -0.1, 0, Math.PI * 2);
  ctx.ellipse(372, 160, 55, 16, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Eyes with almond shape, dark iris, pupil, and specular highlight
  [140, 372].forEach((ex) => {
    // Sclera
    ctx.fillStyle = '#F5F2EC';
    ctx.beginPath();
    ctx.ellipse(ex, 200, 32, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark brown Kazakh iris
    ctx.fillStyle = '#2B160C';
    ctx.beginPath();
    ctx.arc(ex, 200, 15, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#080503';
    ctx.beginPath();
    ctx.arc(ex, 200, 8, 0, Math.PI * 2);
    ctx.fill();

    // Eye catchlight
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(ex + 4, 196, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Nose shading
  ctx.fillStyle = 'rgba(145, 80, 42, 0.25)';
  ctx.beginPath();
  ctx.moveTo(256, 190);
  ctx.lineTo(240, 290);
  ctx.lineTo(272, 290);
  ctx.closePath();
  ctx.fill();

  // Lips
  ctx.fillStyle = isElder ? '#BF7562' : '#CE7468';
  ctx.beginPath();
  ctx.ellipse(256, 370, 46, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

