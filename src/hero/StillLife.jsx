'use client'

import { motion } from 'motion/react'

const DATES = Array.from({ length: 31 }, (_, i) => i + 1)

function Calendar() {
  return (
    <svg className="sl-calendar" viewBox="0 0 260 230" aria-hidden="true">
      <path d="M22 220 L40 34 L220 34 L238 220 Z" fill="#E9DCC4" />
      <rect x="30" y="40" width="200" height="176" rx="3" fill="#FBF6EC" stroke="#E2D2B6" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={48 + i * 23} y="30" width="5" height="18" rx="2.5" fill="#B08D57" />
      ))}
      <text x="130" y="76" textAnchor="middle" className="sl-cal-month">
        MARCH
      </text>
      {DATES.map((d, i) => (
        <text
          key={d}
          x={52 + (i % 7) * 26}
          y={102 + Math.floor(i / 7) * 22}
          textAnchor="middle"
          className="sl-cal-date"
        >
          {d}
        </text>
      ))}
      <motion.path
        d="M207 109 C 194 108, 187 116, 189 124 C 192 134, 212 136, 222 128 C 230 120, 224 106, 208 105 C 201 105, 195 109, 193 112"
        fill="none"
        stroke="#6B1E2E"
        strokeWidth="2.4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.9, duration: 1.1, ease: 'easeInOut' }}
      />
    </svg>
  )
}

function InkPot() {
  return (
    <svg className="sl-inkpot" viewBox="0 0 120 150" aria-hidden="true">
      <defs>
        <linearGradient id="inkGlass" x1="0" x2="1">
          <stop offset="0" stopColor="#3a1418" />
          <stop offset="0.45" stopColor="#5a1b25" />
          <stop offset="1" stopColor="#24090d" />
        </linearGradient>
        <linearGradient id="inkCap" x1="0" x2="1">
          <stop offset="0" stopColor="#8a6a38" />
          <stop offset="0.5" stopColor="#d9b97a" />
          <stop offset="1" stopColor="#7a5a2c" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="142" rx="50" ry="6" fill="rgba(60,30,15,0.18)" />
      <rect x="12" y="52" width="96" height="88" rx="14" fill="url(#inkGlass)" />
      <rect x="20" y="60" width="10" height="70" rx="5" fill="rgba(255,230,220,0.18)" />
      <rect x="38" y="36" width="44" height="20" rx="3" fill="#2a0c10" />
      <rect x="34" y="8" width="52" height="32" rx="4" fill="url(#inkCap)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={40 + i * 9} y="12" width="2" height="24" fill="rgba(80,55,20,0.35)" />
      ))}
      <rect x="34" y="88" width="52" height="26" rx="2" fill="#F3E8D4" />
      <text x="60" y="105" textAnchor="middle" className="sl-ink-label">
        INK
      </text>
    </svg>
  )
}

function Pen() {
  return (
    <svg className="sl-pen" viewBox="0 0 440 60" aria-hidden="true">
      <defs>
        <linearGradient id="penBarrel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8e2a3b" />
          <stop offset="0.45" stopColor="#5d1322" />
          <stop offset="1" stopColor="#3a0a14" />
        </linearGradient>
        <linearGradient id="penGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8cc8e" />
          <stop offset="1" stopColor="#9b7840" />
        </linearGradient>
      </defs>
      <ellipse cx="220" cy="50" rx="200" ry="5" fill="rgba(60,30,15,0.15)" />
      <rect x="20" y="16" width="250" height="24" rx="12" fill="url(#penBarrel)" />
      <rect x="262" y="18" width="90" height="20" rx="6" fill="#2b0a11" />
      <rect x="248" y="15" width="12" height="26" rx="2" fill="url(#penGold)" />
      <rect x="60" y="10" width="110" height="5" rx="2.5" fill="url(#penGold)" />
      <path d="M352 20 L420 28 L352 36 Z" fill="url(#penGold)" />
      <path d="M368 28 L420 28" stroke="#6a4a1c" strokeWidth="1" />
    </svg>
  )
}

function Envelope() {
  return (
    <svg className="sl-envelope" viewBox="0 0 420 270" aria-hidden="true">
      <rect x="4" y="8" width="412" height="258" rx="4" fill="rgba(60,30,15,0.12)" />
      <rect x="0" y="0" width="412" height="258" rx="4" fill="#F3E8D4" stroke="#E0CFB0" />
      <path d="M0 0 L206 140 L412 0" fill="none" stroke="#D8C6A6" strokeWidth="1.4" />
      <path d="M0 258 L168 120 M412 258 L244 120" fill="none" stroke="#E2D3B8" strokeWidth="1.2" />
      <text x="40" y="186" className="sl-script">
        To the Sharma family,
      </text>
      <text x="58" y="218" className="sl-script sl-script--sm">
        12, Prabhat Road, Pune
      </text>
      <g transform="translate(326 22) rotate(4)">
        <rect width="62" height="74" fill="#FBF6EC" stroke="#D9C8A8" strokeDasharray="3 3" />
        <rect x="6" y="6" width="50" height="62" fill="#7a2436" />
        <text x="31" y="30" textAnchor="middle" className="sl-stamp">
          INDIA
        </text>
        <text x="31" y="54" textAnchor="middle" className="sl-stamp sl-stamp--big">
          ₹5
        </text>
      </g>
      <g fill="none" stroke="rgba(70,50,40,0.45)" strokeWidth="1.2">
        <circle cx="318" cy="70" r="26" />
        <path d="M292 104 q10 -6 20 0 t20 0 t20 0 t20 0 M292 114 q10 -6 20 0 t20 0 t20 0 t20 0" />
      </g>
    </svg>
  )
}

function Petal({ className }) {
  return (
    <svg className={`sl-petal ${className}`} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 2 C36 10 34 32 20 38 C6 32 4 10 20 2 Z" fill="#7a1a2c" />
      <path d="M20 6 Q18 22 20 34" stroke="rgba(255,210,215,0.25)" fill="none" />
    </svg>
  )
}

export default function StillLife({ ref, cardStartRef }) {
  return (
    <div className="still" ref={ref} aria-hidden="true">
      <Calendar />
      <InkPot />
      <Envelope />
      <Pen />
      <Petal className="sl-petal--a" />
      <Petal className="sl-petal--b" />
      <Petal className="sl-petal--c" />
      <div className="anchor anchor--card-start" ref={cardStartRef} />
    </div>
  )
}
