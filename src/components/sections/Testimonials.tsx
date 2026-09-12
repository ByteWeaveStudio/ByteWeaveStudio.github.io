import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Section } from '@/components/primitives/Section'
import { testimonials } from '@/content/testimonials'

/**
 * Renders nothing until a verified quote exists.
 *
 * The old site's four testimonials are fabricated template filler (see
 * content/testimonials.ts). An absent section costs nothing; an invented one
 * costs the deal. Adding a single real entry brings this back automatically.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null

  return (
    <Section tone="sunk" space="lg" labelledBy="testimonials-heading" card>
      <Container>
        <Eyebrow>In their words</Eyebrow>
        <h2 id="testimonials-heading" className="sr-only">
          Client testimonials
        </h2>
        <div className="border-line-strong mt-14 grid gap-12 border-t pt-12 lg:grid-cols-2 lg:gap-16">
          {testimonials.map((t) => (
            <figure key={t.name}>
              <blockquote className="font-serif text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.3]">
                “{t.quote}”
              </blockquote>
              <figcaption className="text-ink-secondary mt-6 text-[0.9375rem]">
                <span className="text-ink font-medium">{t.name}</span> — {t.role}, {t.company}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  )
}
