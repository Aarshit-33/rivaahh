'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Reveal from './Reveal'
import { FAQ } from './content'

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section className="sec faq" id="questions" aria-labelledby="faq-title">
      <Reveal className="faq-head">
        <p className="eyebrow">Questions</p>
        <h2 className="display display--md" id="faq-title">
          Good questions
        </h2>
        <p className="sec-lede">Something else on your mind? Write to us — a person will reply.</p>
        <a href="/contact" className="btn btn--outline">
          Ask a question
        </a>
      </Reveal>

      <div className="faq-list">
        {FAQ.map(([q, a], i) => {
          const isOpen = open === i
          return (
            <div className={`faq-item ${isOpen ? 'is-open' : ''}`} key={q}>
              <h3>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                  {q}
                  <span className="faq-plus" aria-hidden="true" />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="faq-a"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p>{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
