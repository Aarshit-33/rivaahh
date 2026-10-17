// The template catalogue. Every design is a phone-sized (9:16) invitation:
// a "card" the guest scrolls, or a "reel" that plays like an Instagram Reel.
//
// These are previews of design directions, not a launched catalogue: the pages
// say so, and nothing here claims sales, popularity or counts.
// TODO(launch): replace with the real launch set (posters, video, real parts).

export const OCCASION_OPTIONS = ['Wedding', 'Birthday', 'Griha Pravesh', 'Baby shower', 'Anniversary', 'Pooja & festivals']
export const TRADITION_OPTIONS = ['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'For everyone']
export const STYLE_OPTIONS = ['Royal', 'Traditional', 'Floral', 'Minimal', 'Modern']
export const COLOUR_OPTIONS = [
  ['royal', 'Maroon'],
  ['forest', 'Green'],
  ['gold', 'Gold'],
  ['ivory', 'Ivory'],
  ['blush', 'Blush'],
]
export const MOTIF_OPTIONS = [
  ['arch', 'Arch'],
  ['toran', 'Toran'],
  ['sun', 'Sun'],
  ['frame', 'Frame'],
]
export const FORMAT_OPTIONS = [
  ['all', 'Cards & reels'],
  ['card', 'Only cards'],
  ['reel', 'Only reels'],
]
export const SORT_OPTIONS = [
  ['featured', 'Featured'],
  ['az', 'Name, A–Z'],
  ['za', 'Name, Z–A'],
]

// One page per occasion at /templates/category/<slug>.
export const OCCASIONS_META = [
  {
    slug: 'wedding',
    label: 'Wedding',
    plural: 'Weddings',
    title: 'Wedding',
    line: 'Cards and reels for the wedding day and every function around it — haldi, mehendi, sangeet and the reception.',
  },
  {
    slug: 'birthday',
    label: 'Birthday',
    plural: 'Birthdays',
    title: 'Birthday',
    line: 'From a first birthday to a sixtieth — playful, elegant or somewhere in between, made for the phone.',
  },
  {
    slug: 'griha-pravesh',
    label: 'Griha Pravesh',
    plural: 'Griha Pravesh',
    title: 'Griha Pravesh',
    line: 'Housewarming invitations with the muhurat, the pooja and directions to the new home in one link.',
  },
  {
    slug: 'baby-shower',
    label: 'Baby shower',
    plural: 'Baby showers',
    title: 'Baby shower',
    line: 'Godh bharai, baby showers, naming ceremonies and welcomes — soft colours and gentle motion.',
  },
  {
    slug: 'anniversary',
    label: 'Anniversary',
    plural: 'Anniversaries',
    title: 'Anniversary',
    line: 'Silver, golden or just the first — invitations that honour the years together.',
  },
  {
    slug: 'pooja-festivals',
    label: 'Pooja & festivals',
    plural: 'Poojas & festivals',
    title: 'Pooja & festival',
    line: 'Diwali milans, Eid dinners, Lohri nights, Christmas evenings and every pooja at home.',
  },
]

export const occasionBySlug = (slug) => OCCASIONS_META.find((o) => o.slug === slug)
export const occasionByLabel = (label) => OCCASIONS_META.find((o) => o.label === label)

// What each kind of invitation contains, in the order a guest meets it.
// [id, name, value] — `value` is the right-hand note on the showcase's karyakram.
const PARTS = {
  Wedding: [
    ['cover', 'Cover & opening', 'Arch opens, names appear'],
    ['welcome', 'Welcome note', 'From both families'],
    ['functions', 'Functions', 'Haldi · Mehendi · Sangeet · Wedding'],
    ['venue', 'Venue & directions', 'Map, one tap'],
    ['rsvp', 'RSVP', 'Guests reply inside'],
    ['countdown', 'Countdown', 'Live, to the day'],
  ],
  Birthday: [
    ['cover', 'Cover & opening', 'Name and age reveal'],
    ['welcome', 'A note from the family', 'Who’s celebrating'],
    ['functions', 'The plan', 'Cake · Games · Dinner'],
    ['venue', 'Venue & directions', 'Map, one tap'],
    ['rsvp', 'RSVP', 'With plus-ones'],
    ['countdown', 'Countdown', 'Live, to the day'],
  ],
  'Griha Pravesh': [
    ['cover', 'Cover & opening', 'Toran and the new home'],
    ['welcome', 'Welcome note', 'From the family'],
    ['functions', 'Muhurat & pooja', 'Vastu pooja · Lunch'],
    ['venue', 'The new address', 'Map, one tap'],
    ['rsvp', 'RSVP', 'Guests reply inside'],
    ['countdown', 'Countdown', 'To the muhurat'],
  ],
  'Baby shower': [
    ['cover', 'Cover & opening', 'Soft reveal'],
    ['welcome', 'Welcome note', 'From the parents-to-be'],
    ['functions', 'The ceremony', 'Rituals · Brunch'],
    ['venue', 'Venue & directions', 'Map, one tap'],
    ['rsvp', 'RSVP', 'Guests reply inside'],
    ['countdown', 'Countdown', 'Live, to the day'],
  ],
  Anniversary: [
    ['cover', 'Cover & opening', 'Years together'],
    ['welcome', 'A note from the children', 'Hosts’ welcome'],
    ['functions', 'The evening', 'Ceremony · Dinner'],
    ['venue', 'Venue & directions', 'Map, one tap'],
    ['rsvp', 'RSVP', 'Guests reply inside'],
    ['countdown', 'Countdown', 'Live, to the day'],
  ],
  'Pooja & festivals': [
    ['cover', 'Cover & opening', 'Festive reveal'],
    ['welcome', 'Welcome note', 'From the hosts'],
    ['functions', 'The programme', 'Pooja · Aarti · Dinner'],
    ['venue', 'Venue & directions', 'Map, one tap'],
    ['rsvp', 'RSVP', 'Guests reply inside'],
    ['countdown', 'Countdown', 'Live, to the day'],
  ],
}

// Sample programme for each occasion, shown inside every invitation preview.
// These are illustrative details a host would type, not real events.
export const OCCASION_SAMPLE = {
  Wedding: {
    date: 'Saturday, 14 March 2027',
    venue: 'The Jai Mahal Palace',
    city: 'Jaipur',
    welcome: 'With the blessings of our elders, we invite you to share in the joy of our wedding.',
    hosts: 'The Sharma & Kapoor families',
    functions: [
      ['Haldi', 'Thu, 12 Mar', '10:00 AM'],
      ['Mehendi', 'Thu, 12 Mar', '5:00 PM'],
      ['Sangeet', 'Fri, 13 Mar', '7:30 PM'],
      ['Wedding', 'Sat, 14 Mar', '6:30 PM'],
    ],
  },
  Birthday: {
    date: 'Saturday, 4 April 2027',
    venue: 'The Glasshouse',
    city: 'Pune',
    welcome: 'Come for the cake, stay for the games — we would love to celebrate with you.',
    hosts: 'With love, the family',
    functions: [
      ['Cake cutting', 'Sat, 4 Apr', '4:30 PM'],
      ['Games & magic show', 'Sat, 4 Apr', '5:15 PM'],
      ['Dinner', 'Sat, 4 Apr', '7:00 PM'],
    ],
  },
  'Griha Pravesh': {
    date: 'Sunday, 22 April 2027',
    venue: 'Our new home',
    city: 'Pune',
    welcome: 'Our new home is ready, and it would not feel complete without you.',
    hosts: 'The Mehta family',
    functions: [
      ['Vastu pooja', 'Sun, 22 Apr', '9:00 AM'],
      ['Satyanarayan katha', 'Sun, 22 Apr', '11:00 AM'],
      ['Lunch', 'Sun, 22 Apr', '1:00 PM'],
    ],
  },
  'Baby shower': {
    date: 'Sunday, 9 May 2027',
    venue: 'The Courtyard',
    city: 'Ahmedabad',
    welcome: 'A little one is on the way. Join us to shower blessings on the parents-to-be.',
    hosts: 'With love, both families',
    functions: [
      ['Godh bharai', 'Sun, 9 May', '11:00 AM'],
      ['Games', 'Sun, 9 May', '12:30 PM'],
      ['Brunch', 'Sun, 9 May', '1:00 PM'],
    ],
  },
  Anniversary: {
    date: 'Saturday, 12 June 2027',
    venue: 'The Taj Lands End',
    city: 'Mumbai',
    welcome: 'Twenty-five years, two children and countless cups of chai. Celebrate with us.',
    hosts: 'Hosted by Rhea & Aman',
    functions: [
      ['Vow renewal', 'Sat, 12 Jun', '6:30 PM'],
      ['Toasts', 'Sat, 12 Jun', '7:30 PM'],
      ['Dinner & dance', 'Sat, 12 Jun', '8:30 PM'],
    ],
  },
  'Pooja & festivals': {
    date: 'Sunday, 31 October 2027',
    venue: 'At home',
    city: 'Delhi',
    welcome: 'Lights, sweets and the people we love most. Do join us this festive evening.',
    hosts: 'The Agarwal family',
    functions: [
      ['Lakshmi pooja', 'Sun, 31 Oct', '7:00 PM'],
      ['Aarti', 'Sun, 31 Oct', '8:00 PM'],
      ['Dinner', 'Sun, 31 Oct', '8:30 PM'],
    ],
  },
}

const T = (t) => {
  const primary = t.occasions[0]
  return {
    format: 'card',
    duration: null,
    variants: [],
    ...t,
    parts: PARTS[primary],
    sample: OCCASION_SAMPLE[primary],
  }
}

export const TEMPLATES = [
  T({ id: 'rajwada', name: 'Rajwada', occasions: ['Wedding', 'Anniversary'], tradition: 'Hindu', style: 'Royal', theme: 'royal', motif: 'arch', eyebrow: 'Together with their families', title: 'Ananya & Kabir', featured: true, format: 'reel', duration: '0:18', variants: ['royal', 'forest', 'gold'], description: 'A royal arch in maroon and gold, for weddings that begin with a procession.' }),
  T({ id: 'marigold', name: 'Marigold', occasions: ['Birthday', 'Griha Pravesh'], tradition: 'For everyone', style: 'Traditional', theme: 'gold', motif: 'toran', eyebrow: 'Join us to celebrate', title: 'Aarav turns 5', featured: true, description: 'A string of marigolds across a warm gold card — cheerful, festive and easy to read.' }),
  T({ id: 'mehendi', name: 'Mehendi garden', occasions: ['Wedding', 'Baby shower'], tradition: 'Hindu', style: 'Floral', theme: 'forest', motif: 'arch', eyebrow: 'Mehendi evening', title: 'Ishita & Dev', featured: true, format: 'reel', duration: '0:16', variants: ['forest', 'blush'], description: 'Deep mehendi green with a garden arch, made for afternoons of henna and music.' }),
  T({ id: 'ivory', name: 'Ivory letterpress', occasions: ['Wedding', 'Anniversary', 'Pooja & festivals'], tradition: 'For everyone', style: 'Minimal', theme: 'ivory', motif: 'frame', eyebrow: 'Save the date', title: 'Riya & Arjun', featured: true, description: 'Quiet ivory with a pressed double frame — lets your words do the talking.' }),
  T({ id: 'noor', name: 'Noor', occasions: ['Wedding'], tradition: 'Muslim', style: 'Royal', theme: 'forest', motif: 'arch', eyebrow: 'Nikah ceremony', title: 'Zoya & Imran', featured: true, format: 'reel', duration: '0:20', description: 'An emerald arch with soft gold light, for a nikah and the walima that follows.' }),
  T({ id: 'anand', name: 'Anand', occasions: ['Wedding'], tradition: 'Sikh', style: 'Traditional', theme: 'gold', motif: 'frame', eyebrow: 'Anand Karaj', title: 'Simran & Harjot', featured: true, description: 'Saffron and gold with a simple frame, for an Anand Karaj and the celebrations after.' }),
  T({ id: 'rose', name: 'Rose dawn', occasions: ['Baby shower', 'Birthday'], tradition: 'For everyone', style: 'Floral', theme: 'blush', motif: 'sun', eyebrow: 'Godh Bharai', title: 'For Priya', featured: true, format: 'reel', duration: '0:14', description: 'Blush and a rising sun — gentle, warm and made for new beginnings.' }),
  T({ id: 'vows', name: 'Ivory vows', occasions: ['Wedding', 'Anniversary'], tradition: 'Christian', style: 'Minimal', theme: 'ivory', motif: 'arch', eyebrow: 'Together with their families', title: 'Anna & Joel', featured: true, description: 'A clean ivory arch for church weddings and vow renewals.' }),
  T({ id: 'diya', name: 'Diya night', occasions: ['Pooja & festivals', 'Griha Pravesh'], tradition: 'Hindu', style: 'Traditional', theme: 'royal', motif: 'sun', eyebrow: 'Diwali Milan', title: 'Lights & sweets', format: 'reel', duration: '0:12', description: 'Maroon night and a glowing diya, for Diwali milans and evening poojas.' }),
  T({ id: 'kesar', name: 'Kesar', occasions: ['Wedding', 'Pooja & festivals'], tradition: 'Jain', style: 'Traditional', theme: 'gold', motif: 'arch', eyebrow: 'Shubh Vivah', title: 'Jinal & Parth', description: 'Saffron gold with a temple arch, for Jain weddings and ceremonies.' }),
  T({ id: 'jubilee', name: 'Golden jubilee', occasions: ['Anniversary', 'Birthday'], tradition: 'For everyone', style: 'Royal', theme: 'gold', motif: 'frame', eyebrow: '25 years together', title: 'Sunita & Rajesh', format: 'reel', duration: '0:16', description: 'Gold leaf and a grand frame for silver and golden anniversaries.' }),
  T({ id: 'aangan', name: 'Aangan', occasions: ['Griha Pravesh', 'Pooja & festivals'], tradition: 'Hindu', style: 'Traditional', theme: 'ivory', motif: 'toran', eyebrow: 'Our new home', title: 'The Iyers', description: 'An ivory courtyard with a toran over the door — welcoming guests home.' }),
  T({ id: 'chaand', name: 'Chaand raat', occasions: ['Pooja & festivals'], tradition: 'Muslim', style: 'Minimal', theme: 'royal', motif: 'frame', eyebrow: 'Eid Milan', title: 'At the Qureshis', format: 'reel', duration: '0:12', description: 'A quiet crescent night in maroon, for Eid dinners with family and friends.' }),
  T({ id: 'lohri', name: 'Lohri fire', occasions: ['Pooja & festivals', 'Birthday'], tradition: 'Sikh', style: 'Modern', theme: 'royal', motif: 'sun', eyebrow: 'Lohri di raat', title: 'Bonfire & bhangra', format: 'reel', duration: '0:14', description: 'A bonfire glow and bold type, for Lohri nights and first Lohris.' }),
  T({ id: 'evergreen', name: 'Evergreen', occasions: ['Pooja & festivals'], tradition: 'Christian', style: 'Modern', theme: 'forest', motif: 'toran', eyebrow: 'Christmas evening', title: 'Carols at ours', description: 'Pine green with a garland, for Christmas evenings and carol nights.' }),
  T({ id: 'confetti', name: 'Confetti', occasions: ['Birthday'], tradition: 'For everyone', style: 'Modern', theme: 'blush', motif: 'frame', eyebrow: 'Thirty, finally', title: 'Kabir turns 30', format: 'reel', duration: '0:12', description: 'Soft confetti and a modern frame for grown-up birthdays.' }),
  T({ id: 'naamkaran', name: 'Naamkaran', occasions: ['Baby shower'], tradition: 'Hindu', style: 'Floral', theme: 'blush', motif: 'toran', eyebrow: 'Naming ceremony', title: 'Welcoming our girl', description: 'Blush florals and a little toran for naming ceremonies.' }),
  T({ id: 'brunch', name: 'Little brunch', occasions: ['Baby shower', 'Birthday'], tradition: 'For everyone', style: 'Minimal', theme: 'ivory', motif: 'sun', eyebrow: 'Baby shower brunch', title: 'Little one soon', description: 'A light ivory card with a small sun — simple, sweet and modern.' }),
  T({ id: 'sangeet', name: 'Sangeet nights', occasions: ['Wedding'], tradition: 'Hindu', style: 'Modern', theme: 'royal', motif: 'sun', eyebrow: 'Sangeet night', title: 'Meera & Kunal', format: 'reel', duration: '0:22', variants: ['royal', 'blush'], description: 'Stage lights in maroon and gold for the night everyone dances.' }),
  T({ id: 'gulmohar', name: 'Gulmohar', occasions: ['Wedding'], tradition: 'For everyone', style: 'Floral', theme: 'blush', motif: 'toran', eyebrow: 'Haldi & mehendi', title: 'Tara & Neil', description: 'Gulmohar blossoms in blush, for daytime haldi and mehendi.' }),
  T({ id: 'haveli', name: 'Haveli', occasions: ['Wedding'], tradition: 'Hindu', style: 'Royal', theme: 'forest', motif: 'arch', eyebrow: 'Shubh Vivah', title: 'Aditi & Rohan', format: 'reel', duration: '0:20', description: 'A haveli arch in deep green and gold, for palace and heritage weddings.' }),
  T({ id: 'walima', name: 'Walima', occasions: ['Wedding'], tradition: 'Muslim', style: 'Minimal', theme: 'ivory', motif: 'frame', eyebrow: 'Walima dinner', title: 'Sana & Faiz', description: 'Ivory and fine gold lines for an elegant walima dinner.' }),
  T({ id: 'mehta-niwas', name: 'Mehta Niwas', occasions: ['Griha Pravesh'], tradition: 'Hindu', style: 'Traditional', theme: 'gold', motif: 'toran', eyebrow: 'Griha Pravesh', title: 'Mehta Niwas', format: 'reel', duration: '0:14', description: 'A golden toran over the new door, with the muhurat front and centre.' }),
  T({ id: 'vastu', name: 'Vastu', occasions: ['Griha Pravesh'], tradition: 'Jain', style: 'Minimal', theme: 'royal', motif: 'frame', eyebrow: 'Vastu pujan', title: 'The Shahs', description: 'A calm maroon frame for vastu pujan and a quiet housewarming.' }),
  T({ id: 'pehla', name: 'Pehla janamdin', occasions: ['Birthday'], tradition: 'For everyone', style: 'Floral', theme: 'blush', motif: 'sun', eyebrow: 'Our little one turns 1', title: 'Myra is one', format: 'reel', duration: '0:16', description: 'A soft sunrise for a first birthday — the one everyone remembers.' }),
  T({ id: 'godh', name: 'Godh bharai', occasions: ['Baby shower'], tradition: 'Hindu', style: 'Traditional', theme: 'gold', motif: 'toran', eyebrow: 'Godh Bharai', title: 'For Ananya', description: 'Gold and marigold for a traditional godh bharai.' }),
  T({ id: 'dove', name: 'Dove', occasions: ['Baby shower'], tradition: 'Christian', style: 'Minimal', theme: 'ivory', motif: 'arch', eyebrow: 'Baptism', title: 'Little Aaron', description: 'An ivory arch for baptisms and christenings.' }),
  T({ id: 'pearl', name: 'Pearl', occasions: ['Anniversary'], tradition: 'For everyone', style: 'Minimal', theme: 'ivory', motif: 'frame', eyebrow: '30 years together', title: 'Neeta & Anil', format: 'reel', duration: '0:14', description: 'Pearl ivory and a slim frame for anniversaries that call for elegance.' }),
  T({ id: 'sukhmani', name: 'Sukhmani', occasions: ['Pooja & festivals'], tradition: 'Sikh', style: 'Traditional', theme: 'gold', motif: 'frame', eyebrow: 'Sukhmani Sahib path', title: 'At the Gills', description: 'Saffron gold and a simple frame for a path at home.' }),
  T({ id: 'bappa', name: 'Bappa', occasions: ['Pooja & festivals'], tradition: 'Hindu', style: 'Traditional', theme: 'royal', motif: 'arch', eyebrow: 'Ganesh Chaturthi', title: 'Bappa comes home', format: 'reel', duration: '0:16', description: 'A maroon arch and warm light for Ganesh Chaturthi at home.' }),
]

export const FEATURED = TEMPLATES.filter((t) => t.featured)

export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id)
export const templatesFor = (label) => TEMPLATES.filter((t) => t.occasions.includes(label))

// Templates that share an occasion or style with `t`, closest first.
export function similarTo(t, n = 8) {
  return TEMPLATES.filter((o) => o.id !== t.id)
    .map((o) => ({
      o,
      s:
        (o.occasions.some((x) => t.occasions.includes(x)) ? 2 : 0) +
        (o.style === t.style ? 1 : 0) +
        (o.theme === t.theme ? 0.5 : 0),
    }))
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map(({ o }) => o)
}

export const THEME_LABEL = Object.fromEntries(COLOUR_OPTIONS)
