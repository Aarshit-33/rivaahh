'use client'

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { MotionConfig } from 'motion/react'
import ReelCard from '@/components/invite/ReelCard'
import { TEMPLATES, getTemplate } from '@/templates/data'
import { useKept, usePersonal } from '@/lib/stores'
import { EMPTY, countMatches, isFiltered, rank } from './filters'
import { setParams, usePhone, useUrlFilters } from './hooks'
import FanOpening from './FanOpening'
import QuestionLine from './QuestionLine'
import Shelves from './Shelves'
import RankedWall from './RankedWall'
import ShortlistTray from './ShortlistTray'
import TasteFinder from './TasteFinder'
import NamesForm from './NamesForm'
import Sheet from './Sheet'
import { Close } from './Icons'
import s from './explorer.module.css'
import w from './wall.module.css'
import ui from './ui.module.css'

// Was there a shortlist or names when this page first loaded? Read once per
// page load, so hearting something now never turns into "welcome back".
let returning = null
const readReturning = () => {
  if (returning === null) {
    try {
      const kept = JSON.parse(window.localStorage.getItem('nimantran:kept') || '[]')
      const p = JSON.parse(window.localStorage.getItem('nimantran:personal') || '{}')
      returning = kept.length > 0 ? 'kept' : p.names?.trim() || p.date ? 'names' : ''
    } catch {
      returning = ''
    }
  }
  return returning
}
const noop = () => () => {}

/**
 * Everything interactive on /templates: the opening's fan and extras, the
 * question line, shelves or the ranked wall, the shortlist tray and the two
 * optional extras (your names, this-or-that). Filters live in the URL.
 */
export default function TemplatesExplorer({ intro }) {
  const [filters, setFilters, search] = useUrlFilters(EMPTY)
  const kept = useKept()
  const personal = usePersonal()
  const phone = usePhone()
  const back = useSyncExternalStore(noop, readReturning, () => '')
  const [welcomeHidden, setWelcomeHidden] = useState(false)
  const [finder, setFinder] = useState(false)
  const [namesSheet, setNamesSheet] = useState(false)
  const [notice, setNotice] = useState(null)
  const [sharedHidden, setSharedHidden] = useState(false)

  const filtered = isFiltered(filters)
  const { matches, others } = useMemo(() => rank(TEMPLATES, filters), [filters])

  const shared = useMemo(() => {
    const raw = new URLSearchParams(search).get('kept')
    if (!raw) return []
    return [...new Set(raw.split(','))].map(getTemplate).filter(Boolean).slice(0, 12)
  }, [search])

  // Arriving from a category page's "edit" link opens the names form.
  useEffect(() => {
    if (window.location.hash !== '#try-names') return
    const t = setTimeout(() => setNamesSheet(true), 300)
    return () => clearTimeout(t)
  }, [])

  // The taste-finder notice fades after a while.
  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 20000)
    return () => clearTimeout(t)
  }, [notice])

  const openFinder = useCallback(() => setFinder(true), [])
  const openNames = useCallback(() => setNamesSheet(true), [])

  const applyTaste = (result) => {
    const prev = filters
    // Use the picks, but never narrow the wall to almost nothing: drop the
    // colour, then the style, until a handful of designs remain.
    const options = [
      { ...prev, style: result.patch.style, colour: result.patch.colour },
      { ...prev, style: result.patch.style, colour: [] },
      { ...prev, style: [], colour: result.patch.colour },
    ].filter((o) => o.style.length || o.colour.length)
    const counted = options.map((o) => [o, countMatches(TEMPLATES, o)])
    const next = (counted.find(([, n]) => n >= 4) || counted.sort((a, b) => b[1] - a[1])[0] || [prev])[0]
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
    setFilters(EMPTY)
    setWelcomeHidden(true)
  }

  const count = filtered ? matches.length : TEMPLATES.length
  const live = filtered
    ? matches.length
      ? `${matches.length === 1 ? '1 design matches' : `${matches.length} designs match`}.${filters.sort === 'best' ? ` Best match: ${matches[0].t.name}.` : ''}`
      : 'No designs match all of these yet.'
    : `${TEMPLATES.length} designs, grouped by occasion.`

  return (
    <MotionConfig reducedMotion="user">
      <section className={s.opening} aria-labelledby="templates-title">
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
        </div>
        <FanOpening />
      </section>

      <div className={s.explore} id="wall">
        <QuestionLine
          filters={filters}
          setFilters={setFilters}
          count={count}
          total={TEMPLATES.length}
          phone={phone}
          onOpenNames={openNames}
          notice={notice}
        />

        <div className={s.results}>
          {shared.length > 0 && !sharedHidden && (
            <section className={w.shared} aria-labelledby="shared-title">
              <header className={w.sharedHead}>
                <div>
                  <p className={w.sharedTag}>Shared shortlist</p>
                  <h2 id="shared-title" className={w.sharedTitle}>
                    Someone picked {shared.length === 1 ? 'this design' : `these ${shared.length} designs`} for{' '}
                    <em>you</em>
                  </h2>
                  <p className={w.sharedText}>
                    Open any of them to see it on a phone, or keep them in your own shortlist.
                  </p>
                </div>
                <div className={w.sharedActions}>
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    onClick={() => kept.set([...new Set([...kept.ids, ...shared.map((t) => t.id)])])}
                    disabled={shared.every((t) => kept.has(t.id))}
                  >
                    {shared.every((t) => kept.has(t.id)) ? 'In your shortlist' : 'Keep these too'}
                  </button>
                  <button
                    type="button"
                    className={ui.iconBtn}
                    aria-label="Hide the shared shortlist"
                    onClick={() => {
                      setSharedHidden(true)
                      setParams({ kept: null })
                    }}
                  >
                    <Close />
                  </button>
                </div>
              </header>
              <ul className={w.shelfRow}>
                {shared.map((t) => (
                  <li key={t.id} className={w.shelfItem}>
                    <ReelCard template={t} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {filtered ? (
            <RankedWall
              filters={filters}
              setFilters={setFilters}
              matches={matches}
              others={others}
              onOpenFinder={openFinder}
              onOpenNames={openNames}
            />
          ) : (
            <Shelves />
          )}
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {live}
      </p>

      <ShortlistTray />
      <TasteFinder open={finder} onClose={() => setFinder(false)} onApply={applyTaste} />
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
