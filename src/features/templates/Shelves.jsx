'use client'

import Link from 'next/link'
import ReelCard from '@/components/invite/ReelCard'
import { OCCASIONS_META, templatesFor } from '@/templates/data'
import { OCCASION_NOTES } from './content'
import { Arrow } from './Icons'
import s from './wall.module.css'

const MAX = 8

const seeAll = (o) => (o.slug === 'griha-pravesh' ? 'Griha Pravesh' : o.plural.toLowerCase())

/** Designs for one occasion: those made for it first, then featured. */
function shelfFor(o) {
  return templatesFor(o.label)
    .map((t, i) => ({ t, s: (t.occasions[0] === o.label ? 2 : 0) + (t.featured ? 1 : 0), i }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map(({ t }) => t)
}

/** No filters: one shelf per occasion, each a row (a swipe row on phones). */
export default function Shelves() {
  return (
    <div className={s.shelves}>
      {OCCASIONS_META.map((o, n) => {
        const list = shelfFor(o)
        const shown = list.slice(0, MAX)
        const id = `shelf-${o.slug}`
        return (
          <section key={o.slug} className={s.shelf} aria-labelledby={id}>
            <header className={s.shelfHead}>
              <div className={s.shelfTitles}>
                <h2 id={id} className={s.shelfTitle}>
                  {o.plural}
                </h2>
                <span className={s.shelfCount}>{list.length === 1 ? '1 design' : `${list.length} designs`}</span>
              </div>
              <p className={s.shelfNote}>{OCCASION_NOTES[o.slug]?.shelf}</p>
              <Link href={`/templates/category/${o.slug}`} className={s.shelfLink}>
                See all {seeAll(o)}
                <Arrow />
              </Link>
            </header>
            <ul className={s.shelfRow} data-lenis-prevent-touch>
              {shown.map((t, i) => (
                <li key={t.id} className={s.shelfItem}>
                  <ReelCard template={t} priority={n === 0 && i < 6} />
                </li>
              ))}
              {list.length > 4 && (
                <li className={`${s.shelfItem} ${s.shelfMore}`}>
                  <Link href={`/templates/category/${o.slug}`} className={s.shelfMoreLink}>
                    <span className={s.shelfMoreCount}>{list.length}</span>
                    <span>All {seeAll(o)}</span>
                    <Arrow />
                  </Link>
                </li>
              )}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
