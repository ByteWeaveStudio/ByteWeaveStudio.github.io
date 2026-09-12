import { Link, useParams } from 'react-router'
import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Section } from '@/components/primitives/Section'
import { FinalCta } from '@/components/sections/FinalCta'
import { Schematic } from '@/components/sections/Schematic'
import { caseStudies, findCaseStudy } from '@/content/caseStudies'
import { NotFoundPage } from './NotFoundPage'

const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

export function CaseStudyPage() {
  const { slug } = useParams()
  const study = slug ? findCaseStudy(slug) : undefined
  if (!study) return <NotFoundPage />

  const others = caseStudies.filter((c) => c.slug !== study.slug)
  const facts = [
    { term: 'Client', detail: study.client ?? 'Under NDA' },
    { term: 'Sector', detail: study.sector },
    { term: 'Our role', detail: study.engagement.role },
    { term: 'Timeline', detail: study.engagement.timeline },
    { term: 'Team', detail: study.engagement.team },
  ]

  return (
    <article>
      <section className="relative overflow-hidden pt-36 md:pt-44">
        {/* Matches PageHeader's wash so the detail pages do not read flatter
            than the index they came from. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[720px]">
          <div className="absolute -top-20 -left-36 h-[520px] w-[700px] rounded-full bg-[#CDEFFB] opacity-55 blur-[130px]" />
          <div className="absolute top-4 right-[-10%] h-[560px] w-[720px] rounded-full bg-[#FDEECB] opacity-55 blur-[130px]" />
          <div className="absolute top-24 right-[12%] h-[380px] w-[440px] rounded-full bg-[#DAD2FB] opacity-50 blur-[120px]" />
        </div>

        <Container>
          <nav aria-label="Breadcrumb">
            <ol className="text-ink-secondary flex flex-wrap items-center gap-2 text-[0.9375rem]">
              <li>
                <Link to="/" className="hover:text-ink inline-block py-0.5 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-ink-secondary">
                /
              </li>
              <li>
                <Link to="/case-studies" className="hover:text-ink inline-block py-0.5 transition-colors">
                  Case studies
                </Link>
              </li>
              <li aria-hidden className="text-ink-secondary">
                /
              </li>
              <li aria-current="page" className="text-ink">
                {study.name}
              </li>
            </ol>
          </nav>

          <Eyebrow className="mt-10">{study.sector}</Eyebrow>
          <h1 className="text-display-l mt-5 max-w-[20ch] font-medium">{study.name}</h1>
          <p className="text-body-l text-ink-secondary mt-7 max-w-[58ch]">{study.summary}</p>

          {study.outcomes.length > 0 ? (
            <dl className="border-line-strong mt-12 grid gap-x-12 gap-y-8 border-t pt-10 sm:grid-cols-2 lg:grid-cols-4">
              {study.outcomes.map((o) => (
                <div key={o.label}>
                  <dt className="sr-only">{o.label}</dt>
                  <dd>
                    <span className="font-serif text-[2.75rem] leading-none">{o.value}</span>
                    <span className="text-ink-secondary mt-3 block max-w-[24ch] text-caption">
                      {o.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </Container>
      </section>

      <Section space="sm">
        <Container>
          <figure>
            <div className="bg-sunk border-line rounded-panel border p-6 sm:p-12">
              <div className="aspect-[640/380] w-full">
                {study.visual.kind === 'schematic' ? (
                  <Schematic id={study.visual.schematic} />
                ) : (
                  <img
                    src={study.visual.src}
                    alt={study.visual.alt}
                    className="rounded-card h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
            <figcaption className="text-ink-secondary mt-4 text-caption">
              A diagram of the system. The screens themselves are not public.
            </figcaption>
          </figure>
        </Container>
      </Section>

      <Section space="md">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="text-eyebrow text-ink-secondary uppercase">The problem</h2>
              <p className="text-body-l mt-5 max-w-[62ch]">{study.problem}</p>

              <h2 className="text-eyebrow text-ink-secondary mt-14 uppercase">The approach</h2>
              <p className="text-body-l text-ink-secondary mt-5 max-w-[62ch]">{study.approach}</p>

              {study.sections.map((s) => (
                <section key={s.heading} className="mt-16">
                  <h2 className="text-h3 max-w-[34ch] font-medium">{s.heading}</h2>
                  {s.body.map((para) => (
                    <p key={para.slice(0, 24)} className="text-ink-secondary mt-5 max-w-[62ch]">
                      {para}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            <aside className="lg:col-span-4 lg:col-start-9 lg:sticky lg:top-28 lg:self-start">
              <div className="border-line-strong border-t pt-8">
                <h2 className="text-eyebrow text-ink-secondary uppercase">The engagement</h2>
                <dl className="mt-5 space-y-4">
                  {facts.map((f) => (
                    <div key={f.term} className="flex gap-4">
                      <dt className="text-ink-secondary w-24 shrink-0 text-caption">{f.term}</dt>
                      <dd className="text-[0.9375rem] font-medium">{f.detail}</dd>
                    </div>
                  ))}
                </dl>

                <h2 className="text-eyebrow text-ink-secondary mt-10 uppercase">Stack</h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {study.stack.map((tech) => (
                    <li
                      key={tech}
                      className="border-line-strong text-ink-secondary rounded-full border px-3 py-1 text-caption"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                <p className="text-ink-secondary mt-10 text-caption">
                  Updated{' '}
                  <time dateTime={study.dateModified}>{longDate(study.dateModified)}</time>
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Section tone="sunk" space="md" labelledBy="faq">
        <Container>
          <h2 id="faq" className="text-h2 max-w-[24ch] font-medium">
            Questions we get asked
          </h2>
          <dl className="border-line-strong mt-12 border-t">
            {study.faq.map((item) => (
              <div
                key={item.q}
                className="border-line grid gap-4 border-b py-8 lg:grid-cols-12 lg:gap-12"
              >
                <dt className="text-h3 font-medium lg:col-span-5">{item.q}</dt>
                <dd className="text-ink-secondary max-w-[62ch] lg:col-span-7">{item.a}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section space="md" labelledBy="more-studies">
        <Container>
          <h2 id="more-studies" className="text-h3 font-medium">
            More work
          </h2>
          <ul className="card-grid mt-10 grid gap-6 md:grid-cols-2">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  to={`/case-studies/${other.slug}`}
                  className="group border-line hover:border-line-strong bg-raised rounded-panel block h-full border p-7 transition-[border-color,transform] duration-300 hover:-translate-y-1"
                >
                  <p className="text-eyebrow text-ink-secondary uppercase">{other.sector}</p>
                  <h3 className="text-h3 group-hover:text-accent mt-3 font-medium transition-colors">
                    {other.name}
                  </h3>
                  <p className="text-ink-secondary mt-3 text-[0.9375rem]">{other.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <FinalCta />
    </article>
  )
}
