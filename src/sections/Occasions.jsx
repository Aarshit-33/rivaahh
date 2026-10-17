'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import InviteArt from './InviteArt'
import Reveal from './Reveal'
import OccasionBackdrop from './OccasionBackdrop'
import { OCCASIONS } from './content'
import { occasionByLabel } from '../templates/data'

const ease = [0.22, 1, 0.36, 1]
// Resting pose of each card in the fan: back-left, back-right, front.
const FAN = [
  { x: '-34%', y: 18, rotate: -9, z: 1 },
  { x: '34%', y: 12, rotate: 8, z: 2 },
  { x: '0%', y: 0, rotate: -1.5, z: 3 },
]

export default function Occasions() {
  const [active, setActive] = useState(0)
  const occasion = OCCASIONS[active]

  return (
    <section className={`sec occ occ--${occasion.id}`} id="occasions" aria-labelledby="occ-title">
      <OccasionBackdrop id={occasion.id} />
      <div className="occ-copy">
        <Reveal>
          <p className="eyebrow">Occasions</p>
          <h2 className="display display--md" id="occ-title">
            What are we celebrating?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="chips" role="tablist" aria-label="Occasion">
            {OCCASIONS.map((o, i) => (
              <button
                key={o.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`chip ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                {i === active && <motion.span className="chip-bg" layoutId="occ-chip" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span className="chip-label">{o.label}</span>
              </button>
            ))}
          </div>
        </Reveal>
        <AnimatePresence mode="wait">
          <motion.p
            key={occasion.id}
            className="sec-lede"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {occasion.line}
          </motion.p>
        </AnimatePresence>
        <p className="occ-hint">Tap an occasion — the cards reshuffle.</p>
        <div className="occ-actions">
          <a href={`/templates/category/${occasionByLabel(occasion.label)?.slug}`} className="btn btn--primary">
            Designs for {occasion.label}
          </a>
          <a href="/occasions" className="btn btn--text">
            Explore all occasions →
          </a>
        </div>
      </div>

      <div className="occ-stage" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {occasion.cards.map((card, i) => (
            <motion.div
              key={`${occasion.id}-${i}`}
              className="occ-card"
              style={{ zIndex: FAN[i].z }}
              initial={{ opacity: 0, y: 120, rotate: FAN[i].rotate * 2, x: FAN[i].x, scale: 0.9 }}
              animate={{
                opacity: 1,
                y: FAN[i].y,
                rotate: FAN[i].rotate,
                x: FAN[i].x,
                scale: 1,
                transition: { delay: 0.08 * i, duration: 0.7, ease },
              }}
              exit={{ opacity: 0, y: -60, rotate: FAN[i].rotate - 12, scale: 0.92, transition: { duration: 0.35, ease } }}
              whileHover={{ y: FAN[i].y - 14, rotate: FAN[i].rotate * 0.6, transition: { duration: 0.3 } }}
            >
              <InviteArt {...card} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}
