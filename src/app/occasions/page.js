import Link from 'next/link'
import Landing from '@/features/templates-landing/Landing'
import CategoryCard from '@/features/templates-landing/CategoryCard'
import { OPENING_ID, OPENING_SLIPS, REELS, TOTAL } from '@/features/templates-landing/data'
import { getTemplate } from '@/templates/data'
import s from './page.module.css'

export const metadata = {
  title: 'Occasions',
  description:
    'Invitation cards and reels for weddings, birthdays, Griha Pravesh, baby showers, anniversaries, poojas and festivals. Start with the celebration, then choose a design made for the phone.',
  alternates: { canonical: '/occasions' },
  openGraph: {
    title: 'Occasions — Nimantran',
    description: 'Start with the celebration. Cards and reels made for the phone, opened from one WhatsApp link.',
    url: '/occasions',
  },
}

const featured = getTemplate(OPENING_ID)

// The featured piece in the opening, printed like the cards on the table.
const FEATURED_ITEM = {
  tone: 'ivory',
  icon: 'compass',
  eyebrow: 'Griha Pravesh • Vastu Shanti',
  title: featured.title,
  lines: ['Vastu pooja & dinner reception'],
  place: `${featured.sample.venue}, ${featured.sample.city}`,
  pill: '22 · 04 · 2027',
  quote: `Housewarming • ${featured.name}, ivory courtyard`,
}

export default function OccasionsPage() {
  return (
    <div className={s.page}>
      <div className={s.glowA} aria-hidden="true" />
      <div className={s.glowB} aria-hidden="true" />

      {/* ───────── Opening ───────── */}
      <section className={s.opening} aria-labelledby="templates-title">
        <div className={s.openGrid}>
          <div className={s.copy}>
            <p className={s.eyebrow}>
              <span aria-hidden="true">•</span> Occasions
            </p>
            <h1 id="templates-title" className={s.title}>
              Find the one that feels like{' '}<em>yours.</em>
            </h1>
            <p className={s.lede}>
              Start with the celebration. Every collection is made for the phone — cards and reels your guests open on
              WhatsApp.
            </p>
            <p className={s.honest}>
              Design directions we’re finishing for launch · {TOTAL} designs, {REELS} of them reels.
            </p>
          </div>

          <div className={s.feature}>
            <CategoryCard
              item={FEATURED_ITEM}
              href={`/templates/${featured.id}`}
              label={`${featured.name} • Griha Pravesh card`}
              className={s.featureCard}
            />
          </div>
        </div>

        {/* Spilling preview slips peeking below the opening. */}
        <ul className={s.slips} aria-label="Designs to start with">
          {OPENING_SLIPS.map((slip) => (
            <li key={slip.id} className={`${s.slip} ${s[`slip_${slip.tone}`]}`}>
              <Link href={`/templates/${slip.id}`}>
                <span className={s.slipName}>{slip.name}</span>
                <span className={s.slipNote}>{slip.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────── Question line + the spread ───────── */}
      <Landing />

      {/* ───────── Closing ───────── */}
      <section className={s.closing} aria-labelledby="closing-title">
        <div className={s.closingInner}>
          <h2 id="closing-title" className={s.steps}>
            Pick a design <span aria-hidden="true">✦</span> Add your details <span aria-hidden="true">✦</span> Share
            one link
          </h2>
          <p className={s.closingText}>
            No app downloads for guests. One WhatsApp link with directions to the venue, a page for every function and
            RSVPs that come straight back to you.
          </p>
          <div className={s.closingActions}>
            <Link href="/#create" className={`btn btn--primary ${s.closingCta}`}>
              Create your invite
            </Link>
            <Link href="/contact?topic=bespoke" className={s.closingLink}>
              Ask about a design →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
