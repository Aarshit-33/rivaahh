// A single invitation card drawn in CSS/SVG, reused by the occasions fan, the
// personaliser, the template gallery and the language demo.

// Rounded so the server and the browser print identical coordinates (no hydration mismatch).
const r3 = (n) => Math.round(n * 1000) / 1000

export function Motif({ type }) {
  if (type === 'arch')
    return (
      <svg className="ia-motif" viewBox="0 0 120 70" aria-hidden="true">
        <path d="M20 70 V40 A40 40 0 0 1 100 40 V70" />
        <path d="M32 70 V42 A28 28 0 0 1 88 42 V70" opacity="0.55" />
        <circle cx="60" cy="10" r="3" />
      </svg>
    )
  if (type === 'toran')
    return (
      <svg className="ia-motif" viewBox="0 0 120 40" aria-hidden="true">
        <path d="M4 6 Q60 26 116 6" />
        {[16, 30, 45, 60, 75, 90, 104].map((x, i) => (
          <path key={x} d={`M${x} ${r3(10 + Math.sin((i / 6) * Math.PI) * 8)} l-5 10 h10 Z`} className="ia-fill" />
        ))}
      </svg>
    )
  if (type === 'sun')
    return (
      <svg className="ia-motif" viewBox="0 0 120 60" aria-hidden="true">
        <circle cx="60" cy="40" r="14" />
        {Array.from({ length: 11 }, (_, i) => {
          const a = Math.PI + (i / 10) * Math.PI
          return (
            <line
              key={i}
              x1={r3(60 + Math.cos(a) * 20)}
              y1={r3(40 + Math.sin(a) * 20)}
              x2={r3(60 + Math.cos(a) * 30)}
              y2={r3(40 + Math.sin(a) * 30)}
            />
          )
        })}
      </svg>
    )
  return (
    <svg className="ia-motif" viewBox="0 0 120 30" aria-hidden="true">
      <path d="M10 15 H48 M72 15 H110" />
      <path d="M60 5 L68 15 L60 25 L52 15 Z" />
    </svg>
  )
}

// Takes only the fields it draws, so a template object (which has its own
// `style`, `name`, … fields) can be spread straight in.
export default function InviteArt({ theme = 'ivory', motif = 'frame', eyebrow, title, meta, className = '' }) {
  return (
    <div className={`ia ia--${theme} ${className}`}>
      <div className="ia-frame">
        <Motif type={motif} />
        {eyebrow && <p className="ia-eyebrow">{eyebrow}</p>}
        <p className="ia-title">{title}</p>
        {meta && <p className="ia-meta">{meta}</p>}
        <span className="ia-seal" aria-hidden="true" />
      </div>
    </div>
  )
}
