export type Principle = { title: string; body: string }

/** "Why ByteWeave" — each answers a specific technical-buyer objection. */
export const principles: Principle[] = [
  {
    title: 'Production over prototypes',
    body: 'A model that works on your test set is the easy half. We build for the input that arrives malformed at 2am, and we own the deployment, not just the notebook.',
  },
  {
    title: 'Accuracy is a number, not an adjective',
    body: 'Every extraction pipeline we ship reports confidence per field. You get to see where the system is unsure and decide what a human should check, rather than trusting a single headline percentage.',
  },
  {
    title: 'Engineering first',
    body: 'The AI is one component inside a system that also needs APIs, a database, auth, logging and someone to call when it breaks. We build all of it, which is why it integrates with what you already run.',
  },
  {
    title: 'Built to evolve',
    body: 'Data drifts and requirements move. We architect so the model can be retrained and swapped without rewriting the application around it.',
  },
]
