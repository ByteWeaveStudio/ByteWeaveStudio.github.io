/**
 * What an engagement with ByteWeave is actually like.
 *
 * This is the one thing the About page can say that no other page does — the
 * homepage already carries the capabilities, the method and the principles,
 * and the case studies carry the proof. Repeating any of it here would waste
 * the page a prospect reads immediately before deciding to write to you.
 *
 * These are commitments about how the studio works rather than verifiable
 * facts, and they extend the voice already established in PRODUCT.md
 * ("execution over experimentation", "systems that get adopted"). Worth the
 * owner confirming each line reads as a promise they want to make.
 */

export const youGet: { title: string; body: string }[] = [
  {
    title: 'The engineers who scoped it',
    body: 'The people in the first call are the people who write the code. Nothing is relayed through an account layer.',
  },
  {
    title: 'Something working every cycle',
    body: 'Short cycles ending in a demo you can click, not a status report describing one.',
  },
  {
    title: 'Scope stated plainly',
    body: "What is in, what is out, and what we are genuinely unsure about. Where something is unknown we scope a spike rather than guess a number.",
  },
  {
    title: 'The unglamorous half',
    body: 'Deployment, monitoring, error paths, confidence thresholds and documentation are part of the build, not a phase we run out of budget before reaching.',
  },
  {
    title: 'A real handover',
    body: 'A checklist, a walkthrough and documentation your team can act on — not an email with a repository link.',
  },
  {
    title: 'Support when the real data lands',
    body: 'We stay available through the period after launch, which is when models drift and the edge cases finally show up.',
  },
]

export const youWont: string[] = [
  'An account manager carrying questions between you and the people doing the work',
  'A proof of concept with no route to production',
  'A model handed over without the system around it',
  'Hourly staff augmentation, billed by the seat',
  'A team of ten where three would move faster',
]

/** The first step, described concretely so it costs nothing to take. */
export const firstConversation = [
  'Send the problem in a paragraph — what you have, and what you wish it did.',
  'You get back what we think is possible, what we would need to find out first, and a rough shape.',
  'All of that happens before anyone writes a proposal. If it is not something we should build, we will say so.',
]
