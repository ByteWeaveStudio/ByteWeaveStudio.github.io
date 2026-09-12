export type Product = {
  id: string
  name: string
  /**
   * Optional on purpose. A product is only linked from here once it lives at
   * a brand address — personal URLs stay off the ByteWeave site.
   */
  domain?: string
  url?: string
  status: 'live' | 'building'
  /** One line: what it is. */
  summary: string
  description: string
  /** What you can actually use today. No store claims unless a listing exists. */
  availability: string
  /** Verified capability bullets — no roadmap items presented as shipped. */
  highlights: string[]
  stack: string[]
  /** Only where a confirmed figure exists. */
  outcome?: { value: string; label: string }
  logo: string
  /** A wordmark sits on the baseline; a square app icon needs a tile. */
  logoKind: 'wordmark' | 'mark'
}

/**
 * ByteWeave's own products — the two that are launched and open to anyone.
 *
 * SplitPocket facts are taken from splitpocket.app; BatMan's from its own
 * README and landing page. Neither has an App Store or Play Store listing, so
 * availability is stated as a web app that installs from the browser and
 * nothing here implies otherwise.
 *
 * BatMan is served from /BatMan/ on this same domain. Note that it is NOT
 * built by this repo — the path exists only in the deployed Pages artifact,
 * so anything that replaces that artifact wholesale will remove it.
 *
 * Netra3 is deliberately not on this page. It is a system deployed for retail
 * clients rather than something a visitor can sign up for, and it is covered
 * properly by its case study at /case-studies/netra3-store-monitoring.
 */
export const products: Product[] = [
  {
    id: 'splitpocket',
    name: 'SplitPocket',
    domain: 'splitpocket.app',
    url: 'https://splitpocket.app',
    status: 'live',
    summary: 'Track what you spend, split what you share.',
    description:
      'SplitPocket keeps personal spending and shared costs in one ledger. Log an expense in a couple of taps, split it equally, by exact amounts or by percentage, record who actually paid, and settle up against optimised debts instead of a dozen small transfers.',
    availability: 'Web app at my.splitpocket.app — installs to your phone from the browser',
    highlights: [
      'Works with no signal: logging an expense never waits on the network',
      'Splits equally, by exact amount or by percentage, and always reconciles',
      'One ledger for personal expenses and income, not two separate apps',
      '14 built-in categories plus your own, with monthly category reports',
      'Recurring entries for rent and subscriptions, receipt scanning and CSV export',
      'No ads and no data selling — the business model is not your spending history',
    ],
    stack: ['React', 'Capacitor', 'Supabase', 'FastAPI', 'PostgreSQL'],
    logo: '/products/splitpocket.svg',
    logoKind: 'wordmark',
  },
  {
    id: 'batman',
    name: 'BatMan',
    domain: 'byteweave.studio/BatMan',
    url: 'https://byteweave.studio/BatMan/',
    status: 'live',
    summary: 'Goals, habits, money and growth — one year at a time.',
    description:
      'BatMan is a year-scoped personal operating system. Everything on every screen is filtered by the year you pick in the header, which turns the usual scatter of habit apps, spreadsheets and goal lists into one workspace you can actually review at the end of a year.',
    availability: 'Web app, installable as a PWA — light and dark themes, syncs live across devices',
    highlights: [
      'Yearly, quarterly and monthly goals, with periods archived automatically as they close',
      'A "Today" habit checklist plus a month-wide grid with per-habit consistency scores',
      'Analytics: completion by month, a year heatmap and a weight tracker with monthly targets',
      'Expenses in up to ten colour-coded categories, with a spend-over-time chart and search',
      'A 12-month income and expense sheet where every figure opens into dated line items',
      'A four-pillar growth tree — pillars to areas to topics to tasks — as a drill-down or a radial mind map',
    ],
    stack: ['React 19', 'TypeScript', 'Vite', 'Firebase', 'PWA'],
    logo: '/products/batman.webp',
    logoKind: 'mark',
  },
]
