'use client'

import { useSyncExternalStore } from 'react'
import s from './showcase.module.css'

const KEY = 'nimantran:showcase-seen'
let firstVisit = null

// Read once per page load: was this the visitor's first showcase? The flag is
// set as soon as it is read, so the note shows on the first visit only.
function read() {
  if (firstVisit !== null) return firstVisit
  try {
    firstVisit = !window.localStorage.getItem(KEY)
    window.localStorage.setItem(KEY, '1')
  } catch {
    firstVisit = false
  }
  return firstVisit
}

const subscribe = () => () => {}

/** "Scroll the programme. The stage follows." — handwritten, first visit only. */
export default function FirstVisitNote() {
  const show = useSyncExternalStore(subscribe, read, () => false)
  if (!show) return null
  return <p className={s.firstNote}>Scroll the programme. The stage follows.</p>
}
