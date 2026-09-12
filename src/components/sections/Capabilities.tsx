import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'
import { capabilities } from '@/content/capabilities'
import { CapabilityVisual } from './CapabilityVisual'

/**
 * Editorial rows, not service cards — the difference between a studio and a
 * template. Hairline-divided, full width, with the diagram earning its place
 * by explaining the stage rather than decorating it.
 */
export function Capabilities() {
  return (
    <Section id="capabilities" tone="cool" space="lg" labelledBy="capabilities-heading" card>
      <Container>
        <Eyebrow>Capabilities</Eyebrow>
        <h2 id="capabilities-heading" className="text-h2 mt-6 max-w-[18ch] font-medium">
          See, understand, think, act.
        </h2>
        <p className="text-body-l text-ink-secondary mt-6 max-w-[54ch]">
          Four stages of one pipeline. Most projects need more than one of them, which is why we
          build all four rather than handing you off.
        </p>
      </Container>

      <Container className="mt-20">
        <ul className="border-line-strong border-t">
          {capabilities.map((cap, i) => (
            <li key={cap.id} className="border-line border-b">
              <Reveal delay={i * 60}>
                <div className="group hover:bg-raised -mx-6 grid gap-8 px-6 py-12 transition-colors duration-300 ease-[var(--ease-out)] lg:grid-cols-12 lg:items-center lg:gap-10">
                  <div className="lg:col-span-1">
                    <span className="text-ink-secondary group-hover:text-accent text-h3 font-medium tabular-nums transition-colors duration-300">
                      0{i + 1}
                    </span>
                  </div>

                  <div className="lg:col-span-4">
                    <h3 className="text-h2 font-medium">{cap.verb}</h3>
                    <p className="text-ink-secondary mt-2 text-[0.9375rem]">{cap.discipline}</p>
                  </div>

                  <div className="lg:col-span-4">
                    <p className="text-ink-secondary max-w-[46ch]">{cap.description}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {cap.stack.map((tech) => (
                        <li
                          key={tech}
                          className="border-line-strong text-ink-secondary rounded-full border px-3 py-1 text-caption"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="lg:col-span-3">
                    <div className="border-line bg-raised rounded-card ml-auto aspect-[16/10] w-full max-w-[16.25rem] border p-1">
                      <CapabilityVisual id={cap.id} />
                    </div>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
