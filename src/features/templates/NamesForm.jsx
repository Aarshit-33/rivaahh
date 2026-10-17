'use client'

import { useEffect, useRef, useState } from 'react'
import { usePersonal } from '@/lib/stores'
import s from './explorer.module.css'
import ui from './ui.module.css'

/**
 * "Try your names": two optional fields. Typing updates every preview after a
 * short pause (250ms). Nothing leaves the browser.
 */
export default function NamesForm({ onDone }) {
  const personal = usePersonal()
  const [names, setNames] = useState(personal.names || '')
  const [date, setDate] = useState(personal.date || '')
  const first = useRef(true)
  const { set } = personal

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const t = setTimeout(() => set({ names: names.slice(0, 60), date }), 250)
    return () => clearTimeout(t)
  }, [names, date, set])

  return (
    <form
      className={s.namesForm}
      onSubmit={(e) => {
        e.preventDefault()
        set({ names: names.slice(0, 60), date })
        onDone?.()
      }}
    >
      <label className={ui.field}>
        <span>Whose celebration?</span>
        <input
          type="text"
          value={names}
          onChange={(e) => setNames(e.target.value)}
          placeholder="Priya & Arjun"
          maxLength={60}
          autoComplete="off"
          data-autofocus=""
        />
      </label>
      <label className={ui.field}>
        <span>Date (optional)</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <p className={s.namesNote}>Stays on this device. You can clear it any time.</p>
      <div className={s.namesActions}>
        <button type="submit" className="btn btn--primary btn--sm">
          Show my names
        </button>
        {(personal.active || names || date) && (
          <button
            type="button"
            className={ui.textBtn}
            onClick={() => {
              setNames('')
              setDate('')
              personal.clear()
            }}
          >
            Clear
          </button>
        )}
      </div>
    </form>
  )
}
