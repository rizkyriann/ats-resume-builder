import type { Rule } from './ruleTypes'
import { clamp01 } from './ruleTypes'

const MIN_DESC_CHARS = 40

/**
 * Work Experience (weight 20).
 * At least one entry; each entry should have company + position + dates and a
 * description with enough content. Score is the average per-entry completeness,
 * with a hard floor requirement of at least one entry.
 */
export const experienceRule: Rule = (resume) => {
  const entries = resume.experience
  const suggestions: string[] = []

  if (entries.length === 0) {
    return {
      ratio: 0,
      suggestions: ['Add at least one work experience entry — this is the core of an ATS resume.'],
    }
  }

  let sum = 0
  let missingDates = 0
  let thinDescriptions = 0

  for (const exp of entries) {
    let entryRatio = 0
    if (exp.company.trim()) entryRatio += 0.25
    if (exp.position.trim()) entryRatio += 0.25
    if (exp.startDate.trim() && (exp.isCurrent || (exp.endDate ?? '').trim())) {
      entryRatio += 0.2
    } else {
      missingDates++
    }
    if (exp.description.trim().length >= MIN_DESC_CHARS) {
      entryRatio += 0.3
    } else {
      thinDescriptions++
    }
    sum += entryRatio
  }

  const ratio = sum / entries.length

  if (missingDates > 0) {
    suggestions.push(
      'Add start/end dates to every experience entry — ATS parsers use them to build your timeline.',
    )
  }
  if (thinDescriptions > 0) {
    suggestions.push(
      'Expand your experience descriptions with specific, quantified bullet points (one per line).',
    )
  }

  return { ratio: clamp01(ratio), suggestions }
}
