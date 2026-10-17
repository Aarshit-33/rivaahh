'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LANGUAGES } from '@/sections/content'
import { DIMS } from './filters'
import { useReducedMotion } from './hooks'
import { Arrow, Pen, Spark } from './Icons'
import s from './wall.module.css'
import ui from './ui.module.css'

function Slot({ tone = 'paper', caption, meta, children, label }) {
  return (
    <div className={s.interlude}>
      <section className={`${s.slot} ${tone === 'forest' ? s.slotForest : ''}`} aria-label={label}>
        {children}
      </section>
      <div className={s.slotMeta} aria-hidden="true">
        <p>{caption}</p>
        <span>{meta}</span>
      </div>
    </div>
  )
}

export function FinderSlot({ onOpen }) {
  return (
    <Slot caption="This or that" meta="Five quick pairs" label="Taste finder">
      <Spark className={s.slotSpark} />
      <h3 className={s.slotTitle}>
        Not sure what you <em>like?</em>
      </h3>
      <p className={s.slotText}>Pick between five pairs of designs and we’ll set the filters for you. Skip any pair.</p>
      <button type="button" className={`btn btn--primary btn--sm ${s.slotBtn}`} onClick={onOpen}>
        Try this or that
      </button>
    </Slot>
  )
}

export function NamesSlot({ onOpen }) {
  return (
    <Slot caption="Try your names" meta="Optional · stays on this device" label="Try your names">
      <Pen className={s.slotSpark} />
      <h3 className={s.slotTitle}>
        See these with your <em>names</em>
      </h3>
      <p className={s.slotText}>Type them once and every design on this page shows them, with your date.</p>
      <button type="button" className={`btn btn--outline btn--sm ${s.slotBtn}`} onClick={onOpen}>
        Try your names
      </button>
    </Slot>
  )
}

export function LanguageSlot() {
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setI((x) => (x + 1) % LANGUAGES.length), 2600)
    return () => clearInterval(id)
  }, [reduced])
  const l = LANGUAGES[i]
  return (
    <Slot
      tone="forest"
      caption="Any language"
      meta={LANGUAGES.map((x) => x.label).join(' · ')}
      label="Write it in any language"
    >
      <h3 className={s.slotTitle}>Write it in any language</h3>
      <div className={s.langStage} aria-live="off">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={l.id}
            lang={l.id}
            className={s.langCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={s.langEyebrow}>{l.eyebrow}</span>
            <span className={s.langTitle}>{l.title}</span>
            <span className={s.langMeta}>{l.meta}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <ul className={s.langList}>
        {LANGUAGES.map((x, j) => (
          <li key={x.id} lang={x.id}>
            <button type="button" className={j === i ? s.langOn : ''} aria-pressed={j === i} onClick={() => setI(j)}>
              {x.label}
            </button>
          </li>
        ))}
      </ul>
    </Slot>
  )
}

export function ColourSlot({ onPick, current, options = DIMS.colour.options }) {
  return (
    <Slot caption="Start from a colour" meta="Sets the colour filter" label="Start from a colour">
      <h3 className={s.slotTitle}>
        Start from a <em>colour</em>
      </h3>
      <ul className={s.swatchStack}>
        {options.map((o) => (
          <li key={o.slug}>
            <button
              type="button"
              className={s.swatchBtn}
              aria-pressed={current.includes(o.slug)}
              onClick={() => onPick(o.slug)}
            >
              <span className={`${ui.swatch} ${ui[`sw_${o.theme}`]} ${s.swatchBig}`} aria-hidden="true" />
              {o.label}
              <Arrow className={s.swatchArrow} />
            </button>
          </li>
        ))}
      </ul>
    </Slot>
  )
}
