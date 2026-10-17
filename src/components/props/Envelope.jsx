// The paper envelope from the home hero's desk, with its stamp and postmark.
// `to` and `address` change the handwritten lines.

export default function Envelope({ to = 'To the Sharma family,', address = '12, Prabhat Road, Pune', className = '' }) {
  return (
    <svg className={`pp-envelope ${className}`} viewBox="0 0 420 270" aria-hidden="true">
      <rect x="4" y="8" width="412" height="258" rx="4" fill="rgba(60,30,15,0.12)" />
      <rect x="0" y="0" width="412" height="258" rx="4" fill="#F3E8D4" stroke="#E0CFB0" />
      <path d="M0 0 L206 140 L412 0" fill="none" stroke="#D8C6A6" strokeWidth="1.4" />
      <path d="M0 258 L168 120 M412 258 L244 120" fill="none" stroke="#E2D3B8" strokeWidth="1.2" />
      <text x="40" y="186" className="pp-script">
        {to}
      </text>
      {address && (
        <text x="58" y="218" className="pp-script pp-script--sm">
          {address}
        </text>
      )}
      <g transform="translate(326 22) rotate(4)">
        <rect width="62" height="74" fill="#FBF6EC" stroke="#D9C8A8" strokeDasharray="3 3" />
        <rect x="6" y="6" width="50" height="62" fill="#7a2436" />
        <text x="31" y="30" textAnchor="middle" className="pp-stamp">
          INDIA
        </text>
        <text x="31" y="54" textAnchor="middle" className="pp-stamp pp-stamp--big">
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
