'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'

/**
 * Sections below the fold rise 24px and fade in as they arrive (0.7s, 0.07s
 * stagger). Content is visible by default; nothing moves for visitors who
 * prefer less motion.
 */
export default function Reveal({ children, className }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const items = gsap.utils.toArray('[data-reveal]').filter((el) => el.getBoundingClientRect().top > window.innerHeight)
      if (!items.length) return
      gsap.set(items, { autoAlpha: 0, y: 24 })
      ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'expo.out', overwrite: true }),
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
