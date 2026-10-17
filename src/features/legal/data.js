// Facts used by the Privacy and Terms pages that are not decided yet.
//
// Both pages are DRAFTS. Have them reviewed by a lawyer before launch and
// replace every SAMPLE value below.

export const LEGAL = {
  // SAMPLE — replace before launch: the city whose courts hear disputes.
  jurisdictionCity: '[City to be confirmed]',
  // TODO(launch): the person handling privacy questions and grievances
  // (name and contact). While null the pages say "Shared at launch".
  grievanceOfficer: null,
  // SAMPLE — replace before launch: how long each kind of data is kept.
  retention: {
    invitation: 'while your invitation is live and for up to 12 months after the last event on it', // SAMPLE
    contact: 'for up to 24 months after our last conversation', // SAMPLE
    account: 'until you close your account, then for up to 90 days in backups', // SAMPLE
  },
}

// The keys this site keeps in your browser's local storage. These are the real
// names used in the code (src/lib/stores.js, the contact form).
export const DEVICE_STORAGE = [
  ['nimantran:personal', 'The names and date you type to preview templates with your own details.'],
  ['nimantran:kept', 'Your shortlist of templates (the ones you mark with the heart).'],
  ['nimantran:contact-draft', 'A draft of a message on the contact page, so it is not lost if you leave the page.'],
]
