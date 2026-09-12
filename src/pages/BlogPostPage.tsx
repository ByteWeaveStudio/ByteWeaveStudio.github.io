import { Link, useParams } from 'react-router'
import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Section } from '@/components/primitives/Section'
import { FinalCta } from '@/components/sections/FinalCta'
import { Cover } from '@/components/sections/PostCover'
import { findPost, posts } from '@/content/posts'
import { NotFoundPage } from './NotFoundPage'

const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

export function BlogPostPage() {
  const { slug } = useParams()
  const post = slug ? findPost(slug) : undefined
  if (!post) return <NotFoundPage />

  // Same category first, then whatever is most recent, so there is always
  // somewhere to go next.
  const more = [
    ...posts.filter((p) => p.slug !== post.slug && p.category === post.category),
    ...posts.filter((p) => p.slug !== post.slug && p.category !== post.category),
  ].slice(0, 3)

  return (
    <article>
      <section className="relative overflow-hidden pt-36 md:pt-44">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-56 -z-10 h-[560px]">
          <div className="absolute -top-16 -left-40 h-[420px] w-[640px] rounded-full bg-[#CDEFFB] opacity-45 blur-[130px]" />
          <div className="absolute -top-8 right-[-12%] h-[440px] w-[620px] rounded-full bg-[#FDEECB] opacity-45 blur-[130px]" />
        </div>

        <Container>
          <nav aria-label="Breadcrumb">
            <ol className="text-ink-secondary flex flex-wrap items-center gap-2 text-[0.9375rem]">
              <li>
                <Link to="/" className="hover:text-ink inline-block py-0.5 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-ink-secondary">
                /
              </li>
              <li>
                <Link to="/blog" className="hover:text-ink inline-block py-0.5 transition-colors">
                  Blogs
                </Link>
              </li>
              <li aria-hidden className="text-ink-secondary">
                /
              </li>
              <li aria-current="page" className="text-ink">
                {post.category}
              </li>
            </ol>
          </nav>

          <Eyebrow className="mt-10">{post.category}</Eyebrow>
          <h1 className="text-display-l mt-5 max-w-[22ch] font-medium">{post.title}</h1>
          <p className="text-body-l text-ink-secondary mt-7 max-w-[58ch]">{post.excerpt}</p>
          <p className="text-ink-secondary border-line-strong mt-10 border-t pt-6 text-caption">
            <time dateTime={post.date}>{longDate(post.date)}</time>
            <span aria-hidden> · </span>
            {post.readingMinutes} min read
            <span aria-hidden> · </span>
            ByteWeave Studio
          </p>
        </Container>
      </section>

      <Section space="sm">
        <Container>
          <div className="bg-sunk border-line rounded-panel aspect-[8/5] w-full overflow-hidden border p-4 sm:aspect-[16/7] sm:p-8">
            <Cover post={post} fit="meet" />
          </div>
        </Container>
      </Section>

      <Section space="sm">
        <Container>
          <div className="max-w-[68ch]">
            {post.intro.map((para) => (
              <p key={para.slice(0, 24)} className="text-body-l mt-6 first:mt-0">
                {para}
              </p>
            ))}

            {post.sections.map((s) => (
              <section key={s.heading} className="mt-14">
                <h2 className="text-h3 max-w-[36ch] font-medium">{s.heading}</h2>
                {s.body.map((para) => (
                  <p key={para.slice(0, 24)} className="text-ink-secondary mt-5">
                    {para}
                  </p>
                ))}
              </section>
            ))}

            <aside
              aria-labelledby="takeaways"
              className="border-line bg-raised rounded-panel mt-16 border p-8 sm:p-10"
            >
              <h2 id="takeaways" className="text-eyebrow text-ink-secondary uppercase">
                In short
              </h2>
              <ul className="mt-6 space-y-4">
                {post.takeaways.map((t) => (
                  <li key={t.slice(0, 24)} className="flex gap-4">
                    <span aria-hidden className="bg-accent mt-2.5 size-1.5 shrink-0 rounded-full" />
                    <span className="text-ink-secondary">{t}</span>
                  </li>
                ))}
              </ul>
            </aside>

            <ul className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="border-line-strong text-ink-secondary rounded-full border px-3 py-1 text-caption"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section tone="sunk" space="md" labelledBy="more-reading">
        <Container>
          <h2 id="more-reading" className="text-h3 font-medium">
            More reading
          </h2>
          <ul className="card-grid mt-10 grid gap-6 md:grid-cols-3">
            {more.map((p) => (
              <li key={p.slug}>
                <Link
                  to={`/blog/${p.slug}`}
                  className="group border-line hover:border-line-strong bg-raised rounded-panel flex h-full flex-col overflow-hidden border transition-[border-color,transform] duration-300 hover:-translate-y-1"
                >
                  <div className="bg-sunk border-line aspect-[8/5] w-full border-b">
                    <Cover post={p} />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                  <p className="text-eyebrow text-ink-secondary uppercase">{p.category}</p>
                  <h3 className="text-h3 group-hover:text-accent mt-3 font-medium transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-ink-secondary mt-3 flex-1 text-[0.9375rem]">{p.excerpt}</p>
                  <p className="text-ink-secondary mt-5 text-caption">
                    {p.readingMinutes} min read
                  </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <FinalCta />
    </article>
  )
}
