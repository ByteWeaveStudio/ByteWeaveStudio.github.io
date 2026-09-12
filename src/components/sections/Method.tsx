import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Section } from '@/components/primitives/Section'
import { method } from '@/content/method'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useScrollProgress } from '@/hooks/useScrollProgress'

/**
 * The rule draws as the section travels through the viewport and each node
 * lights as the line reaches it. Under reduced motion the rule is simply
 * complete — the diagram still reads, it just doesn't perform.
 */
export function Method() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()
  const reduced = useReducedMotion()

  // Remap: the line should complete around 70% of the travel, not at the very end.
  const p = reduced ? 1 : Math.min(1, Math.max(0, (progress - 0.15) / 0.55))

  return (
    <Section id="process" space="lg" labelledBy="method-heading" card>
      <Container>
        <Eyebrow>The ByteWeave method</Eyebrow>
        <h2 id="method-heading" className="text-h2 mt-6 max-w-[22ch] font-medium">
          How a project actually runs.
        </h2>
      </Container>

      <Container className="mt-20">
        <div ref={ref}>
          {/* Desktop: horizontal rule + nodes */}
          <div className="relative hidden lg:block">
            <div className="bg-line absolute top-[0.4375rem] right-0 left-0 h-px" aria-hidden />
            <div
              className="absolute top-[0.4375rem] left-0 h-px origin-left bg-linear-to-r from-grad-from via-grad-via to-grad-to"
              style={{ width: `${p * 100}%`, transition: 'width 120ms linear' }}
              aria-hidden
            />
            <ol className="grid grid-cols-5 gap-8">
              {method.map((step, i) => {
                const lit = p >= (i + 0.35) / method.length
                return (
                  <li key={step.n}>
                    <span
                      aria-hidden
                      className={`block size-[0.9375rem] rounded-full border-2 transition-colors duration-300 ${
                        lit ? 'border-accent bg-accent' : 'border-line-strong bg-bg'
                      }`}
                    />
                    <p className="text-ink-secondary mt-8 text-caption tabular-nums">{step.n}</p>
                    <h3 className="text-h3 mt-2 font-medium">{step.title}</h3>
                    <p className="text-ink-secondary mt-3 text-[0.9375rem]">{step.body}</p>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* Mobile: same rule, vertical */}
          <ol className="relative lg:hidden">
            <div className="bg-line absolute top-2 bottom-2 left-[0.4375rem] w-px" aria-hidden />
            <div
              className="absolute top-2 left-[0.4375rem] w-px bg-linear-to-b from-grad-from via-grad-via to-grad-to"
              style={{ height: `calc(${p * 100}% - 1rem)`, transition: 'height 120ms linear' }}
              aria-hidden
            />
            {method.map((step, i) => {
              const lit = p >= (i + 0.35) / method.length
              return (
                <li key={step.n} className="relative pb-12 pl-10 last:pb-0">
                  <span
                    aria-hidden
                    className={`absolute top-1.5 left-0 block size-[0.9375rem] rounded-full border-2 transition-colors duration-300 ${
                      lit ? 'border-accent bg-accent' : 'border-line-strong bg-bg'
                    }`}
                  />
                  <p className="text-ink-secondary text-caption tabular-nums">{step.n}</p>
                  <h3 className="text-h3 mt-1 font-medium">{step.title}</h3>
                  <p className="text-ink-secondary mt-2 text-[0.9375rem]">{step.body}</p>
                </li>
              )
            })}
          </ol>
        </div>
      </Container>
    </Section>
  )
}
