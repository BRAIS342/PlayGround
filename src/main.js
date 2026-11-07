import './style.css'
import * as THREE from 'three'
import { ROSTER, DIVISIONS, VENUES, overall } from './data/roster.js'
import { Fighter, ATTACKS } from './three/fighter.js'
import { AudioEngine } from './core/audio.js'

const $ = (s) => document.querySelector(s)
const audio = new AudioEngine()
const app = $('#app')
const sceneHost = $('#scene')
const scene = new THREE.Scene()
scene.background = new THREE.Color('#090a11')
scene.fog = new THREE.FogExp2('#090a11', 0.035)
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 120)
camera.position.set(0, 5.2, 11.6)
camera.lookAt(0, 1.15, 0)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.25
sceneHost.appendChild(renderer.domElement)

const hemi = new THREE.HemisphereLight('#a9c8ff', '#17111b', 1.25)
scene.add(hemi)
const keyLight = new THREE.SpotLight('#fff0d6', 180, 35, Math.PI / 5, 0.55, 1.3)
keyLight.position.set(-4, 10, 4); keyLight.target.position.set(0, 0, 0); keyLight.castShadow = true; keyLight.shadow.mapSize.set(1024, 1024); scene.add(keyLight, keyLight.target)
const fillLight = new THREE.SpotLight('#6d89ff', 140, 32, Math.PI / 4, 0.7, 1.4)
fillLight.position.set(5, 8, -5); fillLight.target.position.set(0, 1, 0); scene.add(fillLight, fillLight.target)
const pinkLight = new THREE.PointLight('#ff3d77', 65, 15, 2); pinkLight.position.set(-4, 4, -2); scene.add(pinkLight)
const cyanLight = new THREE.PointLight('#3dcfff', 55, 15, 2); cyanLight.position.set(4, 4, -1); scene.add(cyanLight)

const arenaRoot = new THREE.Group(); scene.add(arenaRoot)
const octagonShape = new THREE.Shape()
for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; const x = Math.cos(a) * 4.1; const y = Math.sin(a) * 4.1; if (!i) octagonShape.moveTo(x, y); else octagonShape.lineTo(x, y) }
octagonShape.closePath()
const mat = (color, roughness = 0.6, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness })
const floor = new THREE.Mesh(new THREE.ShapeGeometry(octagonShape), mat('#24222c', 0.86)); floor.rotation.x = -Math.PI / 2; floor.position.y = -0.035; floor.receiveShadow = true; arenaRoot.add(floor)
const inner = new THREE.Mesh(new THREE.CircleGeometry(3.96, 8), mat('#34313b', 0.9)); inner.rotation.x = -Math.PI / 2; inner.rotation.z = Math.PI / 8; inner.position.y = -0.02; arenaRoot.add(inner)
const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512
const cx = canvas.getContext('2d'); cx.fillStyle = '#34313b'; cx.fillRect(0, 0, 512, 512); cx.strokeStyle = '#45414a'; cx.lineWidth = 2
for (let y = 0; y < 512; y += 32) { cx.beginPath(); cx.moveTo(0, y); cx.lineTo(512, y); cx.stroke() }
const canvasTex = new THREE.CanvasTexture(canvas); canvasTex.colorSpace = THREE.SRGBColorSpace
inner.material.map = canvasTex; inner.material.needsUpdate = true
const ring = new THREE.Mesh(new THREE.RingGeometry(3.88, 4.08, 8, 1, Math.PI / 8), new THREE.MeshBasicMaterial({ color: '#d5ff3f', side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.008; arenaRoot.add(ring)
const cageMat = new THREE.MeshStandardMaterial({ color: '#68717d', metalness: 0.65, roughness: 0.38, transparent: true, opacity: 0.33, wireframe: true })
const postsMat = mat('#343943', 0.35, 0.8)
const points = Array.from({ length: 8 }, (_, i) => { const a = Math.PI / 8 + i * Math.PI / 4; return new THREE.Vector3(Math.cos(a) * 4.12, 0, Math.sin(a) * 4.12) })
for (let i = 0; i < 8; i++) {
  const a = points[i], b = points[(i + 1) % 8], mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(.5)
  const length = a.distanceTo(b)
  const panel = new THREE.Mesh(new THREE.BoxGeometry(length, 2.45, .035, 8, 10, 1), cageMat); panel.position.set(mid.x, 1.25, mid.z); panel.rotation.y = -Math.atan2(b.z - a.z, b.x - a.x); arenaRoot.add(panel)
  const post = new THREE.Mesh(new THREE.CylinderGeometry(.075, .085, 2.55, 10), postsMat); post.position.set(a.x, 1.25, a.z); post.castShadow = true; arenaRoot.add(post)
  for (const y of [.23, 2.26]) { const rail = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, length, 8), mat('#a1a7b3', .35, .7)); rail.position.set(mid.x, y, mid.z); rail.rotation.z = Math.PI / 2; rail.rotation.y = -Math.atan2(b.z - a.z, b.x - a.x); arenaRoot.add(rail) }
}
const crowdMat = [mat('#453248'), mat('#243348'), mat('#493137'), mat('#343c43'), mat('#685034'), mat('#282b3b')]
const crowdGeo = new THREE.SphereGeometry(.12, 7, 6)
const crowd = new THREE.InstancedMesh(crowdGeo, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .8 }), 460)
const crowdDummy = new THREE.Object3D(); let crowdIndex = 0
for (let row = 0; row < 4; row++) for (let i = 0; i < 115; i++) {
  const a = (i / 115) * Math.PI * 2 + (row % 2) * .022; const r = 5.1 + row * .54
  crowdDummy.position.set(Math.cos(a) * r, .55 + row * .34 + Math.random() * .11, Math.sin(a) * r)
  crowdDummy.scale.set(.8 + Math.random() * .7, .8 + Math.random() * .8, .8); crowdDummy.updateMatrix(); crowd.setMatrixAt(crowdIndex, crowdDummy.matrix)
  crowd.setColorAt(crowdIndex, new THREE.Color(crowdMat[Math.floor(Math.random() * crowdMat.length)].color)); crowdIndex++
}
crowd.instanceMatrix.needsUpdate = true; scene.add(crowd)
for (let i = 0; i < 12; i++) { const bar = new THREE.Mesh(new THREE.BoxGeometry(.8, .05, .035), new THREE.MeshBasicMaterial({ color: i % 2 ? '#ff3d77' : '#d5ff3f' })); const a = i / 12 * Math.PI * 2; bar.position.set(Math.cos(a) * 6.9, 3.1, Math.sin(a) * 6.9); bar.lookAt(0, 3.1, 0); scene.add(bar) }
const floorGlow = new THREE.Mesh(new THREE.CircleGeometry(8, 64), new THREE.MeshBasicMaterial({ color: '#15101c', transparent: true, opacity: .8 })); floorGlow.rotation.x = -Math.PI / 2; floorGlow.position.y = -.16; scene.add(floorGlow)

const fighters = { player: null, enemy: null }
const ui = { screen: 'home', mode: 'exhibition', division: 'all', selected: ROSTER[0], enemy: ROSTER[1], venue: VENUES[0], running: false, paused: false, timer: 180, health: { player: 100, enemy: 100 }, stamina: { player: 100, enemy: 100 }, special: 0, damage: { player: 0, enemy: 0 }, actionCooldown: 0, aiCooldown: 1, round: 1, lastInput: 0, result: null }

function resize() {
  const w = Math.max(1, sceneHost.clientWidth), h = Math.max(1, sceneHost.clientHeight)
  renderer.setSize(w, h, false); camera.aspect = w / h
  const mobile = w < 650
  camera.position.set(0, mobile ? 5.8 : 5.2, mobile ? 13.7 : 11.6); camera.fov = mobile ? 42 : 38; camera.lookAt(0, 1.05, 0); camera.updateProjectionMatrix()
}
window.addEventListener('resize', resize); resize()

function makeFighter(def, side) {
  if (fighters[side]) { scene.remove(fighters[side].root); fighters[side].dispose() }
  const f = new Fighter(def, { quality: 'high' })
  f.root.position.set(side === 'player' ? -1.35 : 1.35, 0, side === 'player' ? .42 : -.42)
  f.root.rotation.y = side === 'player' ? 1.18 : -1.18
  scene.add(f.root); fighters[side] = f
  return f
}
makeFighter(ui.selected, 'player'); makeFighter(ui.enemy, 'enemy')

const screenMap = { home: $('#homeScreen'), select: $('#selectScreen'), game: $('#gameScreen'), result: $('#resultScreen') }
function showScreen(name) {
  ui.screen = name
  Object.entries(screenMap).forEach(([key, element]) => element.classList.toggle('hidden', key !== name))
  $('.vignette').style.opacity = name === 'game' ? '.52' : '1'
  if (name === 'game') resize()
}
function escapeHTML(value) { return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]) }
function renderDivisions() {
  const tabs = [{ id: 'all', label: 'TODOS' }, ...Object.entries(DIVISIONS).map(([id, d]) => ({ id, label: d.short }))]
  $('#divisionTabs').innerHTML = tabs.map((d) => `<button class="division-tab ${ui.division === d.id ? 'active' : ''}" data-division="${d.id}">${d.label}</button>`).join('')
  $('#divisionTabs').querySelectorAll('button').forEach((btn) => btn.addEventListener('click', () => { ui.division = btn.dataset.division; renderDivisions(); renderRoster() }))
}
function renderRoster() {
  const list = ui.division === 'all' ? ROSTER : ROSTER.filter((f) => f.division === ui.division)
  $('#rosterCount').textContent = `${list.length} PELEADORES`
  $('#fighterGrid').innerHTML = list.map((f) => `<button class="fighter-card ${ui.selected.id === f.id ? 'selected' : ''}" data-fighter="${f.id}" style="--accent:${f.colors.secondary}"><span class="fighter-portrait">${escapeHTML(f.name.split(' ').map((x) => x[0]).slice(0, 2).join(''))}</span><b>${escapeHTML(f.name)}</b><small>${escapeHTML(DIVISIONS[f.division]?.short || '')} · ${overall(f)} OVR</small></button>`).join('')
  $('#fighterGrid').querySelectorAll('.fighter-card').forEach((btn) => btn.addEventListener('click', () => {
    ui.selected = ROSTER.find((f) => f.id === btn.dataset.fighter) || ROSTER[0]
    ui.enemy = chooseOpponent(ui.selected)
    audio.select(); renderRoster(); renderFighterInfo(); makeFighter(ui.selected, 'player'); makeFighter(ui.enemy, 'enemy')
  }))
  renderFighterInfo()
}
function chooseOpponent(def) {
  const candidates = ROSTER.filter((f) => f.id !== def.id)
  if (ui.mode === 'career') {
    const wins = Number(localStorage.getItem('octagonCareerWins') || 0)
    return candidates[(wins + candidates.findIndex((f) => f.id === def.id) + ROSTER.length) % candidates.length]
  }
  return candidates[Math.floor(Math.random() * candidates.length)]
}
function renderFighterInfo() {
  const f = ui.selected, div = DIVISIONS[f.division], stats = [['PODER', f.stats.power], ['VELOCIDAD', f.stats.speed], ['TÉCNICA', f.stats.technique], ['AGARRE', f.stats.grappling], ['MANDÍBULA', f.stats.chin], ['RESISTENCIA', f.stats.stamina]]
  $('#fighterInfo').innerHTML = `<div class="info-top"><span class="division-badge" style="color:${div.color}">${div.short}</span><span class="info-number">${String(ROSTER.indexOf(f) + 1).padStart(2, '0')} / ${ROSTER.length}</span></div><div class="info-monogram">${escapeHTML(f.name.split(' ').map((x) => x[0]).slice(0, 2).join(''))}</div><h3>${escapeHTML(f.name)}</h3><div class="fighter-nick">“${escapeHTML(f.nick)}” · ${overall(f)} OVR</div><p class="fighter-meta">${escapeHTML(f.job)}<br>${escapeHTML(f.height)} · ${escapeHTML(f.weight)} · ${escapeHTML(f.style)}</p><p class="fighter-quote">“${escapeHTML(f.quote)}”</p><div class="signature-box"><small>MOVIMIENTO FIRMA</small><b>${escapeHTML(f.signature.name)}</b><p>${escapeHTML(f.signature.desc)}</p></div><div class="stats">${stats.map(([label, value]) => `<div class="stat-row"><div class="stat-label"><span>${label}</span><b>${value}</b></div><div class="stat-bar"><i style="width:${value}%;background:${div.color}"></i></div></div>`).join('')}</div>`
  $('#signatureName').textContent = f.signature.name
}
function openSelection(mode = 'exhibition') {
  ui.mode = mode; ui.division = 'all'; ui.selected = ROSTER[0]; ui.enemy = chooseOpponent(ui.selected)
  const labels = { exhibition: 'PELEA RÁPIDA', career: 'MODO CARRERA', promoter: 'MODO PROMOTOR' }
  $('#modeCaption').innerHTML = `${labels[mode]} <span>·</span> ${mode === 'career' ? 'SUBE EN EL RANKING, UNA PELEA A LA VEZ' : mode === 'promoter' ? 'ELIGE LA SEDE DEL MEGAEVENTO' : 'UN ROUND PARA LA HISTORIA'}`
  $('#venueSelect').innerHTML = VENUES.map((v) => `<option value="${v.id}">${escapeHTML(v.name)} · ${escapeHTML(v.city)}</option>`).join('')
  $('#venueSelect').value = ui.venue.id
  renderDivisions(); renderRoster(); makeFighter(ui.selected, 'player'); makeFighter(ui.enemy, 'enemy'); showScreen('select')
}

$('#playNow').addEventListener('click', () => { audio.resume(); audio.ui(); openSelection(ui.mode) })
$('#backHome').addEventListener('click', () => { audio.ui(); showScreen('home') })
$('#brandHome').addEventListener('click', () => { if (ui.screen === 'game') pauseGame(); else showScreen('home') })
$('.home-bottom').querySelectorAll('.mode-card').forEach((btn) => btn.addEventListener('click', () => {
  ui.mode = btn.dataset.mode; $('.home-bottom .active')?.classList.remove('active'); btn.classList.add('active'); audio.ui()
  const label = { exhibition: 'PELEA RÁPIDA', career: 'MODO CARRERA', promoter: 'MODO PROMOTOR' }[ui.mode]
  $('#playNow span').textContent = ui.mode === 'career' ? 'EMPEZAR CARRERA' : ui.mode === 'promoter' ? 'CREAR MEGAEVENTO' : 'ELIGE TU PELEADOR'
  $('.event-card-top span:first-child').textContent = ui.mode === 'promoter' ? 'TU PRÓXIMO MEGAEVENTO' : 'PRÓXIMO MEGAEVENTO'
}))
$('#venueSelect').addEventListener('change', (event) => { ui.venue = VENUES.find((v) => v.id === event.target.value) || VENUES[0]; setVenuePalette() })
function setVenuePalette() {
  const p = ui.venue.palette
  scene.fog.color.set(p.fog); pinkLight.color.set(p.rim); cyanLight.color.set(p.rim2)
  for (let i = 0; i < crowd.count; i++) crowd.setColorAt(i, new THREE.Color(p.crowd[i % p.crowd.length]))
  crowd.instanceColor.needsUpdate = true
}

const held = new Set()
const input = { x: 0, z: 0, block: false }
let toastTimer = 0
let pendingHits = []
let clock = new THREE.Clock()
let elapsed = 0
function toast(message) {
  const el = $('#toast'); el.textContent = message; el.classList.add('visible')
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 1500)
}
function callout(message, duration = 900) {
  const el = $('#fightCallout'); el.innerHTML = `<span>${escapeHTML(message)}</span>`; el.classList.add('show')
  window.setTimeout(() => el.classList.remove('show'), duration)
}
function updateMeter(side) {
  const prefix = side === 'player' ? 'player' : 'enemy'
  $(`#${prefix}Health`).style.width = `${ui.health[side]}%`
  $(`#${prefix}HealthText`).textContent = Math.ceil(ui.health[side])
  $(`#${prefix}Stamina`).style.width = `${ui.stamina[side]}%`
  $(`#${prefix}StaminaText`).textContent = Math.ceil(ui.stamina[side])
}
function distanceBetween(a, b) { return Math.hypot(a.root.position.x - b.root.position.x, a.root.position.z - b.root.position.z) }
function faceEachOther() {
  const p = fighters.player.root.position, e = fighters.enemy.root.position
  fighters.player.root.rotation.y = Math.atan2(e.x - p.x, e.z - p.z)
  fighters.enemy.root.rotation.y = Math.atan2(p.x - e.x, p.z - e.z)
}
function attack(side, move = 'jab') {
  if (!ui.running || ui.paused || ui.health[side] <= 0) return
  const fighter = fighters[side], stats = fighter.def.stats
  const signature = move === 'signature'
  if (signature && ui.special < 100) { toast('¡Carga la firma con golpes!'); return }
  const key = signature ? 'signature' : (ATTACKS[move] ? move : 'jab')
  const data = ATTACKS[key]
  if (fighter.koState || fighter.animTime < (ATTACKS[fighter.anim]?.dur || 0) * 0.72) return
  if (ui.stamina[side] < data.stamina) { toast('Necesitas recuperar resistencia'); return }
  ui.stamina[side] = Math.max(0, ui.stamina[side] - data.stamina)
  if (signature) ui.special = 0
  fighter.setAnim(key, true)
  audio.whoosh(signature ? 1.4 : data.dmg / 12)
  updateMeter(side)
  const targetSide = side === 'player' ? 'enemy' : 'player'
  pendingHits.push({ side, targetSide, move: key, time: data.dur * data.impact, resolved: false })
  const announce = signature ? fighter.def.signature.name : data.name.toUpperCase()
  if (side === 'player' && (signature || data.dmg >= 11)) callout(announce, 700)
}
function resolveHit(hit) {
  const attacker = fighters[hit.side], defender = fighters[hit.targetSide]
  if (!attacker || !defender || defender.koState) return
  const data = ATTACKS[hit.move], d = distanceBetween(attacker, defender)
  const reach = data.range + (hit.move === 'signature' ? 0.2 : 0)
  if (d > reach || d < 0.55) return
  const blocking = hit.targetSide === 'player' ? input.block : defender._blocking === true
  const p = attacker.root.position, q = defender.root.position
  const forward = new THREE.Vector2(Math.sin(attacker.root.rotation.y), Math.cos(attacker.root.rotation.y))
  const direction = new THREE.Vector2(q.x - p.x, q.z - p.z).normalize()
  if (forward.dot(direction) < 0.1) return
  const evasion = hit.targetSide === 'player' && Math.hypot(input.x, input.z) > 0.35
  if (evasion && Math.random() < 0.32) { toast('¡ESQUIVA!'); return }
  const skill = attacker.def.stats.technique / 100
  let damage = data.dmg * (0.78 + skill * 0.42) * (0.75 + ui.stamina[hit.side] / 400)
  if (hit.move === 'signature') damage *= 1.2
  if (blocking) damage *= 0.18
  ui.health[hit.targetSide] = Math.max(0, ui.health[hit.targetSide] - damage)
  ui.damage[hit.targetSide] += damage / 100
  defender.hurt(blocking ? 'body' : data.type)
  defender.setDamage({ bruise: ui.damage[hit.targetSide], cuts: ui.damage[hit.targetSide] > 0.55 ? 2 : ui.damage[hit.targetSide] > 0.28 ? 1 : 0 })
  audio.impact(Math.min(1.4, damage / 12), blocking)
  if (hit.side === 'player' && !blocking) ui.special = Math.min(100, ui.special + damage * 1.9)
  if (blocking) toast('¡BLOQUEO!')
  else if (hit.side === 'player') toast(`${data.name.toUpperCase()} · ${Math.round(damage)} DAÑO`)
  updateMeter(hit.targetSide)
  $('#specialCharge').style.width = `${ui.special}%`
  if (ui.health[hit.targetSide] <= 0) finishMatch(hit.side, 'KNOCKOUT')
}
function beginFight() {
  audio.resume(); audio.ui();
  ui.selected = ROSTER.find((f) => f.id === ui.selected.id) || ROSTER[0]
  ui.enemy = chooseOpponent(ui.selected)
  makeFighter(ui.selected, 'player'); makeFighter(ui.enemy, 'enemy')
  fighters.player.root.position.set(-1.25, 0, 0.25); fighters.enemy.root.position.set(1.25, 0, -0.25)
  ui.running = true; ui.paused = false; ui.timer = 180; ui.round = 1
  ui.health = { player: 100, enemy: 100 }; ui.stamina = { player: 100, enemy: 100 }; ui.damage = { player: 0, enemy: 0 }; ui.special = 0
  ui.aiCooldown = 1.1; ui.result = null; pendingHits = []; held.clear(); input.x = input.z = 0
  $('#hudPlayerName').textContent = ui.selected.name.toUpperCase(); $('#hudEnemyName').textContent = ui.enemy.name.toUpperCase()
  $('#hudPlayerRecord').textContent = ui.selected.record; $('#hudEnemyRecord').textContent = ui.enemy.record
  $('#venueLabel').textContent = ui.venue.city.toUpperCase(); $('#roundLabel').textContent = 'ROUND 1'
  $('#signatureName').textContent = ui.selected.signature.name; $('#specialCharge').style.width = '0%'
  updateMeter('player'); updateMeter('enemy'); setVenuePalette(); showScreen('game')
  callout('¡QUE SUENE LA CAMPANA!', 1500); audio.bell(); audio.crowd(0.18)
}
function finishMatch(winner, method = 'DECISIÓN') {
  if (!ui.running) return
  ui.running = false; ui.paused = false; ui.result = winner
  const won = winner === 'player'
  if (winner !== 'draw') {
    const loser = winner === 'player' ? 'enemy' : 'player'
    fighters[loser].startKo(new THREE.Vector3(winner === 'player' ? 1 : -1, 0, 0), 0.75)
  }
  audio.bell(2); audio.crowd(won ? 0.3 : 0.08); won ? audio.cheer(1) : audio.boo()
  if (ui.mode === 'career' && won) localStorage.setItem('octagonCareerWins', String(Number(localStorage.getItem('octagonCareerWins') || 0) + 1))
  $('#resultTitle').textContent = winner === 'draw' ? 'EMPATE' : won ? '¡VICTORIA!' : 'DERROTA'
  $('#resultSubtitle').textContent = `POR ${method} · TIEMPO ${formatTime(ui.timer)}`
  $('#resultPlayerLabel').textContent = ui.selected.name.toUpperCase(); $('#resultEnemyLabel').textContent = ui.enemy.name.toUpperCase()
  $('#resultPlayerScore').textContent = Math.round(ui.health.player); $('#resultEnemyScore').textContent = Math.round(ui.health.enemy)
  const quotes = won ? ['El público ya tiene nuevo ídolo. ¿Quién se atreve a subir?', 'Una noche legendaria. El ego sale intacto; el rival, no tanto.', '¡La jaula tiembla! Victoria para la esquina roja.'] : ['La rivalidad no termina aquí. Pide la revancha.', 'El espectáculo continúa. La próxima vez, cambia el guion.', 'El rival se lleva la noche… por ahora.']
  $('#resultQuote').textContent = `“${quotes[Math.floor(Math.random() * quotes.length)]}”`
  showScreen('result')
}
function formatTime(seconds) { const t = Math.max(0, Math.ceil(seconds)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}` }
function pauseGame() {
  if (!ui.running) return
  ui.paused = !ui.paused; $('#pauseOverlay').classList.toggle('hidden', !ui.paused)
  audio.ui()
}
function finishByTime() {
  const delta = ui.health.player - ui.health.enemy
  finishMatch(delta === 0 ? 'draw' : delta > 0 ? 'player' : 'enemy', 'DECISIÓN')
}
function updateGame(dt) {
  if (!ui.running || ui.paused) return
  ui.timer = Math.max(0, ui.timer - dt); $('#timerText').textContent = formatTime(ui.timer)
  if (ui.timer <= 0) { finishByTime(); return }
  const p = fighters.player, e = fighters.enemy
  const ppos = p.root.position, epos = e.root.position
  const dx = epos.x - ppos.x, dz = epos.z - ppos.z, dist = Math.hypot(dx, dz) || 1
  faceEachOther()
  const moving = Math.abs(input.x) + Math.abs(input.z) > 0.05
  const attackLocked = p.koState || (ATTACKS[p.anim] && p.animTime < ATTACKS[p.anim].dur * 0.72)
  if (!p.koState && !attackLocked) {
    if (moving) {
      ppos.x += input.x * 2.5 * dt; ppos.z += input.z * 2.5 * dt
      p.moving = true; p.moveSpeed = 2.5; p.setAnim('walk')
    } else { p.moving = false; p.moveSpeed = 0; p.setAnim(input.block ? 'block' : 'idle') }
  }
  // Rival closes distance, circles, and occasionally guards or attacks.
  e._blocking = false
  ui.aiCooldown -= dt
  const ed = distanceBetween(e, p)
  if (!e.koState && !ATTACKS[e.anim] || (!e.koState && e.animTime >= (ATTACKS[e.anim]?.dur || 0) * 0.78)) {
    if (ed > 1.55) {
      const nx = (ppos.x - epos.x) / (ed || 1), nz = (ppos.z - epos.z) / (ed || 1)
      epos.x += nx * 1.25 * dt + Math.sin(elapsed * 1.7) * 0.24 * dt
      epos.z += nz * 1.25 * dt
      e.moving = true; e.moveSpeed = 1.25; e.setAnim('walk')
    } else if (ui.aiCooldown <= 0) {
      const aggression = e.def.ai?.aggression ?? 0.5
      if (Math.random() < 0.2 + (1 - aggression) * 0.3) { e._blocking = true; e.setAnim('block'); ui.aiCooldown = 0.65 }
      else {
        const moves = ['jab', 'cross', 'hook', 'kickLow', 'kickBody', 'uppercut']
        attack('enemy', moves[Math.floor(Math.random() * moves.length)])
        ui.aiCooldown = 0.8 + Math.random() * 0.65
      }
    } else {
      e._blocking = Math.random() < 0.05; e.setAnim(e._blocking ? 'block' : 'idle')
    }
  }
  ppos.x = THREE.MathUtils.clamp(ppos.x, -3.1, 3.1); ppos.z = THREE.MathUtils.clamp(ppos.z, -3.1, 3.1)
  epos.x = THREE.MathUtils.clamp(epos.x, -3.1, 3.1); epos.z = THREE.MathUtils.clamp(epos.z, -3.1, 3.1)
  ui.stamina.player = Math.min(100, ui.stamina.player + dt * (moving ? 4 : 9))
  ui.stamina.enemy = Math.min(100, ui.stamina.enemy + dt * 7)
  updateMeter('player'); updateMeter('enemy')
  pendingHits.forEach((hit) => { hit.time -= dt; if (hit.time <= 0 && !hit.resolved) { hit.resolved = true; resolveHit(hit) } })
  pendingHits = pendingHits.filter((hit) => !hit.resolved)
}
function animate() {
  requestAnimationFrame(animate)
  const dt = Math.min(clock.getDelta(), 0.04); elapsed += dt
  fighters.player?.update(dt, elapsed); fighters.enemy?.update(dt, elapsed)
  updateGame(dt)
  renderer.render(scene, camera)
}

$('#startFight').addEventListener('click', beginFight)
$('#pauseBtn').addEventListener('click', pauseGame)
$('#resumeBtn').addEventListener('click', pauseGame)
$('#quitFight').addEventListener('click', () => { ui.running = false; ui.paused = false; $('#pauseOverlay').classList.add('hidden'); audio.crowd(0.12); showScreen('home') })
$('#rematchBtn').addEventListener('click', () => beginFight())
$('#resultMenu').addEventListener('click', () => { audio.ui(); showScreen('home') })
$('#soundToggle').addEventListener('click', () => { audio.resume(); audio.setMuted(!audio.muted); $('#soundToggle').textContent = audio.muted ? '×' : '♫' })
$('#fullscreenBtn').addEventListener('click', () => { if (!document.fullscreenElement) app.requestFullscreen?.(); else document.exitFullscreen?.() })
window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase()
  if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) event.preventDefault()
  if (key === 'escape' && ui.running) { pauseGame(); return }
  held.add(key)
  input.block = held.has('shift')
  if (key === 'j') attack('player', 'jab')
  if (key === 'k') attack('player', 'cross')
  if (key === 'l') attack('player', 'kickHead')
  if (key === 'u') attack('player', 'hook')
  if (key === 'i') attack('player', 'uppercut')
  if (key === 'o') attack('player', 'kickBody')
  if (key === 'p') attack('player', 'signature')
  if (key === ' ') attack('player', 'knee')
})
window.addEventListener('keyup', (event) => { held.delete(event.key.toLowerCase()); input.block = held.has('shift') })
function refreshKeyboardMove() {
  input.x = (held.has('d') || held.has('arrowright') ? 1 : 0) - (held.has('a') || held.has('arrowleft') ? 1 : 0)
  input.z = (held.has('s') || held.has('arrowdown') ? 1 : 0) - (held.has('w') || held.has('arrowup') ? 1 : 0)
  const len = Math.hypot(input.x, input.z); if (len > 1) { input.x /= len; input.z /= len }
}
window.addEventListener('keydown', refreshKeyboardMove); window.addEventListener('keyup', refreshKeyboardMove)
$('#touchControls').querySelectorAll('[data-action]').forEach((button) => {
  const action = button.dataset.action
  const down = (event) => { event.preventDefault(); button.setPointerCapture?.(event.pointerId); if (action === 'block') { input.block = true; return } attack('player', action) }
  const up = () => { if (action === 'block') input.block = false }
  button.addEventListener('pointerdown', down); button.addEventListener('pointerup', up); button.addEventListener('pointercancel', up); button.addEventListener('lostpointercapture', up)
})
const stickZone = $('#stickZone'), stickKnob = $('#stickKnob')
let stickPointer = null
function moveStick(event) {
  const rect = stickZone.getBoundingClientRect(), cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2
  const radius = Math.min(rect.width, rect.height) * 0.34
  let x = event.clientX - cx, y = event.clientY - cy, len = Math.hypot(x, y)
  if (len > radius) { x *= radius / len; y *= radius / len }
  stickKnob.style.transform = `translate(${x}px,${y}px)`
  input.x = x / radius; input.z = y / radius
}
stickZone.addEventListener('pointerdown', (event) => { event.preventDefault(); stickPointer = event.pointerId; stickZone.setPointerCapture(event.pointerId); moveStick(event) })
stickZone.addEventListener('pointermove', (event) => { if (stickPointer === event.pointerId) moveStick(event) })
function releaseStick(event) { if (stickPointer !== event.pointerId) return; stickPointer = null; input.x = input.z = 0; stickKnob.style.transform = 'translate(0,0)' }
stickZone.addEventListener('pointerup', releaseStick); stickZone.addEventListener('pointercancel', releaseStick)
setVenuePalette()
animate()

