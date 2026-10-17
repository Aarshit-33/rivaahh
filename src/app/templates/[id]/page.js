import { notFound } from 'next/navigation'
import { TEMPLATES, getTemplate } from '@/templates/data'
import { ShowcaseProvider } from '@/features/showcase/ShowcaseContext'
import Stage from '@/features/showcase/Stage'
import Karyakram from '@/features/showcase/Karyakram'
import DemoHost from '@/features/showcase/DemoHost'
import MobileBar from '@/features/showcase/MobileBar'
import Reveal from '@/features/showcase/Reveal'
import { Closing, Details, Faq, Itinerary, MakeItYours, Similar, TitleBlock } from '@/features/showcase/Sections'
import s from './page.module.css'

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ id: t.id }))
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const t = getTemplate(id)
  if (!t) return { title: 'Design not found' }
  const kind = t.format === 'reel' ? `${t.duration} reel` : 'card'
  return {
    title: t.name,
    description: `${t.description} A ${kind} invitation for ${t.occasions.join(', ').toLowerCase()}. See it on a phone and a laptop, then try the full-screen demo.`,
    alternates: { canonical: `/templates/${t.id}` },
  }
}

// Every design is prerendered from generateStaticParams; an unknown id is a
// real 404 because params are read before anything is streamed.
export default async function TemplatePage({ params }) {
  const { id } = await params
  const t = getTemplate(id)
  if (!t) notFound()

  return (
    <ShowcaseProvider key={t.id} id={t.id}>
      <div className={s.split}>
        <div className={s.stage}>
          <Stage />
        </div>
        <div className={s.column}>
          <TitleBlock t={t} />
          <Karyakram />
          <Reveal>
            <MakeItYours t={t} />
            <div className={s.pair}>
              <div className={s.pairGrid}>
                <Itinerary />
                <Details t={t} />
              </div>
            </div>
            <Faq t={t} />
            <Similar t={t} />
            <Closing t={t} />
          </Reveal>
        </div>
      </div>
      <MobileBar />
      <DemoHost />
    </ShowcaseProvider>
  )
}
