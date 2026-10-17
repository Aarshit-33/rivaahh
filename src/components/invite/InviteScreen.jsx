'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Motif } from '@/sections/InviteArt'

const PETALS = [12, 26, 41, 58, 73, 88]

function useCountdown(dateText) {
  const [left, setLeft] = useState(null)
  useEffect(() => {
    const target = Date.parse(dateText)
    if (Number.isNaN(target)) return
    const tick = () => setLeft(Math.max(0, target - Date.now()))
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [dateText])
  if (left == null) return [['—', 'days'], ['—', 'hrs'], ['—', 'min']]
  const d = Math.floor(left / 864e5)
  const h = Math.floor((left % 864e5) / 36e5)
  const m = Math.floor((left % 36e5) / 6e4)
  return [
    [String(d), 'days'],
    [String(h).padStart(2, '0'), 'hrs'],
    [String(m).padStart(2, '0'), 'min'],
  ]
}

/**
 * One phone-sized invitation — the product itself. Used by template cards
 * (`poster`), the showcase devices, the full-screen demo and the About page.
 *
 * It fills its parent, which must have a definite size (a phone screen, a
 * laptop view or an element with `aspect-ratio: 9 / 16`).
 *
 * - `template`  a template from src/templates/data.js
 * - `names`, `date`  the visitor's own details (optional, override the sample)
 * - `poster`    render the cover only, nothing scrolls
 * - `playing`   play the opening (reels loop their petals while playing)
 * - `part`      scroll to a part: cover | welcome | functions | venue | rsvp | countdown
 * - `onPart`    called with the part id that is currently in view
 * - `onRsvp`    called when a guest taps an RSVP button (demo)
 * - `onDirections` called when a guest taps "Get directions" (demo)
 */
const InviteScreen = forwardRef(function InviteScreen(
  { template, names, date, poster = false, playing = false, part, onPart, onRsvp, onDirections, className = '', inert = false },
  ref,
) {
  const scroller = useRef(null)
  const sample = template.sample
  const title = names?.trim() || template.title
  const when = date || sample.date
  const count = useCountdown(when)
  const [reply, setReply] = useState(null)

  useImperativeHandle(ref, () => ({
    scrollToPart(id, smooth = true) {
      const el = scroller.current?.querySelector(`[data-part="${id}"]`)
      if (el) scroller.current.scrollTo({ top: el.offsetTop, behavior: smooth ? 'smooth' : 'auto' })
    },
    get element() {
      return scroller.current
    },
  }))

  // Follow the `part` prop.
  useEffect(() => {
    if (!part || poster) return
    const el = scroller.current?.querySelector(`[data-part="${part}"]`)
    if (el) scroller.current.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
  }, [part, poster])

  // Report which part is on screen.
  useEffect(() => {
    if (!onPart || poster || !scroller.current) return
    const root = scroller.current
    const io = new IntersectionObserver(
      (entries) => {
        const best = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (best) onPart(best.target.dataset.part)
      },
      { root, threshold: [0.5, 0.75] },
    )
    root.querySelectorAll('[data-part]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [onPart, poster])

  const rsvp = (value) => {
    setReply(value)
    onRsvp?.(value)
  }

  const isReel = template.format === 'reel'

  return (
    <div
      className={`inv inv--${template.theme} ${playing ? 'is-playing' : ''} ${poster ? 'is-poster' : ''} ${className}`}
      inert={inert || undefined}
    >
      <div className="inv-scroll" ref={scroller} tabIndex={poster || inert ? undefined : 0}>
        <section className="inv-cover" data-part="cover">
          <div className="inv-glow" aria-hidden="true" />
          {isReel && (
            <div className="inv-petals" aria-hidden="true">
              {PETALS.map((x, i) => (
                <span key={x} style={{ left: `${x}%`, animationDelay: `${i * 0.7}s` }} />
              ))}
            </div>
          )}
          <div className="inv-frame">
            <div className="inv-motif">
              <Motif type={template.motif} />
            </div>
            <p className="inv-eyebrow">{template.eyebrow}</p>
            <p className="inv-title">{title}</p>
            <p className="inv-date">{when}</p>
            <p className="inv-venue">
              {sample.venue}, {sample.city}
            </p>
            <span className="inv-seal" aria-hidden="true">
              N
            </span>
          </div>
          {!poster && (
            <span className="inv-hint" aria-hidden="true">
              Scroll
            </span>
          )}
        </section>

        {!poster && (
          <>
            <section className="inv-sec inv-welcome" data-part="welcome">
              <p className="inv-kicker">{sample.hosts}</p>
              <p className="inv-quote">{sample.welcome}</p>
              <span className="inv-rule" aria-hidden="true">
                ✦
              </span>
            </section>

            <section className="inv-sec" data-part="functions">
              <p className="inv-kicker">Karyakram</p>
              <ul className="inv-fns">
                {sample.functions.map(([name, day, time]) => (
                  <li key={name}>
                    <span className="inv-fn-name">{name}</span>
                    <span className="inv-fn-when">
                      {day}
                      <br />
                      {time}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="inv-sec" data-part="venue">
              <p className="inv-kicker">Venue</p>
              <svg className="inv-map" viewBox="0 0 200 110" aria-hidden="true">
                <rect width="200" height="110" rx="8" className="inv-map-bg" />
                <path d="M0 70 C40 60 70 80 110 66 S170 40 200 48" className="inv-map-road" />
                <path d="M60 0 C64 30 58 60 70 110" className="inv-map-road inv-map-road--thin" />
                <path d="M140 0 C136 40 150 70 146 110" className="inv-map-road inv-map-road--thin" />
                <circle cx="118" cy="56" r="16" className="inv-map-halo" />
                <path d="M118 38 c-8 0 -13 6 -13 13 c0 9 13 21 13 21 s13 -12 13 -21 c0 -7 -5 -13 -13 -13z" className="inv-map-pin" />
                <circle cx="118" cy="51" r="4" className="inv-map-dot" />
              </svg>
              <p className="inv-place">{sample.venue}</p>
              <p className="inv-small">{sample.city}</p>
              <button
                type="button"
                className="inv-btn inv-btn--ghost"
                onClick={() => onDirections?.()}
                tabIndex={inert || poster ? -1 : 0}
              >
                Get directions
              </button>
            </section>

            <section className="inv-sec" data-part="rsvp">
              <p className="inv-kicker">RSVP</p>
              <p className="inv-quote inv-quote--sm">Will you join us?</p>
              <div className="inv-rsvp">
                <button
                  type="button"
                  className={`inv-btn ${reply === 'yes' ? 'is-on' : ''}`}
                  onClick={() => rsvp('yes')}
                  tabIndex={inert || poster ? -1 : 0}
                >
                  {reply === 'yes' ? '✓ Joyfully attending' : 'Joyfully attending'}
                </button>
                <button
                  type="button"
                  className={`inv-btn inv-btn--ghost ${reply === 'no' ? 'is-on' : ''}`}
                  onClick={() => rsvp('no')}
                  tabIndex={inert || poster ? -1 : 0}
                >
                  Regretfully decline
                </button>
              </div>
            </section>

            <section className="inv-sec" data-part="countdown">
              <p className="inv-kicker">Counting down</p>
              <div className="inv-count">
                {count.map(([v, l]) => (
                  <span key={l}>
                    <b>{v}</b>
                    {l}
                  </span>
                ))}
              </div>
              <p className="inv-small">to {when}</p>
            </section>

            <footer className="inv-foot">
              <span className="inv-seal inv-seal--sm" aria-hidden="true">
                N
              </span>
              Made with Nimantran
            </footer>
          </>
        )}
      </div>
    </div>
  )
})

export default InviteScreen
