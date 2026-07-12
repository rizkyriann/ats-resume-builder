import { type AppSettings, createDefaultSettings } from '@/types/settings'
import type { AIProviderId } from '@/types/ai'
import { StorageService, storageService, STORAGE_KEYS } from './StorageService'

/**
 * Persists AppSettings (incl. AI provider config) under its OWN storage key,
 * separate from resume data, so clearing/exporting resume never touches AI
 * credentials and vice versa (Architecture §10).
 */
export class SettingsRepository {
  constructor(private readonly storage: StorageService = storageService) {}

  load(): AppSettings {
    const raw = this.storage.get<Partial<AppSettings>>(STORAGE_KEYS.settings)
    if (!raw || typeof raw !== 'object') return createDefaultSettings()

    const providerId = raw.ai?.providerId
    const validProviders: readonly (AIProviderId | null)[] = [
      'openai',
      'gemini',
      'claude',
      'deepseek',
      null,
    ]
    return {
      ai: {
        providerId: validProviders.includes(providerId ?? null)
          ? (providerId ?? null)
          : null,
        apiKey: typeof raw.ai?.apiKey === 'string' ? raw.ai.apiKey : undefined,
        model: typeof raw.ai?.model === 'string' ? raw.ai.model : undefined,
      },
    }
  }

  save(settings: AppSettings): boolean {
    return this.storage.set(STORAGE_KEYS.settings, settings)
  }

  clear(): void {
    this.storage.remove(STORAGE_KEYS.settings)
  }
}

export const settingsRepository = new SettingsRepository()
