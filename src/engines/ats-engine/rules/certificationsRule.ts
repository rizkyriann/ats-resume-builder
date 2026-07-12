import type { Rule } from './ruleTypes'
import { clamp01 } from './ruleTypes'

/**
 * Certifications (weight 5).
 * Optional category: present entries score bonus-style, but absence is only
 * lightly penalised since not everyone has certifications. A resume with no
 * certifications still receives a baseline so it is never zeroed out for a
 * legitimate reason.
 */
export const certificationsRule: Rule = (resume) => {
  const valid = resume.certifications.filter((c) => c.name.trim())
  if (valid.length === 0) {
    return {
      ratio: 0.5, // baseline — absence is not a real failure
      suggestions: [
        'If you hold any certifications or courses, add them — they can boost keyword matches.',
      ],
    }
  }
  // One well-formed certification reaches full marks.
  return { ratio: clamp01(Math.min(1, 0.6 + 0.4 * valid.length)), suggestions: [] }
}
