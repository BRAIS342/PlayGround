// Same-origin multiplayer via BroadcastChannel (works across tabs) with graceful solo fallback.
export class Net {
  constructor() {
    this.id = 'p' + Math.random().toString(36).slice(2, 9);
    this.remotes = new Map();
    this.handlers = {};
    this.lastSend = 0;
    this.channel = null;
    try {
      this.channel = new BroadcastChannel('sunset-city-rp');
      this.channel.onmessage = (e) => this.onMessage(e.data);
    } catch { this.channel = null; }
    this.online = !!this.channel;
  }

  on(handlers) { this.handlers = { ...this.handlers, ...handlers }; }

  announce(me) {
    this.me = me;
    this.send({ t: 'join', id: this.id, player: me });
  }

  send(msg) {
    if (!this.channel) return;
    try { this.channel.postMessage(msg); } catch {}
  }

  onMessage(msg) {
    if (!msg || msg.id === this.id) return;
    if (msg.t === 'join') {
      this.handlers.onJoin?.(msg);
      // reply so the newcomer learns about us
      if (this.me) this.send({ t: 'hello', id: this.id, player: this.me });
      return;
    }
    if (msg.t === 'hello') {
      this.handlers.onJoin?.(msg);
      return;
    }
    if (msg.t === 'leave') {
      this.remotes.delete(msg.id);
      this.handlers.onLeave?.(msg);
      return;
    }
    if (msg.t === 'state') {
      const prev = this.remotes.get(msg.id);
      const r = {
        id: msg.id,
        name: msg.name || prev?.name || 'Jugador',
        appearance: msg.appearance || prev?.appearance || {},
        x: prev ? prev.x : msg.x,
        y: prev ? prev.y : msg.y,
        angle: prev ? prev.angle : msg.angle,
        tx: msg.x, ty: msg.y, ta: msg.angle,
        moving: msg.moving || 0,
        vehicle: msg.vehicle || null,
        weapon: msg.weapon || null,
        lastSeen: performance.now(),
      };
      this.remotes.set(msg.id, r);
      this.handlers.onState?.(r);
      return;
    }
    if (msg.t === 'chat') { this.handlers.onChat?.(msg); return; }
    if (msg.t === 'event') { this.handlers.onEvent?.(msg); }
  }

  update(now, me) {
    if (!this.channel || !this.me) return;
    if (now - this.lastSend < 85) return;
    this.lastSend = now;
    this.send({
      t: 'state', id: this.id, name: this.me.name, appearance: this.me.appearance,
      x: Math.round(me.x * 10) / 10, y: Math.round(me.y * 10) / 10, angle: me.angle,
      moving: me.moving, vehicle: me.vehicle, weapon: me.weapon,
    });
    // drop stale remotes
    for (const [id, r] of this.remotes) {
      if (now - r.lastSeen > 6000) { this.remotes.delete(id); this.handlers.onLeave?.({ id, name: r.name }); }
    }
  }

  interpolate(dt) {
    const t = Math.min(1, dt * 11);
    for (const r of this.remotes.values()) {
      r.x += (r.tx - r.x) * t;
      r.y += (r.ty - r.y) * t;
      let d = ((r.ta - r.angle + Math.PI) % (Math.PI * 2)) - Math.PI;
      if (d < -Math.PI) d += Math.PI * 2;
      r.angle += d * t;
    }
  }

  chat(payload) {
    this.send({ t: 'chat', id: this.id, ...payload });
  }

  event(payload) {
    this.send({ t: 'event', id: this.id, ...payload });
  }

  leave() {
    this.send({ t: 'leave', id: this.id, name: this.me?.name });
    try { this.channel?.close(); } catch {}
  }
}

export function randomId() { return Math.random().toString(36).slice(2, 9); }
