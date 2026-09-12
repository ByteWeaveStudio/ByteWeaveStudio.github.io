import { Link } from 'react-router'
import { PageHeader } from '@/components/layout/PageHeader'
import { ButtonNavLink } from '@/components/primitives/Button'
import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'
import { ArrowRight } from '@/components/primitives/Icon'
import { FinalCta } from '@/components/sections/FinalCta'
import { firstConversation, youGet, youWont } from '@/content/engagement'
import { products } from '@/content/products'
import { CONTACT, MAILTO, site } from '@/content/site'

/**
 * The page a prospect reads immediately before deciding whether to write.
 *
 * Deliberately carries nothing that appears elsewhere: the capabilities, the
 * method and the principles are on the homepage, the proof is in the case
 * studies, the products have their own page. What is left is the only thing
 * this page can uniquely answer — what working with this studio is actually
 * like, and what it is not.
 *
 * The old /work page was folded in here. It turned out to be entirely
 * duplication (metrics, capabilities, case-study cards and the client wall all
 * live on the homepage), so nothing from it survived the merge.
 */
export function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={
          <>
            Small team.{' '}
            <em className="font-serif font-normal italic">Serious engineering.</em>
          </>
        }
        lead="ByteWeave is an AI engineering studio in Bangalore, working with teams worldwide. We take on work where the hard part is making something reliable, not making something impressive."
      />

      <Section space="md">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="text-body-l">
                We work where engineering meets applied intelligence: getting meaning out of the
                images, documents, video and data a business already has, then building the
                software that puts it to use.
              </p>
              <p className="text-body-l text-ink-secondary mt-6">
                Five years of that has produced document understanding pipelines, video analytics,
                LLM tooling and the applications around them — plus two products we run ourselves.
                The through-line is not a technology. It is a preference for execution over
                experimentation.
              </p>
              <p className="text-body-l text-ink-secondary mt-6">
                We stay deliberately small. It means we take fewer projects, and it means the
                person who understands your problem is the person writing the code.
              </p>
            </div>

            <dl className="border-line-strong space-y-8 border-t pt-8 lg:col-span-4 lg:col-start-9 lg:border-t-0 lg:pt-0">
              <div>
                <dt className="text-ink-secondary text-caption">Based in</dt>
                <dd className="mt-1 font-medium">{site.address.line}</dd>
              </div>
              <div>
                <dt className="text-ink-secondary text-caption">Working with</dt>
                <dd className="mt-1 font-medium">Startups &amp; SMBs, worldwide</dd>
              </div>
              <div>
                <dt className="text-ink-secondary text-caption">Building since</dt>
                <dd className="mt-1 font-medium">5+ years</dd>
              </div>
              <div>
                <dt className="text-ink-secondary text-caption">Direct line</dt>
                <dd className="mt-1">
                  <a
                    href={MAILTO}
                    className="text-accent inline-block py-0.5 font-medium underline underline-offset-4"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </Container>
      </Section>

      {/* The centrepiece: what this studio is, stated as a contrast. Saying
          plainly what we will not do is the fastest way to be believed about
          what we will. */}
      <Section tone="cool" space="lg" labelledBy="about-engagement">
        <Container>
          <Eyebrow>Working together</Eyebrow>
          <h2 id="about-engagement" className="text-h2 mt-6 max-w-[24ch] font-medium">
            What you get, and{' '}
            <em className="font-serif text-[1.12em] font-normal italic">what you won&rsquo;t.</em>
          </h2>

          <div className="mt-16 grid gap-x-16 gap-y-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h3 className="text-eyebrow text-ink-secondary uppercase">What you get</h3>
              <ul className="border-line-strong mt-6 border-t">
                {youGet.map((item, i) => (
                  <li key={item.title} className="border-line border-b">
                    <Reveal delay={i * 40}>
                      <div className="flex gap-4 py-6">
                        <span
                          aria-hidden
                          className="bg-accent mt-2.5 size-1.5 shrink-0 rounded-full"
                        />
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-ink-secondary mt-1.5 max-w-[52ch] text-[0.9375rem]">
                            {item.body}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <h3 className="text-eyebrow text-ink-secondary uppercase">What you won&rsquo;t</h3>
              <ul className="border-line-strong mt-6 space-y-5 border-t pt-6">
                {youWont.map((item) => (
                  <li key={item} className="text-ink-secondary flex gap-3 text-[0.9375rem]">
                    <span aria-hidden className="bg-line-strong mt-2.5 h-px w-4 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-ink-secondary mt-8 max-w-[34ch] text-caption">
                If any of those is what you need, we are the wrong studio — and we would rather
                say so on the first call than the third invoice.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Credibility that belongs only here: we run our own software. One line
          and a link — the detail is on the Products page. */}
      <Section space="md" labelledBy="about-products">
        <Container>
          <div className="border-line rounded-panel border p-8 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-12">
            <div>
              <h2 id="about-products" className="text-h3 max-w-[30ch] font-medium">
                We are also the ones on call for our own software.
              </h2>
              <p className="text-ink-secondary mt-3 max-w-[56ch]">
                {products.map((p) => p.name).join(' and ')} are built and operated by the same
                team that takes on engagements. Most of what we believe about production
                engineering came from running them.
              </p>
            </div>
            <Link
              to="/products"
              className="group text-ink hover:text-accent mt-6 inline-flex shrink-0 items-center gap-2 text-[0.9375rem] font-medium transition-colors lg:mt-0"
            >
              See the products
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Container>
      </Section>

      <Section tone="warm" space="lg" labelledBy="about-first">
        <Container>
          <Eyebrow>Starting</Eyebrow>
          <h2 id="about-first" className="text-h2 mt-6 max-w-[20ch] font-medium">
            The first conversation.
          </h2>

          <ol className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-3">
            {firstConversation.map((step, i) => (
              <li key={step}>
                <Reveal delay={i * 60}>
                  <div className="border-line-strong border-t pt-6">
                    <span className="text-ink-secondary text-caption tabular-nums">0{i + 1}</span>
                    <p className="text-body-l mt-3">{step}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <div className="mt-14">
            <ButtonNavLink to={CONTACT}>Send us the problem</ButtonNavLink>
          </div>
        </Container>
      </Section>

      <FinalCta />
    </>
  )
}
