import Link from 'next/link'
import { CONTACT } from '@/data/site'
import { LEGAL } from './data'
import s from './legal.module.css'

// "Shared at launch" in the brand's Gold Ink italic.
export function AtLaunch({ children = 'Shared at launch' }) {
  return <em className={s.atLaunch}>{children}</em>
}

// How to reach us about privacy or these terms. Never invents an address.
export function ContactBlock() {
  return (
    <dl className={s.contact}>
      <div>
        <dt>Email</dt>
        <dd>{CONTACT.email ? <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> : <AtLaunch />}</dd>
      </div>
      <div>
        <dt>Grievance officer</dt>
        <dd>{LEGAL.grievanceOfficer || <AtLaunch />}</dd>
      </div>
      <div>
        <dt>Until then</dt>
        <dd>
          <Link href="/contact">Write to us through the contact page</Link>. A person reads every message.
        </dd>
      </div>
    </dl>
  )
}
