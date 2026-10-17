'use client'

import InkToInstant from '@/hero/InkToInstant'
import LifeSection from '@/life/LifeSection'
import Device from '@/device/Device'
import FilmStrip from '@/sections/FilmStrip'
import Occasions from '@/sections/Occasions'
import Personalise from '@/sections/Personalise'
import Compare from '@/sections/Compare'
import Languages from '@/sections/Languages'
import Pricing from '@/sections/Pricing'
import Faq from '@/sections/Faq'
import { ClosingCta } from '@/sections/Closing'
import { DeviceProvider } from '@/device/DeviceContext'
import ContactSection from '@/contact/ContactSection'
import LeaveByFullLoad from './LeaveByFullLoad'

// The home page, exactly as in the original app (hero untouched). Nav and
// footer come from the root layout.
export default function Home() {
  return (
    <DeviceProvider>
      <LeaveByFullLoad />

      {/* Rendered first so its parts exist before the hero builds its timeline. */}
      <Device />

      <InkToInstant />

      <LifeSection />
      <FilmStrip />
      <Occasions />
      <Personalise />
      <Languages />
      <Compare />
      <Pricing />
      <Faq />
      <ContactSection />
      <ClosingCta />
    </DeviceProvider>
  )
}
