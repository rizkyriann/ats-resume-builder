import { create } from 'zustand'

export type BuilderTab =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'certifications'

export interface UiStore {
  // Builder navigation
  activeTab: BuilderTab
  setActiveTab: (tab: BuilderTab) => void

  // Autosave indicator
  isSaving: boolean
  setIsSaving: (saving: boolean) => void

  // AI suggestion state (transient preview before Accept/Discard)
  aiSuggestion: string | null
  setAiSuggestion: (suggestion: string | null) => void

  // Dialog/modal states
  settingsOpen: boolean
  setSettingsOpen: (open: boolean) => void
  importDialogOpen: boolean
  setImportDialogOpen: (open: boolean) => void
}

export const useUiStore = create<UiStore>((set) => ({
  activeTab: 'personal',
  setActiveTab: (tab) => set({ activeTab: tab }),

  isSaving: false,
  setIsSaving: (saving) => set({ isSaving: saving }),

  aiSuggestion: null,
  setAiSuggestion: (suggestion) => set({ aiSuggestion: suggestion }),

  settingsOpen: false,
  setSettingsOpen: (open) => set({ settingsOpen: open }),

  importDialogOpen: false,
  setImportDialogOpen: (open) => set({ importDialogOpen: open }),
}))
