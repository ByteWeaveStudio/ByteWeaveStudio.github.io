/**
 * Single source of truth for identity + contact.
 * Every value here is confirmed in Website/PRODUCT.md or the live site.
 */
export const site = {
  name: 'ByteWeave Studio',
  shortName: 'ByteWeave',
  url: 'https://byteweave.studio',
  tagline: 'Software that Thinks.',
  supporting: 'AI systems engineered for the real world.',
  description:
    'ByteWeave Studio builds production-grade software using computer vision, document intelligence, LLMs and modern engineering.',
  email: 'hello@byteweave.studio',
  address: {
    line: 'Bangalore, India',
    /** Where the studio is is not where the clients are. */
    reach: 'Working with teams worldwide',
    locality: 'Bengaluru',
    country: 'IN',
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/byteweave-studio',
    instagram: 'https://www.instagram.com/byteweave.studio',
  },
  /** Existing endpoint, carried over from the static site. */
  formspree: 'https://formspree.io/f/xdaaznvd',
  founded: 2026,
  /**
   * Hand-set. Feeds <lastmod> for the pages that have no dated content of
   * their own — a sitemap that stamps "today" on every URL at every deploy
   * is a freshness signal search engines learn to ignore. Bump it when the
   * static pages actually change.
   */
  updated: '2026-09-09',
} as const

export const CONTACT = '/contact'

export const MAILTO = `mailto:${site.email}?subject=New%20project%20enquiry`

export type NavItem = { label: string; href: string }

export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Products', href: '/products' },
  { label: 'Blogs', href: '/blog' },
]

/** Every prerendered route. Kept here so the build and the sitemap agree. */
export const routes = [
  '/',
  '/about',
  '/case-studies',
  '/products',
  '/blog',
  '/contact',
] as const
