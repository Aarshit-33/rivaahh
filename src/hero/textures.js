import * as THREE from 'three'

export const CARD_W = 720
export const CARD_H = 1008
export const CARD_ASPECT = CARD_H / CARD_W

const GOLD = '#B08D57'
const MAROON = '#6B1E2E'

function canvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')]
}

function grain(ctx, w, h, amount) {
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount
    d[i] += n
    d[i + 1] += n
    d[i + 2] += n * 0.9
  }
  ctx.putImageData(img, 0, 0)
}

function deckledPath(ctx, w, h, inset, wobble) {
  const pts = []
  const step = 14
  for (let x = inset; x <= w - inset; x += step) pts.push([x, inset + Math.random() * wobble])
  for (let y = inset; y <= h - inset; y += step) pts.push([w - inset - Math.random() * wobble, y])
  for (let x = w - inset; x >= inset; x -= step) pts.push([x, h - inset - Math.random() * wobble])
  for (let y = h - inset; y >= inset; y -= step) pts.push([inset + Math.random() * wobble, y])
  ctx.beginPath()
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
  ctx.closePath()
}

function ornament(ctx, x, y, s, flipX, flipY) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(flipX ? -s : s, flipY ? -s : s)
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(0, 60)
  ctx.bezierCurveTo(0, 20, 20, 0, 60, 0)
  ctx.moveTo(10, 50)
  ctx.bezierCurveTo(14, 30, 30, 14, 50, 10)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(22, 22, 5, 0, Math.PI * 2)
  ctx.stroke()
  for (const [lx, ly, r] of [[38, 12, 0.6], [12, 38, -0.6]]) {
    ctx.save()
    ctx.translate(lx, ly)
    ctx.rotate(r)
    ctx.beginPath()
    ctx.ellipse(0, 0, 8, 3.2, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }
  ctx.restore()
}

function waxSeal(ctx, cx, cy, r) {
  ctx.save()
  ctx.beginPath()
  const n = 56
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2
    const rr = r * (1 + 0.05 * Math.sin(a * 7) + 0.035 * Math.sin(a * 13 + 1.3) + Math.random() * 0.02)
    const x = cx + Math.cos(a) * rr
    const y = cy + Math.sin(a) * rr
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
  }
  ctx.closePath()
  const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r * 1.05)
  g.addColorStop(0, '#9b3446')
  g.addColorStop(0.55, '#6e1a2b')
  g.addColorStop(1, '#4d0f1d')
  ctx.shadowColor = 'rgba(60,20,10,0.35)'
  ctx.shadowBlur = 18
  ctx.shadowOffsetY = 6
  ctx.fillStyle = g
  ctx.fill()
  ctx.shadowColor = 'transparent'
  ctx.lineWidth = 3
  ctx.strokeStyle = 'rgba(40,6,14,0.35)'
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeStyle = 'rgba(255,200,205,0.18)'
  ctx.beginPath()
  ctx.arc(cx - 1.5, cy - 1.5, r * 0.72, Math.PI * 1.1, Math.PI * 1.9)
  ctx.stroke()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `italic 600 ${Math.round(r * 0.95)}px Fraunces, serif`
  ctx.fillStyle = 'rgba(255,190,200,0.22)'
  ctx.fillText('N', cx - 2, cy - 2)
  ctx.fillStyle = '#430b18'
  ctx.fillText('N', cx + 1.5, cy + 2)
  ctx.restore()
}

export function makeCardTexture() {
  const [c, ctx] = canvas(CARD_W, CARD_H)
  const bg = ctx.createLinearGradient(0, 0, 0, CARD_H)
  bg.addColorStop(0, '#FBF5E9')
  bg.addColorStop(1, '#F2E6CF')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, CARD_W, CARD_H)
  grain(ctx, CARD_W, CARD_H, 14)

  const vig = ctx.createRadialGradient(CARD_W / 2, CARD_H / 2, CARD_W * 0.3, CARD_W / 2, CARD_H / 2, CARD_W * 0.85)
  vig.addColorStop(0, 'rgba(0,0,0,0)')
  vig.addColorStop(1, 'rgba(150,105,55,0.20)')
  ctx.fillStyle = vig
  ctx.fillRect(0, 0, CARD_W, CARD_H)

  ctx.strokeStyle = GOLD
  ctx.lineWidth = 2.2
  ctx.strokeRect(40, 40, CARD_W - 80, CARD_H - 80)
  ctx.lineWidth = 1
  ctx.strokeRect(52, 52, CARD_W - 104, CARD_H - 104)
  ornament(ctx, 64, 64, 1, false, false)
  ornament(ctx, CARD_W - 64, 64, 1, true, false)
  ornament(ctx, 64, CARD_H - 64, 1, false, true)
  ornament(ctx, CARD_W - 64, CARD_H - 64, 1, true, true)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#9a7a48'
  ctx.font = '600 21px Manrope, sans-serif'
  if ('letterSpacing' in ctx) ctx.letterSpacing = '7px'
  ctx.fillText('YOU ARE CORDIALLY INVITED', CARD_W / 2 + 3, 200)
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'

  ctx.fillStyle = '#3a1d1b'
  ctx.font = '112px Parisienne, cursive'
  ctx.fillText('Celebrate', CARD_W / 2, 350)
  ctx.font = '84px Parisienne, cursive'
  ctx.fillText('with us', CARD_W / 2, 445)

  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(CARD_W / 2 - 90, 500)
  ctx.lineTo(CARD_W / 2 - 12, 500)
  ctx.moveTo(CARD_W / 2 + 12, 500)
  ctx.lineTo(CARD_W / 2 + 90, 500)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(CARD_W / 2, 500, 4, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = MAROON
  ctx.font = 'italic 34px Fraunces, serif'
  ctx.fillText('Saturday, the fourteenth of March', CARD_W / 2, 568)
  ctx.fillStyle = '#4a3530'
  ctx.font = 'italic 26px Fraunces, serif'
  ctx.fillText('at half past four in the evening', CARD_W / 2, 612)

  waxSeal(ctx, CARD_W / 2, 770, 74)

  ctx.fillStyle = '#9a7a48'
  ctx.font = '600 17px Manrope, sans-serif'
  if ('letterSpacing' in ctx) ctx.letterSpacing = '5px'
  ctx.fillText('KINDLY REPLY BY POST', CARD_W / 2 + 2, 912)

  // Deckled, slightly irregular paper edge.
  ctx.globalCompositeOperation = 'destination-in'
  deckledPath(ctx, CARD_W, CARD_H, 4, 5)
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.globalCompositeOperation = 'source-over'

  const tex = new THREE.CanvasTexture(c)
  tex.anisotropy = 4
  tex.needsUpdate = true
  return tex
}

export function makePetalTexture() {
  const [c, ctx] = canvas(128, 128)
  ctx.beginPath()
  ctx.moveTo(64, 6)
  ctx.bezierCurveTo(112, 28, 108, 98, 64, 124)
  ctx.bezierCurveTo(20, 98, 16, 28, 64, 6)
  const g = ctx.createRadialGradient(52, 40, 6, 64, 70, 70)
  g.addColorStop(0, '#b4404f')
  g.addColorStop(0.55, '#7a1a2c')
  g.addColorStop(1, '#4c0b1a')
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,205,210,0.22)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(64, 16)
  ctx.quadraticCurveTo(58, 70, 64, 116)
  ctx.stroke()
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

export function makeBlobTexture() {
  const [c, ctx] = canvas(128, 128)
  for (let i = 0; i < 9; i++) {
    const x = 64 + (Math.random() - 0.5) * 50
    const y = 64 + (Math.random() - 0.5) * 30
    const r = 18 + Math.random() * 34
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, 'rgba(255,255,255,0.55)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 128, 128)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}
