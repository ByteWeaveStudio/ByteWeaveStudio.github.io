import { Link } from 'react-router'
import { PageHeader } from '@/components/layout/PageHeader'
import { Container } from '@/components/primitives/Container'
import { Section } from '@/components/primitives/Section'
import { MAILTO, site } from '@/content/site'
import type { LegalDoc } from '@/content/legal'

/**
 * Both legal documents share this layout. Numbered headings give the page a
 * table of contents for free and let someone cite "clause 5" without a
 * screenshot; the anchors also give a crawler stable in-page targets.
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageHeader eyebrow={doc.eyebrow} title={doc.title} lead={doc.intro}>
        {doc.effectiveLabel ? (
          <p className="text-ink-secondary text-caption mt-6">
            Last updated{' '}
            <time dateTime={doc.effective}>{doc.effectiveLabel}</time>
          </p>
        ) : null}
      </PageHeader>

      <Section space="md">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Contents. Sticky on desktop, a plain list on mobile. */}
            <nav
              aria-label="On this page"
              className="lg:col-span-3 lg:sticky lg:top-28 lg:self-start"
            >
              <h2 className="text-ink-secondary text-caption">Contents</h2>
              <ol className="mt-4 space-y-2">
                {doc.sections.map((section, i) => (
                  <li key={section.heading}>
                    <a
                      href={`#${slug(section.heading)}`}
                      className="hover:text-ink text-ink-secondary inline-block py-0.5 text-[0.9375rem] underline-offset-4 hover:underline"
                    >
                      <span className="tabular-nums">{i + 1}.</span> {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="lg:col-span-8 lg:col-start-5">
              {doc.sections.map((section, i) => (
                <section
                  key={section.heading}
                  id={slug(section.heading)}
                  className="border-line scroll-mt-28 border-t pt-8 first:border-t-0 first:pt-0 [&+section]:mt-12"
                >
                  <h2 className="text-h3 font-medium">
                    <span className="text-ink-secondary mr-2 tabular-nums">{i + 1}.</span>
                    {section.heading}
                  </h2>
                  {section.blocks.map((block, j) =>
                    block.list ? (
                      <ul key={j} className="mt-4 space-y-2">
                        {block.list.map((item) => (
                          <li
                            key={item}
                            className="text-ink-secondary relative pl-5 before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-current before:opacity-40"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p key={j} className="text-ink-secondary mt-4 max-w-[68ch]">
                        {block.text}
                      </p>
                    ),
                  )}
                </section>
              ))}

              <section
                id="contact"
                className="border-line scroll-mt-28 mt-12 border-t pt-8"
              >
                <h2 className="text-h3 font-medium">
                  <span className="text-ink-secondary mr-2 tabular-nums">
                    {doc.sections.length + 1}.
                  </span>
                  Contact
                </h2>
                <p className="text-ink-secondary mt-4 max-w-[68ch]">
                  Questions about this document, or about how we handle your data, go to a
                  person rather than a queue.
                </p>
                <p className="mt-4">
                  <a
                    href={MAILTO}
                    className="text-accent inline-block py-0.5 font-medium underline underline-offset-4"
                  >
                    {site.email}
                  </a>
                </p>
                <p className="text-ink-secondary text-caption mt-4">
                  {site.name} · {site.address.line} · {site.address.reach}
                </p>
              </section>

              <p className="text-ink-secondary text-caption border-line mt-12 border-t pt-8">
                See also{' '}
                <Link to={other(doc.slug)} className="underline underline-offset-4">
                  {other(doc.slug) === '/privacy-policy' ? 'Privacy Policy' : 'Terms & Conditions'}
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const other = (s: string) => (s === 'privacy-policy' ? '/terms-and-conditions' : '/privacy-policy')
