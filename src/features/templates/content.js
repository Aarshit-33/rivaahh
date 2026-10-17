// Copy for the templates pages (/templates and /templates/category/<slug>).
// Everything here is plain helper copy: no prices, counts, ratings or reviews.
// Design counts on the pages are always computed from the real data.

/** The three things families ask first, shown as a slim strip. */
export const REASSURANCE = ['No app for guests', 'Change details any time', 'Any language']

/**
 * Per-occasion helper copy.
 * - `shelf`  one short line under the shelf title on /templates
 * - `meta`   the category page's meta description
 * - `tips`   "Good to know" on the category page: practical, no claims
 */
export const OCCASION_NOTES = {
  wedding: {
    shelf: 'Haldi to reception, every function in one link.',
    meta: 'Wedding invitation cards and reels for the phone: every function, the venue map and RSVPs in one WhatsApp link. Hindu, Muslim, Sikh, Christian and Jain designs.',
    tips: [
      [
        'Send a save-the-date first',
        'Share the cover early, then add the functions to the same link once the dates are fixed.',
      ],
      ['One link for both families', 'Each side can forward the same invitation, so nobody receives an outdated copy.'],
      [
        'Write it the way your elders speak',
        'The wording can be in English, Hindi, Gujarati, Marathi, Tamil, Bengali or a mix.',
      ],
    ],
  },
  birthday: {
    shelf: 'First birthdays to sixtieths, playful or quietly elegant.',
    meta: 'Birthday invitation cards and reels for the phone, from a first birthday to a sixtieth. Share one WhatsApp link with the plan, the venue and RSVPs.',
    tips: [
      [
        'Ask about plus-ones',
        'Guests can say how many are coming, which helps with the cake, the seating and return gifts.',
      ],
      ['Reels suit milestone birthdays', 'A short animated reel works well for a first, an eighteenth or a sixtieth.'],
      [
        'Change the time without resending',
        'If the party moves by an hour, update the link and everyone sees the new time.',
      ],
    ],
  },
  'griha-pravesh': {
    shelf: 'The muhurat, the pooja and the way to the new home.',
    meta: 'Griha Pravesh and housewarming invitations for the phone, with the muhurat, the pooja timings and one-tap directions to your new home.',
    tips: [
      ['Put the muhurat up front', 'Guests see the auspicious time on the cover, before anything else.'],
      ['Directions to a new address', 'A new home is often hard to find; the venue map opens in one tap.'],
      ['Lunch or dinner after the pooja', 'List the meal as its own item so guests know how long to stay.'],
    ],
  },
  'baby-shower': {
    shelf: 'Godh bharai, baby showers, naming ceremonies and welcomes.',
    meta: 'Baby shower, godh bharai, naamkaran and baptism invitations for the phone, in soft colours with gentle motion, shared as one WhatsApp link.',
    tips: [
      ['Keep it gentle', 'Blush, ivory and soft gold read calmly on a phone and suit daytime ceremonies.'],
      ['Name the rituals', 'List the godh bharai, the brunch or the naming as separate items with their own times.'],
      [
        'Add the baby’s name later',
        'Share the invitation now and update the name on the same link after the ceremony.',
      ],
    ],
  },
  anniversary: {
    shelf: 'Silver, golden or the very first, the years together.',
    meta: 'Anniversary invitations for the phone, for silver and golden jubilees, vow renewals and quiet dinners, shared as one WhatsApp link.',
    tips: [
      ['Often hosted by the children', 'The welcome note can come from the family rather than the couple.'],
      ['Readable for every generation', 'Large type and one-tap RSVP work for grandparents too.'],
      ['Mark the milestone', 'The cover can carry the number of years in the same style as the names.'],
    ],
  },
  'pooja-festivals': {
    shelf: 'Diwali milans, Eid dinners, Lohri nights and poojas at home.',
    meta: 'Diwali, Eid, Lohri, Christmas, Ganesh Chaturthi and home pooja invitations for the phone, with the programme, the address and RSVPs in one link.',
    tips: [
      ['Send it a week ahead', 'Festive calendars fill quickly; one link lets guests reply as soon as they see it.'],
      ['List the aarti and the dinner', 'Guests can choose when to come if the programme shows each part.'],
      ['Reuse it next year', 'Change the date and the details, keep the design.'],
    ],
  },
}

/**
 * "This or that": five pairs. Each side names the template shown and what
 * choosing it adds to the filters. The result only sets the normal filters.
 */
export const TASTE_PAIRS = [
  {
    q: 'Traditional or modern?',
    a: { word: 'traditional', label: 'Traditional', template: 'anand', set: { style: ['traditional'] } },
    b: { word: 'modern', label: 'Modern', template: 'sangeet', set: { style: ['modern'] } },
  },
  {
    q: 'Flowers or clean lines?',
    a: { word: 'floral', label: 'Floral', template: 'gulmohar', set: { style: ['floral'] } },
    b: { word: 'clean lines', label: 'Clean lines', template: 'walima', set: { style: ['minimal'] } },
  },
  {
    q: 'Rich or light?',
    a: { word: 'rich colours', label: 'Rich', template: 'haveli', set: { colour: ['maroon', 'green'] } },
    b: { word: 'light colours', label: 'Light', template: 'pearl', set: { colour: ['ivory', 'blush'] } },
  },
  {
    q: 'Ornate or quiet?',
    a: { word: 'ornate', label: 'Ornate', template: 'rajwada', set: { style: ['royal'] } },
    b: { word: 'quiet', label: 'Quiet', template: 'vows', set: { style: ['minimal'] } },
  },
  {
    q: 'Maroon & gold or ivory & blush?',
    a: { word: 'maroon & gold', label: 'Maroon & gold', template: 'jubilee', set: { colour: ['maroon', 'gold'] } },
    b: { word: 'ivory & blush', label: 'Ivory & blush', template: 'rose', set: { colour: ['ivory', 'blush'] } },
  },
]

/** The five designs in the opening fan, left to right. The centre one plays once. */
export const FAN_IDS = ['marigold', 'noor', 'rajwada', 'rose', 'ivory']
