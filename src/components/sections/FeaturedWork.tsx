import { Link } from 'react-router'
import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'
import { ArrowRight } from '@/components/primitives/Icon'
import { caseStudies } from '@/content/caseStudies'
import { Schematic } from './Schematic'

/**
 * Homepage teaser. The full write-ups live at /case-studies — this exists to
 * prove the systems are real and send people there, not to tell the story.
 */
export function FeaturedWork() {
  const featured = caseStudies.filter((c) => c.featured)

  return (
    <Section id="work" space="lg" labelledBy="featured-work-heading" card>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Selected work</Eyebrow>
            <h2 id="featured-work-heading" className="text-h2 mt-6 max-w-[20ch] font-medium">
              Systems running in production.
            </h2>
          </div>
          <Link
            to="/case-studies"
            className="group text-ink hover:text-accent inline-flex items-center gap-2 text-[0.9375rem] font-medium transition-colors"
          >
            All case studies
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <ul className="card-grid mt-16 grid gap-8 md:grid-cols-3">
          {featured.map((study, i) => (
            <li key={study.slug}>
              <Reveal delay={i * 70}>
                <Link
                  to={`/case-studies/${study.slug}`}
                  className="group border-line hover:border-line-strong bg-raised rounded-panel flex h-full flex-col border p-6 transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="bg-sunk rounded-card aspect-[640/380] w-full overflow-hidden p-3">
                    {study.visual.kind === 'schematic' ? (
                      <Schematic id={study.visual.schematic} compact />
                    ) : null}
                  </div>

                  <p className="text-eyebrow text-ink-secondary mt-6 uppercase">{study.sector}</p>
                  <h3 className="text-h3 mt-3 font-medium">{study.name}</h3>
                  <p className="text-ink-secondary mt-3 flex-1 text-[0.9375rem]">
                    {study.summary}
                  </p>

                  <div className="border-line mt-6 flex items-end justify-between border-t pt-5">
                    {study.outcomes[0] ? (
                      <span>
                        <span className="font-serif text-[2rem] leading-none">
                          {study.outcomes[0].value}
                        </span>
                        <span className="text-ink-secondary mt-2 block max-w-[20ch] text-caption">
                          {study.outcomes[0].label}
                        </span>
                      </span>
                    ) : (
                      <span className="text-ink-secondary text-caption">Read the write-up</span>
                    )}
                    <ArrowRight className="text-ink-secondary group-hover:text-accent size-4 transition-[transform,color] duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
