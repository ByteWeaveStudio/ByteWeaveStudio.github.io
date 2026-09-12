import { useRef, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Section } from '@/components/primitives/Section'
import { ArrowRight } from '@/components/primitives/Icon'
import { interests, whatHelps } from '@/content/contact'
import { MAILTO, site } from '@/content/site'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const FIELD =
  'border-line-strong bg-raised text-ink placeholder:text-ink-secondary/60 w-full rounded-input border px-4 py-3 text-[0.9375rem] transition-colors duration-200 focus:border-accent focus:outline-none'
const LABEL = 'text-caption text-ink-secondary block'

/**
 * Start a project.
 *
 * Posts to the same Formspree endpoint the old site used, so nothing needs
 * reconfiguring. The form has a real `action` and `method`, so it still
 * submits without JavaScript; the handler below only upgrades the experience
 * when JS is available.
 *
 * The one genuinely useful idea here: choosing what the project is about
 * retunes the prompt above the message box to the question we would ask first.
 * It gets us a better opening message and shows we think about the problem
 * rather than reciting a service list.
 *
 * No budget field — see content/contact.ts.
 */
export function ContactPage() {
  const [interest, setInterest] = useState(interests[0])
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const successRef = useRef<HTMLDivElement>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setStatus('sending')
    setError(null)

    // The old site's handler had a 15s ceiling; a form that hangs silently is
    // worse than one that fails.
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch(site.formspree, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      })
      if (response.ok) {
        setStatus('sent')
        window.setTimeout(() => successRef.current?.focus(), 40)
        return
      }
      const data = (await response.json().catch(() => null)) as
        | { errors?: { message: string }[] }
        | null
      setError(
        data?.errors?.map((e) => e.message).join(' ') ??
          'That did not send. Please try again, or email us directly.',
      )
      setStatus('error')
    } catch {
      setError(
        controller.signal.aborted
          ? 'That took too long to send. Your connection may be blocking it — email works too.'
          : 'We could not reach the form. Email us directly and it will get to the same place.',
      )
      setStatus('error')
    } finally {
      window.clearTimeout(timer)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Start a project"
        title={
          <>
            Tell us what you&rsquo;re building.{' '}
            <em className="font-serif font-normal italic">We&rsquo;ll tell you straight.</em>
          </>
        }
        lead="One form, no qualification call, no budget bracket to pick from. It reaches the engineers directly."
      />

      <Section space="md">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              {status === 'sent' ? (
                <div
                  ref={successRef}
                  tabIndex={-1}
                  className="border-line bg-raised rounded-panel border p-8 sm:p-10"
                >
                  <span aria-hidden className="bg-accent block size-2 rounded-full" />
                  <h2 className="text-h3 mt-6 font-medium">That&rsquo;s with us.</h2>
                  <p className="text-body-l text-ink-secondary mt-4 max-w-[46ch]">
                    It goes straight to the people who would build it — you will get a reply from
                    an engineer, not a sales team.
                  </p>
                  <p className="text-ink-secondary mt-6 text-[0.9375rem]">
                    If it is urgent, or you would rather just talk,{' '}
                    <a href={MAILTO} className="text-accent underline underline-offset-4">
                      {site.email}
                    </a>{' '}
                    reaches the same place.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  action={site.formspree}
                  method="POST"
                  className="space-y-8"
                  noValidate={false}
                >
                  {/* Formspree conventions: a spam trap and a readable subject. */}
                  <input
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="pointer-events-none absolute size-0 opacity-0"
                  />
                  <input type="hidden" name="_subject" value="New project enquiry — byteweave.studio" />
                  <input type="hidden" name="interest" value={interest.label} />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="fullname" className={LABEL}>
                        Your name
                      </label>
                      <input
                        id="fullname"
                        name="fullname"
                        type="text"
                        required
                        autoComplete="name"
                        className={`${FIELD} mt-2`}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={LABEL}>
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className={`${FIELD} mt-2`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className={LABEL}>
                      Company <span className="text-ink-secondary/70">(optional)</span>
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      className={`${FIELD} mt-2`}
                    />
                  </div>

                  <fieldset>
                    <legend className={LABEL}>What is it about?</legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {interests.map((option) => {
                        const on = option.id === interest.id
                        return (
                          <button
                            key={option.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setInterest(option)}
                            className={[
                              'rounded-full border px-4 py-2 text-[0.9375rem] transition-colors duration-200',
                              on
                                ? 'border-accent bg-accent-wash text-accent font-medium'
                                : 'border-line-strong text-ink-secondary hover:border-ink hover:text-ink',
                            ].join(' ')}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="message" className={LABEL}>
                      The problem
                    </label>
                    {/* Retunes with the selection above — this is the question
                        we would ask first for that kind of work. */}
                    <p
                      aria-live="polite"
                      className="text-ink mt-2 max-w-[56ch] text-[0.9375rem]"
                    >
                      {interest.prompt}
                    </p>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={7}
                      placeholder="A paragraph is plenty."
                      className={`${FIELD} mt-3 resize-y`}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-5">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="group bg-ink hover:bg-accent inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-[0.9375rem] font-medium text-white transition-colors duration-200 disabled:opacity-60"
                    >
                      {status === 'sending' ? 'Sending…' : 'Send it'}
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                    <p className="text-ink-secondary text-caption max-w-[32ch]">
                      We only use your details to reply. See our{' '}
                      <a href="/privacy-policy" className="underline underline-offset-2">
                        privacy policy
                      </a>
                      .
                    </p>
                  </div>

                  <p aria-live="polite" className="min-h-[1.25rem]">
                    {status === 'error' && error ? (
                      <span className="text-accent text-[0.9375rem]">
                        {error}{' '}
                        <a href={MAILTO} className="underline underline-offset-4">
                          {site.email}
                        </a>
                      </span>
                    ) : null}
                  </p>
                </form>
              )}
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <Eyebrow>What helps</Eyebrow>
              <p className="text-ink-secondary mt-4 text-[0.9375rem]">
                Three things turn a vague enquiry into a useful reply.
              </p>
              <dl className="border-line-strong mt-7 border-t">
                {whatHelps.map((item) => (
                  <div key={item.title} className="border-line border-b py-5">
                    <dt className="font-medium">{item.title}</dt>
                    <dd className="text-ink-secondary mt-1.5 text-[0.9375rem]">{item.body}</dd>
                  </div>
                ))}
              </dl>

              <div className="border-line-strong mt-10 border-t pt-7">
                <h2 className="text-eyebrow text-ink-secondary uppercase">Rather not use a form?</h2>
                <a
                  href={MAILTO}
                  className="text-h3 hover:text-accent mt-3 inline-block font-medium transition-colors"
                >
                  {site.email}
                </a>
                <ul className="mt-5 space-y-2">
                  <li>
                    <a
                      href={site.social.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-ink-secondary hover:text-ink group inline-flex items-center gap-2 text-[0.9375rem] transition-colors"
                    >
                      LinkedIn
                      <ArrowRight className="size-3.5 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </a>
                  </li>
                </ul>
                <p className="text-ink-secondary mt-6 text-caption">
                  {site.address.line}
                  <br />
                  {site.address.reach}
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  )
}
