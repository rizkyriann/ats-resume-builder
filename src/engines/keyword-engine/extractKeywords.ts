import { STOPWORDS } from './stopwords'
import { normalizeText, stem, stemPhrase } from './normalize'
import type { KeywordHit } from '@/types/keyword'

/** A raw extracted candidate before final weighting. */
interface Candidate {
  /** Display term (original-ish casing preserved from first occurrence). */
  term: string
  /** Stemmed comparison key. */
  key: string
  frequency: number
  /** Boost from appearing in a requirements/qualifications section. */
  inRequirements: boolean
}

const REQUIREMENT_MARKERS = [
  'requirement',
  'requirements',
  'qualification',
  'qualifications',
  'must have',
  'must-have',
  'responsibilities',
  'skills',
  'what you',
  'you have',
  'you will',
]

/** Is a single token a usable keyword atom (not a stopword / pure number)? */
function isUsableToken(token: string): boolean {
  if (token.length < 2) return false
  if (STOPWORDS.has(token)) return false
  if (/^\d+$/.test(token)) return false
  return true
}

/**
 * Determine which lines of the JD look like "requirements" sections so tokens
 * there get a small deterministic weight boost (Architecture §14).
 * Returns a set of line indices considered "requirements context".
 */
function requirementLineFlags(lines: string[]): boolean[] {
  const flags = new Array<boolean>(lines.length).fill(false)
  let active = false
  for (let i = 0; i < lines.length; i++) {
    const lower = (lines[i] ?? '').toLowerCase()
    const isHeader = REQUIREMENT_MARKERS.some((m) => lower.includes(m))
    if (isHeader) active = true
    // A blank line ends a section context.
    if (lower.trim() === '') active = false
    flags[i] = active || isHeader
  }
  return flags
}

/**
 * Extract weighted 1–3 word keyword candidates from a job description.
 * Deterministic: same input always yields the same ordered output.
 */
export function extractKeywords(jobDescription: string): KeywordHit[] {
  const lines = jobDescription.split(/\r?\n/)
  const reqFlags = requirementLineFlags(lines)
  const candidates = new Map<string, Candidate>()

  const bump = (rawPhrase: string, inReq: boolean) => {
    const normalized = normalizeText(rawPhrase)
    if (!normalized) return
    const key = stemPhrase(normalized)
    if (!key) return
    const existing = candidates.get(key)
    if (existing) {
      existing.frequency += 1
      existing.inRequirements = existing.inRequirements || inReq
    } else {
      candidates.set(key, {
        term: normalized,
        key,
        frequency: 1,
        inRequirements: inReq,
      })
    }
  }

  lines.forEach((line, idx) => {
    const inReq = reqFlags[idx] ?? false
    const tokens = normalizeText(line).split(' ').filter(Boolean)

    // Unigrams
    for (const tok of tokens) {
      if (isUsableToken(tok)) bump(tok, inReq)
    }
    // Bigrams & trigrams — only when neither boundary token is a stopword,
    // which keeps phrases meaningful ("machine learning", not "and the").
    for (let n = 2; n <= 3; n++) {
      for (let i = 0; i + n <= tokens.length; i++) {
        const slice = tokens.slice(i, i + n)
        const first = slice[0] ?? ''
        const last = slice[n - 1] ?? ''
        if (STOPWORDS.has(first) || STOPWORDS.has(last)) continue
        if (slice.some((t) => t.length < 2 || /^\d+$/.test(t))) continue
        bump(slice.join(' '), inReq)
      }
    }
  })

  const hits: KeywordHit[] = []
  for (const c of candidates.values()) {
    // Phrases (multi-word) are inherently more specific → base boost.
    const wordCount = c.key.split(' ').length
    const phraseBoost = wordCount >= 2 ? 1.6 : 1
    const reqBoost = c.inRequirements ? 1.4 : 1
    const weight = c.frequency * phraseBoost * reqBoost
    hits.push({ term: c.term, weight: Number(weight.toFixed(3)) })
  }

  // Sort by weight desc, then alphabetically for stable, deterministic order.
  hits.sort((a, b) => b.weight - a.weight || a.term.localeCompare(b.term))

  // Cap to a reasonable number of most-relevant keywords.
  return hits.slice(0, 40)
}

/** Expose the stemmed key of a hit term for matching. */
export function keyOf(term: string): string {
  return stemPhrase(term) || stem(normalizeText(term))
}
