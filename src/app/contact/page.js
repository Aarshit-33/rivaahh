import Link from 'next/link'
import { CHANNELS } from '@/contact/info'
import { STUDIO } from '@/data/site'
import WritingDesk from '@/features/contact-desk/WritingDesk'
import Steps from '@/features/contact-desk/Steps'
import QuickAnswers from '@/features/contact/QuickAnswers'
import s from './page.module.css'

export const metadata = {
  title: 'Contact',
  description:
    'Write to the Nimantran studio about your wedding, birthday, Griha Pravesh or any celebration. WhatsApp is quickest, email works too, and a person reads every message.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact — Nimantran',
    description: 'Write to us like you’d invite us. Fill in the letter and we’ll pick it up from there.',
    url: '/contact',
  },
}

// Notes beside each channel, as on the writing desk.
const NOTES = {
  whatsapp: 'Quickest while you plan',
  email: 'For longer briefs, bespoke designs and notes',
  instagram: 'New palettes and designs as they’re made',
}
const LABELS = { whatsapp: 'WhatsApp', email: 'Letter by email', instagram: 'Instagram' }

export default function ContactPage() {
  return (
    <div className={s.page}>
      {/* ───────── The interactive writing desk ───────── */}
      <section className={s.hero} id="contact-desk" aria-labelledby="contact-title">
        <span className={s.grain} aria-hidden="true" />
        <span className={s.glowA} aria-hidden="true" />
        <span className={s.glowB} aria-hidden="true" />

        <div className={s.heroGrid}>
          <div className={s.directory}>
            <p className={s.eyebrow}>
              <span aria-hidden="true" /> Contact
            </p>
            <h1 id="contact-title" className={s.h1}>
              Write to us like you’d <em>invite</em> us.
            </h1>
            <p className={s.lede}>
              Fill in the letter and we’ll pick it up from there. WhatsApp is quickest; a letter by email works too. A
              person reads every message.
            </p>

            <ul className={s.channels}>
              {CHANNELS.map((c) => (
                <li key={c.id}>
                  <div className={s.channelRow}>
                    <span className={s.channelLabel}>{LABELS[c.id]}</span>
                    {c.href ? (
                      <a href={c.href} target="_blank" rel="noreferrer" className={s.channelValue}>
                        {c.value}
                      </a>
                    ) : (
                      <span className={s.channelTbc}>Shared at launch</span>
                    )}
                  </div>
                  <span className={s.channelNote}>{NOTES[c.id]}</span>
                </li>
              ))}
            </ul>

            <p className={s.open}>
              <span aria-hidden="true" />
              Studio desk: {STUDIO.hours}
            </p>
          </div>

          <div className={s.deskCol}>
            <WritingDesk />
          </div>
        </div>
      </section>

      <Steps />

      {/* ───────── Quick answers ───────── */}
      <section className={s.answers} id="quick-answers" aria-labelledby="answers-title">
        <div className={s.answersGrid}>
          <div className={s.answersHead}>
            <p className={s.eyebrow}>
              <span aria-hidden="true" /> Quick answers
            </p>
            <h2 id="answers-title" className={s.h2}>
              Before you <em>write</em>.
            </h2>
            <p className={s.answersLede}>
              A few common wonders about our invitations, how they reach your guests, and what happens at launch.
            </p>
            <div className={s.guidance}>
              <span>Human guidance</span>
              <p>Have a date in mind? You can write to us without knowing every function or timing yet.</p>
            </div>
          </div>
          <div className={s.answersList}>
            <QuickAnswers />
            <a href="#contact-desk" className={s.backUp}>
              <span>Still unsure? The writing desk above reaches a real person.</span> <b>Write to us ↑</b>
            </a>
          </div>
        </div>
      </section>

      {/* ───────── Closing strip ───────── */}
      <section className={s.closing} aria-labelledby="closing-title">
        <h2 id="closing-title" className={s.closingTitle}>
          Prefer to just start?
        </h2>
        <div className={s.closingActions}>
          <Link href="/#create" className="btn btn--primary">
            Create your invite
          </Link>
          <Link href="/occasions" className="btn btn--outline">
            Explore occasions
          </Link>
        </div>
      </section>
    </div>
  )
}
