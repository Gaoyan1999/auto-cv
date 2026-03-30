import {
  AlertCircle,
  ChevronLeft,
  Eye,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppNavigate } from '../../routes/useAppNavigate';
import { assessJobDescription } from '../../lib/jdValidation';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useAppState } from '../../hooks/useAppState';
import {
  AnalysisFlowStepper,
  type AnalysisFlowMode,
} from './AnalysisFlowStepper';

export function AnalysisPanel() {
  const { t } = useTranslation();
  const { goToPolish } = useAppNavigate();
  const {
    activeResumeId,
    analysis,
    analysisPhase,
    analysisError,
    runAnalysis,
    backToJdStep,
    jd,
    setJd,
  } = useAppState();
  const [jdPreviewOpen, setJdPreviewOpen] = useState(false);

  const showLoading = analysisPhase === 'running';
  const showError = analysisPhase === 'error';
  const showResults = Boolean(analysis && analysisPhase === 'done');
  const showJdForm = !showLoading && !showResults;

  const flowMode: AnalysisFlowMode =
    showLoading || showResults || showError ? 'analysis' : 'jd';

  const { hint } = assessJobDescription(jd);
  const hintText =
    hint === 'empty'
      ? t('jd.hint.empty')
      : hint === 'too_short'
        ? t('jd.hint.tooShort')
        : hint === 'low_signal'
          ? t('jd.hint.lowSignal')
          : null;

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJd(text);
    } catch {
      /* user denied or unavailable */
    }
  };

  const showAnalysisToolbar = analysisPhase !== 'idle';

  const handleToolbarBack = () => {
    backToJdStep();
  };

  const flowHint = showLoading
    ? t('analysis.flow.hintLoading')
    : showResults
      ? t('analysis.flow.hintResults')
      : showError
        ? t('analysis.flow.hintError')
        : t('analysis.flow.hintJd');

  return (
    <div className="flex min-h-0 flex-1 flex-col p-6 md:p-8">
      <ConfirmDialog
        open={jdPreviewOpen}
        onClose={() => setJdPreviewOpen(false)}
        title={t('analysis.jdPreviewTitle')}
        size="lg"
        cancelLabel={t('analysis.jdPreviewCancel')}
        confirmLabel={t('analysis.jdPreviewDone')}
        closeAriaLabel={t('analysis.jdPreviewClose')}
        content={
          jd.trim() ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--app-muted)]">
              {jd}
            </p>
          ) : (
            <p className="text-sm text-[var(--app-faint)]">
              {t('analysis.jdPreviewEmpty')}
            </p>
          )
        }
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {showAnalysisToolbar ? (
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <Button
              variant="secondary"
              disabled={showLoading}
              onClick={handleToolbarBack}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              {t('analysis.backRegenerate')}
            </Button>
            <Button
              variant="secondary"
              disabled={showLoading}
              onClick={() => setJdPreviewOpen(true)}
            >
              <Eye className="h-4 w-4" aria-hidden />
              {t('analysis.previewJd')}
            </Button>
          </div>
        ) : null}

        <div className="flex w-full flex-col gap-3">
          <AnalysisFlowStepper mode={flowMode} />
          <p className="text-left text-xs leading-relaxed text-[var(--app-faint)]">
            {flowHint}
          </p>
        </div>

        {showError ? (
          <div
            className="flex w-full flex-col items-center gap-4 rounded-[10px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-center shadow-sm"
            role="alert"
          >
            <AlertCircle
              className="h-6 w-6 text-[var(--app-muted)]"
              aria-hidden
            />
            <p className="text-sm font-semibold text-[var(--app-text)]">
              {t('analysis.errorTitle')}
            </p>
            <p className="max-w-md text-sm text-[var(--app-muted)]">
              {analysisError ?? t('analysis.errorBody')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="secondary" onClick={() => void runAnalysis()}>
                {t('analysis.retry')}
              </Button>
            </div>
          </div>
        ) : null}

        {showLoading ? (
          <div className="flex min-h-[320px] w-full flex-1 flex-col items-center justify-center gap-5 rounded-[10px] border border-[var(--app-border)] bg-[var(--app-surface)] px-8 py-12 text-center shadow-sm">
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

        {showResults && analysis ? (
          <div className="flex w-full flex-col gap-4">
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

            <div className="flex flex-col gap-4 rounded-[10px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-left shadow-sm">
              <h2 className="text-sm font-semibold text-[var(--app-text)]">
                {t('analysis.fitTitle')}
              </h2>
              <p className="text-sm leading-relaxed text-[var(--app-muted)]">
                {analysis.fitSummary}
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t border-[var(--app-border)] pt-4">
              <p className="text-xs font-semibold tracking-wide text-[var(--app-accent)] uppercase">
                {t('analysis.ctaKicker')}
              </p>
              <p className="text-sm text-[var(--app-muted)]">
                {t('analysis.ctaBody')}
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  if (activeResumeId) {
                    goToPolish(activeResumeId, 'resume');
                  }
                }}
              >
                <FileText className="h-5 w-5" aria-hidden />
                {t('analysis.ctaResume')}
              </Button>
              <p className="text-xs text-[var(--app-faint)]">
                {t('analysis.ctaHint')}
              </p>
            </div>
          </div>
        ) : null}

        {showJdForm ? (
          <div className="flex w-full flex-col gap-5">
            <div className="flex max-w-lg flex-col gap-1 text-left">
              <p className="text-xs font-semibold tracking-wide text-[var(--app-accent)] uppercase">
                {t('jd.step')}
              </p>
              <h1 className="text-[22px] font-semibold text-[var(--app-text)]">
                {t('jd.heading')}
              </h1>
              <p className="text-sm leading-relaxed text-[var(--app-muted)]">
                {t('jd.subtitle')}
              </p>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm">
              <label
                className="text-left text-xs font-medium text-[var(--app-muted)]"
                htmlFor="jd-field"
              >
                {t('jd.label')}
              </label>
              <textarea
                id="jd-field"
                className="mt-4 min-h-[360px] flex-1 resize-none rounded-lg border border-[var(--app-border)] bg-[var(--app-canvas)] p-4 text-sm leading-relaxed text-[var(--app-text)] placeholder:text-[var(--app-faint)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[var(--app-accent)]"
                placeholder={t('jd.placeholder')}
                value={jd}
                onChange={(e) => setJd(e.target.value)}
              />
            </div>

            {hintText ? (
              <p
                className="text-left text-sm text-amber-900 dark:text-amber-200/90"
                role="status"
              >
                {hintText}
              </p>
            ) : (
              <p
                className="text-left text-sm text-[var(--app-muted)]"
                role="status"
              >
                {t('jd.hint.ok')}
              </p>
            )}

            <div className="flex flex-col gap-3 border-t border-[var(--app-border)] pt-4">
              <p className="text-xs font-semibold tracking-wide text-[var(--app-accent)] uppercase">
                {t('analysis.jdNextLabel')}
              </p>
              <p className="text-left text-sm text-[var(--app-muted)]">
                {t('analysis.jdNextHint')}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={() => void pasteFromClipboard()}
                >
                  {t('jd.pasteClipboard')}
                </Button>
                <Button
                  variant="primary"
                  disabled={hint === 'empty' || hint === 'too_short'}
                  onClick={() => void runAnalysis()}
                >
                  {t('jd.continueAnalysis')}
                </Button>
              </div>
              <p className="text-left text-xs text-[var(--app-faint)]">
                {t('analysis.jdFooterNote')}
              </p>
            </div>
          </div>
        ) : null}

        <p className="w-full text-left text-xs leading-relaxed text-[var(--app-faint)]">
          {t('analysis.privacy')}
        </p>
      </div>
    </div>
  );
}
