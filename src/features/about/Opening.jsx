'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { Phone } from '@/components/props'
import InviteScreen from '@/components/invite/InviteScreen'
import { getTemplate } from '@/templates/data'
import { CAPTIONS, CARD } from './data'
import s from './opening.module.css'

const TEMPLATE = getTemplate(CARD.templateId)

const clamp01 = (v) => Math.min(1, Math.max(0, v))
// Slow at both ends, like a hand turning a card over.
const ease = (t) => 0.5 - Math.cos(Math.PI * t) / 2

// Marigold heads strung along the toran, with a mango leaf under every other one.
const TORAN = [36, 54, 72, 90, 108, 125, 142, 160, 178, 196, 214]
// Rounded so the server and the browser print exactly the same numbers.
const sag = (x) => {
  const t = (x - 24) / 202
  return Math.round((28 + 84 * t * (1 - t)) * 10) / 10
}

function CardFront() {
  return (
    <div className={s.front}>
      <svg className={s.frontArt} viewBox="0 0 250 350" preserveAspectRatio="none" aria-hidden="true">
        {/* maroon double border */}
        <rect x="13" y="13" width="224" height="324" rx="2" className={s.ruleOuter} />
        <rect x="19" y="19" width="212" height="312" rx="1.5" className={s.ruleInner} />
        {/* corner ornaments */}
        {[
          [26, 26],
          [224, 26],
          [26, 324],
          [224, 324],
        ].map(([x, y]) => (
          <path
            key={`${x}-${y}`}
            d={`M${x} ${y - 4} L${x + 4} ${y} L${x} ${y + 4} L${x - 4} ${y} Z`}
            className={s.goldFill}
          />
        ))}
        {/* gold arch */}
        <path d="M44 318 V150 C44 92 82 64 125 50 C168 64 206 92 206 150 V318" className={s.arch} />
        <path d="M54 318 V154 C54 102 88 78 125 66 C162 78 196 102 196 154 V318" className={s.archThin} />
        <circle cx="125" cy="42" r="3" className={s.goldFill} />
        {/* marigold toran across the top */}
        <path d="M24 28 Q125 70 226 28" className={s.string} />
        {TORAN.map((x, i) => (
          <g key={x}>
            {i % 2 === 1 && <path d={`M${x} ${sag(x) + 3} q-4 9 0 16 q4 -7 0 -16 Z`} className={s.leaf} />}
            <circle cx={x} cy={sag(x)} r="5.2" className={s.marigold} />
            <circle cx={x} cy={sag(x)} r="2.2" className={s.marigoldCore} />
          </g>
        ))}
      </svg>
      <div className={s.frontText}>
        <p className={s.hindi} lang="hi">
          {CARD.hindi}
        </p>
        <p className={s.invited}>{CARD.english}</p>
        <p className={s.names}>{CARD.names}</p>
        <span className={s.star} aria-hidden="true">
          ✦
        </span>
        <p className={s.when}>{CARD.date}</p>
        <p className={s.where}>{CARD.place}</p>
      </div>
      <p className={s.sample}>Sample card</p>
      <span className={s.shade} data-shade="front" />
    </div>
  )
}

function CardBack() {
  return (
    <div className={s.back}>
      <div className={s.phoneBox}>
        <Phone>
          <InviteScreen template={TEMPLATE} poster inert />
        </Phone>
        <span className={`${s.shade} ${s.shadePhone}`} data-shade="back" />
      </div>
    </div>
  )
}

export default function Opening() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          wide: '(min-width: 900px)',
          fine: '(hover: hover) and (pointer: fine)',
        },
        (ctx) => {
          const { motion, wide, fine } = ctx.conditions
          if (!motion) return undefined
          const el = root.current
          const q = gsap.utils.selector(el)
          const [card] = q('[data-card]')
          const [shadow] = q('[data-shadow]')
          const [shadeFront] = q('[data-shade="front"]')
          const [shadeBack] = q('[data-shade="back"]')
          const edges = q('[data-edge]')
          const caps = q('[data-cap]')
          const [hint] = q('[data-hint]')

          const render = (p) => {
            const t = ease(clamp01((p - 0.06) / 0.86))
            const a = 180 * t
            const mid = Math.sin(Math.PI * t)
            const cos = Math.cos((a * Math.PI) / 180)
            card.style.transform = `rotateZ(${-4 * (1 - mid)}deg) rotateX(${8 * mid}deg) rotateY(${a}deg)`
            // The contact shadow narrows to a line edge-on, then widens again
            // under the (narrower) phone.
            const w = Math.max(0.05, Math.abs(cos) * (a < 90 ? 1 : 0.64))
            shadow.style.transform = `translateX(-50%) scaleX(${w})`
            shadow.style.opacity = String(0.55 + 0.45 * Math.abs(cos))
            // Each face darkens a little as it turns away from the lamp.
            shadeFront.style.opacity = String(a < 90 ? (1 - cos) * 0.5 : 0)
            shadeBack.style.opacity = String(a > 90 ? (1 + cos) * 0.5 : 0)
            // The gold paper edge catches the light as it passes 90°.
            const glint = String(a <= 90 ? clamp01(1 - (90 - a) / 30) : clamp01(1 - (a - 90) / 6))
            edges.forEach((e) => (e.style.opacity = glint))
            caps[0].style.opacity = String(clamp01(1 - (t - 0.36) / 0.14))
            caps[1].style.opacity = String(clamp01((t - 0.56) / 0.14))
            caps[1].style.transform = `translateY(${(1 - clamp01((t - 0.56) / 0.14)) * 6}px)`
            if (hint) hint.style.opacity = String(clamp01(1 - p / 0.12))
          }
          render(0)

          const st = ScrollTrigger.create({
            trigger: el,
            pin: true,
            // On a phone the opening is taller than the screen, so it pins once
            // the card itself is fully in view.
            start: () => (el.offsetHeight > window.innerHeight + 2 ? 'bottom bottom' : 'top top'),
            end: () => `+=${Math.round(window.innerHeight * (wide ? 1.4 : 1))}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => render(self.progress),
            onRefresh: (self) => render(self.progress),
          })

          // At most ±3° of pointer tilt, desktop only.
          let off = () => {}
          if (fine) {
            const [stage] = q('[data-stage]')
            const [tilt] = q('[data-tilt]')
            const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.8, ease: 'power3.out' })
            const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.8, ease: 'power3.out' })
            const move = (e) => {
              const r = stage.getBoundingClientRect()
              const x = clamp01((e.clientX - r.left) / r.width) - 0.5
              const y = clamp01((e.clientY - r.top) / r.height) - 0.5
              rx(-y * 6)
              ry(x * 6)
            }
            const leave = () => {
              rx(0)
              ry(0)
            }
            stage.addEventListener('pointermove', move)
            stage.addEventListener('pointerleave', leave)
            off = () => {
              stage.removeEventListener('pointermove', move)
              stage.removeEventListener('pointerleave', leave)
            }
          }

          // Fonts change the copy's height, which moves the pin.
          document.fonts?.ready.then(() => ScrollTrigger.refresh())

          return () => {
            off()
            st.kill(true)
            card.style.transform = ''
          }
        },
      )
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section className={s.opening} ref={root} aria-labelledby="about-title">
      <div className={s.copy}>
        <p className="eyebrow">About Nimantran</p>
        <h1 className={s.title} id="about-title">
          We still believe in the <em>hand-delivered</em> card.
        </h1>
        <p className={s.lede}>
          For generations, an invitation meant someone came to your door. We make invitations for the phone, without
          losing what that visit meant.
        </p>
      </div>

      <div className={s.stage} data-stage>
        <div className={s.glow} aria-hidden="true" />
        <div
          className={s.object}
          role="img"
          aria-label="A traditional printed invitation that turns over to show the same invitation on a phone."
        >
          <span className={s.shadow} data-shadow />
          <div className={s.tilt} data-tilt>
            <div className={s.card} data-card>
              <CardFront />
              <span className={`${s.edge} ${s.edgeLeft}`} data-edge />
              <span className={`${s.edge} ${s.edgeRight}`} data-edge />
              <CardBack />
            </div>
          </div>
        </div>
      </div>

      <div className={s.aside}>
        <ul className={s.captions}>
          {CAPTIONS.map((c, i) => (
            <li key={c} data-cap={i} className={i ? s.capBack : undefined}>
              <span aria-hidden="true">✦</span> {c}
            </li>
          ))}
        </ul>
        <p className={s.hint} data-hint aria-hidden="true">
          <span />
          Scroll to turn the card
        </p>
      </div>
    </section>
  )
}
