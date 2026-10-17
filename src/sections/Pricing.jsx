'use client'

import { motion } from 'motion/react'
import Reveal from './Reveal'
import { PLANS } from './content'

export default function Pricing() {
  return (
    <section className="sec price" id="pricing" aria-labelledby="price-title">
      <Reveal className="price-head">
        <p className="eyebrow">Pricing</p>
        <h2 className="display display--md" id="price-title">
          Pick your celebration
        </h2>
        <p className="sec-lede">One price per celebration — no subscriptions. Prices are announced at launch.</p>
      </Reveal>

      <div className="tickets">
        {PLANS.map((p, i) => (
          <Reveal key={p.id} delay={0.08 * i} className={`ticket-wrap ${p.featured ? 'is-featured' : ''}`}>
            <motion.article className="ticket" whileHover={{ y: -8, rotate: p.featured ? -1 : 0.6 }} transition={{ duration: 0.3 }}>
              <div className="ticket-stub">
                <p className="ticket-for">{p.for}</p>
                <h3>{p.name}</h3>
                {/* TODO(launch): show the real price once set. */}
                <p className="ticket-price">{p.price ?? 'Price at launch'}</p>
              </div>
              <div className="ticket-tear" aria-hidden="true" />
              <ul>
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a href="#create" className={`btn ${p.featured ? 'btn--primary' : 'btn--outline'}`}>
                Start with {p.name}
              </a>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
