import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ByteWeaveLogo } from '@/assets/logo/ByteWeaveLogo'
import { Container } from '@/components/primitives/Container'
import { products } from '@/content/products'
import { CONTACT, nav, site } from '@/content/site'

const capabilityLinks = [
  { label: 'Computer Vision', href: '/#capabilities' },
  { label: 'Document Intelligence', href: '/#capabilities' },
  { label: 'AI, LLMs & Agents', href: '/#capabilities' },
  { label: 'Applications & Automation', href: '/#capabilities' },
]

const LINK =
  'text-dark-ink-secondary hover:text-dark-ink block py-1.5 text-[0.9375rem] transition-colors duration-200'

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-eyebrow text-dark-ink-secondary mb-4 uppercase">{title}</h2>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-dark text-dark-ink">
      <Container className="py-section-sm">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <ByteWeaveLogo tone="dark" className="h-14 w-auto" />
            <p className="text-dark-ink-secondary mt-6 max-w-[34ch] text-[0.9375rem] leading-relaxed">
              An AI engineering studio in Bangalore. We build systems that see, understand and
              act on the information your business already produces.
            </p>
          </div>

          <Column title="Studio">
            {[...nav, { label: 'Start a project', href: CONTACT }].map((item) => (
              <li key={item.label}>
                <Link to={item.href} className={LINK}>
                  {item.label}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Capabilities">
            {capabilityLinks.map((item) => (
              <li key={item.label}>
                <Link to={item.href} className={LINK}>
                  {item.label}
                </Link>
              </li>
            ))}
          </Column>

          <div className="space-y-10">
            <Column title="Products">
              {products.map((product) => (
                <li key={product.id}>
                  <a href={product.url} target="_blank" rel="noreferrer" className={LINK}>
                    {product.name}
                  </a>
                </li>
              ))}
            </Column>
            <Column title="Contact">
              <li>
                <a href={site.social.linkedin} target="_blank" rel="noreferrer" className={LINK}>
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={site.social.instagram} target="_blank" rel="noreferrer" className={LINK}>
                  Instagram
                </a>
              </li>
            </Column>
          </div>
        </div>

        <div className="border-dark-line mt-16 border-t pt-10">
          <a
            href={`mailto:${site.email}`}
            className="text-h3 hover:text-accent-on-dark inline-block font-medium transition-colors duration-200"
          >
            {site.email}
          </a>
          <p className="text-dark-ink-secondary mt-3 text-[0.9375rem]">
            {site.address.line} <span aria-hidden className="px-1.5">·</span>{' '}
            {site.address.reach}
          </p>
        </div>

        <div className="border-dark-line text-dark-ink-secondary mt-10 flex flex-col gap-4 border-t pt-8 text-caption sm:flex-row sm:items-center sm:justify-between">
          <p>© {site.founded} ByteWeave Studio. All rights reserved.</p>
          <ul className="flex gap-6 [&_a]:py-1.5">
            <li>
              <a href="/privacy-policy" className={LINK}>
                Privacy
              </a>
            </li>
            <li>
              <a href="/terms-and-conditions" className={LINK}>
                Terms
              </a>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  )
}
