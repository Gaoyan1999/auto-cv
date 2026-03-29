import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '../ui/Button';
import { useAppState } from '../../hooks/useAppState';

export function ResumeWorkspace() {
  const { t } = useTranslation();
  const {
    resume,
    setResume,
    pendingSuggestions,
    suggestionStatus,
    suggestions,
    acceptSuggestion,
    rejectSuggestion,
    acceptAllSuggestions,
    rejectAllSuggestions,
  } = useAppState();

  const pendingCount = pendingSuggestions.length;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 p-6 md:p-8">
      <p className="text-left text-xs font-semibold tracking-wide text-[var(--app-accent)] uppercase">
        {t('resume.step')}
      </p>

      <div className="flex flex-col gap-2 border-b border-transparent pb-2 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-left text-[22px] font-semibold text-[var(--app-text)]">
            {t('resume.heading')}
          </h1>
          {pendingCount > 0 ? (
            <span className="rounded-xl bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-950/50 dark:text-amber-100">
              {t('resume.suggestionBadge', { count: pendingCount })}
            </span>
          ) : null}
        </div>
        {pendingCount > 0 ? (
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={acceptAllSuggestions}>
              {t('resume.acceptAll')}
            </Button>
            <Button variant="secondary" onClick={rejectAllSuggestions}>
              {t('resume.rejectAll')}
            </Button>
          </div>
        ) : null}
      </div>

      <p className="text-left text-sm leading-relaxed text-[var(--app-muted)]">
        {t('resume.subtitle')}
      </p>

      <div className="grid min-h-[420px] flex-1 grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-5">
        <div className="flex min-h-0 flex-col gap-2">
          <p className="text-left text-xs font-medium text-[var(--app-muted)]">
            {t('resume.editor')}
          </p>
          <div className="flex min-h-[320px] flex-1 overflow-hidden rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
            <textarea
              className="min-h-[320px] w-full flex-1 resize-none bg-[var(--app-canvas)] p-3 font-mono text-[13px] leading-relaxed text-[var(--app-text)] placeholder:text-[var(--app-faint)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[var(--app-accent)]"
              spellCheck
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              aria-label={t('resume.editor')}
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-2">
          <p className="text-left text-xs font-medium text-[var(--app-muted)]">
            {t('resume.preview')}
          </p>
          <div className="markdown-preview min-h-[320px] flex-1 overflow-auto rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-left shadow-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{resume}</ReactMarkdown>
          </div>
        </div>
      </div>

      {suggestions.some((s) => suggestionStatus[s.id] === 'pending') ? (
        <section
          className="flex flex-col gap-3"
          aria-label={t('resume.suggestionsRegion')}
        >
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--app-text)]">
            <Sparkles
              className="h-4 w-4 text-[var(--app-accent)]"
              aria-hidden
            />
            {t('resume.inlineTitle')}
          </div>
          <ul className="flex flex-col gap-3">
            {suggestions.map((s) =>
              suggestionStatus[s.id] === 'pending' ? (
                <li
                  key={s.id}
                  className="rounded-lg border border-[var(--app-accent)]/40 bg-[var(--app-surface)] p-4 shadow-md"
                >
                  <p className="text-left text-xs font-semibold text-[var(--app-text)]">
                    {s.title}
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-2 text-sm">
                      <span className="shrink-0 text-red-800 dark:text-red-300">
                        −
                      </span>
                      <span className="text-left text-red-900 dark:text-red-200">
                        {s.oldText}
                      </span>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="shrink-0 text-emerald-800 dark:text-emerald-300">
                        +
                      </span>
                      <span className="text-left text-emerald-900 dark:text-emerald-200">
                        {s.newText}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--app-border)] pt-3">
                    <p className="text-left text-[11px] text-[var(--app-faint)]">
                      {s.sectionHint}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => rejectSuggestion(s.id)}
                      >
                        {t('resume.reject')}
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => acceptSuggestion(s.id)}
                      >
                        {t('resume.accept')}
                      </Button>
                    </div>
                  </div>
                </li>
              ) : null
            )}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
