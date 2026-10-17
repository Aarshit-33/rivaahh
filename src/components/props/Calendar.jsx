'use client'

import { motion } from 'motion/react'

const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']

// The paper desk calendar from the home hero, drawn the same way. By default it
// shows March with the 14th circled in maroon, exactly like the hero; pass a
// month (0–11), the number of days, the weekday column the 1st falls on and
// the day to circle to use it elsewhere.
export default function Calendar({
  month = 2,
  days = 31,
  startCol = 0,
  highlight = 14,
  animate = true,
  className = '',
  label,
}) {
  const dates = Array.from({ length: days }, (_, i) => i + 1)
  const pos = (d) => {
    const i = d - 1 + startCol
    return { col: i % 7, row: Math.floor(i / 7) }
  }
  // The hand-drawn ring in the hero sits around the 14th (column 6, row 1);
  // move the same stroke to wherever the highlighted day falls.
  const h = highlight ? pos(highlight) : null
  const dx = h ? (h.col - 6) * 26 : 0
  const dy = h ? (h.row - 1) * 22 : 0

  return (
    <svg
      className={`pp-calendar ${className}`}
      viewBox="0 0 260 230"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
    >
      <path d="M22 220 L40 34 L220 34 L238 220 Z" fill="#E9DCC4" />
      <rect x="30" y="40" width="200" height="176" rx="3" fill="#FBF6EC" stroke="#E2D2B6" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={48 + i * 23} y="30" width="5" height="18" rx="2.5" fill="#B08D57" />
      ))}
      <text x="130" y="76" textAnchor="middle" className="pp-cal-month">
        {MONTHS[month]}
      </text>
      {dates.map((d) => {
        const { col, row } = pos(d)
        return (
          <text key={d} x={52 + col * 26} y={102 + row * 22} textAnchor="middle" className="pp-cal-date">
            {d}
          </text>
        )
      })}
      {h && (
        <motion.path
          transform={`translate(${dx} ${dy})`}
          d="M207 109 C 194 108, 187 116, 189 124 C 192 134, 212 136, 222 128 C 230 120, 224 106, 208 105 C 201 105, 195 109, 193 112"
          fill="none"
          stroke="#6B1E2E"
          strokeWidth="2.4"
          strokeLinecap="round"
          initial={animate ? { pathLength: 0 } : false}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 1.1, ease: 'easeInOut' }}
        />
      )}
    </svg>
  )
}
