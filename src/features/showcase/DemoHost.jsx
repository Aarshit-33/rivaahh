'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useShowcase } from './ShowcaseContext'

// The full-screen demo is loaded only when it is needed: on hover or focus of
// a button that opens it (preload), on click, or on arrival with ?demo=1.
const load = () => import('./Demo')
const Demo = dynamic(load, { ssr: false })

export const preloadDemo = () => {
  load()
}

export default function DemoHost() {
  const { demo, openDemo } = useShowcase()

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('demo') === '1') openDemo(null)
  }, [openDemo])

  return demo ? <Demo opener={demo.opener} /> : null
}
