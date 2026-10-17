import LegalPage from '@/features/legal/LegalPage'
import { TERMS_INTRO, TERMS_SECTIONS, TERMS_SUMMARY } from '@/features/legal/terms'

export const metadata = {
  title: 'Terms of use',
  description:
    'The agreement between you and Nimantran: the service, accounts, your content, acceptable use, payments, liability and governing law.',
  alternates: { canonical: '/terms' },
}

export default function Page() {
  return (
    <LegalPage
      title={
        <>
          Terms of <em>use</em>
        </>
      }
      intro={TERMS_INTRO}
      summary={TERMS_SUMMARY}
      sections={TERMS_SECTIONS}
    />
  )
}
