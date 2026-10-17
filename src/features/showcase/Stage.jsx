'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { Laptop, Phone } from '@/components/props'
import InviteScreen from '@/components/invite/InviteScreen'
import { THEME_LABEL } from '@/templates/data'
import { useShowcase } from './ShowcaseContext'
import { STAGE, SWATCH } from './content'
import { preloadDemo } from './DemoHost'
import { ExpandIcon, LaptopIcon, PauseIcon, PhoneIcon, PlayIcon, RestartIcon } from './icons'
import s from './stage.module.css'

const VIEWS = [
  ['both', 'Both'],
  ['phone', 'Phone'],
  ['laptop', 'Laptop'],
]
const EASE = [0.22, 1, 0.36, 1]

// Keep the follower device on the same part, at the same depth, as the device
// the visitor is scrolling. Parts are sized to each screen, so the position is
// mapped part by part rather than in pixels.
function mirror(from, to) {
  const parts = Array.from(from.querySelectorAll('[data-part]'))
  if (!parts.length) return
  const top = from.scrollTop
  const max = from.scrollHeight - from.clientHeight
  if (top >= max - 1) {
    to.scrollTop = to.scrollHeight
    return
  }
  let p = parts[0]
  for (const el of parts) if (el.offsetTop <= top + 1) p = el
  const q = to.querySelector(`[data-part="${p.dataset.part}"]`)
  if (!q) return
  const into = top - p.offsetTop
  to.scrollTop =
    into <= p.offsetHeight
      ? q.offsetTop + (into / p.offsetHeight) * q.offsetHeight
      : q.offsetTop + q.offsetHeight + (into - p.offsetHeight) * (to.clientHeight / from.clientHeight)
}

/**
 * The stage: a field in the template's own darkest colour with a laptop and a
 * phone playing the invitation live. The device the visitor can touch (the
 * phone, or the laptop in Laptop view) is the master; the other mirrors it and
 * is hidden from assistive technology so the invitation is met once.
 */
export default function Stage() {
  const sc = useShowcase()
  const { base, template, theme, setTheme, view, setView, shown, setShown, playing, setPlaying, take, restart, isReel, reduced, masterRef, names, date, openDemo } = sc
  const phoneRef = useRef(null)
  const laptopRef = useRef(null)
  const jumpedAt = useRef(0)
  const master = view === 'laptop' ? 'laptop' : 'phone'
  const field = STAGE[theme] ?? STAGE.royal
  const partName = template.parts.find(([id]) => id === shown)?.[1] ?? 'Cover & opening'

  // The karyakram, the restart and the demo talk to whichever device is master.
  useEffect(() => {
    masterRef.current = {
      scrollToPart: (id, smooth) => {
        jumpedAt.current = performance.now()
        ;(master === 'laptop' ? laptopRef : phoneRef).current?.scrollToPart(id, smooth)
      },
      get element() {
        return (master === 'laptop' ? laptopRef : phoneRef).current?.element
      },
    }
  }, [master, masterRef])

  // Mirror the master into the follower.
  useEffect(() => {
    const from = (master === 'laptop' ? laptopRef : phoneRef).current?.element
    const to = (master === 'laptop' ? phoneRef : laptopRef).current?.element
    if (!from || !to) return
    let raf = 0
    const sync = () => {
      raf = 0
      mirror(from, to)
      // The caption follows what the visitor scrolls to; right after a jump
      // from the programme it keeps the part that was asked for.
      if (performance.now() - jumpedAt.current > 1200) {
        const line = from.scrollTop + from.clientHeight * 0.35
        let id = 'cover'
        from.querySelectorAll('[data-part]').forEach((el) => {
          if (el.offsetTop <= line) id = el.dataset.part
        })
        setShown(id)
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sync)
    }
    from.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(onScroll)
    ro.observe(from)
    ro.observe(to)
    sync()
    return () => {
      from.removeEventListener('scroll', onScroll)
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [master, take, setShown])

  const layoutTransition = { layout: { duration: reduced ? 0 : 0.6, ease: EASE } }
  const title = (where) => `${base.name} invitation, ${where} view`

  const tryInvitation = () => masterRef.current?.element?.focus()

  const invite = (which) => {
    const isMaster = master === which
    return (
      <InviteScreen
        key={`${which}-${take}`}
        ref={which === 'phone' ? phoneRef : laptopRef}
        template={template}
        names={names}
        date={date}
        playing={playing}
        inert={!isMaster}
      />
    )
  }

  return (
    <div
      className={`${s.stage} ${field.light ? s.light : ''}`}
      style={{ '--field': field.field }}
      data-view={view}
      id="showcase-stage"
    >
      <div className={s.glow} aria-hidden="true" />
      <div className={s.grain} aria-hidden="true" />

      <button type="button" className={s.skip} onClick={tryInvitation}>
        Try the invitation
      </button>

      <p className={s.caption} aria-live="polite">
        <span className={s.captionDot} aria-hidden="true" />
        Now showing · {partName}
      </p>

      <motion.div
        layout
        transition={layoutTransition}
        className={`${s.slot} ${s.laptopSlot} ${master !== 'laptop' ? s.follower : ''}`}
        data-lenis-prevent={master === 'laptop' || undefined}
        aria-hidden={master !== 'laptop' || undefined}
        inert={master !== 'laptop' || undefined}
        role={master === 'laptop' ? 'region' : undefined}
        aria-label={master === 'laptop' ? title('laptop') : undefined}
      >
        <Laptop url={`nimantran.in/${base.id}`}>
          <div className={s.lapScreen}>
            <div className={s.lapBlur} aria-hidden="true">
              <InviteScreen template={template} names={names} date={date} poster inert />
            </div>
            <div className={s.lapInvite}>{invite('laptop')}</div>
          </div>
        </Laptop>
      </motion.div>

      <motion.div
        layout
        transition={layoutTransition}
        className={`${s.slot} ${s.phoneSlot} ${master !== 'phone' ? s.follower : ''}`}
        data-lenis-prevent={master === 'phone' || undefined}
        aria-hidden={master !== 'phone' || undefined}
        inert={master !== 'phone' || undefined}
        role={master === 'phone' ? 'region' : undefined}
        aria-label={master === 'phone' ? title('phone') : undefined}
      >
        <div className={s.tilt}>
          <Phone screenClassName={s.phoneScreen}>{invite('phone')}</Phone>
        </div>
      </motion.div>

      {base.variants.length > 1 && (
        <div className={s.swatches} role="group" aria-label="Colourways">
          {base.variants.map((v) => (
            <button
              key={v}
              type="button"
              className={s.swatch}
              aria-pressed={theme === v}
              aria-label={`${THEME_LABEL[v]} colourway`}
              title={THEME_LABEL[v]}
              onClick={() => setTheme(v)}
            >
              <span style={{ background: SWATCH[v] }} />
            </button>
          ))}
        </div>
      )}

      <div className={s.bar} role="toolbar" aria-label="Stage controls">
        <div className={s.views} role="group" aria-label="View">
          {VIEWS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={s.view}
              aria-pressed={view === id}
              onClick={() => setView(id)}
            >
              {view === id && (
                <motion.span layoutId="stage-view" className={s.viewPill} transition={{ duration: reduced ? 0 : 0.35, ease: EASE }} />
              )}
              <span className={s.viewLabel}>{label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`${s.ctl} ${s.chip}`}
          onClick={() => setView(view === 'laptop' ? 'phone' : 'laptop')}
        >
          {view === 'laptop' ? <PhoneIcon /> : <LaptopIcon />}
          <span>{view === 'laptop' ? 'Phone view' : 'Laptop view'}</span>
        </button>

        {isReel && (
          <button
            type="button"
            className={`${s.ctl} ${s.icon}`}
            aria-label={playing ? 'Pause the reel' : 'Play the reel'}
            onClick={() => setPlaying(!playing)}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
        )}
        <button type="button" className={`${s.ctl} ${s.restart}`} onClick={restart} aria-label="Restart the invitation">
          <RestartIcon />
          <span className={s.ctlText}>Restart</span>
        </button>
        <span className={s.hair} aria-hidden="true" />
        <button
          type="button"
          className={`${s.ctl} ${s.full}`}
          onClick={(e) => openDemo(e.currentTarget)}
          onPointerEnter={preloadDemo}
          onFocus={preloadDemo}
          aria-label="Open the full-screen demo"
        >
          <ExpandIcon />
          <span className={s.ctlText}>Full screen</span>
        </button>
      </div>
    </div>
  )
}
