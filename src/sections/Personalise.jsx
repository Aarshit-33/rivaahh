'use client'

import { motion } from 'motion/react'
import Reveal from './Reveal'
import { STEPS, THEMES } from './content'
import { useDevice } from '../device/DeviceContext'

export default function Personalise() {
  // The preview is the hero's own phone (see device/Device.jsx); this form
  // only writes into it.
  const { make, setMake } = useDevice()
  const { names, date, city, theme } = make
  const update = (key) => (value) => setMake((m) => ({ ...m, [key]: value }))
  const setNames = update('names')
  const setDate = update('date')
  const setCity = update('city')
  const setTheme = update('theme')

  return (
    <section className="sec make" id="create" aria-labelledby="make-title">
      <div className="make-inner">
        <div className="make-form">
          <Reveal>
            <p className="eyebrow eyebrow--light">Make it yours</p>
            <h2 className="display display--md display--light" id="make-title">
              Try it in a minute
            </h2>
            <p className="sec-lede sec-lede--light">Type your details and watch the invitation write itself.</p>
          </Reveal>

          <Reveal delay={0.1}>
            <form className="make-fields" onSubmit={(e) => e.preventDefault()}>
              <label>
                <span>Whose celebration?</span>
                <input
                  value={names}
                  onChange={(e) => setNames(e.target.value)}
                  placeholder="e.g. Aarav turns 5, or Riya & Arjun"
                  maxLength={40}
                />
              </label>
              <div className="make-row">
                <label>
                  <span>Date</span>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </label>
                <label>
                  <span>City</span>
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Pune" maxLength={24} />
                </label>
              </div>
              <fieldset>
                <legend>Look</legend>
                <div className="swatches">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`swatch swatch--${t.id} ${theme === t.id ? 'is-active' : ''}`}
                      onClick={() => setTheme(t.id)}
                      aria-pressed={theme === t.id}
                    >
                      <span className="swatch-dot" aria-hidden="true" />
                      {t.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <motion.a href="/occasions" className="btn btn--light" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                Continue with this design
              </motion.a>
              {/* TODO(launch): connect to sign-up so these details carry over. */}
            </form>
          </Reveal>

          <ol className="make-steps">
            {STEPS.map((s, i) => (
              <li key={s}>
                <span>{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>

        <div className="make-preview">
          <span className="make-outline" aria-hidden="true">
            Yours
          </span>
          <div className="make-anchor" data-device-anchor="make" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
