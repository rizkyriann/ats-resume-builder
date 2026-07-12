import { create } from 'zustand'
import { type AppSettings, createDefaultSettings } from '@/types/settings'
import type { AIProviderConfig, AIProviderId } from '@/types/ai'
import { settingsRepository } from '@/services/storage/settingsRepository'

export interface SettingsStore {
  settings: AppSettings
  setAiProvider: (providerId: AIProviderId | null, config?: Partial<AIProviderConfig>) => void
  updateAiConfig: (patch: Partial<AIProviderConfig>) => void
  clearAiConfig: () => void
}

function persist(settings: AppSettings): void {
  settingsRepository.save(settings)
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: settingsRepository.load() ?? createDefaultSettings(),

  setAiProvider: (providerId, config) =>
    set((s) => {
      const next: AppSettings = {
        ...s.settings,
        ai: { ...s.settings.ai, ...config, providerId },
      }
      persist(next)
      return { settings: next }
    }),

  updateAiConfig: (patch) =>
    set((s) => {
      const next: AppSettings = { ...s.settings, ai: { ...s.settings.ai, ...patch } }
      persist(next)
      return { settings: next }
    }),

  clearAiConfig: () =>
    set(() => {
      const next = createDefaultSettings()
      persist(next)
      return { settings: next }
    }),
}))
