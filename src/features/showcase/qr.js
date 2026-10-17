// A small, self-contained QR code encoder for the full-screen demo's
// "Open on your phone" card. No dependency: byte mode only, error correction
// level L or M, versions 1–6 (up to 106 bytes at M, 134 at L) — plenty for a
// demo URL. Tested module-for-module against the reference `qrcode` encoder.
//
// encodeQR(text, { ecl: 'M', mask }) → { version, size, mask, modules }
// where modules[row][col] is true for a dark module.

// [total codewords, ec codewords per block, number of blocks] per version.
const BLOCKS = {
  L: [null, [26, 7, 1], [44, 10, 1], [70, 15, 1], [100, 20, 1], [134, 26, 1], [172, 18, 2]],
  M: [null, [26, 10, 1], [44, 16, 1], [70, 26, 1], [100, 18, 2], [134, 24, 2], [172, 16, 4]],
}
const FORMAT_BITS = { L: 1, M: 0 }
const MAX_VERSION = 6

/* ───────── Galois field GF(256), polynomial 0x11d ───────── */

const EXP = new Uint8Array(512)
const LOG = new Uint8Array(256)
{
  let x = 1
  for (let i = 0; i < 255; i++) {
    EXP[i] = x
    LOG[x] = i
    x <<= 1
    if (x & 0x100) x ^= 0x11d
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]
}

const mul = (a, b) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]])

// Generator polynomial for `degree` EC codewords, highest power first (the
// leading 1 is implied and omitted).
function generator(degree) {
  let poly = [1]
  for (let i = 0; i < degree; i++) {
    const next = new Array(poly.length + 1).fill(0)
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j]
      next[j + 1] ^= mul(poly[j], EXP[i])
    }
    poly = next
  }
  return poly.slice(1)
}

function remainder(data, gen) {
  const out = new Array(gen.length).fill(0)
  for (const byte of data) {
    const factor = byte ^ out.shift()
    out.push(0)
    for (let i = 0; i < gen.length; i++) out[i] ^= mul(gen[i], factor)
  }
  return out
}

/* ───────── Data codewords ───────── */

function toBytes(text) {
  return Array.from(new TextEncoder().encode(text))
}

function dataCodewords(bytes, capacity) {
  const bits = []
  const push = (value, length) => {
    for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1)
  }
  push(0b0100, 4) // byte mode
  push(bytes.length, 8) // character count (8 bits for versions 1–9)
  bytes.forEach((b) => push(b, 8))
  const capBits = capacity * 8
  push(0, Math.min(4, capBits - bits.length)) // terminator
  while (bits.length % 8) bits.push(0)
  const out = []
  for (let i = 0; i < bits.length; i += 8) out.push(bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0))
  for (let pad = 0xec; out.length < capacity; pad ^= 0xec ^ 0x11) out.push(pad)
  return out
}

function interleave(data, version, ecl) {
  const [total, ecLen, blocks] = BLOCKS[ecl][version]
  const dataLen = (total - ecLen * blocks) / blocks // every block is the same size for v1–6 at L/M
  const gen = generator(ecLen)
  const dataBlocks = []
  const ecBlocks = []
  for (let b = 0; b < blocks; b++) {
    const block = data.slice(b * dataLen, (b + 1) * dataLen)
    dataBlocks.push(block)
    ecBlocks.push(remainder(block, gen))
  }
  const out = []
  for (let i = 0; i < dataLen; i++) dataBlocks.forEach((blk) => out.push(blk[i]))
  for (let i = 0; i < ecLen; i++) ecBlocks.forEach((blk) => out.push(blk[i]))
  return out
}

/* ───────── Matrix ───────── */

function baseMatrix(version) {
  const size = version * 4 + 17
  const modules = Array.from({ length: size }, () => new Array(size).fill(false))
  const fixed = Array.from({ length: size }, () => new Array(size).fill(false))
  const set = (r, c, dark) => {
    modules[r][c] = dark
    fixed[r][c] = true
  }

  // Timing patterns.
  for (let i = 0; i < size; i++) {
    set(6, i, i % 2 === 0)
    set(i, 6, i % 2 === 0)
  }

  // Finder patterns with their separators.
  const finder = (r0, c0) => {
    for (let dr = -4; dr <= 4; dr++) {
      for (let dc = -4; dc <= 4; dc++) {
        const r = r0 + dr
        const c = c0 + dc
        if (r < 0 || c < 0 || r >= size || c >= size) continue
        const d = Math.max(Math.abs(dr), Math.abs(dc))
        set(r, c, d !== 2 && d !== 4)
      }
    }
  }
  finder(3, 3)
  finder(3, size - 4)
  finder(size - 4, 3)

  // One alignment pattern for versions 2–6.
  if (version >= 2) {
    const p = size - 7
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) set(p + dr, p + dc, Math.max(Math.abs(dr), Math.abs(dc)) !== 1)
    }
  }

  // Reserve the format areas (filled in later) and the dark module.
  for (let i = 0; i < 9; i++) {
    fixed[8][i] = true
    fixed[i][8] = true
  }
  for (let i = 0; i < 8; i++) {
    fixed[8][size - 1 - i] = true
    fixed[size - 1 - i][8] = true
  }
  set(size - 8, 8, true)

  return { size, modules, fixed }
}

function placeData(m, codewords) {
  const { size, modules, fixed } = m
  let i = 0
  const total = codewords.length * 8
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5
    const upward = ((right + 1) & 2) === 0
    for (let vert = 0; vert < size; vert++) {
      const r = upward ? size - 1 - vert : vert
      for (let j = 0; j < 2; j++) {
        const c = right - j
        if (fixed[r][c]) continue
        // Remainder bits (past the last codeword) stay light.
        modules[r][c] = i < total ? ((codewords[i >>> 3] >>> (7 - (i & 7))) & 1) === 1 : false
        i++
      }
    }
  }
}

const MASKS = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
]

function applyMask(m, mask) {
  const out = m.modules.map((row) => row.slice())
  const fn = MASKS[mask]
  for (let r = 0; r < m.size; r++) {
    for (let c = 0; c < m.size; c++) if (!m.fixed[r][c] && fn(r, c)) out[r][c] = !out[r][c]
  }
  return out
}

function drawFormat(modules, size, ecl, mask) {
  const data = (FORMAT_BITS[ecl] << 3) | mask
  let rem = data
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537)
  const bits = ((data << 10) | rem) ^ 0x5412
  const bit = (i) => ((bits >>> i) & 1) === 1

  // First copy, around the top-left finder (row, col).
  for (let i = 0; i <= 5; i++) modules[i][8] = bit(i)
  modules[7][8] = bit(6)
  modules[8][8] = bit(7)
  modules[8][7] = bit(8)
  for (let i = 9; i < 15; i++) modules[8][14 - i] = bit(i)
  // Second copy, split between the top-right and bottom-left finders.
  for (let i = 0; i < 8; i++) modules[8][size - 1 - i] = bit(i)
  for (let i = 8; i < 15; i++) modules[size - 15 + i][8] = bit(i)
  modules[size - 8][8] = true
}

/* ───────── Mask choice (ISO 18004 penalty rules) ───────── */

function penalty(modules) {
  const size = modules.length
  let score = 0
  const lines = []
  for (let i = 0; i < size; i++) {
    lines.push(modules[i])
    lines.push(modules.map((row) => row[i]))
  }
  for (const line of lines) {
    // Rule 1: runs of five or more.
    let run = 1
    for (let i = 1; i <= size; i++) {
      if (i < size && line[i] === line[i - 1]) run++
      else {
        if (run >= 5) score += 3 + (run - 5)
        run = 1
      }
    }
    // Rule 3: finder-like 1:1:3:1:1 with four light modules on either side.
    const s = line.map((d) => (d ? '1' : '0')).join('')
    for (let i = 0; i + 11 <= size; i++) {
      const w = s.slice(i, i + 11)
      if (w === '10111010000' || w === '00001011101') score += 40
    }
  }
  // Rule 2: 2×2 blocks of one colour.
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const d = modules[r][c]
      if (d === modules[r][c + 1] && d === modules[r + 1][c] && d === modules[r + 1][c + 1]) score += 3
    }
  }
  // Rule 4: balance of dark and light.
  let dark = 0
  modules.forEach((row) => row.forEach((d) => d && dark++))
  const percent = (dark * 100) / (size * size)
  score += Math.floor(Math.abs(percent - 50) / 5) * 10
  return score
}

/* ───────── Public API ───────── */

export function encodeQR(text, { ecl = 'M', mask } = {}) {
  if (!BLOCKS[ecl]) throw new Error(`QR: unsupported error correction level ${ecl}`)
  const bytes = toBytes(text)
  let version = 0
  for (let v = 1; v <= MAX_VERSION; v++) {
    const [total, ecLen, blocks] = BLOCKS[ecl][v]
    if (bytes.length + 2 <= total - ecLen * blocks) {
      version = v
      break
    }
  }
  if (!version) throw new Error('QR: text too long for versions 1–6')

  const [total, ecLen, blocks] = BLOCKS[ecl][version]
  const codewords = interleave(dataCodewords(bytes, total - ecLen * blocks), version, ecl)
  const base = baseMatrix(version)
  placeData(base, codewords)

  const candidates = mask == null ? [0, 1, 2, 3, 4, 5, 6, 7] : [mask]
  let best = null
  for (const m of candidates) {
    const modules = applyMask(base, m)
    drawFormat(modules, base.size, ecl, m)
    const score = candidates.length > 1 ? penalty(modules) : 0
    if (!best || score < best.score) best = { score, modules, mask: m }
  }
  return { version, size: base.size, mask: best.mask, modules: best.modules }
}

/** One SVG path (in module units) drawing every dark module. */
export function qrPath(modules) {
  let d = ''
  modules.forEach((row, r) => {
    let c = 0
    while (c < row.length) {
      if (!row[c]) {
        c++
        continue
      }
      const start = c
      while (c < row.length && row[c]) c++
      d += `M${start} ${r}h${c - start}v1h${start - c}z`
    }
  })
  return d
}
