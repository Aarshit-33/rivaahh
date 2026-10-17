'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'motion/react'
import TasteFinder from '@/features/templates/TasteFinder'
import ShortlistTray from '@/features/templates/ShortlistTray'
import { useSearch, useUrlFilters } from '@/features/templates/hooks'
import { TEMPLATES, getTemplate } from '@/templates/data'
import { useKept } from '@/lib/stores'
import { WaxSeal } from '@/components/props'
import QuestionBar from './QuestionBar'
import CategoryCard from './CategoryCard'
import {
  BESPOKE,
  CATEGORIES,
  NARROW_DEFAULTS,
  STATIONERY,
  SWATCHES,
  TOTAL,
  fits,
  isNarrowed,
  relaxSuggestions,
} from './data'
import s from './landing.module.css'

// The pieces on the table, in their resting order, and the places they take.
const ORDER = ['wedding', 'griha-pravesh', 'pooja-festivals', 'anniversary', 'baby-shower', 'bespoke', 'birthday']
const PLACES = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7']
// Which slip follows which place (by index), as in the Stitch spread.
const SLIP_AFTER = { 1: 'taste', 3: 'lang', 5: 'quote', 6: 'hue' }

/* ───────── Interludes (the slips between the cards) ───────── */

function TasteSlip({ onOpen }) {
  return (
    <aside className={`${s.slot} ${s.slotTaste}`} aria-labelledby="taste-title">
      <div>
        <p className={s.slotTag}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M15.5 8.5l-2 5-5 2 2-5z" strokeLinejoin="round" />
          </svg>
          Taste finder
        </p>
        <h2 id="taste-title" className={s.slotTitle}>
          Not sure what you like?
        </h2>
        <p className={s.slotText}>
          Pick between five pairs of designs and we’ll open the collection that suits you, with your answers already
          set.
        </p>
      </div>
      <button type="button" className={s.slotBtn} onClick={onOpen}>
        <span>Try it now</span>
        <span aria-hidden="true">→</span>
      </button>
    </aside>
  )
}

function LanguageSlip() {
  return (
    <aside className={`${s.slot} ${s.slotLang}`} aria-labelledby="lang-title">
      <p className={s.slotTag}>Language reassurance</p>
      <h2 id="lang-title" className={s.slotTitle}>
        Write yours in any Indian script.
      </h2>
      <p className={s.slotScripts}>English • हिंदी • ગુજરાતી • मराठी • தமிழ் • বাংলা • ਪੰਜਾਬੀ</p>
      <p className={s.slotText}>
        Every design takes your words as you type them, the way your family speaks: names, shlokas, blessings and the
        order of functions.
      </p>
    </aside>
  )
}

function QuoteSlip() {
  return (
    <aside className={`${s.slot} ${s.slotQuote}`} aria-label="The host’s craft">
      <p className={s.slotTagLight}>The host’s craft</p>
      <p className={s.slotQuoteText}>“✦ A good invitation sounds unmistakably like the person sending it.”</p>
      <p className={s.slotTextLight}>
        Every Nimantran design leaves room for RSVP notes, a page for each function, directions to the venue and
        music for reels — without visual clutter.
      </p>
    </aside>
  )
}

function HueSlip({ f, set }) {
  const toggle = (slug) =>
    set((p) => ({ ...p, colour: p.colour.includes(slug) ? p.colour.filter((x) => x !== slug) : [...p.colour, slug] }))
  return (
    <aside className={`${s.slot} ${s.slotHue}`} aria-labelledby="hue-title">
      <div>
        <p className={s.slotTag}>Curation by hue</p>
        <h2 id="hue-title" className={s.slotTitle}>
          Start directly from a celebration colour?
        </h2>
      </div>
      <ul className={s.hues}>
        {SWATCHES.map((sw) => {
          const on = f.colour.includes(sw.slug)
          return (
            <li key={sw.slug}>
              <button
                type="button"
                className={`${s.hue} ${s[`hue_${sw.theme}`]} ${on ? s.hueOn : ''}`}
                aria-pressed={on}
                aria-label={`${sw.label}, ${sw.count} designs`}
                title={`${sw.label} · ${sw.count} designs`}
                onClick={() => toggle(sw.slug)}
              />
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

/* ───────── Nothing fits: the closest ways back, or a custom design ───────── */

function NoMatch({ f, set }) {
  const relax = relaxSuggestions(f)
  return (
    <div className={s.noMatch} role="status">
      <WaxSeal size="md" />
      <div className={s.noMatchCopy}>
        <h2 className={s.noMatchTitle}>
          No templates fit these answers <em>yet.</em>
        </h2>
        <p className={s.noMatchText}>
          Tell us about your special event and we’ll draft a custom invitation for you — in your colours, your
          language and your traditions.
        </p>
        <div className={s.noMatchActions}>
          <Link href="/contact?topic=bespoke" className="btn btn--primary btn--sm">
            Ask for a custom design
          </Link>
          {relax.map((r) => (
            <button key={r.dim} type="button" className={s.relaxChip} onClick={() => set(r.next)}>
              Drop ‘{r.label}’ <span>· {r.count === 1 ? '1 design' : `${r.count} designs`}</span>
            </button>
          ))}
          <button type="button" className={s.relaxChip} onClick={() => set(NARROW_DEFAULTS)}>
            Show every collection
          </button>
        </div>
      </div>
    </div>
  )
}

/* ───────── "Set aside for now" ───────── */

function SetAside({ shared }) {
  const kept = useKept()
  const [open, setOpen] = useState(false)
  const keptList = kept.ids.map(getTemplate).filter(Boolean)
  const sharedList = shared.map(getTemplate).filter(Boolean)

  const designs = sharedList.length ? sharedList : keptList
  const total = designs.length
  if (!total) return null

  const title = sharedList.length
    ? `Shared with you (${sharedList.length} ${sharedList.length === 1 ? 'design' : 'designs'})`
    : `Set aside for now (${total} ${total === 1 ? 'design' : 'designs'})`

  return (
    <section className={s.aside} aria-labelledby="aside-title">
      <div className={s.asideHead}>
        <h2 id="aside-title" className={s.asideTitle}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M3.5 7h17v3h-17zM5 10v9h14v-9M10 13.5h4" strokeLinejoin="round" />
          </svg>
          {title}
        </h2>
        <div className={s.asideActions}>
          {sharedList.length > 0 && !sharedList.every((t) => kept.has(t.id)) && (
            <button
              type="button"
              className={s.asideToggle}
              onClick={() => kept.set([...new Set([...kept.ids, ...sharedList.map((t) => t.id)])])}
            >
              Keep these too
            </button>
          )}
          <button type="button" className={s.asideToggle} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? 'Hide them ▴' : 'Show them ▾'}
          </button>
        </div>
      </div>
      <ul className={`${s.asideGrid} ${open ? s.asideOpen : ''}`}>
        {designs.map((t) => (
          <li key={t.id}>
            <Link href={`/templates/${t.id}`} className={s.asideItem} tabIndex={open ? undefined : -1}>
              <span className={s.asideEyebrow}>
                {t.occasions[0]} • {t.format === 'reel' ? `Reel ${t.duration}` : 'Card'}
              </span>
              <span className={s.asideName}>{t.name}</span>
              <span className={s.asideDesc}>{t.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ───────── The page body ───────── */

export default function Landing() {
  const search = useSearch()
  const [f, set] = useUrlFilters(NARROW_DEFAULTS)
  const [finder, setFinder] = useState(false)

  const shared = useMemo(() => {
    const raw = new URLSearchParams(search).get('kept')
    return raw ? raw.split(',').filter((id) => getTemplate(id)) : []
  }, [search])

  const count = useMemo(() => TEMPLATES.filter((t) => fits(t, f)).length, [f])
  // A collection fits when its own occasion is chosen (or none is) and some
  // of its designs fit the other answers.
  const perCategory = useMemo(() => {
    const rest = { ...f, occasion: [] }
    return Object.fromEntries(
      CATEGORIES.map((c) => [
        c.slug,
        f.occasion.length && !f.occasion.includes(c.slug) ? 0 : c.ids.map(getTemplate).filter((t) => fits(t, rest)).length,
      ]),
    )
  }, [f])

  // The taste finder sets the answers here; the cards that fit move up.
  const applyTaste = (result) => set((p) => ({ ...p, style: result.patch.style, colour: result.patch.colour }))

  const narrowed = isNarrowed(f)
  // Collections that fit move up and take the spread's places in order;
  // the ones with nothing that fits move down below it.
  const fitting = narrowed ? ORDER.filter((k) => k === 'bespoke' || perCategory[k] > 0) : ORDER
  const below = narrowed ? ORDER.filter((k) => k !== 'bespoke' && perCategory[k] === 0) : []

  const renderCard = (key, className) => {
    if (key === 'bespoke')
      return <CategoryCard key={key} layoutId={key} item={BESPOKE} href={BESPOKE.href} label={BESPOKE.label} className={className} />
    const c = CATEGORIES.find((x) => x.slug === key)
    return <CategoryCard key={key} layoutId={key} c={c} item={STATIONERY[key]} f={f} matched={perCategory[key]} className={className} />
  }

  const slips = {
    taste: <TasteSlip key="taste" onOpen={() => setFinder(true)} />,
    lang: <LanguageSlip key="lang" />,
    quote: <QuoteSlip key="quote" />,
    hue: <HueSlip key="hue" f={f} set={set} />,
  }
  // Cards fill the places p1…p7; each slip sits after the card it always
  // follows, and any slip whose card moved away closes the spread.
  const spread = []
  fitting.forEach((key, i) => {
    spread.push(renderCard(key, s[PLACES[i]]))
    const slip = SLIP_AFTER[i]
    if (slip) spread.push(slips[slip])
  })
  Object.entries(SLIP_AFTER)
    .filter(([i]) => Number(i) >= fitting.length)
    .forEach(([, slip]) => spread.push(slips[slip]))

  const fitWord = fitting.filter((k) => k !== 'bespoke').length

  return (
    <MotionConfig reducedMotion="user">
      <QuestionBar filters={f} setFilters={set} count={count} total={TOTAL} />

      <section className={s.table} aria-labelledby="table-title">
        <h2 id="table-title" className="sr-only">
          Collections by occasion
        </h2>
        <p className="sr-only" aria-live="polite">
          {narrowed
            ? `${fitWord} of ${CATEGORIES.length} collections fit your answers${below.length ? `, ${below.length} moved below` : ''}.`
            : ''}
        </p>

        {narrowed && count === 0 && <NoMatch f={f} set={set} />}

        <LayoutGroup>
          <div className={s.spread}>{spread}</div>

          <AnimatePresence>
            {below.length > 0 && (
              <motion.section
                key="below"
                className={s.below}
                aria-labelledby="below-title"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={s.belowHead}>
                  <div>
                    <h2 id="below-title" className={s.belowTitle}>
                      Not a fit for these answers <span>({below.length})</span>
                    </h2>
                    <p className={s.belowText}>
                      None of their designs match your choices yet. Open one to see everything it has, or clear the
                      answers to bring them back up.
                    </p>
                  </div>
                  <button type="button" className={s.asideToggle} onClick={() => set(NARROW_DEFAULTS)}>
                    Clear answers
                  </button>
                </div>
                <div className={s.belowGrid}>{below.map((key) => renderCard(key, s.belowCard))}</div>
              </motion.section>
            )}
          </AnimatePresence>
        </LayoutGroup>

        <SetAside shared={shared} />
      </section>

      <ShortlistTray />
      <TasteFinder open={finder} onClose={() => setFinder(false)} onApply={applyTaste} />
    </MotionConfig>
  )
}
