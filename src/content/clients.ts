export type Client = {
  name: string
  /** Sourced from Website/assets/images/brands/. Re-source as SVG when available. */
  logo: string
  /** Intrinsic size — supplies the aspect ratio that keeps CLS at zero. */
  w: number
  h: number
  /**
   * Optical size correction. Ink height varies from 52% to 86% of the canvas
   * across these files, so a single CSS height makes them differ by 1.65x in
   * apparent size. Measured per logo and damped toward 1; two-line lockups
   * carry more mass so they are not normalised all the way.
   */
  scale: number
  /** ByteWeave's own or affiliated entities — flagged so we never over-claim. */
  affiliated?: boolean
}

/**
 * VERIFIED. Six real clients, permission to display confirmed in PRODUCT.md.
 * Each logo file was opened and visually matched to its name.
 *
 * Note: the old site duplicated these six to pad a marquee (reading as 12) and
 * captioned them "around the world" — all six are India-based. Both dropped.
 */
export const clients: Client[] = [
  // A long single-line wordmark at 8.4:1 — the scale is set by width, not
  // height, so it sits inside its grid cell like the rest.
  { name: 'TruBoard Partners', logo: '/clients/truboard-partners.webp', w: 806, h: 96, scale: 0.5 },
  // Vector source. A stacked lockup at 1.56:1, so it is far narrower than the
  // wordmarks beside it; the scale is raised to even out the optical mass.
  // Its viewBox was trimmed to the ink, so height here means real height.
  { name: 'LINC Education', logo: '/clients/linc-education.svg', w: 230, h: 148, scale: 1.15 },
  { name: 'Netra3', logo: '/clients/netra3.webp', w: 288, h: 96, scale: 0.95, affiliated: true },
  { name: 'The WorldGrad', logo: '/clients/the-worldgrad.webp', w: 288, h: 96, scale: 1.12 },
  { name: '20degrees', logo: '/clients/20degrees.webp', w: 288, h: 96, scale: 1.12 },
  { name: 'SPRS And Co. LLP', logo: '/clients/sprs-and-co.webp', w: 288, h: 96, scale: 1.22 },
]
