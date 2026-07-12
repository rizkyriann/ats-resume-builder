export type AIProviderId = 'openai' | 'gemini' | 'claude' | 'deepseek'

export interface AIProviderConfig {
  providerId: AIProviderId | null
  apiKey?: string
  model?: string
}

export interface AIImproveSummaryRequest {
  currentSummary: string
  jobTitle?: string
  topSkills?: string[]
}

export interface AIImproveSummaryResponse {
  suggestion: string
}

/** Normalized, user-facing error categories (Architecture §19). */
export type AIErrorKind = 'notConfigured' | 'auth' | 'rateLimit' | 'network' | 'unknown'

export class AIProviderError extends Error {
  readonly kind: AIErrorKind
  constructor(kind: AIErrorKind, message: string) {
    super(message)
    this.name = 'AIProviderError'
    this.kind = kind
  }
}

export class AIProviderNotConfiguredError extends AIProviderError {
  constructor(message = 'No AI provider is configured.') {
    super('notConfigured', message)
    this.name = 'AIProviderNotConfiguredError'
  }
}
