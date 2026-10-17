'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import InviteArt from './InviteArt'
import Reveal from './Reveal'
import { FEATURED, occasionByLabel } from '../templates/data'

// Two passes of the featured designs: enough segments to cover the widest screen.
const FRAMES = [...FEATURED, ...FEATURED]
const BASE_SPEED = 70 // px per second, right to left

/**
 * A film strip riding a travelling sine wave. Every frame is its own segment of
 * film (with sprockets), placed on the curve and sheared to the curve's slope, so
 * the chain reads as one continuous, rippling strip. Segments that leave on the
 * left wrap round to the right: the loop never shows an end.
 */
export default function FilmStrip() {
  const root = useRef(null)
  const stage = useRef(null)
  const segs = useRef([])

  useEffect(() => {
    const els = segs.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let offset = 0
    let speed = 1
    let target = 1
    let visible = true

    const layout = (time = 0) => {
      const W = stage.current.clientWidth
      const H = stage.current.clientHeight
      const seg = els[0].offsetWidth - 2 // overlap 2px so seams never open
      const loop = seg * els.length
      const mobile = W < 768
      const amp = Math.min(H * 0.2, mobile ? 24 : 70)
      const k = (Math.PI * 2) / (mobile ? W * 2.6 : Math.max(W * 1.15, 1100))
      const phase = time * 0.6

      els.forEach((el, i) => {
        let x = (i * seg - offset) % loop
        if (x < -seg) x += loop
        const cx = x + seg / 2
        const y = amp * Math.sin(k * cx + phase)
        const slope = amp * k * Math.cos(k * cx + phase)
        const angle = (Math.atan(slope) * 180) / Math.PI
        // Shear rather than rotate: neighbouring edges stay vertical and meet, so
        // the segments bend like one ribbon instead of fanning apart.
        el.style.transform = `translate3d(${x}px, ${H / 2 + y}px, 0) translateY(-50%) skewY(${angle}deg)`
      })
      return loop
    }

    if (reduced) {
      layout(0)
      const onResize = () => layout(0)
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }

    let last = performance.now()
    const tick = () => {
      const now = performance.now()
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!visible) return
      speed += (target - speed) * Math.min(1, dt * 4)
      offset += BASE_SPEED * speed * dt
      const loop = layout(now / 1000)
      if (offset > loop) offset -= loop
    }
    gsap.ticker.add(tick)

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(root.current)

    // Scrolling throws the reel faster; it eases back to its normal pace.
    let settle
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        target = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 8)
        clearTimeout(settle)
        settle = setTimeout(() => (target = hovering ? 0.25 : 1), 180)
      },
    })

    let hovering = false
    const el = root.current
    const slow = () => {
      hovering = true
      target = 0.25
    }
    const resume = () => {
      hovering = false
      target = 1
    }
    el.addEventListener('pointerenter', slow)
    el.addEventListener('pointerleave', resume)

    return () => {
      gsap.ticker.remove(tick)
      io.disconnect()
      st.kill()
      clearTimeout(settle)
      el.removeEventListener('pointerenter', slow)
      el.removeEventListener('pointerleave', resume)
    }
  }, [])

  return (
    <section className="film" ref={root} aria-labelledby="film-title">
      <Reveal className="film-head">
        <div>
          <p className="eyebrow">Featured designs</p>
          <h2 className="display display--md" id="film-title">
            Fresh off the press
          </h2>
        </div>
        <a href="/occasions" className="btn btn--outline film-cta">
          Explore all templates <span aria-hidden="true">→</span>
        </a>
      </Reveal>

      <div className="film-stage" ref={stage}>
        {FRAMES.map((t, i) => (
          <figure
            className="film-seg"
            key={`${t.id}-${i}`}
            ref={(el) => (segs.current[i] = el)}
            aria-hidden={i >= FEATURED.length || undefined}
          >
            <a
              className="film-frame"
              href={`/templates/category/${occasionByLabel(t.occasions[0])?.slug}`}
              tabIndex={i >= FEATURED.length ? -1 : undefined}
            >
              <div className="film-shot">
                <InviteArt {...t} meta="Saturday · 4:30 PM" />
                <span className="film-view" aria-hidden="true">
                  View designs
                </span>
              </div>
              <figcaption>
                {t.name} <span>· {t.occasions[0]}</span>
              </figcaption>
            </a>
          </figure>
        ))}
      </div>
    </section>
  )
}
