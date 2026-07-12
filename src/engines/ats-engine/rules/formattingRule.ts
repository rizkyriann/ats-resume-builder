import type { Rule } from './ruleTypes'
import { clamp01 } from './ruleTypes'

/** Detect content that would confuse an ATS parser (HTML/script-like markup). */
const SUSPICIOUS = /<\/?[a-z][\s\S]*>|https?:\/\/\S*<|javascript:/i

/**
 * Formatting Rules (weight 5).
 * Mostly a safety net — the single template enforces ATS-safe structure by
 * construction, so this checks for content-level hazards that could slip in:
 * raw HTML/script-like text, and unparseable dates.
 */
export const formattingRule: Rule = (resume) => {
  const suggestions: string[] = []
  let ratio = 1

  const textFields = [
    resume.summary,
    ...resume.experience.map((e) => e.description),
    ...resume.education.map((e) => e.description),
  ]
  if (textFields.some((t) => SUSPICIOUS.test(t))) {
    ratio -= 0.5
    suggestions.push(
      'Remove any HTML tags or links embedded as markup from your text — use plain text so ATS parsers read it cleanly.',
    )
  }

  // Dates that are present but not in YYYY-MM form (defensive; schema guards
  // this, but imported/legacy data could differ).
  const badDate = [...resume.experience, ...resume.education].some((e) => {
    const s = e.startDate.trim()
    const end = (e.endDate ?? '').trim()
    const bad = (v: string) => v !== '' && !/^\d{4}-\d{2}$/.test(v)
    return bad(s) || (!e.isCurrent && bad(end))
  })
  if (badDate) {
    ratio -= 0.3
    suggestions.push('Ensure all dates use a valid month/year so ATS parsers can read your timeline.')
  }

  return { ratio: clamp01(ratio), suggestions }
}
