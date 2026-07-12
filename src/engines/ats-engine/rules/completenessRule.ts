import type { Rule } from './ruleTypes'
import { clamp01 } from './ruleTypes'

/**
 * Resume Completeness (weight 10).
 * Aggregate proportion of optional-but-recommended fields that are filled.
 */
export const completenessRule: Rule = (resume) => {
  const checks: Array<{ done: boolean; hint: string }> = [
    { done: !!resume.personalInfo.jobTitle.trim(), hint: 'Add a professional job title under your name.' },
    { done: !!resume.personalInfo.linkedin.trim(), hint: 'Add your LinkedIn URL.' },
    { done: !!resume.personalInfo.portfolio.trim(), hint: 'Add a portfolio or personal website URL.' },
    { done: !!resume.summary.trim(), hint: 'Write a professional summary.' },
    { done: resume.experience.length > 0, hint: 'Add work experience.' },
    { done: resume.education.length > 0, hint: 'Add education.' },
    { done: resume.skills.length >= 3, hint: 'List at least three skills.' },
    { done: resume.certifications.some((c) => c.name.trim()), hint: 'Add certifications if you have any.' },
  ]

  const done = checks.filter((c) => c.done).length
  const ratio = done / checks.length

  // Surface the first couple of unfilled recommendations.
  const suggestions = checks
    .filter((c) => !c.done)
    .slice(0, 2)
    .map((c) => c.hint)

  return { ratio: clamp01(ratio), suggestions }
}
