import { Phone, WaxSeal } from '@/components/props'
import s from './steps.module.css'

// "From a note to your invitation": what happens after someone writes in.
// The chat is an example, not a real conversation.
export default function Steps() {
  return (
    <section className={s.steps} aria-labelledby="steps-title">
      <div className={s.head}>
        <p className={s.eyebrow}>
          <span aria-hidden="true" /> After you write
        </p>
        <h2 id="steps-title" className={s.title}>
          From a note to your <em>invitation.</em>
        </h2>
        <p className={s.lede}>No cold tickets or robotic dashboards. Just design care from the first note to the send.</p>
      </div>

      <div className={s.row}>
        <span className={s.guide} aria-hidden="true" />

        {/* Step 1: the note */}
        <article className={s.step}>
          <div className={`${s.card} ${s.note}`} aria-hidden="true">
            <div className={s.noteTop}>
              <span className={s.noteHello}>Namaste,</span>
              <span className={s.noteStamp}>
                <b>₹5</b>
                <small>Dak</small>
              </span>
            </div>
            <p className={s.noteBody}>
              “We’re celebrating a wedding in March. We’d love an invitation that carries the evening sangeet and the
              morning pheras — without losing our grandparents along the way…”
            </p>
            <p className={s.cardFoot}>
              <span>Your note</span>
              <span className={s.dot} />
            </p>
          </div>
          <p className={s.stepNo}>Step 01</p>
          <h3 className={s.stepTitle}>You write.</h3>
          <p className={s.stepText}>A few lines about the celebration is plenty.</p>
        </article>

        {/* Step 2: the reply, on the shared phone */}
        <article className={s.step}>
          <div className={s.phone}>
            <Phone label="Example WhatsApp chat with the Nimantran studio">
              <div className={s.chat}>
                <div className={s.chatHead}>
                  <WaxSeal size="sm" />
                  <span>
                    <b>Nimantran Studio</b>
                    <small>Example chat</small>
                  </span>
                </div>
                <div className={s.chatBody}>
                  <p className={`${s.bubble} ${s.bubbleIn}`}>
                    Namaste Priya! We love the sound of the sangeet. Here are two palettes for the two-day
                    festivities…
                    <time>11:42</time>
                  </p>
                  <p className={`${s.bubble} ${s.bubbleOut}`}>
                    This feels like us! Can we see the schedule on the phone?
                    <time>11:44 ✓✓</time>
                  </p>
                </div>
              </div>
            </Phone>
          </div>
          <p className={s.stepNo}>Step 02</p>
          <h3 className={s.stepTitle}>We reply.</h3>
          <p className={s.stepText}>On WhatsApp or email, from a real designer.</p>
        </article>

        {/* Step 3: the sealed invitation */}
        <article className={s.step}>
          <div className={`${s.card} ${s.edition}`} aria-hidden="true">
            <p className={s.editionTop}>
              <span>First edition</span>
              <span>✦</span>
            </p>
            <div className={s.sealWrap}>
              <WaxSeal size="xl" className={s.seal3d} />
            </div>
            <div className={s.editionFoot}>
              <p>To the guests of the celebration</p>
              <span>Live link &amp; RSVP</span>
            </div>
          </div>
          <p className={s.stepNo}>Step 03</p>
          <h3 className={s.stepTitle}>Your invite takes shape.</h3>
          <p className={s.stepText}>We design it with you, ready to share with every guest.</p>
        </article>
      </div>

      <p className={s.ready}>Ready when you are.</p>
    </section>
  )
}
