import Link from 'next/link'
import { Envelope } from '@/components/props'
import s from './not-found.module.css'

export const metadata = {
  title: 'Page not found',
  description: 'This page could not be found. Head home, browse the templates or write to the Nimantran studio.',
}

export default function NotFound() {
  return (
    <section className={s.page} aria-labelledby="nf-title">
      <div className={s.copy}>
        <p className="eyebrow">Error 404 · Page not found</p>
        <h1 className={s.title} id="nf-title">
          This invitation seems to have gone to the wrong <em>address</em>.
        </h1>
        <p className={s.lede}>
          The page you were looking for has moved, or the link was copied with a letter missing. Nothing is lost; here
          are the ways back.
        </p>
        <div className={s.actions}>
          <Link href="/" className="btn btn--primary">
            Back to home
          </Link>
          <Link href="/occasions" className="btn btn--outline">
            Browse templates
          </Link>
          <Link href="/contact" className="btn btn--text">
            Write to us <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className={s.scene} aria-hidden="true">
        <div className={s.glow} />
        <div className={s.letter}>
          <Envelope to="Return to sender," address="Address not known" />
          <span className={s.stamp}>
            <span>Returned</span>
            <small>Not at this address</small>
          </span>
          <span className={s.note}>try the front door?</span>
        </div>
      </div>
    </section>
  )
}
