'use client'

import { AnimatePresence, motion } from 'motion/react'
import s from './OccasionBackdrop.module.css'

// The home "Occasions" section dresses itself for the occasion picked:
// a birthday bunting, marigold garlands, a mango-leaf toran, a coming-soon
// nursery, anniversary rings, or the red-and-yellow kalava thread.
// Everything is decorative (aria-hidden) and drawn in SVG.

const sag = (x, top = 18, depth = 46) => top + depth * Math.sin((Math.PI * x) / 1440)
const r1 = (n) => Math.round(n * 10) / 10

/* ───────── Birthday: a "HAPPY BIRTHDAY" bunting toran ───────── */

const FLAG_COLOURS = ['#6b1e2e', '#b08d57', '#e8c1b4', '#1f3b2d']

function Birthday() {
  const letters = 'HAPPY BIRTHDAY'.split('')
  const step = 1160 / (letters.length - 1)
  const confetti = Array.from({ length: 34 }, (_, i) => ({
    x: 680 + ((i * 211) % 760),
    y: 170 + ((i * 97) % 600),
    r: 3 + (i % 3),
    c: FLAG_COLOURS[i % 4],
  }))
  return (
    <>
      <div className={s.tint} style={{ background: 'radial-gradient(70% 60% at 80% 40%, rgba(232,193,180,0.45), rgba(232,193,180,0) 70%)' }} />
      <svg className={`${s.strip} ${s.sway}`} viewBox="0 0 1440 170" preserveAspectRatio="xMidYMin slice">
        <path d={`M0 ${sag(0)} Q720 ${sag(720) * 2 - 18} 1440 ${sag(1440)}`} className={s.string} />
        {letters.map((ch, i) => {
          if (ch === ' ') return null
          const x = 140 + i * step
          const y = r1(sag(x))
          const c = FLAG_COLOURS[i % 4]
          const light = c === '#e8c1b4' || c === '#b08d57'
          return (
            <g key={i}>
              <path d={`M${r1(x - 30)} ${y} L${r1(x + 30)} ${y} L${r1(x)} ${r1(y + 70)} Z`} fill={c} />
              <text x={r1(x)} y={r1(y + 32)} textAnchor="middle" className={s.flagLetter} fill={light ? '#3f0e1a' : '#fbf6ec'}>
                {ch}
              </text>
            </g>
          )
        })}
      </svg>
      <svg className={s.field} viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
        {confetti.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} opacity="0.35" />
        ))}
        {[
          [1340, 520, '#6b1e2e'],
          [1290, 600, '#b08d57'],
          [1385, 640, '#e8c1b4'],
        ].map(([x, y, c]) => (
          <g key={x} opacity="0.4">
            <ellipse cx={x} cy={y} rx="34" ry="42" fill={c} />
            <path d={`M${x} ${y + 42} q-8 40 6 90`} fill="none" stroke="#8a6a38" strokeWidth="1.5" />
          </g>
        ))}
      </svg>
    </>
  )
}

/* ───────── Wedding: marigold (genda) garlands ───────── */

function Marigold({ x, y, r = 11 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#e8892b" />
      <circle cx={x} cy={y} r={r * 0.62} fill="#f2b63c" />
      <circle cx={x} cy={y} r={r * 0.22} fill="#c7681c" />
    </g>
  )
}

function Wedding() {
  const swag = []
  for (let x = 0; x <= 1440; x += 26) {
    const local = x % 360
    swag.push({ x, y: r1(10 + 60 * Math.sin((Math.PI * local) / 360)) })
  }
  const strands = [0, 360, 720, 1080, 1440]
  return (
    <>
      <div className={s.tint} style={{ background: 'radial-gradient(70% 60% at 80% 35%, rgba(242,182,60,0.22), rgba(242,182,60,0) 70%)' }} />
      <svg className={`${s.strip} ${s.stripTall} ${s.sway}`} viewBox="0 0 1440 300" preserveAspectRatio="xMidYMin slice">
        {swag.map((p, i) =>
          i % 4 === 2 ? (
            <path key={`l${i}`} d={`M${p.x} ${p.y + 8} q-10 14 -2 26 q10 -10 2 -26z`} fill="#4f7a3a" />
          ) : null,
        )}
        {swag.map((p, i) => (
          <Marigold key={i} x={p.x} y={p.y} />
        ))}
        {strands.map((x) =>
          Array.from({ length: 8 }, (_, k) => <Marigold key={`${x}-${k}`} x={x} y={18 + k * 24} r={10} />),
        )}
        {strands.map((x) => (
          <path key={`t${x}`} d={`M${x - 8} 210 L${x + 8} 210 L${x} 236 Z`} fill="#b08d57" />
        ))}
      </svg>
      <p className={`${s.script} ${s.scriptRight}`}>Shubh Vivah</p>
    </>
  )
}

/* ───────── Griha Pravesh: mango-leaf toran, kalash and kumkum steps ───────── */

function GrihaPravesh() {
  const leaves = Array.from({ length: 25 }, (_, i) => 30 + i * 57.5)
  return (
    <>
      <div className={s.tint} style={{ background: 'radial-gradient(70% 60% at 80% 40%, rgba(176,141,87,0.22), rgba(176,141,87,0) 70%)' }} />
      <svg className={`${s.strip} ${s.sway}`} viewBox="0 0 1440 170" preserveAspectRatio="xMidYMin slice">
        <path d="M0 22 Q720 52 1440 22" className={s.stringGold} />
        {leaves.map((x, i) => {
          const y = r1(22 + 30 * Math.sin((Math.PI * x) / 1440))
          return i % 2 ? (
            <Marigold key={i} x={r1(x)} y={y + 6} r={9} />
          ) : (
            <g key={i} transform={`translate(${r1(x)} ${y}) rotate(${(i % 4) - 1.5})`}>
              <path d="M0 0 C 18 22 16 70 0 96 C -16 70 -18 22 0 0 Z" fill="#3f6b3a" />
              <path d="M0 4 L0 90" stroke="#9cc07f" strokeWidth="1.4" />
            </g>
          )
        })}
      </svg>
      <svg className={s.field} viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
        <g transform="translate(1280 560)" opacity="0.32">
          <path d="M-70 40 C-90 -40 90 -40 70 40 C60 110 -60 110 -70 40 Z" fill="#b08d57" />
          <rect x="-46" y="-30" width="92" height="16" rx="6" fill="#8a6a38" />
          <ellipse cx="0" cy="-58" rx="30" ry="34" fill="#8a5a2b" />
          {[-60, -30, 0, 30, 60].map((a) => (
            <path key={a} d="M0 -40 C 12 -70 10 -110 0 -130 C -10 -110 -12 -70 0 -40 Z" fill="#3f6b3a" transform={`rotate(${a} 0 -40)`} />
          ))}
          <path d="M-36 40 H36" stroke="#6b1e2e" strokeWidth="4" />
        </g>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${520 + i * 80} ${790 - i * 26}) rotate(70)`} opacity="0.3" fill="#a3283b">
            <ellipse cx="-14" cy="0" rx="10" ry="18" />
            <ellipse cx="14" cy="-26" rx="10" ry="18" />
          </g>
        ))}
      </svg>
      <p className={`${s.script} ${s.scriptRight}`}>Shubh Griha Pravesh</p>
    </>
  )
}

/* ───────── Baby shower: boy or girl, coming soon ───────── */

function Baby() {
  const stars = Array.from({ length: 18 }, (_, i) => ({ x: 120 + ((i * 263) % 1300), y: 90 + ((i * 131) % 640) }))
  return (
    <>
      <div
        className={s.tint}
        style={{
          background:
            'radial-gradient(50% 60% at 62% 45%, rgba(176,205,232,0.45), rgba(176,205,232,0) 70%), radial-gradient(50% 60% at 92% 60%, rgba(244,190,205,0.5), rgba(244,190,205,0) 70%)',
        }}
      />
      <svg className={s.field} viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
        {[
          [980, 120, 1],
          [1300, 210, 0.8],
          [760, 690, 0.9],
        ].map(([x, y, k]) => (
          <path
            key={x}
            transform={`translate(${x} ${y}) scale(${k})`}
            d="M-60 20 a30 30 0 0 1 20 -40 a40 40 0 0 1 70 -6 a28 28 0 0 1 40 26 a20 20 0 0 1 -6 40 h-110 a22 22 0 0 1 -14 -20z"
            fill="#fbf6ec"
            opacity="0.85"
          />
        ))}
        {stars.map((p, i) => (
          <path
            key={i}
            transform={`translate(${p.x} ${p.y}) scale(${0.6 + (i % 3) * 0.3})`}
            d="M0 -10 L2.5 -2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5 -2.5 Z"
            fill={i % 2 ? '#8fb3d9' : '#e9a3b8'}
            opacity="0.6"
          />
        ))}
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${1150 + i * 60} ${700 - i * 50}) rotate(-20)`} opacity="0.35" fill="#8a6a38">
            <ellipse cx="0" cy="0" rx="9" ry="14" />
            {[-7, -2, 3, 8].map((dx, k) => (
              <circle key={k} cx={dx} cy={-18 - (k === 0 ? 0 : 1)} r="2.6" />
            ))}
          </g>
        ))}
      </svg>
      <div className={s.babyWords}>
        <p className={s.babyLine}>
          <span className={s.babyBoy}>Boy</span> <span className={s.babyOr}>or</span>{' '}
          <span className={s.babyGirl}>girl?</span>
        </p>
        <span className={s.babySoon}>Coming soon</span>
      </div>
    </>
  )
}

/* ───────── Anniversary: interlocked rings and hearts ───────── */

function Anniversary() {
  const hearts = Array.from({ length: 14 }, (_, i) => ({ x: 700 + ((i * 157) % 720), y: 80 + ((i * 113) % 660), k: 0.6 + (i % 3) * 0.35 }))
  return (
    <>
      <div className={s.tint} style={{ background: 'radial-gradient(70% 60% at 80% 40%, rgba(243,220,174,0.5), rgba(243,220,174,0) 70%)' }} />
      <svg className={s.field} viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
        <g opacity="0.32" fill="none" strokeWidth="10">
          <circle cx="1260" cy="700" r="96" stroke="#b08d57" />
          <circle cx="1366" cy="700" r="96" stroke="#d9b97a" />
          <path d="M1334 588 l12 -24 l12 24" stroke="#b08d57" strokeWidth="4" />
        </g>
        {hearts.map((h, i) => (
          <path
            key={i}
            className={s.float}
            style={{ animationDelay: `${(i % 5) * 0.8}s` }}
            transform={`translate(${h.x} ${h.y}) scale(${h.k})`}
            d="M0 6 C -14 -6 -8 -18 0 -10 C 8 -18 14 -6 0 6 Z"
            fill={i % 2 ? '#6b1e2e' : '#e8c1b4'}
            opacity="0.45"
          />
        ))}
      </svg>
      <p className={`${s.script} ${s.scriptRight}`}>Happy Anniversary</p>
    </>
  )
}

/* ───────── Pooja & festivals: the kalava (mauli) thread ───────── */

function Kalava({ d }) {
  return (
    <g>
      <path d={d} fill="none" stroke="#b3212f" strokeWidth="14" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#f2b63c" strokeWidth="14" strokeDasharray="7 11" strokeLinecap="butt" />
      <path d={d} fill="none" stroke="#e8892b" strokeWidth="4" strokeDasharray="3 15" strokeDashoffset="6" />
    </g>
  )
}

function Pooja() {
  return (
    <>
      <div className={s.tint} style={{ background: 'radial-gradient(70% 60% at 80% 40%, rgba(232,137,43,0.16), rgba(232,137,43,0) 70%)' }} />
      <svg className={s.field} viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
        <g opacity="0.75">
          <Kalava d="M-40 120 C 110 80 220 30 330 -30" />
          <Kalava d="M-40 150 C 120 108 240 56 360 -10" />
          <Kalava d="M960 860 C 1110 720 1260 640 1490 600" />
          <Kalava d="M990 880 C 1140 750 1290 670 1500 634" />
          {/* Tasselled ends where the threads are tied. */}
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M1090 742 l${-30 + i * 14} 64`} stroke={i % 2 ? '#f2b63c' : '#b3212f'} strokeWidth="3" />
          ))}
        </g>
        {Array.from({ length: 7 }, (_, i) => 740 + i * 100).map((x) => (
          <g key={x} transform={`translate(${x} 770)`} opacity="0.45">
            <path d="M-26 0 Q0 22 26 0 Z" fill="#b08d57" />
            <path className={s.flame} d="M0 -4 C 8 -14 4 -26 0 -34 C -4 -26 -8 -14 0 -4 Z" fill="#f2b63c" />
          </g>
        ))}
      </svg>
      <p className={`${s.script} ${s.scriptRight}`}>Shubh</p>
    </>
  )
}

const THEMES = {
  birthday: Birthday,
  wedding: Wedding,
  griha: GrihaPravesh,
  baby: Baby,
  anniversary: Anniversary,
  pooja: Pooja,
}

export default function OccasionBackdrop({ id }) {
  const Theme = THEMES[id]
  return (
    <div className={s.backdrop} aria-hidden="true">
      <AnimatePresence initial={false}>
        <motion.div
          key={id}
          className={s.layer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, transition: { duration: 0.45 } }}
        >
          {Theme && <Theme />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
