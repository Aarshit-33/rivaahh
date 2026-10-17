'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { getLenis } from '@/lib/lenis'
import { useShowcase } from './ShowcaseContext'
import { PART_NOTES, formatLine } from './content'
import { ArrowIcon } from './icons'
import s from './showcase.module.css'

// Where the stage sits above the programme (phones, portrait tablets), a
// tapped row sends the page up to it; elsewhere the stage is beside it and
// simply reading down the rows drives it.
const STAGE_ABOVE = '(max-width: 767px), (min-width: 768px) and (max-width: 1199px) and (orientation: portrait)'
const STAGE_BESIDE = '(min-width: 1200px), (min-width: 768px) and (orientation: landscape)'

/**
 * "Inside the invitation": the karyakram, one row per part, in the order a
 * guest meets them. On desktop, reading down the rows drives the stage; on
 * any screen, tapping a row sends both devices to that part.
 */
export default function Karyakram() {
  const { base, shown, goTo, reduced } = useShowcase()
  const ref = useRef(null)
  const [back, setBack] = useState(false)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(STAGE_BESIDE, () => {
        const rows = gsap.utils.toArray('[data-row]')
        rows.forEach((row) => {
          ScrollTrigger.create({
            trigger: row,
            start: 'top 55%',
            end: 'bottom 55%',
            onEnter: () => goTo(row.dataset.row),
            onEnterBack: () => goTo(row.dataset.row),
          })
        })
        if (rows[0]) {
          ScrollTrigger.create({ trigger: rows[0], start: 'top 55%', onLeaveBack: () => goTo('cover') })
        }
      })
      return () => mm.revert()
    },
    { scope: ref, dependencies: [goTo] },
  )

  // The "back to the programme" chip goes away once the programme is in view.
  useEffect(() => {
    if (!back) return
    const el = ref.current
    let armed = false
    const arm = setTimeout(() => {
      armed = true
    }, 1200)
    const io = new IntersectionObserver(([e]) => {
      if (armed && e.isIntersecting) setBack(false)
    })
    io.observe(el)
    return () => {
      clearTimeout(arm)
      io.disconnect()
    }
  }, [back])

  const scrollPage = (target) => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(target, { duration: reduced ? 0 : 1.1, offset: target === 0 ? 0 : -24 })
    else if (target === 0) window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
    else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  const pick = (id) => {
    goTo(id)
    if (window.matchMedia(STAGE_ABOVE).matches) {
      scrollPage(0)
      setBack(true)
    }
  }

  return (
    <section className={s.menuWrap} aria-labelledby="karyakram-title" ref={ref}>
      <div className={s.menu}>
        <h2 className={s.menuTitle} id="karyakram-title">
          Inside the <em>invitation</em>
        </h2>
        <span className={s.menuStar} aria-hidden="true">
          ✦
        </span>
        <p className={s.hand}>
          <span className={s.onDesktop}>tap any row to see it on the stage</span>
          <span className={s.onMobile}>tap any row to see it on the invitation</span>
        </p>

        <ol className={s.rows}>
          {base.parts.map(([id, name, value]) => {
            const on = shown === id
            return (
              <li key={id}>
                <button
                  type="button"
                  className={`${s.row} ${on ? s.rowOn : ''}`}
                  data-row={id}
                  aria-controls="showcase-stage"
                  aria-current={on ? 'step' : undefined}
                  onClick={() => pick(id)}
                >
                  <span className={s.rowMark} aria-hidden="true">
                    ✦
                  </span>
                  <span className={s.rowName}>{name}</span>
                  <span className={s.leader} aria-hidden="true" />
                  <span className={s.rowValue}>{value}</span>
                  <span className={s.rowNote}>{PART_NOTES[id]?.(base)}</span>
                </button>
              </li>
            )
          })}
        </ol>

        <p className={s.menuFoot}>
          {formatLine(base)} <span aria-hidden="true">✦</span> {base.parts.length} parts{' '}
          <span aria-hidden="true">✦</span> opens from one link
        </p>
      </div>

      {back && (
        <button type="button" className={s.backChip} onClick={() => scrollPage(ref.current)}>
          <ArrowIcon size={16} />
          Back to the programme
        </button>
      )}
    </section>
  )
}
