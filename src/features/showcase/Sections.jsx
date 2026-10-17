// The reading column's static sections. Server components: everything here
// renders to HTML; the interactive pieces are small client islands.

import Link from 'next/link'
import { THEME_LABEL } from '@/templates/data'
import TitleActions from './TitleActions'
import FirstVisitNote from './FirstVisitNote'
import SimilarRow from './SimilarRow'
import { INCLUDED, ITINERARY, designFaq, editableItems, formatLine, occasionLink, specRows } from './content'
import s from './showcase.module.css'

export function TitleBlock({ t }) {
  const occ = occasionLink(t)
  return (
    <header className={s.title}>
      <nav aria-label="Breadcrumb">
        <ol className={s.crumbs}>
          <li>
            <Link href="/occasions">Occasions</Link>
          </li>
          <li>
            <Link href={occ.href}>{occ.label}</Link>
          </li>
        </ol>
      </nav>
      <h1 className={s.name}>{t.name}</h1>
      <p className={s.desc}>{t.description}</p>
      <ul className={s.facts} aria-label="About this design">
        <li className={s.factFormat}>{formatLine(t)}</li>
        <li>{t.occasions.join(', ')}</li>
        <li>{t.tradition}</li>
        <li>{t.style}</li>
      </ul>
      <TitleActions />
      <FirstVisitNote />
    </header>
  )
}

export function MakeItYours({ t }) {
  const items = editableItems(t, THEME_LABEL)
  return (
    <section className={`${s.section} ${s.yours}`} aria-labelledby="yours-title" data-reveal>
      <h2 className={s.h2} id="yours-title">
        Make it <em>yours</em>
      </h2>
      <dl className={s.yoursList}>
        {items.map(([label, text]) => (
          <div key={label} className={s.yoursItem}>
            <dt>{label}</dt>
            <dd>{text}</dd>
          </div>
        ))}
      </dl>
      <p className={s.footnote}>The full editor opens when you use this design.</p>
    </section>
  )
}

export function Itinerary() {
  return (
    <section className={s.section} aria-labelledby="guests-title" data-reveal>
      <h2 className={s.h2} id="guests-title">
        From you to <em>every guest</em>
      </h2>
      <p className={s.sub}>One link, sent the way you already talk to family.</p>
      <div className={s.slipShadow}>
        <div className={s.slip}>
          <p className={s.slipHead}>
            <span>The way it travels</span>
            <span>Who</span>
          </p>
          <ol className={s.slipRows}>
            {ITINERARY.map(([what, who]) => (
              <li key={what} className={s.slipRow}>
                <span>{what}</span>
                <span className={s.slipLeader} aria-hidden="true" />
                <em>{who}</em>
              </li>
            ))}
          </ol>
          <p className={s.slipBar}>One link · every guest · any phone</p>
        </div>
      </div>
    </section>
  )
}

export function Details({ t }) {
  return (
    <section className={s.section} aria-labelledby="details-title" data-reveal>
      <h2 className={s.h2} id="details-title">
        The <em>details</em>
      </h2>
      <table className={s.spec}>
        <caption className="sr-only">About {t.name}</caption>
        <tbody>
          {specRows(t, THEME_LABEL).map(([label, value]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={s.included}>
        <h3 className={s.h3}>What’s included with every design</h3>
        <ul className={s.includedList}>
          {INCLUDED.map(([label, text]) => (
            <li key={label}>
              <span className={s.star} aria-hidden="true">
                ✦
              </span>
              <span>
                <strong>{label}</strong>
                {text}
              </span>
            </li>
          ))}
        </ul>
        <p className={s.price}>
          <span className={s.priceTag}>Price at launch</span>
          <span>Every design comes with the same features, whichever plan you choose.</span>
          <Link href="/#pricing" className={s.arrowLink}>
            See the plans <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </section>
  )
}

export function Faq({ t }) {
  return (
    <section className={s.section} aria-labelledby="faq-title" data-reveal>
      <h2 className={s.h2} id="faq-title">
        Before you <em>choose</em>
      </h2>
      <div className={s.faq}>
        {designFaq(t, THEME_LABEL).map(([q, a]) => (
          <details key={q} className={s.faqItem}>
            <summary>
              <span>{q}</span>
              <span className={s.faqMark} aria-hidden="true" />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function Similar({ t }) {
  return (
    <section className={`${s.section} ${s.similar}`} aria-labelledby="similar-title" data-reveal>
      <div className={s.similarHead}>
        <h2 className={s.h2s} id="similar-title">
          Others in the same <em>spirit</em>
        </h2>
        <span className={s.drag} aria-hidden="true">
          Drag →
        </span>
      </div>
      <SimilarRow id={t.id} />
    </section>
  )
}

export function Closing({ t }) {
  const occ = occasionLink(t)
  const ask = `/contact?template=${t.id}${occ.slug ? `&occasion=${occ.slug}` : ''}`
  return (
    <section className={s.closing} aria-labelledby="closing-title" data-closing data-reveal>
      <p className={s.closingLine} id="closing-title">
        Like {t.name}? Add your details and watch it become <em>yours</em>.
      </p>
      <div className={s.closingActions}>
        <Link href="/#create" className="btn btn--primary">
          Use this design
        </Link>
        <Link href={ask} className={s.arrowLink}>
          Ask about this design <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
