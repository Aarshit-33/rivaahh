'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { OCCASIONS_META, occasionBySlug, templatesFor } from '@/templates/data'
import { useKept, usePersonal } from '@/lib/stores'
import { DIMS, OCCASION_WALL, countMatches, isFiltered, rank, scopedPairs, serializeFilters } from './filters'
import { usePhone, useReturning, useUrlFilters } from './hooks'
import { TASTE_PAIRS } from './content'
import FanOpening from './FanOpening'
import QuestionLine from './QuestionLine'
import RankedWall from './RankedWall'
import SharedShortlist from './SharedShortlist'
import ShortlistTray from './ShortlistTray'
import TasteFinder from './TasteFinder'
import NamesForm from './NamesForm'
import Sheet from './Sheet'
import s from './explorer.module.css'

/** How an occasion reads inside a sentence: "wedding", "Griha Pravesh". */
export const occasionNoun = (o) =>
  o.slug === 'griha-pravesh'
    ? 'Griha Pravesh'
    : o.slug === 'pooja-festivals'
      ? 'pooja & festival'
      : o.label.toLowerCase()

/** This occasion's designs: made for it first, then featured, then the rest. */
function designsFor(o) {
  return templatesFor(o.label)
    .map((t, i) => ({ t, i, s: (t.occasions[0] === o.label ? 2 : 0) + (t.featured ? 1 : 0) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map(({ t }) => t)
}

/** Five designs for the fan, a reel in the middle. */
function fanIds(list) {
  const centre = list.find((t) => t.format === 'reel') || list[0]
  const rest = list.filter((t) => t !== centre).slice(0, 4)
  const order = [rest[1], rest[0], centre, rest[2], rest[3]].filter(Boolean)
  return order.map((t) => t.id)
}

/**
 * One occasion's page as a Reel Wall: the fan of this occasion's designs, the
 * question line without the occasion blank, every design in a staggered wall
 * (ranked once a filter is set), the shortlist tray and the optional extras.
 * Filters live in the URL, so links from the landing page apply on load.
 */
export default function CategoryWall({ slug, intro }) {
  const occ = occasionBySlug(slug)
  const base = useMemo(() => designsFor(occ), [occ])
  const [raw, setFilters, search] = useUrlFilters(OCCASION_WALL)
  const filters = useMemo(() => ({ ...raw, occasion: [] }), [raw])
  const kept = useKept()
  const personal = usePersonal()
  const phone = usePhone()
  const back = useReturning()
  const [welcomeHidden, setWelcomeHidden] = useState(false)
  const [finder, setFinder] = useState(false)
  const [namesSheet, setNamesSheet] = useState(false)
  const [notice, setNotice] = useState(null)

  const noun = occasionNoun(occ)
  const filtered = isFiltered(filters)
  const { matches, others } = useMemo(() => rank(base, filters), [base, filters])
  const fan = useMemo(() => fanIds(base), [base])
  const pairs = useMemo(() => scopedPairs(TASTE_PAIRS, base), [base])
  const colours = useMemo(() => DIMS.colour.options.filter((o) => base.some(o.test)), [base])
  const carry = serializeFilters(filters, OCCASION_WALL)

  // A category page's "edit names" link, or a landing link, may ask for the form.
  useEffect(() => {
    if (window.location.hash !== '#try-names') return
    const t = setTimeout(() => setNamesSheet(true), 300)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 20000)
    return () => clearTimeout(t)
  }, [notice])

  const openFinder = useCallback(() => setFinder(true), [])
  const openNames = useCallback(() => setNamesSheet(true), [])

  const applyTaste = (result) => {
    const prev = filters
    // Use the picks, but don't narrow this occasion's wall to almost nothing.
    const enough = Math.min(4, Math.max(2, Math.ceil(base.length / 3)))
    const options = [
      { ...prev, style: result.patch.style, colour: result.patch.colour },
      { ...prev, style: result.patch.style, colour: [] },
      { ...prev, style: [], colour: result.patch.colour },
    ].filter((o) => o.style.length || o.colour.length)
    const counted = options.map((o) => [o, countMatches(base, o)])
    const next = (counted.find(([, n]) => n >= enough) || counted.sort((a, b) => b[1] - a[1])[0] || [prev])[0]
    setFilters(next)
    setNotice({
      line: result.line,
      onUndo: () => {
        setFilters(prev)
        setNotice(null)
      },
    })
    document.getElementById('wall')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const startFresh = () => {
    kept.set([])
    personal.clear()
    setFilters(OCCASION_WALL)
    setWelcomeHidden(true)
  }

  const live = filtered
    ? matches.length
      ? `${matches.length === 1 ? '1 design matches' : `${matches.length} designs match`}.${
          filters.sort === 'best' ? ` Best match: ${matches[0].t.name}.` : ''
        }`
      : 'No designs match all of these yet.'
    : `${base.length} ${noun} designs, featured first.`

  return (
    <MotionConfig reducedMotion="user">
      <section className={s.opening} aria-labelledby="category-title">
        <div className={s.openingCopy}>
          {intro}
          <div className={s.extras}>
            {back && !welcomeHidden ? (
              <p className={s.welcome}>
                Welcome back. {back === 'kept' ? 'Your shortlist is still here.' : 'Your names are still here.'}{' '}
                <button type="button" className={s.inlineLink} onClick={startFresh}>
                  Start fresh
                </button>
              </p>
            ) : (
              <p className={s.welcome}>
                Not sure what you like?{' '}
                <button type="button" className={s.inlineLink} onClick={openFinder}>
                  Try this or that
                </button>
              </p>
            )}
          </div>
          <nav className={s.switch} aria-label="Other celebrations">
            <span className={s.switchLabel}>Also</span>
            <ul>
              {OCCASIONS_META.filter((o) => o.slug !== slug).map((o) => (
                <li key={o.slug}>
                  <Link href={`/templates/category/${o.slug}${carry ? `?${carry}` : ''}`} className={s.switchLink}>
                    {o.plural}
                    <span>{templatesFor(o.label).length}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <FanOpening ids={fan} />
      </section>

      <div className={s.explore} id="wall">
        <QuestionLine
          filters={filters}
          setFilters={setFilters}
          count={filtered ? matches.length : base.length}
          total={base.length}
          phone={phone}
          onOpenNames={openNames}
          notice={notice}
          noun={noun}
          base={base}
        />

        <div className={s.results}>
          <h2 className="sr-only">{`${occ.title} designs`}</h2>
          <SharedShortlist search={search} />
          <RankedWall
            filters={filters}
            setFilters={setFilters}
            matches={matches}
            others={others}
            onOpenFinder={openFinder}
            onOpenNames={openNames}
            base={base}
            showBanner={false}
            allLabel={`Show all ${noun} designs`}
            colourOptions={colours}
          />
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {live}
      </p>

      <ShortlistTray sharePath={`/templates/category/${slug}`} />
      <TasteFinder open={finder} onClose={() => setFinder(false)} onApply={applyTaste} pairs={pairs} />
      <Sheet
        open={namesSheet}
        onClose={() => setNamesSheet(false)}
        variant={phone ? 'bottom' : 'dialog'}
        title="See every design with your names"
      >
        <NamesForm onDone={() => setNamesSheet(false)} />
      </Sheet>
    </MotionConfig>
  )
}
