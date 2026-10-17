'use client'

import { useCallback, useSyncExternalStore } from 'react'

// Tiny localStorage-backed stores shared by the templates pages and the
// showcase: the visitor's own names (optional) and their shortlist.
// Everything stays in this browser; nothing goes into a URL or an account.

function createStore(key, fallback) {
  const listeners = new Set()
  let cache
  let loaded = false

  const read = () => {
    if (loaded) return cache
    loaded = true
    try {
      const raw = window.localStorage.getItem(key)
      cache = raw ? JSON.parse(raw) : fallback
    } catch {
      cache = fallback
    }
    return cache
  }

  const write = (value) => {
    cache = value
    loaded = true
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* private mode or storage blocked — keep it in memory */
    }
    listeners.forEach((l) => l())
  }

  const subscribe = (l) => {
    listeners.add(l)
    const onStorage = (e) => {
      if (e.key === key) {
        loaded = false
        l()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      listeners.delete(l)
      window.removeEventListener('storage', onStorage)
    }
  }

  return { read, write, subscribe, fallback }
}

const personalStore = createStore('nimantran:personal', { names: '', date: '' })
const keptStore = createStore('nimantran:kept', [])

/** The visitor's own names and date. `set({names})` merges; `clear()` resets. */
export function usePersonal() {
  const value = useSyncExternalStore(personalStore.subscribe, personalStore.read, () => personalStore.fallback)
  const set = useCallback((patch) => personalStore.write({ ...personalStore.read(), ...patch }), [])
  const clear = useCallback(() => personalStore.write({ names: '', date: '' }), [])
  const active = Boolean(value.names?.trim() || value.date)
  return { ...value, active, set, clear }
}

/** The shortlist ("kept aside"), as an array of template ids. */
export function useKept() {
  const ids = useSyncExternalStore(keptStore.subscribe, keptStore.read, () => keptStore.fallback)
  const has = useCallback((id) => ids.includes(id), [ids])
  const toggle = useCallback((id) => {
    const cur = keptStore.read()
    keptStore.write(cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])
  }, [])
  const set = useCallback((next) => keptStore.write(next), [])
  return { ids, has, toggle, set }
}

/** Format an <input type="date"> value the way the invitations print dates. */
export function formatInviteDate(value) {
  if (!value) return ''
  const d = new Date(`${value}T00:00:00`)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
