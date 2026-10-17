'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { formatInviteDate, usePersonal } from '@/lib/stores'
import { categoryHref, isNarrowed } from './data'
import s from './landing.module.css'

function Ornament({ type }) {
  if (type === 'arch')
    return (
      <svg className={s.ornArch} viewBox="0 0 80 60" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
        <path d="M40 4C28 4 10 18 10 40V56H70V40C70 18 52 4 40 4Z" />
        <path d="M40 10C32 10 18 22 18 40V52H62V40C62 22 48 10 40 10Z" strokeDasharray="2 2" />
        <circle cx="40" cy="22" r="3" fill="currentColor" />
      </svg>
    )
  if (type === 'compass')
    return (
      <svg className={s.ornRound} viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
        <circle cx="30" cy="30" r="22" strokeDasharray="1 3" />
        <path d="M30 14V46M14 30H46M19 19L41 41M19 41L41 19" strokeLinecap="round" />
      </svg>
    )
  if (type === 'sun')
    return (
      <span className={s.ornBadge} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
        </svg>
      </span>
    )
  if (type === 'spark')
    return (
      <span className={`${s.ornBadge} ${s.ornBadgeSm}`} aria-hidden="true">
        ✦
      </span>
    )
  return null
}

const initials = (names) =>
  names
    .split(/\s*(?:&|and|,)\s*/i)
    .map((w) => w.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

/**
 * One piece of stationery on the spread. For a category (`c`) it shows the
 * collection's real count and links to it; `item` gives the printed words.
 * Pass `href` and `label` instead of `c` for a card that isn't a category.
 */
export default function CategoryCard({ c, item, f, matched, href, label, className = '', layoutId }) {
  const personal = usePersonal()
  const narrowed = c && isNarrowed(f)
  const none = narrowed && matched === 0
  const names = item.personal && personal.names?.trim() ? personal.names.trim() : item.title
  const date = (item.personal && formatInviteDate(personal.date)) || item.date
  const reels = c ? (c.reels === 1 ? '1 reel' : `${c.reels} reels`) : ''
  const footLabel = c
    ? narrowed
      ? `${c.plural} • ${matched} of ${c.total} fit`
      : `${c.plural} • ${c.total} designs, ${reels}`
    : label
  // A collection with nothing that fits opens in full, without the answers.
  const to = c ? categoryHref(c.slug, none ? undefined : f) : href
  const linkLabel = c ? `Open the ${c.plural.toLowerCase()} collection` : item.title

  return (
    <motion.article
      layout={layoutId ? 'position' : false}
      layoutId={layoutId}
      transition={{ layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
      className={`${s.card} ${s[`tone_${item.tone}`]} ${className}`}
    >
      <div className={s.paper}>
        <span className={s.frameA} aria-hidden="true" />
        <span className={s.frameB} aria-hidden="true" />

        <div className={s.cardBody}>
          <Ornament type={item.icon} />
          <span className={s.cardEyebrow}>{item.eyebrow}</span>
          {item.kicker && <p className={s.cardKicker}>{item.kicker}</p>}
          <h3 className={s.cardTitle}>{names}</h3>
          {item.strong && <p className={s.cardStrong}>{item.strong}</p>}
          {item.rule && <span className={s.cardRule} aria-hidden="true" />}
          {item.date && (
            <>
              <span className={s.cardRule} aria-hidden="true" />
              <p className={s.cardDate}>{date}</p>
            </>
          )}
          {item.lines?.map((l) => (
            <p key={l} className={s.cardLine}>
              {l}
            </p>
          ))}
          {item.place && <p className={s.cardPlace}>{item.place}</p>}
          {item.pill && <span className={s.cardPill}>{item.pill}</span>}
          {item.seal && (
            <span className={s.cardSeal} aria-hidden="true">
              {initials(names) || 'N'}
            </span>
          )}
        </div>

        <div className={s.cardFoot}>
          <div className={s.cardFootText}>
            <span className={s.cardQuote}>“{item.quote}”</span>
            <span className={s.cardLabel}>{footLabel}</span>
          </div>
          <span className={s.cardOpen} aria-hidden="true">
            {none ? 'See all' : item.open || 'Open'}
          </span>
        </div>

        <Link href={to} className={s.cardLink} aria-label={`${linkLabel}${c ? `, ${footLabel.split('• ')[1]}` : ''}`} />
      </div>
    </motion.article>
  )
}
