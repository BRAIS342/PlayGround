// HUD, chat, toasts, start screen
import { COLORS } from './data.js';
import { fmtMoney, profile } from './state.js';
import { drawAvatar } from './avatar.js';
import { sfx, resumeAudio } from './audio.js';

const $ = (id) => document.getElementById(id);

export const UI = {
  cb: {},
  chatOpen: false,
  creator: { skin: profile.skin, shirt: profile.shirt, pants: profile.pants, accessory: profile.accessory },
  cache: {},
  chatLines: [],

  init(cb) {
    this.cb = cb;
    this.initStart();
    this.bindHUD();
    this.bindChat();
    $('btn-phone').onclick = () => { resumeAudio(); sfx.click(); this.cb.onPhone?.(); };
    $('btn-map').onclick = () => { sfx.click(); this.cb.onMap?.(); };
    $('btn-chat').onclick = () => { this.openChat(); };
    $('btn-sound').onclick = () => { this.cb.onSoundToggle?.(); };
    $('btn-resume').onclick = () => { sfx.click(); this.cb.onResume?.(); };
    $('btn-exit').onclick = () => { sfx.click(); this.cb.onExit?.(); };
    this.buildMobile();
  },

  // ---------- START / CREATOR ----------
  initStart() {
    $('skin-swatches').innerHTML = COLORS.skins.map((c, i) => `<button class="swatch" data-skin="${c}" style="background:${c}" aria-label="Piel ${i + 1}"></button>`).join('');
    $('shirt-swatches').innerHTML = COLORS.shirts.map((c) => `<button class="swatch" data-shirt="${c}" style="background:${c}" aria-label="Camiseta"></button>`).join('');
    $('pants-swatches').innerHTML = COLORS.pants.map((c) => `<button class="swatch" data-pants="${c}" style="background:${c}" aria-label="Pantalón"></button>`).join('');
    const accNames = { none: 'NO', cap: 'GORRA', shades: 'GAFAS', chain: 'CADENA', beanie: 'GORRO' };
    $('acc-swatches').innerHTML = COLORS.accessories.map((a) => `<button class="swatch accessory" data-acc="${a}" aria-label="${a}">${accNames[a]}</button>`).join('');

    document.querySelectorAll('[data-skin]').forEach((b) => b.onclick = () => this.setCreator('skin', b.dataset.skin));
    document.querySelectorAll('[data-shirt]').forEach((b) => b.onclick = () => this.setCreator('shirt', b.dataset.shirt));
    document.querySelectorAll('[data-pants]').forEach((b) => b.onclick = () => this.setCreator('pants', b.dataset.pants));
    document.querySelectorAll('[data-acc]').forEach((b) => b.onclick = () => this.setCreator('accessory', b.dataset.acc));

    $('btn-start').onclick = () => {
      resumeAudio();
      const name = ($('name-input').value || '').trim();
      if (name.length < 2) {
        $('name-input').focus();
        $('name-input').style.borderColor = '#ff4d5e';
        this.toast('Escribe un nombre de rol (mín. 2 letras)', 'bad', 'x');
        setTimeout(() => { $('name-input').style.borderColor = ''; }, 1400);
        return;
      }
      sfx.job();
      this.cb.onStart?.({ name, ...this.creator });
    };
    $('btn-continue').onclick = () => { resumeAudio(); sfx.job(); this.cb.onContinue?.(); };
    $('name-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('btn-start').click(); });
    this.refreshCreator();
  },

  setCreator(key, value) {
    this.creator[key] = value;
    this.refreshCreator();
    sfx.click();
  },

  refreshCreator() {
    document.querySelectorAll('[data-skin]').forEach((b) => b.classList.toggle('active', b.dataset.skin === this.creator.skin));
    document.querySelectorAll('[data-shirt]').forEach((b) => b.classList.toggle('active', b.dataset.shirt === this.creator.shirt));
    document.querySelectorAll('[data-pants]').forEach((b) => b.classList.toggle('active', b.dataset.pants === this.creator.pants));
    document.querySelectorAll('[data-acc]').forEach((b) => b.classList.toggle('active', b.dataset.acc === this.creator.accessory));
    const cv = $('avatar-preview');
    if (cv) drawAvatar(cv, this.creator);
  },

  showStart(hasSave) {
    $('start-screen').classList.remove('hidden');
    $('hud').classList.add('hidden');
    $('pause-screen').classList.add('hidden');
    $('mobile-controls').classList.add('hidden');
    $('btn-continue').classList.toggle('hidden', !hasSave);
    $('name-input').value = profile.name || '';
    if (profile.name) {
      this.creator = { skin: profile.skin, shirt: profile.shirt, pants: profile.pants, accessory: profile.accessory };
      this.refreshCreator();
    }
  },

  hideStart() {
    $('start-screen').classList.add('hidden');
    $('hud').classList.remove('hidden');
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) $('mobile-controls').classList.remove('hidden');
  },

  // ---------- HUD ----------
  bindHUD() {
    $('wanted').innerHTML = Array.from({ length: 5 }, () => '<svg class="icon"><use href="#i-star"/></svg>').join('');
  },

  updateHUD(d) {
    const c = this.cache;
    if (c.money !== d.money) { $('money').textContent = fmtMoney(d.money); c.money = d.money; }
    if (c.bank !== d.bank) { $('bank').textContent = fmtMoney(d.bank); c.bank = d.bank; }
    if (c.health !== d.health) { $('bar-health').style.width = d.health + '%'; $('val-health').textContent = Math.round(d.health); c.health = d.health; }
    if (c.armor !== d.armor) {
      $('bar-armor').style.width = d.armor + '%'; $('val-armor').textContent = Math.round(d.armor);
      $('bar-armor').parentElement.parentElement.classList.toggle('active', d.armor > 0);
      c.armor = d.armor;
    }
    if (c.hunger !== d.hunger) { $('bar-hunger').style.width = d.hunger + '%'; $('val-hunger').textContent = Math.round(d.hunger); c.hunger = d.hunger; }
    if (c.thirst !== d.thirst) { $('bar-thirst').style.width = d.thirst + '%'; $('val-thirst').textContent = Math.round(d.thirst); c.thirst = d.thirst; }
    if (c.clock !== d.clock) { $('clock').textContent = d.clock; $('phone-time').textContent = d.clock; c.clock = d.clock; }
    if (c.location !== d.location) { $('location-name').textContent = d.location; $('zone-label').textContent = d.location.toUpperCase(); c.location = d.location; }
    if (c.online !== d.online) { $('online-count').textContent = d.online + ' en línea'; c.online = d.online; }
    if (c.level !== d.level || c.xp !== d.xp) {
      $('level').textContent = d.level;
      document.querySelector('#xp-bar u').style.width = (d.xp * 100).toFixed(1) + '%';
      c.level = d.level; c.xp = d.xp;
    }
    if (c.wanted !== d.wanted) {
      $('wanted').classList.toggle('hidden', d.wanted <= 0);
      [...$('wanted').children].forEach((el, i) => el.classList.toggle('on', i < d.wanted));
      c.wanted = d.wanted;
    }
    if (c.weapon !== d.weaponKey) {
      if (d.weaponKey) {
        $('weapon-chip').classList.remove('hidden');
        $('weapon-name').textContent = d.weaponName;
        $('weapon-ammo').textContent = d.weaponAmmo;
      } else $('weapon-chip').classList.add('hidden');
      c.weapon = d.weaponKey;
    } else if (d.weaponKey && c.weaponAmmo !== d.weaponAmmo) {
      $('weapon-ammo').textContent = d.weaponAmmo;
      c.weaponAmmo = d.weaponAmmo;
    }
    if (c.vehicle !== d.vehicleKey) {
      if (d.vehicleKey) {
        $('vehicle-chip').classList.remove('hidden');
        $('vehicle-name').textContent = d.vehicleName;
      } else $('vehicle-chip').classList.add('hidden');
      c.vehicle = d.vehicleKey;
    }
    if (d.vehicleKey) {
      $('vehicle-speed').textContent = Math.round(d.speed * 0.42);
      $('vehicle-fuel').textContent = Math.round(d.fuel) + '%';
      $('fuel-fill').style.width = d.fuel + '%';
      $('fuel-fill').style.background = d.fuel < 18 ? '#ff4d5e' : d.fuel < 40 ? '#ffb800' : '#46d98b';
    }
  },

  setPrompt(text) {
    const el = $('interact-prompt');
    if (!text) { el.classList.add('hidden'); return; }
    el.classList.remove('hidden');
    if (this.cache.prompt !== text) { $('interact-text').textContent = text; this.cache.prompt = text; }
  },

  setHint(text) {
    $('action-hint').textContent = text || '';
  },

  setMission(m) {
    const el = $('mission-chip');
    if (!m) { el.classList.add('hidden'); return; }
    el.classList.remove('hidden');
    $('mission-tag').textContent = m.tag || 'TRABAJO';
    $('mission-title').textContent = m.title;
    $('mission-desc').textContent = m.desc;
    $('mission-timer').textContent = m.timer;
    $('mission-distance').textContent = m.distance;
  },

  // ---------- CHAT ----------
  bindChat() {
    const input = $('chat-input');
    input.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        const text = input.value.trim();
        input.value = '';
        if (text) this.cb.onChatInput?.(text);
        this.closeChat();
      } else if (e.key === 'Escape') { input.value = ''; this.closeChat(); }
    });
    input.addEventListener('blur', () => { if (this.chatOpen) setTimeout(() => this.closeChat(), 120); });
  },

  openChat() {
    if (this.chatOpen) return;
    this.chatOpen = true;
    $('chat-input-wrap').classList.remove('hidden');
    $('chat-channel').textContent = 'LOCAL';
    setTimeout(() => $('chat-input').focus(), 10);
  },

  closeChat() {
    this.chatOpen = false;
    $('chat-input-wrap').classList.add('hidden');
    $('chat-input').blur();
  },

  chat({ channel = 'local', name = '', text = '', color = '#fff', tag = null }) {
    const log = $('chat-log');
    const line = document.createElement('div');
    line.className = 'chat-line ' + channel;
    const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    let tagHtml = '';
    if (tag) tagHtml = `<span class="tag ${tag.cls}">${tag.text}</span>`;
    if (channel === 'system') {
      line.innerHTML = `<span class="ch-time">${time}</span>${esc(text)}`;
    } else if (channel === 'me') {
      line.innerHTML = `<span class="ch-time">${time}</span><b style="color:${color}">${esc(name)}</b> ${esc(text)}`;
    } else if (channel === 'do') {
      line.innerHTML = `<span class="ch-time">${time}</span><span style="color:#8f99a7">* ${esc(text)} *</span>`;
    } else {
      line.innerHTML = `<span class="ch-time">${time}</span>${tagHtml}<b style="color:${color}">${esc(name)}</b>: ${esc(text)}`;
    }
    log.appendChild(line);
    while (log.children.length > 40) log.removeChild(log.firstChild);
    this.chatLines.push(line);
    if (this.chatLines.length > 60) this.chatLines.shift();
    if (!this.chatOpen) sfx.chat();
  },

  // ---------- TOASTS ----------
  toast(text, type = 'info', icon = 'check') {
    const wrap = $('toasts');
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.innerHTML = `<svg class="icon"><use href="#i-${icon}"/></svg><span>${text}</span>`;
    wrap.appendChild(el);
    if (wrap.children.length > 4) wrap.removeChild(wrap.firstChild);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 260); }, 3200);
  },

  // ---------- MOBILE ----------
  buildMobile() {
    const actions = document.querySelectorAll('.mob-btn');
    actions.forEach((b) => {
      const act = b.dataset.action;
      b.addEventListener('pointerdown', (e) => {
        e.preventDefault(); e.stopPropagation();
        resumeAudio();
        if (act === 'sprint') this.cb.onMobileSprint?.(true);
        else if (act === 'chat') this.openChat();
        else this.cb.onMobileAction?.(act);
      });
      if (act === 'sprint') b.addEventListener('pointerup', () => this.cb.onMobileSprint?.(false));
      if (act === 'sprint') b.addEventListener('pointerleave', () => this.cb.onMobileSprint?.(false));
    });
  },

  showPause(v) { $('pause-screen').classList.toggle('hidden', !v); },
};
