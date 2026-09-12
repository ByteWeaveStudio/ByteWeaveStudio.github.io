export type MetricItem = {
  value: number
  decimals?: number
  suffix: string
  label: string
}

/**
 * VERIFIED. All four confirmed real by the owner on 2026-08-04
 * (Website/PRODUCT.md → "Evidence on Hand").
 * Do not add to this list without the same level of confirmation.
 */
export const metrics: MetricItem[] = [
  { value: 40, suffix: '+', label: 'Projects delivered' },
  { value: 5, suffix: '+', label: 'Years building software' },
  { value: 2, suffix: 'M+', label: 'Data points processed' },
  { value: 99.9, decimals: 1, suffix: '%', label: 'Document extraction accuracy' },
]
