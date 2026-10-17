// Shown for a moment while a design opens: the stage colour and an empty
// programme, so the page never flashes blank.
export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-label="Opening the design"
      style={{ minHeight: '100svh', background: 'linear-gradient(90deg, #3f0e1a 0 56%, var(--cream) 56%)' }}
    />
  )
}
