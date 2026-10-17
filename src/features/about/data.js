// Content for the About page that is local to it.
//
// Honesty rule: nothing here may invent founders, years, cities, numbers,
// press or testimonials. Facts that the business has not confirmed stay `null`
// and the page shows "Shared at launch" until they are filled in.

import { COMPARE_ROWS } from '@/sections/content'

/* ───────── The opening card ───────── */

// The sample couple and date on the flipping card. They match the Rajwada
// template's own sample so the paper front and the phone back say the same thing.
export const CARD = {
  hindi: 'आप सादर आमंत्रित हैं',
  english: 'You are invited',
  names: 'Ananya & Kabir',
  date: 'Saturday, 14 March 2027',
  place: 'Jaipur',
  templateId: 'rajwada',
}

export const CAPTIONS = ['The card your grandparents carried.', 'The same card, arriving on WhatsApp.']

/* ───────── The old way ───────── */

// Traditions, not statistics. `prop` names the drawing beside each one.
export const VIGNETTES = [
  {
    id: 'first',
    title: 'The first card',
    body: 'In many homes the first card went to the family deity or the place of prayer, a blessing on the date and on everything that followed.',
    prop: 'calendar',
  },
  {
    id: 'door',
    title: 'Door to door',
    body: 'Relatives travelled across the city, sometimes across states, to hand each card over in person and stay for a cup of tea.',
    prop: 'envelope',
  },
  {
    id: 'sweet',
    title: 'Something sweet',
    body: 'Often with a box of mithai, because good news should never arrive empty-handed.',
    prop: 'mithai',
  },
  {
    id: 'elders',
    title: 'Elders first',
    body: 'The oldest were invited first, often with a call to say the card was on its way, in the language they spoke at home.',
    prop: 'rotary',
  },
]

/* ───────── The ledger ───────── */

// "We changed" comes from the site's comparison: everything a printed card
// cannot do. The one thing a printed card already did well joins "We kept".
const printedCould = COMPARE_ROWS.filter(([, printed]) => printed).map(([label]) => label)
const printedCouldNot = COMPARE_ROWS.filter(([, printed, , ours]) => !printed && ours).map(([label]) => label)

export const KEPT = [
  'Your words, in your family’s language',
  'Elders first: large text, one tap, nothing to install',
  ...printedCould,
  'The look of a real invitation: borders, arches, gold',
]

export const CHANGED = printedCouldNot

/* ───────── Our craft ───────── */

// How the studio works. These describe the process and the format, which are
// true of the product; no numbers and no promises about time.
export const CRAFT = [
  {
    id: 'in-house',
    label: 'Designed in-house',
    title: 'Every design is drawn by us',
    body: 'Borders, arches, torans and type are drawn in our own studio, for a phone screen first, borrowing from the printed cards families have kept for years.',
  },
  {
    id: 'phones',
    label: 'Tested on real phones',
    title: 'Opened the way your guests will open it',
    body: 'Before a design goes live we open it from a WhatsApp message on everyday Android phones and iPhones, on slow connections as well as fast ones.',
  },
  {
    id: 'elders',
    label: 'Readable for elders',
    title: 'Large text, one clear button',
    body: 'We check each design with the phone’s text size turned up, keep contrast strong and keep the reply to a single tap. No menus to find.',
  },
  {
    id: 'language',
    label: 'Any language',
    title: 'Written the way your family speaks',
    body: 'Type in English, Hindi, Gujarati, Tamil or any script your phone can type. Your words appear exactly as you wrote them.',
  },
]

/* ───────── Promises ───────── */

export const PROMISES = [
  ['Guests never need an app.', 'It opens from a WhatsApp message, in any phone’s browser. No account, no download.'],
  ['Readable for every elder.', 'Large text and one clear button. No tiny print, no maze of menus.'],
  ['Written in your words.', 'Any language, any script, the way your family speaks.'],
  ['A person reads every message.', 'Write to us and a real person replies. No bots pretending.'],
]

/* ───────── The studio (pre-launch) ───────── */

// TODO(launch): fill these in with the team's own words and photos. While a
// value is null the page shows its honest "Shared at launch" placeholder.
// Never put invented people here.
export const STUDIO_TEAM = {
  // TODO(launch): 80–140 words, written by the founders themselves: why they
  // started, one personal invitation memory, what they want families to feel.
  founderNote: null, // e.g. ['First paragraph…', 'Second paragraph…']
  // TODO(launch): how the founders sign the note, e.g. 'Name & Name'.
  signature: null,
  // TODO(launch): 2–4 people. Each: { name, role, photo } where photo is a
  // path under /public (4:5, at least 800px wide). Keep `null` entries to show
  // the placeholder frames.
  people: [null, null, null],
}
