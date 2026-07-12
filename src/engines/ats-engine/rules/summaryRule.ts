import type { Rule } from './ruleTypes'
import { clamp01, wordCount } from './ruleTypes'

const MIN_WORDS = 25
const MAX_WORDS = 60

/**
 * Professional Summary (weight 10).
 * Present + within a healthy 25–60 word range scores full marks. Too short or
 * missing loses the most; excessively long loses a smaller amount.
 */
export const summaryRule: Rule = (resume) => {
  const summary = resume.summary.trim()
  const suggestions: string[] = []

  if (!summary) {
    return {
      ratio: 0,
      suggestions: [
        'Add a professional summary (2–3 sentences) — it is the first thing a recruiter reads.',
      ],
    }
  }

  const words = wordCount(summary)
  let ratio: number

  if (words < MIN_WORDS) {
    // Scale from 0.3 (very short) up toward 1.0 at MIN_WORDS.
    ratio = 0.3 + 0.7 * (words / MIN_WORDS)
    suggestions.push(
      `Your summary is ${words} words; aim for ${MIN_WORDS}–${MAX_WORDS} words to give recruiters enough context.`,
    )
  } else if (words <= MAX_WORDS) {
    ratio = 1
  } else {
    // Overlong: gentle penalty, floor at 0.75.
    ratio = Math.max(0.75, 1 - (words - MAX_WORDS) / 100)
    suggestions.push(
      `Your summary is ${words} words; tighten it toward ${MAX_WORDS} words so it stays scannable.`,
    )
  }

  return { ratio: clamp01(ratio), suggestions }
}
