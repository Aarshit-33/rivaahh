// Shown for a moment while a collection opens.
export default function Loading() {
  return <div aria-busy="true" aria-label="Opening the collection" style={{ minHeight: '100svh', background: 'var(--cream)' }} />
}
