import Link from 'next/link'
import { SITE } from '@/data/site'
import { LEGAL } from './data'
import { AtLaunch, ContactBlock } from './parts'

// Terms of use · DRAFT, to be reviewed before launch.

export const TERMS_INTRO = (
  <>
    These terms are the agreement between you and {SITE.name} when you use this website, make an invitation or open one.
    They are written to be read, not skimmed past. Please read them with our <Link href="/privacy">privacy policy</Link>
    , which explains how we handle personal data.
  </>
)

export const TERMS_SUMMARY = [
  'You own what you write and upload. We use it only to make and deliver your invitation.',
  'Guests can open and reply to an invitation without an account or an app.',
  'Please use it for real celebrations, and only for people who would want to be invited.',
  'Prices are announced at launch and always shown, with taxes, before you pay.',
  'These terms are governed by Indian law.',
]

export const TERMS_SECTIONS = [
  {
    id: 'agreement',
    title: 'About these terms',
    body: (
      <>
        <p>
          “{SITE.name}”, “we” and “us” mean {SITE.legalName}, which runs this website and the invitations it hosts.
          “You” means anyone who uses the website: a host who makes an invitation, a guest who opens one, or a visitor.
        </p>
        <p>By using the website you agree to these terms. If you do not agree, please do not use it.</p>
      </>
    ),
  },
  {
    id: 'service',
    title: 'The service',
    body: (
      <>
        <p>{SITE.name} lets you:</p>
        <ul>
          <li>choose a card or reel design for your occasion and personalise it with your own words and photos;</li>
          <li>share it as a single link, on WhatsApp or anywhere else;</li>
          <li>collect guests’ replies, and show them the venue, the functions and a countdown.</li>
        </ul>
        <p>
          We are always improving the service, so features may change. If we remove something you have paid for, we will
          tell you and offer a fair alternative or a refund for that part.
        </p>
      </>
    ),
  },
  {
    id: 'accounts',
    title: 'Accounts',
    body: (
      <ul>
        <li>You must be 18 or older to make an invitation and hold an account.</li>
        <li>Please give accurate details and keep your sign-in code or password to yourself.</li>
        <li>
          You are responsible for what happens in your account. Tell us at once if you think someone else is using it.
        </li>
        <li>Guests do not need an account to open an invitation or reply to it.</li>
      </ul>
    ),
  },
  {
    id: 'your-content',
    title: 'Your content',
    body: (
      <>
        <p>
          <strong>You own what you put on your invitation</strong>: your words, names, photos and other material. You
          give us permission to store it, format it to fit the design, and show it to the people you share the link
          with, only so we can run the service for you. This permission ends when you delete the invitation, apart from
          copies kept for a short time in backups.
        </p>
        <p>By adding content, you confirm that:</p>
        <ul>
          <li>you have the right to use it, including photos and any music you upload;</li>
          <li>
            the people named or pictured, or their parents or guardians, are happy for it to be shared with guests.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'our-designs',
    title: 'Our designs',
    body: (
      <p>
        The templates, artwork, motifs, animations and code on {SITE.name} belong to us or to the people who license
        them to us. You may use a design for your own invitations. You may not copy, resell or redistribute the designs
        themselves, or use them to build a competing service.
      </p>
    ),
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    body: (
      <>
        <p>Please use {SITE.name} for real celebrations. Do not use it to:</p>
        <ul>
          <li>share anything unlawful, hateful, obscene, threatening or harassing;</li>
          <li>send invitations to people in bulk who have not asked to hear from you, or for advertising;</li>
          <li>pretend to be someone else, or invite people to an event that does not exist;</li>
          <li>collect guests’ details for anything other than your celebration;</li>
          <li>break, overload, scrape or copy the service, or get around its security.</li>
        </ul>
        <p>
          If an invitation breaks these rules we may take it down, and in serious cases close the account. Where we can,
          we will tell you why first.
        </p>
      </>
    ),
  },
  {
    id: 'payments',
    title: 'Payments',
    body: (
      <>
        <p>
          Prices are <AtLaunch>announced at launch</AtLaunch>. Before you pay, we will always show the full price in
          Indian rupees, including any applicable taxes such as GST, and what it includes.
        </p>
        <p>Payments are handled by a third-party payment gateway. We never see or store your card number or UPI PIN.</p>
      </>
    ),
  },
  {
    id: 'refunds',
    title: 'Refunds and cancellations',
    body: (
      <p>
        Our refund and cancellation policy will be published here before we accept any payment. Until then nothing on
        this site can be bought. <AtLaunch>Policy shared at launch.</AtLaunch>
      </p>
    ),
  },
  {
    id: 'availability',
    title: 'Keeping invitations online',
    body: (
      <p>
        We work hard to keep every invitation online, especially around your event. Occasionally the service may be
        unavailable for maintenance or for reasons outside our control, such as an outage at a hosting provider or a
        messaging app. We will tell hosts about planned maintenance in advance where we can.
      </p>
    ),
  },
  {
    id: 'ending',
    title: 'Ending the agreement',
    body: (
      <p>
        You can stop using {SITE.name} and delete your account at any time. We may suspend or close an account that
        seriously or repeatedly breaks these terms. When an account closes, its invitations stop being available to
        guests.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Our responsibility to you',
    body: (
      <>
        <p>
          We provide {SITE.name} with care, but we cannot promise it will always be free of errors or interruptions, and
          we are not responsible for messaging apps, phone networks or other services we do not control.
        </p>
        <p>
          As far as the law allows, we are not liable for indirect or unforeseeable losses, and our total liability to
          you for any claim is limited to the amount you paid us in the twelve months before it arose. Nothing in these
          terms limits any liability that cannot be limited under Indian law, or your rights as a consumer.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    body: (
      <p>
        We may update these terms as the service grows. We will change the date at the top, and if a change matters to
        how you use {SITE.name}, we will tell you before it takes effect. Continuing to use the service after that means
        you accept the new terms.
      </p>
    ),
  },
  {
    id: 'law',
    title: 'Governing law and disputes',
    body: (
      <>
        <p>
          These terms are governed by the laws of India. If something goes wrong, please write to us first; most
          problems can be put right with a conversation.
        </p>
        <p>
          If a dispute cannot be settled that way, the courts at{' '}
          <span data-sample="true">{LEGAL.jurisdictionCity}</span> will have jurisdiction, without affecting any right
          you have as a consumer to bring a claim where you live.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <>
        <p>Questions about these terms:</p>
        <ContactBlock />
      </>
    ),
  },
]
