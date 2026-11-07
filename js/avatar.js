// Character avatar drawing (front view) for creator & shops
function rr(ctx, x, y, w, h, r) {
  const q = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + q, y);
  ctx.arcTo(x + w, y, x + w, y + h, q);
  ctx.arcTo(x + w, y + h, x, y + h, q);
  ctx.arcTo(x, y + h, x, y, q);
  ctx.arcTo(x, y, x + w, y, q);
  ctx.closePath();
}

export function drawAvatar(canvas, app = {}, opts = {}) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const skin = app.skin || '#dda57a';
  const shirt = app.shirt || '#ffd400';
  const pants = app.pants || '#252a33';
  const acc = app.accessory || 'none';
  const hair = app.hair || '#241a14';

  ctx.save();
  const s = Math.min(W / 260, H / 300) * (opts.scale || 1);
  ctx.translate(W / 2, H / 2);
  ctx.scale(s, s);
  ctx.translate(0, 8);

  // floor shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(0, 128, 62, 12, 0, 0, Math.PI * 2); ctx.fill();

  // legs
  ctx.fillStyle = pants;
  rr(ctx, -40, 30, 34, 88, 10); ctx.fill();
  rr(ctx, 6, 30, 34, 88, 10); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  rr(ctx, -37, 34, 8, 76, 4); ctx.fill();
  rr(ctx, 9, 34, 8, 76, 4); ctx.fill();
  // shoes
  ctx.fillStyle = '#15171b';
  rr(ctx, -44, 108, 42, 18, 6); ctx.fill();
  rr(ctx, 2, 108, 42, 18, 6); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(-40, 118, 34, 3);
  ctx.fillRect(6, 118, 34, 3);

  // arms
  ctx.fillStyle = skin;
  rr(ctx, -66, -32, 22, 76, 10); ctx.fill();
  rr(ctx, 44, -32, 22, 76, 10); ctx.fill();
  // sleeves
  ctx.fillStyle = shirt;
  rr(ctx, -66, -36, 22, 34, 10); ctx.fill();
  rr(ctx, 44, -36, 22, 34, 10); ctx.fill();
  // hands
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(-55, 46, 11, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(55, 46, 11, 0, Math.PI * 2); ctx.fill();

  // torso
  ctx.fillStyle = shirt;
  rr(ctx, -48, -42, 96, 86, 20); ctx.fill();
  // torso shading
  ctx.fillStyle = 'rgba(0,0,0,0.16)';
  rr(ctx, 24, -42, 24, 86, 14); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  rr(ctx, -40, -36, 16, 70, 8); ctx.fill();
  // collar
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath(); ctx.ellipse(0, -38, 18, 8, 0, 0, Math.PI * 2); ctx.fill();
  // belt
  ctx.fillStyle = '#1b1d22';
  rr(ctx, -48, 34, 96, 12, 3); ctx.fill();
  ctx.fillStyle = '#c9a227';
  ctx.fillRect(-7, 35, 14, 10);
  ctx.fillStyle = '#0f1114';
  ctx.fillRect(-3, 38, 6, 4);

  // neck
  ctx.fillStyle = skin;
  rr(ctx, -12, -58, 24, 22, 8); ctx.fill();
  // head
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(0, -86, 38, 0, Math.PI * 2); ctx.fill();
  // ears
  ctx.beginPath(); ctx.arc(-38, -86, 8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(38, -86, 8, 0, Math.PI * 2); ctx.fill();
  // shading
  ctx.fillStyle = 'rgba(0,0,0,0.09)';
  ctx.beginPath(); ctx.arc(12, -80, 30, -0.6, 1.9); ctx.fill();

  // hair
  ctx.fillStyle = hair;
  ctx.beginPath(); ctx.arc(0, -92, 39, Math.PI * 1.02, Math.PI * 1.98); ctx.fill();
  ctx.beginPath(); ctx.arc(-30, -98, 15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(28, -99, 14, 0, Math.PI * 2); ctx.fill();
  // eyebrows
  ctx.strokeStyle = 'rgba(20,14,10,0.7)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-24, -96); ctx.lineTo(-9, -98); ctx.moveTo(9, -98); ctx.lineTo(24, -96); ctx.stroke();
  // eyes
  ctx.fillStyle = '#15171c';
  ctx.beginPath(); ctx.arc(-16, -88, 4.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(16, -88, 4.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath(); ctx.arc(-17.5, -89.5, 1.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(14.5, -89.5, 1.3, 0, Math.PI * 2); ctx.fill();
  // nose + mouth
  ctx.strokeStyle = 'rgba(120,70,50,0.45)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, -86); ctx.lineTo(-2, -78); ctx.lineTo(3, -77); ctx.stroke();
  ctx.strokeStyle = 'rgba(110,50,50,0.6)'; ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.arc(0, -72, 10, 0.25, Math.PI - 0.25); ctx.stroke();

  // accessories
  if (acc === 'cap') {
    ctx.fillStyle = shirt;
    ctx.beginPath(); ctx.arc(0, -100, 40, Math.PI, Math.PI * 2); ctx.fill();
    rr(ctx, -40, -104, 80, 13, 4); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    rr(ctx, -44, -102, 34, 9, 4); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(-8, -136, 16, 5);
  } else if (acc === 'beanie') {
    ctx.fillStyle = '#2b3038';
    ctx.beginPath(); ctx.arc(0, -102, 41, Math.PI, Math.PI * 2); ctx.fill();
    rr(ctx, -42, -106, 84, 16, 5); ctx.fill();
    ctx.fillStyle = '#3a4049'; ctx.fillRect(-42, -96, 84, 5);
  } else if (acc === 'shades') {
    ctx.fillStyle = '#0b0d10';
    rr(ctx, -31, -94, 27, 13, 4); ctx.fill();
    rr(ctx, 4, -94, 27, 13, 4); ctx.fill();
    ctx.fillRect(-5, -91, 10, 3);
    ctx.fillStyle = 'rgba(120,180,220,0.35)';
    rr(ctx, -27, -91, 8, 4, 2); ctx.fill();
    rr(ctx, 8, -91, 8, 4, 2); ctx.fill();
  } else if (acc === 'chain') {
    ctx.strokeStyle = '#ffd400'; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(0, -54, 22, 0.15, Math.PI - 0.15); ctx.stroke();
    ctx.fillStyle = '#ffd400';
    ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(7, -34); ctx.lineTo(0, -42); ctx.lineTo(-7, -34); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#b88e00'; ctx.beginPath(); ctx.arc(0, -34, 2.5, 0, Math.PI * 2); ctx.fill();
  }

  ctx.restore();
}

export function drawShopArt(canvas, poi, app) {
  if (poi.type === 'clothing') {
    drawAvatar(canvas, app);
    return;
  }
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const color = poi.color || '#ffd400';
  const g = ctx.createRadialGradient(W / 2, H * 0.34, 10, W / 2, H * 0.4, W * 0.75);
  g.addColorStop(0, color + '33');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // shelves / counter background
  ctx.fillStyle = 'rgba(255,255,255,0.045)';
  for (let i = 0; i < 3; i++) {
    const y = 70 + i * 62;
    ctx.fillRect(30, y, W - 60, 7);
    for (let j = 0; j < 5; j++) {
      ctx.fillStyle = `rgba(255,255,255,${0.05 + ((i + j) % 3) * 0.03})`;
      ctx.fillRect(40 + j * 44, y - 30, 28, 28);
    }
  }
  // big badge
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.beginPath(); ctx.arc(W / 2, H * 0.42, 66, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(W / 2, H * 0.42, 66, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = '700 64px "Arial Black", Impact, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(poi.letter || '?', W / 2, H * 0.42 + 4);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '600 12px "Segoe UI", Arial, sans-serif';
  ctx.fillText((poi.name || '').toUpperCase(), W / 2, H * 0.42 + 92);
  ctx.textBaseline = 'alphabetic';
}
