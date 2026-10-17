// Content used only by the contact page.
//
// Contact details themselves (WhatsApp number, email, Instagram) live in
// src/data/site.js and stay null until launch: this file never holds one.

import { FAQ } from '@/sections/content'

// Occasions in the form's select. `phrase` reads inside a sentence:
// "We're celebrating {phrase} on Saturday, 14 March."
export const OCCASIONS = [
  { value: 'Birthday', slug: 'birthday', phrase: 'a birthday' },
  { value: 'Wedding', slug: 'wedding', phrase: 'a wedding' },
  { value: 'Griha Pravesh', slug: 'griha-pravesh', phrase: 'a Griha Pravesh' },
  { value: 'Baby shower', slug: 'baby-shower', phrase: 'a baby shower' },
  { value: 'Anniversary', slug: 'anniversary', phrase: 'an anniversary' },
  { value: 'Pooja & festivals', slug: 'pooja-festivals', phrase: 'a pooja' },
  { value: 'Something else', slug: 'other', phrase: 'a celebration' },
]

// Short keys accepted in ?topic= (as well as the full chip label).
export const TOPIC_KEYS = {
  start: 0,
  starting: 0,
  invite: 0,
  invitation: 0,
  bespoke: 1,
  custom: 1,
  design: 1,
  pricing: 2,
  price: 2,
  prices: 2,
  other: 3,
  else: 3,
  something: 3,
}

// How each topic reads inside "I'd love help with {…}".
export const TOPIC_PHRASE = ['starting an invitation', 'a bespoke design', 'pricing', 'something else']

export const MESSAGE_PLACEHOLDER = {
  Wedding: 'The couple’s names and the functions: haldi, mehendi, sangeet…',
  'Griha Pravesh': 'The new home, the muhurat time, who you’re inviting…',
  Birthday: 'Whose birthday, and which one?',
  default: 'Tell us about the celebration and what you’d like help with.',
}

// The ways to reach the studio, in the order they appear on the page.
export const CHANNEL_NOTES = {
  whatsapp: 'Quickest while you plan',
  email: 'For longer briefs and bespoke designs',
  instagram: 'New designs as they’re made',
}

// The three steps on the studio desk.
export const DESK_STEPS = [
  { id: 'write', title: 'You write.', body: 'A few lines about the celebration is plenty.' },
  { id: 'reply', title: 'We reply.', body: 'On WhatsApp or email, from a real person.' },
  {
    id: 'shape',
    title: 'Your invitation takes shape.',
    body: 'We design it with you, ready to share with every guest.',
  },
]

// The sample sentence on the illustrated letter and in the example chat.
export const SAMPLE_NOTE = 'We’re celebrating a wedding in March and would love an invitation that feels like us.'

const pick = (q) => FAQ.find(([question]) => question === q)

// Quick answers: the site's own FAQ first, then two contact-specific notes
// that make no promises the studio has not confirmed.
export const QUICK_ANSWERS = [
  pick('Which occasions is it for?'),
  pick('Can I write it in Hindi or another language?'),
  pick('How do RSVPs work?'),
  pick('Can I change details after sending?'),
  pick('How much does it cost?'),
  [
    'What should I put in my note?',
    'Whatever you already know is enough: the occasion, a rough date, the city, and the feeling you want the invitation to have. Names, functions and timings can come later. If you have a design in mind, mention it, or send us the link from the templates page.',
  ],
].filter(Boolean)

// SAMPLE — replace before launch. Who the studio works with beyond families.
export const PLANNERS_NOTE = {
  title: 'Business & bulk enquiries',
  body: 'Wedding planners, venues and event studios planning invitations for several families: choose “Something else” and tell us roughly how many celebrations a season. We’ll set up a proper conversation.',
}
