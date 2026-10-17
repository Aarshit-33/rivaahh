'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Phone } from '@/components/props'
import InviteScreen from '@/components/invite/InviteScreen'
import { getTemplate } from '@/templates/data'
import Sheet from './Sheet'
import { TASTE_PAIRS } from './content'
import s from './explorer.module.css'
import ui from './ui.module.css'

const ease = [0.22, 1, 0.36, 1]

/** Turn the picks into one plain sentence and a filter patch. */
export function tasteResult(picks) {
  const chosen = picks.filter(Boolean)
  const words = [...new Set(chosen.map((c) => c.word))]
  const style = [...new Set(chosen.flatMap((c) => c.set.style || []))]
  const colour = [...new Set(chosen.flatMap((c) => c.set.colour || []))]
  const line = words.length
    ? `You lean ${words.slice(0, -1).join(', ')}${words.length > 1 ? ' and ' : ''}${words[words.length - 1]}.`
    : ''
  return { line, patch: { style, colour }, any: chosen.length > 0 }
}

/**
 * "This or that": five pairs of designs, side by side like two phones.
 * Nothing is scored in secret; the result simply sets the normal filters.
 */
export default function TasteFinder({ open, onClose, onApply, pairs = TASTE_PAIRS }) {
  const [step, setStep] = useState(0)
  const [picks, setPicks] = useState([])
  const done = step >= pairs.length
  const pair = pairs[step]
  const result = tasteResult(picks)

  const choose = (side) => {
    setPicks((p) => {
      const next = [...p]
      next[step] = side
      return next
    })
    setStep((x) => x + 1)
  }

  const reset = () => {
    setStep(0)
    setPicks([])
  }

  const close = () => {
    onClose()
    setTimeout(reset, 400)
  }

  return (
    <Sheet open={open} onClose={close} title="Which feels more like your celebration?" size="lg">
      <div className={s.finderTop}>
        <ol className={s.dots} aria-label={`Pair ${Math.min(step + 1, pairs.length)} of ${pairs.length}`}>
          {pairs.map((p, i) => (
            <li key={p.q} className={i < step ? s.dotDone : i === step ? s.dotNow : ''} />
          ))}
        </ol>
        {!done && <p className={s.finderQ}>{pair.q}</p>}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {!done ? (
          <motion.div
            key={step}
            className={s.pair}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease }}
          >
            {[pair.a, pair.b].map((side) => {
              const t = getTemplate(side.template)
              return (
                <button key={side.label} type="button" className={s.pairBtn} onClick={() => choose(side)}>
                  <span className={s.pairPhone}>
                    <Phone>
                      <InviteScreen template={t} poster inert />
                    </Phone>
                  </span>
                  <span className={s.pairLabel}>{side.label}</span>
                </button>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            className={s.finderResult}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            {result.any ? (
              <>
                <p className={s.finderLine}>{result.line}</p>
                <p className={s.finderSub}>
                  We’ll set the style and colour questions to match. You can change or undo them in the filter line.
                </p>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => {
                    onApply(result)
                    close()
                  }}
                >
                  Show me these designs
                </button>
              </>
            ) : (
              <>
                <p className={s.finderLine}>No picks this time, and that’s fine.</p>
                <p className={s.finderSub}>Every design is still on the wall. Scroll, or try the pairs again.</p>
                <button type="button" className="btn btn--outline" onClick={reset}>
                  Start again
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!done && (
        <div className={s.finderFoot}>
          {step > 0 ? (
            <button type="button" className={ui.textBtn} onClick={() => setStep((x) => x - 1)}>
              Back
            </button>
          ) : (
            <span />
          )}
          <button type="button" className={ui.textBtn} onClick={() => choose(null)}>
            Skip
          </button>
        </div>
      )}
    </Sheet>
  )
}
