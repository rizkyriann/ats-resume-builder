/**
 * Shared date formatting used identically by the on-screen preview and the
 * PDF renderer (Architecture §8) so WYSIWYG parity is guaranteed.
 *
 * Input is an ISO "YYYY-MM" string. Output is "Jan 2023".
 */
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

export function formatMonthYear(iso: string | null | undefined): string {
  if (!iso) return ''
  const match = /^(\d{4})-(\d{2})$/.exec(iso.trim())
  if (!match) return iso
  const year = match[1]
  const monthIndex = Number(match[2]) - 1
  const month = MONTHS[monthIndex]
  if (!month) return iso
  return `${month} ${year}`
}

/**
 * Format a date range for an experience/education entry.
 * When `isCurrent` is true the end is rendered as "Present" (FR-1.4).
 */
export function formatDateRange(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  isCurrent: boolean,
): string {
  const start = formatMonthYear(startDate)
  const end = isCurrent ? 'Present' : formatMonthYear(endDate)
  if (start && end) return `${start} — ${end}`
  return start || end
}
