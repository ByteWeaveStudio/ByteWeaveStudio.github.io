export type MethodStep = { n: string; title: string; body: string }

export const method: MethodStep[] = [
  {
    n: '01',
    title: 'Discover',
    body: 'Understand the business problem, the users, the data you already have, and the constraints that will actually shape the build.',
  },
  {
    n: '02',
    title: 'Architect',
    body: 'Design the product and the technical architecture together, so the model, the data flow and the interface are decided as one system.',
  },
  {
    n: '03',
    title: 'Build',
    body: 'Develop the software, AI systems, APIs and infrastructure in short cycles, with working demos rather than status reports.',
  },
  {
    n: '04',
    title: 'Deploy',
    body: 'Move the system into production properly — monitoring, error handling, documentation and the handover that makes it yours.',
  },
  {
    n: '05',
    title: 'Evolve',
    body: 'Watch how it behaves on real data, retrain and tune where accuracy drifts, and scale what works.',
  },
]
