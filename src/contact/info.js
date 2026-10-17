// Contact details live in src/data/site.js. While a value is null the pages say
// "Shared at launch" instead of showing a made-up address or number.
import { CONTACT } from '@/data/site'

export { CONTACT }

export const CHANNELS = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    note: 'Quickest for questions while you plan',
    value: CONTACT.whatsapp && `+${CONTACT.whatsapp}`,
    href: CONTACT.whatsapp && `https://wa.me/${CONTACT.whatsapp}`,
  },
  {
    id: 'email',
    label: 'Email',
    note: 'For longer briefs and bespoke designs',
    value: CONTACT.email,
    href: CONTACT.email && `mailto:${CONTACT.email}`,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    note: 'New designs as they are made',
    value: CONTACT.instagram && `@${CONTACT.instagram}`,
    href: CONTACT.instagram && `https://instagram.com/${CONTACT.instagram}`,
  },
]

export const TOPICS = ['Starting an invitation', 'A bespoke design', 'Pricing', 'Something else']
