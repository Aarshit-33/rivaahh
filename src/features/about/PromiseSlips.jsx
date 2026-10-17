'use client'

import { useEffect, useRef } from 'react'
import { WaxSeal } from '@/components/props'
import { PROMISES } from './data'
import s from './about.module.css'

const MAX_TILT = 4

// Four paper slips. With a mouse, each one straightens and leans toward the
// pointer by at most 4°; on touch screens and under reduced motion they stay put.
export default function PromiseSlips() {
  const list = useRef(null)

  useEffect(() => {
    const root = list.current
    if (!root) return undefined
    const fine = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    if (!fine.matches) return undefined
    const slips = [...root.querySelectorAll('[data-slip]')]
    const handlers = slips.map((el) => {
      const move = (e) => {
        const r = el.getBoundingClientRect()
        const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) - 0.5
        const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) - 0.5
        el.style.setProperty('--rx', `${(-y * 2 * MAX_TILT).toFixed(2)}deg`)
        el.style.setProperty('--ry', `${(x * 2 * MAX_TILT).toFixed(2)}deg`)
      }
      const leave = () => {
        el.style.removeProperty('--rx')
        el.style.removeProperty('--ry')
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    })
    return () => handlers.forEach((off) => off())
  }, [])

  return (
    <ul className={s.slips} ref={list}>
      {PROMISES.map(([title, body]) => (
        <li key={title} className={s.slipCell}>
          <article className={s.slip} data-slip>
            <h3 className={s.slipTitle}>{title}</h3>
            <p className={s.slipBody}>{body}</p>
            <WaxSeal size="sm" className={s.slipSeal} />
          </article>
        </li>
      ))}
    </ul>
  )
}
