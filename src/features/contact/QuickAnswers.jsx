'use client'

import { useId, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { QUICK_ANSWERS } from './data'
import s from './QuickAnswers.module.css'

const ease = [0.22, 1, 0.36, 1]

/** The accordion half of "Before you write". Rows open one at a time. */
export default function QuickAnswers() {
  const [open, setOpen] = useState(-1)
  const base = useId()

  return (
    <MotionConfig reducedMotion="user">
      <div className={s.list}>
        {QUICK_ANSWERS.map(([q, a], i) => {
          const isOpen = open === i
          const id = `${base}-${i}`
          return (
            <div className={`${s.item} ${isOpen ? s.isOpen : ''}`} key={q}>
              <h3 className={s.q}>
                <button
                  type="button"
                  id={`${id}-q`}
                  aria-expanded={isOpen}
                  aria-controls={`${id}-a`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{q}</span>
                  <span className={s.plus} aria-hidden="true" />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`${id}-a`}
                    role="region"
                    aria-labelledby={`${id}-q`}
                    className={s.a}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <p>{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </MotionConfig>
  )
}
