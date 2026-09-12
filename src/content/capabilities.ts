export type Capability = {
  id: string
  verb: string
  discipline: string
  description: string
  /** Restrained on purpose — §16 of the brief rules out a technology wall.
   *  Kept to tools the delivered case studies actually imply. */
  stack: string[]
}

/**
 * The SEE → UNDERSTAND → THINK → ACT spine.
 *
 * "Automated defect detection" is deliberately absent: the old site listed it
 * as a capability with no supporting project, and it is the same claim the
 * fabricated ManuTech testimonial made.
 */
export const capabilities: Capability[] = [
  {
    id: 'see',
    verb: 'See',
    discipline: 'Computer Vision',
    description:
      'Systems that read images and video the way an operator would — locating what matters in a frame, tracking it over time, and turning it into a number someone can act on.',
    stack: ['Python', 'OpenCV', 'PyTorch', 'YOLO'],
  },
  {
    id: 'understand',
    verb: 'Understand',
    discipline: 'Document Intelligence',
    description:
      'Invoices, bank statements and utility bills arrive in every layout imaginable. We build extraction pipelines with field-level validation and confidence scoring, so people review the edge cases instead of every page.',
    stack: ['Google Document AI', 'AWS Textract', 'Tesseract', 'Custom OCR'],
  },
  {
    id: 'think',
    verb: 'Think',
    discipline: 'AI, LLMs & Agents',
    description:
      'Language models are only useful when they are grounded in your data and constrained by your rules. We build retrieval, agents and tool integrations that hold up outside a demo.',
    stack: ['OpenAI', 'Claude', 'RAG', 'Vector search'],
  },
  {
    id: 'act',
    verb: 'Act',
    discipline: 'Applications & Automation',
    description:
      'The model is the middle of the job, not the end of it. We ship the dashboards, APIs, mobile apps and infrastructure that put the output in front of the people who need it.',
    stack: ['React', 'Next.js', 'Node.js', 'Flutter', 'PostgreSQL', 'AWS'],
  },
]
