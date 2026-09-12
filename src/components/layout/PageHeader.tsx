import type { ReactNode } from 'react'
import { Container } from '@/components/primitives/Container'
import { Eyebrow } from '@/components/primitives/Eyebrow'

/**
 * Shared masthead for inner pages. Carries a quieter version of the
 * homepage's wash so the pages feel like one site rather than a template
 * with a coloured hero bolted on.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden pt-36 md:pt-44">
      {/* Same wash as the homepage hero. It was previously offset 224px up,
          which parked most of it behind the nav and left inner pages looking
          flat next to the homepage. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[720px]">
        <div className="absolute -top-20 -left-36 h-[520px] w-[700px] rounded-full bg-[#CDEFFB] opacity-55 blur-[130px]" />
        <div className="absolute top-4 right-[-10%] h-[560px] w-[720px] rounded-full bg-[#FDEECB] opacity-55 blur-[130px]" />
        <div className="absolute top-24 right-[12%] h-[380px] w-[440px] rounded-full bg-[#DAD2FB] opacity-50 blur-[120px]" />
      </div>

      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-display-l mt-6 max-w-[18ch] font-medium">{title}</h1>
        {lead ? (
          <p className="text-body-l text-ink-secondary mt-7 max-w-[58ch]">{lead}</p>
        ) : null}
        {children}
      </Container>
    </section>
  )
}
