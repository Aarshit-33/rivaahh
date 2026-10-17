import * as THREE from 'three'

// A small 3D envelope: back, letter, front pocket, a hinged flap with a wax seal,
// and a little gold dust. setOpen(0…1) swings the flap back and lifts the letter.

const W = 3
const H = 2

function paper(w, h, draw) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#fbf5e9')
  g.addColorStop(1, '#efe2c8')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  const img = ctx.getImageData(0, 0, w, h)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 10
    img.data[i] += n
    img.data[i + 1] += n
    img.data[i + 2] += n
  }
  ctx.putImageData(img, 0, 0)
  draw?.(ctx, w, h)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function sealCap() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(100, 90, 10, 128, 128, 130)
  g.addColorStop(0, '#a83a4c')
  g.addColorStop(0.6, '#6e1a2b')
  g.addColorStop(1, '#4a0e1b')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  ctx.strokeStyle = 'rgba(40,6,14,0.45)'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(128, 128, 88, 0, Math.PI * 2)
  ctx.stroke()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = 'italic 600 120px Fraunces, serif'
  ctx.fillStyle = 'rgba(255,200,205,0.25)'
  ctx.fillText('N', 124, 124)
  ctx.fillStyle = '#3e0915'
  ctx.fillText('N', 130, 132)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export class EnvelopeScene {
  constructor(canvas, { mobile = false } = {}) {
    this.canvas = canvas
    this.open = 0
    this.openTarget = 0
    this.pointer = { x: 0, y: 0 }
    this.visible = true
    this.mobile = mobile

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
    this.camera.position.set(0, 0.35, 8)

    this.scene.add(new THREE.AmbientLight(0xfff1dc, 1.6))
    const key = new THREE.DirectionalLight(0xffe0b0, 2.2)
    key.position.set(-3, 4, 5)
    this.scene.add(key)
    const rim = new THREE.DirectionalLight(0xb08d57, 1.2)
    rim.position.set(4, -2, -3)
    this.scene.add(rim)

    this.build()
    this.loop = this.loop.bind(this)
    this.t0 = performance.now()
    this.raf = requestAnimationFrame(this.loop)
    this.io = new IntersectionObserver(([e]) => (this.visible = e.isIntersecting))
    this.io.observe(canvas)
  }

  build() {
    const mat = (map, extra = {}) =>
      new THREE.MeshStandardMaterial({ map, roughness: 0.92, metalness: 0, side: THREE.DoubleSide, ...extra })
    this.textures = []
    const track = (t) => (this.textures.push(t), t)

    const env = new THREE.Group()
    env.rotation.x = -0.12
    this.scene.add(env)
    this.env = env

    const backTex = track(paper(512, 340))
    // polygonOffset pushes the back plane deeper into the depth buffer,
    // giving the overlapping pocket clean separation and stopping z-fighting.
    const back = new THREE.Mesh(
      new THREE.PlaneGeometry(W, H),
      mat(backTex, { color: 0xeadbc0, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }),
    )
    env.add(back)

    // The letter, tucked inside.
    const letterTex = track(
      paper(512, 340, (ctx, w, h) => {
        ctx.strokeStyle = '#b08d57'
        ctx.lineWidth = 3
        ctx.strokeRect(18, 18, w - 36, h - 36)
        ctx.fillStyle = '#6b1e2e'
        ctx.textAlign = 'center'
        ctx.font = '64px Parisienne, cursive'
        ctx.fillText('Let’s celebrate', w / 2, 120)
        ctx.fillStyle = 'rgba(42,30,26,0.35)'
        for (let i = 0; i < 4; i++) ctx.fillRect(110, 170 + i * 30, w - 220, 3)
      }),
    )
    const letter = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.9, H * 0.88), mat(letterTex))
    letter.position.z = 0.06
    env.add(letter)
    this.letter = letter

    // Front pocket: a rectangle with a V cut down its top edge.
    const pocket = new THREE.Shape()
    pocket.moveTo(-W / 2, -H / 2)
    pocket.lineTo(W / 2, -H / 2)
    pocket.lineTo(W / 2, H * 0.28)
    pocket.lineTo(0, -H * 0.08)
    pocket.lineTo(-W / 2, H * 0.28)
    pocket.closePath()
    const pocketGeo = new THREE.ShapeGeometry(pocket)
    this.uvFromBox(pocketGeo)
    const pocketTex = track(
      paper(512, 340, (ctx, w, h) => {
        ctx.fillStyle = 'rgba(59,36,32,0.75)'
        ctx.font = '40px Parisienne, cursive'
        ctx.fillText('To you & your family', 60, h - 70)
      }),
    )
    const front = new THREE.Mesh(pocketGeo, mat(pocketTex))
    front.position.z = 0.12
    env.add(front)

    // Flap, hinged on the top edge.
    const flapShape = new THREE.Shape()
    flapShape.moveTo(-W / 2, 0)
    flapShape.lineTo(W / 2, 0)
    flapShape.lineTo(0, -H * 0.6)
    flapShape.closePath()
    const flapGeo = new THREE.ShapeGeometry(flapShape)
    this.uvFromBox(flapGeo)
    const flapTex = track(paper(512, 256))
    const flap = new THREE.Group()
    flap.position.set(0, H / 2, 0.14)
    const flapMesh = new THREE.Mesh(flapGeo, mat(flapTex, { color: 0xf3e6cc }))
    flap.add(flapMesh)
    env.add(flap)
    this.flap = flap

    const sealTex = track(sealCap())
    const red = new THREE.MeshStandardMaterial({ color: 0x5e1424, roughness: 0.45, metalness: 0.1 })
    const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.27, 0.07, 40), [
      red,
      new THREE.MeshStandardMaterial({ map: sealTex, roughness: 0.4 }),
      red,
    ])
    seal.rotation.x = Math.PI / 2
    seal.position.set(0, -H * 0.53, 0.04)
    flap.add(seal)
    this.seal = seal

    // Gold dust.
    const n = this.mobile ? 60 : 140
    const pos = new Float32Array(n * 3)
    this.dustSeed = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 7
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3
      this.dustSeed[i] = Math.random() * 10
    }
    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.dustBase = pos.slice()
    this.dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: 0xe3c58c,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    )
    this.scene.add(this.dust)
  }

  // ShapeGeometry has no useful UVs; map x/y into 0…1 across the envelope.
  uvFromBox(geo) {
    const p = geo.attributes.position
    const uv = new Float32Array(p.count * 2)
    for (let i = 0; i < p.count; i++) {
      uv[i * 2] = p.getX(i) / W + 0.5
      uv[i * 2 + 1] = p.getY(i) / H + 0.5
    }
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  }

  resize(w, h) {
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    // Keep the whole envelope (and its lifted letter) in frame on narrow canvases.
    this.camera.position.z = w / h < 1 ? 10.5 : 8
    this.camera.updateProjectionMatrix()
  }

  setOpen(v) {
    this.openTarget = Math.min(1, Math.max(0, v))
  }

  setPointer(x, y) {
    this.pointer.x = x
    this.pointer.y = y
  }

  loop() {
    this.raf = requestAnimationFrame(this.loop)
    if (!this.visible) return
    const t = (performance.now() - this.t0) / 1000

    this.open += (this.openTarget - this.open) * 0.08
    const o = this.open
    const flapT = Math.min(1, o / 0.6)
    const lift = Math.max(0, (o - 0.45) / 0.55)
    const ease = (x) => 1 - Math.pow(1 - x, 3)

    // Swings towards the viewer, over the top, and comes to rest just past
    // vertical so it lies behind the envelope rather than over the letter.
    this.flap.rotation.x = -Math.PI * 1.06 * ease(flapT)
    // Once past vertical, the flap folds behind the letter.
    this.flap.position.z = flapT > 0.5 ? -0.05 : 0.14
    this.letter.position.y = ease(lift) * 1.05
    this.letter.position.z = 0.06 + lift * 0.02

    // Idle float, turned gently towards the pointer.
    this.env.position.y = Math.sin(t * 1.1) * 0.06 - lift * 0.25
    this.env.rotation.y += (this.pointer.x * 0.35 + Math.sin(t * 0.5) * 0.05 - this.env.rotation.y) * 0.05
    this.env.rotation.x += (-0.12 + this.pointer.y * 0.18 - this.env.rotation.x) * 0.05

    const p = this.dust.geometry.attributes.position
    for (let i = 0; i < p.count; i++) {
      const s = this.dustSeed[i]
      p.setY(i, this.dustBase[i * 3 + 1] + Math.sin(t * 0.4 + s) * 0.25)
      p.setX(i, this.dustBase[i * 3] + Math.cos(t * 0.3 + s) * 0.15)
    }
    p.needsUpdate = true

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    this.io.disconnect()
    this.scene.traverse((o) => {
      o.geometry?.dispose()
      ;[].concat(o.material ?? []).forEach((m) => m.dispose())
    })
    this.textures.forEach((t) => t.dispose())
    this.renderer.dispose()
  }
}
