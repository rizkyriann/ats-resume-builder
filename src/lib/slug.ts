/**
 * Turn a full name into a safe download-filename slug.
 *
 * "Budi Santoso" -> "budi-santoso-resume"
 * ""             -> "resume"  (safe fallback, FR-4.4)
 */
export function slugifyResumeName(fullName: string, suffix = 'resume'): string {
  const base = fullName
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return base ? `${base}-${suffix}` : suffix
}
