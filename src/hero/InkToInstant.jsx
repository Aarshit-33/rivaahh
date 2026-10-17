'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { getLenis } from '../lib/lenis'
import { InkScene } from './InkScene'
import StillLife from './StillLife'
import StageRail from './StageRail'
import { GuestRegister, LagStat, RotaryPhone } from './DeskRight'
import { useDevice } from '../device/DeviceContext'

// Scroll progress (0–1) at which each storyboard frame begins.
const BOUNDS = [0, 0.1, 0.22, 0.3, 0.46, 0.6, 0.74, 0.9]
const stageOf = (p) => BOUNDS.reduce((s, b, i) => (p >= b ? i : s), 0)

// "14 days" counts down to "0.4 sec" between these two points of the scroll.
const LAG_FROM = 0.62
const LAG_TO = 0.86
const LAG_STEPS = [
  ['14', 'days'],
  ['11', 'days'],
  ['7', 'days'],
  ['3', 'days'],
  ['1', 'day'],
  ['9', 'hours'],
  ['40', 'min'],
  ['5', 'min'],
  ['30', 'sec'],
  ['1', 'tap'],
]
const LAG_CAPTION_THEN = 'by post, an invitation could take up to two weeks to reach everyone'
const LAG_CAPTION_NOW = 'is all it takes to reach every guest today'

const CAPTIONS = {
  2: '…the paper lets go…',
  3: '…the ink takes flight…',
  4: '…and turns to light…',
  5: '…finding its new home…',
  6: '…alive in every guest’s hand.',
}

function canAnimate() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

export default function InkToInstant() {
  const section = useRef(null)
  const stage = useRef(null)
  const canvas = useRef(null)
  const still = useRef(null)
  const cardStart = useRef(null)
  const cardEnd = useRef(null)
  const phone = useRef(null)
  const thenCopy = useRef(null)
  const nowCopy = useRef(null)
  const railFill = useRef(null)
  const deskRight = useRef(null)
  const rotary = useRef(null)
  const lag = useRef(null)
  const lagNum = useRef(null)
  const lagUnit = useRef(null)
  const lagCap = useRef(null)
  const lagEnd = useRef(null)
  const lagStep = useRef(0)
  const scene = useRef(null)
  const trigger = useRef(null)
  const stageIdx = useRef(0)
  const { parts } = useDevice()

  const [mode] = useState(() => (canAnimate() ? 'motion' : 'static'))
  const [current, setCurrent] = useState(mode === 'motion' ? 0 : 7)

  // WebGL scene: created once, re-measured whenever the stage resizes.
  useEffect(() => {
    if (mode !== 'motion') return
    const s = new InkScene(canvas.current, { mobile: window.matchMedia('(max-width: 767px)').matches })
    scene.current = s

    const measure = () => {
      const sr = stage.current.getBoundingClientRect()
      const rel = (el) => {
        const r = el.getBoundingClientRect()
        return { x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height }
      }
      const c = rel(cardStart.current)
      stage.current.style.setProperty('--cue-x', `${c.x + c.w / 2}px`)
      // The card lies tilted on the desk, so its wax seal shows just below its centre.
      stage.current.style.setProperty('--cue-y', `${c.y + c.h * 0.61}px`)
      s.setLayout({
        W: sr.width,
        H: sr.height,
        cardStart: rel(cardStart.current),
        cardEnd: rel(cardEnd.current),
        phone: rel(phone.current),
        oldPhone: rel(rotary.current.querySelector('svg')),
      })
    }
    const ro = new ResizeObserver(measure)
    ro.observe(stage.current)
    s.ready.then(measure)
    document.fonts.ready.then(() => ScrollTrigger.refresh())

    const onMove = (e) => s.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
    window.addEventListener('pointermove', onMove)
    return () => {
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      s.dispose()
      scene.current = null
    }
  }, [mode])

  // Scroll-scrubbed timeline. Total duration is 1, so positions read as scroll progress.
  useGSAP(
    () => {
      if (mode !== 'motion') return
      const proxy = { p: 0 }
      const setLag = (p) => {
        const t = Math.min(1, Math.max(0, (p - LAG_FROM) / (LAG_TO - LAG_FROM)))
        const i = Math.round(t * (LAG_STEPS.length - 1))
        if (i === lagStep.current) return
        lagStep.current = i
        lagNum.current.textContent = LAG_STEPS[i][0]
        lagUnit.current.textContent = LAG_STEPS[i][1]
        lagCap.current.textContent = i === LAG_STEPS.length - 1 ? LAG_CAPTION_NOW : LAG_CAPTION_THEN
      }
      // Distance from the stat's resting place to its final spot beside the phone.
      const lagShift = (axis) => () => {
        const from = lag.current
        const to = lagEnd.current
        return axis === 'x' ? to.offsetLeft - from.offsetLeft : to.offsetTop - from.offsetTop
      }
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * (window.innerWidth < 768 ? 3.2 : 4.2)}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const s = stageOf(self.progress)
            if (s !== stageIdx.current) {
              stageIdx.current = s
              setCurrent(s)
            }
          },
        },
      })
      trigger.current = tl.scrollTrigger

      tl.to(
        proxy,
        {
          p: 1,
          duration: 1,
          onUpdate: () => {
            scene.current?.setProgress(proxy.p)
            setLag(proxy.p)
          },
        },
        0,
      )
      tl.fromTo(railFill.current, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)

      // 01 → 02: the old-world headline steps aside as the card lifts.
      tl.to(thenCopy.current, { autoAlpha: 0, y: -40, filter: 'blur(8px)', duration: 0.08 }, 0.09)
      // The desk falls out of focus while the ink travels, then fades away.
      tl.fromTo(still.current, { filter: 'blur(0px)', opacity: 1 }, { filter: 'blur(5px)', opacity: 0.45, duration: 0.35 }, 0.2)
      tl.to(still.current, { opacity: 0, duration: 0.12 }, 0.78)
      tl.fromTo(deskRight.current, { filter: 'blur(0px)', opacity: 1 }, { filter: 'blur(4px)', opacity: 0.5, duration: 0.3 }, 0.24)
      // The handwritten names lift off the register as ink, joining the stream.
      tl.to('.reg-row', { y: -28, opacity: 0, filter: 'blur(5px)', stagger: 0.012, duration: 0.06 }, 0.28)
      tl.to('.register', { opacity: 0.35, duration: 0.1 }, 0.36)
      // The rotary phone dissolves into gold just before the smartphone is traced.
      tl.to(rotary.current, { opacity: 0, scale: 1.06, filter: 'blur(8px) brightness(1.5)', duration: 0.06 }, 0.53)
      tl.to(deskRight.current, { opacity: 0, duration: 0.1 }, 0.7)
      // "14 days" stays sharp throughout, then settles beside the phone as "0.4 sec".
      // It glides into the gap beside the phone before the phone is traced, then counts down there.
      tl.to(lag.current, { x: lagShift('x'), y: lagShift('y'), scale: 0.62, duration: 0.08 }, 0.5)
      tl.to(lagCap.current, { fontSize: 18, duration: 0.08 }, 0.5)
      tl.fromTo('.grain', { opacity: 0.4 }, { opacity: 0.12, duration: 0.5 }, 0.3)
      tl.fromTo('.warm-light', { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.45)

      // 06: the shared phone is traced in gold, then takes on weight. Its screen
      // stays see-through until the particles have landed on it.
      tl.fromTo(parts.glow.current, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.12 }, 0.58)
      tl.fromTo(parts.outline.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02 }, 0.6)
      tl.fromTo(parts.outlineRect.current, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.12 }, 0.6)
      tl.fromTo(parts.body.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.68)
      tl.to(parts.outline.current, { autoAlpha: 0, duration: 0.06 }, 0.8)
      tl.fromTo(
        parts.screen.current,
        { backgroundColor: 'rgba(251, 246, 236, 0)', pointerEvents: 'none' },
        { backgroundColor: 'rgba(251, 246, 236, 1)', pointerEvents: 'auto', duration: 0.06 },
        0.8,
      )
      // 07: the invitation surfaces as the last particles land.
      tl.fromTo(
        parts.content.current,
        { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' },
        { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.12 },
        0.78,
      )
      tl.to(parts.glow.current, { opacity: 0.35, duration: 0.1 }, 0.86)
      // As the next section rises, the storyboard rail steps aside for the travelling phone.
      gsap.to('.rail, .skip', {
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: {
          start: () => tl.scrollTrigger.end,
          end: () => tl.scrollTrigger.end + window.innerHeight * 0.2,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      // 08: the new-world headline arrives.
      tl.fromTo(nowCopy.current, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.88)
    },
    { scope: section, dependencies: [mode] },
  )

  const jump = (i) => {
    const st = trigger.current
    if (!st) return
    const p = i === 7 ? 0.98 : BOUNDS[i] + 0.02
    const y = st.start + p * (st.end - st.start)
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { duration: 1.6 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  // Plays the whole story for the visitor, slowly enough to watch.
  const play = () => {
    const st = trigger.current
    if (!st) return
    const y = st.start + 0.98 * (st.end - st.start)
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { duration: 7, easing: (t) => t })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <section ref={section} className={`iti iti--${mode}`} aria-label="From ink to instant">
      <div ref={stage} className="iti-stage">
        <div className="warm-light" />
        <StillLife ref={still} cardStartRef={cardStart} />
        <div className="desk-right" ref={deskRight}>
          <GuestRegister />
          <RotaryPhone ref={rotary} />
        </div>
        <div className="anchor anchor--card-end" ref={cardEnd} />
        <div className="phone-wrap" ref={phone} data-device-anchor="hero" aria-hidden="true" />
        <canvas ref={canvas} className="iti-canvas" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />

        <div className="then-copy" ref={thenCopy}>
          <p className="eyebrow">Then</p>
          <h1 className="display">
            Invitations once
            <br />
            <em>took weeks.</em>
          </h1>
          <p className="lede">
            Nimantran sends yours in one link — with RSVP, maps, music and a live countdown, for every celebration.
          </p>
          <div className="actions">
            <motion.a href="#create" className="btn btn--primary" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              Create your invite
            </motion.a>
            {mode === 'motion' && (
              <button type="button" className="btn btn--text" onClick={play}>
                Watch it change ↓
              </button>
            )}
          </div>
        </div>

        {mode === 'motion' && current === 0 && (
          <motion.button
            type="button"
            className="seal-cue"
            onClick={play}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 1.4, duration: 0.6 } }}
            exit={{ opacity: 0 }}
          >
            <span className="seal-cue-ring" aria-hidden="true" />
            <span className="seal-cue-label">Tap the seal</span>
          </motion.button>
        )}

        <LagStat ref={lag} numRef={lagNum} unitRef={lagUnit} capRef={lagCap} />
        <div className="anchor anchor--lag-end" ref={lagEnd} />

        <div className="caption" aria-live="polite">
          <AnimatePresence mode="wait">
            {CAPTIONS[current] && (
              <motion.p
                key={current}
                initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {CAPTIONS[current]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="now-copy" ref={nowCopy}>
          <p className="eyebrow">Now</p>
          <h2 className="display">
            Now they take <em>a heartbeat.</em>
          </h2>
          <p className="lede">
            Personalised, interactive invites with RSVP, maps, music and a live countdown — for birthdays, weddings,
            housewarmings and every celebration.
          </p>
          <div className="actions">
            <motion.a href="#create" className="btn btn--primary" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              Create your invite
            </motion.a>
            <a href="/templates" className="btn btn--text">
              Explore templates
            </a>
          </div>
          <ul className="proof">
            <li>Shared on WhatsApp</li>
            <li>No app needed</li>
            <li>RSVPs tracked live</li>
          </ul>
        </div>

        {mode === 'motion' && (
          <>
            <StageRail stage={current} onJump={jump} fillRef={railFill} />
            {current < 7 && (
              <button type="button" className="skip" onClick={() => jump(7)}>
                Skip to now →
              </button>
            )}
          </>
        )}
      </div>
    </section>
  )
}
