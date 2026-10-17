// A slim, warm laptop that matches the phone's Kohl Ink bezel. The screen is
// 16:10 and a size container; children render inside it.

export default function Laptop({ children, className = '', url, label, style }) {
  return (
    <div className={`pp-laptop ${className}`} style={style} role={label ? 'img' : undefined} aria-label={label}>
      <div className="pp-laptop-lid">
        <div className="pp-laptop-screen">
          {url && (
            <div className="pp-laptop-bar" aria-hidden="true">
              <span />
              <span />
              <span />
              <p>{url}</p>
            </div>
          )}
          <div className="pp-laptop-view">{children}</div>
        </div>
      </div>
      <div className="pp-laptop-base" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}
