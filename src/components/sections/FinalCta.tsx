import { ButtonLink, ButtonNavLink } from '@/components/primitives/Button'
import { Container } from '@/components/primitives/Container'
import { CONTACT } from '@/content/site'

/**
 * Second dark band, deliberately near-empty. The Weave's threads reappear
 * faintly at the edges, bookending the hero.
 *
 * Stays out of the homepage's stacked-card rhythm on purpose: the closing ask
 * should land flat and full-bleed rather than arriving as one more card in the
 * deck. `card` exists for anywhere that does want it in the stack.
 */
export function FinalCta({ card = false }: { card?: boolean } = {}) {
  return (
    <section
      aria-labelledby="cta-heading"
      className={`bg-dark text-dark-ink relative flex min-h-[85vh] items-center overflow-hidden ${card ? 'stack-card' : ''}`}
    >
      {/* Echo of the hero threads. Purely decorative, very low contrast. */}
      <svg
        aria-hidden
        className="text-dark-line pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 1440 800"
      >
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M-100 ${180 + i * 150} C 300 ${120 + i * 150}, 900 ${260 + i * 150}, 1540 ${170 + i * 150}`}
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        ))}
      </svg>

      <Container className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <h2 id="cta-heading" className="text-display-l font-medium sm:text-display-xl">
            Have a problem
            <br />
            worth solving?
          </h2>
          <p className="text-body-l text-dark-ink-secondary mx-auto mt-8 max-w-[46ch]">
            Tell us what you're building. We'll help you figure out what's possible — and say so
            if we're not the right people for it.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <ButtonNavLink to={CONTACT} variant="inverse">
              Start a conversation
            </ButtonNavLink>
            {/* #work only ever existed on the homepage, so this button did
                nothing on the four other pages that render this section. */}
            <ButtonLink href="/case-studies" variant="outlineDark">
              See the work
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  )
}
