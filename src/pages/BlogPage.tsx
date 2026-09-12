import { useState } from 'react'
import { Link } from 'react-router'
import { PageHeader } from '@/components/layout/PageHeader'
import { Container } from '@/components/primitives/Container'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'
import { ArrowRight } from '@/components/primitives/Icon'
import { Cover } from '@/components/sections/PostCover'
import { FinalCta } from '@/components/sections/FinalCta'
import { CATEGORIES, postsByDate } from '@/content/posts'

const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

const ALL = 'All'

export function BlogPage() {
  // Defaults to All, so the server-rendered HTML contains every post and a
  // crawler never depends on the filter running.
  const [active, setActive] = useState<string>(ALL)
  const shown = active === ALL ? postsByDate : postsByDate.filter((p) => p.category === active)

  const tabs = [ALL, ...CATEGORIES.filter((c) => postsByDate.some((p) => p.category === c))]

  return (
    <>
      <PageHeader
        eyebrow="Blogs"
        title={
          <>
            Notes from{' '}
            <em className="font-serif font-normal italic">production.</em>
          </>
        }
        lead="Writing about the parts of AI engineering that are harder than the demo: accuracy you can defend, integration with systems that already exist, and what it takes to keep a model useful six months after launch."
      />

      <Section space="md">
        <Container>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {tabs.map((c) => {
              const on = c === active
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(c)}
                  className={`rounded-full border px-4 py-1.5 text-caption transition-colors duration-200 ${
                    on
                      ? 'border-ink bg-ink text-white'
                      : 'border-line-strong text-ink-secondary hover:border-ink hover:text-ink'
                  }`}
                >
                  {c}
                </button>
              )
            })}
          </div>

          <ul className="card-grid mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((post, i) => (
              <li key={post.slug}>
                <Reveal delay={Math.min(i, 5) * 50}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group border-line hover:border-line-strong bg-raised rounded-panel hover:shadow-lift flex h-full flex-col overflow-hidden border transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out)] hover:-translate-y-1"
                  >
                    <div className="bg-sunk border-line aspect-[8/5] w-full border-b">
                      <Cover post={post} />
                    </div>

                    <div className="flex flex-1 flex-col p-7">
                      <p className="text-eyebrow text-ink-secondary uppercase">{post.category}</p>
                      <h2 className="text-h3 group-hover:text-accent mt-3 font-medium transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-ink-secondary mt-3 flex-1 text-[0.9375rem]">
                        {post.excerpt}
                      </p>

                      <div className="border-line mt-6 flex items-center justify-between border-t pt-5">
                        <p className="text-ink-secondary text-caption">
                          <time dateTime={post.date}>{shortDate(post.date)}</time>
                          <span aria-hidden> · </span>
                          {post.readingMinutes} min
                        </p>
                        <span className="text-ink group-hover:text-accent inline-flex items-center gap-2 text-[0.9375rem] font-medium transition-colors">
                          Read
                          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <FinalCta />
    </>
  )
}
