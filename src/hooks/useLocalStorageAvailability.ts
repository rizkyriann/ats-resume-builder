import { useState } from 'react'
import { safeLocalStorage } from '@/services/storage/StorageService'

/**
 * Feature-detects localStorage once at startup (Architecture §9). Exposes a
 * boolean the app uses to show a one-time "storage unavailable" warning.
 */
export function useLocalStorageAvailability(): boolean {
  const [available] = useState(() => safeLocalStorage() !== null)
  return available
}
