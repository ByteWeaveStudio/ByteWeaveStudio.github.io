import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'
import { principles } from '@/content/principles'

/** No icons here — an icon would trivialise an objection-handling section. */
export function Why() {
  return (
    <Section space="lg" labelledBy="why-heading" card>
      <Container>
        <Eyebrow>Why ByteWeave</Eyebrow>
        <h2 id="why-heading" className="text-h2 mt-6 max-w-[16ch] font-medium">
          AI is easy to demo.{' '}
          <em className="font-serif text-[1.12em] font-normal italic">
            Engineering it is harder.
          </em>
        </h2>

        <dl className="border-line-strong mt-20 border-t">
          {principles.map((principle, i) => (
            <Reveal key={principle.title} delay={i * 60}>
              <div className="border-line grid gap-4 border-b py-10 lg:grid-cols-12 lg:gap-10">
                <dt className="text-h3 font-medium lg:col-span-5">{principle.title}</dt>
                <dd className="text-ink-secondary max-w-[62ch] lg:col-span-7">{principle.body}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </Section>
  )
}
