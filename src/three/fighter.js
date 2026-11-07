import * as THREE from 'three'

const TAU = Math.PI * 2
const clamp = THREE.MathUtils.clamp
const lerp = THREE.MathUtils.lerp

export const ATTACKS = {
  jab: { name: 'Jab', dur: 0.30, impact: 0.42, range: 1.55, arc: 0.7, dmg: 4.5, stamina: 5, type: 'head', hand: 'L' },
  cross: { name: 'Cross', dur: 0.42, impact: 0.46, range: 1.68, arc: 0.62, dmg: 8, stamina: 9, type: 'head', hand: 'R' },
  hook: { name: 'Hook', dur: 0.5, impact: 0.5, range: 1.55, arc: 0.95, dmg: 9.5, stamina: 11, type: 'head', hand: 'L' },
  uppercut: { name: 'Uppercut', dur: 0.55, impact: 0.5, range: 1.45, arc: 0.55, dmg: 11, stamina: 13, type: 'head', hand: 'R' },
  kickLow: { name: 'Low Kick', dur: 0.46, impact: 0.46, range: 1.8, arc: 0.5, dmg: 7, stamina: 10, type: 'legs', hand: 'R' },
  kickBody: { name: 'Body Kick', dur: 0.54, impact: 0.48, range: 1.9, arc: 0.55, dmg: 9, stamina: 12, type: 'body', hand: 'R' },
  kickHead: { name: 'Head Kick', dur: 0.72, impact: 0.52, range: 1.95, arc: 0.5, dmg: 15, stamina: 18, type: 'head', hand: 'R' },
  knee: { name: 'Flying Knee', dur: 0.62, impact: 0.5, range: 1.7, arc: 0.45, dmg: 13, stamina: 15, type: 'head', hand: 'R' },
  elbow: { name: 'Elbow', dur: 0.42, impact: 0.45, range: 1.35, arc: 0.85, dmg: 10, stamina: 11, type: 'head', hand: 'R' },
  combo: { name: 'Combo', dur: 0.72, impact: 0.5, range: 1.6, arc: 0.8, dmg: 13, stamina: 14, type: 'head', hand: 'R' },
  counter: { name: 'Counter', dur: 0.5, impact: 0.45, range: 1.6, arc: 0.7, dmg: 14, stamina: 10, type: 'head', hand: 'R' },
  signature: { name: 'Signature', dur: 1.05, impact: 0.55, range: 1.9, arc: 0.9, dmg: 24, stamina: 20, type: 'head', hand: 'R' },
}

function mat(color, rough = 0.55, metal = 0, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra })
}

function capsule(radius, length, material, radial = 12) {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 4, radial), material)
  return m
}

const JOINTS = ['hips', 'chest', 'neck', 'head', 'shL', 'elL', 'shR', 'elR', 'hipL', 'knL', 'hipR', 'knR', 'footL', 'footR', 'handL', 'handR']

function emptyPose() {
  const p = {}
  for (const j of JOINTS) p[j] = [0, 0, 0]
  return p
}

const GUARD = (() => {
  const p = emptyPose()
  p.hips = [0.03, 0.22, 0]
  p.chest = [-0.02, -0.12, 0]
  p.neck = [0.03, 0.06, 0]
  p.head = [-0.06, 0.02, 0]
  p.shL = [-0.85, 0.28, 0.38]
  p.elL = [-1.75, 0, 0.15]
  p.shR = [-0.75, -0.32, -0.34]
  p.elR = [-1.85, 0, -0.1]
  p.hipL = [-0.1, 0.08, 0.14]
  p.knL = [0.18, 0, 0]
  p.hipR = [0.18, -0.12, -0.16]
  p.knR = [0.22, 0, 0]
  p.footL = [0.02, 0.3, 0]
  p.footR = [0.02, -0.3, 0]
  return p
})()

function poseFrom(base, overrides) {
  const p = {}
  for (const j of JOINTS) p[j] = [...base[j]]
  for (const j of Object.keys(overrides)) p[j] = overrides[j]
  return p
}

// Keyframed poses. t in 0..1 of animation duration.
const POSES = {
  idle: [
    { t: 0, p: GUARD },
    { t: 0.5, p: poseFrom(GUARD, { chest: [-0.04, -0.12, 0.015], shL: [-0.82, 0.28, 0.41], shR: [-0.72, -0.32, -0.37] }) },
    { t: 1, p: GUARD },
  ],
  walk: [
    { t: 0, p: GUARD },
    { t: 0.25, p: poseFrom(GUARD, { hipL: [-0.5, 0.08, 0.14], knL: [0.55, 0, 0], hipR: [0.32, -0.12, -0.16], knR: [0.28, 0, 0] }) },
    { t: 0.5, p: GUARD },
    { t: 0.75, p: poseFrom(GUARD, { hipR: [-0.5, -0.12, -0.16], knR: [0.55, 0, 0], hipL: [0.32, 0.08, 0.14], knL: [0.28, 0, 0] }) },
    { t: 1, p: GUARD },
  ],
  jab: [
    { t: 0, p: GUARD },
    { t: 0.28, p: poseFrom(GUARD, { hips: [0.02, 0.42, 0], chest: [0, -0.3, 0], shL: [-1.58, 0.05, 0.2], elL: [-0.08, 0, 0], shR: [-0.9, -0.4, -0.3], elR: [-1.9, 0, 0], head: [-0.04, 0.06, 0] }) },
    { t: 0.55, p: poseFrom(GUARD, { hips: [0.02, 0.38, 0], chest: [0, -0.25, 0], shL: [-1.42, 0.08, 0.2], elL: [-0.18, 0, 0], shR: [-0.85, -0.38, -0.3], elR: [-1.9, 0, 0] }) },
    { t: 1, p: GUARD },
  ],
  cross: [
    { t: 0, p: GUARD },
    { t: 0.24, p: poseFrom(GUARD, { hips: [0.02, -0.1, 0], chest: [0, 0.08, 0], shR: [-0.9, -0.5, -0.3], elR: [-2, 0, 0] }) },
    { t: 0.5, p: poseFrom(GUARD, { hips: [0.02, -0.5, 0], chest: [0, 0.35, 0], shR: [-1.62, 0.02, -0.18], elR: [-0.05, 0, 0], shL: [-0.85, 0.42, 0.4], elL: [-1.9, 0, 0], head: [-0.05, -0.04, 0] }) },
    { t: 0.68, p: poseFrom(GUARD, { hips: [0.02, -0.45, 0], chest: [0, 0.3, 0], shR: [-1.5, 0.05, -0.18], elR: [-0.15, 0, 0], shL: [-0.85, 0.42, 0.4], elL: [-1.9, 0, 0] }) },
    { t: 1, p: GUARD },
  ],
  hook: [
    { t: 0, p: GUARD },
    { t: 0.22, p: poseFrom(GUARD, { hips: [0.02, 0.42, 0], chest: [0, -0.32, 0], shL: [-1.1, 0.7, 0.3], elL: [-1.5, 0, 0] }) },
    { t: 0.5, p: poseFrom(GUARD, { hips: [0.02, -0.25, 0], chest: [0, 0.3, 0], shL: [-1.35, -0.55, 0.32], elL: [-1.05, 0, 0], shR: [-0.8, -0.4, -0.3], elR: [-1.95, 0, 0] }) },
    { t: 0.72, p: poseFrom(GUARD, { hips: [0.02, -0.2, 0], chest: [0, 0.24, 0], shL: [-1.2, -0.42, 0.32], elL: [-1.25, 0, 0], shR: [-0.8, -0.4, -0.3], elR: [-1.95, 0, 0] }) },
    { t: 1, p: GUARD },
  ],
  uppercut: [
    { t: 0, p: GUARD },
    { t: 0.24, p: poseFrom(GUARD, { hips: [0.06, -0.28, 0], chest: [0.08, 0.12, 0], shR: [-0.55, -0.2, -0.35], elR: [-2.2, 0, 0] }) },
    { t: 0.52, p: poseFrom(GUARD, { hips: [-0.08, 0.18, 0], chest: [-0.1, -0.15, 0], shR: [-2.15, -0.1, -0.1], elR: [-0.65, 0, 0], head: [-0.12, 0, 0], shL: [-0.8, 0.35, 0.4] }) },
    { t: 0.72, p: poseFrom(GUARD, { hips: [-0.04, 0.14, 0], chest: [-0.06, -0.12, 0], shR: [-1.9, -0.1, -0.1], elR: [-0.9, 0, 0], shL: [-0.8, 0.35, 0.4] }) },
    { t: 1, p: GUARD },
  ],
  kickLow: [
    { t: 0, p: GUARD },
    { t: 0.22, p: poseFrom(GUARD, { hips: [0, -0.2, 0], chest: [0, 0.1, 0], hipR: [0.2, -0.2, -0.25], knR: [0.7, 0, 0] }) },
    { t: 0.48, p: poseFrom(GUARD, { hips: [0.02, 0.25, 0], chest: [-0.05, -0.2, 0], hipR: [-1.25, -0.1, -0.3], knR: [0.3, 0, 0], footR: [0.4, 0, 0], shL: [-0.9, 0.3, 0.45], shR: [-0.9, -0.4, -0.4] }) },
    { t: 0.72, p: poseFrom(GUARD, { hips: [0.02, 0.2, 0], chest: [-0.04, -0.16, 0], hipR: [-1.0, -0.1, -0.3], knR: [0.5, 0, 0], shL: [-0.9, 0.3, 0.45] }) },
    { t: 1, p: GUARD },
  ],
  kickBody: [
    { t: 0, p: GUARD },
    { t: 0.2, p: poseFrom(GUARD, { hips: [0, -0.28, 0], chest: [0, 0.16, 0], hipR: [0.25, -0.2, -0.2], knR: [0.9, 0, 0] }) },
    { t: 0.48, p: poseFrom(GUARD, { hips: [0.02, 0.42, 0], chest: [-0.08, -0.32, 0], hipR: [-1.5, -0.05, -0.35], knR: [0.15, 0, 0], footR: [0.6, 0, 0], shL: [-1.0, 0.35, 0.5], elL: [-1.5, 0, 0], shR: [-1.0, -0.45, -0.45] }) },
    { t: 0.72, p: poseFrom(GUARD, { hips: [0.02, 0.34, 0], chest: [-0.06, -0.26, 0], hipR: [-1.2, -0.05, -0.35], knR: [0.4, 0, 0], shL: [-1.0, 0.35, 0.5] }) },
    { t: 1, p: GUARD },
  ],
  kickHead: [
    { t: 0, p: GUARD },
    { t: 0.2, p: poseFrom(GUARD, { hips: [0, -0.35, 0], chest: [0, 0.2, 0], hipR: [0.2, -0.2, -0.15], knR: [1.0, 0, 0] }) },
    { t: 0.5, p: poseFrom(GUARD, { hips: [0.02, 0.65, 0], chest: [-0.15, -0.5, 0], hipR: [-2.15, -0.05, -0.55], knR: [0.2, 0, 0], footR: [0.7, 0, 0], shL: [-1.15, 0.4, 0.6], elL: [-1.3, 0, 0], shR: [-1.1, -0.5, -0.5] }) },
    { t: 0.72, p: poseFrom(GUARD, { hips: [0.02, 0.55, 0], chest: [-0.1, -0.42, 0], hipR: [-1.85, -0.05, -0.5], knR: [0.35, 0, 0], shL: [-1.1, 0.4, 0.6] }) },
    { t: 1, p: GUARD },
  ],
  knee: [
    { t: 0, p: GUARD },
    { t: 0.2, p: poseFrom(GUARD, { hips: [0.1, 0.1, 0], chest: [0.05, 0, 0], hipR: [-0.7, -0.1, -0.1], knR: [1.5, 0, 0], shL: [-1.2, 0.5, 0.5], shR: [-1.2, -0.5, -0.5] }) },
    { t: 0.5, p: poseFrom(GUARD, { hips: [-0.25, 0.05, 0], chest: [-0.3, 0, 0], hipR: [-1.7, -0.1, -0.15], knR: [1.5, 0, 0], hipL: [0.2, 0, 0.1], knL: [0.2, 0, 0], shL: [-1.5, 0.6, 0.4], shR: [-1.5, -0.6, -0.4], head: [-0.15, 0, 0] }) },
    { t: 1, p: GUARD },
  ],
  elbow: [
    { t: 0, p: GUARD },
    { t: 0.2, p: poseFrom(GUARD, { hips: [0.02, -0.2, 0], chest: [0, 0.15, 0], shR: [-1.3, -0.8, -0.5], elR: [-1.9, 0, 0] }) },
    { t: 0.48, p: poseFrom(GUARD, { hips: [0.02, -0.55, 0], chest: [0, 0.4, 0], shR: [-1.3, -1.15, -0.7], elR: [-1.5, 0, 0], shL: [-0.9, 0.5, 0.45], elL: [-1.9, 0, 0] }) },
    { t: 1, p: GUARD },
  ],
  combo: [
    { t: 0, p: GUARD },
    { t: 0.18, p: poseFrom(GUARD, { hips: [0.02, 0.35, 0], chest: [0, -0.2, 0], shL: [-1.55, 0.05, 0.2], elL: [-0.1, 0, 0] }) },
    { t: 0.36, p: poseFrom(GUARD, { hips: [0.02, -0.4, 0], chest: [0, 0.3, 0], shR: [-1.6, 0.02, -0.18], elR: [-0.08, 0, 0] }) },
    { t: 0.55, p: poseFrom(GUARD, { hips: [0.02, 0.1, 0], chest: [0, 0, 0], hipR: [-1.3, -0.1, -0.3], knR: [0.4, 0, 0] }) },
    { t: 0.72, p: poseFrom(GUARD, { hips: [0.02, 0.55, 0], chest: [-0.1, -0.4, 0], hipR: [-2.0, -0.05, -0.5], knR: [0.25, 0, 0] }) },
    { t: 1, p: GUARD },
  ],
  counter: [
    { t: 0, p: GUARD },
    { t: 0.18, p: poseFrom(GUARD, { hips: [0, 0.55, 0], chest: [0, -0.3, 0], head: [-0.12, 0.1, 0.06] }) },
    { t: 0.46, p: poseFrom(GUARD, { hips: [0.02, -0.5, 0], chest: [0, 0.35, 0], shR: [-1.35, -0.65, -0.3], elR: [-1.0, 0, 0], shL: [-0.9, 0.45, 0.4], elL: [-1.9, 0, 0] }) },
    { t: 0.72, p: poseFrom(GUARD, { hips: [0.02, -0.4, 0], chest: [0, 0.3, 0], shR: [-1.2, -0.5, -0.3], elR: [-1.2, 0, 0], shL: [-0.9, 0.45, 0.4] }) },
    { t: 1, p: GUARD },
  ],
  block: [
    { t: 0, p: poseFrom(GUARD, { hips: [0.06, 0.1, 0], chest: [0.06, 0, 0], shL: [-1.15, 0.35, 0.5], elL: [-2.25, 0, 0.1], shR: [-1.05, -0.38, -0.45], elR: [-2.3, 0, -0.1], head: [0.1, 0, 0], knL: [0.3, 0, 0], knR: [0.3, 0, 0] }) },
  ],
  hurtHead: [
    { t: 0, p: GUARD },
    { t: 0.2, p: poseFrom(GUARD, { hips: [0.12, 0.1, 0], chest: [0.18, 0.12, 0.1], head: [0.45, 0.25, 0.15], shL: [-0.4, 0.4, 0.5], elL: [-1.2, 0, 0], shR: [-0.35, -0.4, -0.45], elR: [-1.2, 0, 0], knL: [0.35, 0, 0], knR: [0.35, 0, 0] }) },
    { t: 1, p: GUARD },
  ],
  hurtBody: [
    { t: 0, p: GUARD },
    { t: 0.25, p: poseFrom(GUARD, { hips: [0.25, 0.05, 0], chest: [0.35, 0, 0], head: [0.2, 0, 0], shL: [-0.4, 0.3, 0.5], elL: [-1.6, 0, 0], shR: [-0.4, -0.3, -0.45], elR: [-1.6, 0, 0] }) },
    { t: 1, p: GUARD },
  ],
  hurtLeg: [
    { t: 0, p: GUARD },
    { t: 0.3, p: poseFrom(GUARD, { hips: [0.1, 0.2, 0.08], chest: [0.12, 0, 0.1], hipR: [0.35, -0.1, -0.3], knR: [0.9, 0, 0], head: [0.15, 0, 0.1] }) },
    { t: 1, p: GUARD },
  ],
  takedown: [
    { t: 0, p: GUARD },
    { t: 0.18, p: poseFrom(GUARD, { hips: [0.35, 0.1, 0], chest: [0.3, 0, 0], hipL: [-0.6, 0, 0.1], knL: [0.8, 0, 0], hipR: [-0.5, 0, -0.1], knR: [0.7, 0, 0], shL: [-1.4, 0.5, 0.5], shR: [-1.4, -0.5, -0.5] }) },
    { t: 0.5, p: poseFrom(GUARD, { hips: [0.9, 0.05, 0], chest: [0.4, 0, 0], hipL: [-1.4, 0, 0.1], knL: [0.5, 0, 0], hipR: [-1.2, 0, -0.1], knR: [0.4, 0, 0], shL: [-2.2, 0.3, 0.4], shR: [-2.2, -0.3, -0.4], head: [0.3, 0, 0] }) },
    { t: 1, p: GUARD },
  ],
  sprawl: [
    { t: 0, p: poseFrom(GUARD, { hips: [0.7, 0, 0], chest: [0.2, 0, 0], hipL: [0.3, 0, 0.2], knL: [0.2, 0, 0], hipR: [0.3, 0, -0.2], knR: [0.2, 0, 0], shL: [-1.2, 0.5, 0.5], shR: [-1.2, -0.5, -0.5] }) },
  ],
  groundTop: [
    { t: 0, p: poseFrom(GUARD, { hips: [1.05, 0, 0], chest: [0.35, 0, 0], head: [0.45, 0, 0], hipL: [-0.9, 0.25, 0.4], knL: [1.4, 0, 0], hipR: [-0.9, -0.25, -0.4], knR: [1.4, 0, 0], shL: [-1.7, 0.3, 0.35], elL: [-1.3, 0, 0], shR: [-1.7, -0.3, -0.35], elR: [-1.3, 0, 0] }) },
    { t: 0.5, p: poseFrom(GUARD, { hips: [1.05, 0.02, 0], chest: [0.32, 0, 0], head: [0.45, 0, 0], hipL: [-0.9, 0.25, 0.4], knL: [1.4, 0, 0], hipR: [-0.9, -0.25, -0.4], knR: [1.4, 0, 0], shL: [-1.6, 0.3, 0.35], elL: [-1.35, 0, 0], shR: [-1.6, -0.3, -0.35], elR: [-1.35, 0, 0] }) },
    { t: 1, p: poseFrom(GUARD, { hips: [1.05, 0, 0], chest: [0.35, 0, 0], head: [0.45, 0, 0], hipL: [-0.9, 0.25, 0.4], knL: [1.4, 0, 0], hipR: [-0.9, -0.25, -0.4], knR: [1.4, 0, 0], shL: [-1.7, 0.3, 0.35], elL: [-1.3, 0, 0], shR: [-1.7, -0.3, -0.35], elR: [-1.3, 0, 0] }) },
  ],
  groundBottom: [
    { t: 0, p: poseFrom(GUARD, { hips: [1.35, 0, 0], chest: [0.1, 0, 0], head: [0.35, 0, 0], hipL: [-1.1, 0.3, 0.55], knL: [1.7, 0, 0], hipR: [-1.1, -0.3, -0.55], knR: [1.7, 0, 0], shL: [-1.3, 0.4, 0.5], elL: [-1.9, 0, 0], shR: [-1.3, -0.4, -0.5], elR: [-1.9, 0, 0] }) },
    { t: 0.5, p: poseFrom(GUARD, { hips: [1.35, 0.02, 0], chest: [0.08, 0, 0], head: [0.35, 0, 0], hipL: [-1.05, 0.3, 0.55], knL: [1.65, 0, 0], hipR: [-1.05, -0.3, -0.55], knR: [1.65, 0, 0], shL: [-1.35, 0.4, 0.5], elL: [-1.85, 0, 0], shR: [-1.35, -0.4, -0.5], elR: [-1.85, 0, 0] }) },
    { t: 1, p: poseFrom(GUARD, { hips: [1.35, 0, 0], chest: [0.1, 0, 0], head: [0.35, 0, 0], hipL: [-1.1, 0.3, 0.55], knL: [1.7, 0, 0], hipR: [-1.1, -0.3, -0.55], knR: [1.7, 0, 0], shL: [-1.3, 0.4, 0.5], elL: [-1.9, 0, 0], shR: [-1.3, -0.4, -0.5], elR: [-1.9, 0, 0] }) },
  ],
  victory: [
    { t: 0, p: GUARD },
    { t: 0.35, p: poseFrom(GUARD, { hips: [0, 0.15, 0], chest: [-0.15, -0.1, 0], head: [-0.25, 0, 0], shL: [-2.9, 0.25, 0.3], elL: [-0.2, 0, 0], shR: [-2.9, -0.25, -0.3], elR: [-0.2, 0, 0], hipL: [-0.05, 0.08, 0.2], hipR: [0.05, -0.08, -0.2] }) },
    { t: 0.6, p: poseFrom(GUARD, { hips: [0, 0.15, 0], chest: [-0.12, -0.1, 0], head: [-0.2, 0, 0], shL: [-2.7, 0.25, 0.3], elL: [-0.4, 0, 0], shR: [-2.7, -0.25, -0.3], elR: [-0.4, 0, 0] }) },
    { t: 1, p: poseFrom(GUARD, { hips: [0, 0.15, 0], chest: [-0.15, -0.1, 0], head: [-0.25, 0, 0], shL: [-2.9, 0.25, 0.3], elL: [-0.2, 0, 0], shR: [-2.9, -0.25, -0.3], elR: [-0.2, 0, 0] }) },
  ],
  limp: [
    { t: 0, p: poseFrom(GUARD, { hips: [0.15, 0, 0], chest: [0.2, 0, 0], head: [0.35, 0.3, 0.2], shL: [-0.4, 0.5, 0.7], elL: [-0.5, 0, 0], shR: [-0.3, -0.5, -0.7], elR: [-0.5, 0, 0], hipL: [-0.4, 0.2, 0.2], knL: [0.5, 0, 0], hipR: [-0.3, -0.2, -0.2], knR: [0.6, 0, 0] }) },
  ],
}

const POSE_EASE = (t) => t * t * (3 - 2 * t)

function samplePose(keys, t) {
  if (keys.length === 1) return keys[0].p
  t = clamp(t, 0, 1)
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]
    const b = keys[i + 1]
    if (t >= a.t && t <= b.t) {
      const k = POSE_EASE((t - a.t) / Math.max(0.0001, b.t - a.t))
      const out = {}
      for (const j of JOINTS) {
        const av = a.p[j]
        const bv = b.p[j]
        out[j] = [lerp(av[0], bv[0], k), lerp(av[1], bv[1], k), lerp(av[2], bv[2], k)]
      }
      return out
    }
  }
  return keys[keys.length - 1].p
}

function makeHair(style, color, headGroup, scale) {
  const hairMat = mat(color, 0.92)
  const g = new THREE.Group()
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.115 * scale, 20, 14, 0, TAU, 0, Math.PI * 0.56), hairMat)
  cap.position.y = 0.012 * scale
  cap.scale.set(1.0, 0.95, 1.04)
  cap.castShadow = true
  if (style === 'bald') return g
  if (style === 'buzz') {
    cap.scale.set(0.99, 0.62, 1.02)
    cap.position.y = 0.025 * scale
    g.add(cap)
    return g
  }
  g.add(cap)
  if (style === 'quiff') {
    const q = new THREE.Mesh(new THREE.SphereGeometry(0.055 * scale, 12, 8), hairMat)
    q.position.set(0, 0.105 * scale, 0.045 * scale)
    q.scale.set(1.5, 0.75, 1.1)
    q.rotation.x = -0.35
    g.add(q)
  } else if (style === 'fluffy') {
    for (let i = 0; i < 7; i++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.045 * scale, 10, 8), hairMat)
      const a = (i / 7) * TAU
      b.position.set(Math.cos(a) * 0.065 * scale, 0.075 * scale + Math.sin(i * 2.1) * 0.012 * scale, Math.sin(a) * 0.06 * scale + 0.01)
      b.scale.set(1.1, 0.85, 1.1)
      g.add(b)
    }
  } else if (style === 'braids') {
    for (let i = 0; i < 9; i++) {
      const a = -0.9 + (i / 8) * 1.8
      const strand = new THREE.Mesh(new THREE.CapsuleGeometry(0.011 * scale, 0.19 * scale, 3, 6), hairMat)
      strand.position.set(Math.sin(a) * 0.09 * scale, -0.075 * scale, -0.055 * scale - Math.cos(a) * 0.035)
      strand.rotation.x = 0.22
      strand.rotation.z = Math.sin(a) * 0.22
      g.add(strand)
    }
  }
  return g
}

function makeBeard(style, color, headGroup, scale) {
  if (style === 'none') return
  const m = mat(color, 0.95)
  if (style === 'stubble') {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.113 * scale, 18, 12, 0, TAU, Math.PI * 0.5, Math.PI * 0.42), m)
    b.material.transparent = true
    b.material.opacity = 0.32
    b.position.set(0, -0.006, 0.008)
    b.scale.set(0.98, 1.0, 0.99)
    headGroup.add(b)
    return
  }
  if (style === 'full' || style === 'goatee') {
    const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.108 * scale, 16, 12, 0, TAU, Math.PI * 0.42, Math.PI * 0.36), m)
    jaw.position.set(0, -0.012 * scale, 0.012)
    jaw.scale.set(0.96, 1.0, 0.98)
    headGroup.add(jaw)
    if (style === 'full') {
      const chin = new THREE.Mesh(new THREE.SphereGeometry(0.055 * scale, 12, 8), m)
      chin.position.set(0, -0.105 * scale, 0.055 * scale)
      chin.scale.set(1.25, 0.7, 0.8)
      headGroup.add(chin)
    }
  }
}

export class Fighter {
  constructor(def, { quality = 'high' } = {}) {
    this.def = def
    this.quality = quality
    this.root = new THREE.Group()
    this.body = new THREE.Group()
    this.root.add(this.body)
    this.scale = def.look?.heightScale || 1
    this.body.scale.setScalar(this.scale)
    this.build = def.look?.build || 1
    this.anim = 'idle'
    this.animTime = 0
    this.current = {}
    this.j = {}
    this.flinch = null
    this.flinchTime = 0
    this.damage = { bruise: 0, cuts: 0, sweat: 0 }
    this.moving = false
    this.moveSpeed = 0
    this.koState = null
    this.visible = true
    this.buildModel()
    this.shadow = this.makeShadow()
    this.root.add(this.shadow)
    this.resetPose()
  }

  makeShadow() {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const ctx = c.getContext('2d')
    const grd = ctx.createRadialGradient(64, 64, 4, 64, 64, 62)
    grd.addColorStop(0, 'rgba(0,0,0,0.72)')
    grd.addColorStop(0.55, 'rgba(0,0,0,0.34)')
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, 128, 128)
    const tex = new THREE.CanvasTexture(c)
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }))
    m.rotation.x = -Math.PI / 2
    m.position.y = 0.012
    return m
  }

  buildModel() {
    const d = this.def
    const colors = d.colors
    const look = d.look || {}
    const skinMat = new THREE.MeshStandardMaterial({ color: colors.skin, roughness: 0.58, metalness: 0.02 })
    const skinHeadMat = new THREE.MeshStandardMaterial({ color: colors.skin, roughness: 0.52, metalness: 0.02 })
    const shortsMat = new THREE.MeshStandardMaterial({ color: colors.primary, roughness: 0.72 })
    const trimMat = new THREE.MeshStandardMaterial({ color: colors.secondary, roughness: 0.5, metalness: 0.1 })
    const gloveMat = new THREE.MeshStandardMaterial({ color: colors.glove || colors.primary, roughness: 0.38, metalness: 0.08 })
    const hairMat = mat(colors.hair, 0.92)
    this.skinMat = skinMat
    this.skinHeadMat = skinHeadMat
    this.gloveMat = gloveMat

    const g = new THREE.Group()
    this.body.add(g)

    // hips / shorts
    const hips = new THREE.Group()
    hips.position.y = 0.96
    g.add(hips)
    this.j.hips = hips

    const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.155, 16, 12), shortsMat)
    pelvis.scale.set(1.18 * this.build, 0.95, 0.9)
    pelvis.position.y = 0.02
    hips.add(pelvis)

    const trunks = new THREE.Mesh(new THREE.CylinderGeometry(0.168 * this.build, 0.15 * this.build, 0.24, 16, 1, true), shortsMat)
    trunks.position.y = -0.055
    hips.add(trunks)

    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.172 * this.build, 0.172 * this.build, 0.055, 18), trimMat)
    belt.position.y = 0.075
    hips.add(belt)

    for (const s of [-1, 1]) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.26, 0.012), trimMat)
      stripe.position.set(s * 0.155 * this.build, -0.06, 0.08)
      stripe.rotation.y = s * 0.5
      hips.add(stripe)
    }

    // torso
    const chest = new THREE.Group()
    chest.position.y = 0.12
    hips.add(chest)
    this.j.chest = chest

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.155, 0.2, 6, 16), skinMat)
    torso.scale.set(1.3 * this.build, 1.0, 0.78 * this.build)
    torso.position.y = 0.19
    chest.add(torso)

    const chestPlate = new THREE.Mesh(new THREE.SphereGeometry(0.19, 18, 12), skinMat)
    chestPlate.scale.set(1.16 * this.build, 0.95, 0.66)
    chestPlate.position.y = 0.28
    chest.add(chestPlate)

    for (const s of [-1, 1]) {
      const pec = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), skinMat)
      pec.position.set(s * 0.085 * this.build, 0.3, 0.1)
      pec.scale.set(1.05, 0.72, 0.5)
      chest.add(pec)
    }

    const abs = new THREE.Mesh(new THREE.BoxGeometry(0.19 * this.build, 0.16, 0.05), skinMat)
    abs.position.set(0, 0.1, 0.115)
    abs.rotation.x = 0.04
    chest.add(abs)

    // neck & head
    const neck = new THREE.Group()
    neck.position.y = 0.4
    chest.add(neck)
    this.j.neck = neck
    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.09, 10), skinMat)
    neckMesh.position.y = 0.02
    neck.add(neckMesh)

    const head = new THREE.Group()
    head.position.y = 0.13
    neck.add(head)
    this.j.head = head
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.112, 24, 18), skinHeadMat)
    skull.scale.set(0.95, 1.12, 1.0)
    skull.position.y = 0.005
    skull.castShadow = true
    head.add(skull)
    this.skull = skull

    const jawScale = look.jaw || 1
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.135, 0.085, 0.13), skinHeadMat)
    jaw.position.set(0, -0.075, 0.012)
    jaw.scale.set(jawScale, 1, 0.92)
    head.add(jaw)

    // face
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.021, 0.058, 6), skinHeadMat)
    nose.rotation.x = Math.PI / 2
    nose.position.set(0, -0.018, 0.108)
    head.add(nose)
    for (const s of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), skinHeadMat)
      ear.position.set(s * 0.103, 0.005, -0.002)
      ear.scale.set(0.55, 1.0, 0.8)
      head.add(ear)
      const white = new THREE.Mesh(new THREE.SphereGeometry(0.021, 10, 8), new THREE.MeshStandardMaterial({ color: '#f4f0e8', roughness: 0.3 }))
      white.position.set(s * 0.043, 0.026, 0.095)
      white.scale.set(1.0, 0.72, 0.55)
      head.add(white)
      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.0095, 8, 6), new THREE.MeshStandardMaterial({ color: '#2a1c14', roughness: 0.2 }))
      iris.position.set(s * 0.043, 0.026, 0.108)
      iris.scale.set(1, 1, 0.5)
      head.add(iris)
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.011, 0.014), hairMat)
      brow.position.set(s * 0.045, 0.058, 0.102)
      brow.rotation.z = s * (look.brow === 'sharp' ? -0.22 : 0.06)
      head.add(brow)
    }
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.008, 0.01), new THREE.MeshStandardMaterial({ color: '#7a3d38', roughness: 0.6 }))
    mouth.position.set(0, -0.062, 0.104)
    head.add(mouth)
    this.mouth = mouth

    head.add(makeHair(look.hair || 'short', colors.hair, head, 1))
    makeBeard(look.beard || 'none', colors.hair, head, 1)

    if (look.tattoo === 'arm' || look.tattoo === 'shoulder') {
      const tattooMat = new THREE.MeshStandardMaterial({ color: '#20140f', roughness: 0.85 })
      const tg = new THREE.Group()
      for (let i = 0; i < 5; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.004, 4, 12, Math.PI * 1.2), tattooMat)
        ring.rotation.set(Math.PI / 2, 0, i * 0.7)
        ring.position.y = -0.16 - i * 0.026
        tg.add(ring)
      }
      tg.position.x = 0.235 * this.build
      tg.position.y = 0.22
      if (look.tattoo === 'shoulder') {
        const blade = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.008, 4, 14, Math.PI), tattooMat)
        blade.position.set(0.2, 0.33, -0.02)
        blade.rotation.set(0.2, 0, 0.5)
        chest.add(blade)
      }
      chest.add(tg)
    }

    // arms
    for (const side of ['L', 'R']) {
      const s = side === 'L' ? 1 : -1
      const sh = new THREE.Group()
      sh.position.set(s * 0.205 * this.build, 0.32, 0)
      chest.add(sh)
      this.j['sh' + side] = sh
      const upper = capsule(0.056 * this.build, 0.22, skinMat)
      upper.position.y = -0.135
      upper.castShadow = true
      sh.add(upper)
      const delt = new THREE.Mesh(new THREE.SphereGeometry(0.072 * this.build, 12, 10), skinMat)
      delt.position.y = -0.02
      sh.add(delt)
      const el = new THREE.Group()
      el.position.y = -0.27
      sh.add(el)
      this.j['el' + side] = el
      const fore = capsule(0.048 * this.build, 0.2, skinMat)
      fore.position.y = -0.12
      fore.castShadow = true
      el.add(fore)
      const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.06, 10), trimMat)
      wrist.position.y = -0.235
      el.add(wrist)
      const glove = new THREE.Mesh(new THREE.SphereGeometry(0.072 * this.build, 14, 12), gloveMat)
      glove.position.y = -0.275
      glove.scale.set(1.0, 1.18, 1.1)
      glove.castShadow = true
      el.add(glove)
      const thumb = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 6), gloveMat)
      thumb.position.set(0, -0.255, 0.055)
      el.add(thumb)
      this.j['hand' + side] = glove
    }

    // legs
    for (const side of ['L', 'R']) {
      const s = side === 'L' ? 1 : -1
      const hip = new THREE.Group()
      hip.position.set(s * 0.1 * this.build, -0.06, 0)
      hips.add(hip)
      this.j['hip' + side] = hip
      const thigh = capsule(0.075 * this.build, 0.3, skinMat)
      thigh.position.y = -0.19
      thigh.castShadow = true
      hip.add(thigh)
      const kn = new THREE.Group()
      kn.position.y = -0.39
      hip.add(kn)
      this.j['kn' + side] = kn
      const shin = capsule(0.056 * this.build, 0.32, skinMat)
      shin.position.y = -0.19
      shin.castShadow = true
      kn.add(shin)
      const foot = new THREE.Group()
      foot.position.y = -0.38
      kn.add(foot)
      this.j['foot' + side] = foot
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.06, 0.22), gloveMat)
      boot.position.set(0, -0.015, 0.06)
      boot.castShadow = true
      foot.add(boot)
    }

    // damage decals (hidden until cuts)
    this.bloodDecals = []
    const bloodMat = new THREE.MeshBasicMaterial({ color: '#9b0d10', transparent: true, opacity: 0.9, depthWrite: false })
    const faceSpots = [
      [0.045, 0.045, 0.101, 0.02],
      [-0.05, -0.01, 0.099, 0.017],
      [0.02, -0.04, 0.104, 0.014],
      [-0.035, 0.055, 0.097, 0.012],
    ]
    for (const [x, y, z, r] of faceSpots) {
      const spot = new THREE.Mesh(new THREE.CircleGeometry(r, 8), bloodMat)
      spot.position.set(x, y, z)
      spot.rotation.x = -0.25
      spot.visible = false
      head.add(spot)
      this.bloodDecals.push(spot)
    }
    const bodySpot = new THREE.Mesh(new THREE.CircleGeometry(0.05, 8), bloodMat)
    bodySpot.position.set(0.06, 0.3, 0.135)
    bodySpot.visible = false
    chest.add(bodySpot)
    this.bloodDecals.push(bodySpot)

    this.g = g
  }

  resetPose() {
    this.current = {}
    for (const j of JOINTS) this.current[j] = [0, 0, 0]
    this.applyPose(GUARD)
  }

  setAnim(name, restart = false) {
    if (this.anim === name && !restart) return
    this.anim = name
    this.animTime = 0
  }

  hurt(type = 'head') {
    this.flinch = type === 'body' ? 'hurtBody' : type === 'legs' ? 'hurtLeg' : 'hurtHead'
    this.flinchTime = 0
  }

  setDamage({ bruise = 0, cuts = 0 }) {
    this.damage.bruise = Math.min(1, bruise)
    this.damage.cuts = cuts
    const b = this.damage.bruise
    const tint = new THREE.Color(this.def.colors.skin)
    tint.lerp(new THREE.Color('#7e3530'), b * 0.55)
    this.skinMat.color.copy(tint)
    this.skinHeadMat.color.copy(tint)
    this.skinMat.roughness = 0.5 + b * 0.25
    this.skinHeadMat.roughness = 0.5 + b * 0.25
    this.bloodDecals.forEach((d, i) => { d.visible = i < cuts })
    if (this.skull) {
      this.skull.scale.set(0.95 + b * 0.035, 1.12 + b * 0.02, 1.0 + b * 0.025)
      this.mouth.scale.set(1 + b * 0.4, 1, 1)
    }
  }

  applyPose(pose) {
    for (const j of JOINTS) {
      const obj = this.j[j]
      if (!obj) continue
      const v = pose[j]
      obj.rotation.set(v[0], v[1], v[2])
    }
  }

  update(dt, elapsed) {
    if (this.koState) {
      this.updateKo(dt)
      return
    }
    this.animTime += dt
    let keys = POSES[this.anim] || POSES.idle
    let t = 1
    if (this.anim === 'idle' || this.anim === 'walk' || this.anim === 'groundTop' || this.anim === 'groundBottom') {
      const dur = this.anim === 'walk' ? Math.max(0.55, 0.95 - this.moveSpeed * 0.25) : 2.4
      t = (this.animTime % dur) / dur
    } else {
      const attack = ATTACKS[this.anim]
      const dur = attack ? attack.dur : 0.5
      t = clamp(this.animTime / dur, 0, 1)
    }
    let target = samplePose(keys, t)

    // flinch overlay
    if (this.flinch) {
      this.flinchTime += dt
      const ft = clamp(this.flinchTime / 0.38, 0, 1)
      if (ft >= 1) {
        this.flinch = null
      } else {
        const fpose = samplePose(POSES[this.flinch], ft < 0.5 ? ft * 2 : (1 - ft) * 2)
        const w = 0.85 * (1 - Math.abs(ft - 0.35) * 0.6)
        for (const j of JOINTS) {
          target[j] = [
            lerp(target[j][0], fpose[j][0], w),
            lerp(target[j][1], fpose[j][1], w),
            lerp(target[j][2], fpose[j][2], w),
          ]
        }
      }
    }

    // walking bob + breathing
    if (this.anim === 'idle' || this.anim === 'walk') {
      const bob = Math.sin(elapsed * (this.anim === 'walk' ? 7.5 : 1.9)) * (this.anim === 'walk' ? 0.04 : 0.012)
      this.body.position.y = bob
      const sway = Math.sin(elapsed * 1.4) * 0.012
      target.chest = [target.chest[0] + sway, target.chest[1], target.chest[2]]
    } else {
      this.body.position.y = lerp(this.body.position.y, 0, Math.min(1, dt * 10))
    }

    // smooth towards target
    const rate = this.anim.startsWith('hurt') ? 26 : 18
    for (const j of JOINTS) {
      const c = this.current[j]
      const v = target[j]
      c[0] = lerp(c[0], v[0], Math.min(1, dt * rate))
      c[1] = lerp(c[1], v[1], Math.min(1, dt * rate))
      c[2] = lerp(c[2], v[2], Math.min(1, dt * rate))
      const obj = this.j[j]
      if (obj) obj.rotation.set(c[0], c[1], c[2])
    }

    // sweat sheen as damage grows
    if (this.damage.bruise > 0.2) {
      this.skinMat.roughness = 0.42
      this.skinHeadMat.roughness = 0.4
    }
  }

  startKo(direction, force = 1) {
    this.koState = {
      vel: new THREE.Vector3(direction.x * force * 2.2, 2.1 + force * 1.2, direction.z * force * 2.2),
      angVel: new THREE.Vector3(-2.4 * force, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 3),
      t: 0,
      bounced: 0,
    }
    this.setAnim('limp')
    this.koState.tilt = 0
  }

  updateKo(dt) {
    const k = this.koState
    if (!k) return
    k.t += dt
    const gravity = -9.8
    k.vel.y += gravity * dt
    this.root.position.x += k.vel.x * dt
    this.root.position.z += k.vel.z * dt
    this.root.position.y += k.vel.y * dt
    if (this.root.position.y < 0) {
      this.root.position.y = 0
      if (Math.abs(k.vel.y) > 0.8 && k.bounced < 2) {
        k.vel.y = -k.vel.y * 0.28
        k.vel.x *= 0.72
        k.vel.z *= 0.72
        k.bounced++
      } else {
        k.vel.y = 0
        k.vel.x *= 0.9
        k.vel.z *= 0.9
      }
    }
    const fallT = clamp(k.t * 2.4, 0, 1)
    this.root.rotation.x = lerp(0, Math.PI * 0.5, fallT * fallT) + k.angVel.x * 0.05 * Math.sin(k.t * 3) * (1 - fallT)
    this.root.rotation.z = k.angVel.z * 0.06 * Math.sin(k.t * 2.2) * (1 - fallT * 0.8)
    // limbs flail then settle
    const f = Math.max(0, 1 - k.t * 0.8)
    const sway = Math.sin(k.t * 9) * 0.35 * f
    if (this.j.shL) this.j.shL.rotation.set(-0.4 + sway, 0.5, 0.7)
    if (this.j.shR) this.j.shR.rotation.set(-0.3 - sway, -0.5, -0.7)
    if (this.j.hipL) this.j.hipL.rotation.set(-0.4 + sway * 0.5, 0.2, 0.2)
    if (this.j.hipR) this.j.hipR.rotation.set(-0.3 - sway * 0.5, -0.2, -0.2)
    if (this.j.head) this.j.head.rotation.set(0.35 + sway * 0.2, 0.3, 0.2)
  }

  resetKo() {
    this.koState = null
    this.root.rotation.set(0, this.root.rotation.y, 0)
    this.root.position.y = 0
    this.body.position.y = 0
    this.setAnim('idle', true)
    this.setDamage({ bruise: 0, cuts: 0 })
  }

  setVisible(v) {
    this.root.visible = v
    this.visible = v
  }

  dispose() {
    this.root.traverse((o) => {
      if (o.geometry) o.geometry.dispose()
      if (o.material) {
        if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose())
        else o.material.dispose()
      }
    })
  }
}
