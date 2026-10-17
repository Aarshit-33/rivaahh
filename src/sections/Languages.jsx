'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import InviteArt from './InviteArt'
import Reveal from './Reveal'
import { GUEST_POINTS, LANGUAGES } from './content'

export default function Languages() {
  const [lang, setLang] = useState(LANGUAGES[1])
  const [large, setLarge] = useState(false)

  return (
    <section className="sec lang" aria-labelledby="lang-title">
      <div className="lang-copy">
        <Reveal>
          <p className="eyebrow">Made for every guest</p>
          <h2 className="display display--md" id="lang-title">
            Easy for Dadi, too
          </h2>
          <p className="sec-lede">
            Your guests range from five to ninety. The invitation should work for all of them.
          </p>
        </Reveal>
        <ul className="lang-points">
          {GUEST_POINTS.map(([title, body], i) => (
            <Reveal as="li" key={title} delay={0.08 * i}>
              <strong>{title}</strong>
              <span>{body}</span>
            </Reveal>
          ))}
        </ul>
      </div>

      <div className="lang-demo">
        <div className="chips chips--scroll lang-tabs" role="tablist" aria-label="Example language">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              type="button"
              role="tab"
              aria-selected={lang.id === l.id}
              className={`chip ${lang.id === l.id ? 'is-active' : ''}`}
              onClick={() => setLang(l)}
            >
              {lang.id === l.id && <motion.span className="chip-bg" layoutId="lang-chip" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <span className="chip-label">{l.label}</span>
            </button>
          ))}
        </div>

        <div className={`lang-card ${large ? 'is-large' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={lang.id}
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
              transition={{ duration: 0.35 }}
            >
              <InviteArt theme="ivory" motif="toran" eyebrow={lang.eyebrow} title={lang.title} meta={lang.meta} />
            </motion.div>
          </AnimatePresence>
          <div className="lang-rsvp">
            <span>✓</span>
          </div>
        </div>

        <label className="toggle">
          <input type="checkbox" checked={large} onChange={(e) => setLarge(e.target.checked)} />
          <span className="toggle-track" aria-hidden="true">
            <span className="toggle-thumb" />
          </span>
          Large text
        </label>
      </div>
    </section>
  )
}
