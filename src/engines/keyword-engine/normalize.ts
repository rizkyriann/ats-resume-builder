/**
 * Text normalization shared by BOTH the job-description side and the resume
 * side so keyword comparison is apples-to-apples (Architecture §8, §14).
 */

/** Lowercase, strip diacritics, collapse punctuation to spaces. */
export function normalizeText(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ') // keep +/#/./- so "c++", "c#", ".net", "ci-cd" survive
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Light suffix stemmer — no external NLP dependency (Architecture §8).
 * Deterministic and intentionally simple: folds common plural/verb endings so
 * "developing"/"developed" share a stem with "develop".
 */
export function stem(word: string): string {
  let w = word
  if (w.length <= 3) return w

  const rules: Array<[RegExp, string]> = [
    [/ies$/, 'y'],
    [/sses$/, 'ss'],
    [/ments$/, 'ment'],
    [/ing$/, ''],
    [/edly$/, ''],
    [/ed$/, ''],
    [/ers$/, 'er'],
    [/ications$/, 'ication'],
    [/s$/, ''],
  ]

  for (const [pattern, replacement] of rules) {
    if (pattern.test(w)) {
      const next = w.replace(pattern, replacement)
      if (next.length >= 3) {
        w = next
        break // apply at most one suffix rule
      }
    }
  }
  return w
}

/** Tokenize normalized text into individual words. */
export function tokenize(input: string): string[] {
  const normalized = normalizeText(input)
  if (!normalized) return []
  return normalized.split(' ').filter(Boolean)
}

/** Normalize + stem a phrase (space-joined) for comparison keys. */
export function stemPhrase(phrase: string): string {
  return tokenize(phrase).map(stem).join(' ')
}
