export type PostSection = { heading: string; body: string[] }

export type Post = {
  slug: string
  title: string
  /** The one-line promise. Used on the index and as the meta description. */
  excerpt: string
  category: string
  /** ISO date. Spread across the last year. */
  date: string
  readingMinutes: number
  tags: string[]
  /** Paragraphs before the first heading. */
  intro: string[]
  sections: PostSection[]
  /** Closing summary. Also the part an assistant is most likely to quote. */
  takeaways: string[]
  /** Replaces the generated cover once a real image exists. */
  cover?: { src: string; alt: string }
}

/** Fixed set, so the index filter and the category labels cannot drift apart. */
export const CATEGORIES = [
  'Document AI',
  'Computer vision',
  'LLM engineering',
  'Shipping AI',
  'Web & mobile',
  'MCP',
] as const

export const posts: Post[] = [
  {
    slug: 'invoice-ocr-fails-in-production',
    title: 'Why your invoice OCR works in testing and fails in production',
    excerpt:
      'The test folder is clean exports. The real intake is phone photographs. What changes between the two, and how to find out before a client does.',
    category: 'Document AI',
    date: '2025-09-18',
    readingMinutes: 5,
    tags: ['OCR', 'Document AI', 'Accuracy', 'Production'],
    intro: [
      'Every document extraction project has the same first week. Somebody assembles a folder of sample invoices, the pipeline reads them at 96%, and the room relaxes. Then it goes live, accuracy settles somewhere in the seventies, nobody can say exactly why, and within a month the finance team has quietly gone back to typing.',
      'The gap is rarely the model. It is that the sample folder and the real intake are different populations, and the folder was assembled by a person who — without meaning to — picked documents that were easy to read.',
    ],
    sections: [
      {
        heading: 'Your test set was curated, whether you meant to or not',
        body: [
          'Ask where the samples came from and the answer is usually that someone exported a few dozen from the accounting system, or forwarded the ones already sitting in their inbox. Both are biased in the same direction. Documents that made it into the system cleanly are over-represented, because the messy ones were the ones that got stuck.',
          'You can see it in the file types. A curated folder skews heavily towards born-digital PDFs with a proper text layer. Real intake in most Indian back offices is a mix: scans from an office multifunction device, phone photographs taken on a warehouse floor, screenshots of a payment confirmation, and occasionally a photograph of a screen displaying a PDF.',
        ],
      },
      {
        heading: 'What production actually sends you',
        body: [
          'The failure modes that matter almost never appear in a demo. Pages arrive rotated by ninety degrees or skewed by four. Contrast is poor enough that a decimal point disappears. A stapled invoice is photographed with the second page at an angle, so the line-item table runs off the frame. Someone forwards a scan of a scan, two generations deep.',
          'None of these need a better model. They need preprocessing, and they need the pipeline to notice when a page is unreadable rather than confidently returning a value from it. On our own extraction work, more of the early accuracy gain came from deskewing and contrast normalisation than from anything we did to the extraction step.',
        ],
      },
      {
        heading: 'Measure the shape of the intake, not just the accuracy',
        body: [
          'Before quoting an accuracy figure, spend a day characterising what actually arrives. Count the distribution of source types, page counts, resolutions and languages. Count how many documents have no text layer. Count how many are photographs rather than scans. That profile tells you more about what the system will do in month three than any benchmark number.',
          'It is also the honest basis for a conversation with the client. "97% on born-digital PDFs, 84% on phone photographs, and photographs are 40% of your intake" is a useful sentence. A single blended number is not, because it hides which half of the problem you have actually solved.',
        ],
      },
      {
        heading: 'Build the failure path before you tune the model',
        body: [
          'A system that is right 97% of the time and silent about the other 3% is worse than one that is right 90% of the time and says which 10% to check. Per-field confidence, a review queue, and a way to see the region of the page a value came from are not polish. They are what makes any accuracy figure usable.',
          'This also changes what you optimise. Once there is a review path, the goal stops being raw accuracy and becomes the share of fields that clear without a human, at an error rate the client can live with. Those are different targets, and the second one is the one that shows up in their operating costs.',
        ],
      },
      {
        heading: 'A test set that survives contact',
        body: [
          'Replace the curated folder with a random sample of real intake, drawn across at least a full month so seasonal formats are included. Key it by hand once. It is tedious and it is the highest-value day of work in the project.',
          'Then keep it current. Vendors change their templates, someone switches scanning hardware, a new business unit joins with different paperwork. A ground-truth set assembled in month one and never touched is a slowly rotting measure of a system that keeps changing underneath it.',
        ],
      },
    ],
    takeaways: [
      'Curated sample folders over-represent clean documents; the messy ones are exactly the ones that never made it into the system.',
      'Report accuracy split by source type rather than as one blended number, and state what share of intake each type represents.',
      'Confidence scoring and a review queue matter more than the last two points of accuracy, because they make the number actionable.',
      'Draw the ground-truth set at random from a full month of real intake, and refresh it as formats drift.',
    ],
  },
  {
    slug: 'rag-demo-versus-rag-product',
    title: 'Why your RAG demo works and your RAG product doesn’t',
    excerpt:
      'A retrieval demo on twenty documents proves almost nothing about the same system on twenty thousand. The four things that break in between.',
    category: 'LLM engineering',
    date: '2025-10-14',
    readingMinutes: 6,
    tags: ['RAG', 'LLM', 'Retrieval', 'Evaluation'],
    intro: [
      'Retrieval-augmented generation demos beautifully. Point it at a folder of documents, ask three questions you already know the answers to, and it will answer all three. The demo is genuinely not a trick — the system really did retrieve and really did answer.',
      'It is just that a corpus of twenty documents and a corpus of twenty thousand are different problems, and almost everything that separates them is invisible at demo scale.',
    ],
    sections: [
      {
        heading: 'At small scale, retrieval cannot fail',
        body: [
          'With twenty documents, nearly any embedding model puts the right chunk in the top five, because there are only a few hundred chunks and the competition is weak. Retrieval quality is not being tested. What you are seeing is the language model summarising a passage you handed it.',
          'Scale the corpus and the same query now competes against thousands of near-duplicates: last year’s version of the policy, the draft, the regional variant, the slide deck that quotes it. Getting the right chunk into the context window becomes the actual engineering problem, and it was never exercised in the demo.',
        ],
      },
      {
        heading: 'Chunking decides more than the model does',
        body: [
          'Most teams reach for a fixed token window with an overlap because that is what the tutorial did. It works acceptably on prose and badly on everything else. A table split across two chunks loses its header row, so the numbers arrive without column names. A clause split mid-sentence loses the condition it depended on.',
          'Chunking on document structure rather than character count fixes more retrieval problems than swapping embedding models does. Keep a table whole. Keep a section with its heading. Carry the document title and section path into every chunk as a prefix, so a fragment retrieved on its own still says what it belongs to.',
        ],
      },
      {
        heading: 'Nobody asks the questions you tested',
        body: [
          'Demo questions are well-formed and use the vocabulary of the documents. Real users type three words, use the internal abbreviation rather than the official term, ask two things at once, and refer to "the new one" without saying which.',
          'This is where hybrid retrieval earns its cost. Dense embeddings handle paraphrase; keyword search handles the exact part number, the policy code and the internal acronym that has no semantic neighbours. Running both and merging results is unglamorous and reliably beats either alone.',
        ],
      },
      {
        heading: 'The failure mode is confident, not absent',
        body: [
          'When retrieval misses at demo scale you notice, because there is nothing to answer from. At production scale retrieval almost always returns something, and a language model handed a plausible but wrong passage will write a fluent, well-structured, incorrect answer. Users cannot tell the difference, which is worse than an error message.',
          'The fix is not a better prompt. It is a relevance threshold below which the system declines to answer, citations that point at the retrieved passage so a user can check, and an evaluation set that includes questions the corpus genuinely cannot answer. If the system never says "I don’t have that", it is not being honest, it is guessing.',
        ],
      },
    ],
    takeaways: [
      'A demo corpus does not test retrieval; it tests summarisation of a passage you effectively handed over.',
      'Chunk on document structure, and prefix each chunk with its title and section path.',
      'Combine keyword and vector search — internal codes and acronyms have no useful embedding neighbours.',
      'Include unanswerable questions in your eval set, and make declining to answer a supported outcome.',
    ],
  },
  {
    slug: 'pricing-an-ai-project',
    title: 'How to price an AI project when you can’t promise accuracy',
    excerpt:
      'Fixed-price assumes a known scope. Machine learning does not give you one up front. A structure that protects both sides without pretending.',
    category: 'Shipping AI',
    date: '2025-11-06',
    readingMinutes: 5,
    tags: ['Consulting', 'Pricing', 'Project scoping'],
    intro: [
      'A client asks what it costs to automate their invoice processing. The honest answer on day one is that nobody knows, because the cost depends on how messy their documents are and neither party has looked yet. The unhelpful answer is to say that out loud and leave.',
      'Fixed-price contracts assume the scope is knowable in advance. Time and materials shifts all the risk onto the client and gives them no ceiling. Most AI work sits awkwardly between the two, and pretending otherwise is how projects end in a dispute.',
    ],
    sections: [
      {
        heading: 'Sell the assessment separately',
        body: [
          'Split a small, fixed-price first phase whose only deliverable is knowing what the real project costs. Two to three weeks, priced so it is an easy yes. You take a genuine sample of their data, run it through a baseline, and report what accuracy looks like, where it fails, and what it would take to close the gap.',
          'This is not a sales trick. It is the only point where an accuracy estimate can be made responsibly, and the client ends up owning something useful even if they stop there — a characterisation of their own data that they did not have before.',
        ],
      },
      {
        heading: 'Quote the workflow, not the model',
        body: [
          'Accuracy is uncertain. The rest of the system is not. Ingestion, the review interface, integration with the accounting system, deployment, monitoring and handover are ordinary software with ordinary estimates, and on most document projects they are the larger share of the work.',
          'Price those normally and fixed. Then treat model improvement as a separate, bounded track with a target and a stopping rule. The client sees a firm number for the system and a capped number for the part that is genuinely uncertain.',
        ],
      },
      {
        heading: 'Write the acceptance criterion in their terms',
        body: [
          'Avoid accepting on a raw accuracy figure. It invites arguments about which documents count, and it does not describe anything the client cares about. Write it as throughput instead: the share of documents that complete without human intervention, at an error rate below an agreed threshold, measured on their intake rather than a sample you chose.',
          'Agree the measurement method before work starts, including who keys the ground truth and what happens to documents both parties consider unreadable. Most acceptance disputes we have seen were disagreements about measurement, not about the system.',
        ],
      },
      {
        heading: 'Say what happens after handover',
        body: [
          'Models drift because the world moves — vendors change templates, a new business unit joins with different paperwork, someone replaces the scanner. A project priced as though it ends at go-live is priced wrong, and the client discovers this six months later when accuracy has quietly slipped.',
          'Put a support arrangement in the original quote rather than as an afterthought: a monitoring dashboard, an agreed review cadence, and a retraining allowance. It is easier to sell as part of the plan than as a rescue.',
        ],
      },
    ],
    takeaways: [
      'Price a short, fixed assessment phase whose deliverable is a defensible estimate for the real project.',
      'Quote the surrounding system firmly; bound the model work separately with a target and a stopping rule.',
      'Accept on straight-through rate at an agreed error rate, measured on the client’s own intake.',
      'Include monitoring and retraining in the first quote, because drift is certain and rescue work is a harder sell.',
    ],
  },
  {
    slug: 'computer-vision-on-existing-cctv',
    title: 'Running computer vision on CCTV cameras you didn’t choose',
    excerpt:
      'Nobody replaces sixty cameras to try analytics. What it takes to get useful results from mixed, badly angled, years-old hardware.',
    category: 'Computer vision',
    date: '2025-11-27',
    readingMinutes: 6,
    tags: ['Computer vision', 'CCTV', 'Edge inference', 'Retail'],
    intro: [
      'Vision papers assume a camera you selected, mounted where you wanted it, at a resolution you specified. Retail analytics assumes none of that. The cameras are already there, they were installed for insurance rather than analysis, and replacing them across eight stores is not a conversation anyone wants to have.',
      'Everything then follows from working with what exists. That constraint is not a limitation on the project so much as the actual shape of it.',
    ],
    sections: [
      {
        heading: 'What "existing cameras" really means',
        body: [
          'In practice it means a mix. Some 1080p IP cameras from a recent refit, some 720p, and a few analogue units behind an encoder that introduces its own compression artefacts. Frame rates vary per stream and drop under load. Several cameras are mounted high in a corner for maximum coverage, which is the worst angle for counting people and a poor one for anything at shelf height.',
          'Lighting changes through the day in ways a fixed threshold cannot absorb: bright at the entrance in the morning, mixed under fluorescents by afternoon, and reflective off the floor near close. Any approach that needs consistent framing or consistent illumination is out before you start.',
        ],
      },
      {
        heading: 'Do the work on site',
        body: [
          'The instinct is to ship frames to a server and run inference centrally. The uplink at a typical retail store makes that impossible for more than a couple of streams, and running it anyway is how you discover the store’s card terminal shares that connection.',
          'Inference belongs on a small box in the back office, with only events leaving the premises. A zone count and an incident with a timestamp are a few hundred bytes; the video they came from is not. This also resolves most of the privacy conversation before it starts, because footage never leaves the site.',
        ],
      },
      {
        heading: 'Reason about zones, not frames',
        body: [
          'A detector that outputs bounding boxes gives an operations team nothing they can act on. What a store manager can act on is "the counter queue has been above four people for six minutes". Getting from one to the other means someone marks the regions that matter on a still from each camera — the entrance, an aisle, the billing counter — and the system reports at that level.',
          'This also makes a bad camera angle survivable. A camera too high to identify individuals reliably can still tell you how many people are inside a marked region and how long they stay, and that is most of the operational value.',
        ],
      },
      {
        heading: 'Set expectations per camera, not per system',
        body: [
          'Some cameras will support everything. Some will only support occupancy. Being explicit about which is which, at install, prevents the slow erosion of trust that happens when one badly angled camera produces nonsense and the client generalises from it.',
          'We write it down per stream: what this camera can report, and what it cannot. It is a short document and it has saved more difficult conversations than any accuracy improvement.',
        ],
      },
    ],
    takeaways: [
      'Assume mixed resolutions, compression artefacts, poor angles and shifting light; anything needing consistency will not survive.',
      'Run inference on site and send events, not video — store uplinks cannot carry the alternative and privacy gets easier.',
      'Zone-level reporting turns detections into something an operations team can act on.',
      'Record per-camera capability at install, so one weak angle does not discredit the whole system.',
    ],
  },
  {
    slug: 'measuring-document-extraction-accuracy',
    title: 'Field-level or document-level? How to measure extraction accuracy',
    excerpt:
      'The same pipeline can be 97% accurate or 68% accurate depending on how you count. Which denominator to use, and when each one lies.',
    category: 'Document AI',
    date: '2025-12-16',
    readingMinutes: 5,
    tags: ['Document AI', 'Evaluation', 'Metrics', 'OCR'],
    intro: [
      'A twenty-field invoice extracted with one wrong field is 95% accurate by field and 0% accurate by document. Both numbers describe the same run. Which one you quote changes the conversation entirely, and quoting the flattering one without saying which it is has soured more client relationships than genuine underperformance.',
      'The right answer depends on what happens downstream, and it is worth deciding before anyone builds a dashboard around it.',
    ],
    sections: [
      {
        heading: 'Field-level accuracy, and where it flatters',
        body: [
          'Counting per field is the fairer measure of the model itself. A page with nineteen correct values and one uncertain one is not a failure, it is one value for a person to confirm. It also lets you see which fields are hard, and the answer is usually consistent: totals and dates are easy, party names are middling, and anything hand-written or rubber-stamped is where the errors live.',
          'It flatters when fields are unevenly important. Getting the vendor address right and the invoice total wrong is not 50% success, it is a failed document. If you report field accuracy, weight it or at least report the critical fields separately.',
        ],
      },
      {
        heading: 'Document-level accuracy, and where it misleads',
        body: [
          'Counting whole documents as pass or fail matches what an operations team experiences: either this invoice needed a human or it did not. It is the number that maps to cost, so it is usually the one to put in a contract.',
          'It misleads in the other direction. A pipeline improving from three errors per document to one error per document shows no movement at all under a strict all-or-nothing measure, even though the review workload has fallen by two thirds. Teams have abandoned real improvements because the headline metric did not move.',
        ],
      },
      {
        heading: 'The measure that actually matters',
        body: [
          'For most production systems the useful metric is neither: it is straight-through rate at a bounded error rate. What share of documents completed with no human involvement, and of those, how many were wrong? That pairs the thing the client is buying with the risk they are accepting.',
          'It also makes the confidence threshold visible as the lever it is. Straight-through rate and error rate move against each other, and the right operating point is a business decision about what a mistake costs, not a technical one.',
        ],
      },
      {
        heading: 'Getting the denominator honest',
        body: [
          'Decide up front how to count a field that is genuinely absent from the document, because different rules produce very different totals. A missing purchase-order number correctly returned as empty should count as correct; counting it as a miss punishes the system for reading the page properly.',
          'Do the same for unreadable documents. If a page is too degraded for a human to key, it should sit in its own bucket rather than in the error rate. Agree this with the client while everyone is relaxed, not during acceptance testing.',
        ],
      },
    ],
    takeaways: [
      'Field-level flatters when fields differ in importance; document-level hides real progress.',
      'Straight-through rate at a bounded error rate is the metric that maps to what a client pays for.',
      'Report critical fields separately rather than folding them into an average.',
      'Write down how absent fields and unreadable pages are counted before measurement starts.',
    ],
  },
  {
    slug: 'prerender-react-spa-for-seo',
    title: 'Prerendering a React SPA for SEO without switching to Next.js',
    excerpt:
      'A Vite SPA serves crawlers an empty div. You can fix that in about a hundred lines without adopting a framework or a server.',
    category: 'Web & mobile',
    date: '2026-01-15',
    readingMinutes: 6,
    tags: ['React', 'SEO', 'Vite', 'Prerendering', 'Static hosting'],
    intro: [
      'The standard advice for a React site that needs to rank is to move to Next.js. Sometimes that is right. Often it is a framework migration to solve a problem that is really about what bytes the server sends before JavaScript runs.',
      'If your site is a marketing site with a known set of routes and no per-request personalisation, you can prerender it at build time and keep hosting it as static files. We do exactly this for our own site, and the whole mechanism is one build script.',
    ],
    sections: [
      {
        heading: 'What a crawler actually receives',
        body: [
          'Fetch your deployed page with curl and read the response. A default Vite build returns a document containing an empty root element and a script tag. Google will usually execute the JavaScript and eventually index the rendered result, but it queues rendering separately and can be slow to come back to it.',
          'Everything else is less forgiving. The LinkedIn and WhatsApp preview scrapers do not run JavaScript at all, so a shared link shows whatever static title and description happen to be in the template. Several LLM crawlers behave the same way. If your content only exists after hydration, for those clients it does not exist.',
        ],
      },
      {
        heading: 'Prerendering in one build step',
        body: [
          'The mechanism is small. Build the client as normal. Build a second SSR bundle that exports a render function. Then run a script that imports it, renders every known route to an HTML string, and writes each one into the built template at a placeholder such as an app-html comment.',
          'Write each route as its own index.html inside a matching directory, so /about becomes about/index.html. Static hosts serve that at a clean URL with no redirect, and the client-side router takes over on hydration exactly as before. Routing behaviour after the first paint is unchanged.',
        ],
      },
      {
        heading: 'Per-route metadata is the point',
        body: [
          'Prerendering the markup is only half of it. The same script should rewrite the title, description, canonical link and Open Graph tags per route, because a single shared title across every page is a bigger ranking problem than an empty root element.',
          'Keep that metadata in one module the app and the build script both import. When the two drift, you get pages whose visible heading and title tag disagree, which is exactly the sort of thing nobody notices for months.',
        ],
      },
      {
        heading: 'When this is the wrong answer',
        body: [
          'This works because the route list is known at build time and every visitor sees the same content. If you have user-specific pages, thousands of routes from a CMS, or content that changes between deploys, you want real server rendering or incremental generation, and a framework will do it better than a script you maintain.',
          'The honest test is whether your content changes more often than you deploy. If it does not, prerendering gives you the crawler behaviour of a server-rendered site while your hosting stays a bucket of files with nothing to operate.',
        ],
      },
    ],
    takeaways: [
      'Curl your own site: if the response body has an empty root element, non-JS crawlers see nothing.',
      'Prerender at build time by rendering each known route into the template and writing route/index.html.',
      'Rewrite title, description and canonical per route from a module the app and build script share.',
      'Prefer a framework once routes are dynamic or content changes between deploys.',
    ],
  },
  {
    slug: 'llm-eval-set-without-labelled-data',
    title: 'How to build an LLM eval set when you have no labelled data',
    excerpt:
      'You cannot improve what you cannot measure, and nobody hands you a labelled set. How to build a useful one in about a day.',
    category: 'LLM engineering',
    date: '2026-02-05',
    readingMinutes: 6,
    tags: ['LLM', 'Evaluation', 'Testing', 'Prompt engineering'],
    intro: [
      'Most LLM features are shipped on vibes. Someone tries a dozen prompts, the outputs look reasonable, and it goes out. Then a prompt changes, something degrades in a way nobody notices for three weeks, and there is no way to tell whether the new version is better or worse than the old one.',
      'The blocker is usually stated as a lack of labelled data. In practice you do not need a research-grade dataset. You need about sixty examples and a rule for judging them, and that is a day of work.',
    ],
    sections: [
      {
        heading: 'Start from failures, not from coverage',
        body: [
          'Do not try to sample representatively. Go and collect the cases where the current system already looks wrong: support threads, the Slack messages where someone pasted a bad output, your own notes from testing. Twenty real failures are worth more than two hundred cases that all pass.',
          'Add the awkward inputs everyone knows about and nobody writes down — the empty input, the input in the wrong language, the one with a table pasted into it, the customer who writes in all lowercase without punctuation. These are cheap to collect and they are where regressions land.',
        ],
      },
      {
        heading: 'Write the grading rule before the answers',
        body: [
          'For each case, write what a correct output must contain and what it must not. Not a model answer — a checkable rule. "Must state the refund window in days", "must not invent an order number", "must decline if the policy is not in the retrieved context".',
          'This is where most eval sets go wrong. A single reference answer forces you into fuzzy string similarity, which punishes valid rewordings and rewards nothing you care about. A short list of assertions per case is easier to write and far easier to trust.',
        ],
      },
      {
        heading: 'Grade with a model, but check the grader',
        body: [
          'Running assertions through a model as judge is fine and scales well. What is not fine is trusting it unverified. Hand-grade thirty cases yourself, run the judge on the same thirty, and measure agreement. Below roughly 90%, fix the rubric before you fix the system, because you are otherwise tuning against noise.',
          'Keep a handful of deliberately unanswerable cases where the correct behaviour is to decline. Models that have been tuned towards helpfulness will answer them anyway, and this is the fastest way to notice that a prompt change has made your system more confident and less correct.',
        ],
      },
      {
        heading: 'Make it cheap enough to run every time',
        body: [
          'An eval that takes an hour gets run before releases. An eval that takes ninety seconds gets run on every prompt change, which is when it is actually useful. Keep the set small, run it in parallel, and put the result somewhere visible.',
          'Then let it grow only from real incidents. Every time something goes wrong in production, the fix is not complete until that case is in the set. After six months of that discipline the eval set is a genuine description of your problem, and it cost you nothing to design.',
        ],
      },
    ],
    takeaways: [
      'Sixty adversarially chosen cases beat several hundred sampled ones.',
      'Write assertions about the output rather than a single reference answer.',
      'Validate the model-as-judge against your own grading before relying on it.',
      'Keep the run under two minutes, and grow the set from production incidents.',
    ],
  },
  {
    slug: 'what-breaks-in-production-ml',
    title: 'What actually breaks in a production ML system',
    excerpt:
      'It is almost never the model weights. Four failure modes we keep meeting, and the monitoring that catches each one.',
    category: 'Shipping AI',
    date: '2026-02-26',
    readingMinutes: 5,
    tags: ['MLOps', 'Monitoring', 'Production', 'Reliability'],
    intro: [
      'Teams shipping their first machine learning feature usually prepare for the model to degrade. They set up accuracy tracking, plan a retraining schedule, and wait for the slow decay they have read about.',
      'The decay is real but slow. What takes systems down in the first year is more mundane, and mostly happens outside the model entirely.',
    ],
    sections: [
      {
        heading: 'The input pipeline changes without telling you',
        body: [
          'Someone upgrades the scanner and the new default is 200 DPI instead of 300. A vendor switches invoicing software. An upstream service starts sending dates in a different format. The model is unchanged and its accuracy falls off a cliff, and because nothing was deployed, nobody thinks to look at a deploy.',
          'The monitoring that catches this is not accuracy monitoring, which is lagging and often needs labels you do not have in real time. Track the inputs: resolution distribution, file type mix, field presence rates, average text length. A step change in any of those is an alert, and it fires before the output quality problem reaches anyone.',
        ],
      },
      {
        heading: 'Confidence drifts before accuracy does',
        body: [
          'A useful early signal is the distribution of the model’s own confidence scores. If the share of predictions above your threshold moves several points in a week, something upstream has changed, whatever the accuracy figure says.',
          'This is cheap to track because it needs no ground truth. Plot the histogram weekly. In our experience it moves days before anyone notices a quality problem, which is usually enough time to find the cause before it becomes a complaint.',
        ],
      },
      {
        heading: 'The queue nobody is draining',
        body: [
          'Any human-in-the-loop system has a review queue, and queues fail quietly. The person who used to clear it changes role, volume rises after a new client is onboarded, or someone goes on leave. Documents pile up, the pipeline looks healthy on every technical dashboard, and the business outcome you promised silently stops happening.',
          'Monitor queue depth and the age of the oldest item, and alert on both. This is ordinary operational hygiene and it is the failure we have seen most often, because it does not look like a machine learning problem to anyone watching the machine learning.',
        ],
      },
      {
        heading: 'Nobody can explain a specific decision',
        body: [
          'Six months in, a client asks why one particular invoice was posted with the wrong total. If you cannot answer, the conversation shifts from a bug to a question about whether the system can be trusted at all, and that is a much harder position to recover from.',
          'Log the inputs, the model version, the confidence scores and the routing decision for every item, with a retention period you have agreed. Storage is cheap and the ability to reconstruct one decision from four months ago is worth more than most of the accuracy work you could do with the same effort.',
        ],
      },
    ],
    takeaways: [
      'Monitor input distributions, not just output accuracy — upstream changes need no deploy to break you.',
      'Confidence-score drift is a free leading indicator that requires no labels.',
      'Alert on review queue depth and oldest item; a stalled queue looks healthy on technical dashboards.',
      'Log inputs, model version and confidences per item so any single decision can be reconstructed later.',
    ],
  },
  {
    slug: 'parsing-indian-invoices',
    title: 'Parsing Indian invoices: GSTIN, HSN and the formats that break extraction',
    excerpt:
      'Extraction tools trained on US and European paperwork miss the fields that matter here. What is different, and what to validate.',
    category: 'Document AI',
    date: '2026-03-19',
    readingMinutes: 6,
    tags: ['Document AI', 'GST', 'India', 'OCR', 'Validation'],
    intro: [
      'Most off-the-shelf document extraction is tuned on invoices from the US and Europe. Point it at Indian paperwork and it will find the total and the date and then quietly ignore about a third of what the finance team needs, because those fields do not exist in the layouts it learned from.',
      'None of this is difficult once you know what you are looking at. It is just that nobody writes it down, so every team discovers it in the same order.',
    ],
    sections: [
      {
        heading: 'The fields that have no Western equivalent',
        body: [
          'A GST invoice carries a supplier GSTIN and usually a buyer GSTIN: fifteen characters, where the first two are the state code, the next ten are the PAN, and the last is a check digit. Line items carry an HSN or SAC code classifying the goods or service. Tax is split into CGST and SGST for a sale within a state, or a single IGST for a sale across states, and which one appears tells you something about the transaction that the addresses may not.',
          'A pipeline that treats tax as one number loses that. Worse, it will sometimes sum CGST and SGST into a single figure and reconcile correctly by accident, which hides the error until someone files a return against it.',
        ],
      },
      {
        heading: 'Validation you get for free',
        body: [
          'Several of these fields are self-checking, which is unusual and worth exploiting. GSTIN has a defined structure and a checksum, so a misread character is detectable without any reference data. The embedded PAN can be cross-checked against a PAN field elsewhere on the document. State code should agree with the address.',
          'This turns OCR ambiguity into a solved problem for the highest-value fields. The classic confusions — 0 against O, 5 against S, 1 against I — are exactly what a checksum catches. Run the validator, and where it fails, try the alternate reading rather than sending the field to a human.',
        ],
      },
      {
        heading: 'Layout habits that trip up region detection',
        body: [
          'Indian invoices frequently carry a rubber stamp and a signature over the lower third of the page, often across the totals block. Many include an "Amount in words" line, which is a useful independent check on the numeric total and is routinely ignored. Multi-page invoices repeat the header on each page, so a naive parser can create duplicate documents from one invoice.',
          'Bilingual layouts appear in several states, with Devanagari or a regional script alongside English. An OCR configuration restricted to Latin characters will not fail loudly on these; it will return partial text with no indication that anything was dropped.',
        ],
      },
      {
        heading: 'What to build first',
        body: [
          'Start with the checksum validators, before any model work. They cost an afternoon and they immediately lift accuracy on the fields with the most downstream consequence. Then add the arithmetic checks: line items summing to taxable value, tax computed at the stated rate, and the total matching the amount in words.',
          'Only once those are in place is it worth tuning extraction. Most of what looks like a model problem on Indian invoices turns out to be a missing validation rule, and rules are cheaper to write, easier to explain to a client, and do not need retraining when a vendor changes template.',
        ],
      },
    ],
    takeaways: [
      'Extract CGST, SGST and IGST separately; collapsing them into one tax figure hides real errors.',
      'GSTIN is checksummed and contains the PAN and state code — use it to auto-correct OCR ambiguity.',
      'Watch for stamps over the totals block, repeated headers on multi-page invoices, and bilingual layouts.',
      'Write the arithmetic and format validators before touching the model; most apparent model errors are missing rules.',
    ],
  },
  {
    slug: 'edge-or-cloud-video-analytics-cost',
    title: 'Edge or cloud for video analytics: what it actually costs',
    excerpt:
      'The cloud version looks cheaper until you price the bandwidth. A worked comparison for a small multi-site deployment.',
    category: 'Computer vision',
    date: '2026-04-09',
    readingMinutes: 6,
    tags: ['Computer vision', 'Edge inference', 'Architecture', 'Cost'],
    intro: [
      'The default instinct on a video analytics project is to send frames to the cloud. The tooling is better, deployment is a container rather than a site visit, and nobody has to think about hardware in a stockroom.',
      'Then you price the egress and the always-on GPU, and the picture inverts. Video is the one workload where the arithmetic reliably favours doing the work where the data is.',
    ],
    sections: [
      {
        heading: 'The bandwidth nobody budgets for',
        body: [
          'A single 1080p stream at a usable frame rate is on the order of 2 to 4 Mbps continuously. Eight cameras at one site is roughly 25 Mbps sustained, every hour the store is open. Most retail sites have an asymmetric connection with far less upstream than that, shared with the point-of-sale terminals.',
          'You can reduce it by sampling frames rather than streaming, and that is a legitimate design. But sampling at one frame every two seconds loses anything about movement or dwell time, which is usually most of what was being asked for.',
        ],
      },
      {
        heading: 'What the two architectures actually cost',
        body: [
          'Cloud puts the cost in recurring spend: a GPU instance that has to stay warm because the workload is continuous, plus egress, plus the connectivity upgrade at each site. It is small at one site and scales linearly with every site you add.',
          'Edge puts the cost up front. A small accelerated box per site is a one-off in the low hundreds of dollars, plus a site visit to install it and a modest ongoing cost for management and remote access. It is the more expensive first site and the cheaper tenth, and for most multi-site retail deployments the crossover arrives within the first year.',
        ],
      },
      {
        heading: 'The reasons that are not about money',
        body: [
          'Edge keeps footage on site, which turns the privacy conversation from a negotiation into a statement of fact. That matters more than the cost argument in most retail and workplace deployments, and it is often what actually decides the design.',
          'Edge also degrades better. When the connection drops — and at a retail site it will — an on-premise box keeps analysing and buffers its events. A cloud-dependent pipeline stops seeing anything, and the gap in the data is exactly during the incident somebody will later ask about.',
        ],
      },
      {
        heading: 'Where cloud still wins',
        body: [
          'Keep training, model management and reporting central. Nothing about running inference at the edge requires you to also operate models by hand at each site; the box should pull a signed model bundle and report its version, and everything else stays where the tooling is good.',
          'Cloud inference is also the right call for genuinely bursty or low-volume work — a few cameras, occasional analysis, or a proof of concept where you want an answer this week rather than a hardware order. The mistake is carrying that choice into a multi-site rollout without redoing the arithmetic.',
        ],
      },
    ],
    takeaways: [
      'One 1080p stream is 2–4 Mbps sustained; eight cameras will saturate a typical retail uplink.',
      'Cloud costs scale per site and never stop; edge is front-loaded and usually crosses over inside a year.',
      'Keeping footage on site resolves most privacy objections and survives connection loss.',
      'Run inference at the edge but keep training, model distribution and reporting central.',
    ],
  },
  {
    slug: 'react-native-or-native-small-team',
    title: 'Choosing between React Native and native for a small team',
    excerpt:
      'Cross-platform is not a compromise, and native is not a luxury. The four questions that actually decide it.',
    category: 'Web & mobile',
    date: '2026-04-30',
    readingMinutes: 5,
    tags: ['React Native', 'Mobile', 'Architecture', 'Product'],
    intro: [
      'The framework debate is usually argued on performance, which is the least useful axis for a small team. Modern React Native is fast enough for the overwhelming majority of applications, and a badly built native app is slower than a well built cross-platform one.',
      'The question that matters is how many people you have and what the app has to touch. Four things decide it, and none of them are frame rates.',
    ],
    sections: [
      {
        heading: 'How many engineers can you keep on it',
        body: [
          'Two native apps need people who know both platforms, or two people. For a team of three or four building a product that also has a backend and a web surface, that is the whole team on mobile and nothing left over.',
          'One shared codebase means one set of business logic, one release process, and one place a bug is fixed. This is the strongest argument for cross-platform and it is organisational rather than technical. It stops being decisive around the point you can staff a dedicated engineer per platform.',
        ],
      },
      {
        heading: 'What the app has to reach',
        body: [
          'Straightforward CRUD, lists, forms, camera capture, push notifications and maps are all well served by the cross-platform ecosystem. If that is your app, the platform question is close to settled.',
          'It changes if you depend on something at the edge of the platform: continuous background location, tight Bluetooth peripheral work, custom video pipelines, widgets and complex system extensions, or a hardware SDK that ships native-only. You can bridge to native from React Native, and that is a normal thing to do — but if you are writing bridges for the core of the product rather than the periphery, you have chosen the harder path to the same place.',
        ],
      },
      {
        heading: 'How much the interface should feel like the platform',
        body: [
          'A branded product surface — a booking flow, a dashboard, an ordering app — should look like itself on both platforms, and shared code gets you there faster with less drift.',
          'An app whose value comes from feeling native, or one leaning heavily on new platform UI conventions the moment they ship, is a poorer fit. You will spend the saved time reimplementing platform behaviour, and it will lag the real thing by a release or two.',
        ],
      },
      {
        heading: 'Who maintains it in two years',
        body: [
          'This is the question teams skip and later regret. Cross-platform means one upgrade treadmill instead of two, but it is a treadmill with more moving parts: the framework, the native toolchains underneath, and the third-party modules in between. A dependency that stops being maintained is a real risk and it is worth auditing before you adopt one.',
          'Native means two codebases to keep current, but each is upgrading against a single vendor with predictable release cycles and long deprecation windows. For a team that will be small indefinitely, one treadmill usually wins. For a team that expects to grow into platform specialists, the second option ages better.',
        ],
      },
    ],
    takeaways: [
      'Team size decides more than performance; below roughly one engineer per platform, shared code wins.',
      'Bridging to native at the periphery is normal — bridging for the core means you picked the wrong base.',
      'Branded interfaces suit cross-platform; apps whose value is platform feel do not.',
      'Audit third-party module maintenance before adopting, and ask who upgrades this in two years.',
    ],
  },
  {
    slug: 'fine-tuning-rag-or-prompting',
    title: 'Fine-tuning, RAG or prompting: choosing without wasting a quarter',
    excerpt:
      'Three techniques that solve different problems and get picked for the wrong reasons. A decision order that avoids the expensive mistake.',
    category: 'LLM engineering',
    date: '2026-05-21',
    readingMinutes: 6,
    tags: ['LLM', 'RAG', 'Fine-tuning', 'Architecture'],
    intro: [
      'Teams reach for fine-tuning when the model does not know something, which is the one problem fine-tuning is worst at. They reach for RAG when the model does not behave a particular way, which retrieval will not fix either.',
      'The two failures have a tell. If the model is missing facts, that is a knowledge problem. If it knows the facts and presents them wrongly, that is a behaviour problem. Different problems, different tools, and the expensive mistake is confusing them.',
    ],
    sections: [
      {
        heading: 'Prompting first, and further than feels respectable',
        body: [
          'A carefully structured prompt with three or four well-chosen examples gets further than most teams expect, and it is the only option you can change in a minute. Before concluding that prompting has run out, check the boring things: is the instruction ambiguous, are the examples actually representative, is the output format specified precisely enough to parse.',
          'The reason to exhaust this first is not cost, it is iteration speed. You will learn more about the shape of your problem in two days of prompt iteration than in two weeks of assembling a training set, and that understanding is what makes the next decision correct.',
        ],
      },
      {
        heading: 'RAG when the answer lives in your documents',
        body: [
          'Retrieval is the right tool when correctness depends on information the model was never trained on and that changes: your policies, your catalogue, this quarter’s pricing. It has the property fine-tuning lacks, which is that updating a document updates the system immediately, with no training run and no evaluation cycle.',
          'It also makes answers checkable. A retrieved passage can be cited, and a user can follow the citation. In any regulated or high-consequence setting that traceability is often the requirement, quite apart from accuracy.',
        ],
      },
      {
        heading: 'Fine-tuning for behaviour, format and cost',
        body: [
          'Fine-tuning teaches a model how to respond rather than what is true. It is the right tool for a consistent output structure that prompting keeps drifting away from, for a specialised tone, for a classification task with a fixed label set, and for compressing a long prompt into the weights so a smaller and cheaper model can do the job.',
          'It is the wrong tool for facts. Teaching a model your product catalogue by fine-tuning produces a system that is confidently out of date the moment the catalogue changes, with no way to tell which parts are stale. If the information has a shelf life, retrieve it.',
        ],
      },
      {
        heading: 'The order that avoids the wasted quarter',
        body: [
          'Work in this sequence: a strong prompt with examples, then retrieval if correctness depends on your own data, then fine-tuning if behaviour or unit cost is still wrong after both. Most projects stop at step two. The ones that reach step three arrive with a clear specification of what they need, which is what makes fine-tuning work when it works.',
          'Whatever you pick, build the eval set first. Without one you cannot tell whether fine-tuning helped, and a quarter spent on training runs you could not measure is the specific failure this ordering exists to prevent.',
        ],
      },
    ],
    takeaways: [
      'Missing facts is a knowledge problem; wrong presentation is a behaviour problem. Diagnose before choosing.',
      'Prompting first — its value is iteration speed, which teaches you what the real problem is.',
      'RAG for anything with a shelf life, because a document edit takes effect immediately and can be cited.',
      'Fine-tune for format, tone, classification or unit cost, never to install facts.',
    ],
  },
  {
    slug: 'human-in-the-loop-design',
    title: 'Human-in-the-loop design: deciding when to ask a person',
    excerpt:
      'Route too much to review and you have rebuilt the manual process. Route too little and people stop trusting the output. Where the line goes.',
    category: 'Shipping AI',
    date: '2026-06-18',
    readingMinutes: 5,
    tags: ['Human-in-the-loop', 'Product design', 'Automation', 'UX'],
    intro: [
      'Every automation project with real consequences ends up with a review step. The interesting design question is not whether to have one, it is what reaches it, and most teams decide that by accident — a threshold picked in week two and never revisited.',
      'It deserves more attention than that, because the threshold is where the accuracy of the model turns into the economics of the system.',
    ],
    sections: [
      {
        heading: 'The threshold is a business decision',
        body: [
          'Two numbers move against each other: the share of items handled automatically, and the error rate among them. Where you sit on that curve depends entirely on what a mistake costs. A wrong line item on an internal expense report is an annoyance. A wrong figure in a filed return is a different category of problem, and the same system should be tuned differently for each.',
          'Frame it that way with the client rather than presenting a single accuracy number. "At this setting, 78% clears automatically and roughly one in three hundred of those is wrong" is a decision someone can actually make. An accuracy percentage on its own is not.',
        ],
      },
      {
        heading: 'Ask for the smallest possible judgement',
        body: [
          'The most common design failure is escalating a whole item when only one part of it is uncertain. Showing a reviewer an entire document and asking them to check it re-creates the manual process the project was meant to remove, and reviewers behave accordingly: they skim, and skimming defeats the point.',
          'Escalate the field, not the page. Show the value, show the region of the source it came from, and let the person confirm or correct one thing. On our extraction work, highlighting the source region roughly halved the time per correction, and it was a change to the interface rather than the model.',
        ],
      },
      {
        heading: 'Design for the reviewer’s attention, not their diligence',
        body: [
          'A queue of items that are almost always correct trains people to approve without looking. This is not carelessness, it is a rational response to a low base rate, and no amount of instruction fixes it.',
          'Two things help. Order the queue by uncertainty so the genuinely doubtful cases are seen first, while attention is fresh. And keep the queue short enough to finish, because a queue that can never be cleared stops functioning as a task and becomes background noise.',
        ],
      },
      {
        heading: 'Corrections are the most valuable output',
        body: [
          'Every override is a labelled example produced by an expert, in context, for free. Systems that discard them are throwing away the best training data they will ever have, and this is a surprisingly common omission — the review interface writes the corrected value to the database and forgets what it replaced.',
          'Store the original prediction, the correction, the confidence and the rubric or rule involved. Corrections cluster, and the clusters point at specific weaknesses far more reliably than aggregate accuracy. That feedback loop is usually worth more than the next model upgrade.',
        ],
      },
    ],
    takeaways: [
      'Present the trade-off as straight-through rate against error rate and let the client choose the operating point.',
      'Escalate the uncertain field with its source region, never the whole document.',
      'Sort the queue by uncertainty and keep it clearable, because low base rates produce rubber-stamping.',
      'Persist the original prediction alongside every correction; it is your best labelled data.',
    ],
  },
  {
    slug: 'what-is-mcp-model-context-protocol',
    title: 'What is MCP, and when is it worth building a server?',
    excerpt:
      'Model Context Protocol in plain terms: what problem it solves, what it does not, and how to tell whether your team needs one.',
    category: 'MCP',
    date: '2026-07-16',
    readingMinutes: 6,
    tags: ['MCP', 'Model Context Protocol', 'LLM', 'Integrations', 'Tooling'],
    intro: [
      'Before MCP, connecting an assistant to your systems meant writing the integration again for every assistant. Your ticketing system needed one adapter for one product, a different one for the next, and a third for the internal tool someone built. The work was not hard, it was just repeated, and it multiplied with every new client application.',
      'Model Context Protocol is an open standard that collapses that. You describe your system once as an MCP server, and any client that speaks the protocol can use it.',
    ],
    sections: [
      {
        heading: 'What a server actually exposes',
        body: [
          'A server offers three kinds of thing. Tools are actions the model can invoke, each with a name, a description and a typed input schema — search tickets, create an order, run a query. Resources are data the client can read, addressed by URI, closer to files than to functions. Prompts are reusable templates a user can pick deliberately rather than the model choosing them.',
          'Most servers are mainly tools. Resources matter when the client should be able to pull context without the model deciding to, and prompts matter when you want to ship a known-good workflow rather than hoping the model assembles one.',
        ],
      },
      {
        heading: 'How it connects',
        body: [
          'Local servers run as a subprocess and talk over stdio, which is the simplest thing that works and needs no network or auth. This is how most developer tooling is deployed: the client launches your server, they exchange JSON-RPC over stdin and stdout, and everything stays on the machine.',
          'Remote servers run over HTTP and are what you want when several people share one deployment, when it holds credentials that should not sit on laptops, or when it must reach systems inside your network. That path brings real authentication and the operational obligations of any other service.',
        ],
      },
      {
        heading: 'When it is worth it',
        body: [
          'The case is strongest when more than one client will use the same capability, when the integration is genuinely reusable across tasks rather than serving a single feature, or when you want people to compose your system with others without you writing that combination.',
          'It is weaker when you are building one product with one model call against one API. Wrapping that in a protocol adds a layer and buys nothing. The value of MCP is in the many-to-many case, and if you only have one client and one server you are paying the abstraction cost without collecting the benefit.',
        ],
      },
      {
        heading: 'What it does not solve',
        body: [
          'MCP is a transport and a description format. It does not make a model good at using your tools. A server exposing forty vaguely named tools will produce worse results than five well described ones, because tool selection is a language problem and the descriptions are the prompt.',
          'It also does not decide your security posture. A tool that can delete records will be called eventually, by a model that misread the situation. Scope credentials narrowly, separate read from write, and require confirmation for anything destructive. The protocol will faithfully carry whatever authority you hand it.',
        ],
      },
    ],
    takeaways: [
      'MCP replaces per-client integrations with one server any compatible client can use.',
      'Servers expose tools (actions), resources (readable data) and prompts (templates); most are mainly tools.',
      'Use stdio for local single-user tooling and HTTP for shared or network-bound deployments.',
      'Build one when several clients or tasks reuse the capability — not for a single feature against a single API.',
    ],
  },
  {
    slug: 'building-an-mcp-server-lessons',
    title: 'Building an MCP server for internal tools: what we got wrong first',
    excerpt:
      'Our first server mirrored our REST API and the model used it badly. Five changes that made the difference.',
    category: 'MCP',
    date: '2026-08-20',
    readingMinutes: 6,
    tags: ['MCP', 'Model Context Protocol', 'Tooling', 'API design', 'LLM'],
    intro: [
      'Our first MCP server was a thin wrapper over an existing REST API. Every endpoint became a tool, the descriptions came from the OpenAPI summaries, and it took an afternoon. It worked in the sense that calls succeeded, and it was close to useless in practice — the model chained four calls to answer questions a person would have asked in one.',
      'The rewrite was mostly deletion. What follows is what changed.',
    ],
    sections: [
      {
        heading: 'Design tools around tasks, not endpoints',
        body: [
          'A REST API is decomposed for programmers who will read documentation and compose calls deliberately. A tool list is read once, quickly, by something deciding what to do next. Those are different audiences and they want different granularity.',
          'Our API had list-customers, get-customer, list-orders and get-order. The model needed "find this customer’s recent orders", which was four calls and a join it sometimes got wrong. Replacing them with one task-shaped tool removed the failure entirely. The rule we settled on: if answering a common question needs more than two calls, that is a missing tool.',
        ],
      },
      {
        heading: 'The description is the prompt',
        body: [
          'Tool descriptions inherited from an API summary are written for someone who already knows the domain. "Returns order objects filtered by status" tells a model nothing about when to reach for it.',
          'Write descriptions that say when to use the tool, what it returns, and when to prefer a different one. Name the units and the formats — that a date is ISO, that an amount is in paise, that the identifier is the internal one and not the invoice number. Every ambiguity you leave gets resolved by guessing.',
        ],
      },
      {
        heading: 'Return less than you think',
        body: [
          'Our first version returned full JSON objects because that is what the API returned. A twelve-order response filled a large part of the context window with keys nobody needed, and quality dropped for reasons that had nothing to do with the tool being wrong.',
          'Return the fields that answer the question, formatted compactly, with a pointer for fetching detail if it turns out to be needed. Paginate, and say in the response that more exists rather than silently truncating — a model that does not know it saw a partial list will happily state a total.',
        ],
      },
      {
        heading: 'Make errors instructions',
        body: [
          'A tool returning "400 Bad Request" gives the model nothing to act on, and it will usually retry the same call. An error that says which argument was invalid, what form was expected, and what a valid example looks like gets corrected on the next attempt.',
          'We treat error text as part of the interface now, and write it the way you would write a message to a colleague who cannot see your code. It is the cheapest reliability improvement we found.',
        ],
      },
      {
        heading: 'Separate reading from writing',
        body: [
          'Our first server exposed read and write tools under a single credential, which meant every session carried the authority to modify production data whether or not the task needed it.',
          'Now the read tools and the write tools are separate, with separate scopes, and anything destructive requires explicit confirmation rather than being callable directly. This has cost us nothing in capability. It is worth deciding before you need it, because the first time a model calls a delete tool on a misread instruction is a bad moment to be designing the policy.',
        ],
      },
    ],
    takeaways: [
      'Shape tools around the questions people ask, not the endpoints you already have.',
      'Write descriptions that say when to use a tool and name every unit and format explicitly.',
      'Return only the fields that answer the question, paginate, and state when a result is partial.',
      'Make error messages corrective, and split read from write with separate scopes.',
    ],
  },
]

/** Newest first — the order the index and the sitemap both want. */
export const postsByDate = [...posts].sort((a, b) => b.date.localeCompare(a.date))

export const findPost = (slug: string) => posts.find((p) => p.slug === slug)
