'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { setLenis } from '@/lib/lenis'

// In Next.js 16 with React 19 (<Activity>), external DOM manipulations (e.g. GSAP pin-spacers,
// browser extensions, or Google Translate) can displace nodes. Guard insertBefore & removeChild
// so React does not crash with "Node is not a child of this node".
if (typeof window !== 'undefined') {
  const originalInsertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (newNode === referenceNode) return newNode
      // If referenceNode was reparented inside a wrapper (like a GSAP pin-spacer),
      // find the direct child of `this` that contains referenceNode.
      let directChild = referenceNode
      while (directChild && directChild.parentNode && directChild.parentNode !== this) {
        directChild = directChild.parentNode
      }
      if (directChild && directChild.parentNode === this) {
        if (newNode === directChild) return newNode
        return originalInsertBefore.call(this, newNode, directChild)
      }
      return this.appendChild(newNode)
    }
    return originalInsertBefore.call(this, newNode, referenceNode)
  }

  const originalRemoveChild = Node.prototype.removeChild
  Node.prototype.removeChild = function (child) {
    if (child && child.parentNode !== this) {
      if (child.parentNode) {
        return child.parentNode.removeChild(child)
      }
      return child
    }
    return originalRemoveChild.call(this, child)
  }
}

// Smooth scrolling for every page, set up the same way the original app did:
// one Lenis per page, driven by GSAP's ticker so ScrollTrigger stays in sync.
export default function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1 })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Schedule scroll reset after the DOM has settled so React Activity finishes its transition
    const frame = requestAnimationFrame(() => {
      if (!window.location.hash) {
        lenis.scrollTo(0, { immediate: true })
      }
      ScrollTrigger.refresh()
    })

    return () => {
      cancelAnimationFrame(frame)
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [pathname])

  return null
}
