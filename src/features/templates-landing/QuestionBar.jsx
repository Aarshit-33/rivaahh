'use client'

import { useRef, useState } from 'react'
import { formatInviteDate, usePersonal } from '@/lib/stores'
import Choices from '@/features/templates/Choices'
import Sheet, { Popover } from '@/features/templates/Sheet'
import NamesForm from '@/features/templates/NamesForm'
import { DIMS, optionOf } from '@/features/templates/filters'
import { Chevron, Pen } from '@/features/templates/Icons'
import { NARROW_DEFAULTS, isNarrowed } from './data'
import s from './landing.module.css'

const LABEL = { occasion: 'Occasion', tradition: 'Tradition', style: 'Style', colour: 'Colour' }

/** The words inside each blank of the sentence. */
function blankText(dim, f) {
  const sel = f[dim]
  if (!sel.length) return DIMS[dim].all
  if (dim === 'occasion') {
    if (sel.length > 2) return `${sel.length} occasions`
    return sel.map((x) => (x === 'griha-pravesh' ? 'Griha Pravesh' : optionOf(dim, x).plural.toLowerCase())).join(' & ')
  }
  if (sel.length > 2) return `${sel.length} ${dim === 'style' ? 'styles' : dim === 'colour' ? 'colours' : 'traditions'}`
  if (dim === 'tradition') {
    if (sel.length === 1 && sel[0] === 'for-everyone') return 'everyone'
    const words = sel.map((x) => optionOf(dim, x).label).filter((x) => x !== 'For everyone')
    return `${words.join(' & ')} families`
  }
  return sel.map((x) => optionOf(dim, x).label.toLowerCase()).join(' & ')
}

/** Short text for the phone chips. */
function chipText(dim, f) {
  const sel = f[dim]
  if (!sel.length) return dim === 'occasion' ? 'All occasions' : LABEL[dim]
  if (sel.length === 1) return optionOf(dim, sel[0]).label
  return `${LABEL[dim]} · ${sel.length}`
}

/** The choices for one question. Every answer filters the cards on this page. */
function DimChoices({ dim, f, set, autofocus }) {
  return (
    <Choices
      legend={`${LABEL[dim]}, choose any`}
      options={DIMS[dim].options}
      value={f[dim]}
      swatches={dim === 'colour'}
      autofocus={autofocus}
      onChange={(v) => set((p) => ({ ...p, [dim]: v }))}
    />
  )
}

function Blank({ dim, f, set, open, onOpen, onClose, count }) {
  const wrap = useRef(null)
  const trigger = useRef(null)
  const isSet = f[dim].length > 0
  return (
    <span className={s.blankWrap} ref={wrap}>
      <button
        ref={trigger}
        type="button"
        className={`${s.blank} ${isSet ? s.blankSet : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? onClose() : onOpen())}
      >
        {blankText(dim, f)}
        <Chevron className={s.chev} />
      </button>
      <Popover open={open} onClose={onClose} wrapRef={wrap} triggerRef={trigger} label={LABEL[dim]}>
        <DimChoices dim={dim} f={f} set={set} autofocus />
        <div className={s.popFoot}>
          <span>{`${count} of the designs fit`}</span>
          <button
            type="button"
            className={s.textBtn}
            onClick={() => {
              onClose()
              trigger.current?.focus()
            }}
          >
            Done
          </button>
        </div>
      </Popover>
    </span>
  )
}

/**
 * The question line: a sticky sentence. Every answer — occasion included —
 * stays on this page and re-sorts the cards: the collections that fit move
 * up, the rest move below.
 */
export default function QuestionBar({ filters: f, setFilters: set, count, total }) {
  const personal = usePersonal()
  const [open, setOpen] = useState(null)
  const [sheet, setSheet] = useState(null)
  const namesWrap = useRef(null)
  const namesBtn = useRef(null)

  const clear = () => set(NARROW_DEFAULTS)
  const blank = (dim) => (
    <Blank
      dim={dim}
      f={f}
      set={set}
      count={count}
      open={open === dim}
      onOpen={() => setOpen(dim)}
      onClose={() => setOpen((o) => (o === dim ? null : o))}
    />
  )

  return (
    <div className={s.bar} role="search" aria-label="Narrow the collections">
      <div className={s.barInner}>
        {/* Desktop and tablet: the sentence. */}
        {/* A div, not a p: the popovers inside hold fieldsets. */}
        <div className={s.sentence}>
          Show me {blank('occasion')} invitations, for {blank('tradition')}, that feel {blank('style')}, in{' '}
          {blank('colour')}.
        </div>

        {/* Phones: chips that open bottom sheets. */}
        <div className={s.chipRow}>
          {['occasion', 'tradition', 'style', 'colour'].map((dim) => (
            <button
              key={dim}
              type="button"
              className={`${s.qChip} ${f[dim].length ? s.qChipSet : ''}`}
              aria-haspopup="dialog"
              onClick={() => setSheet(dim)}
            >
              {chipText(dim, f)}
              <Chevron className={s.chev} />
            </button>
          ))}
          <button type="button" className={s.qChip} aria-haspopup="dialog" onClick={() => setSheet('names')}>
            <Pen className={s.pen} />
            {personal.names?.trim() ? 'Your names' : 'Names'}
          </button>
        </div>

        <div className={s.barSide}>
          <span className={s.barCount} aria-live="polite">
            {isNarrowed(f) ? `${count} of ${total} designs` : `${total} designs`}
          </span>
          <button type="button" className={s.clearBtn} onClick={clear} disabled={!isNarrowed(f)}>
            Clear
          </button>
          <span className={s.barDivider} aria-hidden="true" />
          <span className={s.blankWrap} ref={namesWrap}>
            <button
              ref={namesBtn}
              type="button"
              className={`${s.namesPill} ${personal.active ? s.namesOn : ''}`}
              aria-haspopup="dialog"
              aria-expanded={open === 'names'}
              onClick={() => setOpen((o) => (o === 'names' ? null : 'names'))}
            >
              <Pen className={s.pen} />
              <span className={s.namesText}>Try your names</span>
            </button>
            <Popover
              open={open === 'names'}
              onClose={() => setOpen((o) => (o === 'names' ? null : o))}
              wrapRef={namesWrap}
              triggerRef={namesBtn}
              label="Try your names"
              className={s.namesPop}
            >
              <NamesForm onDone={() => setOpen(null)} />
            </Popover>
          </span>
        </div>
      </div>

      {personal.active && (
        <div className={s.status}>
          <p className={s.statusText}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 3l2.4 1.8 3-.2.9 2.9 2.4 1.8-1 2.8 1 2.8-2.4 1.8-.9 2.9-3-.2L12 21l-2.4-1.8-3 .2-.9-2.9-2.4-1.8 1-2.8-1-2.8 2.4-1.8.9-2.9 3 .2z" strokeLinejoin="round" />
              <path d="M8.5 12.2l2.3 2.3 4.7-4.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>
              Personalised for: <strong>{personal.names?.trim() || 'your celebration'}</strong>
            </span>
            {personal.date && (
              <>
                <span className={s.statusDot} aria-hidden="true">•</span>
                <span className={s.statusDate}>{formatInviteDate(personal.date)}</span>
              </>
            )}
          </p>
          <button
            type="button"
            className={s.statusBtn}
            onClick={() => (window.matchMedia('(max-width: 767px)').matches ? setSheet('names') : setOpen('names'))}
          >
            Change details
          </button>
        </div>
      )}

      <Sheet
        open={sheet !== null}
        onClose={() => setSheet(null)}
        variant="bottom"
        title={sheet === 'names' ? 'Try your names' : sheet ? LABEL[sheet] : ''}
        footer={
          sheet && sheet !== 'names' ? (
            <button type="button" className="btn btn--primary" onClick={() => setSheet(null)}>
              Show {count} {count === 1 ? 'design' : 'designs'}
            </button>
          ) : null
        }
      >
        {sheet === 'names' ? (
          <NamesForm onDone={() => setSheet(null)} />
        ) : sheet ? (
          <DimChoices dim={sheet} f={f} set={set} />
        ) : null}
      </Sheet>
    </div>
  )
}
