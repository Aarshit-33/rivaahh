'use client'

import { useEffect, useId, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { getLenis } from '@/lib/lenis'
import { Close } from './Icons'
import s from './ui.module.css'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const ease = [0.22, 1, 0.36, 1]

function useLatest(value) {
  const ref = useRef(value)
  useLayoutEffect(() => {
    ref.current = value
  })
  return ref
}

/** Keep Tab inside `root`. */
function trapTab(e, root) {
  const items = [...root.querySelectorAll(FOCUSABLE)].filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  )
  if (!items.length) return
  const first = items[0]
  const last = items[items.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

/**
 * A modal sheet: bottom sheet on phones (`variant="bottom"`), a centred
 * dialog, or a full-screen sheet. Traps focus, closes on Escape and on the
 * backdrop, pauses smooth scroll and returns focus to where it came from.
 */
export default function Sheet({
  open,
  onClose,
  title,
  variant = 'dialog',
  size = 'md',
  className = '',
  children,
  footer,
  hideTitle = false,
}) {
  const panel = useRef(null)
  const close = useLatest(onClose)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    const lenis = getLenis()
    lenis?.stop()
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    const t = setTimeout(() => {
      const root = panel.current
      if (!root) return
      const target = root.querySelector('[data-autofocus]') || root.querySelector(FOCUSABLE) || root
      target.focus({ preventScroll: true })
    }, 40)
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close.current?.()
      } else if (e.key === 'Tab' && panel.current) trapTab(e, panel.current)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      lenis?.start()
      html.style.overflow = prevOverflow
      if (prev && typeof prev.focus === 'function' && document.contains(prev)) prev.focus({ preventScroll: true })
    }
  }, [open, close])

  if (typeof document === 'undefined') return null

  const from = variant === 'bottom' ? { y: '100%' } : { opacity: 0, y: 24 }
  const to = variant === 'bottom' ? { y: 0 } : { opacity: 1, y: 0 }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={`${s.sheetRoot} ${s[`sheet_${variant}`]}`}>
          <motion.div
            className={s.backdrop}
            onClick={() => close.current?.()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={`${s.panel} ${s[`size_${size}`] || ''} ${className}`}
            initial={from}
            animate={to}
            exit={from}
            transition={{ duration: 0.45, ease }}
          >
            <div className={s.panelHead}>
              <h2 id={titleId} className={hideTitle ? 'sr-only' : s.panelTitle}>
                {title}
              </h2>
              <button type="button" className={s.iconBtn} onClick={() => close.current?.()} aria-label="Close">
                <Close />
              </button>
            </div>
            <div className={s.panelBody} data-lenis-prevent>
              {children}
            </div>
            {footer && <div className={s.panelFoot}>{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

/**
 * A small non-modal popover under its trigger (desktop). Closes on Escape
 * (focus returns to the trigger) and on a click outside `wrapRef`.
 */
export function Popover({ open, onClose, wrapRef, triggerRef, label, className = '', children }) {
  const box = useRef(null)
  const close = useLatest(onClose)

  // Keep the popover inside the viewport (it never causes sideways scroll).
  useLayoutEffect(() => {
    const el = box.current
    if (!open || !el) return
    el.style.translate = ''
    const r = el.getBoundingClientRect()
    const room = document.documentElement.clientWidth - 16
    if (r.right > room) el.style.translate = `${Math.max(room - r.right, 16 - r.left)}px 0`
    else if (r.left < 16) el.style.translate = `${16 - r.left}px 0`
  }, [open])

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => {
      const target = box.current?.querySelector('[data-autofocus]') || box.current?.querySelector(FOCUSABLE)
      target?.focus({ preventScroll: true })
    }, 20)
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) close.current?.()
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        close.current?.()
        triggerRef.current?.focus({ preventScroll: true })
      } else if (e.key === 'Tab' && box.current) trapTab(e, box.current)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close, wrapRef, triggerRef])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={box}
          role="dialog"
          aria-label={label}
          className={`${s.popover} ${className}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease }}
          data-lenis-prevent
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
