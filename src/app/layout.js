import 'lenis/dist/lenis.css'
import '@/styles.css'
import '@/sections/sections.css'
import '@/components/props/props.css'
import '@/components/invite/invite.css'
import '@/components/invite/reel-card.css'
import './site.css'
import Nav from '@/nav/Nav'
import { Footer } from '@/sections/Closing'
import SmoothScroll from '@/components/SmoothScroll'
import { SITE } from '@/data/site'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'digital invitation',
    'wedding invitation',
    'WhatsApp invitation',
    'e-invite India',
    'Griha Pravesh invitation',
    'birthday invitation',
    'invitation reel',
  ],
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport = {
  themeColor: '#F5EDE0',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="notranslate" translate="no">
      <head>
        {/* Fonts load by their real family names: the hero and the 3D envelope
            draw text onto canvases with "Fraunces", "Parisienne" and "Manrope". */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Manrope:wght@400;500;600;700;800&family=Parisienne&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
