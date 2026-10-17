'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { getTemplate } from '@/templates/data'
import { formatInviteDate, usePersonal } from '@/lib/stores'

const ShowcaseContext = createContext(null)

export const useShowcase = () => useContext(ShowcaseContext)

// A media query as external state: false on the server and during hydration.
function useMedia(query) {
  return useSyncExternalStore(
    useCallback(
      (onChange) => {
        const mq = window.matchMedia(query)
        mq.addEventListener('change', onChange)
        return () => mq.removeEventListener('change', onChange)
      },
      [query],
    ),
    () => window.matchMedia(query).matches,
    () => false,
  )
}

// The stage's opening view for this screen. Phones and landscape tablets where
// the laptop would be drawn under ~480px wide open on the Phone view; desktop
// and portrait tablets open on Both.
function defaultView() {
  const w = window.innerWidth
  const h = window.innerHeight
  if (w < 768) return 'phone'
  if (w >= 1200 || h >= w) return 'both'
  const stage = w * 0.52
  const safe = Math.min(64, Math.max(32, w * 0.04))
  const u = Math.min(stage - 2 * safe, (h - 136 - 112) / 0.64)
  return 0.72 * u < 480 ? 'phone' : 'both'
}

const subscribeResize = (onChange) => {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}

/**
 * Shared state for one template's showcase: which colourway is on, which part
 * of the invitation is on stage, the stage view (both / phone / laptop),
 * playback, and the full-screen demo. The stage, the karyakram, the title
 * actions and the demo all read it.
 */
export function ShowcaseProvider({ id, children }) {
  const base = getTemplate(id)
  const [theme, setTheme] = useState(base.theme)
  const [viewChoice, setView] = useState(null)
  const [shown, setShown] = useState('cover')
  const [playChoice, setPlaying] = useState(null)
  const [take, setTake] = useState(0)
  const [demo, setDemo] = useState(null) // null | { opener: HTMLElement | null }
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const hydratedMotion = useMedia('(prefers-reduced-motion: no-preference)')
  const startView = useSyncExternalStore(subscribeResize, defaultView, () => 'both')
  const masterRef = useRef(null)
  const personal = usePersonal()

  const template = useMemo(() => ({ ...base, theme }), [base, theme])
  const isReel = base.format === 'reel'

  // Reels play on arrival unless the visitor prefers less motion. Where the
  // laptop would be too small to read, the stage starts on the Phone view.
  const playing = playChoice ?? (isReel && hydratedMotion)
  const view = viewChoice ?? startView

  const goTo = useCallback(
    (part) => {
      masterRef.current?.scrollToPart(part, !reduced)
      setShown(part)
    },
    [reduced],
  )

  const restart = useCallback(() => {
    setTake((n) => n + 1)
    setShown('cover')
    setPlaying(null)
  }, [])

  const openDemo = useCallback((opener) => setDemo({ opener: opener ?? null }), [])
  const closeDemo = useCallback(() => setDemo(null), [])

  const value = {
    base,
    template,
    theme,
    setTheme,
    view,
    setView,
    shown,
    setShown,
    goTo,
    playing,
    setPlaying,
    take,
    restart,
    isReel,
    reduced,
    masterRef,
    names: personal.names,
    date: formatInviteDate(personal.date),
    personal,
    demo,
    openDemo,
    closeDemo,
  }

  return <ShowcaseContext.Provider value={value}>{children}</ShowcaseContext.Provider>
}
