// The one phone used everywhere outside the home hero. Its proportions, bezel
// and screen radius match the home page's travelling <Device /> exactly, so the
// same phone appears on every page. Children render inside the screen, which is
// a size container (use cqw / cqh inside).

export default function Phone({ children, className = '', screenClassName = '', label, style, ...rest }) {
  return (
    <div
      className={`pp-phone ${className}`}
      style={style}
      role={label ? 'img' : undefined}
      aria-label={label}
      {...rest}
    >
      <div className="pp-phone-body" aria-hidden="true" />
      <div className={`pp-phone-screen ${screenClassName}`}>{children}</div>
      <span className="pp-phone-speaker" aria-hidden="true" />
    </div>
  )
}
