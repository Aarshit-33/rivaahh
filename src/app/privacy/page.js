import LegalPage from '@/features/legal/LegalPage'
import { PRIVACY_INTRO, PRIVACY_SECTIONS, PRIVACY_SUMMARY } from '@/features/legal/privacy'

export const metadata = {
  title: 'Privacy policy',
  description:
    'What Nimantran collects when you make or open an invitation, why, who helps us handle it, how long we keep it and the rights you and your guests have.',
  alternates: { canonical: '/privacy' },
}

export default function Page() {
  return (
    <LegalPage
      title={
        <>
          Privacy <em>policy</em>
        </>
      }
      intro={PRIVACY_INTRO}
      summary={PRIVACY_SUMMARY}
      sections={PRIVACY_SECTIONS}
    />
  )
}
