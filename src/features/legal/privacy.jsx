import Link from 'next/link'
import { SITE } from '@/data/site'
import { DEVICE_STORAGE, LEGAL } from './data'
import { ContactBlock } from './parts'
import s from './legal.module.css'

// Privacy policy · DRAFT, to be reviewed before launch.

export const PRIVACY_INTRO = (
  <>
    This policy explains what {SITE.name} collects when you make an invitation, when a guest opens one, and when anyone
    writes to us; why we need it; who helps us handle it; and what you can ask us to do with it. We have written it in
    plain English. If anything is unclear, ask us and we will explain.
  </>
)

export const PRIVACY_SUMMARY = [
  'We collect only what an invitation needs: the host’s details, the invitation itself, and guests’ replies.',
  'Guests never need an account. We do not read your WhatsApp messages or your phone’s contacts.',
  'We do not sell personal data, and we do not use invitations or guest lists for advertising.',
  'Names, shortlists and drafts you type on this site stay on your device until you choose to send them.',
  'You can ask to see, correct or delete your data at any time.',
]

export const PRIVACY_SECTIONS = [
  {
    id: 'who-we-are',
    title: 'Who we are',
    body: (
      <>
        <p>
          {SITE.name} (“we”, “us”) makes digital invitations for Indian celebrations: a design you personalise, shared
          as one link that guests open on their phones. This policy applies to this website, to every invitation we
          host, and to messages you send us.
        </p>
        <p>
          For the details you give us as a host, and for messages you send us, we decide how the data is used. For your
          guests’ replies, you decide who is invited and we handle their replies on your behalf, to deliver them to you.
        </p>
      </>
    ),
  },
  {
    id: 'what-we-collect',
    title: 'What we collect',
    body: (
      <>
        <h3>From hosts, the people who make an invitation</h3>
        <ul>
          <li>Your name and the phone number or email address you sign in with.</li>
          <li>
            What you put on the invitation: names of the family, dates, times, venues, functions, messages, photos and
            any music you choose.
          </li>
          <li>A guest list, if you choose to add one.</li>
          <li>
            Payment confirmations. Card, UPI and bank details are entered with our payment provider; we receive only a
            confirmation of payment, never your card number or UPI PIN.
          </li>
        </ul>
        <h3>From guests, the people who open an invitation</h3>
        <ul>
          <li>Their RSVP: whether they are coming, the name they type, how many people, and any note they add.</li>
          <li>
            Basic technical details every website receives, such as the type of phone and browser, an approximate
            location from the network address, and when the invitation was opened. We use these to keep invitations
            working and safe.
          </li>
        </ul>
        <h3>From anyone who writes to us</h3>
        <ul>
          <li>The name, contact details, occasion, date and message you enter in the contact form.</li>
        </ul>
        <h3>What we do not collect</h3>
        <ul>
          <li>We do not ask guests to sign up, install an app or share their contacts.</li>
          <li>We cannot read your WhatsApp chats. We only see that someone opened the link.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'why',
    title: 'Why we use it',
    body: (
      <>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th scope="col">Purpose</th>
                <th scope="col">What we use</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>To make, host and show your invitation to the guests you send it to</td>
                <td>Invitation details, photos, music</td>
              </tr>
              <tr>
                <td>To pass guests’ replies to the host</td>
                <td>RSVPs and notes</td>
              </tr>
              <tr>
                <td>To sign you in and keep your account yours</td>
                <td>Phone number or email</td>
              </tr>
              <tr>
                <td>To take payment and keep tax records</td>
                <td>Payment confirmations, billing details</td>
              </tr>
              <tr>
                <td>To answer your questions</td>
                <td>Contact-form messages</td>
              </tr>
              <tr>
                <td>To keep the service secure and stop misuse</td>
                <td>Technical details, account activity</td>
              </tr>
              <tr>
                <td>To understand which pages help and which do not</td>
                <td>Counts and trends, not individual guests</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          We rely on your consent, which you give when you make an invitation, reply to one or send us a message, and on
          the other lawful grounds that India’s Digital Personal Data Protection Act, 2023 allows. Where we rely on
          consent you can withdraw it at any time; this does not affect what was done before.
        </p>
        <p>
          <strong>We do not sell personal data</strong>, and we do not use invitation content or guest details to
          advertise to anyone.
        </p>
      </>
    ),
  },
  {
    id: 'who-helps',
    title: 'Who helps us handle it',
    body: (
      <>
        <p>
          Like most small studios, we use a few trusted service providers. They handle data only on our instructions and
          only for the job we give them:
        </p>
        <ul>
          <li>a cloud hosting provider, which stores invitations and serves them to guests;</li>
          <li>an email or messaging provider, which sends sign-in codes and RSVP notifications;</li>
          <li>a payment gateway, which takes payments;</li>
          <li>a privacy-respecting analytics tool, which counts visits in aggregate.</li>
        </ul>
        <p>
          Some of these providers may store data on servers outside India. Where they do, we choose providers that
          protect it to the standard Indian law requires. We will name our providers here at launch.
        </p>
        <p>
          We will also share information if the law requires it, for example in response to a valid order from a court
          or government authority.
        </p>
      </>
    ),
  },
  {
    id: 'how-long',
    title: 'How long we keep it',
    body: (
      <ul>
        <li>
          <strong>Invitations and RSVPs:</strong> {LEGAL.retention.invitation}, so you can keep it as a keepsake. You
          can delete it sooner at any time.
        </li>
        <li>
          <strong>Your account:</strong> {LEGAL.retention.account}.
        </li>
        <li>
          <strong>Messages to us:</strong> {LEGAL.retention.contact}.
        </li>
        <li>
          <strong>Payment records:</strong> as long as Indian tax and accounting law requires.
        </li>
      </ul>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your rights, and your guests’ rights',
    body: (
      <>
        <p>Under India’s Digital Personal Data Protection Act, 2023, you can ask us to:</p>
        <ul>
          <li>tell you what personal data we hold about you and how we use it;</li>
          <li>correct anything that is wrong or out of date;</li>
          <li>delete your data, unless the law requires us to keep it;</li>
          <li>name someone to act for you if you are unable to;</li>
          <li>listen to a complaint, and put it right.</li>
        </ul>
        <p>
          <strong>Guests have the same rights.</strong> A guest can ask the host to remove their reply, or write to us
          directly and we will remove it and let the host know.
        </p>
        <p>
          We will answer every request, and we may need to confirm who you are first. If you are not satisfied with our
          answer you can complain to the Data Protection Board of India.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and storage on your device',
    body: (
      <>
        <p>
          We use no advertising cookies. A few things are saved in your browser’s local storage so the site remembers
          them between visits. They stay on your device and are not sent to us:
        </p>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">What it keeps</th>
              </tr>
            </thead>
            <tbody>
              {DEVICE_STORAGE.map(([key, what]) => (
                <tr key={key}>
                  <td>
                    <code>{key}</code>
                  </td>
                  <td>{what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Clearing your browser’s site data removes all of them. When accounts open at launch, we will also use one
          essential cookie to keep you signed in, and list it here.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    title: 'Children',
    body: (
      <p>
        Invitations are made by adults. Many celebrate children, such as a first birthday or a naming ceremony, so they
        may include a child’s name or photo. By adding them, the host confirms they are the child’s parent or guardian,
        or have that person’s permission. We do not knowingly collect data from children directly.
      </p>
    ),
  },
  {
    id: 'security',
    title: 'Keeping it safe',
    body: (
      <p>
        Invitations are served over encrypted connections (HTTPS), and access inside the studio is limited to the people
        who need it. No system is perfect; if a breach ever affects your data, we will tell you and the authorities as
        the law requires.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <p>
        When this policy changes we will update the date at the top. If a change affects how we use data you have
        already given us, we will tell you before it takes effect. You can also read our{' '}
        <Link href="/terms">terms of use</Link>.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact and grievances',
    body: (
      <>
        <p>For any question, request or complaint about your data:</p>
        <ContactBlock />
      </>
    ),
  },
]
