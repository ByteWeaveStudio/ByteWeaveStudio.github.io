import type { CSSProperties } from 'react'
import { Container } from '@/components/primitives/Container'
import { Metric } from '@/components/primitives/Metric'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'
import { clients } from '@/content/clients'
import { metrics } from '@/content/metrics'

/**
 * Proof before persuasion. Six real clients shown once, stated plainly —
 * the old site duplicated them into a scrolling marquee, which reads as
 * padding rather than evidence.
 */
export function Proof() {
  return (
    <Section tone="sunk" space="sm" labelledBy="proof-heading" card>
      <Container>
        <h2 id="proof-heading" className="text-eyebrow text-ink-secondary text-center uppercase">
          Trusted by teams building in production
        </h2>

        <Reveal delay={60}>
          <ul
            className="mt-12 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6"
            style={{ '--logo-h': '2.25rem' } as CSSProperties}
          >
            {clients.map((client) => (
              <li key={client.name} className="flex justify-center">
                <img
                  src={client.logo}
                  alt={client.name}
                  width={client.w}
                  height={client.h}
                  loading="lazy"
                  decoding="async"
                  // A fit box, not a fixed height: the cell width and the
                  // scaled height bound it, and object-contain fits the mark
                  // inside without ever distorting a wide wordmark.
                  className="w-full object-contain"
                  style={{ height: `calc(var(--logo-h) * ${client.scale})` }}
                />
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="border-line-strong mt-20 grid grid-cols-2 gap-y-12 border-t pt-12 lg:grid-cols-4 lg:gap-y-0">
          {metrics.map((metric, i) => (
            <Reveal
              key={metric.label}
              delay={i * 60}
              className={`text-center ${i > 0 ? 'lg:border-line lg:border-l' : ''}`}
            >
              <Metric
                value={metric.value}
                decimals={metric.decimals}
                suffix={metric.suffix}
                label={metric.label}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
