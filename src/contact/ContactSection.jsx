'use client'

import { motion } from 'motion/react'
import Reveal from '../sections/Reveal'
import Envelope3D from './Envelope3D'
import { CHANNELS } from './info'
import './contact.css'

// End of the home page: a short "talk to us" with the 3D envelope opening on scroll.
export default function ContactSection() {
  return (
    <section className="sec csec" id="contact" aria-labelledby="csec-title">
      <Envelope3D mode="scroll" className="csec-env" />
      <div className="csec-copy">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h2 className="display display--md" id="csec-title">
            Still have a question?
          </h2>
          <p className="sec-lede">
            Tell us about your celebration — the occasion, the date, the look you have in mind. A person reads every
            message.
          </p>
        </Reveal>
        <ul className="csec-channels">
          {CHANNELS.map((c, i) => (
            <Reveal as="li" key={c.id} delay={0.08 * i}>
              <span className="csec-ch-label">{c.label}</span>
              {c.href ? (
                <a href={c.href} target="_blank" rel="noreferrer">
                  {c.value}
                </a>
              ) : (
                <span className="csec-ch-tbc">Shared at launch</span>
              )}
            </Reveal>
          ))}
        </ul>
        <Reveal delay={0.2}>
          <motion.a href="/contact" className="btn btn--primary" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            Write to us <span aria-hidden="true">→</span>
          </motion.a>
        </Reveal>
      </div>
    </section>
  )
}
