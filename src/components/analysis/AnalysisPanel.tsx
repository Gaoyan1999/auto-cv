import {
  AlertCircle,
  FileText,
  Inbox,
  RefreshCw,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import { useAppState } from '../../hooks/useAppState'

export function AnalysisPanel() {
  const { t } = useTranslation()
  const {
    analysis,
    analysisPhase,
    analysisError,
    runAnalysis,
    jd,
    setTab,
  } = useAppState()

  const showLoading = analysisPhase === 'running'
  const showError = analysisPhase === 'error'
  const showEmpty =
    analysisPhase === 'idle' && !analysis && !showLoading && !showError
  const showResults = Boolean(analysis && analysisPhase === 'done')

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 p-6 md:p-8">
      <div className="flex max-w-2xl flex-col gap-1 text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-accent)]">
          {t('analysis.step')}
        </p>
        <h1 className="text-[22px] font-semibold text-[var(--app-text)]">
          {t('analysis.heading')}
        </h1>
        <p className="text-sm leading-relaxed text-[var(--app-muted)]">
          {t('analysis.subtitle')}
        </p>
      </div>

      {showLoading ? (
        <div className="flex min-h-[320px] flex-1 flex-col items-center justify-center gap-5 rounded-[10px] border border-[var(--app-border)] bg-[var(--app-surface)] px-8 py-12 text-center shadow-sm">
          <RefreshCw
            className="h-8 w-8 animate-spin text-[var(--app-accent)]"
            aria-hidden
          />
          <p className="text-base font-medium text-[var(--app-text)]">
            {t('analysis.loadingTitle')}
          </p>
          <p className="max-w-md text-sm text-[var(--app-muted)]">
            {t('analysis.loadingBody')}
          </p>
          <p className="max-w-md text-sm text-[var(--app-faint)]">
            {t('analysis.loadingHint')}
          </p>
        </div>
      ) : null}

      {showError ? (
        <div
          className="flex flex-col items-center gap-4 rounded-[10px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-center shadow-sm"
          role="alert"
        >
          <AlertCircle className="h-6 w-6 text-[var(--app-muted)]" aria-hidden />
          <p className="text-sm font-semibold text-[var(--app-text)]">
            {t('analysis.errorTitle')}
          </p>
          <p className="max-w-md text-sm text-[var(--app-muted)]">
            {analysisError ?? t('analysis.errorBody')}
          </p>
          <Button variant="secondary" onClick={() => void runAnalysis()}>
            {t('analysis.retry')}
          </Button>
        </div>
      ) : null}

      {showEmpty ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-[10px] border border-[var(--app-border)] bg-[var(--app-surface)] p-8 text-center shadow-sm">
          <Inbox className="h-6 w-6 text-[var(--app-faint)]" aria-hidden />
          <p className="text-sm text-[var(--app-muted)]">{t('analysis.empty')}</p>
          <Button
            variant="primary"
            disabled={!jd.trim()}
            onClick={() => void runAnalysis()}
          >
            {t('analysis.run')}
          </Button>
        </div>
      ) : null}

      {showResults && analysis ? (
        <>
          <div className="flex flex-col gap-4 rounded-[10px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-left shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--app-text)]">
              {t('analysis.fitTitle')}
            </h2>
            <p className="text-sm leading-relaxed text-[var(--app-muted)]">
              {analysis.fitSummary}
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-[10px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-left shadow-sm">
            <h2 className="text-sm font-semibold text-[var(--app-text)]">
              {t('analysis.gapsTitle')}
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--app-muted)]">
              {analysis.gaps.map((g, i) => (
                <li key={`gap-${i}`}>{g}</li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-[10px] border border-[var(--app-border)] bg-[var(--app-surface)] text-left shadow-sm">
            <div className="border-b border-[var(--app-border)] px-4 py-3">
              <h2 className="text-sm font-semibold text-[var(--app-text)]">
                {t('analysis.traceTitle')}
              </h2>
            </div>
            {analysis.traceRows.length ? (
              <ul className="divide-y divide-[var(--app-border)]">
                {analysis.traceRows.map((row, i) => (
                  <li
                    key={`trace-${i}`}
                    className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-start md:justify-between"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-xs text-[var(--app-faint)]">
                        {t('analysis.traceJdLabel')}
                        {row.jdSnippet}
                      </p>
                      <p className="text-sm leading-relaxed text-[var(--app-muted)]">
                        {row.resumeNote}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-md bg-[var(--app-canvas)] px-2 py-1 text-xs font-medium text-[var(--app-muted)] md:mt-0">
                      {row.linkLabel}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-6 text-sm text-[var(--app-muted)]">
                {t('analysis.traceEmpty')}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-[var(--app-border)] pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-accent)]">
              {t('analysis.ctaKicker')}
            </p>
            <p className="text-sm text-[var(--app-muted)]">{t('analysis.ctaBody')}</p>
            <Button variant="primary" onClick={() => setTab('resume')}>
              <FileText className="h-5 w-5" aria-hidden />
              {t('analysis.ctaResume')}
            </Button>
            <p className="text-xs text-[var(--app-faint)]">{t('analysis.ctaHint')}</p>
          </div>
        </>
      ) : null}

      <p className="text-left text-xs leading-relaxed text-[var(--app-faint)]">
        {t('analysis.privacy')}
      </p>
    </div>
  )
}
