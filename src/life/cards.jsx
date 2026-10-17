'use client'

import { useEffect, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import Icon from './Icon'

// Each card enters from slightly further out than it rests, so the set appears
// to gather around the phone. `pos` is a CSS class placing it relative to the phone.
const cardMotion = (i, r = 0) => ({
  initial: { opacity: 0, scale: 0.9, rotate: r - 4, y: 18 },
  animate: { opacity: 1, scale: 1, rotate: r, y: 0, transition: { delay: 0.12 + i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.94, y: -12, transition: { duration: 0.25 } },
})

function Card({ pos, i, r, mobile = false, className = '', children }) {
  return (
    <motion.div className={`fc ${pos} ${mobile ? 'fc--mobile' : ''} ${className}`} {...cardMotion(i, r)}>
      {children}
    </motion.div>
  )
}

function CountUp({ to, duration = 1.6 }) {
  const v = useMotionValue(0)
  const rounded = useTransform(v, (x) => Math.round(x))
  useEffect(() => {
    const c = animate(v, to, { duration, ease: [0.22, 1, 0.36, 1] })
    return () => c.stop()
  }, [to, duration, v])
  return <motion.span>{rounded}</motion.span>
}

/* 08 */
const PHOTOS = ['Aarav at 1', 'Aarav at 2', 'Aarav at 3', 'Aarav at 4', 'First steps', 'Cake face']

function ExploreCards() {
  const [playing, setPlaying] = useState(true)
  const [photo, setPhoto] = useState(0)
  return (
    <>
      <Card pos="fc--tl" i={0} r={-3} mobile>
        <div className="fc-row">
          <button type="button" className="fc-play" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause' : 'Play'}>
            <Icon name={playing ? 'pause' : 'play'} />
          </button>
          <span>
            <strong>Happy Birthday · Sitar</strong>
            <small>{playing ? 'Playing softly' : 'Paused'}</small>
          </span>
        </div>
      </Card>
      <Card pos="fc--tr" i={1} r={3}>
        <p className="fc-label">
          Photo keepsake <span>{photo + 1} of 6</span>
        </p>
        <button type="button" className="fc-photo" onClick={() => setPhoto((p) => (p + 1) % PHOTOS.length)}>
          <Icon name="camera" />
          <span>{PHOTOS[photo]}</span>
          <small>Tap for next</small>
        </button>
      </Card>
      <Card pos="fc--bl" i={2} r={2}>
        <div className="fc-row">
          <span className="fc-icon">
            <Icon name="pin" />
          </span>
          <span>
            <strong>The Glasshouse</strong>
            <small>Koregaon Park, Pune</small>
          </span>
        </div>
        <p className="fc-link">Open in Google Maps ↗</p>
      </Card>
      <Card pos="fc--br" i={3} r={-2} mobile>
        <p className="fc-label">Celebration schedule</p>
        <ul className="fc-list">
          <li>
            <b>4:30</b> Cake cutting &amp; chaat
          </li>
          <li>
            <b>5:00</b> Grand magic show
          </li>
          <li>
            <b>6:30</b> Festive dinner
          </li>
        </ul>
      </Card>
    </>
  )
}

/* 09 — guests orbit the phone; gold trails draw out to each of them. */
const GUESTS = [
  // [initials, name, x%, y%, shown on phones]
  ['AM', 'Anand M.', 14, 16, true],
  ['PK', 'Pooja K.', 7, 44, false],
  ['RS', 'Rahul S.', 13, 70, false],
  ['SM', 'Suresh M.', 86, 18, false],
  ['NJ', 'Neelam J.', 93, 48, true],
  ['VD', 'Vikram D.', 85, 80, true],
]

// Trails leave from the phone's edge (it sits above this layer, so they must not cross it).
const trail = (x, y) => {
  const sx = x < 50 ? 33 : 67
  const sy = Math.min(78, Math.max(22, y))
  return `M${sx} ${sy} Q ${(sx + x) / 2} ${y < 50 ? y - 8 : y + 8} ${x} ${y}`
}

function ShareCards() {
  return (
    <>
      <svg className="fc-trails" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {GUESTS.map(([id, , x, y, onPhone], i) => (
          <motion.path
            key={id}
            className={onPhone ? undefined : 'fc-desk-only'}
            d={trail(x, y)}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1, transition: { delay: 0.3 + i * 0.12, duration: 0.9 } }}
            exit={{ opacity: 0 }}
          />
        ))}
      </svg>
      {GUESTS.map(([id, name, x, y, onPhone], i) => (
        <motion.div
          key={id}
          className={`fc-guest ${onPhone ? '' : 'fc-desk-only'}`}
          style={{ left: `${x}%`, top: `${y}%` }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.9 + i * 0.12, type: 'spring', stiffness: 260, damping: 18 } }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <span className="fc-guest-dot">{id}</span>
          <span className="fc-guest-name">{name}</span>
          <span className="fc-guest-tick">
            <Icon name="check" />
          </span>
        </motion.div>
      ))}
      <Card pos="fc--bl fc--low" i={2} r={-2} mobile>
        <div className="fc-row">
          <span className="fc-icon fc-icon--forest">
            <Icon name="send" />
          </span>
          <span>
            <strong>
              Sent to <CountUp to={120} /> guests
            </strong>
            <small>All delivered via WhatsApp</small>
          </span>
        </div>
      </Card>
    </>
  )
}

/* 10 */
function RsvpCards({ feed }) {
  const attending = 92 + feed.yes
  const maybe = 12 + feed.maybe
  const pending = 12 - feed.arrived
  const total = attending + maybe + pending
  return (
    <>
      <Card pos="fc--tl" i={0} r={-2} mobile>
        <p className="fc-label">
          Live tally <span className="fc-pill">{Math.round((attending / total) * 100)}% confirmed</span>
        </p>
        <p className="fc-tally">
          <b>{attending}</b> attending · <b>{maybe}</b> maybe · <b>{pending}</b> pending
        </p>
        <div className="fc-bar" aria-hidden="true">
          <motion.span className="fc-bar-yes" animate={{ flexGrow: attending }} transition={{ duration: 0.6 }} />
          <motion.span className="fc-bar-maybe" animate={{ flexGrow: maybe }} transition={{ duration: 0.6 }} />
          <motion.span className="fc-bar-wait" animate={{ flexGrow: pending }} transition={{ duration: 0.6 }} />
        </div>
      </Card>
      <Card pos="fc--br" i={1} r={3} className="fc--paper">
        <p className="fc-label">The old way · pen &amp; paper</p>
        <p className="fc-hand">
          <s>Call everyone to confirm — 3 times</s>
        </p>
        <p className="fc-hand">
          <s>Address notes stuck on the fridge</s>
        </p>
        <p className="fc-ok">
          <Icon name="check" /> Handled by Nimantran
        </p>
      </Card>
    </>
  )
}

/* 11 */
function DayOfCards() {
  return (
    <>
      <Card pos="fc--tr" i={0} r={2} mobile>
        <div className="fc-row">
          <span className="fc-icon fc-icon--gold">
            <Icon name="sun" />
          </span>
          <span>
            <strong>Clear, 26°C</strong>
            <small>Pleasant evening on the lawn</small>
          </span>
        </div>
      </Card>
      <Card pos="fc--bl" i={1} r={-2} mobile>
        <div className="fc-row">
          <span className="fc-icon">
            <Icon name="parking" />
          </span>
          <span>
            <strong>Complimentary valet</strong>
            <small>Enter via North Gate 2, Main Ring Road</small>
          </span>
        </div>
      </Card>
    </>
  )
}

/* 12 — polaroids drift around the vault. */
function MemoryCards() {
  return (
    <>
      <Card pos="fc--tl fc--polaroid" i={0} r={-6} mobile>
        <span className="fc-snap fc-snap--a" />
        <p>The toast &amp; sangeet</p>
      </Card>
      <Card pos="fc--tr fc--polaroid" i={1} r={5}>
        <span className="fc-snap fc-snap--b" />
        <p>Garland exchange</p>
      </Card>
      <Card pos="fc--bl fc--polaroid" i={2} r={4}>
        <span className="fc-snap fc-snap--c" />
        <p>3 generations together</p>
      </Card>
      <Card pos="fc--br" i={3} r={-2} mobile>
        <div className="fc-row">
          <span className="fc-icon fc-icon--forest">
            <Icon name="photo" />
          </span>
          <span>
            <strong>
              <CountUp to={148} /> photos shared
            </strong>
            <small>by 38 guests</small>
          </span>
        </div>
      </Card>
    </>
  )
}

export const CARDS = {
  explore: ExploreCards,
  share: ShareCards,
  rsvp: RsvpCards,
  dayof: DayOfCards,
  memories: MemoryCards,
}
