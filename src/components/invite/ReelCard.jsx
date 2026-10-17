'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import InviteScreen from './InviteScreen'
import { formatInviteDate, useKept, usePersonal } from '@/lib/stores'

function Heart({ on }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"
        fill={on ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * A template as a 9:16 card: the invitation's cover, a CARD / REEL badge, a
 * keep-aside heart, and its name below. Reels play while hovered or focused.
 * Shared by the templates wall, the category pages and the showcase.
 *
 * - `why`        filters that matched, shown as a small handwritten tag
 * - `bestMatch`  shows the BEST MATCH ribbon
 * - `dim`        greyed out (doesn't match the current filters)
 * - `playing`    play the reel from outside (otherwise: hover / focus, or — on
 *                touch screens — while the card sits in the middle of the screen)
 */
export default function ReelCard({
  template,
  why,
  bestMatch = false,
  dim = false,
  className = '',
  priority = false,
  playing,
}) {
  const [hover, setHover] = useState(false)
  const [centred, setCentred] = useState(false)
  const root = useRef(null)

  // Touch screens have no hover: a reel plays while it is in the middle band
  // of the viewport, so only the one being looked at moves.
  useEffect(() => {
    if (template.format !== 'reel' || playing !== undefined) return
    if (!window.matchMedia('(hover: none)').matches) return
    const io = new IntersectionObserver(([e]) => setCentred(e.isIntersecting), {
      rootMargin: '-38% 0px -38% 0px',
    })
    io.observe(root.current)
    return () => io.disconnect()
  }, [template.format, playing])

  const isPlaying = playing ?? (hover || centred)
  const kept = useKept()
  const personal = usePersonal()
  const isKept = kept.has(template.id)
  const meta = `${template.occasions[0]} · ${template.style}`

  return (
    <article
      ref={root}
      className={`rc ${dim ? 'rc--dim' : ''} ${className}`}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <div className="rc-poster">
        <Link
          href={`/templates/${template.id}`}
          className="rc-link"
          aria-label={`${template.name}, ${template.format} for ${template.occasions.join(', ')}, ${template.style.toLowerCase()} style`}
          prefetch={priority ? true : null}
        >
          <InviteScreen
            template={template}
            poster
            inert
            playing={isPlaying}
            names={personal.names}
            date={formatInviteDate(personal.date)}
          />
        </Link>
        <span className="rc-badge" aria-hidden="true">
          {template.format === 'reel' ? (
            <>
              <svg viewBox="0 0 10 10">
                <path d="M2 1 L9 5 L2 9 Z" fill="currentColor" />
              </svg>
              Reel {template.duration}
            </>
          ) : (
            'Card'
          )}
        </span>
        <button
          type="button"
          className={`rc-heart ${isKept ? 'is-on' : ''}`}
          aria-pressed={isKept}
          aria-label={isKept ? `Remove ${template.name} from your shortlist` : `Keep ${template.name} aside`}
          onClick={() => kept.toggle(template.id)}
        >
          <Heart on={isKept} />
        </button>
        {bestMatch && <span className="rc-best">Best match</span>}
        {why && why.length > 0 && <span className="rc-why">{why.join(' · ')}</span>}
      </div>
      <div className="rc-meta">
        <h3>
          <Link href={`/templates/${template.id}`} tabIndex={-1}>
            {template.name}
          </Link>
        </h3>
        <p>{meta}</p>
      </div>
    </article>
  )
}
