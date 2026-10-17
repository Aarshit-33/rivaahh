'use client'

import { motion } from 'motion/react'
import Reveal from './Reveal'
import { COMPARE_COLUMNS, COMPARE_ROWS } from './content'

function Mark({ yes, i }) {
  return (
    <svg className={`cmp-mark ${yes ? 'is-yes' : 'is-no'}`} viewBox="0 0 24 24" aria-label={yes ? 'Yes' : 'No'} role="img">
      <motion.path
        d={yes ? 'M5 12.5 9.5 17 19 7' : 'M7 7l10 10M17 7 7 17'}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 + i * 0.07 }}
      />
    </svg>
  )
}

export default function Compare() {
  return (
    <section className="sec cmp" aria-labelledby="cmp-title">
      <Reveal className="cmp-head">
        <p className="eyebrow">Why switch</p>
        <h2 className="display display--md" id="cmp-title">
          A card, a forward, or an invitation
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="cmp-table" role="table" aria-label="How the three ways of inviting compare">
          <div className="cmp-row cmp-row--head" role="row">
            <span role="columnheader" className="cmp-q" />
            {COMPARE_COLUMNS.map((c, i) => (
              <span role="columnheader" key={c} className={i === 2 ? 'cmp-ours' : undefined}>
                {c}
              </span>
            ))}
          </div>
          {COMPARE_ROWS.map(([label, ...vals], r) => (
            <div className="cmp-row" role="row" key={label}>
              <span role="rowheader" className="cmp-q">
                {label}
              </span>
              {vals.map((v, c) => (
                <span role="cell" key={c} className={c === 2 ? 'cmp-ours' : undefined}>
                  <Mark yes={v} i={r} />
                </span>
              ))}
            </div>
          ))}
          <div className="cmp-ours-card" aria-hidden="true" />
        </div>
      </Reveal>
    </section>
  )
}
