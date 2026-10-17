import HomeLoader from '@/home/HomeLoader'
import { SITE } from '@/data/site'

export const metadata = {
  title: { absolute: `${SITE.name} — ${SITE.tagline}` },
  description: SITE.description,
  alternates: { canonical: '/' },
}

export default function Page() {
  return <HomeLoader />
}
