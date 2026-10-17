// The maroon wax seal with an italic "N" — the brand's sign-off.
// size: 'sm' (34px, as in the nav) | 'md' (56px) | 'lg' (72px) | 'xl' (96px)

export default function WaxSeal({ size = 'md', letter = 'N', className = '', ...rest }) {
  return (
    <span className={`pp-seal pp-seal--${size} ${className}`} aria-hidden="true" {...rest}>
      {letter}
    </span>
  )
}
