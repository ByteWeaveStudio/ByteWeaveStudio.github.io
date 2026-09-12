import { ButtonLink, ButtonNavLink } from '@/components/primitives/Button'
import { Container } from '@/components/primitives/Container'
import { CONTACT, site } from '@/content/site'
import { WeaveVisual } from '@/three/WeaveVisual'

/** Masked line reveal: the band clips, the line rises inside it. */
function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <span
        className="animate-line-rise block"
        style={{ animationDelay: `${delay}ms` }}
      >
        {children}
      </span>
    </span>
  )
}

export function Hero() {
  return (
    <section id="top" className="stack-base relative pt-32 pb-section-sm md:pt-44 lg:pt-48">
      {/* Signature wash carried over from the old site — cool on the left,
          warm on the right, with a breath of the logo's violet behind the 3D.
          Heavily blurred and low-opacity so it reads as light, not as colour. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[820px] overflow-hidden"
      >
        <div className="absolute -top-24 -left-32 h-[560px] w-[720px] rounded-full bg-[#CDEFFB] opacity-55 blur-[130px]" />
        <div className="absolute top-10 right-[-10%] h-[620px] w-[760px] rounded-full bg-[#FDEECB] opacity-55 blur-[130px]" />
        <div className="absolute top-32 right-[8%] h-[420px] w-[480px] rounded-full bg-[#DAD2FB] opacity-50 blur-[120px]" />
      </div>

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <h1 className="text-display-xl font-medium">
              <Line delay={0}>Software</Line>
              <Line delay={80}>that Thinks.</Line>
            </h1>

            <div className="animate-fade-rise mt-8 max-w-[46ch]" style={{ animationDelay: '320ms' }}>
              <p className="text-body-l text-ink font-medium">{site.supporting}</p>
              <p className="text-body-l text-ink-secondary mt-3">
                We build production-grade software using computer vision, AI, and modern
                engineering.
              </p>
            </div>

            <div
              className="animate-fade-rise mt-10 flex flex-wrap items-center gap-3"
              style={{ animationDelay: '440ms' }}
            >
              <ButtonNavLink to={CONTACT}>Start a project</ButtonNavLink>
              <ButtonLink href="#work" variant="secondary">
                Explore our work
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-5">
            <WeaveVisual />
          </div>
        </div>
      </Container>
    </section>
  )
}
