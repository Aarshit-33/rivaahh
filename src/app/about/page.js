import AboutPage from '@/features/about/AboutPage'

export const metadata = {
  title: 'About',
  description:
    'Why Nimantran makes digital invitations: an invitation is an act of respect, and the version on your phone should keep that respect while removing the running around.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Nimantran — we still believe in the hand-delivered card',
    description: 'One card, two sides: the respect of a printed invitation, delivered on WhatsApp.',
    url: '/about',
  },
}

export default function Page() {
  return <AboutPage />
}
