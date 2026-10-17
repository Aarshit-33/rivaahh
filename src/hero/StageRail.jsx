// A single Then → Now line. Clicking either end jumps to it; the fill tracks scroll.
export default function StageRail({ stage, onJump, fillRef }) {
  const done = stage === 7
  return (
    <nav className="rail" aria-label="From then to now">
      <button type="button" className={`rail-end ${done ? '' : 'is-active'}`} onClick={() => onJump(0)}>
        Then
      </button>
      <div className="rail-track" role="progressbar" aria-label="Story progress" aria-valuemin={0} aria-valuemax={7} aria-valuenow={stage}>
        <div className="rail-fill" ref={fillRef} />
      </div>
      <button type="button" className={`rail-end ${done ? 'is-active' : ''}`} onClick={() => onJump(7)}>
        Now
      </button>
    </nav>
  )
}
