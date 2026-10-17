import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Envelope, Rotary, WaxSeal } from '@/components/props'
import { CONTACT, STUDIO } from '@/data/site'
import { LANGUAGES, STEPS } from '@/sections/content'
import { OCCASIONS_META } from '@/templates/data'
import Opening from './Opening'
import PromiseSlips from './PromiseSlips'
import SealPress from './SealPress'
import MithaiBox from './MithaiBox'
import { CHANGED, CRAFT, KEPT, STUDIO_TEAM, VIGNETTES } from './data'
import s from './about.module.css'

function VignetteArt({ prop }) {
  if (prop === 'calendar') return <Calendar animate={false} />
  if (prop === 'envelope') return <Envelope to="To Bua & family," address="" />
  if (prop === 'rotary') return <Rotary />
  return <MithaiBox className={s.mithai} />
}

function OldWay() {
  return (
    <section className={`${s.sec} ${s.paper}`} aria-labelledby="oldway-title">
      <div className={s.wrap}>
        <header className={s.head}>
          <p className="eyebrow">The old way</p>
          <h2 className={s.h2} id="oldway-title">
            What a <em>visit</em> meant
          </h2>
          <p className={s.lede}>
            Long before anyone forwarded a link, an invitation arrived in person. These are customs many of us grew up
            with, and the ones we still design around.
          </p>
        </header>
        <ol className={s.vignettes}>
          {VIGNETTES.map((v, i) => (
            <li key={v.id} className={s.vignette} data-side={i % 2 ? 'right' : 'left'}>
              <div className={s.vigArt} data-prop={v.prop} aria-hidden="true">
                <VignetteArt prop={v.prop} />
              </div>
              <div className={s.vigText}>
                <h3 className={s.vigTitle}>{v.title}</h3>
                <p>{v.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Ledger() {
  return (
    <section className={`${s.sec} ${s.cream}`} aria-labelledby="ledger-title">
      <div className={s.wrap}>
        <header className={`${s.head} ${s.headCenter}`}>
          <p className="eyebrow">Our approach</p>
          <h2 className={s.h2} id="ledger-title">
            Kept the <em>respect</em>. Changed the hassle.
          </h2>
          <p className={s.lede}>
            Nothing about a good invitation needed fixing except the running around. So we kept what a printed card
            means, and changed only how it travels.
          </p>
        </header>
        <div className={s.ledger}>
          <div className={s.page}>
            <h3 className={`${s.pageTitle} ${s.pageKept}`}>We kept</h3>
            <ul className={s.rows}>
              {KEPT.map((k) => (
                <li key={k}>
                  <span aria-hidden="true">✦</span>
                  {k}
                </li>
              ))}
            </ul>
          </div>
          <span className={s.stitch} aria-hidden="true" />
          <div className={s.page}>
            <h3 className={`${s.pageTitle} ${s.pageChanged}`}>We changed</h3>
            <ul className={s.rows}>
              {CHANGED.map((k) => (
                <li key={k}>
                  <span aria-hidden="true">✦</span>
                  {k}
                </li>
              ))}
            </ul>
          </div>
          <p className={s.marginNote} aria-hidden="true">
            same respect, far less running around
          </p>
        </div>
      </div>
    </section>
  )
}

function Craft() {
  return (
    <section className={`${s.sec} ${s.paper}`} aria-labelledby="craft-title">
      <div className={`${s.wrap} ${s.craft}`}>
        <div className={s.craftIntro}>
          <p className="eyebrow">Our craft</p>
          <h2 className={s.h2} id="craft-title">
            How we <em>make</em> them
          </h2>
          <p className={s.lede}>
            A small studio with a short list of rules. Every template on the site goes through the same four before a
            single family sees it.
          </p>
          <figure className={s.specimen}>
            <ul>
              {LANGUAGES.map((l) => (
                <li key={l.id} lang={l.id}>
                  <span className={s.specLine}>{l.eyebrow}</span>
                  <span className={s.specLabel}>{l.label}</span>
                </li>
              ))}
            </ul>
            <figcaption>“You are invited”, in six of the languages families write in. Any other works too.</figcaption>
          </figure>
        </div>
        <div>
          <ol className={s.craftList}>
            {CRAFT.map((c) => (
              <li key={c.id}>
                <p className={s.craftLabel}>{c.label}</p>
                <h3 className={s.craftTitle}>{c.title}</h3>
                <p className={s.craftBody}>{c.body}</p>
              </li>
            ))}
          </ol>
          <div className={s.steps}>
            <p className={s.stepsHead}>From choosing to sending</p>
            <ol>
              {STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <Link href="/#how" className={s.textLink}>
              See how it works <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Promises() {
  return (
    <section className={`${s.sec} ${s.band}`} aria-labelledby="promises-title">
      <div className={s.wrap}>
        <header className={`${s.head} ${s.headCenter}`}>
          <p className={`eyebrow ${s.eyebrowLight}`}>What you can count on</p>
          <h2 className={`${s.h2} ${s.h2Light}`} id="promises-title">
            Four <em>promises</em>
          </h2>
          <p className={`${s.lede} ${s.ledeLight}`}>
            Only the ones we can keep for every family, every time. They are true of the invitation itself, not of a
            plan or a price.
          </p>
        </header>
        <PromiseSlips />
      </div>
    </section>
  )
}

function Studio() {
  const { founderNote, signature, people } = STUDIO_TEAM
  return (
    <section className={`${s.sec} ${s.cream}`} aria-labelledby="studio-title">
      <div className={s.wrap}>
        <header className={s.head}>
          <p className="eyebrow">The studio</p>
          <h2 className={s.h2} id="studio-title">
            Made by a small <em>studio</em>
          </h2>
          <p className={s.lede}>
            The people who design your invitation will introduce themselves here, in their own words, when we launch.
            Until then we would rather leave the space honest than fill it with stock photos.
          </p>
        </header>

        <div className={s.studio}>
          <article className={s.letter} aria-label="A note from the founders">
            <div className={s.sheet}>
              <p className={s.namaste}>Namaste,</p>
              {founderNote ? (
                <>
                  {founderNote.map((para) => (
                    <p key={para.slice(0, 24)} className={s.letterBody}>
                      {para}
                    </p>
                  ))}
                  {signature && <p className={s.signature}>{signature}</p>}
                </>
              ) : (
                <>
                  <span className={s.ruled} aria-hidden="true" />
                  <span className={`${s.ruled} ${s.ruledShort}`} aria-hidden="true" />
                  <p className={s.pending}>A note from the founders, shared at launch.</p>
                </>
              )}
            </div>
          </article>

          <ul className={s.people} aria-label="The team">
            {people.map((p, i) =>
              p ? (
                <li key={p.name} className={s.person}>
                  <div className={s.frame}>
                    <Image src={p.photo} alt={`${p.name}, ${p.role}`} fill sizes="(max-width: 899px) 45vw, 220px" />
                  </div>
                  <p className={s.personName}>{p.name}</p>
                  <p className={s.personRole}>{p.role}</p>
                </li>
              ) : (
                <li key={`open-${i}`} className={s.person}>
                  <div className={`${s.frame} ${s.frameEmpty}`}>
                    <WaxSeal size="sm" />
                    <span>Shared at launch</span>
                  </div>
                  <p className="sr-only">Team member, shared at launch</p>
                </li>
              ),
            )}
          </ul>
        </div>

        <dl className={s.facts}>
          <div>
            <dt>Based in</dt>
            <dd>{CONTACT.city || <em className={s.atLaunch}>Shared at launch</em>}</dd>
          </div>
          <div>
            <dt>Studio hours</dt>
            <dd>{STUDIO.hours}</dd>
          </div>
          <div>
            <dt>We reply in</dt>
            <dd>{STUDIO.languages}</dd>
          </div>
          <div>
            <dt>Write to us</dt>
            <dd>
              <Link href="/contact" className={s.textLink}>
                Contact the studio <span aria-hidden="true">→</span>
              </Link>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

function Celebrations() {
  return (
    <section className={`${s.sec} ${s.paper} ${s.celebrate}`} aria-labelledby="celebrate-title">
      <div className={s.wrap}>
        <h2 className={s.sentence} id="celebrate-title">
          Birthdays, weddings, <span className={s.nowrap}>Griha Pravesh</span>, baby showers, anniversaries, poojas and
          festivals.
        </h2>
        <ul className={s.occasions}>
          {OCCASIONS_META.map((o) => (
            <li key={o.slug}>
              <Link href={`/templates/category/${o.slug}`}>{o.plural}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Closing() {
  return (
    <section className={`${s.sec} ${s.cream} ${s.closing}`} aria-labelledby="close-title">
      <SealPress />
      <h2 className={s.h2} id="close-title">
        Your celebration deserves a <em>proper</em> invitation.
      </h2>
      <div className={s.actions}>
        <Link href="/#create" className="btn btn--primary">
          Create your invite
        </Link>
        <Link href="/occasions" className="btn btn--outline">
          Explore templates
        </Link>
        <Link href="/contact" className="btn btn--text">
          Write to us <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <>
      <Opening />
      <OldWay />
      <Ledger />
      <Craft />
      <Promises />
      <Studio />
      <Celebrations />
      <Closing />
    </>
  )
}
