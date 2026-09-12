import { Link } from 'react-router'
import { PageHeader } from '@/components/layout/PageHeader'
import { Container } from '@/components/primitives/Container'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'
import { ArrowRight } from '@/components/primitives/Icon'
import { FinalCta } from '@/components/sections/FinalCta'
import { Schematic } from '@/components/sections/Schematic'
import { caseStudies } from '@/content/caseStudies'

export function CaseStudiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Case studies"
        title={
          <>
            What we built, and{' '}
            <em className="font-serif font-normal italic">what it changed.</em>
          </>
        }
        lead="Three systems we took from a problem statement to something running in production. What the problem was, how each one is built, what was hard, and what we would do differently."
      />

      <Section space="md">
        <Container>
          <ul className="border-line-strong border-t">
            {caseStudies.map((study, i) => (
              <li key={study.slug} className="border-line border-b">
                <Reveal delay={i * 60}>
                  <Link
                    to={`/case-studies/${study.slug}`}
                    className="group hover:bg-raised -mx-6 grid gap-8 px-6 py-12 transition-colors duration-300 ease-[var(--ease-out)] lg:grid-cols-12 lg:items-center lg:gap-12"
                  >
                    <div className="lg:col-span-5">
                      <div className="bg-sunk border-line rounded-panel aspect-[640/380] w-full border p-4">
                        {study.visual.kind === 'schematic' ? (
                          <Schematic id={study.visual.schematic} compact />
                        ) : null}
                      </div>
                    </div>

                    <div className="lg:col-span-7">
                      <p className="text-eyebrow text-ink-secondary uppercase">{study.sector}</p>
                      <h2 className="text-h2 group-hover:text-accent mt-3 font-medium transition-colors duration-300">
                        {study.name}
                      </h2>
                      <p className="text-body-l text-ink-secondary mt-4 max-w-[52ch]">
                        {study.summary}
                      </p>
                      <p className="text-ink-secondary mt-3 max-w-[56ch] text-[0.9375rem]">
                        {study.problem}
                      </p>

                      <ul className="mt-6 flex flex-wrap gap-2">
                        {study.stack.map((tech) => (
                          <li
                            key={tech}
                            className="border-line-strong text-ink-secondary rounded-full border px-3 py-1 text-caption"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8 flex flex-wrap items-end gap-10">
                        {study.outcomes.slice(0, 2).map((o) => (
                          <div key={o.label}>
                            <span className="font-serif text-[2.5rem] leading-none">
                              {o.value}
                            </span>
                            <span className="text-ink-secondary mt-2 block max-w-[22ch] text-caption">
                              {o.label}
                            </span>
                          </div>
                        ))}
                        <span className="text-ink group-hover:text-accent ml-auto inline-flex items-center gap-2 text-[0.9375rem] font-medium transition-colors">
                          Read case study
                          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <FinalCta />
    </>
  )
}
