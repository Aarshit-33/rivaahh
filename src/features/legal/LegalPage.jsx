import { LEGAL_UPDATED } from '@/data/site'
import Toc from './Toc'
import s from './legal.module.css'

// Shared layout for the Privacy and Terms pages: a draft banner, the title and
// date, a short "in plain words" summary, then the sections with a sticky
// table of contents beside them on desktop.
export default function LegalPage({ title, intro, summary, sections }) {
  const toc = sections.map(({ id, title: t }) => ({ id, title: t }))
  return (
    <div className={s.page}>
      <header className={s.header}>
        <p className={s.banner} role="note">
          <span className={s.bannerMark} aria-hidden="true">
            ✦
          </span>
          <span>
            <strong>Draft — to be reviewed before launch.</strong> This page has not yet been checked by a lawyer.
            Details marked as to be confirmed will be filled in before launch.
          </span>
        </p>
        <p className="eyebrow">Legal</p>
        <h1 className={s.title}>{title}</h1>
        <p className={s.updated}>
          Last updated <time>{LEGAL_UPDATED}</time>
        </p>
        <p className={s.intro}>{intro}</p>
      </header>

      <div className={s.layout}>
        <aside className={s.side}>
          <Toc items={toc} />
        </aside>

        <article className={s.article}>
          <section className={s.summary} aria-labelledby="in-short">
            <h2 id="in-short" className={s.summaryTitle}>
              In short
            </h2>
            <ul>
              {summary.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>

          {sections.map(({ id, title: t, body }) => (
            <section key={id} id={id} className={s.section} aria-labelledby={`${id}-h`} tabIndex={-1}>
              <h2 id={`${id}-h`} className={s.h2}>
                {t}
              </h2>
              <div className={s.prose}>{body}</div>
            </section>
          ))}
        </article>
      </div>
    </div>
  )
}
