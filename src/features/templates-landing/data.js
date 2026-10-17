// Data for the /templates landing page ("The Hand-Delivered Spread").
// Every count shown on the page is computed from the real catalogue here.

import { DIMS, optionOf } from '@/features/templates/filters'
import { OCCASIONS_META, OCCASION_SAMPLE, TEMPLATES, templatesFor } from '@/templates/data'

/** The questions that narrow the collections, all without leaving the page. */
export const NARROW_DIMS = ['occasion', 'tradition', 'style', 'colour']
export const NARROW_DEFAULTS = { occasion: [], tradition: [], style: [], colour: [] }

/** Does a template fit every question that is set? */
export function fits(t, f) {
  return NARROW_DIMS.every((dim) => !f[dim]?.length || f[dim].some((slug) => optionOf(dim, slug)?.test(t)))
}

export const isNarrowed = (f) => NARROW_DIMS.some((d) => f[d]?.length)

/** "tradition=sikh&style=royal&colour=maroon" to carry into a collection
 *  (the occasion is the collection itself, so it stays behind). */
export function narrowQuery(f) {
  const q = new URLSearchParams()
  for (const dim of NARROW_DIMS) if (dim !== 'occasion' && f[dim]?.length) q.set(dim, f[dim].join(','))
  return q.toString().replace(/%2C/g, ',')
}

export const categoryHref = (slug, f) => {
  const q = f ? narrowQuery(f) : ''
  return `/templates/category/${slug}${q ? `?${q}` : ''}`
}

// Where each card sits on the "table": a hidden 12-column grid with uneven
// spans, offsets and gentle tilts. Seeded, so server and browser agree.
const PLACES = {
  wedding: { col: '1 / span 5', y: 0, tilt: -1.6, size: 'lg' },
  birthday: { col: '7 / span 3', y: 72, tilt: 2.2, size: 'sm' },
  'griha-pravesh': { col: '2 / span 4', y: 0, tilt: 1.2, size: 'md' },
  'baby-shower': { col: '1 / span 4', y: 0, tilt: -2.4, size: 'md' },
  anniversary: { col: '6 / span 3', y: 64, tilt: 1.8, size: 'sm' },
  'pooja-festivals': { col: '2 / span 5', y: 0, tilt: -1.2, size: 'lg' },
}

// Which designs sit on top of each stack: featured first, then reels.
const stackFor = (list) =>
  [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (a.format === 'reel' ? -1 : 1)).slice(0, 3)

export const CATEGORIES = OCCASIONS_META.map((o) => {
  const list = templatesFor(o.label)
  return {
    ...o,
    ids: list.map((t) => t.id),
    total: list.length,
    reels: list.filter((t) => t.format === 'reel').length,
    stack: stackFor(list).map((t) => t.id),
    parts: (OCCASION_SAMPLE[o.label]?.functions || []).map(([name]) => name),
    place: PLACES[o.slug],
  }
})

export const TOTAL = TEMPLATES.length
export const REELS = TEMPLATES.filter((t) => t.format === 'reel').length

/** Colour swatches: id = the colour filter's slug. */
export const SWATCHES = DIMS.colour.options.map((o) => ({
  slug: o.slug,
  label: o.label,
  theme: o.theme,
  count: TEMPLATES.filter(o.test).length,
}))

/** The featured design in the opening. */
export const HERO_ID = 'marigold'

/** The small category slips under the opening card. */
export const HERO_SLIPS = ['wedding', 'griha-pravesh', 'pooja-festivals']

/** Find a category from a slug or a label ("Pooja & festivals", "wedding"). */
export function findOccasion(raw) {
  if (!raw) return null
  const v = raw.split(',')[0].trim().toLowerCase()
  const slug = v
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return OCCASIONS_META.find((o) => o.slug === slug || o.label.toLowerCase() === v || o.plural.toLowerCase() === v)
}

/** The category with the most designs that fit `f` (first in order on a tie). */
export function bestCategory(f) {
  let best = CATEGORIES[0]
  let most = -1
  for (const c of CATEGORIES) {
    const n = TEMPLATES.filter((t) => c.ids.includes(t.id) && fits(t, f)).length
    if (n > most) {
      most = n
      best = c
    }
  }
  return { category: best, count: most }
}

/* ───────── The spread (matches the Stitch "hand-delivered spread") ───────── */

// Each category is drawn as one piece of stationery on the table. The words
// are sample details a host would type (illustrative, not real events).
export const STATIONERY = {
  wedding: {
    tone: 'royal',
    icon: 'arch',
    eyebrow: 'Vivah Nimantran',
    kicker: 'Together with their families',
    title: 'Ananya & Kabir',
    date: 'Saturday, 14 March 2027',
    place: 'The Jai Mahal Palace, Jaipur',
    seal: true,
    quote: 'Wedding • Haldi to reception • Sindoor maroon',
    personal: true,
  },
  'griha-pravesh': {
    tone: 'ivory',
    icon: 'compass',
    eyebrow: 'Griha Pravesh • Vastu Shanti',
    title: 'The Mehta family',
    lines: ['Vastu pooja & lunch'],
    place: 'Our new home, Koregaon Park, Pune',
    pill: '22 · 04 · 2027',
    quote: 'Housewarming • Warm ivory deboss',
  },
  'pooja-festivals': {
    tone: 'forest',
    eyebrow: 'Diwali • Eid • Lohri • Christmas',
    title: 'At the Agarwals',
    lines: ['Lakshmi pooja, aarti & dinner'],
    rule: true,
    quote: 'Festive evenings • Lights & sweets',
    open: 'View',
  },
  anniversary: {
    tone: 'gold',
    eyebrow: '25 years together',
    title: 'Sunita & Rajesh',
    lines: ['The Taj Lands End, Mumbai'],
    quote: 'Silver & golden • Champagne gold',
  },
  'baby-shower': {
    tone: 'blush',
    eyebrow: 'Godh Bharai / Baby shower',
    title: 'A little one soon',
    strong: 'Celebrating Priya’s new beginning',
    lines: ['Sunday brunch • The Courtyard, Ahmedabad'],
    icon: 'sun',
    quote: 'Baby shower • Blush morning sunburst',
  },
  birthday: {
    tone: 'paper',
    eyebrow: '5th birthday celebration',
    title: 'Aarav turns 5',
    lines: ['A carnival evening • The Glasshouse, Pune'],
    quote: 'Milestone birthday • Pastel sunbeam',
  },
}

// The one piece on the table that isn't a category: bespoke work.
export const BESPOKE = {
  tone: 'note',
  icon: 'spark',
  eyebrow: 'Bespoke • Made with you',
  title: 'Something of your own',
  lines: ['Illustrated from scratch, in your colours'],
  quote: 'Any occasion • Your palette',
  label: 'Bespoke • On request',
  open: 'Ask',
  href: '/contact?topic=bespoke',
}

// The design in the opening, and the three small slips under it.
export const OPENING_ID = 'aangan'
export const OPENING_SLIPS = [
  { id: 'rajwada', name: 'Rajwada', note: 'Royal maroon foil', tone: 'low' },
  { id: 'ivory', name: 'Letterpress', note: 'Cotton rag & arch', tone: 'lowest' },
  { id: 'noor', name: 'Noor', note: 'Deep forest arch', tone: 'dark' },
]

/* ───────── When the answers don't fit ───────── */

const QUESTION_WORD = { occasion: 'occasion', tradition: 'tradition', style: 'style', colour: 'colour' }

/**
 * The closest set of answers that still finds designs among `ids`: the answers
 * as they are if anything fits, otherwise the fewest questions dropped (the
 * colour first, then the style, then the tradition). `count` is how many
 * designs fit the returned answers; `dropped` names the questions let go.
 */
export function closestFit(f, ids = TEMPLATES.map((t) => t.id)) {
  const list = ids.map((id) => TEMPLATES.find((t) => t.id === id)).filter(Boolean)
  const n = (g) => list.filter((t) => fits(t, g)).length
  const set = NARROW_DIMS.filter((d) => f[d]?.length)
  if (n(f) > 0) return { filters: f, dropped: [], count: n(f) }

  // Try dropping one question, then two, keeping the most designs.
  const orders = ['colour', 'style', 'tradition'].filter((d) => set.includes(d))
  const tries = [
    ...orders.map((d) => [d]),
    ...orders.flatMap((a, i) => orders.slice(i + 1).map((b) => [a, b])),
  ]
  let best = null
  for (const drop of tries) {
    if (best && drop.length > best.dropped.length) break
    const g = { ...f, ...Object.fromEntries(drop.map((d) => [d, []])) }
    const count = n(g)
    if (count > 0 && (!best || count > best.count)) best = { filters: g, dropped: drop, count }
  }
  return best || { filters: { ...f, ...NARROW_DEFAULTS }, dropped: set, count: list.length }
}

/** "Drop ‘Modern’ · 7 designs" suggestions for the whole catalogue. */
export function relaxSuggestions(f) {
  return NARROW_DIMS.filter((d) => f[d]?.length)
    .map((d) => {
      const g = { ...f, [d]: [] }
      const count = TEMPLATES.filter((t) => fits(t, g)).length
      const words = f[d].map((slug) => optionOf(d, slug)?.label).filter(Boolean)
      return { dim: d, next: g, count, label: words.length === 1 ? words[0] : `the ${QUESTION_WORD[d]}` }
    })
    .filter((r) => r.count > 0)
}
