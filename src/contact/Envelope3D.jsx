'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { EnvelopeScene } from './EnvelopeScene'

const canWebGL = () => {
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'))
  } catch {
    return false
  }
}

/**
 * The 3D envelope. `mode="scroll"` opens it as its section scrolls into view
 * (GSAP scrub); `mode="auto"` plays the opening once on load.
 */
export default function Envelope3D({ mode = 'scroll', className = '' }) {
  const wrap = useRef(null)
  const canvas = useRef(null)

  useEffect(() => {
    if (!wrap.current || !canvas.current) return
    if (!canWebGL()) {
      wrap.current?.classList.add('is-fallback')
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cancelled = false
    let scene, ro, st, tween
    const onMove = (e) =>
      scene?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)

    // The paper textures are drawn with the page fonts. Ask for them by name:
    // a font nothing on the page has used yet is not downloaded on its own.
    const fontPromises =
      document.fonts && typeof document.fonts.load === 'function'
        ? Promise.all([
            document.fonts.load('64px Parisienne'),
            document.fonts.load('italic 600 120px Fraunces'),
          ]).catch(() => {})
        : Promise.resolve()

    fontPromises.then(() => {
      if (cancelled || !wrap.current || !canvas.current) return
      try {
        scene = new EnvelopeScene(canvas.current, { mobile: window.innerWidth < 768 })
        ro = new ResizeObserver(([e]) => scene?.resize(e.contentRect.width, e.contentRect.height))
        ro.observe(wrap.current)
        window.addEventListener('pointermove', onMove)

        const state = { v: 0 }
        if (reduced) {
          scene.setOpen(1)
        } else if (mode === 'auto') {
          tween = gsap.to(state, {
            v: 1,
            duration: 2.2,
            delay: 0.5,
            ease: 'power2.inOut',
            onUpdate: () => scene?.setOpen(state.v),
          })
        } else {
          st = ScrollTrigger.create({
            trigger: wrap.current,
            start: 'top 85%',
            end: 'center 45%',
            scrub: true,
            onUpdate: (self) => scene?.setOpen(self.progress),
            onRefresh: (self) => scene?.setOpen(self.progress),
          })
        }
      } catch (err) {
        console.warn('Could not initialize 3D envelope scene:', err)
        wrap.current?.classList.add('is-fallback')
      }
    })

    return () => {
      cancelled = true
      ro?.disconnect()
      window.removeEventListener('pointermove', onMove)
      st?.kill()
      tween?.kill()
      scene?.dispose()
    }
  }, [mode])

  return (
    <div className={`env3d ${className}`} ref={wrap} aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  )
}
