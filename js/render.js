// Sunset City RP — rendering
import { WORLD, ROAD_LINES, ROAD_W, VEHICLE_TYPES } from './data.js';
import { city, clamp, blockBounds } from './world.js';

const FONT = '"Arial Black", "Arial Bold", Impact, sans-serif';
const FONT_UI = '"Segoe UI", Arial, sans-serif';

export function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = clamp(Math.round(r + amt), 0, 255);
  g = clamp(Math.round(g + amt), 0, 255);
  b = clamp(Math.round(b + amt), 0, 255);
  return `rgb(${r},${g},${b})`;
}

function drawRoads(ctx) {
  ctx.fillStyle = '#191c21';
  ctx.fillRect(0, 0, WORLD.w, WORLD.h);
  // grass / dirt base patches between blocks
  ctx.fillStyle = '#20242a';
  ctx.fillRect(0, 0, WORLD.w, WORLD.h);

  // Roads
  ctx.fillStyle = '#26292f';
  for (const x of ROAD_LINES) ctx.fillRect(x - ROAD_W / 2, 0, ROAD_W, WORLD.h);
  for (const y of ROAD_LINES) ctx.fillRect(0, y - ROAD_W / 2, WORLD.w, ROAD_W);

  // Road edge gutters
  ctx.strokeStyle = '#31353c';
  ctx.lineWidth = 3;
  for (const x of ROAD_LINES) {
    ctx.beginPath(); ctx.moveTo(x - ROAD_W / 2, 0); ctx.lineTo(x - ROAD_W / 2, WORLD.h);
    ctx.moveTo(x + ROAD_W / 2, 0); ctx.lineTo(x + ROAD_W / 2, WORLD.h); ctx.stroke();
  }
  for (const y of ROAD_LINES) {
    ctx.beginPath(); ctx.moveTo(0, y - ROAD_W / 2); ctx.lineTo(WORLD.w, y - ROAD_W / 2);
    ctx.moveTo(0, y + ROAD_W / 2); ctx.lineTo(WORLD.w, y + ROAD_W / 2); ctx.stroke();
  }

  // Lane markings
  ctx.lineCap = 'butt';
  for (const x of ROAD_LINES) {
    for (let y = 40; y < WORLD.h; y += 90) {
      const near = ROAD_LINES.some((ry) => Math.abs(y - ry) < ROAD_W / 2 + 40);
      if (near) continue;
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.fillRect(x - 1.5, y, 3, 44);
    }
    ctx.fillStyle = 'rgba(255,205,60,0.4)';
    ctx.fillRect(x - ROAD_W / 2 + 6, 0, 2, WORLD.h);
    ctx.fillRect(x + ROAD_W / 2 - 8, 0, 2, WORLD.h);
  }
  for (const y of ROAD_LINES) {
    for (let x = 40; x < WORLD.w; x += 90) {
      const near = ROAD_LINES.some((rx) => Math.abs(x - rx) < ROAD_W / 2 + 40);
      if (near) continue;
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.fillRect(x, y - 1.5, 44, 3);
    }
    ctx.fillStyle = 'rgba(255,205,60,0.4)';
    ctx.fillRect(0, y - ROAD_W / 2 + 6, WORLD.w, 2);
    ctx.fillRect(0, y + ROAD_W / 2 - 8, WORLD.w, 2);
  }

  // Crosswalks
  for (const x of ROAD_LINES) {
    for (const y of ROAD_LINES) {
      for (let i = -2; i <= 2; i++) {
        ctx.fillStyle = 'rgba(235,238,242,0.55)';
        ctx.fillRect(x + i * 18 - 6, y - ROAD_W / 2 - 26, 12, 22);
        ctx.fillRect(x + i * 18 - 6, y + ROAD_W / 2 + 4, 12, 22);
        ctx.fillRect(x - ROAD_W / 2 - 26, y + i * 18 - 6, 22, 12);
        ctx.fillRect(x + ROAD_W / 2 + 4, y + i * 18 - 6, 22, 12);
      }
    }
  }

  // Block pads (sidewalk + interior)
  for (let by = 0; by < 5; by++) {
    for (let bx = 0; bx < 5; bx++) {
      const b = blockBounds(bx, by);
      ctx.fillStyle = '#3a3e45';
      roundRect(ctx, b.x0 - 12, b.y0 - 12, b.w + 24, b.h + 24, 8);
      ctx.fill();
      ctx.fillStyle = '#2c3037';
      roundRect(ctx, b.x0, b.y0, b.w, b.h, 4);
      ctx.fill();
      // sidewalk seams
      ctx.strokeStyle = 'rgba(0,0,0,0.16)';
      ctx.lineWidth = 1;
      for (let x = b.x0 - 12; x < b.x1 + 12; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, b.y0 - 12); ctx.lineTo(x, b.y0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, b.y1); ctx.lineTo(x, b.y1 + 12); ctx.stroke();
      }
      for (let y = b.y0 - 12; y < b.y1 + 12; y += 30) {
        ctx.beginPath(); ctx.moveTo(b.x0 - 12, y); ctx.lineTo(b.x0, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(b.x1, y); ctx.lineTo(b.x1 + 12, y); ctx.stroke();
      }
    }
  }
}

function drawPark(ctx, poi) {
  const r = poi.rect;
  // grass
  ctx.fillStyle = '#2d5138';
  roundRect(ctx, r.x, r.y, r.w, r.h, 10); ctx.fill();
  ctx.fillStyle = '#33593d';
  roundRect(ctx, r.x + 8, r.y + 8, r.w - 16, r.h - 16, 8); ctx.fill();
  // paths
  ctx.strokeStyle = '#8b8171'; ctx.lineWidth = 22; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(r.x + 20, r.y + r.h * 0.5); ctx.lineTo(r.x + r.w - 20, r.y + r.h * 0.5);
  ctx.moveTo(r.x + r.w * 0.5, r.y + 20); ctx.lineTo(r.x + r.w * 0.5, r.y + r.h - 20);
  ctx.stroke();
  ctx.strokeStyle = '#a39884'; ctx.lineWidth = 16; ctx.stroke();
  // fountain
  const cx = poi.cx, cy = poi.cy;
  ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(cx + 4, cy + 6, 62, 62, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#8f8b80'; ctx.beginPath(); ctx.arc(cx, cy, 58, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3d7e9e'; ctx.beginPath(); ctx.arc(cx, cy, 47, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#5ba7c7'; ctx.beginPath(); ctx.arc(cx, cy, 40, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#a8a294'; ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(220,245,255,0.5)'; ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(cx, cy, 20 + i * 8, 0, Math.PI * 2); ctx.stroke(); }
  // sign
  ctx.fillStyle = '#1e3326';
  roundRect(ctx, cx - 74, r.y + r.h - 46, 148, 26, 5); ctx.fill();
  ctx.fillStyle = '#cfe6d8'; ctx.font = `700 12px ${FONT_UI}`; ctx.textAlign = 'center';
  ctx.fillText('PARQUE CENTRAL', cx, r.y + r.h - 28);
}

function drawGasStation(ctx, poi) {
  const r = poi.rect;
  // forecourt
  ctx.fillStyle = '#33373e';
  ctx.fillRect(r.x - 30, r.y + r.h, r.w + 60, 150);
  // pumps
  for (const p of poi.pumps || []) {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(p.x + 3, p.y + 10, 20, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d8dbe0'; roundRect(ctx, p.x - 14, p.y - 22, 28, 38, 4); ctx.fill();
    ctx.fillStyle = '#b5352f'; ctx.fillRect(p.x - 14, p.y - 22, 28, 10);
    ctx.fillStyle = '#1b1e23'; ctx.fillRect(p.x - 8, p.y - 8, 16, 12);
    ctx.fillStyle = '#46d98b'; ctx.fillRect(p.x - 6, p.y - 6, 12, 3);
  }
}

function drawBuilding(ctx, b) {
  const lift = Math.min(14, b.floors * 2);
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.38)';
  roundRect(ctx, b.x + 7 + lift * 0.4, b.y + 9 + lift * 0.4, b.w, b.h, 4); ctx.fill();

  // wall sides
  ctx.fillStyle = shade(b.wall, -22);
  roundRect(ctx, b.x, b.y, b.w, b.h, 4); ctx.fill();
  ctx.fillStyle = b.roof;
  roundRect(ctx, b.x + 3, b.y + 3, b.w - 6, b.h - 6, 3); ctx.fill();

  // roof inset / edge
  ctx.strokeStyle = 'rgba(255,255,255,0.09)'; ctx.lineWidth = 2;
  roundRect(ctx, b.x + 9, b.y + 9, b.w - 18, b.h - 18, 2); ctx.stroke();
  ctx.fillStyle = 'rgba(0,0,0,0.13)';
  ctx.fillRect(b.x + 9, b.y + 9, b.w - 18, b.h - 18);

  // rooftop details
  const seed = (b.x * 13 + b.y * 7) % 97;
  const n = 1 + (seed % 3);
  for (let i = 0; i < n; i++) {
    const w = 18 + ((seed * (i + 2)) % 26);
    const h = 14 + ((seed * (i + 3)) % 20);
    const x = b.x + 22 + ((seed * (i + 5) * 7) % Math.max(1, b.w - 60));
    const y = b.y + 22 + ((seed * (i + 9) * 5) % Math.max(1, b.h - 60));
    ctx.fillStyle = shade(b.trim, -12);
    roundRect(ctx, x, y, w, h, 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(x + 2, y + 2, w - 4, 3);
  }
  // skylight strip
  ctx.fillStyle = 'rgba(120,160,190,0.16)';
  ctx.fillRect(b.x + b.w * 0.62, b.y + 18, b.w * 0.24, 10);

  // storefront / awning on south face
  if (b.kind !== 'generic') {
    const poi = city.pois.find((p) => p.id === b.poiId);
    const color = poi?.color || '#ffd400';
    const aw = Math.min(b.w - 24, 230);
    const ax = b.x + (b.w - aw) / 2;
    const ay = b.y + b.h - 30;
    ctx.fillStyle = shade(color, -35);
    roundRect(ctx, ax, ay, aw, 26, 4); ctx.fill();
    ctx.fillStyle = color;
    for (let i = 0; i < aw; i += 18) ctx.fillRect(ax + i, ay, Math.min(9, aw - i), 12);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(ax, ay + 12, aw, 3);
    // sign text
    ctx.fillStyle = '#fff';
    ctx.font = `700 ${Math.min(13, aw / 12)}px ${FONT_UI}`;
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 4;
    ctx.fillText(poi?.name?.toUpperCase() || b.name.toUpperCase(), b.x + b.w / 2, ay + 22);
    ctx.shadowBlur = 0;
    // door
    const dx = b.door.x, dy = b.door.y;
    ctx.fillStyle = '#101318';
    roundRect(ctx, dx - 20, dy - 8, 40, 16, 3); ctx.fill();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.75; ctx.fillRect(dx - 14, dy - 4, 28, 3); ctx.globalAlpha = 1;
    // icon badge above door
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath(); ctx.arc(dx, dy + 20, 13, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(dx, dy + 20, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#111';
    ctx.font = `700 12px ${FONT}`; ctx.textAlign = 'center';
    ctx.fillText(poi?.letter || '?', dx, dy + 24);
  } else {
    // generic sign
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = `600 10px ${FONT_UI}`; ctx.textAlign = 'center';
    ctx.fillText(b.name, b.x + b.w / 2, b.y + b.h - 14);
    // entrance
    const dx = b.door.x, dy = b.door.y;
    ctx.fillStyle = '#15181d'; ctx.fillRect(dx - 13, dy - 6, 26, 12);
    ctx.fillStyle = 'rgba(255,210,90,0.5)'; ctx.fillRect(dx - 9, dy - 3, 18, 2);
  }
}

function drawTree(ctx, t) {
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.beginPath(); ctx.ellipse(t.x + 4, t.y + 6, t.r * 0.95, t.r * 0.7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = `hsl(${t.hue}, 32%, 24%)`;
  ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = `hsl(${t.hue}, 36%, 31%)`;
  ctx.beginPath(); ctx.arc(t.x - t.r * 0.22, t.y - t.r * 0.25, t.r * 0.72, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = `hsl(${t.hue}, 42%, 38%)`;
  ctx.beginPath(); ctx.arc(t.x - t.r * 0.34, t.y - t.r * 0.4, t.r * 0.38, 0, Math.PI * 2); ctx.fill();
}

function drawLamp(ctx, l) {
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(l.x + 2, l.y + 3, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4a4f57';
  ctx.beginPath(); ctx.arc(l.x, l.y, 3.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,220,130,0.35)';
  ctx.beginPath(); ctx.arc(l.x, l.y, 7, 0, Math.PI * 2); ctx.fill();
}

export function renderStatic() {
  const c = document.createElement('canvas');
  c.width = WORLD.w; c.height = WORLD.h;
  const ctx = c.getContext('2d');
  drawRoads(ctx);

  const park = city.pois.find((p) => p.type === 'park');
  if (park) drawPark(ctx, park);
  const gas = city.pois.find((p) => p.type === 'gas');
  if (gas) drawGasStation(ctx, gas);

  // building shadows first for depth
  for (const b of city.buildings) {
    if (b.kind === 'park') continue;
    const lift = Math.min(14, b.floors * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    roundRect(ctx, b.x + 10 + lift * 0.35, b.y + 12 + lift * 0.35, b.w, b.h, 4); ctx.fill();
  }
  for (const b of city.buildings) {
    if (b.kind === 'park') continue;
    drawBuilding(ctx, b);
  }

  // dealer lot markings
  const dealer = city.pois.find((p) => p.type === 'dealer');
  if (dealer && dealer.carLot) {
    const l = dealer.carLot;
    ctx.fillStyle = '#2b2f35'; ctx.fillRect(l.x, l.y, l.w, l.h);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath(); ctx.moveTo(l.x + i * (l.w / 4), l.y + 8); ctx.lineTo(l.x + i * (l.w / 4), l.y + l.h - 8); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,212,0,0.7)'; ctx.font = `700 12px ${FONT_UI}`; ctx.textAlign = 'center';
    ctx.fillText('AUTOS DELUXE', l.x + l.w / 2, l.y + l.h - 10);
  }

  for (const t of city.trees) drawTree(ctx, t);
  for (const l of city.lamps) drawLamp(ctx, l);
  for (const b of city.benches) {
    ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a);
    ctx.fillStyle = '#5b4a35'; roundRect(ctx, -16, -6, 32, 12, 2); ctx.fill();
    ctx.fillStyle = '#6e5a40'; ctx.fillRect(-16, -8, 32, 3);
    ctx.restore();
  }

  // Block names painted on sidewalks
  ctx.textAlign = 'center';
  for (let by = 0; by < 5; by++) {
    for (let bx = 0; bx < 5; bx++) {
      const b = blockBounds(bx, by);
      if ((bx + by) % 2 === 0) continue;
      ctx.save();
      ctx.translate(b.cx, b.y1 + 34);
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      ctx.font = `700 11px ${FONT_UI}`;
      ctx.fillText('SUNSET CITY', 0, 0);
      ctx.restore();
    }
  }

  // Outer border / ocean hint
  const g = ctx.createLinearGradient(0, 0, 0, 70);
  g.addColorStop(0, 'rgba(20,50,70,0.9)'); g.addColorStop(1, 'rgba(20,50,70,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, WORLD.w, 70);

  city.staticCanvas = c;
  return c;
}

export function buildMinimapBase(size = 760) {
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d');
  const s = size / WORLD.w;
  ctx.fillStyle = '#0d1117'; ctx.fillRect(0, 0, size, size);
  if (city.staticCanvas) {
    ctx.globalAlpha = 0.72;
    ctx.drawImage(city.staticCanvas, 0, 0, size, size);
    ctx.globalAlpha = 1;
  }
  // darken + tint
  ctx.fillStyle = 'rgba(8,12,18,0.35)'; ctx.fillRect(0, 0, size, size);
  // POI dots
  for (const p of city.pois) {
    if (!p.door) continue;
    const x = p.door.x * s, y = p.door.y * s;
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(x, y, 3.4, 0, Math.PI * 2); ctx.fill();
  }
  city.minimapCanvas = c;
  return c;
}

// ---------------- dynamic entity drawing ----------------

export function drawPerson(ctx, p, opts = {}) {
  const r = opts.radius || 11;
  const skin = p.skin || '#dda57a';
  const shirt = p.shirt || '#ffd400';
  const pants = p.pants || '#252a33';
  const acc = p.accessory || 'none';
  const moving = (p.moving || 0);
  const t = p.walkPhase || 0;
  const swing = Math.sin(t) * (moving > 0.1 ? 4 : 0);

  ctx.save();
  ctx.translate(p.x, p.y);
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.32)';
  ctx.beginPath(); ctx.ellipse(2, 3, r * 1.05, r * 0.78, 0, 0, Math.PI * 2); ctx.fill();
  ctx.rotate((p.angle || 0) + Math.PI / 2);

  // legs
  ctx.fillStyle = pants;
  roundRect(ctx, -r * 0.62, r * 0.05 + swing, r * 0.45, r * 0.9, 2.5); ctx.fill();
  roundRect(ctx, r * 0.17, r * 0.05 - swing, r * 0.45, r * 0.9, 2.5); ctx.fill();
  // shoes
  ctx.fillStyle = '#14161a';
  ctx.fillRect(-r * 0.62, r * 0.78 + swing, r * 0.45, r * 0.2);
  ctx.fillRect(r * 0.17, r * 0.78 - swing, r * 0.45, r * 0.2);

  // torso
  ctx.fillStyle = shirt;
  roundRect(ctx, -r * 0.72, -r * 0.55, r * 1.44, r * 1.05, r * 0.38); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1;
  roundRect(ctx, -r * 0.72, -r * 0.55, r * 1.44, r * 1.05, r * 0.38); ctx.stroke();
  // arms
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(-r * 0.78, -r * 0.05 + swing * 0.5, r * 0.26, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(r * 0.78, -r * 0.05 - swing * 0.5, r * 0.26, 0, Math.PI * 2); ctx.fill();

  // head
  const hx = 0, hy = -r * 0.42;
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(hx, hy, r * 0.62, 0, Math.PI * 2); ctx.fill();
  // hair
  ctx.fillStyle = p.hair || '#241a14';
  ctx.beginPath(); ctx.arc(hx, hy - r * 0.16, r * 0.6, Math.PI * 1.03, Math.PI * 1.97); ctx.fill();

  if (acc === 'cap') {
    ctx.fillStyle = p.capColor || shirt;
    ctx.beginPath(); ctx.arc(hx, hy, r * 0.64, Math.PI, Math.PI * 2); ctx.fill();
    ctx.fillRect(hx - r * 0.64, hy - r * 0.12, r * 1.28, r * 0.22);
  } else if (acc === 'beanie') {
    ctx.fillStyle = '#2a2e36';
    ctx.beginPath(); ctx.arc(hx, hy - r * 0.08, r * 0.62, Math.PI * 0.98, Math.PI * 2.02); ctx.fill();
    ctx.fillStyle = '#3a404b'; ctx.fillRect(hx - r * 0.62, hy - r * 0.2, r * 1.24, r * 0.2);
  } else if (acc === 'shades') {
    ctx.fillStyle = '#0b0d10';
    ctx.fillRect(hx - r * 0.5, hy - r * 0.02, r, r * 0.2);
  } else if (acc === 'chain') {
    ctx.fillStyle = '#ffd400';
    ctx.beginPath(); ctx.arc(hx, hy + r * 0.52, r * 0.16, 0, Math.PI * 2); ctx.fill();
  }

  // weapon in hand
  if (p.weapon && opts.showWeapon) {
    ctx.fillStyle = '#20242b';
    ctx.fillRect(r * 0.7, -r * 0.15, r * 1.15, r * 0.18);
    ctx.fillStyle = '#3a404a';
    ctx.fillRect(r * 0.72, -r * 0.22, r * 0.5, r * 0.3);
  }

  ctx.restore();

  // name tag
  if (opts.nameTag) {
    const label = p.name || 'Jugador';
    ctx.save();
    ctx.font = `700 11px ${FONT_UI}`;
    ctx.textAlign = 'center';
    const w = ctx.measureText(label).width + 14;
    ctx.fillStyle = 'rgba(6,8,11,0.66)';
    roundRect(ctx, p.x - w / 2, p.y - r - 26, w, 17, 4); ctx.fill();
    ctx.fillStyle = opts.tagColor || '#fff';
    ctx.fillText(label, p.x, p.y - r - 13);
    ctx.restore();
  }
}

export function drawVehicle(ctx, v, opts = {}) {
  const def = VEHICLE_TYPES[v.type] || VEHICLE_TYPES.sedan;
  const L = def.len, W = def.wid;
  ctx.save();
  ctx.translate(v.x, v.y);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  roundRect(ctx, -L / 2 + 4, -W / 2 + 5, L, W, 10); ctx.fill();
  ctx.rotate(v.angle || 0);

  // wheels
  ctx.fillStyle = '#0d0f12';
  roundRect(ctx, -L * 0.34, -W / 2 - 2, L * 0.2, 5, 2); ctx.fill();
  roundRect(ctx, L * 0.16, -W / 2 - 2, L * 0.2, 5, 2); ctx.fill();
  roundRect(ctx, -L * 0.34, W / 2 - 3, L * 0.2, 5, 2); ctx.fill();
  roundRect(ctx, L * 0.16, W / 2 - 3, L * 0.2, 5, 2); ctx.fill();

  // body
  const color = v.color || '#c0392b';
  ctx.fillStyle = color;
  roundRect(ctx, -L / 2, -W / 2, L, W, 9); ctx.fill();
  // body shade
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  roundRect(ctx, -L / 2 + 3, W / 2 - 8, L - 6, 5, 3); ctx.fill();
  // hood/trunk lines
  ctx.strokeStyle = 'rgba(0,0,0,0.28)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-L * 0.2, -W / 2 + 3); ctx.lineTo(-L * 0.2, W / 2 - 3);
  ctx.moveTo(L * 0.22, -W / 2 + 3); ctx.lineTo(L * 0.22, W / 2 - 3); ctx.stroke();

  // cabin
  ctx.fillStyle = 'rgba(15,20,26,0.9)';
  roundRect(ctx, -L * 0.17, -W / 2 + 5, L * 0.38, W - 10, 5); ctx.fill();
  ctx.fillStyle = 'rgba(120,170,200,0.4)';
  roundRect(ctx, -L * 0.13, -W / 2 + 7, L * 0.13, W - 14, 3); ctx.fill();
  roundRect(ctx, L * 0.04, -W / 2 + 7, L * 0.1, W - 14, 3); ctx.fill();
  // roof stripe
  ctx.fillStyle = 'rgba(255,255,255,0.09)';
  ctx.fillRect(-L * 0.05, -W / 2 + 6, L * 0.16, W - 12);

  // lights
  ctx.fillStyle = '#fff4c4';
  roundRect(ctx, L / 2 - 5, -W / 2 + 5, 4, 8, 2); ctx.fill();
  roundRect(ctx, L / 2 - 5, W / 2 - 13, 4, 8, 2); ctx.fill();
  ctx.fillStyle = '#ff3b30';
  roundRect(ctx, -L / 2 + 1, -W / 2 + 5, 3, 7, 1); ctx.fill();
  roundRect(ctx, -L / 2 + 1, W / 2 - 12, 3, 7, 1); ctx.fill();

  if (v.type === 'taxi') {
    ctx.fillStyle = '#ffd400';
    roundRect(ctx, -L * 0.08, -W / 2 + 8, L * 0.16, W - 16, 2); ctx.fill();
    ctx.fillStyle = '#111';
    ctx.font = `700 8px ${FONT_UI}`; ctx.textAlign = 'center';
    ctx.fillText('TAXI', 0, 3);
  }
  if (v.type === 'van') {
    ctx.fillStyle = 'rgba(255,255,255,0.13)';
    roundRect(ctx, -L * 0.42, -W / 2 + 6, L * 0.18, W - 12, 3); ctx.fill();
  }

  // damage
  if (v.damage > 40) {
    ctx.strokeStyle = 'rgba(20,20,20,0.6)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-L * 0.3, -W * 0.2); ctx.lineTo(-L * 0.1, W * 0.1); ctx.lineTo(-L * 0.22, W * 0.3); ctx.stroke();
  }
  ctx.restore();

  // night headlights
  if (opts.night) {
    ctx.save();
    ctx.translate(v.x, v.y); ctx.rotate(v.angle);
    const grad = ctx.createRadialGradient(L / 2, 0, 4, L / 2, 0, 190);
    grad.addColorStop(0, 'rgba(255,244,190,0.28)');
    grad.addColorStop(0.5, 'rgba(255,244,190,0.09)');
    grad.addColorStop(1, 'rgba(255,244,190,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.moveTo(L / 2, 0); ctx.arc(L / 2, 0, 190, -0.4, 0.4); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
}

export function drawMarker(ctx, x, y, color, letter, time) {
  const bob = Math.sin(time * 3) * 3;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(0, 18 - bob, 16, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(11, 9); ctx.lineTo(0, 26); ctx.lineTo(-11, 9); ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#111';
  ctx.font = `700 12px ${FONT}`; ctx.textAlign = 'center';
  ctx.fillText(letter, 0, 13);
  ctx.restore();
}

export function drawWaypoint(ctx, x, y, time) {
  const pulse = 1 + Math.sin(time * 4) * 0.12;
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = 'rgba(255,212,0,0.9)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(0, 0, 26 * pulse, 14 * pulse, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = 'rgba(255,212,0,0.16)';
  ctx.beginPath(); ctx.ellipse(0, 0, 26 * pulse, 14 * pulse, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,212,0,0.9)';
  ctx.beginPath(); ctx.moveTo(0, -46); ctx.lineTo(9, -32); ctx.lineTo(-9, -32); ctx.closePath(); ctx.fill();
  ctx.restore();
}
