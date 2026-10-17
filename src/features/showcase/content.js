// Copy and small facts used only by the single-template showcase.
// Everything here describes what the invitations do; nothing claims sales,
// prices, ratings or reply times.

import { occasionByLabel } from '@/templates/data'

// The stage takes the darkest tone of the invitation's own palette, so the
// invitation glows against it. Ivory is the one light stage.
export const STAGE = {
  royal: { field: '#3f0e1a', light: false },
  forest: { field: '#16291f', light: false },
  gold: { field: '#4a3517', light: false },
  ivory: { field: '#eadfcb', light: true },
  blush: { field: '#5a2a33', light: false },
}

// The swatch shown in the colourway dots (the invitation's own face colour).
export const SWATCH = {
  royal: '#7a2436',
  forest: '#2a4c3a',
  gold: '#e3c58c',
  ivory: '#f1e6d2',
  blush: '#e8c3b8',
}

// A one-line note under each karyakram row, by part id.
export const PART_NOTES = {
  cover: (t) =>
    t.format === 'reel'
      ? 'The opening plays as the link is opened, then settles on the names.'
      : 'The first thing guests see when they open the link.',
  welcome: () => 'A few lines in your own words, signed the way you like.',
  functions: () => 'Each function with its own day and time, in order.',
  venue: () => 'A drawn map and a button that opens directions on the guest’s phone.',
  rsvp: () => 'Guests answer in one tap. You see every reply in your guest list.',
  countdown: () => 'Counts down to the day, live, every time it is opened.',
}

/** "Wedding" → { href, label } for the breadcrumb and the contact link. */
export function occasionLink(t) {
  const meta = occasionByLabel(t.occasions[0])
  return meta
    ? { href: `/templates/category/${meta.slug}`, label: meta.plural, slug: meta.slug }
    : { href: '/occasions', label: 'All designs', slug: '' }
}

/** Format line, e.g. "Reel · 0:18" or "Card · scrolls". */
export const formatLine = (t) => (t.format === 'reel' ? `Reel · ${t.duration}` : 'Card · scrolls')

// "Make it yours": what a host can change. `when` limits an item to some
// templates. SAMPLE — confirm each item against the launch editor and drop
// anything it doesn't support yet before launch.
export function editableItems(t, themeLabel) {
  const items = [
    ['Names & families', 'Couple, parents, hosts, written the way you would write them on a card.'],
    ['Dates & functions', 'Add, remove or rename functions, each with its own day and time.'],
    ['Venue', 'An address and a map pin for every function, even in different cities.'],
    ['Language', 'Write it in English, हिंदी, ગુજરાતી or any language you like.'],
    ['Your words', 'The welcome note, the RSVP question and the sign-off are all yours to rewrite.'],
  ]
  if (t.variants.length > 1)
    items.push(['Colours', `From this design’s own palettes: ${t.variants.map((v) => themeLabel[v]).join(', ')}.`])
  if (t.format === 'reel') items.push(['Music', 'For reels: choose a track from the music library. It starts muted for guests.']) // SAMPLE — confirm the launch music library
  return items
}

// From the host to every guest. The action on the left, who does it on the right.
export const ITINERARY = [
  ['Pick this design', 'you'],
  ['Add your details', 'you'],
  ['Share one link on WhatsApp', 'you'],
  ['Open it, RSVP, find the venue', 'your guests'],
]

// What comes with every design, whichever one you pick.
export const INCLUDED = [
  ['One link for the whole invitation', 'Send it on WhatsApp, SMS or email. It opens in any phone browser.'],
  ['A page for every function', 'Haldi, mehendi, sangeet, the pooja, the dinner: each with its own time and place.'],
  ['RSVP and a guest list', 'Guests reply inside the invitation, and you see who is coming in one list.'],
  ['Maps and directions', 'A map for every venue and one tap to open directions.'],
  ['A live countdown', 'Counting down to the day, every time a guest opens the link.'],
  ['Change details any time', 'Moved the sangeet by an hour? Edit it once and every guest sees the new time.'],
  ['Music for reels', 'Reels can carry a track, always muted until the guest taps for sound.'],
]

/** Rows for "The details" spec table, using only facts the data supports. */
export function specRows(t, themeLabel) {
  const rows = [
    [
      'Format',
      t.format === 'reel'
        ? `Reel, vertical 9:16, ${t.duration}, then the full invitation to scroll`
        : 'Card, vertical 9:16, scrolls on any phone',
    ],
    ['Opens on', 'Any phone or laptop browser. No app needed for guests.'],
    ['Occasions', t.occasions.join(', ')],
    ['Tradition', t.tradition],
    ['Style & motif', `${t.style} · ${t.motif}`],
    [
      'Colourways',
      t.variants.length > 1 ? t.variants.map((v) => themeLabel[v]).join(', ') : `${themeLabel[t.theme]} (one palette)`,
    ],
  ]
  if (t.format === 'reel') rows.push(['Sound', 'Music, starts muted for guests'])
  rows.push(['Inside', t.parts.map(([, name]) => name).join(' · ')])
  rows.push(['Languages', 'Any. You write the words.'])
  return rows
}

/** A short FAQ about this design. */
export function designFaq(t, themeLabel) {
  const faq = [
    [
      `Do my guests need an app to open ${t.name}?`,
      'No. It is a link. Guests tap it on WhatsApp and it opens in the browser they already have, on any phone or laptop.',
    ],
    [
      'Can I change the details after I have sent it?',
      'Yes. Edit the time, the venue or a function and the same link shows the new details. Nobody needs a second message.',
    ],
    [
      'Can I write it in Hindi, Gujarati or another language?',
      'Yes. You write every word, so the invitation can be in any language, or in two side by side.',
    ],
    [
      `Can I add or remove functions?`,
      'Yes. Add as many functions as your celebration has, rename them, or keep it to one. Each gets its own day, time and venue.',
    ],
  ]
  if (t.variants.length > 1)
    faq.push([
      'Can I change the colours?',
      `${t.name} comes in ${t.variants.map((v) => themeLabel[v].toLowerCase()).join(', ')}. Try them with the dots on the stage. The words and functions stay the same.`,
    ])
  if (t.format === 'reel')
    faq.push([
      'Will the music play straight away?',
      'No. The reel always starts muted, and guests tap once for sound. Nobody gets a surprise in a quiet room.',
    ])
  else
    faq.push([
      'What is the difference between a card and a reel?',
      'A card is an invitation guests scroll through. A reel plays a short animated opening first, like an Instagram Reel, then opens into the same invitation.',
    ])
  return faq
}
