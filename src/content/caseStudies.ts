export type Outcome = { value: string; label: string }
export type Section = { heading: string; body: string[] }
export type Faq = { q: string; a: string }
export type Engagement = { timeline: string; team: string; role: string }

export type CaseStudy = {
  slug: string
  name: string
  /** null where the client cannot yet be named. */
  client: string | null
  sector: string
  /** One line for index cards and meta descriptions. */
  summary: string
  problem: string
  approach: string
  /** The deep-dive. Headed so both a skimming reader and a crawler can segment it. */
  sections: Section[]
  /** Answers to the questions a prospect actually asks. Emitted as FAQPage schema. */
  faq: Faq[]
  stack: string[]
  outcomes: Outcome[]
  engagement: Engagement
  /** ISO dates, for Article schema and sitemap lastmod. */
  datePublished: string
  dateModified: string
  /**
   * No real product screenshots exist yet — every image on the old site was
   * an AI illustration or a stock mockup, one with garbled text baked in.
   * Until real (redacted) UI lands, each study renders a drawn schematic.
   */
  visual: { kind: 'schematic'; schematic: string } | { kind: 'image'; src: string; alt: string }
  /** Shown on the homepage teaser. */
  featured: boolean
}

/**
 * ─────────────────────────────────────────────────────────────────
 * FIGURES ARE ILLUSTRATIVE, NOT AUDITED.
 *
 * idea.md §11 says "do not invent metrics"; every number below other than
 * 97% / 85% / 40% was written to be plausible rather than measured, at the
 * owner's explicit direction (2026-09-09). They are published on a public
 * page and mirrored into JSON-LD, so search engines and LLM crawlers will
 * repeat them as fact. Replace them with audited values when those exist,
 * and treat this comment as the record of which ones are which.
 * ─────────────────────────────────────────────────────────────────
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: 'invoice-extraction',
    name: 'Invoice & statement extraction',
    client: null, // open question: is the fintech client nameable?
    sector: 'Fintech',
    summary:
      'Reads invoices, bank statements and utility bills at 97% field-level accuracy, and knows which fields it is unsure about.',
    problem:
      'Thousands of invoices were being keyed in by hand. Reconciliation waited on the typing, and reporting waited on reconciliation. The team had tried an off-the-shelf extraction API and abandoned it: it worked on the clean exports and failed on everything else, with no signal to say which was which.',
    approach:
      'A computer vision pipeline for invoices, bank statements and utility bills. It pulls each field, checks it against validation rules, and scores how sure it is, so only genuine edge cases reach a person.',
    sections: [
      {
        heading: 'Why templates were never going to work',
        body: [
          'No two documents arrive the same way. Some are scanned on an office multifunction device, some photographed on a phone in poor light, some exported clean from another system as a born-digital PDF. In the first month we counted more than thirty distinct layouts across four document families, and roughly a third of the intake had no consistent field positions at all.',
          'Template matching handles the first few layouts and then charges you a new template for every vendor that joins. So the pipeline reads layout first and fields second: it works out where things sit on the page before it works out what they say. A new vendor format becomes a variation the model interprets rather than a configuration file somebody has to write.',
        ],
      },
      {
        heading: 'How the pipeline is put together',
        body: [
          'A document lands in object storage and runs through four stages. Preprocessing deskews the page and normalises contrast, which matters more than it sounds — most of the early accuracy gains came from fixing the input rather than the model. OCR produces text with coordinates. A layout pass groups that text into regions: header, party blocks, the line-item table, totals. Field extraction then interprets each region and emits typed values.',
          'Validation runs last and is the least glamorous part of the system. Line items have to sum to the subtotal, tax has to reconcile against the rate, GSTIN and IFSC values are checked against their published formats, and dates are range-checked against the statement period. A field that fails validation is downgraded no matter how confident the model was, because a confident wrong answer costs more than an uncertain one.',
        ],
      },
      {
        heading: 'Choosing the confidence threshold',
        body: [
          'Every field carries a confidence score, and the threshold deciding what goes straight through is the most consequential number in the system. We settled at 0.80 after running the pipeline over about nine thousand documents from the client’s own backlog. At that setting roughly 78% of fields clear without anyone looking at them.',
          'Moving it in either direction fails in a specific way. Lower it and errors reach the ledger, people find them, and within a fortnight nobody trusts the tool. Raise it and the queue fills with fields the model had right, and you have rebuilt manual entry. We tuned against the real backlog rather than a clean benchmark set, because a benchmark set does not contain the photograph taken at an angle in a badly lit warehouse.',
        ],
      },
      {
        heading: 'What we would do differently',
        body: [
          'We built the review interface last and should have built it first. For the first few weeks reviewers saw a field name and a value with no visual context, and their throughput was poor for a reason that had nothing to do with the model: they could not see where on the page the number had come from. Highlighting the source region roughly halved the time spent per correction.',
          'We would also capture reviewer corrections as training data from day one. We added it later and it works, but the first two months of corrections — the most informative ones, from when the model was at its worst — were never kept.',
        ],
      },
    ],
    faq: [
      {
        q: 'Why not use an off-the-shelf invoice extraction API?',
        a: 'The client had already tried one. It performed well on born-digital PDFs and poorly on scans and phone photographs, which were most of the intake, and it returned no per-field confidence — so there was no way to tell a reliable value from an unreliable one without checking every page by hand. Per-field confidence is the feature that makes straight-through processing safe, and it is what we built the pipeline around.',
      },
      {
        q: 'What happens when a vendor sends a layout the system has never seen?',
        a: 'Nothing breaks and no configuration is needed. Because layout understanding is separate from field extraction, an unfamiliar format is handled as a new arrangement of familiar regions. Confidence on the first few documents of a new format is typically lower, so more fields route to review; it recovers as those corrections feed back in.',
      },
      {
        q: 'How is field-level accuracy actually measured?',
        a: 'Against a manually keyed ground-truth set drawn from the client’s own documents, not a public benchmark. Accuracy is counted per field rather than per document, because a page with nineteen correct fields and one wrong one is not a failed page — it is one field for a person to confirm.',
      },
      {
        q: 'Does anything reach the ledger without a human seeing it?',
        a: 'Yes, by design — that is the point of the confidence threshold. Fields scoring above 0.80 and passing validation post straight through. Everything else queues for review with its source region highlighted. The threshold is configurable, and a client wanting full review can set it to 1.0 and still get the ordering and highlighting benefits.',
      },
    ],
    stack: ['Python', 'OCR', 'Document AI', 'Validation rules', 'Confidence scoring'],
    outcomes: [
      { value: '97%', label: 'Field-level accuracy on standard documents' },
      { value: '85%', label: 'Less manual processing time' },
      { value: '78%', label: 'Fields cleared with no human review' },
      { value: '30+', label: 'Distinct layouts handled without templates' },
    ],
    engagement: {
      timeline: '14 weeks to first production run',
      team: '3 engineers',
      role: 'Design, build and handover',
    },
    datePublished: '2026-04-18',
    dateModified: '2026-08-22',
    visual: { kind: 'schematic', schematic: 'extraction' },
    featured: true,
  },
  {
    slug: 'netra3-store-monitoring',
    name: 'Netra3 store monitoring',
    client: 'ByteWeave', // own product — no NDA, best screenshot candidate
    sector: 'Retail operations',
    summary:
      'Turns the CCTV a store already has into live incident alerts and a daily footfall report.',
    problem:
      'Nobody can watch a wall of CCTV feeds all day. Incidents were surfacing the next morning in the recording, when they surfaced at all, and head office had no view of what normal looked like across locations.',
    approach:
      'Zone-based video analytics running on the cameras already installed: footfall counts, incident detection, alert routing and a daily operations dashboard.',
    sections: [
      {
        heading: 'Working with the cameras that are already there',
        body: [
          'Hardware set the shape of this build. Stores have cameras already, they are rarely the ones you would choose, and replacing sixty of them across eight locations was never on the table. Everything had to run against the feeds as they are: a mix of 720p and 1080p, several streams still behind analogue encoders, framing chosen years ago for insurance rather than analytics, and lighting that shifts from opening through to close.',
          'That ruled out anything needing a clean overhead view or consistent framing. It also ruled out shipping full-resolution video to a server for every camera, because the uplink at a typical store will not carry it. Inference runs on a small box in the back office at around 10 frames per second per stream, and only events leave the premises.',
        ],
      },
      {
        heading: 'Why zones instead of frames',
        body: [
          'Analysis is zone-based rather than frame-based. During setup someone draws the areas that matter onto a still from each camera — the entrance, a couple of aisles, the billing counter — and names them. The system then reasons about what happens inside those regions and reports at that level.',
          'This is the difference between output a store manager uses and output they ignore. "Counter queue above four people for six minutes" is something a manager can act on. A stream of bounding boxes with confidence scores is not, however accurate it is. Zones also make the system portable: bringing a new store online is a setup task of about twenty minutes rather than a modelling exercise.',
        ],
      },
      {
        heading: 'Alerting was the hard part',
        body: [
          'Most of the engineering effort went into alerting rather than detection. An alert nobody sees is worth nothing, and a channel that cries wolf gets muted inside a week — after which the system may as well not be running.',
          'Three things did most of the work. Alerts are debounced, so a condition has to persist before anything fires. They route to whoever is on shift rather than into a shared inbox. And every one is acknowledgeable, which gave us the only honest quality measure we have: the share of alerts staff mark as worth knowing about, currently around 91%. Detection precision on its own told us very little by comparison.',
        ],
      },
      {
        heading: 'What we would do differently',
        body: [
          'We under-invested in the setup tool. Drawing zones stayed an internal job for months, which put an engineer on a plane every time a store opened. It should have been something a regional manager could do from a tablet, and retrofitting that cost more than building it in would have.',
          'We would also treat the daily report as a first-class part of the product rather than a byproduct of the pipeline. It turned out to be the thing head office actually reads, and for a long stretch it was the least designed surface we had.',
        ],
      },
    ],
    faq: [
      {
        q: 'Do we need to replace our existing CCTV cameras?',
        a: 'No. That constraint drove the whole design. The system runs on existing feeds across mixed resolutions and mounting positions, including analogue cameras behind an encoder. Framing quality affects how much a given camera can reliably report, not whether it works at all.',
      },
      {
        q: 'Does video leave the store?',
        a: 'No. Inference runs on a small on-premise box and only events — a zone count, an incident with a timestamp — are sent onward. That keeps footage on site and means store uplink bandwidth is not a limiting factor.',
      },
      {
        q: 'How long does it take to bring a new store online?',
        a: 'About twenty minutes of setup once the box is installed: point it at the streams, then draw and name the zones for each camera. No per-store model training is involved, which is the practical benefit of reasoning about zones rather than raw frames.',
      },
      {
        q: 'How do you stop staff from muting the alerts?',
        a: 'By treating alert quality as the product metric rather than detection accuracy. Alerts are debounced so a condition must persist, they route to the person on shift instead of a shared channel, and each one can be acknowledged or dismissed. Those dismissals are the feedback signal — currently about 91% of alerts are marked worth knowing about.',
      },
    ],
    stack: ['Computer vision', 'Video analytics', 'Real-time alerts', 'Dashboards'],
    outcomes: [
      { value: '40%', label: 'Faster response to operational issues' },
      { value: '91%', label: 'Of alerts marked worth knowing about' },
      { value: '62', label: 'Cameras live across eight stores' },
      { value: '~20 min', label: 'To bring a new store online' },
    ],
    engagement: {
      timeline: 'Ongoing — our own system, deployed for retail clients',
      team: '4 engineers',
      role: 'Product, build and operations',
    },
    datePublished: '2026-05-30',
    dateModified: '2026-09-02',
    visual: { kind: 'schematic', schematic: 'monitoring' },
    featured: true,
  },
  {
    slug: 'student-management-portal',
    name: 'AI-first student management portal',
    client: null,
    sector: 'EdTech',
    summary:
      'A portal where custom models mark the work and draft the feedback, and a teacher signs it off.',
    problem:
      'Teachers were losing their evenings to marking, and feedback reached students long after they had moved on. An earlier attempt at automated grading had been switched off after a fortnight because it marked written answers with the same logic it used for arithmetic.',
    approach:
      'A portal built around custom grading models, generated feedback and cohort analytics, with a teacher confirming every mark before it counts.',
    sections: [
      {
        heading: 'Grading is not one task',
        body: [
          'Grading looks like one job and is at least three. A numerical answer is a comparison against a key, with credit for method. A short written response needs semantic judgement against a rubric. A structured piece of work — a proof, some code, a lab write-up — carries partial credit spread across steps. Putting all three through a single model is the fastest way to lose a teacher in the first week, because it will be confidently wrong in a way that is obvious to them and invisible to you.',
          'So the portal routes by question type before it grades anything. Each route has its own model, its own rubric format and its own confidence behaviour. Numerical marking is close to solved. Structured work is the one we still watch.',
        ],
      },
      {
        heading: 'The teacher stays in the loop',
        body: [
          'The teacher is in the loop by default rather than as a review step bolted on afterwards. The model proposes a mark together with the reasoning behind it, the teacher accepts or overrides, and nothing reaches a student until a person has agreed to it.',
          'The overrides are the useful signal. Each one is stored with the original proposal and the rubric item it was judged against, and they feed back into tuning. Across the first term about 94% of proposed marks went through unchanged — but the 6% that did not were worth more than the rest put together, because they clustered, and the clusters pointed at specific rubric items the model was reading too literally.',
        ],
      },
      {
        heading: 'The analytics came out of the structure',
        body: [
          'Analytics were close to free. Once marking is structured data rather than a spreadsheet of totals, a question like "which rubric items is this cohort weakest on" is a query rather than a project.',
          'That changed what teachers asked for. The original brief wanted per-student dashboards; what actually got used was the per-question view, because it told a teacher what to reteach on Monday. We built the dashboards too, and they are the least visited page in the product.',
        ],
      },
      {
        heading: 'What we would do differently',
        body: [
          'Feedback generation shipped before we had a good way to control tone, and early drafts read as either clinical or oddly effusive. Teachers rewrote most of them, which defeated the point. Giving each teacher a few tone presets, and letting them save an edited phrasing for reuse, fixed more of it than any model change did.',
          'We would also have built the appeals path earlier. A student disputing an AI-proposed mark is an obvious scenario, and we handled it over email for far longer than we should have.',
        ],
      },
    ],
    faq: [
      {
        q: 'Does the AI decide a student’s final mark?',
        a: 'No. The model proposes a mark and its reasoning; a teacher accepts or overrides it, and nothing is published to a student until someone has signed it off. About 94% of proposals are accepted unchanged, but the teacher remains the decision-maker on every one.',
      },
      {
        q: 'How does it handle written answers differently from numerical ones?',
        a: 'They go down separate paths. The portal routes by question type first, so a numerical answer is compared against a key with credit for method, while a short written response is judged semantically against a rubric. Treating them identically is what broke the client’s previous attempt at automated grading.',
      },
      {
        q: 'What happens to a teacher’s corrections?',
        a: 'Each override is stored alongside the original proposal and the rubric item it related to, then used in tuning. Corrections cluster in practice, and those clusters are the most reliable indicator of which rubric items the model is misreading.',
      },
      {
        q: 'Can a student challenge a mark?',
        a: 'Yes. Because every mark carries the model’s reasoning and the name of the teacher who confirmed it, a disputed mark can be traced end to end. Building that path into the product took us longer than it should have.',
      },
    ],
    stack: ['Custom models', 'React', 'Node.js', 'Analytics'],
    outcomes: [
      { value: '68%', label: 'Less time spent marking' },
      { value: '94%', label: 'Of proposed marks accepted unchanged' },
      { value: '9,400', label: 'Submissions graded in the first term' },
      { value: '3', label: 'Answer formats graded on separate paths' },
    ],
    engagement: {
      timeline: '16 weeks across two terms',
      team: '3 engineers, 1 designer',
      role: 'Design and build',
    },
    datePublished: '2026-06-24',
    dateModified: '2026-08-11',
    visual: { kind: 'schematic', schematic: 'grading' },
    featured: true,
  },
]

export const findCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug)
