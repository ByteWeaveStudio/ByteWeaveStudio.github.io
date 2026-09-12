import { Link } from 'react-router'
import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { nav } from '@/content/site'

export function NotFoundPage() {
  return (
    <section className="flex min-h-[70vh] items-center pt-32">
      <Container>
        <Eyebrow>404</Eyebrow>
        <h1 className="text-display-l mt-6 max-w-[18ch] font-medium">
          That page isn&rsquo;t here.
        </h1>
        <p className="text-body-l text-ink-secondary mt-6 max-w-[48ch]">
          The link may be out of date, or the page may have moved. Everything on the site is one
          of these:
        </p>
        <ul className="border-line-strong mt-10 border-t">
          {nav.map((item) => (
            <li key={item.href} className="border-line border-b">
              <Link
                to={item.href}
                className="text-h3 hover:text-accent block py-4 font-medium transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
