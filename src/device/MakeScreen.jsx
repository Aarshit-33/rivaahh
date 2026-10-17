'use client'

import { AnimatePresence, motion } from 'motion/react'
import InviteArt from '../sections/InviteArt'

const formatDate = (value) => {
  if (!value) return 'Pick a date'
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
}

// What the shared phone shows while it sits in "Make it yours": the visitor's
// own invitation, written as they type.
export default function MakeScreen({ make }) {
  const title = make.names.trim() || 'Your names here'
  const meta = [formatDate(make.date), make.city.trim() || 'Your city'].join(' · ')

  return (
    <div className="lp-content dv-make">
      <AnimatePresence mode="wait">
        <motion.div
          key={make.theme}
          className="dv-make-card"
          initial={{ opacity: 0, rotateY: -70 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: 70 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <InviteArt theme={make.theme} motif="arch" eyebrow="You are invited" title={title} meta={meta} />
        </motion.div>
      </AnimatePresence>
      <div className="make-rsvp">
        <span>RSVP</span>
        <span>Directions</span>
      </div>
    </div>
  )
}
