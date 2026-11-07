// Sunset City RP — world generation & static rendering
import { WORLD, ROAD_LINES, ROAD_W, BLOCK_POI, POIS, BUILDING_PALETTES, GENERIC_NAMES } from './data.js';

export const rand = (a, b) => a + Math.random() * (b - a);
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
export const lerp = (a, b, t) => a + (b - a) * t;
export const angleLerp = (a, b, t) => {
  let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
};

export function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const rr = makeRng(20261107);
const pick = (arr) => arr[Math.floor(rr() * arr.length)];

// Block bounds: between road edges
export function blockBounds(bx, by) {
  const x0 = ROAD_LINES[bx] + ROAD_W / 2 + 12;
  const x1 = ROAD_LINES[bx + 1] - ROAD_W / 2 - 12;
  const y0 = ROAD_LINES[by] + ROAD_W / 2 + 12;
  const y1 = ROAD_LINES[by + 1] - ROAD_W / 2 - 12;
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
}

export const city = {
  buildings: [],
  pois: [],
  props: [],
  cars: [],
  lamps: [],
  trees: [],
  benches: [],
  lanes: [],
  parked: [],
  crosswalks: [],
  staticCanvas: null,
  minimapCanvas: null,
};

function addBuilding(b) { city.buildings.push(b); }

function buildGenericBlock(bx, by) {
  const b = blockBounds(bx, by);
  const palette = pick(BUILDING_PALETTES);
  const name = GENERIC_NAMES[(bx * 5 + by) % GENERIC_NAMES.length];
  const layout = rr();
  const margin = 16;

  if (layout < 0.42) {
    // one large building
    const w = b.w - margin * 2;
    const h = b.h - margin * 2;
    addBuilding({
      x: b.x0 + margin, y: b.y0 + margin, w, h,
      ...palette, name, floors: 2 + Math.floor(rr() * 5), kind: 'generic',
      door: { x: b.cx, y: b.y1 - margin - 6 }, block: [bx, by],
    });
  } else if (layout < 0.72) {
    // two buildings split vertically
    const gap = 18;
    const w = (b.w - margin * 2 - gap) / 2;
    const h = b.h - margin * 2;
    for (let i = 0; i < 2; i++) {
      addBuilding({
        x: b.x0 + margin + i * (w + gap), y: b.y0 + margin, w, h,
        ...palette, name: i === 0 ? name : GENERIC_NAMES[(bx * 5 + by + 3) % GENERIC_NAMES.length],
        floors: 2 + Math.floor(rr() * 4), kind: 'generic',
        door: { x: b.x0 + margin + i * (w + gap) + w / 2, y: b.y1 - margin - 6 }, block: [bx, by],
      });
    }
  } else {
    // four buildings
    const gap = 16;
    const w = (b.w - margin * 2 - gap) / 2;
    const h = (b.h - margin * 2 - gap) / 2;
    for (let i = 0; i < 4; i++) {
      const gx = i % 2, gy = Math.floor(i / 2);
      addBuilding({
        x: b.x0 + margin + gx * (w + gap), y: b.y0 + margin + gy * (h + gap), w, h,
        ...palette, name: GENERIC_NAMES[(bx * 5 + by + i * 2) % GENERIC_NAMES.length],
        floors: 1 + Math.floor(rr() * 4), kind: 'generic',
        door: { x: b.x0 + margin + gx * (w + gap) + w / 2, y: b.y0 + margin + gy * (h + gap) + h - 5 },
        block: [bx, by],
      });
    }
  }
}

function addPOIBuilding(poi) {
  const [bx, by] = poi.block;
  const b = blockBounds(bx, by);
  const palette = pick(BUILDING_PALETTES);
  const isPark = poi.type === 'park';
  const isGas = poi.type === 'gas';
  const isLot = poi.type === 'dealer' || poi.type === 'motel' || isGas;

  if (isPark) {
    poi.rect = { x: b.x0 + 6, y: b.y0 + 6, w: b.w - 12, h: b.h - 12 };
    poi.door = { x: b.cx, y: b.y1 - 26 };
    poi.cx = b.cx; poi.cy = b.cy;
    return;
  }

  let w = isLot ? b.w - 40 : Math.min(b.w - 60, 340);
  let h = isLot ? b.h - 100 : Math.min(b.h - 80, 240);
  const x = b.cx - w / 2;
  const y = b.y0 + 22;

  const building = {
    x, y, w, h, ...palette, name: poi.full, floors: poi.type === 'bank' ? 6 : 2 + Math.floor(rr() * 3),
    kind: poi.type, poiId: poi.id, block: [bx, by],
    door: { x: b.cx, y: y + h + 8 },
  };
  addBuilding(building);
  poi.rect = { x, y, w, h };
  poi.door = { x: b.cx, y: y + h + 14 };
  poi.cx = b.cx; poi.cy = b.cy;
  poi.bx = bx; poi.by = by;

  if (isGas) {
    // canopy + pumps in front
    poi.pumps = [
      { x: b.cx - 60, y: y + h + 58 },
      { x: b.cx + 60, y: y + h + 58 },
    ];
    poi.pumpArea = { x: b.x0 + 20, y: y + h + 16, w: b.w - 40, h: 100 };
    city.props.push({ type: 'canopy', x: b.cx, y: y + h + 58, w: b.w - 50, h: 96 });
  }
  if (poi.type === 'dealer') {
    poi.carLot = { x: b.x0 + 30, y: y + h + 20, w: b.w - 60, h: 110 };
  }
}

export function generateCity() {
  city.buildings.length = 0; city.pois.length = 0; city.props.length = 0;
  city.cars.length = 0; city.lamps.length = 0; city.trees.length = 0;
  city.benches.length = 0; city.parked.length = 0; city.crosswalks.length = 0;

  for (let by = 0; by < 5; by++) {
    for (let bx = 0; bx < 5; bx++) {
      const poi = BLOCK_POI[`${bx},${by}`];
      if (poi) {
        const p = { ...poi };
        city.pois.push(p);
        addPOIBuilding(p);
      } else {
        buildGenericBlock(bx, by);
      }
    }
  }

  // Street lamps along roads
  for (const line of ROAD_LINES) {
    for (let t = 420; t < WORLD.w; t += 360) {
      if (Math.abs(t - line) < 200) continue;
      city.lamps.push({ x: t, y: line - ROAD_W / 2 - 8, side: -1 });
      city.lamps.push({ x: line - ROAD_W / 2 - 8, y: t, side: 1 });
    }
  }

  // Trees & benches inside park and around sidewalks
  const park = city.pois.find((p) => p.type === 'park');
  if (park) {
    const r = park.rect;
    for (let i = 0; i < 16; i++) {
      const x = rand(r.x + 24, r.x + r.w - 24);
      const y = rand(r.y + 24, r.y + r.h - 24);
      if (dist(x, y, park.cx, park.cy) < 72) continue;
      city.trees.push({ x, y, r: rand(16, 25), hue: rand(95, 145) });
    }
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      city.benches.push({ x: park.cx + Math.cos(a) * 92, y: park.cy + Math.sin(a) * 92, a });
    }
  }
  for (let i = 0; i < 30; i++) {
    const line = pick(ROAD_LINES);
    const along = rand(240, WORLD.w - 240);
    city.trees.push({ x: line + ROAD_W / 2 + rand(8, 16), y: along, r: rand(9, 14), hue: rand(100, 140), small: true });
  }

  // Crosswalks at intersections
  for (const x of ROAD_LINES) {
    for (const y of ROAD_LINES) {
      city.crosswalks.push({ x, y });
    }
  }

  // Parked cars along curbs
  const carColors = ['#c0392b', '#2c3e50', '#ecf0f1', '#f39c12', '#27ae60', '#8e44ad', '#2980b9', '#7f8c8d', '#d35400', '#16a085'];
  let carIdx = 0;
  for (const line of ROAD_LINES.slice(1, 5)) {
    for (let t = 480; t < WORLD.w - 300; t += 300) {
      if (rr() < 0.55) {
        const type = pick(['sedan', 'compact', 'suv', 'sports', 'van', 'taxi']);
        city.parked.push({
          x: t + rand(-40, 40), y: line - ROAD_W / 2 + 34, angle: 0,
          type, color: carColors[carIdx++ % carColors.length], parked: true,
        });
      }
      if (rr() < 0.45) {
        const type = pick(['sedan', 'compact', 'suv', 'sports', 'van']);
        city.parked.push({
          x: line + ROAD_W / 2 - 34, y: t + rand(-40, 40), angle: Math.PI / 2,
          type, color: carColors[carIdx++ % carColors.length], parked: true,
        });
      }
    }
  }
  // Dealer lot cars
  const dealer = city.pois.find((p) => p.type === 'dealer');
  if (dealer && dealer.carLot) {
    const lot = dealer.carLot;
    const types = ['sedan', 'suv', 'sports', 'compact'];
    for (let i = 0; i < 4; i++) {
      city.parked.push({
        x: lot.x + 45 + i * ((lot.w - 90) / 3), y: lot.y + lot.h / 2,
        angle: 0, type: types[i], color: carColors[i + 3], parked: true, showroom: true,
      });
    }
  }

  // Road lane guides for AI traffic
  for (const y of ROAD_LINES) {
    city.lanes.push({ axis: 'h', at: y, dir: 1, offset: 26 });
    city.lanes.push({ axis: 'h', at: y, dir: -1, offset: -26 });
  }
  for (const x of ROAD_LINES) {
    city.lanes.push({ axis: 'v', at: x, dir: 1, offset: 26 });
    city.lanes.push({ axis: 'v', at: x, dir: -1, offset: -26 });
  }

  return city;
}

// ---------- collision ----------
export function rectsCollide(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export function collidesBuilding(x, y, pad = 0) {
  for (const b of city.buildings) {
    if (b.kind === 'park') continue;
    if (x > b.x - pad && x < b.x + b.w + pad && y > b.y - pad && y < b.y + b.h + pad) return b;
  }
  return null;
}

export function collidesCircleBuilding(x, y, r) {
  for (const b of city.buildings) {
    if (b.kind === 'park') continue;
    const nx = clamp(x, b.x, b.x + b.w);
    const ny = clamp(y, b.y, b.y + b.h);
    if ((x - nx) ** 2 + (y - ny) ** 2 < r * r) return b;
  }
  return null;
}

export function pointInRect(x, y, r) { return x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h; }

export function nearestPOI(x, y, maxDist = 90) {
  let best = null, bestD = maxDist;
  for (const p of city.pois) {
    if (!p.door) continue;
    const d = dist(x, y, p.door.x, p.door.y);
    if (d < bestD) { bestD = d; best = p; }
  }
  return best;
}

export function zoneName(x, y) {
  const cx = Math.round((x - 300) / 600);
  const cy = Math.round((y - 300) / 600);
  const p = city.pois.find((q) => q.block[0] === cx && q.block[1] === cy);
  if (p) return p.name;
  const names = ['Sunset Hills', 'Centro', 'Puerto', 'Vinewood', 'Aeropuerto', 'Little Seoul', 'Del Perro', 'Sandy Shores'];
  return names[Math.abs(Math.floor(x / 600) * 3 + Math.floor(y / 600)) % names.length];
}
