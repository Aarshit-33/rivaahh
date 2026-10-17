'use client'

import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { parseFilters, serializeFilters } from './filters'

// The query string as a tiny external store. Reading it this way keeps the
// server render (and hydration) on the default view, then switches to the
// URL's filters on the client without useSearchParams' Suspense boundary.

const listeners = new Set()

function subscribe(l) {
  listeners.add(l)
  window.addEventListener('popstate', l)
  return () => {
    listeners.delete(l)
    window.removeEventListener('popstate', l)
  }
}

const getSearch = () => window.location.search
const getServerSearch = () => ''

export function useSearch() {
  return useSyncExternalStore(subscribe, getSearch, getServerSearch)
}

/** Replace the query string in place (no navigation, no history entry). */
export function replaceSearch(query) {
  const clean = query.replace(/%2C/g, ',')
  const url = `${window.location.pathname}${clean ? `?${clean}` : ''}${window.location.hash}`
  window.history.replaceState(null, '', url)
  listeners.forEach((l) => l())
}

/** Set or remove single query params, keeping everything else. */
export function setParams(patch) {
  const q = new URLSearchParams(window.location.search)
  for (const [k, v] of Object.entries(patch)) {
    if (v == null || v === '') q.delete(k)
    else q.set(k, v)
  }
  replaceSearch(q.toString())
}

const FILTER_KEYS = ['occasion', 'format', 'tradition', 'style', 'colour', 'motif', 'sort']

/**
 * Filters that live in the URL. `defaults` must be a module-level constant.
 * Returns [filters, setFilters, search].
 */
export function useUrlFilters(defaults) {
  const search = useSearch()
  const filters = useMemo(() => parseFilters(search, defaults), [search, defaults])
  const setFilters = useCallback(
    (next) => {
      const cur = parseFilters(window.location.search, defaults)
      const value = typeof next === 'function' ? next(cur) : next
      const q = new URLSearchParams(window.location.search)
      FILTER_KEYS.forEach((k) => q.delete(k))
      new URLSearchParams(serializeFilters(value, defaults)).forEach((v, k) => q.set(k, v))
      replaceSearch(q.toString())
    },
    [defaults],
  )
  return [filters, setFilters, search]
}

function subscribeMedia(query) {
  return (l) => {
    const m = window.matchMedia(query)
    m.addEventListener('change', l)
    return () => m.removeEventListener('change', l)
  }
}

/** A media query as state (false on the server). */
export function useMedia(query) {
  const sub = useMemo(() => subscribeMedia(query), [query])
  return useSyncExternalStore(
    sub,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const usePhone = () => useMedia('(max-width: 767px)')
export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')

// Was there a shortlist or names when this page first loaded? Read once per
// page load, so hearting something now never turns into "welcome back".
let returning = null
const readReturning = () => {
  if (returning === null) {
    try {
      const kept = JSON.parse(window.localStorage.getItem('nimantran:kept') || '[]')
      const p = JSON.parse(window.localStorage.getItem('nimantran:personal') || '{}')
      returning = kept.length > 0 ? 'kept' : p.names?.trim() || p.date ? 'names' : ''
    } catch {
      returning = ''
    }
  }
  return returning
}
const noopSubscribe = () => () => {}

/** 'kept' | 'names' | '' — what a returning visitor left here last time. */
export function useReturning() {
  return useSyncExternalStore(noopSubscribe, readReturning, () => '')
}
