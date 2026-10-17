'use client'

import { MotionConfig, motion } from 'motion/react'
import { WaxSeal } from '@/components/props'
import s from './about.module.css'

const ease = [0.22, 1, 0.36, 1]
// Six tiny flecks of gold that jump out as the seal lands.
const FLECKS = [
  [-46, -14],
  [-34, 30],
  [-8, -44],
  [30, -36],
  [48, 8],
  [22, 40],
]

// The closing wax seal presses down once as it comes into view: it drops in a
// little large, squashes, then settles. Under reduced motion Motion skips the
// transforms, so the seal is simply there, already pressed (flecks are hidden in CSS).
export default function SealPress() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div className={s.sealWrap} initial="up" whileInView="down" viewport={{ once: true, amount: 0.9 }}>
        <motion.span
          className={s.sealShadow}
          aria-hidden="true"
          variants={{ up: { opacity: 0.2, scale: 1.25 }, down: { opacity: 1, scale: 1 } }}
          transition={{ duration: 0.7, ease }}
        />
        <motion.div
          className={s.sealBody}
          variants={{
            up: { scale: 1.12, y: -10 },
            down: { scale: [1.12, 0.97, 1.03, 1], scaleY: [1.12, 0.94, 1, 1], y: [-10, 0, 0, 0] },
          }}
          transition={{ duration: 0.75, times: [0, 0.45, 0.75, 1], ease: 'easeOut' }}
        >
          <WaxSeal size="lg" />
        </motion.div>
        {FLECKS.map(([x, y], i) => (
          <motion.span
            key={i}
            className={s.fleck}
            aria-hidden="true"
            variants={{
              up: { opacity: 0, x: 0, y: 0, scale: 0.4 },
              down: { opacity: [0, 1, 0], x, y, scale: 1 },
            }}
            transition={{ delay: 0.32, duration: 0.9, ease }}
          />
        ))}
      </motion.div>
    </MotionConfig>
  )
}
