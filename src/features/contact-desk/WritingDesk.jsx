'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, MotionConfig, motion, useMotionValue, useSpring } from 'motion/react'
import { Calendar, Envelope, Rotary, WaxSeal } from '@/components/props'
import { CONTACT, TOPICS } from '@/contact/info'
import { getTemplate } from '@/templates/data'
import { OCCASIONS, TOPIC_KEYS, TOPIC_PHRASE } from '@/features/contact/data'
import s from './desk.module.css'

const ease = [0.22, 1, 0.36, 1]
const DRAFT_KEY = 'nimantran:contact-draft'
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const EMPTY = { name: '', occasion: '', date: '', topic: TOPICS[0], channel: 'whatsapp', reach: '', ps: '', template: '' }

// The four topic stamps, each with its own face value like real postage
// (decoration only — not the price of anything).
const STAMPS = [
  { topic: TOPICS[0], value: '₹5', label: 'Starting invite', caption: 'Invite', icon: 'mail' },
  { topic: TOPICS[1], value: '₹10', label: 'Bespoke design', caption: 'Bespoke', icon: 'pen' },
  { topic: TOPICS[2], value: '₹15', label: 'Pricing & plans', caption: 'Pricing', icon: 'rupee' },
  { topic: TOPICS[3], value: '₹25', label: 'Something else', caption: 'Special', icon: 'spark' },
]

function StampIcon({ type }) {
  if (type === 'mail')
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
        <rect x="2" y="3.5" width="12" height="9" rx="1" />
        <path d="M2.5 4.5 8 9l5.5-4.5" />
      </svg>
    )
  if (type === 'pen')
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
        <path d="M8 2 12 7 8 14 4 7z" />
        <path d="M8 7v3" />
      </svg>
    )
  if (type === 'rupee') return <span aria-hidden="true">₹</span>
  return <span aria-hidden="true">✦</span>
}

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
const isPhone = (v) => /^[+()\-.\s\d]+$/.test(v) && v.replace(/\D/g, '').length >= 8 && v.replace(/\D/g, '').length <= 15

/** "2027-03-14" → { y, m, d } or null */
const parseIso = (iso) => (/^\d{4}-\d{2}-\d{2}$/.test(iso || '') ? iso.split('-').map(Number) : null)

function longDate(iso) {
  const p = parseIso(iso)
  if (!p) return ''
  const [y, m, d] = p
  return `${DAYS[new Date(y, m - 1, d).getDay()]}, ${d} ${MONTHS[m - 1]}`
}

function compose(f) {
  const occ = OCCASIONS.find((o) => o.value === f.occasion)
  const date = longDate(f.date)
  const topic = TOPIC_PHRASE[TOPICS.indexOf(f.topic)] || f.topic.toLowerCase()
  const tpl = f.template && getTemplate(f.template)
  const parts = ['Namaste!']
  if (f.name.trim()) parts.push(`I’m ${f.name.trim()}.`)
  parts.push(
    `We’re celebrating ${occ ? occ.phrase : 'a celebration'}${date ? ` on ${date}` : ''}, and I’d love help with ${topic}.`,
  )
  if (tpl) parts.push(`I’m writing about the ${tpl.name} design.`)
  if (f.reach.trim()) parts.push(`You can reach me on ${f.channel === 'email' ? 'email' : 'WhatsApp'} at ${f.reach.trim()}.`)
  if (f.ps.trim()) parts.push(`P.S. ${f.ps.trim()}`)
  return `${parts.join(' ')}\n\n— sent from the Nimantran contact page`
}

function check(f) {
  const e = {}
  if (!f.name.trim()) e.name = 'Please tell us your name.'
  const v = f.reach.trim()
  if (!v) e.reach = f.channel === 'email' ? 'Add your email so we can reply.' : 'Add your WhatsApp number so we can reply.'
  else if (f.channel === 'email' ? !isEmail(v) : !isPhone(v))
    e.reach = f.channel === 'email' ? 'That doesn’t look like an email address.' : 'That doesn’t look like a phone number.'
  return e
}

/** ?occasion=wedding&topic=bespoke&template=rajwada → letter values. */
function fromQuery(search) {
  const q = new URLSearchParams(search)
  const patch = {}
  const occ = (q.get('occasion') || '').toLowerCase()
  const o = occ && OCCASIONS.find((x) => x.slug === occ || x.value.toLowerCase() === occ)
  if (o) patch.occasion = o.value
  const topic = (q.get('topic') || '').toLowerCase()
  if (topic) {
    const i = topic in TOPIC_KEYS ? TOPIC_KEYS[topic] : TOPICS.findIndex((t) => t.toLowerCase() === topic)
    if (i >= 0) patch.topic = TOPICS[i]
  }
  const tpl = q.get('template') && getTemplate(q.get('template'))
  if (tpl) {
    patch.template = tpl.id
    if (!patch.occasion) {
      const t = OCCASIONS.find((x) => tpl.occasions?.includes(x.value))
      if (t) patch.occasion = t.value
    }
  }
  return patch
}

/* ───────── The desk ───────── */

export default function WritingDesk() {
  const [f, setF] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(null) // { via, message, first }
  const [today, setToday] = useState(null)
  const [copied, setCopied] = useState(false)
  const dateInput = useRef(null)
  const stampsRef = useRef(null)
  const loaded = useRef(false)

  // Restore a draft, then let the URL (?occasion=…&topic=…&template=…) win.
  useEffect(() => {
    let draft = {}
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY)
      const d = raw ? JSON.parse(raw) : null
      if (d && typeof d === 'object')
        for (const k of Object.keys(EMPTY)) if (typeof d[k] === 'string' && d[k]) draft[k] = d[k]
      if (draft.topic && !TOPICS.includes(draft.topic)) delete draft.topic
      if (draft.channel && !['whatsapp', 'email'].includes(draft.channel)) delete draft.channel
    } catch {
      draft = {}
    }
    const now = new Date()
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the browser once on mount
    setToday(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
    setF((p) => ({ ...p, ...draft, ...fromQuery(window.location.search) }))
    loaded.current = true
  }, [])

  useEffect(() => {
    if (!loaded.current) return
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(f))
    } catch {
      /* storage blocked */
    }
  }, [f])

  const set = (key) => (e) => {
    const value = e.target.value
    setF((p) => ({ ...p, [key]: value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  // The calendar shows the chosen month with the day circled (March 2027 until then).
  const cal = useMemo(() => {
    const p = parseIso(f.date)
    const [y, m, d] = p || [2027, 3, 14]
    return {
      key: `${y}-${m}-${d}`,
      month: m - 1,
      year: y,
      days: new Date(y, m, 0).getDate(),
      startCol: new Date(y, m - 1, 1).getDay(),
      highlight: d,
      chosen: Boolean(p),
      left: today ? Math.round((new Date(y, m - 1, d) - today) / 864e5) : null,
    }
  }, [f.date, today])

  // A sheet of paper on the desk tilts a touch toward the pointer.
  const rx = useSpring(useMotionValue(0), { stiffness: 140, damping: 18 })
  const ry = useSpring(useMotionValue(0), { stiffness: 140, damping: 18 })
  const onTilt = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 5)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 4)
  }
  const resetTilt = () => {
    rx.set(0)
    ry.set(0)
  }

  const openDate = () => {
    const el = dateInput.current
    if (!el) return
    try {
      el.showPicker()
    } catch {
      el.focus()
    }
  }

  const pickStamp = (topic) => setF((p) => ({ ...p, topic }))
  const onStampKey = (e, i) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
    if (!step) return
    e.preventDefault()
    const next = (i + step + STAMPS.length) % STAMPS.length
    pickStamp(STAMPS[next].topic)
    stampsRef.current?.querySelectorAll('[role=radio]')[next]?.focus()
  }

  const submit = (e) => {
    e.preventDefault()
    const found = check(f)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(`desk-${first}`)?.focus()
      return
    }
    const message = compose(f)
    let via = null
    if (f.channel === 'whatsapp' && CONTACT.whatsapp) {
      via = 'whatsapp'
      window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener')
    } else if (CONTACT.email) {
      via = 'email'
      const occ = OCCASIONS.find((o) => o.value === f.occasion)
      const subject = `${f.topic}${occ ? ` — ${occ.value}` : ''}`
      const url = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
      setTimeout(() => (window.location.href = url), 1600)
    }
    setSent({ via, message, first: f.name.trim().split(/\s+/)[0] })
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sent.message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  const stamp = STAMPS.find((x) => x.topic === f.topic) || STAMPS[0]
  const topicPhrase = TOPIC_PHRASE[TOPICS.indexOf(f.topic)] || f.topic.toLowerCase()
  const first = f.name.trim().split(/\s+/)[0]
  const tpl = f.template && getTemplate(f.template)
  const postmark = today ? `${today.getDate()} ${MONTHS[today.getMonth()].slice(0, 3).toUpperCase()}` : ''
  const err = (k) => (errors[k] ? { 'aria-invalid': true, 'aria-describedby': `desk-${k}-error` } : {})

  return (
    <MotionConfig reducedMotion="user">
      <div className={s.desk}>
        {/* ───────── Desk accessories: calendar, stamps, telephone ───────── */}
        <div className={s.tools}>
          <div className={s.calendar}>
            <Calendar
              key={cal.key}
              month={cal.month}
              days={cal.days}
              startCol={cal.startCol}
              highlight={cal.highlight}
              label={`Calendar, ${MONTHS[cal.month]} ${cal.year}${cal.chosen ? `, ${cal.highlight} circled` : ''}`}
            />
            <p className={s.countdown} aria-live="polite">
              {cal.chosen && cal.left != null
                ? cal.left > 0
                  ? `${cal.left} ${cal.left === 1 ? 'day' : 'days'} to go ✦`
                  : cal.left === 0
                    ? 'That’s today ✦'
                    : 'That date has passed — pick another?'
                : 'Pick your date in the letter ✦'}
            </p>
          </div>

          <div className={s.stampsBox}>
            <p className={s.toolLabel} id="stamps-label">
              Affix a postage topic:
            </p>
            <div className={s.stamps} role="radiogroup" aria-labelledby="stamps-label" ref={stampsRef}>
              {STAMPS.map((st, i) => {
                const on = st.topic === f.topic
                return (
                  <button
                    key={st.topic}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    tabIndex={on ? 0 : -1}
                    className={`${s.stamp} ${on ? s.stampOn : ''}`}
                    onClick={() => pickStamp(st.topic)}
                    onKeyDown={(e) => onStampKey(e, i)}
                  >
                    <span className={s.stampTop}>
                      <span>{st.value}</span>
                      <span className={s.stampIcon}>
                        <StampIcon type={st.icon} />
                      </span>
                    </span>
                    <span className={s.stampLabel}>{st.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* The desk telephone rings now and then, as in the old way of inviting. */}
          <div className={s.telephone}>
            <span className={s.ringWaves} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round">
                <path className={s.waveA} d="M15 7a6 6 0 0 1 0 10" strokeWidth="1.8" />
                <path className={s.waveB} d="M18 4a10 10 0 0 1 0 16" strokeWidth="1.6" />
              </svg>
            </span>
            <Rotary note />
          </div>
        </div>

        {/* ───────── The letter (or, once sent, the sealed envelope) ───────── */}
        <div className={s.letterStage}>
          <AnimatePresence mode="wait" initial={false}>
            {!sent ? (
              // The fold lives on this wrapper; the pointer tilt lives on the form,
              // so coming back to edit always starts from a flat, open sheet.
              <motion.div
                key="letter"
                className={s.letterFold}
                initial={{ opacity: 0, y: 40, rotateX: 24, scaleY: 0.9 }}
                animate={{ opacity: 1, y: 0, rotateX: 0, scaleY: 1, transition: { duration: 0.6, ease } }}
                exit={{
                  rotateX: 78,
                  scaleY: 0.32,
                  y: 70,
                  opacity: 0,
                  transition: { duration: 0.75, ease: [0.55, 0, 0.35, 1] },
                }}
              >
              <motion.form
                className={s.letter}
                noValidate
                onSubmit={submit}
                onPointerMove={onTilt}
                onPointerLeave={resetTilt}
                style={{ rotateX: rx, rotateY: ry }}
                aria-labelledby="desk-greeting"
              >
                <span className={s.stain} aria-hidden="true" />
                <span className={s.frameA} aria-hidden="true" />
                <span className={s.frameB} aria-hidden="true" />

                <div className={s.letterHead}>
                  <div>
                    <p className={s.greeting} id="desk-greeting">
                      Namaste,
                    </p>
                    <p className={s.addressee}>
                      <span aria-hidden="true" /> To the Nimantran studio desk
                    </p>
                  </div>
                  <div className={s.stampSlot} aria-hidden="true">
                    <span className={s.postmark}>
                      <b>Dak post</b>
                      <i>{postmark}</i>
                      <span />
                      <small>Nimantran studio</small>
                    </span>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={stamp.topic}
                        className={s.slotStamp}
                        initial={{ y: -30, rotate: -12, opacity: 0 }}
                        animate={{ y: 0, rotate: 3, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                      >
                        <span className={s.stampTop}>
                          <span>{stamp.value}</span>
                          <span className={s.stampIcon}>
                            <StampIcon type={stamp.icon} />
                          </span>
                        </span>
                        <span className={s.slotCaption}>{stamp.caption}</span>
                        <span className={s.slotPost}>India post</span>
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>

                {tpl && (
                  <p className={s.aboutChip}>
                    About this design · <strong>{tpl.name}</strong>
                    <button type="button" aria-label="Not about this design" onClick={() => setF((p) => ({ ...p, template: '' }))}>
                      ×
                    </button>
                  </p>
                )}

                <p className={s.sentence}>
                  I’m{' '}
                  <label className="sr-only" htmlFor="desk-name">
                    Your name
                  </label>
                  <input
                    id="desk-name"
                    className={`${s.blank} ${errors.name ? s.blankError : ''}`}
                    placeholder="your name"
                    autoComplete="name"
                    value={f.name}
                    onChange={set('name')}
                    {...err('name')}
                  />
                  . We’re celebrating{' '}
                  <label className="sr-only" htmlFor="desk-occasion">
                    Occasion
                  </label>
                  <select id="desk-occasion" className={`${s.blank} ${s.select}`} value={f.occasion} onChange={set('occasion')}>
                    <option value="">a celebration</option>
                    {OCCASIONS.filter((o) => o.slug !== 'other').map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.phrase}
                      </option>
                    ))}
                  </select>{' '}
                  on{' '}
                  <span className={s.dateWrap}>
                    <button
                      type="button"
                      className={`${s.blank} ${s.dateBtn}`}
                      onClick={openDate}
                      aria-label={f.date ? `Celebration date, ${longDate(f.date)}. Change` : 'Pick the celebration date'}
                    >
                      {f.date ? longDate(f.date) : <span className={s.ph}>pick a date</span>}
                    </button>
                    <input
                      ref={dateInput}
                      type="date"
                      className={s.dateNative}
                      tabIndex={-1}
                      aria-hidden="true"
                      value={f.date}
                      onChange={set('date')}
                    />
                  </span>
                  , and I’d love help with{' '}
                  <button
                    type="button"
                    className={`${s.blank} ${s.topicBtn}`}
                    onClick={() => stampsRef.current?.querySelector('[aria-checked=true]')?.focus()}
                    aria-label={`Topic: ${topicPhrase}. Choose a stamp to change it`}
                  >
                    {topicPhrase}
                  </button>
                  . You can reach me on{' '}
                  <span className={s.channels} role="radiogroup" aria-label="Reach me on">
                    {['whatsapp', 'email'].map((c, i) => (
                      <span key={c}>
                        {i > 0 && <span className={s.slash}>/</span>}
                        <button
                          type="button"
                          role="radio"
                          aria-checked={f.channel === c}
                          className={`${s.channel} ${f.channel === c ? s.channelOn : ''}`}
                          onClick={() => {
                            setF((p) => ({ ...p, channel: c }))
                            setErrors((er) => ({ ...er, reach: undefined }))
                          }}
                        >
                          {c === 'email' ? 'Email' : 'WhatsApp'}
                        </button>
                      </span>
                    ))}
                  </span>{' '}
                  at{' '}
                  <label className="sr-only" htmlFor="desk-reach">
                    {f.channel === 'email' ? 'Your email' : 'Your WhatsApp number'}
                  </label>
                  <input
                    id="desk-reach"
                    className={`${s.blank} ${errors.reach ? s.blankError : ''}`}
                    type={f.channel === 'email' ? 'email' : 'tel'}
                    inputMode={f.channel === 'email' ? 'email' : 'tel'}
                    autoComplete={f.channel === 'email' ? 'email' : 'tel'}
                    placeholder={f.channel === 'email' ? 'you@example.com' : '+91 98…'}
                    value={f.reach}
                    onChange={set('reach')}
                    {...err('reach')}
                  />
                  .
                </p>

                <div className={s.errors} aria-live="polite">
                  {errors.name && <p id="desk-name-error">✎ {errors.name}</p>}
                  {errors.reach && <p id="desk-reach-error">✎ {errors.reach}</p>}
                </div>

                <div className={s.ps}>
                  <label htmlFor="desk-ps">P.S.</label>
                  <textarea
                    id="desk-ps"
                    rows={2}
                    maxLength={600}
                    placeholder="Haldi on Friday morning, sangeet and the wedding on Saturday…"
                    value={f.ps}
                    onChange={set('ps')}
                  />
                </div>

                <div className={s.letterFoot}>
                  <button type="submit" className={s.send}>
                    <span>Send as a letter</span>
                    <span aria-hidden="true">→</span>
                  </button>
                  <div className={s.signature}>
                    <p aria-hidden="true">{first ? `— ${first}` : '— …'}</p>
                    <span>Signed by hand in kohl ink</span>
                  </div>
                </div>

                <p className={s.footnote}>✦ Sealed &amp; handled with personal discretion · No automated bots</p>
              </motion.form>
              </motion.div>
            ) : (
              <motion.div
                key="sealed"
                className={s.sealed}
                initial={{ opacity: 0, y: 50, rotateX: -28 }}
                animate={{ opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease } }}
                exit={{ opacity: 0, y: 30, transition: { duration: 0.35, ease } }}
              >
                <div className={s.envelope}>
                  <Envelope to="To the Nimantran studio," address={sent.first ? `from ${sent.first}` : ''} />
                  <motion.span
                    className={s.sealDrop}
                    initial={{ scale: 1.9, opacity: 0, rotate: -24 }}
                    animate={{ scale: [1.9, 0.9, 1], opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.7, duration: 0.6, ease }}
                  >
                    <WaxSeal size="lg" />
                  </motion.span>
                  {Array.from({ length: 6 }, (_, i) => {
                    const a = (i / 6) * Math.PI * 2
                    return (
                      <motion.span
                        key={i}
                        className={s.fleck}
                        initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                        animate={{ x: Math.cos(a) * 64, y: Math.sin(a) * 48, opacity: [0, 1, 0], scale: 1 }}
                        transition={{ delay: 0.95, duration: 0.8, ease }}
                      />
                    )
                  })}
                </div>

                <motion.div
                  className={s.sealedCopy}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5, ease }}
                >
                  <h2 ref={(el) => el?.focus({ preventScroll: true })} tabIndex={-1} className={s.sealedTitle}>
                    Your letter is sealed{sent.first ? ', ' : ''}
                    {sent.first && <em>{sent.first}</em>}.
                  </h2>
                  <p className={s.sealedText}>
                    {sent.via === 'whatsapp'
                      ? 'WhatsApp opened in a new tab with your letter written in. Press send there and it reaches a real person.'
                      : sent.via === 'email'
                        ? 'Your email app is opening with the letter inside. Press send there and it reaches us.'
                        : 'Messages open at launch, so this letter hasn’t been sent yet. It’s kept on this device — copy it now and send it to us once we’re live.'}
                  </p>
                  <div className={s.sealedActions}>
                    <button
                      type="button"
                      className="btn btn--outline btn--sm"
                      onClick={() => {
                        resetTilt()
                        setSent(null)
                      }}
                    >
                      Edit my letter
                    </button>
                    <button type="button" className={s.textBtn} onClick={copy} aria-live="polite">
                      {copied ? 'Copied ✓' : 'Copy message'}
                    </button>
                    <Link href="/occasions" className={s.textBtn}>
                      Browse occasions →
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  )
}
