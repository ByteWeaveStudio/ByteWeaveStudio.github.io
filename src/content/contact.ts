/**
 * The enquiry form's shape.
 *
 * The interest options mirror the site's own capability spine rather than the
 * old site's generic service list, and each one carries the question we would
 * actually ask first. Picking an option retunes the message prompt, which does
 * two things: it gets us a more useful first message, and it shows the visitor
 * we think in terms of their problem rather than our service menu.
 *
 * Budget is deliberately absent. The old form's top band capped at "$50,000+",
 * which anchored every enquiry below the range this studio works in.
 */
export type Interest = { id: string; label: string; prompt: string }

export const interests: Interest[] = [
  {
    id: 'computer-vision',
    label: 'Computer Vision',
    prompt:
      'What are the images or video of, and what decision should they drive? Mention where the cameras or files come from if you know.',
  },
  {
    id: 'document-intelligence',
    label: 'Document Intelligence',
    prompt:
      'Which documents, roughly how many a month, and where should the extracted data end up? Tell us if the layouts vary a lot.',
  },
  {
    id: 'ai-llm',
    label: 'AI, LLMs & Agents',
    prompt:
      'What would someone ask it, and what does it need to know to answer well? Mention where that knowledge lives today.',
  },
  {
    id: 'applications',
    label: 'Applications & Automation',
    prompt:
      'What should the system do, and what does it need to talk to? Existing tools, data and constraints all help.',
  },
  {
    id: 'not-sure',
    label: 'Not sure yet',
    prompt:
      "Describe the problem in your own words. We'll work out which part is the hard bit — that is usually the useful conversation anyway.",
  },
]

/** Sidebar: what turns a vague enquiry into a useful reply. */
export const whatHelps: { title: string; body: string }[] = [
  {
    title: 'What you have',
    body: 'The data, documents, feeds or systems already in play — even roughly.',
  },
  {
    title: 'What you want it to do',
    body: 'The decision or action at the end. Not the technology you think it needs.',
  },
  {
    title: 'Anything fixed',
    body: 'A deadline, a system it must integrate with, a rule about where data can live.',
  },
]
