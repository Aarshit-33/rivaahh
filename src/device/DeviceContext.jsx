'use client'

import { createContext, useContext, useRef, useState } from 'react'
import { CHAPTERS } from '../life/chapters'
import { useRsvpFeed } from '../life/screens'

// One phone travels the whole page. The hero animates its arrival through `parts`;
// the life section decides which screen it shows through `active`; "Make it yours"
// writes the visitor's own details into `make`.
const DeviceContext = createContext(null)

export function DeviceProvider({ children }) {
  const [active, setActive] = useState(0)
  const [make, setMake] = useState({ names: '', date: '', city: '', theme: 'royal' })
  const feed = useRsvpFeed(CHAPTERS[active].id === 'rsvp')
  const parts = {
    glow: useRef(null),
    outline: useRef(null),
    outlineRect: useRef(null),
    body: useRef(null),
    screen: useRef(null),
    content: useRef(null),
  }
  return <DeviceContext.Provider value={{ active, setActive, feed, parts, make, setMake }}>{children}</DeviceContext.Provider>
}

export const useDevice = () => useContext(DeviceContext)
