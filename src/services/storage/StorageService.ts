/**
 * Typed, defensive wrapper over `localStorage` (Architecture §10).
 *
 * Centralises try/catch around JSON parse/stringify and quota/availability
 * errors so no call site has to repeat that logic. Every method fails soft:
 * reads return `null`, writes return a boolean success flag.
 */
export class StorageService {
  private readonly backing: Storage | null

  constructor(backing: Storage | null = safeLocalStorage()) {
    this.backing = backing
  }

  /** Read + JSON.parse a value; returns null on any error or missing key. */
  get<T>(key: string): T | null {
    if (!this.backing) return null
    try {
      const raw = this.backing.getItem(key)
      if (raw === null) return null
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  }

  /** Read a value without parsing (raw string). */
  getRaw(key: string): string | null {
    if (!this.backing) return null
    try {
      return this.backing.getItem(key)
    } catch {
      return null
    }
  }

  /** JSON.stringify + write. Returns false on quota/serialization failure. */
  set<T>(key: string, value: T): boolean {
    if (!this.backing) return false
    try {
      this.backing.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  }

  remove(key: string): void {
    if (!this.backing) return
    try {
      this.backing.removeItem(key)
    } catch {
      /* ignore */
    }
  }

  /** Whether a usable backing store is present. */
  get available(): boolean {
    return this.backing !== null
  }
}

/** Feature-detect localStorage with a real test write (private-mode safe). */
export function safeLocalStorage(): Storage | null {
  try {
    if (typeof localStorage === 'undefined') return null
    const testKey = '__ats_rb_test__'
    localStorage.setItem(testKey, '1')
    localStorage.removeItem(testKey)
    return localStorage
  } catch {
    return null
  }
}

/** Default app-wide instance. */
export const storageService = new StorageService()

/** Namespaced, versioned storage keys (Architecture §16). */
export const STORAGE_KEYS = {
  resume: 'ats-resume-builder:resume:v1',
  settings: 'ats-resume-builder:settings:v1',
} as const
