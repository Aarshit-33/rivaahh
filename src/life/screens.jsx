'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from './Icon'

const pad = (n) => String(n).padStart(2, '0')

function StatusBar({ title }) {
  return (
    <div className="ls-status">
      <span>9:41</span>
      <span className="ls-status-title">{title}</span>
      <span className="ls-status-dots">●●●</span>
    </div>
  )
}

/* 08 — the invite itself, with its tabs. */
function ExploreScreen() {
  const [going, setGoing] = useState(true)
  return (
    <>
      <StatusBar title="Nimantran" />
      <div className="ls-arch">
        <Icon name="cake" />
        <span>Joyous 5th</span>
      </div>
      <p className="ls-eyebrow">You are invited</p>
      <h4 className="ls-title">
        Aarav turns <em>5</em>
      </h4>
      <p className="ls-meta">
        Sat, 14 Mar · 4:30 PM onwards
        <br />
        The Glasshouse, Koregaon Park
      </p>
      <motion.button
        type="button"
        className={`ls-btn ${going ? 'ls-btn--maroon' : 'ls-btn--ghost'}`}
        onClick={() => setGoing((g) => !g)}
        whileTap={{ scale: 0.96 }}
      >
        {going ? (
          <>
            <Icon name="check" /> Joyfully attending
          </>
        ) : (
          'Tap to RSVP'
        )}
      </motion.button>
      <p className="ls-note">48 friends &amp; family have replied</p>
      <div className="ls-mini-count" aria-label="23 days, 8 hours, 41 minutes to go">
        {[
          ['23', 'days'],
          ['08', 'hrs'],
          ['41', 'min'],
        ].map(([v, l]) => (
          <span key={l}>
            <b>{v}</b>
            {l}
          </span>
        ))}
      </div>
      <div className="ls-tabs">
        {[
          ['pin', 'Map'],
          ['photo', 'Gallery'],
          ['music', 'Music'],
          ['clock', 'Schedule'],
        ].map(([icon, label]) => (
          <span key={label}>
            <Icon name={icon} />
            {label}
          </span>
        ))}
      </div>
    </>
  )
}

/* 09 — share sheet; the send button actually "sends". */
function ShareScreen() {
  const [state, setState] = useState('idle')
  useEffect(() => {
    if (state !== 'sending') return
    const id = setTimeout(() => setState('sent'), 1400)
    return () => clearTimeout(id)
  }, [state])
  return (
    <>
      <StatusBar title="Share invitation" />
      <div className="ls-wa">
        <p className="ls-wa-head">
          <Icon name="chat" /> WhatsApp preview
        </p>
        <div className="ls-wa-card">
          <span className="ls-wa-icon">
            <Icon name="home" />
          </span>
          <p className="ls-eyebrow">Griha Pravesh</p>
          <h4 className="ls-title ls-title--sm">Mehta Niwas</h4>
          <p className="ls-meta">Sunday, 22 April · 10:00 AM</p>
          <p className="ls-link">nimantran.app/mehta-pravesh</p>
        </div>
      </div>
      <p className="ls-note">Each guest gets their own greeting link</p>
      <div className="ls-groups">
        <p className="ls-eyebrow">Guest list · 120</p>
        <ul>
          {[
            ['Family', 42],
            ['Friends', 51],
            ['Neighbours', 27],
          ].map(([g, n]) => (
            <li key={g}>
              <span>{g}</span>
              <b>{n}</b>
            </li>
          ))}
        </ul>
      </div>
      <motion.button
        type="button"
        className="ls-btn ls-btn--forest"
        onClick={() => setState((s) => (s === 'idle' ? 'sending' : s))}
        whileTap={{ scale: 0.96 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={state}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {state === 'idle' && (
              <>
                <Icon name="send" /> Send to guest list (120)
              </>
            )}
            {state === 'sending' && 'Sending…'}
            {state === 'sent' && (
              <>
                <Icon name="check" /> Sent to 120 guests
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </>
  )
}

/* 10 — RSVP feed that keeps receiving replies while it's on screen. */
const FEED = [
  { i: 'VK', name: 'Vikram & Sunita', note: '2 adults · 1 child', status: 'yes' },
  { i: 'DG', name: 'Divya Grewal', note: '1 adult · Jain meal', status: 'yes' },
  { i: 'RS', name: 'Rohit Sen', note: 'Travelling from Delhi', status: 'maybe' },
  { i: 'TB', name: 'Tanvi & Kabir', note: '2 adults', status: 'yes' },
]
const INCOMING = [
  { i: 'AM', name: 'Anjali Mehra', note: '2 adults · veg', status: 'yes' },
  { i: 'PK', name: 'Pranav Kulkarni', note: '1 adult', status: 'yes' },
  { i: 'NS', name: 'Nisha Shah', note: 'Will confirm by Friday', status: 'maybe' },
  { i: 'HJ', name: 'Harleen & Jas', note: '2 adults · 2 kids', status: 'yes' },
]

// Replies keep arriving only while chapter 10 is on screen.
export function useRsvpFeed(active) {
  const [rows, setRows] = useState(FEED)
  const [next, setNext] = useState(0)
  useEffect(() => {
    if (!active || next >= INCOMING.length) return
    const id = setTimeout(() => {
      setRows((r) => [INCOMING[next], ...r].slice(0, 6))
      setNext((n) => n + 1)
    }, 2400)
    return () => clearTimeout(id)
  }, [active, next])
  const arrived = INCOMING.slice(0, next)
  return {
    rows,
    yes: arrived.filter((r) => r.status === 'yes').length,
    maybe: arrived.filter((r) => r.status === 'maybe').length,
    arrived: next,
  }
}

function RsvpScreen({ feed }) {
  return (
    <>
      <StatusBar title="RSVP feed" />
      <div className="ls-feed-head">
        <span className="ls-eyebrow">Riya &amp; Siddharth · Engagement</span>
        <span className="ls-live">Live</span>
      </div>
      <ul className="ls-feed">
        <AnimatePresence initial={false}>
          {feed.rows.map((r) => (
            <motion.li
              key={r.name}
              layout
              initial={{ opacity: 0, y: -14, backgroundColor: 'rgba(176,141,87,0.25)' }}
              animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(176,141,87,0)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="ls-avatar">{r.i}</span>
              <span className="ls-feed-text">
                {r.name}
                <small>{r.note}</small>
              </span>
              {r.status === 'yes' ? (
                <span className="ls-yes">
                  <Icon name="check" />
                </span>
              ) : (
                <span className="ls-maybe">Maybe</span>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <p className="ls-export">
        Export caterer summary <span>PDF</span>
      </p>
    </>
  )
}

/* 11 — day-of companion with a live countdown. */
function DayOfScreen() {
  const [left, setLeft] = useState(2 * 3600)
  useEffect(() => {
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <>
      <StatusBar title="Day of celebration" />
      <div className="ls-live-card">
        <p className="ls-eyebrow ls-eyebrow--light">Live status</p>
        <p className="ls-countdown">
          Starts in {Math.floor(left / 3600)}h {pad(Math.floor((left % 3600) / 60))}m {pad(left % 60)}s
        </p>
        <p className="ls-meta ls-meta--light">Doors open at 4:00 PM</p>
      </div>
      <div className="ls-row">
        <Icon name="nav" />
        <span>
          The Pavilion Lawn
          <small>12 min drive · turn left at Gate 2</small>
        </span>
      </div>
      <button type="button" className="ls-btn ls-btn--maroon">
        <Icon name="pin" /> Get directions
      </button>
      <ol className="ls-timeline">
        <li className="is-done">
          <b>4:00</b> Doors open
        </li>
        <li className="is-now">
          <b>4:15</b> Welcome blessings &amp; games
        </li>
        <li>
          <b>5:30</b> Godh bharai rituals
        </li>
        <li>
          <b>7:00</b> Dinner on the lawn
        </li>
      </ol>
      <p className="ls-note">
        <Icon name="phone" /> Tap to call the host
      </p>
    </>
  )
}

/* 12 — the keepsake vault. */
function MemoriesScreen() {
  const [playing, setPlaying] = useState(false)
  return (
    <>
      <StatusBar title="Keepsake vault" />
      <button type="button" className="ls-video" onClick={() => setPlaying((p) => !p)}>
        <span className="ls-video-play">
          <Icon name={playing ? 'pause' : 'play'} />
        </span>
        <span className="ls-video-cap">25th anniversary highlights · 03:42</span>
        {playing && (
          <motion.span
            className="ls-video-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 12, ease: 'linear' }}
          />
        )}
      </button>
      <div className="ls-grid">
        <span className="ls-tile ls-tile--a" />
        <span className="ls-tile ls-tile--b" />
        <span className="ls-tile ls-tile--more">+146</span>
      </div>
      <p className="ls-quote">“Thank you for sharing 25 golden years with us.” — S &amp; R</p>
      <div className="ls-wishes">
        <p className="ls-eyebrow">Guest wishes · 64</p>
        <p className="ls-wish">
          Happy 25th, Maasi &amp; Mausaji! <span>— Priya</span>
        </p>
        <p className="ls-wish">
          To the next twenty-five. <span>— The Kapoors</span>
        </p>
      </div>
      <button type="button" className="ls-btn ls-btn--forest">
        <Icon name="download" /> Download memory album
      </button>
    </>
  )
}

export const SCREENS = {
  explore: ExploreScreen,
  share: ShareScreen,
  rsvp: RsvpScreen,
  dayof: DayOfScreen,
  memories: MemoriesScreen,
}
