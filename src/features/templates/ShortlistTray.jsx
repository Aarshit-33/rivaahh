'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Phone } from '@/components/props'
import InviteScreen from '@/components/invite/InviteScreen'
import { getTemplate } from '@/templates/data'
import { formatInviteDate, useKept, usePersonal } from '@/lib/stores'
import Sheet from './Sheet'
import { Arrow, Chat, LinkIcon, Pause, Play } from './Icons'
import s from './tray.module.css'
import ui from './ui.module.css'

const ease = [0.22, 1, 0.36, 1]

export function shareLinkFor(ids, path = '/occasions') {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}${path}?kept=${ids.join(',')}`
}

/** Compare 2–3 kept designs side by side in the shared phone. */
function Compare({ open, onClose, ids }) {
  const personal = usePersonal()
  const kept = useKept()
  const [pick, setPick] = useState(null)
  const [playing, setPlaying] = useState(false)
  const chosen = (pick || ids.slice(0, 3)).filter((id) => ids.includes(id))
  const list = chosen.map(getTemplate).filter(Boolean)
  const date = formatInviteDate(personal.date)

  const togglePick = (id) => {
    const cur = chosen
    if (cur.includes(id)) setPick(cur.filter((x) => x !== id))
    else setPick(cur.length >= 3 ? [...cur.slice(1), id] : [...cur, id])
  }

  return (
    <Sheet open={open} onClose={onClose} variant="full" title="Compare your shortlist" className={s.compare}>
      <div className={s.compareBar}>
        {ids.length > 3 ? (
          <fieldset className={s.comparePick}>
            <legend>Compare up to three</legend>
            {ids.map((id) => {
              const t = getTemplate(id)
              if (!t) return null
              return (
                <label key={id} className={ui.chip}>
                  <input type="checkbox" checked={chosen.includes(id)} onChange={() => togglePick(id)} />
                  {t.name}
                </label>
              )
            })}
          </fieldset>
        ) : (
          <p className={s.compareHint}>Each phone scrolls like the real invitation. Reels play together.</p>
        )}
        <button
          type="button"
          className={`btn btn--outline btn--sm ${s.playAll}`}
          onClick={() => setPlaying((v) => !v)}
          aria-pressed={playing}
        >
          {playing ? <Pause /> : <Play />}
          {playing ? 'Pause' : 'Play the openings'}
        </button>
      </div>
      <ul className={s.phones} data-count={list.length}>
        {list.map((t) => (
          <li key={t.id} className={s.phoneCol}>
            <div className={s.phoneBox}>
              <Phone label={`${t.name}, ${t.format}`}>
                <InviteScreen template={t} playing={playing} names={personal.names} date={date} />
              </Phone>
            </div>
            <div className={s.phoneMeta}>
              <h3>{t.name}</h3>
              <p>
                {t.format === 'reel' ? `Reel ${t.duration}` : 'Card'} · {t.style} · {t.occasions[0]}
              </p>
              <div className={s.phoneActions}>
                <Link href={`/templates/${t.id}`} className={ui.textBtn}>
                  Open <Arrow />
                </Link>
                <button type="button" className={ui.textBtn} onClick={() => kept.toggle(t.id)}>
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {list.length < 2 && <p className={s.compareHint}>Keep at least two designs aside to compare them.</p>}
    </Sheet>
  )
}

/** Share the shortlist with family: copy a link or open WhatsApp. */
function Share({ open, onClose, ids, path }) {
  const [copied, setCopied] = useState(false)
  const link = open ? shareLinkFor(ids, path) : ''
  const first = getTemplate(ids[0])
  const occasion = first ? first.occasions[0].toLowerCase() : 'celebration'
  const text = `Which one do you like for the ${occasion}? — ${link}`
  const names = ids
    .map(getTemplate)
    .filter(Boolean)
    .map((t) => t.name)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      const el = document.getElementById('share-link')
      el?.select()
      document.execCommand?.('copy')
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2400)
  }

  return (
    <Sheet open={open} onClose={onClose} title="Share with family" size="wide">
      <p className={s.shareLede}>
        Send your shortlist and ask which one they like. Whoever opens the link sees{' '}
        {names.length === 1 ? 'this design' : `these ${names.length} designs`} first.
      </p>
      <p className={s.shareNames}>{names.join(' · ')}</p>
      <label className={ui.field}>
        <span>Link to your shortlist</span>
        <input id="share-link" type="text" readOnly value={link} onFocus={(e) => e.target.select()} />
      </label>
      <div className={s.shareActions}>
        <a
          className="btn btn--primary"
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Chat /> Share on WhatsApp
        </a>
        <button type="button" className="btn btn--outline" onClick={copy}>
          <LinkIcon /> {copied ? 'Link copied' : 'Copy link'}
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Link copied' : ''}
      </span>
      <div className={s.later}>
        <p className={s.laterTag}>After launch</p>
        <p>Family voting: everyone taps the design they like and you see the choices in one place.</p>
      </div>
    </Sheet>
  )
}

/**
 * "Kept aside": a tray docked bottom-centre once something is kept, with tiny
 * fanned thumbnails, Compare and Share with family. Shared by every
 * templates page through the kept store.
 */
// `sharePath`: the page a shared link opens with `?kept=…` (default /templates).
export default function ShortlistTray({ sharePath = '/occasions' } = {}) {
  const kept = useKept()
  const personal = usePersonal()
  const [sheet, setSheet] = useState(null)
  const ids = useMemo(() => kept.ids.filter((id) => getTemplate(id)), [kept.ids])
  const thumbs = ids.slice(-4).map(getTemplate)

  return (
    <>
      <AnimatePresence>
        {ids.length > 0 && (
          <motion.aside
            className={s.tray}
            aria-label="Your shortlist"
            initial={{ y: 90, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: 90, opacity: 0, x: '-50%' }}
            transition={{ duration: 0.5, ease }}
          >
            <span className={s.thumbs} aria-hidden="true">
              {thumbs.map((t, i) => (
                <span key={t.id} className={s.thumb} style={{ rotate: `${(i - (thumbs.length - 1) / 2) * 7}deg` }}>
                  <InviteScreen template={t} poster inert names={personal.names} />
                </span>
              ))}
            </span>
            <span className={s.trayCount}>
              <b>{ids.length}</b> kept<span className={s.trayAside}> aside</span>
            </span>
            <button
              type="button"
              className={s.trayBtn}
              onClick={() => setSheet('compare')}
              disabled={ids.length < 2}
              title={ids.length < 2 ? 'Keep one more design to compare' : undefined}
            >
              Compare
            </button>
            <button type="button" className={`${s.trayBtn} ${s.trayPrimary}`} onClick={() => setSheet('share')}>
              <span className={s.trayLong}>Share with family</span>
              <span className={s.trayShort}>Share</span>
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
      <Compare open={sheet === 'compare'} onClose={() => setSheet(null)} ids={ids} />
      <Share open={sheet === 'share'} onClose={() => setSheet(null)} ids={ids} path={sharePath} />
    </>
  )
}
