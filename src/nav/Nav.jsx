'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { getLenis } from '../lib/lenis'
import './nav.css'

const LINKS = [
  ['/occasions', 'Occasions', 'Every design, by celebration'],
  ['/#how', 'How it works', 'From one link to a keepsake'],
  ['/#pricing', 'Pricing', 'See what it costs'],
  ['/about', 'About', 'Why we make invitations'],
  ['/contact', 'Contact', 'Ask us anything'],
]

const ease = [0.22, 1, 0.36, 1]

const MotionLink = motion.create(Link)

export default function Nav() {
  const pathname = usePathname()
  // Collections and single designs live under /templates/…, inside Occasions.
  const isCurrent = (href) =>
    !href.includes('#') &&
    (pathname === href || pathname.startsWith(href + '/') || (href === '/occasions' && pathname.startsWith('/templates/')))
  const [scrolled, setScrolled] = useState(false)
  const [solid, setSolid] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [open, setOpen] = useState(false)
  const toggle = useRef(null)
  const firstLink = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      setSolid(window.scrollY > window.innerHeight * 0.5)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // While the full-screen menu is open the page underneath stays still.
  useEffect(() => {
    if (!open) return
    const lenis = getLenis()
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth > 900 && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    const focus = setTimeout(() => firstLink.current?.focus({ preventScroll: true }), 350)
    const btn = toggle.current
    return () => {
      clearTimeout(focus)
      lenis?.start()
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      btn?.focus({ preventScroll: true })
    }
  }, [open])

  return (
    <>
    <motion.header
      className={`nav ${scrolled ? 'is-scrolled' : ''} ${solid ? 'is-solid' : ''} ${open ? 'is-open' : ''}`}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease }}
    >
      <div className="nav-bar">
        <Link href="/" className="brand" aria-label="Nimantran home">
          <span className="seal">N</span>
          <span className="wordmark">Nimantran</span>
        </Link>

        <nav className="nav-links" aria-label="Primary" onMouseLeave={() => setHovered(null)}>
          {LINKS.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={isCurrent(href) ? 'is-current' : undefined}
              aria-current={isCurrent(href) ? 'page' : undefined}
              onMouseEnter={() => setHovered(href)}
              onFocus={() => setHovered(href)}
            >
              {hovered === href && (
                <motion.span
                  className="nav-hover"
                  layoutId="nav-hover"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span className="nav-label">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <Link href="/#create" className="btn btn--primary btn--sm nav-cta">
            Create your invite
          </Link>
          <button
            ref={toggle}
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

    </motion.header>

    {/* Outside the header: its transform would otherwise trap a fixed overlay. */}
    <AnimatePresence>
      {open && (
        <motion.div
          id="nav-menu"
          className="menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.6, ease } }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.45, ease, delay: 0.1 } }}
        >
          <span className="menu-mark" aria-hidden="true">
            N
          </span>
          <motion.p
            className="eyebrow menu-eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            Menu
          </motion.p>
          <nav aria-label="Primary">
            <ul className="menu-links">
              {LINKS.map(([href, label, note], i) => (
                <li key={href}>
                  <MotionLink
                    ref={i === 0 ? firstLink : undefined}
                    href={href}
                    onClick={() => setOpen(false)}
                    initial={{ y: '110%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1, transition: { delay: 0.22 + i * 0.07, duration: 0.6, ease } }}
                    exit={{ y: '-40%', opacity: 0, transition: { duration: 0.2, delay: i * 0.03 } }}
                  >
                    <span className="menu-label">{label}</span>
                    <span className="menu-note">{note}</span>
                  </MotionLink>
                </li>
              ))}
            </ul>
          </nav>
          <motion.div
            className="menu-foot"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.5, ease } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <Link href="/#create" className="btn btn--primary" onClick={() => setOpen(false)}>
              Create your invite
            </Link>
            <p>Digital invitations for every celebration</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}
