import type { Rule } from './ruleTypes'
import { clamp01 } from './ruleTypes'

const RECOMMENDED_SKILLS = 6
const MIN_SKILLS = 3

/**
 * Skills (weight 10).
 * At least 3 skills expected; full marks around 6+. Deduping is handled
 * upstream in the store, so a simple count is meaningful here.
 */
export const skillsRule: Rule = (resume) => {
  const count = resume.skills.filter((s) => s.trim()).length
  const suggestions: string[] = []

  if (count === 0) {
    return {
      ratio: 0,
      suggestions: ['Add a Skills section — ATS keyword matching relies heavily on it.'],
    }
  }

  const ratio = Math.min(1, count / RECOMMENDED_SKILLS)

  if (count < MIN_SKILLS) {
    suggestions.push(
      `You have ${count} skill${count === 1 ? '' : 's'}; list at least ${MIN_SKILLS} (ideally ${RECOMMENDED_SKILLS}+) relevant skills.`,
    )
  } else if (count < RECOMMENDED_SKILLS) {
    suggestions.push(
      `Add a few more relevant skills (you have ${count}; ${RECOMMENDED_SKILLS}+ is ideal for keyword coverage).`,
    )
  }

  return { ratio: clamp01(ratio), suggestions }
}
