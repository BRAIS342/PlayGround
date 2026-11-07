// Persistent player profile
const KEY = 'sunset-city-rp-profile-v1';

export const DEFAULT_PROFILE = {
  name: '',
  skin: '#dda57a',
  shirt: '#ffd400',
  pants: '#252a33',
  accessory: 'none',
  hair: '#241a14',
  money: 750,
  bank: 1200,
  level: 1,
  xp: 0,
  health: 100,
  hunger: 100,
  thirst: 100,
  armor: 0,
  inventory: { water: 2, sandwich: 1 },
  weapons: { pistol: { owned: true, ammo: 12 } },
  currentWeapon: 'pistol',
  license: false,
  paycheckAt: 0,
  stats: { deliveries: 0, taxi: 0, repairs: 0, spent: 0, earned: 0, distance: 0 },
  position: null,
  outfit: null,
  playTime: 0,
  lastSave: 0,
};

export const profile = structuredClone(DEFAULT_PROFILE);

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    Object.assign(profile, structuredClone(DEFAULT_PROFILE), data);
    profile.inventory = { ...DEFAULT_PROFILE.inventory, ...(data.inventory || {}) };
    profile.weapons = { ...DEFAULT_PROFILE.weapons, ...(data.weapons || {}) };
    profile.stats = { ...DEFAULT_PROFILE.stats, ...(data.stats || {}) };
    return !!profile.name;
  } catch { return false; }
}

export function saveProfile() {
  try {
    profile.lastSave = Date.now();
    localStorage.setItem(KEY, JSON.stringify(profile));
  } catch { /* storage may be unavailable */ }
}

export function resetProfile() {
  try { localStorage.removeItem(KEY); } catch {}
  Object.assign(profile, structuredClone(DEFAULT_PROFILE));
}

export function addXP(amount) {
  profile.xp += amount;
  let leveled = false;
  while (profile.xp >= xpForLevel(profile.level)) {
    profile.xp -= xpForLevel(profile.level);
    profile.level += 1;
    leveled = true;
  }
  return leveled;
}

export function xpForLevel(level) { return 100 + (level - 1) * 65; }

export function xpProgress() {
  return Math.min(1, profile.xp / xpForLevel(profile.level));
}

export function addMoney(amount) {
  profile.money = Math.max(0, Math.round(profile.money + amount));
  if (amount > 0) profile.stats.earned += amount;
  else profile.stats.spent += -amount;
}

export function addItem(id, qty = 1) {
  profile.inventory[id] = (profile.inventory[id] || 0) + qty;
}

export function removeItem(id, qty = 1) {
  if (!profile.inventory[id] || profile.inventory[id] < qty) return false;
  profile.inventory[id] -= qty;
  if (profile.inventory[id] <= 0) delete profile.inventory[id];
  return true;
}

export function fmtMoney(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

export function fmtTime(hours) {
  const h = Math.floor(hours) % 24;
  const m = Math.floor((hours % 1) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
