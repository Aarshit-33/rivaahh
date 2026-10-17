'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useKept } from '@/lib/stores'
import { useShowcase } from './ShowcaseContext'
import { preloadDemo } from './DemoHost'
import { HeartIcon, PenIcon, PlayIcon, ShareIcon } from './icons'
import s from './showcase.module.css'

const LONG_NAMES = 26

function NamesPanel({ onDone }) {
  const { base, personal } = useShowcase()
  const [names, setNames] = useState(personal.names || '')
  const [date, setDate] = useState(personal.date || '')
  const timer = useRef(0)
  const first = useRef(null)
  const { set } = personal

  useEffect(() => {
    first.current?.focus({ preventScroll: true })
  }, [])

  // Both devices and the demo follow the visitor's typing, 250ms behind.
  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => set({ names, date }), 250)
    return () => clearTimeout(timer.current)
  }, [names, date, set])

  return (
    <div className={s.panel} id="names-panel" role="group" aria-labelledby="names-panel-title">
      <p className={s.panelTitle} id="names-panel-title">
        See it with your names
      </p>
      <div className={s.fields}>
        <label className={s.field}>
          <span>Names</span>
          <input
            ref={first}
            type="text"
            value={names}
            maxLength={60}
            placeholder="Priya & Arjun"
            autoComplete="off"
            onChange={(e) => setNames(e.target.value)}
          />
        </label>
        <label className={s.field}>
          <span>Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>
      {names.trim().length > LONG_NAMES && base.id !== 'ivory' && (
        <p className={s.panelHint}>
          Long names are shortened on this design. Long names suit{' '}
          <Link href="/templates/ivory">Ivory letterpress</Link> better.
        </p>
      )}
      <div className={s.panelFoot}>
        <p className={s.panelNote}>Only on this device. Nothing is saved to an account.</p>
        <button type="button" className={s.textBtn} onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  )
}

/** Title block actions: use, demo, keep aside, share and "your names". */
export default function TitleActions() {
  const { base, openDemo, personal } = useShowcase()
  const kept = useKept()
  const isKept = kept.has(base.id)
  const [panel, setPanel] = useState(false)
  const [status, setStatus] = useState('')
  const statusTimer = useRef(0)

  useEffect(() => () => clearTimeout(statusTimer.current), [])

  const say = (text) => {
    setStatus(text)
    clearTimeout(statusTimer.current)
    statusTimer.current = setTimeout(() => setStatus(''), 2600)
  }

  const share = async () => {
    const url = `${window.location.origin}/templates/${base.id}`
    const title = `${base.name}, an invitation design on Nimantran`
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        /* the visitor closed the share sheet */
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      say('Link copied')
    } catch {
      say(url)
    }
  }

  return (
    <div className={s.actions} data-title-actions>
      <Link href="/#create" className={`btn btn--primary ${s.wide}`}>
        Use this design
      </Link>
      <button
        type="button"
        className={`btn ${s.outline} ${s.wide}`}
        data-demo-opener
        onClick={(e) => openDemo(e.currentTarget)}
        onPointerEnter={preloadDemo}
        onFocus={preloadDemo}
      >
        <PlayIcon size={16} />
        Watch full-screen demo
      </button>

      <div className={s.quiet}>
        <button type="button" className={s.quietBtn} aria-pressed={isKept} onClick={() => kept.toggle(base.id)}>
          <HeartIcon on={isKept} size={17} />
          {isKept ? 'Kept aside' : 'Keep aside'}
        </button>
        <button type="button" className={s.quietBtn} onClick={share}>
          <ShareIcon size={17} />
          Share
        </button>
        <button
          type="button"
          className={s.quietBtn}
          aria-expanded={panel}
          aria-controls="names-panel"
          onClick={() => setPanel(!panel)}
        >
          See it with your names
          <PenIcon size={16} />
        </button>
      </div>

      <p className={s.status} role="status" aria-live="polite">
        {status}
      </p>

      {personal.active && !panel && (
        <p className={s.yours}>
          Showing your names ·{' '}
          <button type="button" className={s.inline} onClick={() => setPanel(true)}>
            edit
          </button>{' '}
          ·{' '}
          <button type="button" className={s.inline} onClick={personal.clear}>
            clear
          </button>
        </p>
      )}

      {panel && <NamesPanel onDone={() => setPanel(false)} />}
    </div>
  )
}
