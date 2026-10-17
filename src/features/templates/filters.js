// Filters for the templates pages: what each question means, how a template
// is matched and ranked, and how filters live in the URL
// (?occasion=wedding&format=reel&style=royal,floral&colour=maroon).

import { COLOUR_OPTIONS, MOTIF_OPTIONS, OCCASIONS_META, STYLE_OPTIONS, TRADITION_OPTIONS } from '@/templates/data'

export const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Multi-select questions. Each option: { slug, label, word, test(t) }.
 * `label` is the chip text, `word` is how it reads inside a "why" tag.
 */
export const DIMS = {
  occasion: {
    label: 'Occasion',
    all: 'all occasions',
    options: OCCASIONS_META.map((o) => ({
      slug: o.slug,
      label: o.label,
      word: o.label,
      plural: o.plural,
      test: (t) => t.occasions.includes(o.label),
    })),
  },
  tradition: {
    label: 'Tradition',
    all: 'every tradition',
    options: TRADITION_OPTIONS.map((x) => ({ slug: slugify(x), label: x, word: x, test: (t) => t.tradition === x })),
  },
  style: {
    label: 'Style',
    all: 'any style',
    options: STYLE_OPTIONS.map((x) => ({ slug: slugify(x), label: x, word: x, test: (t) => t.style === x })),
  },
  colour: {
    label: 'Colour',
    all: 'any colour',
    options: COLOUR_OPTIONS.map(([theme, label]) => ({
      slug: slugify(label),
      label,
      word: label.toLowerCase(),
      theme,
      test: (t) => t.theme === theme,
    })),
  },
  motif: {
    label: 'Motif',
    all: 'any motif',
    options: MOTIF_OPTIONS.map(([id, label]) => ({
      slug: id,
      label,
      word: `${label.toLowerCase()} motif`,
      test: (t) => t.motif === id,
    })),
  },
}

export const FORMATS = [
  { slug: 'all', label: 'Cards & reels', short: 'Cards & reels' },
  { slug: 'card', label: 'Only cards', short: 'Cards' },
  { slug: 'reel', label: 'Only reels', short: 'Reels' },
]

export const WALL_SORTS = [
  ['best', 'Best match'],
  ['az', 'Name, A–Z'],
  ['za', 'Name, Z–A'],
]

/** The category page's filters (occasion comes from the route). */
export const CATEGORY_DEFAULTS = { format: 'all', tradition: [], style: [], colour: [], sort: 'featured' }

export const EMPTY = { occasion: [], format: 'all', tradition: [], style: [], colour: [], motif: [], sort: 'best' }

const LIST_DIMS = ['occasion', 'tradition', 'style', 'colour', 'motif']

/** Read filters from a query string. Unknown values are dropped. */
export function parseFilters(search, defaults = EMPTY) {
  const q = new URLSearchParams(search)
  const f = { ...defaults }
  for (const dim of LIST_DIMS) {
    if (!(dim in defaults)) continue
    const raw = q.get(dim)
    if (!raw) continue
    const valid = new Set(DIMS[dim].options.map((o) => o.slug))
    f[dim] = [...new Set(raw.split(',').map((s) => s.trim().toLowerCase()))].filter((s) => valid.has(s))
  }
  if ('format' in defaults) {
    const fm = q.get('format')
    if (fm === 'card' || fm === 'reel') f.format = fm
  }
  if ('sort' in defaults) {
    const s = q.get('sort')
    if (['best', 'featured', 'az', 'za'].includes(s)) f.sort = s
  }
  return f
}

/** Filters → query string (without "?"), skipping defaults. */
export function serializeFilters(f, defaults = EMPTY, extra = {}) {
  const q = new URLSearchParams()
  for (const dim of LIST_DIMS) if (f[dim]?.length) q.set(dim, f[dim].join(','))
  if (f.format && f.format !== 'all') q.set('format', f.format)
  if (f.sort && f.sort !== defaults.sort) q.set('sort', f.sort)
  for (const [k, v] of Object.entries(extra)) if (v) q.set(k, v)
  return q.toString().replace(/%2C/g, ',')
}

export const optionOf = (dim, slug) => DIMS[dim].options.find((o) => o.slug === slug)

/** Questions that currently narrow the list. */
export function activeDims(f) {
  const out = LIST_DIMS.filter((d) => f[d]?.length)
  if (f.format && f.format !== 'all') out.splice(1, 0, 'format')
  return out
}

export const isFiltered = (f) => activeDims(f).length > 0

function testDim(t, dim, f) {
  if (dim === 'format') return t.format === f.format
  return f[dim].some((slug) => optionOf(dim, slug)?.test(t))
}

/** The words of a template's "why" tag: one per question it matches. */
function whyWords(t, f) {
  const words = []
  for (const dim of activeDims(f)) {
    if (dim === 'format') {
      if (t.format === f.format) words.push(t.format === 'reel' ? 'Reel' : 'Card')
      continue
    }
    const hit = f[dim].map((s) => optionOf(dim, s)).find((o) => o?.test(t))
    if (hit) words.push(hit.word)
  }
  return words
}

/**
 * Rank templates against the filters.
 * Returns { matches, others }: `matches` fit every question that is set, best
 * first; `others` miss at least one, closest first. Each item: { t, why, hits }.
 */
export function rank(list, f) {
  const dims = activeDims(f)
  const scored = list.map((t, i) => {
    const hits = dims.filter((d) => testDim(t, d, f)).length
    const primary =
      f.occasion.length && f.occasion.some((s) => optionOf('occasion', s)?.label === t.occasions[0]) ? 1 : 0
    return { t, i, hits, why: whyWords(t, f), score: hits * 10 + primary * 2 + (t.featured ? 1 : 0) }
  })
  const byScore = (a, b) => b.score - a.score || a.i - b.i
  const byName = (dir) => (a, b) => dir * a.t.name.localeCompare(b.t.name)
  const order = f.sort === 'az' ? byName(1) : f.sort === 'za' ? byName(-1) : byScore
  const matches = scored.filter((s) => s.hits === dims.length).sort(order)
  const others = scored.filter((s) => s.hits < dims.length).sort(byScore)
  return { matches, others }
}

export const countMatches = (list, f) => rank(list, f).matches.length

/** Every way to loosen the filters by one value, with the count it would give. */
export function relaxOptions(list, f) {
  const out = []
  for (const dim of activeDims(f)) {
    if (dim === 'format') {
      const next = { ...f, format: 'all' }
      out.push({
        key: 'format',
        label: f.format === 'reel' ? 'Reels only' : 'Cards only',
        next,
        count: countMatches(list, next),
      })
      continue
    }
    for (const slug of f[dim]) {
      const next = { ...f, [dim]: f[dim].filter((s) => s !== slug) }
      out.push({ key: `${dim}-${slug}`, label: optionOf(dim, slug).label, next, count: countMatches(list, next) })
    }
  }
  return out.filter((o) => o.count > 0).sort((a, b) => b.count - a.count)
}

/** Plain-English summary of the filters, for chips and announcements. */
export function summaryWords(f) {
  const words = []
  for (const dim of activeDims(f)) {
    if (dim === 'format') words.push(f.format === 'reel' ? 'Reels' : 'Cards')
    else words.push(f[dim].map((s) => optionOf(dim, s).label).join(' & '))
  }
  return words
}

/**
 * For one question, how many designs in `list` each answer would give with
 * the other answers kept: { slug: count }.
 */
export function facetCounts(list, f, dim) {
  const out = {}
  if (dim === 'format') {
    for (const x of FORMATS) out[x.slug] = countMatches(list, { ...f, format: x.slug })
    return out
  }
  for (const o of DIMS[dim].options) out[o.slug] = countMatches(list, { ...f, [dim]: [o.slug] })
  return out
}

/** The format-free filters of one occasion's wall (the occasion comes from the route). */
export const OCCASION_WALL = { format: 'all', tradition: [], style: [], colour: [], motif: [], sort: 'best' }

/**
 * The "this or that" pairs, with designs taken from `list` where it has one
 * for a side. Pairs where `list` has neither side are left out.
 */
export function scopedPairs(pairs, list) {
  const fits = (side) => (t) =>
    (side.set.style || []).some((x) => optionOf('style', x)?.test(t)) ||
    (side.set.colour || []).some((x) => optionOf('colour', x)?.test(t))
  return pairs
    .map((p) => {
      const a = list.filter(fits(p.a))
      const b = list.filter(fits(p.b))
      if (!a.length && !b.length) return null
      const pa = a[0]
      const pb = b.find((t) => t !== pa)
      return {
        ...p,
        a: { ...p.a, template: pa ? pa.id : p.a.template },
        b: { ...p.b, template: pb ? pb.id : p.b.template },
      }
    })
    .filter(Boolean)
}
