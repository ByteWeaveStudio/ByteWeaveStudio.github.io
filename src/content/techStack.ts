export type TechLayer = {
  id: string
  label: string
  note: string
  tech: string[]
  /** The one layer people mean when they say "AI project". */
  isModel?: boolean
}

/**
 * The stack, top to bottom, as it physically sits: what people touch at the
 * top, what holds it up at the bottom.
 *
 * Ordered this way on purpose — the section's argument is that the model is a
 * thin band in the middle and the five layers around it are where the work is.
 * A pipeline order would not carry that.
 *
 * Names are rendered as text, not logos (§16 rules out a logo wall).
 */
export const techLayers: TechLayer[] = [
  {
    id: 'application',
    label: 'Application',
    note: 'What people actually use',
    tech: ['React', 'Next.js', 'Flutter'],
  },
  {
    id: 'api',
    label: 'APIs',
    note: 'How it reaches the software you already run',
    tech: ['REST', 'Webhooks', 'Auth', 'Rate limiting'],
  },
  {
    id: 'logic',
    label: 'Business logic',
    note: 'Validation, thresholds, human review routing',
    tech: ['Python', 'Node.js', 'Queues', 'Schedulers'],
  },
  {
    id: 'intelligence',
    label: 'Vision / AI / LLM',
    note: 'Where unstructured input becomes meaning',
    tech: ['PyTorch', 'OpenCV', 'OpenAI', 'Claude'],
    isModel: true,
  },
  {
    id: 'data',
    label: 'Data',
    note: 'Documents, images, video, transactions',
    tech: ['PostgreSQL', 'MongoDB', 'S3'],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    note: 'Deployment, monitoring, scale',
    tech: ['AWS', 'Docker', 'CI/CD', 'Observability'],
  },
]

export const MODEL_INDEX = techLayers.findIndex((l) => l.isModel)
