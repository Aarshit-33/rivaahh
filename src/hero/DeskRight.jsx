// Right-hand side of the "then" desk: the work an invitation used to create.
// Each prop pays off later — the register becomes "48 guests replied", the rotary
// phone dissolves where the smartphone appears, and "14 days" counts down to 0.4s.

const GUESTS = [
  { name: 'Sharma family', note: '✓ card reached' },
  { name: 'Mehta ji', note: 'called twice…' },
  { name: 'Bua, Lucknow', note: 'no reply yet', struck: 'posted 2 Mar' },
  { name: 'Rao uncle', note: '✓ coming, +3' },
  { name: 'Kapoor family', note: 'wrong address?' },
]

export function GuestRegister() {
  return (
    <div className="register" aria-hidden="true">
      <p className="reg-head">Guest list — 14 March</p>
      <ol>
        {GUESTS.map((g) => (
          <li className="reg-row" key={g.name}>
            <span className="reg-name">{g.name}</span>
            <span className="reg-note">
              {g.struck && <s>{g.struck}</s>} {g.note}
            </span>
          </li>
        ))}
      </ol>
      <p className="reg-tally reg-row">
        Confirmed: <s>27</s> <s>29</s> 31? <span>still waiting on 17</span>
      </p>
    </div>
  )
}

export function RotaryPhone({ ref }) {
  return (
    <div className="rotary" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 280 210">
        <defs>
          <linearGradient id="rotBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8e2a3b" />
            <stop offset="1" stopColor="#4a0d1a" />
          </linearGradient>
          <linearGradient id="rotBrass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ecd39a" />
            <stop offset="1" stopColor="#9b7840" />
          </linearGradient>
        </defs>
        <ellipse cx="128" cy="198" rx="118" ry="9" fill="rgba(60,30,15,0.18)" />
        {/* Curly cord trailing toward the guest register. */}
        <path
          d="M40 168 c-8 -6 -2 -14 4 -10 c6 4 -2 12 -8 8 c-6 -4 0 -12 6 -8 c6 4 -2 12 -8 8 c-6 -4 0 -12 6 -8 c4 3 -6 10 -14 12 c-10 3 -18 0 -24 -4"
          fill="none"
          stroke="#5b1322"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path d="M44 190 L62 96 Q66 82 82 82 L174 82 Q190 82 194 96 L212 190 Z" fill="url(#rotBody)" />
        <path d="M70 96 L186 96" stroke="rgba(255,210,215,0.18)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="128" cy="140" r="40" fill="url(#rotBrass)" />
        <circle cx="128" cy="140" r="33" fill="#f3e8d4" />
        {Array.from({ length: 10 }, (_, i) => {
          const a = (-60 - i * 27) * (Math.PI / 180)
          return <circle key={i} cx={128 + Math.cos(a) * 25} cy={140 + Math.sin(a) * 25} r="5.2" fill="#4a0d1a" />
        })}
        <circle cx="128" cy="140" r="11" fill="#fbf6ec" stroke="#b08d57" />
        <path d="M150 104 L162 98" stroke="#b08d57" strokeWidth="3" strokeLinecap="round" />
        {/* Handset lifted off its cradle, resting at an angle. */}
        <g transform="translate(150 22) rotate(16)">
          <path
            d="M0 20 Q4 0 26 2 L96 8 Q116 10 118 30 Q119 42 108 42 L98 41 Q94 26 82 25 L36 21 Q24 20 22 34 L12 34 Q-2 33 0 20 Z"
            fill="url(#rotBody)"
          />
          <path d="M30 6 L92 11" stroke="rgba(255,210,215,0.2)" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
      <p className="rotary-note">
        Call Mausi to confirm —<br />
        she didn&rsquo;t get the card
      </p>
    </div>
  )
}

export function LagStat({ ref, numRef, unitRef, capRef }) {
  return (
    <div className="lag" ref={ref}>
      <p className="lag-num">
        <span ref={numRef}>14</span>
        <em ref={unitRef}>days</em>
      </p>
      <p className="lag-cap" ref={capRef}>
        by post, an invitation could take up to two weeks to reach everyone
      </p>
    </div>
  )
}
