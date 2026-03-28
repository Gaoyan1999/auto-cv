export type AppTab = 'resume' | 'jd' | 'analysis'

export interface AnalysisResult {
  fitSummary: string
  gaps: string[]
  traceRows: {
    jdSnippet: string
    resumeNote: string
    linkLabel: string
  }[]
}

export interface RewriteSuggestion {
  id: string
  title: string
  sectionHint: string
  oldText: string
  newText: string
}

export type SuggestionStatus = 'pending' | 'accepted' | 'rejected'

export interface PersistedSnapshot {
  version: 1
  resume: string
  jd: string
  analysis: AnalysisResult | null
  suggestions: RewriteSuggestion[]
  suggestionStatus: Record<string, SuggestionStatus>
}

export interface AppStateValue {
  tab: AppTab
  setTab: (t: AppTab) => void
  resume: string
  setResume: (v: string) => void
  jd: string
  setJd: (v: string) => void
  analysis: AnalysisResult | null
  suggestions: RewriteSuggestion[]
  suggestionStatus: Record<string, SuggestionStatus>
  analysisPhase: 'idle' | 'running' | 'done' | 'error'
  analysisError: string | null
  runAnalysis: () => Promise<void>
  acceptSuggestion: (id: string) => void
  rejectSuggestion: (id: string) => void
  acceptAllSuggestions: () => void
  rejectAllSuggestions: () => void
  pendingSuggestions: RewriteSuggestion[]
}
