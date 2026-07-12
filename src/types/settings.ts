import type { AIProviderConfig } from './ai'

export interface AppSettings {
  ai: AIProviderConfig
}

export function createDefaultSettings(): AppSettings {
  return {
    ai: { providerId: null },
  }
}
