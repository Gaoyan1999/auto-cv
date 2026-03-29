export type AppTab = 'resume' | 'analysis';

export interface AnalysisResult {
  fitSummary: string;
  gaps: string[];
  traceRows: {
    jdSnippet: string;
    resumeNote: string;
    linkLabel: string;
  }[];
}

export interface RewriteSuggestion {
  id: string;
  title: string;
  sectionHint: string;
  oldText: string;
  newText: string;
}

export type SuggestionStatus = 'pending' | 'accepted' | 'rejected';

/** @deprecated Legacy single-snapshot shape (v1 IndexedDB). */
export interface PersistedSnapshot {
  version: 1;
  resume: string;
  jd: string;
  analysis: AnalysisResult | null;
  suggestions: RewriteSuggestion[];
  suggestionStatus: Record<string, SuggestionStatus>;
}

export interface ResumeRecord {
  id: string;
  name: string;
  description: string;
  body: string;
  jd: string;
  analysis: AnalysisResult | null;
  suggestions: RewriteSuggestion[];
  suggestionStatus: Record<string, SuggestionStatus>;
  updatedAt: number;
}

export interface PersistedAppState {
  version: 2;
  resumes: ResumeRecord[];
}

export interface AppStateValue {
  /** IndexedDB hydration finished; avoid rendering list/workspace until true. */
  hydrated: boolean;
  resumes: ResumeRecord[];
  activeResumeId: string | null;
  tab: AppTab;
  setTab: (t: AppTab) => void;
  /** Current resume Markdown (active document only). */
  resume: string;
  setResume: (v: string | ((prev: string) => string)) => void;
  jd: string;
  setJd: (v: string | ((prev: string) => string)) => void;
  analysis: AnalysisResult | null;
  suggestions: RewriteSuggestion[];
  suggestionStatus: Record<string, SuggestionStatus>;
  analysisPhase: 'idle' | 'running' | 'done' | 'error';
  analysisError: string | null;
  runAnalysis: () => Promise<void>;
  acceptSuggestion: (id: string) => void;
  rejectSuggestion: (id: string) => void;
  acceptAllSuggestions: () => void;
  rejectAllSuggestions: () => void;
  pendingSuggestions: RewriteSuggestion[];
  openResume: (id: string, initialTab?: AppTab) => void;
  goToList: () => void;
  /** Creates a resume and returns its id (for routing to `/polish/:id/...`). */
  createResume: () => string;
  forkResume: (id: string) => void;
  deleteResume: (id: string) => void;
}
