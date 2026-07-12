import type { Resume } from '@/types/resume'

/**
 * Every rule returns a normalized ratio in [0, 1] plus actionable suggestions
 * for any lost points. `index.ts` scales the ratio by the category weight.
 * Keeping rules weight-agnostic is what makes keyword-weight redistribution
 * (Architecture §13.2) trivial.
 */
export interface RuleOutput {
  ratio: number
  suggestions: string[]
}

export type Rule = (resume: Resume) => RuleOutput

/** Clamp a raw ratio into [0, 1]. */
export function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0
  return Math.max(0, Math.min(1, n))
}

/** Count words in a string (whitespace-separated, non-empty). */
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}
