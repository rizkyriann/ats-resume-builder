import { useResumeStore } from '@/store/resumeStore'
import { useUiStore } from '@/store/uiStore'
import { resumeRepository } from './resumeRepository'

const AUTOSAVE_DEBOUNCE_MS = 500

let autosaveTimer: ReturnType<typeof setTimeout> | null = null

/**
 * Subscribe to resume store changes and persist to localStorage with debouncing.
 * Architecture §3.4, §5 Data Flow.
 */
function scheduleAutosave() {
  useUiStore.getState().setIsSaving(true)

  if (autosaveTimer) clearTimeout(autosaveTimer)

  autosaveTimer = setTimeout(() => {
    const resume = useResumeStore.getState().resume
    try {
      resumeRepository.save(resume)
    } catch (err) {
      console.error('Autosave failed:', err)
    } finally {
      useUiStore.getState().setIsSaving(false)
      autosaveTimer = null
    }
  }, AUTOSAVE_DEBOUNCE_MS)
}

/**
 * Initialize autosave subscriber. Call this once at app startup.
 * Returns an unsubscribe function.
 */
export function initAutosave(): () => void {
  return useResumeStore.subscribe((state, prevState) => {
    if (state.resume !== prevState.resume) {
      scheduleAutosave()
    }
  })
}
