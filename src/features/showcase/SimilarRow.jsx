'use client'

import { useRef } from 'react'
import ReelCard from '@/components/invite/ReelCard'
import { getTemplate, similarTo } from '@/templates/data'
import s from './showcase.module.css'

/**
 * "Others in the same spirit": a row of 9:16 cards that runs off the column's
 * edge. Touch and trackpads scroll it natively; a mouse can drag it. A drag
 * never counts as a click on the card underneath.
 */
export default function SimilarRow({ id }) {
  const list = similarTo(getTemplate(id), 8)
  const track = useRef(null)
  const drag = useRef(null)

  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false }
  }

  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true
      track.current.setPointerCapture(e.pointerId)
      track.current.dataset.dragging = 'true'
    }
    if (d.moved) track.current.scrollLeft = d.left - dx
  }

  const end = (e) => {
    const d = drag.current
    drag.current = null
    if (!d?.moved) return
    if (track.current.hasPointerCapture?.(e.pointerId)) track.current.releasePointerCapture(e.pointerId)
    delete track.current.dataset.dragging
    // Swallow the click that follows a drag.
    const stop = (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
    }
    track.current.addEventListener('click', stop, { capture: true, once: true })
    setTimeout(() => track.current?.removeEventListener('click', stop, { capture: true }), 0)
  }

  return (
    <div
      className={s.track}
      ref={track}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
      onDragStart={(e) => e.preventDefault()}
      role="list"
      aria-label="Similar designs"
    >
      {list.map((t) => (
        <div key={t.id} role="listitem" className={s.trackItem}>
          <ReelCard template={t} />
        </div>
      ))}
    </div>
  )
}
