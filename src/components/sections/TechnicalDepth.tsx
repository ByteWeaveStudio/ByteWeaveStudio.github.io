import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Section } from '@/components/primitives/Section'
import { techLayers } from '@/content/techStack'

/**
 * The first dark band — a tonal shift signalling that this part is for the
 * engineer in the room.
 *
 * The stack is drawn so the headline's claim is visible before it is read:
 * six numbered strata, exactly one of them accented and labelled "the model".
 * The previous version was six rows of label, note and technologies — true,
 * but you had to read all of it to get the point.
 *
 * Technologies are set as text, not logos: the brief rules out a logo wall,
 * and naming a tool in your own typeface reads more confident than borrowing
 * someone else's brand mark.
 */
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']

export function TechnicalDepth() {
  const others = techLayers.length - 1

  return (
    <Section tone="dark" space="lg" labelledBy="depth-heading" card>
      <Container>
        <Eyebrow tone="dark">Technical depth</Eyebrow>
        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          <h2 id="depth-heading" className="text-h2 max-w-[20ch] font-medium lg:col-span-6">
            The model is one layer of six.
          </h2>
          <p className="text-dark-ink-secondary max-w-[52ch] lg:col-span-5 lg:col-start-8 lg:pt-2">
            Most AI projects fail below the waterline — in the integration, the error handling,
            the thing that has to run unattended on a Sunday. This is the stack we build and
            operate.
          </p>
        </div>

        <div className="mt-16 lg:mt-20">
          <ol className="border-dark-line grid border-y">
            {techLayers.map((layer, i) => (
              <li
                key={layer.id}
                className={[
                  'group border-dark-line relative grid gap-x-6 gap-y-3 border-b py-5 pl-4 last:border-b-0 md:pl-0',
                  'transition-colors duration-300 md:grid-cols-12 md:items-center',
                  layer.isModel ? 'bg-accent-on-dark/8' : 'hover:bg-dark-raised/70',
                ].join(' ')}
              >
                {/* The accented edge is what makes one band read as different. */}
                {layer.isModel ? (
                  <span aria-hidden className="bg-accent-on-dark absolute inset-y-0 left-0 w-[3px]" />
                ) : null}

                <span
                  className={[
                    'text-caption tabular-nums md:col-span-1 md:pl-5',
                    layer.isModel ? 'text-accent-on-dark' : 'text-dark-ink-secondary',
                  ].join(' ')}
                >
                  0{i + 1}
                </span>

                <div className="md:col-span-5">
                  <h3
                    className={[
                      'flex flex-wrap items-center gap-x-3 gap-y-2 font-medium',
                      layer.isModel ? 'text-accent-on-dark' : '',
                    ].join(' ')}
                  >
                    {layer.label}
                    {layer.isModel ? (
                      <span className="border-accent-on-dark/40 text-accent-on-dark rounded-full border px-2.5 py-0.5 text-caption font-normal">
                        the model
                      </span>
                    ) : null}
                  </h3>
                  <p className="text-dark-ink-secondary mt-1.5 text-caption">{layer.note}</p>
                </div>

                <ul className="text-dark-ink-secondary flex flex-wrap gap-x-4 gap-y-1.5 text-[0.9375rem] md:col-span-6 md:justify-end md:pr-5">
                  {layer.tech.map((t) => (
                    <li
                      key={t}
                      className="group-hover:text-dark-ink transition-colors duration-300"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        {/* The count, stated once, after the picture has already made it. */}
        <p className="text-body-l text-dark-ink-secondary mt-10 max-w-[62ch]">
          <span className="text-dark-ink font-medium">
            {WORDS[others][0].toUpperCase() + WORDS[others].slice(1)} of the{' '}
            {WORDS[techLayers.length]} have nothing to do with machine learning.
          </span>{' '}
          They are the integration, the error handling and the operations — and they are where AI
          projects actually fail.
        </p>
      </Container>
    </Section>
  )
}
