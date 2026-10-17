// A box of mithai with its lid propped open, drawn in the same paper-and-ink
// style as the shared desk props (envelope, calendar, rotary telephone).
const LADDOOS = [58, 80, 102, 124, 146]

export default function MithaiBox({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 200 150" aria-hidden="true">
      <ellipse cx="104" cy="138" rx="86" ry="7" fill="rgba(60,30,15,0.16)" />
      {/* lid, propped up behind */}
      <path d="M44 62 L40 18 L178 14 L186 62 Z" fill="#F3E8D4" stroke="#E0CFB0" />
      <path d="M50 56 L47 24 L172 20 L178 56 Z" fill="none" stroke="#B08D57" strokeWidth="1.2" />
      <path d="M104 16 L114 16 L118 62 L108 62 Z" fill="#7a2436" />
      <path d="M111 32 l4 5 l-4 5 l-4 -5 Z" fill="#E3C58C" />
      {/* open top with laddoos */}
      <path d="M30 80 L45 62 L186 62 L170 80 Z" fill="#E9DCC4" stroke="#E0CFB0" />
      {LADDOOS.map((x) => (
        <g key={x}>
          <circle cx={x} cy="70" r="8.6" fill="#D69A3A" />
          <circle cx={x - 2.6} cy="67" r="2.6" fill="#EDC27A" />
          <circle cx={x + 2} cy="72" r="1" fill="#B46F24" />
        </g>
      ))}
      {/* box front */}
      <rect x="30" y="80" width="140" height="52" rx="2" fill="#F3E8D4" stroke="#E0CFB0" />
      <rect x="37" y="87" width="126" height="38" fill="none" stroke="#B08D57" strokeWidth="1.1" />
      <rect x="93" y="80" width="14" height="52" fill="#7a2436" />
      <path d="M170 80 L186 62 L186 114 L170 132 Z" fill="#E6D6BB" stroke="#E0CFB0" />
    </svg>
  )
}
