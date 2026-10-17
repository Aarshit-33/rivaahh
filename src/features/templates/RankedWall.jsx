'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import ReelCard from '@/components/invite/ReelCard'
import { TEMPLATES } from '@/templates/data'
import { usePersonal } from '@/lib/stores'
import { OCCASION_WALL, activeDims, optionOf, relaxOptions, serializeFilters } from './filters'
import { useReducedMotion } from './hooks'
import { ColourSlot, FinderSlot, LanguageSlot, NamesSlot } from './Interludes'
import { Arrow } from './Icons'
import s from './wall.module.css'

const ease = [0.22, 1, 0.36, 1]
const COUNT_WORDS = ['', 'that', 'both', 'all three', 'all four', 'all five', 'all six']

/**
 * Where interludes go: after 7 designs, then after every 12 more. A short
 * wall (a small category) gets a single one, a little before its end.
 */
const firstSlot = (total) => (total >= 10 ? 7 : Math.max(3, total - 2))
const slotAfter = (n, total) => {
  const first = firstSlot(total)
  return n === first || (total >= 10 && n > first && (n - first) % 12 === 0)
}

/**
 * One ranked, staggered wall: matches first (best first), the rest behind
 * "N others don't match · Show them". Cards glide to their new places when
 * the filters change (FLIP via motion's layout animation).
 */
export default function RankedWall({
  filters: f,
  setFilters: set,
  matches,
  others,
  onOpenFinder,
  onOpenNames,
  // Optional, for one occasion's page:
  base = TEMPLATES, // the designs the relax-a-filter counts are taken from
  showBanner = true, // the "Only looking at weddings?" banner
  allLabel = 'Show every design',
  colourOptions, // colours offered by the "Start from a colour" slot
}) {
  const reduced = useReducedMotion()
  const personal = usePersonal()
  const [showOthers, setShowOthers] = useState(false)
  const dims = activeDims(f)

  // The interludes, in the order they appear; "your names" only until used.
  const interludes = useMemo(() => {
    const list = [
      ['finder', <FinderSlot key="finder" onOpen={onOpenFinder} />],
      ...(personal.active ? [] : [['names', <NamesSlot key="names" onOpen={onOpenNames} />]]),
      ['language', <LanguageSlot key="language" />],
      [
        'colour',
        <ColourSlot
          key="colour"
          current={f.colour}
          options={colourOptions}
          onPick={(slug) => set((p) => ({ ...p, colour: [slug] }))}
        />,
      ],
    ]
    return list
  }, [personal.active, onOpenFinder, onOpenNames, f.colour, set, colourOptions])

  const items = useMemo(() => {
    const out = []
    let cards = 0
    let next = 0
    const shown = [
      ...matches.map((m, i) => ({ ...m, best: i === 0 && f.sort === 'best' && dims.length > 0 })),
      ...(showOthers ? others.map((o) => ({ ...o, dim: true })) : []),
    ]
    shown.forEach((m, i) => {
      out.push({ key: m.t.id, card: m })
      cards += 1
      if (slotAfter(cards, shown.length) && i < shown.length - 1 && next < interludes.length) {
        out.push({ key: interludes[next][0], node: interludes[next][1] })
        next += 1
      }
    })
    return out
  }, [matches, others, showOthers, interludes, f.sort, dims.length])

  const single = showBanner && f.occasion.length === 1 ? optionOf('occasion', f.occasion[0]) : null
  const categoryQuery = serializeFilters({ ...f, occasion: [] }, OCCASION_WALL)

  if (!matches.length) {
    const relax = relaxOptions(base, f)
    const closest = others.slice(0, 6)
    return (
      <div className={s.empty}>
        <h2 className={s.emptyTitle}>
          Nothing fits {COUNT_WORDS[dims.length] || 'all of these'} just <em>yet.</em>
        </h2>
        <p className={s.emptyText}>Loosen one question and the wall fills again. These are the nearest ways back:</p>
        <p className={s.emptyText}>
          Planning something special? <Link href="/contact?topic=bespoke">Tell us about your event</Link> and we’ll
          draft a custom invitation for you.
        </p>
        <ul className={s.relax}>
          {relax.map((r) => (
            <li key={r.key}>
              <button type="button" className={s.relaxChip} onClick={() => set(r.next)}>
                Drop ‘{r.label}’ <span>· {r.count === 1 ? '1 design' : `${r.count} designs`}</span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className={`${s.relaxChip} ${s.relaxAll}`}
              onClick={() =>
                set((p) => ({ ...p, occasion: [], format: 'all', tradition: [], style: [], colour: [], motif: [] }))
              }
            >
              {allLabel}
            </button>
          </li>
        </ul>
        {closest.length > 0 && (
          <>
            <h3 className={s.closestTitle}>The closest matches</h3>
            <ul className={`${s.wall} ${s.wallFlat}`}>
              {closest.map((m) => (
                <li key={m.t.id} className={s.cell}>
                  <div className={s.cellInner}>
                    <ReelCard template={m.t} why={m.why.length ? m.why : undefined} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    )
  }

  return (
    <div className={s.wallWrap}>
      {single && (
        <p className={s.banner}>
          <span>
            Only looking at{' '}
            <em>{single.plural.toLowerCase() === 'griha pravesh' ? 'Griha Pravesh' : single.plural.toLowerCase()}?</em>
          </span>
          <Link
            href={`/templates/category/${single.slug}${categoryQuery ? `?${categoryQuery}` : ''}`}
            className={s.bannerLink}
          >
            Open the {single.label === 'Pooja & festivals' ? 'pooja & festival' : single.label.toLowerCase()} page
            <Arrow />
          </Link>
        </p>
      )}

      <ul className={s.wall} aria-label={dims.length ? 'Designs, best match first' : 'Designs, featured first'}>
        {items.map((it, i) => (
          <motion.li
            key={it.key}
            className={s.cell}
            layout={reduced ? false : 'position'}
            transition={{ layout: { duration: 0.5, ease, delay: Math.min(i, 24) * 0.02 } }}
          >
            <div className={s.cellInner}>
              {it.card ? (
                <ReelCard
                  template={it.card.t}
                  why={it.card.why.length ? it.card.why : undefined}
                  bestMatch={it.card.best}
                  dim={it.card.dim}
                  priority={i < 6}
                />
              ) : (
                it.node
              )}
            </div>
          </motion.li>
        ))}
      </ul>

      {others.length > 0 && (
        <div className={s.others}>
          <span className={s.othersRule} aria-hidden="true" />
          <p>
            {showOthers
              ? `Showing ${others.length} that don’t match, faded.`
              : `${others.length === 1 ? '1 other doesn’t' : `${others.length} others don’t`} match.`}{' '}
            <button
              type="button"
              className={s.othersBtn}
              aria-expanded={showOthers}
              onClick={() => setShowOthers((v) => !v)}
            >
              {showOthers ? 'Hide them' : 'Show them'}
            </button>
          </p>
        </div>
      )}
    </div>
  )
}
