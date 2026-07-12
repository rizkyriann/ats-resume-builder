import { ResumeSchema, type Resume } from '@/types/resume'
import { StorageService, storageService, STORAGE_KEYS } from './StorageService'
import { migrate } from './migrations'

/** Result of parsing untrusted resume data (from storage or import). */
export type ParseResumeResult =
  | { ok: true; resume: Resume }
  | { ok: false; error: string }

/**
 * Validate + migrate arbitrary parsed JSON into a current, valid Resume.
 * Shared by localStorage load AND JSON import so there is exactly one
 * definition of "a valid resume" (Architecture §15, §16).
 *
 * Throws UnsupportedSchemaVersionError for newer-than-supported data so the
 * caller can distinguish that case from a plain shape mismatch.
 */
export function parseResume(raw: unknown): ParseResumeResult {
  if (raw === null || typeof raw !== 'object') {
    return { ok: false, error: 'File does not contain a resume object.' }
  }

  // Runs the version chain; may throw UnsupportedSchemaVersionError.
  const migrated = migrate(raw as Record<string, unknown>)

  const parsed = ResumeSchema.safeParse(migrated)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    const path = first?.path.join('.') || 'resume'
    return {
      ok: false,
      error: `Invalid resume data at "${path}": ${first?.message ?? 'unknown validation error'}`,
    }
  }
  return { ok: true, resume: parsed.data }
}

export class ResumeRepository {
  constructor(private readonly storage: StorageService = storageService) {}

  /**
   * Load the stored resume. Returns null when nothing is stored or the stored
   * data is unreadable/invalid (caller then initialises an empty resume).
   * Re-throws UnsupportedSchemaVersionError so the app can warn the user.
   */
  load(): Resume | null {
    const raw = this.storage.get<unknown>(STORAGE_KEYS.resume)
    if (raw === null) return null
    const result = parseResume(raw)
    return result.ok ? result.resume : null
  }

  /** Persist a resume (plain synchronous write; debouncing lives upstream). */
  save(resume: Resume): boolean {
    return this.storage.set(STORAGE_KEYS.resume, resume)
  }

  clear(): void {
    this.storage.remove(STORAGE_KEYS.resume)
  }
}

export const resumeRepository = new ResumeRepository()
