'use client'

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePersonal } from '@/lib/stores'
import Choices from './Choices'
import Sheet, { Popover } from './Sheet'
import NamesForm from './NamesForm'
import { DIMS, FORMATS, WALL_SORTS, activeDims, facetCounts, isFiltered, optionOf, summaryWords } from './filters'
import { Chevron, Close, Pen, Sliders } from './Icons'
import s from './explorer.module.css'
import ui from './ui.module.css'

const KEEP_CASE = new Set(['griha-pravesh'])

const occasionWord = (slug) => {
  const o = optionOf('occasion', slug)
  return KEEP_CASE.has(slug) ? o.plural : o.plural.toLowerCase()
}

/** The words shown inside each blank of the sentence. */
function blankText(dim, f, scoped = false) {
  if (dim === 'format')
    return (
      scoped
        ? { all: 'cards & reels', card: 'cards', reel: 'reels' }
        : { all: 'cards & reels', card: 'only cards', reel: 'only reels' }
    )[f.format]
  const sel = f[dim]
  if (!sel.length) return DIMS[dim].all
  if (dim === 'occasion') return sel.length > 2 ? `${sel.length} occasions` : sel.map(occasionWord).join(' & ')
  if (dim === 'tradition') {
    if (sel.length > 2) return `${sel.length} traditions`
    if (sel.length === 1 && sel[0] === 'for-everyone') return 'everyone'
    return `${sel
      .map((x) => optionOf(dim, x).label)
      .filter((x) => x !== 'For everyone')
      .join(' & ')} families`
  }
  if (sel.length > 2) return `${sel.length} ${dim === 'style' ? 'styles' : dim === 'colour' ? 'colours' : 'motifs'}`
  return sel.map((x) => optionOf(dim, x).label.toLowerCase()).join(' & ')
}

/** Short text for the phone chips. */
function chipText(dim, f) {
  if (dim === 'format') return FORMATS.find((x) => x.slug === f.format).short
  const sel = f[dim]
  if (!sel.length) return dim === 'occasion' ? 'All occasions' : DIMS[dim].label
  if (sel.length === 1) return dim === 'occasion' ? optionOf(dim, sel[0]).plural : optionOf(dim, sel[0]).label
  return `${DIMS[dim].label} · ${sel.length}`
}

const SENTENCE = [
  ['occasion', 'Show me', ''],
  ['format', '', ''],
  ['tradition', 'for', ','],
  ['style', 'that feel', ','],
  ['colour', 'in', '.'],
]

// Inside one occasion the occasion blank goes, and the occasion is named.
const SCOPED_SENTENCE = [
  ['format', 'Show me', ''],
  ['tradition', 'for', ','],
  ['style', 'that feel', ','],
  ['colour', 'in', '.'],
]

/**
 * The options for a question. With `base` (a category's designs), values that
 * no design in it has are left out, and each chip shows how many designs it
 * would give with the other answers kept.
 */
function optionsFor(dim, f, base) {
  if (dim === 'format') {
    const all = FORMATS.map((x) => ({ slug: x.slug, label: x.label }))
    if (!base) return all
    const n = facetCounts(base, f, 'format')
    return all
      .filter((x) => x.slug === 'all' || base.some((t) => t.format === x.slug))
      .map((x) => ({ ...x, count: n[x.slug] }))
  }
  const all = DIMS[dim].options
  if (!base) return all
  const n = facetCounts(base, f, dim)
  return all
    .filter((o) => f[dim].includes(o.slug) || base.some((t) => o.test(t)))
    .map((o) => ({ ...o, count: n[o.slug] }))
}

function DimChoices({ dim, f, set, autofocus, base }) {
  if (dim === 'format') {
    return (
      <Choices
        legend="Cards or reels"
        options={optionsFor('format', f, base)}
        value={f.format}
        single
        autofocus={autofocus}
        onChange={(v) => set((p) => ({ ...p, format: v }))}
      />
    )
  }
  if (dim === 'more') {
    return (
      <div className={s.moreStack}>
        <Choices
          legend="Motif"
          options={optionsFor('motif', f, base)}
          value={f.motif}
          autofocus={autofocus}
          onChange={(v) => set((p) => ({ ...p, motif: v }))}
        />
        <Choices
          legend="Sort"
          options={WALL_SORTS.map(([slug, label]) => ({ slug, label }))}
          value={f.sort}
          single
          onChange={(v) => set((p) => ({ ...p, sort: v }))}
        />
      </div>
    )
  }
  return (
    <Choices
      legend={`${DIMS[dim].label}, choose any`}
      options={optionsFor(dim, f, base)}
      value={f[dim]}
      swatches={dim === 'colour'}
      autofocus={autofocus}
      onChange={(v) => set((p) => ({ ...p, [dim]: v }))}
    />
  )
}

function Blank({ dim, f, set, open, onOpen, onClose, count, children, className = '', base }) {
  const wrap = useRef(null)
  const trigger = useRef(null)
  return (
    <span className={s.blankWrap} ref={wrap}>
      <button
        ref={trigger}
        type="button"
        className={`${className || s.blank} ${dim !== 'more' && activeDims(f).includes(dim) ? s.blankSet : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? onClose() : onOpen())}
      >
        {children}
        <Chevron className={s.blankChev} />
      </button>
      <Popover
        open={open}
        onClose={onClose}
        wrapRef={wrap}
        triggerRef={trigger}
        label={dim === 'more' ? 'More filters' : DIMS[dim]?.label || 'Format'}
      >
        <DimChoices dim={dim} f={f} set={set} base={base} autofocus />
        <div className={s.popFoot}>
          <span>{count === 1 ? '1 design' : `${count} designs`}</span>
          <button
            type="button"
            className={ui.textBtn}
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
 * The question line: a sticky sentence with the defaults already filled in.
 * Desktop: blanks open small popovers, and the line collapses to one row of
 * values once it sticks. Phone: a row of chips, each opening a bottom sheet.
 *
 * Optional, for one occasion's page:
 * - `noun`  e.g. "wedding": drops the occasion blank and reads
 *           "Show me [cards & reels] of wedding invitations for …"
 * - `base`  that occasion's designs: only values they have are offered, with counts
 */
export default function QuestionLine({
  filters: f,
  setFilters: set,
  count,
  total,
  phone,
  onOpenNames,
  notice,
  noun,
  base,
}) {
  const scoped = Boolean(noun)
  const personal = usePersonal()
  const [open, setOpen] = useState(null)
  const [stuck, setStuck] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [fullH, setFullH] = useState(0)
  const sentinel = useRef(null)
  const bar = useRef(null)
  const filtered = isFiltered(f)

  // Is the bar stuck under the nav?
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        const isStuck = !e.isIntersecting && e.boundingClientRect.top < 80
        setStuck(isStuck)
        if (!isStuck) setExpanded(false)
      },
      { rootMargin: '-76px 0px 0px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Re-collapse after the visitor scrolls on.
  useEffect(() => {
    if (!expanded || open) return
    const y0 = window.scrollY
    const onScroll = () => Math.abs(window.scrollY - y0) > 220 && setExpanded(false)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [expanded, open])

  const compact = !phone && stuck && !expanded && !open

  // Remember the full height so collapsing never moves the content below.
  useLayoutEffect(() => {
    const el = bar.current
    if (!el || phone) return
    const ro = new ResizeObserver(() => {
      if (!el.dataset.compact) setFullH(el.offsetHeight)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [phone])

  const countText = count === 1 ? '1 design' : `${count} designs`
  const clear = () =>
    set((p) => ({ ...p, occasion: [], format: 'all', tradition: [], style: [], colour: [], motif: [] }))

  const namesBit = personal.active ? (
    <span className={s.namesOn}>
      {phone ? 'Your names' : 'Showing your names'}
      <button type="button" className={s.inlineLink} onClick={() => (phone ? onOpenNames() : setOpen('names'))}>
        edit
      </button>
      <button type="button" className={s.inlineLink} onClick={personal.clear}>
        clear
      </button>
    </span>
  ) : null

  if (phone) {
    const chips = scoped
      ? ['format', 'tradition', 'style', 'colour']
      : ['occasion', 'format', 'tradition', 'style', 'colour']
    const sheetDim = open && open !== 'names' ? open : null
    return (
      <>
        <div ref={sentinel} className={s.sentinel} aria-hidden="true" />
        <div className={`${s.bar} ${s.barPhone}`} role="region" aria-label="Filter designs">
          <div className={s.chipRow} data-lenis-prevent>
            {chips.map((dim) => (
              <button
                key={dim}
                type="button"
                className={`${s.fChip} ${activeDims(f).includes(dim) ? s.fChipOn : ''}`}
                aria-haspopup="dialog"
                aria-expanded={open === dim}
                onClick={() => setOpen(dim)}
              >
                {chipText(dim, f)}
                <Chevron />
              </button>
            ))}
            <button
              type="button"
              className={s.fChip}
              aria-haspopup="dialog"
              aria-expanded={open === 'more'}
              onClick={() => setOpen('more')}
            >
              <Sliders /> More
            </button>
            <button type="button" className={`${s.fChip} ${s.fChipGhost}`} onClick={onOpenNames}>
              {personal.active ? 'Your names' : 'Try your names'} <Pen />
            </button>
          </div>
          {(filtered || personal.active || notice) && (
            <div className={s.barSub}>
              {notice ? (
                <span className={s.notice}>
                  {notice.line}
                  <button type="button" className={s.inlineLink} onClick={notice.onUndo}>
                    Undo
                  </button>
                </span>
              ) : (
                <span className={s.countSm} aria-hidden="true">
                  {filtered ? countText : ''}
                </span>
              )}
              {namesBit}
              {filtered && (
                <button type="button" className={s.inlineLink} onClick={clear}>
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
        <Sheet
          open={Boolean(sheetDim)}
          onClose={() => setOpen(null)}
          variant="bottom"
          title={
            sheetDim === 'more' ? 'More filters' : sheetDim === 'format' ? 'Cards or reels' : DIMS[sheetDim]?.label
          }
          footer={
            <button type="button" className="btn btn--primary" onClick={() => setOpen(null)}>
              {count ? `Show ${countText}` : 'Show the closest designs'}
            </button>
          }
        >
          {sheetDim && <DimChoices dim={sheetDim} f={f} set={set} base={base} />}
        </Sheet>
      </>
    )
  }

  return (
    <>
      <div ref={sentinel} className={s.sentinel} aria-hidden="true" />
      <div
        ref={bar}
        className={`${s.bar} ${compact ? s.barCompact : ''}`}
        data-compact={compact ? '' : undefined}
        style={compact && fullH ? { marginBottom: fullH - 56 } : undefined}
        role="region"
        aria-label="Filter designs"
      >
        {compact ? (
          <div className={s.compactRow}>
            <button
              type="button"
              className={s.compactBtn}
              onClick={() => setExpanded(true)}
              aria-label="Change filters"
            >
              <span className={s.compactLabel}>Showing</span>
              {filtered ? (
                <span className={s.compactValues}>
                  {summaryWords(f).map((w) => (
                    <span key={w} className={s.compactChip}>
                      {w}
                    </span>
                  ))}
                </span>
              ) : (
                <span className={s.compactChip}>Every design</span>
              )}
              <span className={s.compactChange}>
                Change <Chevron />
              </span>
            </button>
            <span className={s.count} aria-hidden="true">
              {countText}
            </span>
            {filtered && (
              <button type="button" className={ui.textBtn} onClick={clear}>
                Clear
              </button>
            )}
          </div>
        ) : (
          <div className={s.barInner}>
            <div className={s.sentence}>
              {(scoped ? SCOPED_SENTENCE : SENTENCE).map(([dim, pre, post], i) => (
                <Fragment key={dim}>
                  {i > 0 && ' '}
                  <span className={s.clause}>
                    {pre && <span className={s.joiner}>{pre} </span>}
                    <Blank
                      dim={dim}
                      f={f}
                      set={set}
                      base={base}
                      count={count}
                      open={open === dim}
                      onOpen={() => setOpen(dim)}
                      onClose={() => setOpen((o) => (o === dim ? null : o))}
                    >
                      {blankText(dim, f, scoped)}
                    </Blank>
                    {post && <span className={s.joiner}>{post}</span>}
                  </span>
                  {scoped && dim === 'format' && (
                    <span className={s.joiner}>
                      {' '}
                      of <b className={s.noun}>{noun}</b> invitations
                    </span>
                  )}
                </Fragment>
              ))}
            </div>
            <div className={s.barTools}>
              <Blank
                dim="more"
                f={f}
                set={set}
                base={base}
                count={count}
                className={s.moreBtn}
                open={open === 'more'}
                onOpen={() => setOpen('more')}
                onClose={() => setOpen((o) => (o === 'more' ? null : o))}
              >
                More
              </Blank>
              <span className={s.count} aria-hidden="true">
                {filtered ? countText : `${total} designs`}
              </span>
              {filtered && (
                <button type="button" className={ui.textBtn} onClick={clear}>
                  Clear
                </button>
              )}
              <span className={s.toolRule} aria-hidden="true" />
              <NamesPill open={open === 'names'} setOpen={setOpen} active={personal.active} />
            </div>
          </div>
        )}
        {!compact && (notice || personal.active) && (
          <div className={s.barSub}>
            {notice && (
              <span className={s.notice}>
                {notice.line}
                <button type="button" className={s.inlineLink} onClick={notice.onUndo}>
                  Undo
                </button>
              </span>
            )}
            {namesBit}
          </div>
        )}
      </div>
    </>
  )
}

function NamesPill({ open, setOpen, active }) {
  const wrap = useRef(null)
  const trigger = useRef(null)
  return (
    <span className={`${s.blankWrap} ${s.namesWrap}`} ref={wrap}>
      <button
        ref={trigger}
        type="button"
        className={s.namesPill}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(open ? null : 'names')}
      >
        {active ? 'Your names' : 'Try your names'}
        <Pen />
      </button>
      <Popover
        open={open}
        onClose={() => setOpen((o) => (o === 'names' ? null : o))}
        wrapRef={wrap}
        triggerRef={trigger}
        label="Try your names"
        className={s.namesPop}
      >
        <div className={s.namesPopHead}>
          <p>See every design with your names</p>
          <button type="button" className={ui.iconBtn} aria-label="Close" onClick={() => setOpen(null)}>
            <Close />
          </button>
        </div>
        <NamesForm onDone={() => setOpen(null)} />
      </Popover>
    </span>
  )
}
