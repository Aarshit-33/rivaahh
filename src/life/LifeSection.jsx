'use client'

import { useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { getLenis } from '../lib/lenis'
import Icon from './Icon'
import { CHAPTERS } from './chapters'
import { CARDS } from './cards'
import { useDevice } from '../device/DeviceContext'
import './life.css'

export default function LifeSection() {
  const root = useRef(null)
  const chapterEls = useRef([])
  const railFill = useRef(null)
  // The phone itself lives in <Device />; this section only chooses its screen.
  const { active, setActive, feed } = useDevice()
  const chapter = CHAPTERS[active]
  const Cards = CARDS[chapter.id]

  useGSAP(
    () => {
      // On phones the text sits below the pinned phone, so a chapter counts as
      // "current" once it reaches the lower part of the screen.
      const line = () => (window.innerWidth < 768 ? 'top 78%' : 'top 55%')
      const lineEnd = () => (window.innerWidth < 768 ? 'bottom 78%' : 'bottom 55%')
      chapterEls.current.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: line,
          end: lineEnd,
          invalidateOnRefresh: true,
          onToggle: (self) => self.isActive && setActive(i),
        })
      })
      gsap.fromTo(
        railFill.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.life-chapters', start: 'top 55%', end: 'bottom 55%', scrub: true },
        },
      )
    },
    { scope: root },
  )

  const goTo = (i) => {
    const el = chapterEls.current[i]
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { duration: 1.2 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <section className="life" id="how" ref={root} aria-labelledby="life-title">
      <header className="life-head">
        <p className="eyebrow">After it arrives</p>
        <h2 className="display display--md" id="life-title">
          The life of an invitation
        </h2>
        <p className="life-intro">
          What happens from the second the link is sent to long after the last guest leaves — told through five
          different celebrations.
        </p>
      </header>

      <div className="life-body">
        <nav className="life-rail" aria-label="Chapters">
          <span className="life-rail-track">
            <span className="life-rail-fill" ref={railFill} />
          </span>
          <ol>
            {CHAPTERS.map((c, i) => (
              <li key={c.id} className={i === active ? 'is-active' : i < active ? 'is-done' : undefined}>
                <button type="button" onClick={() => goTo(i)} aria-current={i === active ? 'step' : undefined}>
                  {c.label}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="life-mask" aria-hidden="true" />
        <div className="life-stage">
          <div className="life-stage-inner">
            <AnimatePresence initial={false}>
              <motion.div key={chapter.id} className="fc-layer" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
                <Cards feed={feed} />
              </motion.div>
            </AnimatePresence>
            <div className="lp-anchor" data-device-anchor="life" aria-hidden="true" />
          </div>
        </div>

        <div className="life-chapters">
          {CHAPTERS.map((c, i) => (
            <article
              key={c.id}
              className={`life-chapter ${i === active ? 'is-active' : ''}`}
              ref={(el) => (chapterEls.current[i] = el)}
            >
              <p className="life-num">{c.occasion}</p>
              <h3 className="life-title">
                {c.title.join('')}
              </h3>
              <p className="life-text">{c.body}</p>
              <ul className="life-chips">
                {c.chips.map(([icon, label]) => (
                  <li key={label}>
                    <Icon name={icon} />
                    {label}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

    </section>
  )
}
