import { PageHeader } from '@/components/layout/PageHeader'
import { ButtonLink } from '@/components/primitives/Button'
import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'
import { FinalCta } from '@/components/sections/FinalCta'
import { products } from '@/content/products'

const STATUS: Record<string, { label: string; className: string }> = {
  live: { label: 'Live', className: 'border-accent/30 bg-accent-wash text-accent' },
  building: {
    label: 'In development',
    className: 'border-line-strong text-ink-secondary',
  },
}

/**
 * ByteWeave's own products. Both are live and open to anyone, and neither has
 * a store listing — so availability is stated as what it actually is, a web
 * app that installs from the browser.
 */
export function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        title={
          <>
            We build for ourselves{' '}
            <em className="font-serif font-normal italic">too.</em>
          </>
        }
        lead="Client work pays the bills; our own products are where we find out what a system is really like to run. Both of these are built and operated by the same team that takes on engagements."
      />

      <Section space="md">
        <Container>
          <div className="space-y-8">
            {products.map((product, i) => {
              const status = STATUS[product.status]
              return (
                <Reveal key={product.id} delay={i * 80}>
                  <article className="border-line bg-raised rounded-panel grid gap-10 border p-8 lg:grid-cols-12 lg:gap-14 lg:p-12">
                    <div className="lg:col-span-5">
                      {product.logoKind === 'mark' ? (
                        <span className="border-line bg-raised rounded-card inline-flex size-12 items-center justify-center overflow-hidden border">
                          <img
                            src={product.logo}
                            alt={`${product.name} logo`}
                            className="size-full object-cover"
                            width="48"
                            height="48"
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                      ) : (
                        <img
                          src={product.logo}
                          alt={`${product.name} logo`}
                          className="h-10 w-auto"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        <h2 className="text-h2 font-medium">{product.name}</h2>
                        <span
                          className={`rounded-full border px-3 py-1 text-caption ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="text-body-l text-ink-secondary mt-4 max-w-[40ch]">
                        {product.summary}
                      </p>

                      {product.outcome ? (
                        <div className="border-line mt-8 border-t pt-7">
                          <span className="font-serif text-[3rem] leading-none">
                            {product.outcome.value}
                          </span>
                          <span className="text-ink-secondary mt-2 block max-w-[24ch] text-caption">
                            {product.outcome.label}
                          </span>
                        </div>
                      ) : null}

                      <dl className="border-line mt-8 border-t pt-7">
                        <dt className="text-eyebrow text-ink-secondary uppercase">Availability</dt>
                        <dd className="mt-3 max-w-[38ch] text-[0.9375rem]">
                          {product.availability}
                        </dd>
                      </dl>

                      {product.url ? (
                        <div className="mt-8">
                          <ButtonLink
                            href={product.url}
                            target="_blank"
                            rel="noreferrer"
                            variant="secondary"
                          >
                            Open {product.name}
                          </ButtonLink>
                          {product.domain ? (
                            <p className="text-ink-secondary mt-4 text-caption">
                              {product.domain}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <div className="lg:col-span-6 lg:col-start-7">
                      <p className="text-ink-secondary">{product.description}</p>

                      <h3 className="text-eyebrow text-ink-secondary mt-9 uppercase">
                        What it does
                      </h3>
                      <ul className="mt-5 space-y-3">
                        {product.highlights.map((item) => (
                          <li key={item} className="flex gap-3 text-[0.9375rem]">
                            <span
                              aria-hidden
                              className="bg-accent mt-2.5 size-1.5 shrink-0 rounded-full"
                            />
                            <span className="text-ink-secondary">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <h3 className="text-eyebrow text-ink-secondary mt-9 uppercase">Built with</h3>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {product.stack.map((tech) => (
                          <li
                            key={tech}
                            className="border-line-strong text-ink-secondary rounded-full border px-3 py-1 text-caption"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </Section>

      <Section tone="warm" space="md" labelledBy="products-why">
        <Container>
          <Eyebrow>Why it matters to you</Eyebrow>
          <h2 id="products-why" className="text-h2 mt-6 max-w-[24ch] font-medium">
            Running our own software changes how we build yours.
          </h2>
          <p className="text-body-l text-ink-secondary mt-7 max-w-[62ch]">
            Shipping a product means owning the parts an agency never sees: the on-call, the
            migration that has to run without downtime, the support ticket about an edge case
            nobody designed for. That is where most of our opinions about production engineering
            came from.
          </p>
        </Container>
      </Section>

      <FinalCta />
    </>
  )
}
