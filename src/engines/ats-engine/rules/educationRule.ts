import type { Rule } from './ruleTypes'
import { clamp01 } from './ruleTypes'

/**
 * Education (weight 10).
 * At least one entry; each should have institution + degree.
 */
export const educationRule: Rule = (resume) => {
  const entries = resume.education
  if (entries.length === 0) {
    return {
      ratio: 0,
      suggestions: ['Add at least one education entry (institution and degree).'],
    }
  }

  let sum = 0
  let incomplete = 0
  for (const edu of entries) {
    let entryRatio = 0
    if (edu.institution.trim()) entryRatio += 0.5
    if (edu.degree.trim()) entryRatio += 0.5
    if (entryRatio < 1) incomplete++
    sum += entryRatio
  }

  const suggestions: string[] = []
  if (incomplete > 0) {
    suggestions.push('Complete each education entry with both an institution and a degree.')
  }

  return { ratio: clamp01(sum / entries.length), suggestions }
}
