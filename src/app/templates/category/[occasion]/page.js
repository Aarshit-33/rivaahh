import Link from 'next/link'
import { notFound } from 'next/navigation'
import CategoryWall from '@/features/templates/CategoryWall'
import { OCCASION_NOTES, REASSURANCE } from '@/features/templates/content'
import { Spark } from '@/features/templates/Icons'
import { OCCASIONS_META, occasionBySlug, templatesFor } from '@/templates/data'
import s from './page.module.css'

// Every slug is prerendered by generateStaticParams, so the page is static; the
// params are read at the top on purpose (a real 404 for unknown slugs comes
// from src/proxy.js). This tells the dev-time instant-navigation check so.
export const instant = false

export function generateStaticParams() {
  return OCCASIONS_META.map((o) => ({ occasion: o.slug }))
}

export async function generateMetadata({ params }) {
  const { occasion } = await params
  const occ = occasionBySlug(occasion)
  if (!occ) return { title: 'Occasions' }
  const title = `${occ.title} invitations`
  const description = OCCASION_NOTES[occ.slug]?.meta || occ.line
  return {
    title,
    description,
    alternates: { canonical: `/templates/category/${occ.slug}` },
    openGraph: { title: `${title} — Nimantran`, description },
  }
}

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

// All six occasions are prerendered; an unknown slug never gets here
// (src/proxy.js rewrites it to the 404 page before rendering starts).
export default async function CategoryPage({ params }) {
  const { occasion } = await params
  const occ = occasionBySlug(occasion)
  if (!occ) notFound()

  const list = templatesFor(occ.label)
  const reels = list.filter((t) => t.format === 'reel').length
  const notes = OCCASION_NOTES[occ.slug]
  const parts = list[0]?.parts || []
  const others = OCCASIONS_META.filter((o) => o.slug !== occ.slug)
  const kind =
    occ.slug === 'pooja-festivals'
      ? 'festival'
      : occ.slug === 'griha-pravesh'
        ? 'Griha Pravesh'
        : occ.title.toLowerCase()

  return (
    <div className={s.page}>
      <div className={s.grain} aria-hidden="true" />
      <CategoryWall
        slug={occ.slug}
        intro={
          <>
            <nav aria-label="Breadcrumb" className={s.crumbs}>
              <ol>
                <li>
                  <Link href="/occasions">Occasions</Link>
                </li>
                <li aria-current="page">{occ.plural}</li>
              </ol>
            </nav>
            <h1 id="category-title" className={s.title}>
              {occ.title} invitations that feel like <em>yours.</em>
            </h1>
            <p className={s.line}>{occ.line}</p>
            <p className={s.count}>
              {plural(list.length, 'design', 'designs')}
              {reels > 0 && <> · {plural(reels, 'reel', 'reels')}</>}
            </p>
            <p className={s.honest}>Design directions we’re finishing for launch.</p>
          </>
        }
      />

      <section className={s.know} aria-labelledby="know-title">
        <div>
          <h2 id="know-title" className={s.knowTitle}>
            What every {kind} invitation holds
          </h2>
          <ol className={s.parts}>
            {parts.map(([id, name, value]) => (
              <li key={id}>
                <span className={s.partName}>{name}</span>
                <span className={s.partValue}>{value}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className={s.knowTitle}>Good to know</h2>
          <dl className={s.tips}>
            {notes?.tips.map(([t, d]) => (
              <div key={t}>
                <dt>{t}</dt>
                <dd>{d}</dd>
              </div>
            ))}
          </dl>
          <ul className={s.reassure}>
            {REASSURANCE.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={s.bottom} aria-labelledby="others-title">
        <h2 id="others-title" className={s.othersTitle}>
          Other celebrations
        </h2>
        <ul className={s.others}>
          {others.map((o, i) => (
            <li key={o.slug}>
              {i > 0 && <Spark className={s.star} />}
              <Link href={`/templates/category/${o.slug}`}>{o.label}</Link>
              <span className={s.otherCount}>{templatesFor(o.label).length}</span>
            </li>
          ))}
        </ul>
        <p className={s.bespoke}>
          Want something made just for you?
          <Link href="/contact" className={s.bespokeLink}>
            Ask for a bespoke design →
          </Link>
        </p>
      </section>
    </div>
  )
}
