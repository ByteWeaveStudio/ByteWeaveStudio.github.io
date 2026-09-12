import { About } from '@/components/sections/About'
import { Capabilities } from '@/components/sections/Capabilities'
import { FeaturedWork } from '@/components/sections/FeaturedWork'
import { FinalCta } from '@/components/sections/FinalCta'
import { Hero } from '@/components/sections/Hero'
import { Method } from '@/components/sections/Method'
import { Positioning } from '@/components/sections/Positioning'
import { Proof } from '@/components/sections/Proof'
import { TechnicalDepth } from '@/components/sections/TechnicalDepth'
import { Testimonials } from '@/components/sections/Testimonials'
import { Why } from '@/components/sections/Why'

export function HomePage() {
  return (
    <>
      <Hero />
      <Proof />
      <Positioning />
      <Capabilities />
      <FeaturedWork />
      <Method />
      <TechnicalDepth />
      <Why />
      <Testimonials />
      <About />
      <FinalCta />
    </>
  )
}
