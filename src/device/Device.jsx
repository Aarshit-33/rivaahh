'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { CHAPTERS } from '../life/chapters'
import { SCREENS } from '../life/screens'
import { useDevice } from './DeviceContext'
import MakeScreen from './MakeScreen'
import './device.css'

const smooth = (x) => x * x * (3 - 2 * x)

/**
 * The single phone shared by the hero, "The life of an invitation" and
 * "Make it yours". It is fixed to the viewport and follows invisible anchors:
 * the hero's phone slot and the life section's sticky slot (blending between
 * them so it never leaves the screen), then, once the life section has
 * scrolled away, the slot in "Make it yours", where it shows the visitor's
 * own invitation.
 */
export default function Device() {
  const { active, feed, parts, make } = useDevice()
  const root = useRef(null)
  const [making, setMaking] = useState(false)
  const chapter = CHAPTERS[active]
  const Screen = SCREENS[chapter.id]

  useEffect(() => {
    const el = root.current
    let t = 0
    let lastW = 0
    let inMake = false
    // Hand-off runs from the moment the hero un-pins until the life section's
    // phone slot is pinned in place.
    const handoff = ScrollTrigger.create({
      trigger: '.life',
      start: 'top bottom',
      endTrigger: '.life-body',
      end: 'top top',
      onUpdate: (self) => (t = self.progress),
      onRefresh: (self) => (t = self.progress),
    })

    const place = () => {
      const a = document.querySelector('[data-device-anchor="hero"]')
      const b = document.querySelector('[data-device-anchor="life"]')
      if (!a || !b) return
      const ra = a.getBoundingClientRect()
      const rb = b.getBoundingClientRect()
      const w = rb.width || ra.width
      if (w !== lastW) {
        el.style.setProperty('--dw', `${w}px`)
        lastW = w
      }

      // By the time "Make it yours" is near, the life slot is far above the
      // viewport, so the switch happens while the phone is off-screen.
      const m = document.querySelector('[data-device-anchor="make"]')
      const rm = m?.getBoundingClientRect()
      const nowMake = !!rm && rm.width > 0 && rm.top < window.innerHeight * 1.4 && rb.bottom < 0
      if (nowMake !== inMake) {
        inMake = nowMake
        setMaking(nowMake)
      }
      if (nowMake) {
        el.style.transform = `translate3d(${rm.left}px, ${rm.top}px, 0) scale(${rm.width / w})`
        return
      }

      const k = smooth(t)
      const x = ra.left + (rb.left - ra.left) * k
      const y = ra.top + (rb.top - ra.top) * k
      const s = (ra.width + (rb.width - ra.width) * k) / w
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`
    }
    gsap.ticker.add(place)
    return () => {
      gsap.ticker.remove(place)
      handoff.kill()
    }
  }, [])

  return (
    <div className="device" ref={root}>
      <div className="dv-glow" ref={parts.glow} />
      <svg className="dv-outline" ref={parts.outline} viewBox="0 0 90 195" preserveAspectRatio="none" aria-hidden="true">
        <rect ref={parts.outlineRect} x="0.6" y="0.6" width="88.8" height="193.8" rx="11.5" pathLength="1" />
      </svg>
      <div className="dv-body" ref={parts.body} />
      <div className="dv-screen" ref={parts.screen}>
        <div className="dv-content" ref={parts.content}>
          <AnimatePresence initial={false}>
            {making ? (
              <motion.div
                key="make"
                className="dv-make-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <MakeScreen make={make} />
              </motion.div>
            ) : (
            <motion.div
              key={chapter.id}
              className="lp-content"
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, y: -16, filter: 'blur(6px)', transition: { duration: 0.3 } }}
            >
              <Screen feed={feed} />
            </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
