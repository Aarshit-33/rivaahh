'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Phone } from '@/components/props'
import InviteScreen from '@/components/invite/InviteScreen'
import { getTemplate } from '@/templates/data'
import { formatInviteDate, usePersonal } from '@/lib/stores'
import { useReducedMotion } from './hooks'
import { FAN_IDS } from './content'
import s from './explorer.module.css'

const ease = [0.22, 1, 0.36, 1]
// Resting angles, left to right. The centre stays upright.
const ANGLES = [-12, -6, 0, 6, 12]

/**
 * The opening "hand of cards": five real designs in the shared phone, fanned
 * from a point below. The centre reel plays once on load (never under reduced
 * motion); hovering spreads the fan a little. Each phone opens its showcase.
 *
 * - `ids`  up to five template ids, left to right (default: a mix of occasions);
 *          the middle one should be a reel
 */
export default function FanOpening({ ids = FAN_IDS }) {
  const fan = useMemo(() => ids.map(getTemplate).filter(Boolean).slice(0, 5), [ids])
  // Fewer than five designs keep the middle angles.
  const offset = Math.floor((5 - fan.length) / 2)
  const reduced = useReducedMotion()
  const personal = usePersonal()
  const [spread, setSpread] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (reduced) return
    const start = setTimeout(() => setPlaying(true), 700)
    const stop = setTimeout(() => setPlaying(false), 5600)
    return () => {
      clearTimeout(start)
      clearTimeout(stop)
    }
  }, [reduced])

  const date = formatInviteDate(personal.date)

  return (
    <div className={s.fan} onPointerEnter={() => setSpread(true)} onPointerLeave={() => setSpread(false)}>
      <div className={s.fanGlow} aria-hidden="true" />
      <ul className={s.fanHand}>
        {fan.map((t, n) => {
          const i = n + offset
          const angle = ANGLES[i] + (spread ? Math.sign(ANGLES[i]) * 3 : 0)
          const centre = i === 2
          return (
            <motion.li
              key={t.id}
              className={`${s.fanCard} ${centre ? s.fanCentre : ''} ${i === 0 || i === 4 ? s.fanOuter : ''}`}
              style={{ zIndex: centre ? 5 : 5 - Math.abs(i - 2) }}
              initial={reduced ? false : { rotate: 0, y: 40, opacity: 0 }}
              animate={{ rotate: angle, y: 0, opacity: 1 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: spread ? 0.5 : 1.1, delay: spread ? 0 : 0.15 + Math.abs(i - 2) * 0.08, ease }
              }
            >
              <Link
                href={`/templates/${t.id}`}
                className={s.fanLink}
                aria-label={`${t.name}, ${t.format} for ${t.occasions[0].toLowerCase()}. Open the design`}
              >
                <Phone>
                  <InviteScreen
                    template={t}
                    poster
                    inert
                    playing={centre && playing}
                    names={personal.names}
                    date={date}
                  />
                </Phone>
              </Link>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
