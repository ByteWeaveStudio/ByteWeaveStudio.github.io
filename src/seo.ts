import { site } from '@/content/site'
import { capabilities } from '@/content/capabilities'
import { caseStudies, type CaseStudy } from '@/content/caseStudies'
import { legalDocs, type LegalDoc } from '@/content/legal'
import { postsByDate, type Post } from '@/content/posts'
import { products } from '@/content/products'

export type PageMeta = {
  title: string
  description: string
  path: string
  /** schema.org graph, injected into <head> at prerender. */
  jsonLd?: unknown
  /** Drives sitemap lastmod where the page has a real edit date. */
  lastmod?: string
  /** First-published date, for article:published_time. */
  datePublished?: string
  /** Case studies are articles; everything else is a website page. */
  ogType?: 'website' | 'article'
  /** 404 and other non-canonical shells opt out of the index. */
  noindex?: boolean
}

/**
 * Google truncates a title around 60 characters. A long, specific headline
 * beats a brand suffix that pushes it past the cut, so the suffix is only
 * appended when the whole thing still fits.
 */
const BRAND = ` | ${site.name}`
const t = (s: string) => (s.length + BRAND.length <= 60 ? s + BRAND : s)

/**
 * sitemap <lastmod>. Index pages inherit the newest thing they list, so the
 * date is a real signal; static pages carry a hand-set date rather than the
 * build timestamp, which would claim every page changed on every deploy.
 */
const newest = (dates: string[]) => dates.slice().sort().at(-1) as string
const LATEST_POST = newest(postsByDate.map((p) => p.date))
const LATEST_STUDY = newest(caseStudies.map((c) => c.dateModified))

export const META: Record<string, PageMeta> = {
  '/': {
    title: `${site.name} | Software that Thinks`,
    description:
      'ByteWeave Studio builds production software with computer vision, document intelligence and LLMs — AI systems engineered for the real world, not just for demos.',
    path: '/',
    lastmod: site.updated,
  },
  '/case-studies': {
    title: t('Case Studies'),
    description:
      'Long-form write-ups of three systems ByteWeave has taken to production: the problem, the architecture, the trade-offs and the outcome.',
    path: '/case-studies',
    lastmod: LATEST_STUDY,
  },
  '/products': {
    title: t('Products'),
    description:
      'Products built and run by ByteWeave: SplitPocket, expense tracking and group splitting, and BatMan, a year-scoped tracker for goals, habits and money.',
    path: '/products',
    lastmod: site.updated,
  },
  '/blog': {
    title: t('Blogs'),
    description:
      'Practical writing on document AI, computer vision, RAG and LLM evaluation, MCP, and shipping machine learning into systems that already exist.',
    path: '/blog',
    lastmod: LATEST_POST,
  },
  '/contact': {
    title: t('Start a project'),
    description:
      'Tell us what you are building. One form, no qualification call and no budget bracket to pick from — it reaches the engineers directly.',
    path: '/contact',
    lastmod: site.updated,
  },
  '/about': {
    title: t('About'),
    description:
      'A small AI engineering studio in Bangalore, working with teams worldwide. The people who scope your project build it — and the work we will not take on.',
    path: '/about',
    lastmod: site.updated,
  },
}

/* ── schema.org ──────────────────────────────────────────────────
   Emitted as a @graph so a crawler reads one block per page. The
   Organization node lives in index.html and is referenced by @id
   rather than repeated here. */

const ORG_ID = `${site.url}/#organization`

/**
 * One WebSite node, emitted on every page. Article and collection graphs
 * point at it with `isPartOf`, so it has to exist wherever they do — a
 * reference to an @id that is never defined is silently dropped.
 */
const websiteNode = () => ({
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  url: `${site.url}/`,
  name: site.name,
  description: site.description,
  inLanguage: 'en',
  publisher: { '@id': ORG_ID },
})

/**
 * The four capabilities as a real service catalogue. These are the same
 * disciplines the homepage renders, read from one array, so the markup
 * cannot describe services the page does not.
 */
const serviceNodes = () => [
  {
    '@type': 'ProfessionalService',
    '@id': `${site.url}/#service`,
    name: site.name,
    url: `${site.url}/`,
    description: `${site.description} ${site.supporting}`,
    parentOrganization: { '@id': ORG_ID },
    areaServed: 'Worldwide',
    serviceType: capabilities.map((c) => c.discipline),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'AI engineering services',
      itemListElement: capabilities.map((c) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          '@id': `${site.url}/#service-${c.id}`,
          name: c.discipline,
          description: c.description,
          serviceType: c.discipline,
          provider: { '@id': ORG_ID },
        },
      })),
    },
  },
]
const crumb = (name: string, path: string, position: number) => ({
  '@type': 'ListItem',
  position,
  name,
  item: `${site.url}${path}`,
})

function caseStudyGraph(study: CaseStudy) {
  const url = `${site.url}/case-studies/${study.slug}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${url}#article`,
        url,
        headline: study.name,
        description: study.summary,
        abstract: study.problem,
        datePublished: study.datePublished,
        dateModified: study.dateModified,
        inLanguage: 'en',
        isAccessibleForFree: true,
        author: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        isPartOf: { '@id': `${site.url}/#website` },
        image: `${site.url}/og/og-default.png`,
        about: { '@type': 'Thing', name: study.sector },
        keywords: study.stack.join(', '),
        articleSection: study.sections.map((sec) => sec.heading),
        // Lets an extractor find the prose without parsing the DOM.
        articleBody: [
          study.problem,
          study.approach,
          ...study.sections.flatMap((sec) => [sec.heading, ...sec.body]),
        ].join('\n\n'),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          crumb('Home', '/', 1),
          crumb('Case studies', '/case-studies', 2),
          crumb(study.name, `/case-studies/${study.slug}`, 3),
        ],
      },
      websiteNode(),
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: study.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}

const caseStudyIndexGraph = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${site.url}/case-studies#page`,
      url: `${site.url}/case-studies`,
      name: `Case Studies | ${site.name}`,
      description: META['/case-studies'].description,
      isPartOf: { '@id': `${site.url}/#website` },
      publisher: { '@id': ORG_ID },
    },
    {
      '@type': 'ItemList',
      '@id': `${site.url}/case-studies#list`,
      numberOfItems: caseStudies.length,
      itemListOrder: 'https://schema.org/ItemListUnordered',
      itemListElement: caseStudies.map((study, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: study.name,
        description: study.summary,
        url: `${site.url}/case-studies/${study.slug}`,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${site.url}/case-studies#breadcrumb`,
      itemListElement: [crumb('Home', '/', 1), crumb('Case studies', '/case-studies', 2)],
    },
    websiteNode(),
  ],
})

function postGraph(post: Post) {
  const url = `${site.url}/blog/${post.slug}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#post`,
        url,
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: 'en',
        isAccessibleForFree: true,
        author: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        isPartOf: { '@id': `${site.url}/#website` },
        image: `${site.url}/og/og-default.png`,
        articleSection: post.category,
        keywords: post.tags.join(', '),
        wordCount: [...post.intro, ...post.sections.flatMap((x) => x.body)]
          .join(' ')
          .split(/\s+/).length,
        timeRequired: `PT${post.readingMinutes}M`,
        // Full prose inline, so an extractor never has to parse the DOM.
        articleBody: [
          ...post.intro,
          ...post.sections.flatMap((sec) => [sec.heading, ...sec.body]),
          ...post.takeaways,
        ].join('\n\n'),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          crumb('Home', '/', 1),
          crumb('Blogs', '/blog', 2),
          crumb(post.title, `/blog/${post.slug}`, 3),
        ],
      },
      websiteNode(),
    ],
  }
}

const productsGraph = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${site.url}/products#page`,
      url: `${site.url}/products`,
      name: `Products | ${site.name}`,
      description: META['/products'].description,
      publisher: { '@id': ORG_ID },
    },
    ...products.map((pr) => ({
      '@type': 'SoftwareApplication',
      '@id': `${site.url}/products#${pr.id}`,
      name: pr.name,
      ...(pr.url ? { url: pr.url } : {}),
      description: pr.description,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web browser',
      featureList: pr.highlights,
      publisher: { '@id': ORG_ID },
    })),
    {
      '@type': 'BreadcrumbList',
      '@id': `${site.url}/products#breadcrumb`,
      itemListElement: [crumb('Home', '/', 1), crumb('Products', '/products', 2)],
    },
    websiteNode(),
  ],
})

const blogIndexGraph = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Blog',
      '@id': `${site.url}/blog#blog`,
      url: `${site.url}/blog`,
      name: `Blogs | ${site.name}`,
      description: META['/blog'].description,
      inLanguage: 'en',
      publisher: { '@id': ORG_ID },
      blogPost: postsByDate.map((p) => ({
        '@type': 'BlogPosting',
        '@id': `${site.url}/blog/${p.slug}#post`,
        headline: p.title,
        description: p.excerpt,
        datePublished: p.date,
        url: `${site.url}/blog/${p.slug}`,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${site.url}/blog#breadcrumb`,
      itemListElement: [crumb('Home', '/', 1), crumb('Blogs', '/blog', 2)],
    },
    websiteNode(),
  ],
})

/** Everything that is not a case study still gets a page node and a trail. */
function pageGraph(meta: PageMeta, label: string, extra: unknown[] = []) {
  const url = `${site.url}${meta.path === '/' ? '/' : meta.path}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#page`,
        url,
        name: meta.title,
        description: meta.description,
        inLanguage: 'en',
        isPartOf: { '@id': `${site.url}/#website` },
        publisher: { '@id': ORG_ID },
        ...(meta.lastmod ? { dateModified: meta.lastmod } : {}),
      },
      websiteNode(),
      ...extra,
      ...(meta.path === '/'
        ? []
        : [
            {
              '@type': 'BreadcrumbList',
              '@id': `${url}#breadcrumb`,
              itemListElement: [crumb('Home', '/', 1), crumb(label, meta.path, 2)],
            },
          ]),
    ],
  }
}

for (const [path, meta] of Object.entries(META)) {
  const label = path === '/' ? 'Home' : meta.title.split(' | ')[0]
  meta.jsonLd =
    path === '/case-studies'
      ? caseStudyIndexGraph()
      : path === '/blog'
        ? blogIndexGraph()
        : path === '/products'
          ? productsGraph()
          : pageGraph(meta, label, path === '/' ? serviceNodes() : [])
}

/**
 * A summary written for a card is often under 120 characters, which is short
 * enough that Google usually rewrites the snippet. Topping it up with the
 * study's own headline numbers keeps the description in range without
 * writing a second copy of the same claim — outcomes whose figure is
 * already in the summary are skipped.
 */
function studyDescription(study: CaseStudy) {
  let out = study.summary
  for (const o of study.outcomes) {
    if (out.length >= 120) break
    if (out.includes(o.value)) continue
    const next = `${out} ${o.value} ${o.label.charAt(0).toLowerCase()}${o.label.slice(1)}.`
    if (next.length > 160) continue
    out = next
  }
  return out
}

for (const study of caseStudies) {
  META[`/case-studies/${study.slug}`] = {
    title: t(study.name),
    description: studyDescription(study),
    path: `/case-studies/${study.slug}`,
    jsonLd: caseStudyGraph(study),
    lastmod: study.dateModified,
    datePublished: study.datePublished,
    ogType: 'article',
  }
}

for (const post of postsByDate) {
  META[`/blog/${post.slug}`] = {
    title: t(post.title),
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    jsonLd: postGraph(post),
    lastmod: post.date,
    datePublished: post.date,
    ogType: 'article',
  }
}

/**
 * Legal pages. Indexable — they are linked from every page in the footer,
 * so a noindex here would leave two sitewide links pointing at nothing a
 * crawler will keep.
 */
function legalGraph(doc: LegalDoc, meta: PageMeta) {
  const url = `${site.url}/${doc.slug}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#page`,
        url,
        name: meta.title,
        description: meta.description,
        inLanguage: 'en',
        isPartOf: { '@id': `${site.url}/#website` },
        publisher: { '@id': ORG_ID },
        ...(doc.effective ? { datePublished: doc.effective } : {}),
        ...(meta.lastmod ? { dateModified: meta.lastmod } : {}),
        mainContentOfPage: {
          '@type': 'WebPageElement',
          cssSelector: 'main',
        },
      },
      websiteNode(),
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [crumb('Home', '/', 1), crumb(doc.title, `/${doc.slug}`, 2)],
      },
    ],
  }
}

for (const doc of legalDocs) {
  const meta: PageMeta = {
    title: t(doc.title),
    description: doc.lead,
    path: `/${doc.slug}`,
    lastmod: doc.effective ?? site.updated,
    datePublished: doc.effective,
  }
  meta.jsonLd = legalGraph(doc, meta)
  META[meta.path] = meta
}

/* ── legacy URLs ─────────────────────────────────────────────────
   The static site on this domain today has seven indexed URLs, all ending
   in .html. Nothing on GitHub Pages can issue a 301, so each is handled at
   build time — otherwise every result currently ranking for this domain
   becomes a 404 on cutover. /work joins them: the router still catches it,
   but only after Pages has already answered 404.

   Two shapes, and the difference matters. Where the legacy basename
   collides with a real route (`/about.html` vs the `/about` directory),
   Pages resolves the extension-less request to `about.html` in preference
   to `about/index.html` — so a refresh stub parked there would capture
   `/about` itself and bounce it to itself forever. Those paths get a full
   copy of the real page instead, canonicalised to the clean URL: whichever
   file the server picks, the visitor gets the right page and Google
   consolidates on one address. Only the non-colliding paths get a stub.

   Neither shape appears in the sitemap; they are signposts, not
   destinations. */

export const REDIRECTS: Record<string, string> = {
  '/about.html': '/about',
  '/contact.html': '/contact',
  '/privacy-policy.html': '/privacy-policy',
  '/terms-and-conditions.html': '/terms-and-conditions',
  // The four service lines now live in the homepage capabilities section.
  '/services.html': '/#capabilities',
  // Both service pages carried a case study; send each to its closest match.
  '/computer-vision.html': '/case-studies/netra3-store-monitoring',
  '/ai.html': '/case-studies',
  // Merged into /about during this rebuild.
  '/work': '/about',
}

/** Every path the build prerenders. */
export const ALL_PATHS = Object.keys(META)

export const metaFor = (path: string): PageMeta =>
  META[path] ?? {
    title: t('Page not found'),
    description:
      'That page does not exist. The case studies, products and writing are all one click away.',
    path,
    noindex: true,
  }

/* ── RSS ─────────────────────────────────────────────────────────
   A real feed, with the full prose in <content:encoded>, not just an
   excerpt. Readers and aggregators pick it up, and it gives a crawler one
   URL that carries every post rather than fifteen fetches. */

const xmlEscape = (v: string) =>
  v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const rfc822 = (iso: string) => new Date(`${iso}T09:00:00Z`).toUTCString()

const paras = (lines: string[]) => lines.map((l) => `<p>${xmlEscape(l)}</p>`).join('')

const postHtml = (p: Post) =>
  [
    paras(p.intro),
    ...p.sections.map((sec) => `<h2>${xmlEscape(sec.heading)}</h2>${paras(sec.body)}`),
    `<h2>In short</h2><ul>${p.takeaways.map((x) => `<li>${xmlEscape(x)}</li>`).join('')}</ul>`,
  ].join('')

export const RSS_XML = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">',
  '  <channel>',
  `    <title>${xmlEscape(site.name)} — Writing</title>`,
  `    <link>${site.url}/blog</link>`,
  `    <description>${xmlEscape(META['/blog'].description)}</description>`,
  '    <language>en</language>',
  `    <copyright>© ${site.founded} ${xmlEscape(site.name)}</copyright>`,
  `    <lastBuildDate>${rfc822(LATEST_POST)}</lastBuildDate>`,
  `    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />`,
  '    <image>',
  `      <url>${site.url}/og/og-default.png</url>`,
  `      <title>${xmlEscape(site.name)}</title>`,
  `      <link>${site.url}/blog</link>`,
  '    </image>',
  ...postsByDate.flatMap((p) => [
    '    <item>',
    `      <title>${xmlEscape(p.title)}</title>`,
    `      <link>${site.url}/blog/${p.slug}</link>`,
    `      <guid isPermaLink="true">${site.url}/blog/${p.slug}</guid>`,
    `      <pubDate>${rfc822(p.date)}</pubDate>`,
    `      <dc:creator>${xmlEscape(site.name)}</dc:creator>`,
    `      <category>${xmlEscape(p.category)}</category>`,
    ...p.tags.map((tg) => `      <category>${xmlEscape(tg)}</category>`),
    `      <description>${xmlEscape(p.excerpt)}</description>`,
    `      <content:encoded><![CDATA[${postHtml(p)}]]></content:encoded>`,
    '    </item>',
  ]),
  '  </channel>',
  '</rss>',
  '',
].join('\n')

/* ── llms.txt ────────────────────────────────────────────────────
   llmstxt.org convention: /llms.txt is a link index with notes,
   /llms-full.txt is the prose itself. Both are generated from the
   content files at build time so they cannot drift from the pages. */

const PAGE_NOTES: Record<string, string> = {
  '/case-studies': 'Long-form write-ups of three systems taken to production.',
  '/products': 'SplitPocket (expense tracking and splitting) and BatMan (goals, habits and money by the year).',
  '/blog': 'Notes on making AI systems survive production.',
  '/about': 'Who we are, what working with us is actually like, and what we do not take on.',
  '/contact': 'Start a project. Goes straight to the engineers; no budget field.',
}

export const LLMS_TXT = [
  `# ${site.name}`,
  '',
  `> ${site.description} ${site.supporting}`,
  '',
  `An AI engineering studio in ${site.address.locality}, India. The people who scope a project are the people who build it. Contact: ${site.email}`,
  '',
  '## Case studies',
  '',
  ...caseStudies.map(
    (s) =>
      `- [${s.name}](${site.url}/case-studies/${s.slug}): ${s.summary} Sector: ${s.sector}. Stack: ${s.stack.join(', ')}. ${s.engagement.timeline}.`,
  ),
  '',
  '## Writing',
  '',
  ...postsByDate.map(
    (p) => `- [${p.title}](${site.url}/blog/${p.slug}): ${p.excerpt} (${p.category}, ${p.date})`,
  ),
  '',
  '## Pages',
  '',
  ...Object.entries(PAGE_NOTES).map(([path, note]) => `- [${path}](${site.url}${path}): ${note}`),
  '',
  '## Notes',
  '',
  '- Client names are withheld where an NDA applies.',
  '- Netra3 is our own system, deployed for retail clients; see its case study, not /products.',
  `- Full prose: ${site.url}/llms-full.txt`,
  `- Blog feed: ${site.url}/rss.xml`,
  `- Legal: ${site.url}/privacy-policy, ${site.url}/terms-and-conditions`,
  '',
].join('\n')

export const LLMS_FULL_TXT = [
  `# ${site.name} — case studies`,
  '',
  `Source: ${site.url}/case-studies`,
  '',
  ...caseStudies.flatMap((s) => [
    '---',
    '',
    `# ${s.name}`,
    '',
    `URL: ${site.url}/case-studies/${s.slug}`,
    `Sector: ${s.sector}`,
    `Client: ${s.client ?? 'under NDA'}`,
    `Role: ${s.engagement.role} · ${s.engagement.timeline} · ${s.engagement.team}`,
    `Stack: ${s.stack.join(', ')}`,
    `Updated: ${s.dateModified}`,
    '',
    `## Summary`,
    '',
    s.summary,
    '',
    `## The problem`,
    '',
    s.problem,
    '',
    `## The approach`,
    '',
    s.approach,
    '',
    ...s.sections.flatMap((sec) => [`## ${sec.heading}`, '', ...sec.body.flatMap((b) => [b, ''])]),
    `## Outcomes`,
    '',
    ...s.outcomes.map((o) => `- ${o.value} — ${o.label}`),
    '',
    `## Questions`,
    '',
    ...s.faq.flatMap((f) => [`### ${f.q}`, '', f.a, '']),
  ]),
  '---',
  '',
  `# ${site.name} — products`,
  '',
  ...products.flatMap((pr) => [
    '',
    `## ${pr.name} — ${pr.summary}`,
    '',
    ...(pr.url ? [`URL: ${pr.url}`] : []),
    `Status: ${pr.status} · ${pr.availability}`,
    `Built with: ${pr.stack.join(', ')}`,
    '',
    pr.description,
    '',
    ...pr.highlights.map((x) => `- ${x}`),
  ]),
  '',
  '---',
  '',
  `# ${site.name} — writing`,
  '',
  ...postsByDate.flatMap((p) => [
    '---',
    '',
    `# ${p.title}`,
    '',
    `URL: ${site.url}/blog/${p.slug}`,
    `Category: ${p.category} · Published: ${p.date} · ${p.readingMinutes} min read`,
    `Tags: ${p.tags.join(', ')}`,
    '',
    ...p.intro.flatMap((x) => [x, '']),
    ...p.sections.flatMap((sec) => [`## ${sec.heading}`, '', ...sec.body.flatMap((b) => [b, ''])]),
    '## In short',
    '',
    ...p.takeaways.map((x) => `- ${x}`),
    '',
  ]),
].join('\n')
