'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useShowcase } from './ShowcaseContext'
import { preloadDemo } from './DemoHost'
import { PlayIcon } from './icons'
import s from './showcase.module.css'

/**
 * Phones only: once the title block has scrolled away, a paper bar keeps the
 * two actions within reach. It steps aside for the closing section, which
 * carries the same actions.
 */
export default function MobileBar() {
  const { openDemo, demo } = useShowcase()
  const [past, setPast] = useState(false)
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    const actions = document.querySelector('[data-title-actions]')
    const closing = document.querySelector('[data-closing]')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === actions) setPast(!e.isIntersecting && e.boundingClientRect.top < 0)
        if (e.target === closing) setAtEnd(e.isIntersecting || e.boundingClientRect.top < 0)
      })
    })
    if (actions) io.observe(actions)
    if (closing) io.observe(closing)
    return () => io.disconnect()
  }, [])

  const on = past && !atEnd && !demo

  return (
    <div className={`${s.mbar} ${on ? s.mbarOn : ''}`} inert={!on || undefined}>
      <button
        type="button"
        className={`btn ${s.outline} ${s.mbarDemo}`}
        onClick={(e) => openDemo(e.currentTarget)}
        onFocus={preloadDemo}
        onTouchStart={preloadDemo}
      >
        <PlayIcon size={15} />
        Demo
      </button>
      <Link href="/#create" className={`btn btn--primary ${s.mbarUse}`}>
        Use this design
      </Link>
    </div>
  )
}
