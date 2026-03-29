import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppStateContext } from './app-state-context';
import { DEFAULT_RESUME } from '../constants/defaultResume';
import { loadAppState, saveAppState } from '../lib/db';
import i18n from '../i18n';
import { runAnalysisJob } from '../lib/analyze';
import type {
  AppStateValue,
  AppTab,
  PersistedAppState,
  ResumeRecord,
  RewriteSuggestion,
  SuggestionStatus,
} from '../types/app';

type AnalysisPhase = 'idle' | 'running' | 'done' | 'error';

function applySuggestionToResume(
  resume: string,
  oldText: string,
  newText: string
): string {
  if (!resume.includes(oldText)) {
    return resume;
  }
  return resume.replace(oldText, newText);
}

function applyAllInOrder(resume: string, list: RewriteSuggestion[]): string {
  let r = resume;
  const sorted = [...list].sort(
    (a, b) => r.indexOf(b.oldText) - r.indexOf(a.oldText)
  );
  for (const s of sorted) {
    r = applySuggestionToResume(r, s.oldText, s.newText);
  }
  return r;
}

function snapshotFromResumes(resumes: ResumeRecord[]): PersistedAppState {
  return { version: 2, resumes };
}

function newResumeRecord(): ResumeRecord {
  const id = crypto.randomUUID();
  const day = new Date().toISOString().slice(0, 10);
  return {
    id,
    name: `resume-${day}.md`,
    description: '',
    body: DEFAULT_RESUME,
    jd: '',
    analysis: null,
    suggestions: [],
    suggestionStatus: {},
    updatedAt: Date.now(),
  };
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [tab, setTab] = useState<AppTab>('resume');
  const [analysisPhase, setAnalysisPhase] = useState<AnalysisPhase>('idle');
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRef = useRef<RewriteSuggestion[]>([]);
  const resumesRef = useRef<ResumeRecord[]>([]);

  const activeResume = useMemo(
    () =>
      activeResumeId ? resumes.find((r) => r.id === activeResumeId) : undefined,
    [resumes, activeResumeId]
  );

  const resume = activeResume?.body ?? '';
  const jd = activeResume?.jd ?? '';
  const analysis = activeResume?.analysis ?? null;
  const suggestions = useMemo(
    () => activeResume?.suggestions ?? [],
    [activeResume]
  );
  const suggestionStatus = useMemo(
    () => activeResume?.suggestionStatus ?? {},
    [activeResume]
  );

  useEffect(() => {
    suggestionsRef.current = suggestions;
  }, [suggestions]);

  useEffect(() => {
    resumesRef.current = resumes;
  }, [resumes]);

  useEffect(() => {
    void (async () => {
      const state = await loadAppState();
      setResumes(state.resumes);
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }
    saveTimer.current = setTimeout(() => {
      void saveAppState(snapshotFromResumes(resumes));
    }, 450);
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [hydrated, resumes]);

  const setResume = useCallback(
    (next: string | ((prev: string) => string)) => {
      if (!activeResumeId) {
        return;
      }
      setResumes((prev) =>
        prev.map((r) => {
          if (r.id !== activeResumeId) {
            return r;
          }
          const body = typeof next === 'function' ? next(r.body) : next;
          return { ...r, body, updatedAt: Date.now() };
        })
      );
    },
    [activeResumeId]
  );

  const setJd = useCallback(
    (next: string | ((prev: string) => string)) => {
      if (!activeResumeId) {
        return;
      }
      setResumes((prev) =>
        prev.map((r) => {
          if (r.id !== activeResumeId) {
            return r;
          }
          const jdNext = typeof next === 'function' ? next(r.jd) : next;
          return { ...r, jd: jdNext, updatedAt: Date.now() };
        })
      );
    },
    [activeResumeId]
  );

  const runAnalysis = useCallback(async () => {
    const id = activeResumeId;
    if (!id) {
      return;
    }
    const r = resumesRef.current.find((x) => x.id === id);
    if (!r) {
      return;
    }
    setAnalysisPhase('running');
    setAnalysisError(null);
    try {
      const { result, suggestions: next } = await runAnalysisJob(r.body, r.jd);
      setResumes((prev) =>
        prev.map((x) =>
          x.id === id
            ? {
                ...x,
                analysis: result,
                suggestions: next,
                suggestionStatus: Object.fromEntries(
                  next.map((s) => [s.id, 'pending' as SuggestionStatus])
                ),
                updatedAt: Date.now(),
              }
            : x
        )
      );
      setAnalysisPhase('done');
      setTab('analysis');
    } catch (e) {
      setAnalysisPhase('error');
      setAnalysisError(e instanceof Error ? e.message : 'Unknown error');
    }
  }, [activeResumeId]);

  const acceptSuggestion = useCallback(
    (id: string) => {
      if (!activeResumeId) {
        return;
      }
      setResumes((prev) => {
        const r = prev.find((x) => x.id === activeResumeId);
        if (!r) {
          return prev;
        }
        const s = r.suggestions.find((x) => x.id === id);
        if (!s) {
          return prev;
        }
        const body = applySuggestionToResume(r.body, s.oldText, s.newText);
        return prev.map((x) =>
          x.id === activeResumeId
            ? {
                ...x,
                body,
                suggestionStatus: { ...x.suggestionStatus, [id]: 'accepted' },
                updatedAt: Date.now(),
              }
            : x
        );
      });
    },
    [activeResumeId]
  );

  const rejectSuggestion = useCallback(
    (id: string) => {
      if (!activeResumeId) {
        return;
      }
      setResumes((prev) =>
        prev.map((x) =>
          x.id === activeResumeId
            ? {
                ...x,
                suggestionStatus: { ...x.suggestionStatus, [id]: 'rejected' },
                updatedAt: Date.now(),
              }
            : x
        )
      );
    },
    [activeResumeId]
  );

  const pendingSuggestions = useMemo(() => {
    if (!activeResume) {
      return [];
    }
    return activeResume.suggestions.filter(
      (s) => activeResume.suggestionStatus[s.id] === 'pending'
    );
  }, [activeResume]);

  const acceptAllSuggestions = useCallback(() => {
    if (!activeResumeId || !activeResume) {
      return;
    }
    const pending = activeResume.suggestions.filter(
      (s) => activeResume.suggestionStatus[s.id] === 'pending'
    );
    if (!pending.length) {
      return;
    }
    const body = applyAllInOrder(activeResume.body, pending);
    setResumes((prev) =>
      prev.map((x) => {
        if (x.id !== activeResumeId) {
          return x;
        }
        const nextStatus = { ...x.suggestionStatus };
        for (const s of pending) {
          nextStatus[s.id] = 'accepted';
        }
        return {
          ...x,
          body,
          suggestionStatus: nextStatus,
          updatedAt: Date.now(),
        };
      })
    );
  }, [activeResume, activeResumeId]);

  const rejectAllSuggestions = useCallback(() => {
    if (!activeResumeId || !activeResume) {
      return;
    }
    setResumes((prev) =>
      prev.map((x) => {
        if (x.id !== activeResumeId) {
          return x;
        }
        const nextStatus = { ...x.suggestionStatus };
        for (const s of x.suggestions) {
          if (nextStatus[s.id] === 'pending') {
            nextStatus[s.id] = 'rejected';
          }
        }
        return { ...x, suggestionStatus: nextStatus, updatedAt: Date.now() };
      })
    );
  }, [activeResume, activeResumeId]);

  const openResume = useCallback((id: string) => {
    const r = resumesRef.current.find((x) => x.id === id);
    setActiveResumeId(id);
    setTab('resume');
    setAnalysisPhase(r?.analysis ? 'done' : 'idle');
    setAnalysisError(null);
  }, []);

  const goToList = useCallback(() => {
    setActiveResumeId(null);
  }, []);

  const createResume = useCallback(() => {
    const rec = newResumeRecord();
    setResumes((prev) => [...prev, rec]);
    setActiveResumeId(rec.id);
    setTab('resume');
    setAnalysisPhase('idle');
    setAnalysisError(null);
  }, []);

  const forkResume = useCallback((id: string) => {
    const source = resumesRef.current.find((r) => r.id === id);
    if (!source) {
      return;
    }
    const baseName = source.name.replace(/\.md$/i, '');
    const nameIn = window.prompt(
      i18n.t('list.forkNamePrompt'),
      `${baseName}-copy.md`
    );
    if (nameIn == null || !nameIn.trim()) {
      return;
    }
    const descIn = window.prompt(
      i18n.t('list.forkDescPrompt'),
      source.description
    );
    const desc = descIn ?? '';
    const copy: ResumeRecord = {
      ...source,
      id: crypto.randomUUID(),
      name: nameIn.trim(),
      description: desc.trim(),
      updatedAt: Date.now(),
    };
    setResumes((prev) => [...prev, copy]);
  }, []);

  const deleteResume = useCallback(
    (id: string) => {
      const r = resumesRef.current.find((x) => x.id === id);
      if (!r) {
        return;
      }
      if (!window.confirm(i18n.t('list.deleteConfirm', { name: r.name }))) {
        return;
      }
      setResumes((prev) => {
        const next = prev.filter((x) => x.id !== id);
        if (next.length === 0) {
          return [newResumeRecord()];
        }
        return next;
      });
      if (activeResumeId === id) {
        setActiveResumeId(null);
      }
    },
    [activeResumeId]
  );

  const value = useMemo<AppStateValue>(
    () => ({
      hydrated,
      resumes,
      activeResumeId,
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
      openResume,
      goToList,
      createResume,
      forkResume,
      deleteResume,
    }),
    [
      hydrated,
      resumes,
      activeResumeId,
      tab,
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
      openResume,
      goToList,
      createResume,
      forkResume,
      deleteResume,
    ]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
