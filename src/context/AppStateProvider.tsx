import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_RESUME } from '../constants/defaultResume'
import { AppStateContext } from './app-state-context'
import { runAnalysisJob } from '../lib/analyze'
import { loadSnapshot, saveSnapshot } from '../lib/db'
import type {
  AnalysisResult,
  AppStateValue,
  AppTab,
  PersistedSnapshot,
  RewriteSuggestion,
  SuggestionStatus,
} from '../types/app'

type AnalysisPhase = 'idle' | 'running' | 'done' | 'error'

function snapshotFromState(
  resume: string,
  jd: string,
  analysis: AnalysisResult | null,
  suggestions: RewriteSuggestion[],
  suggestionStatus: Record<string, SuggestionStatus>,
): PersistedSnapshot {
  return {
    version: 1,
    resume,
    jd,
    analysis,
    suggestions,
    suggestionStatus,
  }
}

function applySuggestionToResume(
  resume: string,
  oldText: string,
  newText: string,
): string {
  if (!resume.includes(oldText)) {
    return resume
  }
  return resume.replace(oldText, newText)
}

function applyAllInOrder(resume: string, list: RewriteSuggestion[]): string {
  let r = resume
  const sorted = [...list].sort(
    (a, b) => r.indexOf(b.oldText) - r.indexOf(a.oldText),
  )
  for (const s of sorted) {
    r = applySuggestionToResume(r, s.oldText, s.newText)
  }
  return r
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<AppTab>('resume')
  const [resume, setResume] = useState(DEFAULT_RESUME)
  const [jd, setJd] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [suggestions, setSuggestions] = useState<RewriteSuggestion[]>([])
  const [suggestionStatus, setSuggestionStatus] = useState<
    Record<string, SuggestionStatus>
  >({})
  const [analysisPhase, setAnalysisPhase] = useState<AnalysisPhase>('idle')
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suggestionsRef = useRef(suggestions)

  useEffect(() => {
    suggestionsRef.current = suggestions
  }, [suggestions])

  useEffect(() => {
    void (async () => {
      const snap = await loadSnapshot()
      if (snap) {
        setResume(snap.resume ?? DEFAULT_RESUME)
        setJd(snap.jd ?? '')
        setAnalysis(snap.analysis)
        setSuggestions(snap.suggestions ?? [])
        setSuggestionStatus(snap.suggestionStatus ?? {})
        if (snap.analysis) {
          setAnalysisPhase('done')
        }
      }
      setHydrated(true)
    })()
  }, [])

  useEffect(() => {
    if (!hydrated) {
      return
    }
    if (saveTimer.current) {
      clearTimeout(saveTimer.current)
    }
    saveTimer.current = setTimeout(() => {
      void saveSnapshot(
        snapshotFromState(resume, jd, analysis, suggestions, suggestionStatus),
      )
    }, 450)
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current)
      }
    }
  }, [hydrated, resume, jd, analysis, suggestions, suggestionStatus])

  const runAnalysis = useCallback(async () => {
    setAnalysisPhase('running')
    setAnalysisError(null)
    try {
      const { result, suggestions: next } = await runAnalysisJob(resume, jd)
      setAnalysis(result)
      setSuggestions(next)
      const nextStatus: Record<string, SuggestionStatus> = {}
      for (const s of next) {
        nextStatus[s.id] = 'pending'
      }
      setSuggestionStatus(nextStatus)
      setAnalysisPhase('done')
      setTab('analysis')
    } catch (e) {
      setAnalysisPhase('error')
      setAnalysisError(e instanceof Error ? e.message : 'Unknown error')
    }
  }, [resume, jd])

  const acceptSuggestion = useCallback((id: string) => {
    const s = suggestionsRef.current.find((x) => x.id === id)
    if (!s) {
      return
    }
    setResume((r) => applySuggestionToResume(r, s.oldText, s.newText))
    setSuggestionStatus((st) => ({ ...st, [id]: 'accepted' }))
  }, [])

  const rejectSuggestion = useCallback((id: string) => {
    setSuggestionStatus((st) => ({ ...st, [id]: 'rejected' }))
  }, [])

  const pendingSuggestions = useMemo(() => {
    return suggestions.filter((s) => suggestionStatus[s.id] === 'pending')
  }, [suggestions, suggestionStatus])

  const acceptAllSuggestions = useCallback(() => {
    const pending = suggestions.filter((s) => suggestionStatus[s.id] === 'pending')
    if (!pending.length) {
      return
    }
    setResume((r) => applyAllInOrder(r, pending))
    setSuggestionStatus((st) => {
      const next = { ...st }
      for (const s of pending) {
        next[s.id] = 'accepted'
      }
      return next
    })
  }, [suggestions, suggestionStatus])

  const rejectAllSuggestions = useCallback(() => {
    setSuggestionStatus((st) => {
      const next = { ...st }
      for (const s of suggestions) {
        if (next[s.id] === 'pending') {
          next[s.id] = 'rejected'
        }
      }
      return next
    })
  }, [suggestions])

  const value = useMemo<AppStateValue>(
    () => ({
      tab,
      setTab,
      resume,
      setResume,
      jd,
      setJd,
      analysis,
      suggestions,
      suggestionStatus,
      analysisPhase,
      analysisError,
      runAnalysis,
      acceptSuggestion,
      rejectSuggestion,
      acceptAllSuggestions,
      rejectAllSuggestions,
      pendingSuggestions,
    }),
    [
      tab,
      resume,
      jd,
      analysis,
      suggestions,
      suggestionStatus,
      analysisPhase,
      analysisError,
      runAnalysis,
      acceptSuggestion,
      rejectSuggestion,
      acceptAllSuggestions,
      rejectAllSuggestions,
      pendingSuggestions,
    ],
  )

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  )
}
