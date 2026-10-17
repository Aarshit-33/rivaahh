'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import InviteScreen from '@/components/invite/InviteScreen'
import { similarTo } from '@/templates/data'
import { getLenis } from '@/lib/lenis'
import { useShowcase } from './ShowcaseContext'
import { STAGE } from './content'
import { encodeQR, qrPath } from './qr'
import { ChevronIcon, CloseIcon, CopyIcon, PauseIcon, PlayIcon, RestartIcon, ShareIcon } from './icons'
import s from './demo.module.css'

const HIDE_AFTER = 2500
const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'

const seconds = (duration) => {
  const [m, sec] = String(duration || '0:15').split(':').map(Number)
  return (m || 0) * 60 + (sec || 0) || 15
}

function QrCode({ value }) {
  const qr = useMemo(() => {
    try {
      return encodeQR(value, { ecl: 'M' })
    } catch {
      return null
    }
  }, [value])
  if (!qr) return null
  const q = 3 // quiet zone, in modules
  return (
    <svg
      className={s.qr}
      viewBox={`${-q} ${-q} ${qr.size + 2 * q} ${qr.size + 2 * q}`}
      role="img"
      aria-label="QR code for this demo's link"
      shapeRendering="crispEdges"
    >
      <rect x={-q} y={-q} width={qr.size + 2 * q} height={qr.size + 2 * q} fill="#fbf6ec" />
      <path d={qrPath(qr.modules)} fill="#2a1e1a" />
    </svg>
  )
}

/**
 * One run of the invitation inside the demo. Keyed by template and take, so
 * "Watch again" and next / previous start it fresh. Reels play like a Story:
 * a thin progress bar, stepping through the parts, holding on the last frame.
 */
function Player({ template, names, date, size, playing, setPlaying, onToast, onEnd }) {
  const isReel = template.format === 'reel'
  const inviteRef = useRef(null)
  const barRef = useRef(null)
  const elapsed = useRef(0)
  const total = seconds(template.duration) * 1000
  const parts = useMemo(() => template.parts.map(([id]) => id), [template])

  // Reel clock: progress bar by ref (no re-render per frame); parts by index.
  useEffect(() => {
    if (!isReel || !playing) return
    let raf = 0
    let last = performance.now()
    let step = -1
    const tick = (now) => {
      elapsed.current = Math.min(total, elapsed.current + (now - last))
      last = now
      const p = elapsed.current / total
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
      const i = Math.min(parts.length - 1, Math.floor(p * parts.length))
      if (i !== step) {
        if (step !== -1 || i > 0) inviteRef.current?.scrollToPart(parts[i], true)
        step = i
      }
      if (p >= 1) {
        setPlaying(false)
        onEnd()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isReel, playing, total, parts, onEnd, setPlaying])

  // A visitor who scrolls or taps takes over from the reel's clock.
  const takeOver = () => {
    if (playing) setPlaying(false)
  }

  const onPart = useCallback(
    (id) => {
      if (!isReel && id === parts[parts.length - 1]) onEnd()
    },
    [isReel, parts, onEnd],
  )

  const onDirections = () =>
    onToast('In the real invitation this opens directions on the guest’s phone. This demo uses a sample venue.')

  const invite = (
    <InviteScreen
      ref={inviteRef}
      template={template}
      names={names}
      date={date}
      playing={playing}
      onPart={onPart}
      onRsvp={() => onToast('This is a demo, so nothing was sent. Your guests’ replies will come to you.')}
      onDirections={onDirections}
    />
  )

  return (
    <>
      {isReel && (
        <div className={s.progress} aria-hidden="true">
          <span ref={barRef} />
        </div>
      )}

      <div className={`${s.screen} ${size === 'laptop' ? s.screenLaptop : s.screenPhone}`}>
        {size === 'laptop' && (
          <div className={s.blur} aria-hidden="true">
            <InviteScreen template={template} names={names} date={date} poster inert />
          </div>
        )}
        <div
          className={s.invite}
          data-lenis-prevent
          role="region"
          aria-label={`${template.name} invitation, full-screen demo`}
          onWheel={takeOver}
          onTouchStart={takeOver}
          onPointerDown={takeOver}
        >
          {invite}
        </div>
      </div>

    </>
  )
}

export default function Demo({ opener }) {
  const { base, template, names, date, reduced, closeDemo } = useShowcase()
  const rootRef = useRef(null)
  const closeRef = useRef(null)
  const hideTimer = useRef(0)
  const toastTimer = useRef(0)
  const wentFull = useRef(false)
  const [size, setSize] = useState('phone')
  const [idx, setIdx] = useState(0)
  const [take, setTake] = useState(0)
  const [ended, setEnded] = useState(false)
  const [playing, setPlaying] = useState(base.format === 'reel' && !reduced)
  const [chromeOn, setChromeOn] = useState(true)
  const [toast, setToast] = useState(null)
  const [copied, setCopied] = useState(false)

  const list = useMemo(() => [template, ...similarTo(base, 8)], [template, base])
  const current = list[idx]
  const field = STAGE[current.theme] ?? STAGE.royal
  const demoUrl = `${window.location.origin}/templates/${current.id}?demo=1`

  const close = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
    closeDemo()
  }, [closeDemo])

  // Open: full screen where the browser allows it, otherwise a fixed overlay.
  // Stop the page from scrolling, mark the URL, and focus the close button.
  useEffect(() => {
    const root = rootRef.current
    const returnTo = opener && document.contains(opener) ? opener : document.querySelector('[data-demo-opener]')
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    getLenis()?.stop()

    if (root.requestFullscreen) {
      root
        .requestFullscreen({ navigationUI: 'hide' })
        .then(() => {
          wentFull.current = true
        })
        .catch(() => {})
    }
    const onFs = () => {
      if (!document.fullscreenElement && wentFull.current) closeDemo()
    }
    document.addEventListener('fullscreenchange', onFs)

    const url = new URL(window.location.href)
    url.searchParams.set('demo', '1')
    window.history.replaceState(window.history.state, '', url)

    closeRef.current?.focus({ preventScroll: true })

    return () => {
      document.removeEventListener('fullscreenchange', onFs)
      html.style.overflow = prevOverflow
      getLenis()?.start()
      const back = new URL(window.location.href)
      back.searchParams.delete('demo')
      window.history.replaceState(window.history.state, '', back)
      returnTo?.focus?.({ preventScroll: true })
    }
  }, [opener, closeDemo])

  // Controls fade after 2.5s without movement and return on any movement.
  const wake = useCallback(() => {
    setChromeOn(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setChromeOn(false), HIDE_AFTER)
  }, [])

  useEffect(() => {
    hideTimer.current = setTimeout(() => setChromeOn(false), HIDE_AFTER)
    return () => {
      clearTimeout(hideTimer.current)
      clearTimeout(toastTimer.current)
    }
  }, [])

  const showToast = useCallback(
    (text) => {
      setToast(text)
      wake()
      clearTimeout(toastTimer.current)
      toastTimer.current = setTimeout(() => setToast(null), 4200)
    },
    [wake],
  )

  const go = (dir) => {
    const next = (idx + dir + list.length) % list.length
    setIdx(next)
    setEnded(false)
    setPlaying(list[next].format === 'reel' && !reduced)
    setTake((n) => n + 1)
  }

  const again = () => {
    setEnded(false)
    setPlaying(current.format === 'reel' && !reduced)
    setTake((n) => n + 1)
  }

  const onEnd = useCallback(() => setEnded(true), [])

  const onKeyDown = (e) => {
    wake()
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
      return
    }
    if (e.key === 'ArrowRight' && !e.target.closest?.('[data-part]')) go(1)
    if (e.key === 'ArrowLeft' && !e.target.closest?.('[data-part]')) go(-1)
    if (e.key === 'Tab') {
      const items = Array.from(rootRef.current.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      )
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(demoUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    } catch {
      showToast('Copy did not work here. The link is shown above the button.')
    }
  }

  const send = async () => {
    const text = `See the ${current.name} invitation from Nimantran`
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url: demoUrl })
        return
      } catch {
        return
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text}: ${demoUrl}`)}`, '_blank', 'noopener')
  }

  const shortUrl = demoUrl.replace(/^https?:\/\//, '')

  return (
    <div
      ref={rootRef}
      className={`${s.demo} ${field.light ? s.light : ''}`}
      style={{ '--field': field.field }}
      role="dialog"
      aria-modal="true"
      aria-label={`${current.name}, full-screen demo`}
      onKeyDown={onKeyDown}
      onPointerMove={wake}
      onPointerDown={wake}
      onTouchStart={wake}
    >
      <div className={s.grain} aria-hidden="true" />

      <Player
        key={`${current.id}-${take}`}
        template={current}
        names={idx === 0 ? names : ''}
        date={idx === 0 ? date : ''}
        size={size}
        playing={playing}
        setPlaying={setPlaying}
        onToast={showToast}
        onEnd={onEnd}
      />

      {/* Top: name, size toggle, close. */}
      <div className={`${s.chrome} ${s.top} ${chromeOn ? '' : s.off}`}>
        <p className={s.name}>
          <span className={s.nameText}>{current.name}</span>
          <span className={s.nameMeta}>
            {current.format === 'reel' ? `Reel · ${current.duration}` : 'Card'} · {idx + 1} of {list.length}
          </span>
        </p>

        <div className={s.sizes} role="group" aria-label="Show it">
          {[
            ['phone', 'As on a phone'],
            ['laptop', 'As on a laptop'],
          ].map(([id, label]) => (
            <button key={id} type="button" className={s.size} aria-pressed={size === id} onClick={() => setSize(id)}>
              {label}
            </button>
          ))}
        </div>

        <button ref={closeRef} type="button" className={s.round} onClick={close} aria-label="Exit the demo">
          <CloseIcon size={20} />
        </button>
      </div>

      {/* Edges: previous and next designs from "the same spirit". */}
      <button
        type="button"
        className={`${s.chrome} ${s.edge} ${s.prev} ${chromeOn ? '' : s.off}`}
        onClick={() => go(-1)}
        aria-label={`Previous design: ${list[(idx - 1 + list.length) % list.length].name}`}
      >
        <ChevronIcon dir="left" size={26} />
      </button>
      <button
        type="button"
        className={`${s.chrome} ${s.edge} ${s.next} ${chromeOn ? '' : s.off}`}
        onClick={() => go(1)}
        aria-label={`Next design: ${list[(idx + 1) % list.length].name}`}
      >
        <ChevronIcon dir="right" size={26} />
      </button>

      {/* Bottom centre: restart and send. */}
      {!ended && (
        <div className={`${s.chrome} ${s.bottom} ${chromeOn ? '' : s.off}`}>
          {current.format === 'reel' && (
            <button
              type="button"
              className={`${s.pill} ${s.pillIcon}`}
              onClick={() => setPlaying(!playing)}
              aria-label={playing ? 'Pause the reel' : 'Play the reel'}
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
          )}
          <button type="button" className={s.pill} onClick={again}>
            <RestartIcon />
            Restart
          </button>
          <button type="button" className={s.pill} onClick={send}>
            <ShareIcon />
            <span>
              Send<span className={s.long}> me the demo</span>
            </span>
          </button>
        </div>
      )}

      {/* Desktop: open it on your own phone. */}
      <aside className={`${s.chrome} ${s.phoneCard} ${chromeOn ? '' : s.off}`} aria-label="Open on your phone">
        <QrCode value={demoUrl} />
        <div className={s.phoneCardText}>
          <p className={s.phoneCardTitle}>Open on your phone</p>
          <p className={s.phoneCardNote}>Scan to see it on your own phone.</p>
          <p className={s.url}>{shortUrl}</p>
          <button type="button" className={s.copy} onClick={copy}>
            <CopyIcon size={16} />
            {copied ? 'Link copied' : 'Copy link'}
          </button>
        </div>
      </aside>

      {/* The end: hold on the last frame and offer what comes next. */}
      {ended && (
        <div className={s.endBar} role="group" aria-label="The demo has ended">
          <Link href="/#create" className={`btn btn--primary ${s.endPrimary}`} onClick={close}>
            Use this design
          </Link>
          <button type="button" className={s.endBtn} onClick={again}>
            <RestartIcon />
            Watch again
          </button>
          <button type="button" className={s.endBtn} onClick={close}>
            <CloseIcon />
            Exit demo
          </button>
        </div>
      )}

      <p className={`${s.toast} ${toast ? s.toastOn : ''}`} role="status" aria-live="polite">
        {toast}
      </p>
    </div>
  )
}
