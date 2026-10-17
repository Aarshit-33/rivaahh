// Business details in one place.
//
// Values marked SAMPLE are placeholders added so the site reads like a finished
// commercial site. Replace every SAMPLE before launch. `null` means the detail
// is not decided yet and the pages show an honest "Shared at launch".

export const SITE = {
  name: 'Nimantran',
  tagline: 'Invitations worth opening',
  description:
    'Digital invitations for Indian celebrations — weddings, birthdays, Griha Pravesh, baby showers, anniversaries, poojas and festivals. Made for the phone, shared in one link.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  legalName: 'Nimantran', // SAMPLE — registered company name
}

// Channels that actually send something stay null until they exist, so no
// visitor's message ever goes to an address nobody reads.
export const CONTACT = {
  email: null, // e.g. 'hello@yourdomain.in'
  whatsapp: null, // digits only with country code, e.g. '919800000000'
  instagram: null, // handle without @
  city: null, // where the studio is based
}

// Shown on the contact and about pages. SAMPLE — confirm before launch.
export const STUDIO = {
  hours: 'Monday to Saturday, 10 am – 7 pm IST', // SAMPLE
  languages: 'English, हिंदी, ગુજરાતી, मराठी', // SAMPLE — languages the studio replies in
}

// Legal pages. SAMPLE — have these reviewed before launch.
export const LEGAL_UPDATED = '15 October 2026'
