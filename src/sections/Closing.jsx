'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import Reveal from './Reveal'
import { FOOTER_COLUMNS } from './content'
import { occasionByLabel } from '@/templates/data'

const PRODUCT_LINKS = { 'How it works': '/#how', 'All occasions': '/occasions', Pricing: '/#pricing', Questions: '/#questions' }
const COMPANY_LINKS = { About: '/about', Contact: '/contact', Privacy: '/privacy', Terms: '/terms' }
const linkFor = (column, label) => {
  if (column === 'Occasions') return `/templates/category/${occasionByLabel(label)?.slug ?? ''}`
  if (column === 'Company') return COMPANY_LINKS[label]
  return PRODUCT_LINKS[label]
}

export function ClosingCta() {
  return (
    <section className="closing" aria-labelledby="closing-title">
      <Reveal className="closing-inner">
        <span className="seal seal--lg">N</span>
        <p className="eyebrow">For every celebration</p>
        <h2 className="display display--md" id="closing-title">
          Your celebration deserves an heirloom
        </h2>
        <p className="sec-lede">
          Birthdays, housewarmings, weddings, baby showers, anniversaries and poojas — made with care, sent in one link.
        </p>
        <div className="actions actions--center">
          <motion.a href="#create" className="btn btn--primary" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            Create your invite
          </motion.a>
          <a href="/occasions" className="btn btn--text">
            Explore all templates
          </a>
        </div>
      </Reveal>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="sf-top">
        <div className="sf-brand">
          <Link href="/" className="brand">
            <span className="seal">N</span>
            <span className="wordmark">Nimantran</span>
          </Link>
          <p>Digital invitations for every celebration — from a first birthday to a golden anniversary.</p>
          <p className="sf-note">Made for the phone · Opens on WhatsApp · Any language</p>
        </div>
        {FOOTER_COLUMNS.map(([title, links]) => (
          <nav key={title} aria-label={title}>
            <h3>{title}</h3>
            <ul>
              {links.map((l) => (
                <li key={l}>
                  <Link href={linkFor(title, l)}>{l}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="sf-bottom">
        <span>© 2026 Nimantran · Made in India</span>
        <span className="sf-legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href="#main">Back to top ↑</a>
        </span>
      </div>
    </footer>
  )
}
