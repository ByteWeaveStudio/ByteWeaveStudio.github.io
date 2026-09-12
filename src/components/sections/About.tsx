import { Link } from 'react-router'
import { ArrowRight } from '@/components/primitives/Icon'
import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'

/**
 * Typographic composition rather than a photograph.
 *
 * The brief asks for real team photography and explicitly rules out stock —
 * and no real photo exists (the old site's "ByteWeave Team" image is an
 * AI-generated desk with no people in it). Saying it in type is honest and
 * reads as intentional; a generated photo would not.
 */
export function About() {
  return (
    <Section id="about" tone="warm" space="lg" labelledBy="about-heading" card>
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Eyebrow>About</Eyebrow>
            <h2 id="about-heading" className="text-display-l mt-6 font-medium">
              Small team.
              <br />
              <em className="font-serif font-normal italic">Serious engineering.</em>
            </h2>
          </div>

          <Reveal delay={80} className="lg:col-span-5 lg:col-start-8 lg:pt-4">
            <p className="text-body-l text-ink-secondary">
              ByteWeave is a small studio in Bangalore, working with teams wherever they are. The
              people who scope your project are the people who build it — there is no account
              layer between you and the engineering.
            </p>
            <p className="text-body-l text-ink-secondary mt-5">
              We have spent five years shipping document understanding pipelines, video analytics,
              LLM tooling and the web and mobile software around them. We take on work where the
              hard part is making something reliable, not making something impressive.
            </p>
            <dl className="border-line-strong mt-10 grid grid-cols-2 gap-6 border-t pt-8">
              <div>
                <dt className="text-ink-secondary text-caption">Based in</dt>
                <dd className="mt-1 font-medium">Bangalore, India</dd>
              </div>
              <div>
                <dt className="text-ink-secondary text-caption">Working with</dt>
                <dd className="mt-1 font-medium">Startups &amp; SMBs</dd>
              </div>
            </dl>
            <Link
              to="/about"
              className="group text-ink hover:text-accent mt-10 inline-flex items-center gap-2 text-[0.9375rem] font-medium transition-colors"
            >
              More about the studio
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
