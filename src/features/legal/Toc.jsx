'use client'

import { useEffect, useState } from 'react'
import { getLenis } from '@/lib/lenis'
import s from './legal.module.css'

// "On this page": a sticky list on desktop, a fold-out list on phones. The
// section currently being read is marked as current.
export default function Toc({ items }) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -60% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items])

  const go = (e, id) => {
    const target = document.getElementById(id)
    const lenis = getLenis()
    if (!target || !lenis) return
    e.preventDefault()
    lenis.scrollTo(target, { offset: -112 })
    window.history.replaceState(null, '', `#${id}`)
    target.focus({ preventScroll: true })
  }

  const list = (
    <ol className={s.tocList}>
      {items.map((i) => (
        <li key={i.id}>
          <a href={`#${i.id}`} aria-current={active === i.id ? 'true' : undefined} onClick={(e) => go(e, i.id)}>
            {i.title}
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <>
      <nav className={s.toc} aria-label="On this page">
        <p className={s.tocHead}>On this page</p>
        {list}
      </nav>
      <details className={s.tocMobile}>
        <summary>On this page</summary>
        <nav aria-label="On this page (sections)">{list}</nav>
      </details>
    </>
  )
}
