import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'
import { ExtractVisual } from '@/three/ExtractVisual'

/**
 * The reframe from "dev shop" to thesis, and the first serif on the page —
 * its scarcity is what gives it weight.
 *
 * The visual below the copy is the same argument drawn: an invoice on a desk,
 * its fields lifting off the page, and the JSON they become. Hovering a line
 * of the output highlights the region of the page it was read from, which is
 * the "connect what is being seen with what needs to happen next" line made
 * literal rather than decorative.
 */
export function Positioning() {
  return (
    <Section space="xl" labelledBy="positioning-heading" card>
      <Container>
        <Eyebrow>The problem</Eyebrow>

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <h2 id="positioning-heading" className="text-h2 font-medium">
              Most software follows instructions.
              <br />
              <em className="font-serif text-[1.12em] font-normal italic">
                We build software that understands them.
              </em>
            </h2>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-5 lg:col-start-8 lg:pt-2">
            <p className="text-body-l text-ink">
              Software is excellent at processing what has already been structured for it. The
              real world isn&rsquo;t.
            </p>
            <p className="text-body-l text-ink-secondary mt-5">
              Information lives in invoices, contracts, images, conversations, transactions,
              systems, and workflows. Understanding it requires context, reasoning, and the
              ability to connect what is being seen with what needs to happen next.
            </p>
            <p className="text-body-l text-ink-secondary mt-5">
              ByteWeave builds intelligent systems that turn real-world information into usable
              intelligence — enabling software to{' '}
              <strong className="text-ink font-medium">see, understand, reason, and act.</strong>
            </p>
          </Reveal>
        </div>
      </Container>

      <Container className="mt-20 lg:mt-24">
        <Reveal>
          <ExtractVisual />
        </Reveal>

        <Reveal delay={80}>
          <p className="text-body-l text-ink-secondary mx-auto mt-10 max-w-[58ch] text-center">
            From a document on a desk to a decision inside an application, we build the technology
            that connects the two.
          </p>
        </Reveal>
      </Container>
    </Section>
  )
}
