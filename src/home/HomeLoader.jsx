'use client'

import dynamic from 'next/dynamic'

// The hero reads the browser (WebGL, reduced-motion, screen size) while it
// renders, exactly as it did in the original single-page app, so the home
// page is rendered in the browser. The placeholder holds the hero's space
// in the page colour so nothing jumps while it loads.
const Home = dynamic(() => import('./Home'), {
  ssr: false,
  loading: () => <div className="home-placeholder" aria-hidden="true" />,
})

export default function HomeLoader() {
  return <Home />
}
