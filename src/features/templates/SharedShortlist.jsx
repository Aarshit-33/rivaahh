'use client'

import { useMemo, useState } from 'react'
import ReelCard from '@/components/invite/ReelCard'
import { getTemplate } from '@/templates/data'
import { useKept } from '@/lib/stores'
import { setParams } from './hooks'
import { Close } from './Icons'
import w from './wall.module.css'
import ui from './ui.module.css'

/**
 * A shortlist someone shared (`?kept=a,b,c`), shown above the wall. It never
 * replaces the visitor's own shortlist; "Keep these too" adds to it.
 */
export default function SharedShortlist({ search }) {
  const kept = useKept()
  const [hidden, setHidden] = useState(false)
  const shared = useMemo(() => {
    const raw = new URLSearchParams(search).get('kept')
    if (!raw) return []
    return [...new Set(raw.split(','))].map(getTemplate).filter(Boolean).slice(0, 12)
  }, [search])

  if (!shared.length || hidden) return null
  const all = shared.every((t) => kept.has(t.id))

  return (
    <section className={w.shared} aria-labelledby="shared-title">
      <header className={w.sharedHead}>
        <div>
          <p className={w.sharedTag}>Shared shortlist</p>
          <h2 id="shared-title" className={w.sharedTitle}>
            Someone picked {shared.length === 1 ? 'this design' : `these ${shared.length} designs`} for <em>you</em>
          </h2>
          <p className={w.sharedText}>Open any of them to see it on a phone, or keep them in your own shortlist.</p>
        </div>
        <div className={w.sharedActions}>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => kept.set([...new Set([...kept.ids, ...shared.map((t) => t.id)])])}
            disabled={all}
          >
            {all ? 'In your shortlist' : 'Keep these too'}
          </button>
          <button
            type="button"
            className={ui.iconBtn}
            aria-label="Hide the shared shortlist"
            onClick={() => {
              setHidden(true)
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
  )
}
