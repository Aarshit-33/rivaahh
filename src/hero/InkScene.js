import * as THREE from 'three'
import { CARD_ASPECT, makeBlobTexture, makeCardTexture, makePetalTexture } from './textures'
import {
  CARD_FS,
  CARD_VS,
  PART_FS,
  PART_VS,
  PETAL_FS,
  PETAL_VS,
  SMOKE_FS,
  SMOKE_VS,
  SPARK_FS,
  SPARK_VS,
  BURST_VS,
} from './shaders'

const CAM_Z = 6
const FOV = 35

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const lerp = (a, b, t) => a + (b - a) * t

function pointsMaterial(uniforms, vertexShader, fragmentShader) {
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    premultipliedAlpha: true,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
  })
}

function randomAttr(count, size) {
  const a = new Float32Array(count * size)
  for (let i = 0; i < a.length; i++) a[i] = Math.random()
  return new THREE.BufferAttribute(a, size)
}

function pointsGeometry(count) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
  return g
}

/**
 * The "ink to instant" WebGL layer. It owns no layout: the React component
 * measures DOM anchors (card on the desk, card lifted, phone) and hands them
 * over via setLayout(), so CSS stays in charge of composition at every width.
 */
export class InkScene {
  constructor(canvas, { mobile }) {
    this.mobile = mobile
    this.p = 0
    this.pointer = { x: 0, y: 0 }
    this.visible = true
    this.built = false
    this.layout = null

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !mobile,
      powerPreference: 'high-performance',
    })
    this.renderer.setClearColor(0x000000, 0)
    this.dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
    this.renderer.setPixelRatio(this.dpr)

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
    this.camera.position.set(0, 0, CAM_Z)
    this.group = new THREE.Group()
    this.scene.add(this.group)

    this.uniforms = {
      uP: { value: 0 },
      uTime: { value: 0 },
      uPx: { value: this.dpr },
      uScale: { value: CAM_Z },
      uSize: { value: 2 },
      uA: { value: new THREE.Vector3() },
      uB: { value: new THREE.Vector3() },
      uC1: { value: new THREE.Vector3() },
      uC2: { value: new THREE.Vector3() },
      uMap: { value: null },
      uPetal: { value: null },
      uBlob: { value: null },
      uOld: { value: new THREE.Vector3() },
      uOldSize: { value: new THREE.Vector2() },
    }

    this.t0 = performance.now()
    this.io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting
    })
    this.io.observe(canvas)

    this.loop = this.loop.bind(this)
    this.ready = this.build()
    this.raf = requestAnimationFrame(this.loop)
  }

  async build() {
    await Promise.all([
      document.fonts.load('italic 40px Fraunces'),
      document.fonts.load('80px Parisienne'),
      document.fonts.load('600 20px Manrope'),
    ]).catch(() => {})
    if (this.disposed) return

    const U = this.uniforms
    this.textures = [makeCardTexture(), makePetalTexture(), makeBlobTexture()]
    ;[U.uMap.value, U.uPetal.value, U.uBlob.value] = this.textures

    // The invitation card itself.
    this.card = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.ShaderMaterial({
        uniforms: U,
        vertexShader: CARD_VS,
        fragmentShader: CARD_FS,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
      }),
    )
    this.card.renderOrder = 0

    // Soft contact shadow under the card while it rests on the desk.
    this.shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        map: U.uBlob.value,
        color: 0x3b2416,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    )
    this.shadow.renderOrder = -1

    // One particle per sampled pixel of the card.
    const gx = this.mobile ? 110 : 190
    const gy = Math.round(gx * CARD_ASPECT)
    this.gx = gx
    const n = gx * gy
    const uv = new Float32Array(n * 2)
    for (let y = 0, i = 0; y < gy; y++) {
      for (let x = 0; x < gx; x++, i++) {
        uv[i * 2] = (x + 0.5) / gx
        uv[i * 2 + 1] = (y + 0.5) / gy
      }
    }
    const pg = pointsGeometry(n)
    pg.setAttribute('aUv', new THREE.BufferAttribute(uv, 2))
    pg.setAttribute('aCard', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
    pg.setAttribute('aPhone', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
    pg.setAttribute('aRnd', randomAttr(n, 4))
    this.particles = new THREE.Points(pg, pointsMaterial(U, PART_VS, PART_FS))
    this.particles.renderOrder = 2

    const smokeN = this.mobile ? 350 : 900
    const sg = pointsGeometry(smokeN)
    sg.setAttribute('aRnd', randomAttr(smokeN, 4))
    this.smoke = new THREE.Points(sg, pointsMaterial(U, SMOKE_VS, SMOKE_FS))
    this.smoke.renderOrder = 1

    const petalN = this.mobile ? 40 : 90
    const petalG = pointsGeometry(petalN)
    petalG.setAttribute('aRnd', randomAttr(petalN, 4))
    petalG.setAttribute('aStart', new THREE.BufferAttribute(new Float32Array(petalN * 3), 3))
    this.petals = new THREE.Points(petalG, pointsMaterial(U, PETAL_VS, PETAL_FS))
    this.petals.renderOrder = 3

    const sparkN = this.mobile ? 120 : 260
    const spg = pointsGeometry(sparkN)
    spg.setAttribute('aRnd', randomAttr(sparkN, 4))
    const s = new Float32Array(sparkN)
    for (let i = 0; i < sparkN; i++) s[i] = 0.35 + Math.random() * 0.75
    spg.setAttribute('aS', new THREE.BufferAttribute(s, 1))
    this.sparks = new THREE.Points(spg, pointsMaterial(U, SPARK_VS, SPARK_FS))
    this.sparks.renderOrder = 4

    const burstN = this.mobile ? 160 : 420
    const bg = pointsGeometry(burstN)
    bg.setAttribute('aRnd', randomAttr(burstN, 4))
    this.burst = new THREE.Points(bg, pointsMaterial(U, BURST_VS, SPARK_FS))
    this.burst.renderOrder = 4

    for (const o of [this.shadow, this.card, this.smoke, this.particles, this.petals, this.sparks, this.burst]) {
      o.frustumCulled = false
      this.group.add(o)
    }

    this.built = true
    if (this.layout) this.applyLayout()
  }

  setLayout(layout) {
    this.layout = layout
    if (this.built) this.applyLayout()
  }

  setProgress(p) {
    this.p = p
  }

  setPointer(x, y) {
    this.pointer.x = x
    this.pointer.y = y
  }

  applyLayout() {
    const { W, H, cardStart, cardEnd, phone, oldPhone } = this.layout
    if (!W || !H) return
    this.renderer.setSize(W, H, false)
    this.camera.aspect = W / H
    this.camera.updateProjectionMatrix()

    const vh = 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAM_Z
    const vw = vh * (W / H)
    this.vh = vh
    const toWorld = (x, y) => new THREE.Vector3((x / W - 0.5) * vw, -(y / H - 0.5) * vh, 0)
    const center = (r) => toWorld(r.x + r.w / 2, r.y + r.h / 2)

    const cw = (cardEnd.w / W) * vw
    const ch = cw * CARD_ASPECT
    this.cardSize = [cw, ch]
    this.poseEnd = { pos: center(cardEnd), rot: new THREE.Euler(0, -0.22, -0.08), s: 1 }
    this.poseStart = { pos: center(cardStart), rot: new THREE.Euler(-1.12, 0, 0.32), s: cardStart.w / cardEnd.w }

    // Phone screen = phone frame minus its bezel (CSS padding: 3.6% of width).
    const inset = phone.w * 0.036
    const screen = { x: phone.x + inset, y: phone.y + inset, w: phone.w - inset * 2, h: phone.h - inset * 2 }
    const B = center(screen)
    const sw = (screen.w / W) * vw * 0.92
    const sh = (screen.h / H) * vh * 0.92

    const m = new THREE.Matrix4().compose(
      new THREE.Vector3(),
      new THREE.Quaternion().setFromEuler(this.poseEnd.rot),
      new THREE.Vector3(cw, ch, 1),
    )
    const v = new THREE.Vector3()
    const g = this.particles.geometry
    const uv = g.attributes.aUv.array
    const aCard = g.attributes.aCard.array
    const aPhone = g.attributes.aPhone.array
    for (let i = 0; i < uv.length / 2; i++) {
      const u = uv[i * 2]
      const w = uv[i * 2 + 1]
      v.set(u - 0.5, w - 0.5, 0).applyMatrix4(m)
      aCard.set([v.x, v.y, v.z], i * 3)
      aPhone.set([(u - 0.5) * sw, (w - 0.5) * sh, 0], i * 3)
    }
    g.attributes.aCard.needsUpdate = true
    g.attributes.aPhone.needsUpdate = true

    const starts = this.petals.geometry.attributes.aStart
    for (let i = 0; i < starts.count; i++) {
      v.set(Math.random() * 0.5, Math.random() - 0.5, 0).applyMatrix4(m)
      starts.setXYZ(i, v.x, v.y, v.z)
    }
    starts.needsUpdate = true

    // S-shaped spine from the lifted card to the phone, bowing towards the camera.
    const A = this.poseEnd.pos.clone()
    const d = B.clone().sub(A)
    const len = d.length()
    const perp = new THREE.Vector3(-d.y, d.x, 0).normalize()
    const U = this.uniforms
    U.uA.value.copy(A)
    U.uB.value.copy(B)
    U.uC1.value.copy(A).addScaledVector(d, 0.3).addScaledVector(perp, -len * 0.3).add(new THREE.Vector3(0, 0, 0.8))
    U.uC2.value.copy(A).addScaledVector(d, 0.68).addScaledVector(perp, len * 0.26).add(new THREE.Vector3(0, 0, 0.4))
    U.uSize.value = Math.max(1.5, (cardEnd.w / this.gx) * 1.75)
    if (oldPhone?.w) {
      U.uOld.value.copy(center(oldPhone))
      U.uOldSize.value.set((oldPhone.w / W) * vw * 0.8, (oldPhone.h / H) * vh * 0.8)
    }

    this.shadow.position.copy(this.poseStart.pos).add(new THREE.Vector3(0.04, -0.06, -0.02))
    this.shadow.rotation.copy(this.poseStart.rot)
    this.shadow.scale.set(cw * this.poseStart.s * 1.25, ch * this.poseStart.s * 1.15, 1)
  }

  loop() {
    this.raf = requestAnimationFrame(this.loop)
    if (!this.built || !this.layout || !this.poseEnd || !this.visible) return

    const t = (performance.now() - this.t0) / 1000
    const p = this.p
    this.uniforms.uTime.value = t
    this.uniforms.uP.value = p

    // 02 — the invitation lifts off the desk and turns to face the visitor.
    const L = easeIO(smooth(0.1, 0.22, p))
    const { poseStart: a, poseEnd: b } = this
    const arc = Math.sin(Math.PI * L)
    // At rest the card breathes on the desk, hinting that it is about to move.
    const rest = (1 - smooth(0, 0.04, p)) * (0.5 - 0.5 * Math.cos(t * 1.8))
    this.card.position.set(
      lerp(a.pos.x, b.pos.x, L),
      lerp(a.pos.y, b.pos.y, L) + arc * 0.25 * (this.vh / 3.8) + (L >= 1 ? Math.sin(t * 1.3) * 0.012 : 0) + rest * 0.025,
      lerp(a.pos.z, b.pos.z, L) + arc * 0.4 + rest * 0.06,
    )
    this.card.rotation.set(lerp(a.rot.x, b.rot.x, L) + rest * 0.06, lerp(a.rot.y, b.rot.y, L), lerp(a.rot.z, b.rot.z, L))
    const s = lerp(a.s, b.s, L)
    this.card.scale.set(this.cardSize[0] * s, this.cardSize[1] * s, 1)
    this.card.visible = p < 0.405
    this.shadow.material.opacity = 0.32 * (1 - L) * (1 - rest * 0.35)

    // Gentle parallax so the scene feels alive at rest.
    this.group.rotation.y += (this.pointer.x * 0.035 - this.group.rotation.y) * 0.05
    this.group.rotation.x += (this.pointer.y * 0.02 - this.group.rotation.x) * 0.05

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    this.io.disconnect()
    this.group?.traverse((o) => {
      o.geometry?.dispose()
      o.material?.dispose()
    })
    this.textures?.forEach((tx) => tx.dispose())
    this.renderer.dispose()
  }
}
