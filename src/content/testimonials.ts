export type Testimonial = {
  quote: string
  name: string
  role: string
  company: string
}

/**
 * INTENTIONALLY EMPTY.
 *
 * The four testimonials on the old site are fabricated theme filler: the
 * companies (TechVentures, Chipsland, ManuTech) appear nowhere else, have zero
 * overlap with the six real clients, shipped in the first commit alongside the
 * purchased template with user-1.jpg-style stock avatars, and one asserts
 * "99% accuracy" on a manufacturing project that exists in no case study.
 *
 * PRODUCT.md's claim that real quotes with photos live at
 * assets/images/profile/ is the one line in that file that does not hold up —
 * the directory does not exist.
 *
 * The Testimonials section short-circuits to null on an empty array, so adding
 * a single verified quote here is all that's needed to bring it back.
 */
export const testimonials: Testimonial[] = []
