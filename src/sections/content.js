// All copy for the sections below the "life of an invitation" story.
//
// Rule for this file: nothing here may claim a business fact we don't have yet
// (customers, ratings, counts, prices, contact details). Anything the business
// still has to decide is marked `TODO(launch)` and rendered as an honest
// placeholder on the page.

/* ───────── Occasions ───────── */

// Each occasion shows a fan of three sample invites. Names on the cards are
// illustrative examples of what a host would type, not customers.
export const OCCASIONS = [
  {
    id: 'birthday',
    label: 'Birthday',
    line: 'First birthdays, milestone 50ths and everything between.',
    cards: [
      { theme: 'gold', motif: 'toran', eyebrow: 'Join us to celebrate', title: 'Aarav turns 5', meta: 'Saturday · 4:30 PM' },
      { theme: 'forest', motif: 'frame', eyebrow: 'Fifty years young', title: 'Meera at 50', meta: 'Sunday · 7 PM' },
      { theme: 'blush', motif: 'sun', eyebrow: 'A little party', title: 'Kiara is one', meta: 'Saturday · 11 AM' },
    ],
  },
  {
    id: 'wedding',
    label: 'Wedding',
    line: 'Every function, one link — mehendi to reception.',
    cards: [
      { theme: 'royal', motif: 'arch', eyebrow: 'Together with their families', title: 'Ananya & Kabir', meta: 'Mehendi · Sangeet · Wedding' },
      { theme: 'ivory', motif: 'frame', eyebrow: 'Save the date', title: 'Riya & Arjun', meta: 'Winter wedding' },
      { theme: 'forest', motif: 'arch', eyebrow: 'Mehendi evening', title: 'Ishita & Dev', meta: 'Garden · 5 PM' },
    ],
  },
  {
    id: 'griha',
    label: 'Griha Pravesh',
    line: 'Welcome everyone into your new home.',
    cards: [
      { theme: 'gold', motif: 'toran', eyebrow: 'Griha Pravesh', title: 'Mehta Niwas', meta: 'Pooja at 10 AM' },
      { theme: 'ivory', motif: 'arch', eyebrow: 'Our new home', title: 'The Iyers', meta: 'Lunch to follow' },
      { theme: 'royal', motif: 'sun', eyebrow: 'Housewarming', title: 'Flat 1204', meta: 'Sunday · 12 PM' },
    ],
  },
  {
    id: 'baby',
    label: 'Baby shower',
    line: 'Godh bharai, naming ceremonies and first welcomes.',
    cards: [
      { theme: 'blush', motif: 'arch', eyebrow: 'Godh Bharai', title: 'For Priya', meta: 'Saturday · 4 PM' },
      { theme: 'ivory', motif: 'sun', eyebrow: 'Naamkaran', title: 'Welcoming our boy', meta: 'Sunday · 11 AM' },
      { theme: 'forest', motif: 'frame', eyebrow: 'Baby shower', title: 'Little one soon', meta: 'Garden brunch' },
    ],
  },
  {
    id: 'anniversary',
    label: 'Anniversary',
    line: 'Silver, golden and every year worth marking.',
    cards: [
      { theme: 'royal', motif: 'frame', eyebrow: '25 years together', title: 'Sunita & Rajesh', meta: 'Dinner · 8 PM' },
      { theme: 'gold', motif: 'sun', eyebrow: 'Golden jubilee', title: '50 years', meta: 'Family lunch' },
      { theme: 'ivory', motif: 'arch', eyebrow: 'Ten years', title: 'Neha & Rohan', meta: 'Saturday evening' },
    ],
  },
  {
    id: 'pooja',
    label: 'Pooja & festivals',
    line: 'Satyanarayan katha, Diwali milan, Ganpati at home.',
    cards: [
      { theme: 'gold', motif: 'sun', eyebrow: 'Satyanarayan Katha', title: 'At our home', meta: 'Thursday · 6 PM' },
      { theme: 'royal', motif: 'toran', eyebrow: 'Diwali Milan', title: 'Lights & sweets', meta: 'Evening' },
      { theme: 'forest', motif: 'arch', eyebrow: 'Ganpati Bappa', title: 'Darshan at home', meta: 'All week' },
    ],
  },
]

/* ───────── Personaliser ───────── */

export const THEMES = [
  { id: 'royal', label: 'Maroon royal' },
  { id: 'forest', label: 'Forest green' },
  { id: 'ivory', label: 'Ivory minimal' },
]

export const STEPS = ['Pick an occasion & design', 'Add your details', 'Share one link']

/* ───────── Comparison ───────── */

// Only differences that follow from what each format is.
export const COMPARE_COLUMNS = ['Printed card', 'Image on WhatsApp', 'Nimantran']

export const COMPARE_ROWS = [
  ['Reaches guests in other cities the same day', false, true, true],
  ['Change the time or venue after sending', false, false, true],
  ['See who is coming, without calling everyone', false, false, true],
  ['Directions to the venue in one tap', false, false, true],
  ['Separate details for each function', false, false, true],
  ['Music, photos and a live countdown', false, false, true],
  ['Feels personal to each guest', true, false, true],
]

/* ───────── Languages & readability ───────── */

// The host writes the invite in any language; these are examples of the same
// invitation written in a few of them.
export const LANGUAGES = [
  { id: 'en', label: 'English', eyebrow: 'You are invited', title: 'Aarav turns 5', meta: 'Saturday, 4:30 PM · Do come with family' },
  { id: 'hi', label: 'हिंदी', eyebrow: 'आप सादर आमंत्रित हैं', title: 'आरव का पाँचवाँ जन्मदिन', meta: 'शनिवार, शाम 4:30 बजे · सपरिवार पधारें' },
  { id: 'gu', label: 'ગુજરાતી', eyebrow: 'આપને સાદર આમંત્રણ', title: 'આરવનો પાંચમો જન્મદિવસ', meta: 'શનિવાર, સાંજે 4:30 · સહપરિવાર પધારજો' },
  { id: 'mr', label: 'मराठी', eyebrow: 'आपणास सस्नेह निमंत्रण', title: 'आरवचा पाचवा वाढदिवस', meta: 'शनिवार, संध्याकाळी 4:30 · सहकुटुंब यावे' },
  { id: 'ta', label: 'தமிழ்', eyebrow: 'அன்புடன் அழைக்கிறோம்', title: 'ஆரவின் ஐந்தாவது பிறந்தநாள்', meta: 'சனிக்கிழமை, மாலை 4:30' },
  { id: 'bn', label: 'বাংলা', eyebrow: 'সাদর আমন্ত্রণ', title: 'আরভের পঞ্চম জন্মদিন', meta: 'শনিবার, বিকেল ৪:৩০' },
]

export const GUEST_POINTS = [
  ['Opens from a WhatsApp message', 'No app to install, no account to create.'],
  ['Large text, one tap', 'Readable for grandparents; RSVP is a single button.'],
  ['Written in your words', 'Type the invitation in whichever language your family speaks.'],
]

/* ───────── Pricing ───────── */

// TODO(launch): set prices and confirm what each plan includes. Until then the
// page says plainly that prices are announced at launch.
export const PLANS = [
  {
    id: 'essential',
    name: 'Essential',
    for: 'For a single event',
    price: null,
    features: ['Choose a design', 'RSVP and guest list', 'Map and directions', 'Share on WhatsApp'],
  },
  {
    id: 'signature',
    name: 'Signature',
    for: 'For celebrations with several functions',
    price: null,
    featured: true,
    features: ['Everything in Essential', 'A page for each function', 'Music, gallery and countdown', 'Keepsake after the day'],
  },
  {
    id: 'bespoke',
    name: 'Bespoke',
    for: 'Designed from scratch with you',
    price: null,
    features: ['Everything in Signature', 'Custom illustration', 'Your own colours and type', 'A designer to work with'],
  },
]

/* ───────── FAQ ───────── */

// Answers describe how the product works. TODO(launch): confirm before going live.
export const FAQ = [
  ['Do my guests need to install an app?', 'No. Guests open the invitation from a link — on WhatsApp, SMS or email — in the browser they already have.'],
  ['Can I change details after sending?', 'Yes. The invitation lives at one link, so when you update the time, venue or schedule, every guest sees the new version. No need to send it again.'],
  ['How do RSVPs work?', 'Guests reply with one tap and can add how many people are coming. You see the replies on your own guest list as they arrive.'],
  ['Which occasions is it for?', 'Any celebration you would send an invitation for — birthdays, weddings, Griha Pravesh, baby showers, anniversaries, poojas and festivals.'],
  ['Can I write it in Hindi or another language?', 'Yes. You write the words, so the invitation can be in whichever language your family reads.'],
  ['Who can see my invitation?', 'Only people who have the link. It is not listed publicly or searchable.'],
  ['How much does it cost?', 'Prices will be announced at launch. Every plan will be a simple price per celebration.'],
]

/* ───────── Footer ───────── */

// TODO(launch): add real contact details and social handles.
export const FOOTER_COLUMNS = [
  ['Occasions', ['Birthday', 'Wedding', 'Griha Pravesh', 'Baby shower', 'Anniversary', 'Pooja & festivals'], '#occasions'],
  ['Product', ['How it works', 'All occasions', 'Pricing', 'Questions'], null],
  ['Company', ['About', 'Contact', 'Privacy', 'Terms'], '#'],
]
