import { Sparkles } from 'lucide-react';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useAppState } from '@/hooks/useAppState';
import {
  renderResumeHtmlFragment,
  RESUME_HTML_PREVIEW_CLASS,
  resumeHtmlStyles,
} from '@/lib/resumeHtml';

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
  const splitRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const [leftPaneWidth, setLeftPaneWidth] = useState(48);
  const [pageCount, setPageCount] = useState(1);
  const pendingCount = pendingSuggestions.length;
  const htmlPreview = renderResumeHtmlFragment(resume);
  const PAGE_HEIGHT = 1123;
  const PAGE_PADDING = 42;
  const PAGE_CONTENT_HEIGHT = PAGE_HEIGHT - PAGE_PADDING * 2;

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const container = splitRef.current;
      if (!container) {
        return;
      }
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0) {
        return;
      }
      const raw = ((event.clientX - rect.left) / rect.width) * 100;
      const next = Math.min(72, Math.max(28, raw));
      setLeftPaneWidth(next);
    };

    const onMouseUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    const onWindowBlur = () => {
      onMouseUp();
    };

    const handle = splitRef.current?.querySelector(
      '[data-resize-handle="true"]'
    ) as HTMLButtonElement | null;
    if (!handle) {
      return;
    }

    const onMouseDown = (event: MouseEvent) => {
      if (window.innerWidth < 1024) {
        return;
      }
      event.preventDefault();
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('blur', onWindowBlur, { once: true });
    };

    handle.addEventListener('mousedown', onMouseDown);
    return () => {
      handle.removeEventListener('mousedown', onMouseDown);
      onMouseUp();
    };
  }, []);

  useLayoutEffect(() => {
    const node = measureRef.current;
    if (!node) {
      return;
    }
    const updatePages = () => {
      const contentHeight = node.scrollHeight;
      const next = Math.max(1, Math.ceil(contentHeight / PAGE_CONTENT_HEIGHT));
      setPageCount(next);
    };
    updatePages();
    const observer = new ResizeObserver(updatePages);
    observer.observe(node);
    return () => observer.disconnect();
  }, [htmlPreview, PAGE_CONTENT_HEIGHT]);

  return (
    <div className="flex flex-col gap-2 p-2 h-full overflow-hidden">      

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
      <div
        ref={splitRef}
        className="grid min-h-[420px] flex-1 grid-cols-1 lg:gap-0 lg:[grid-template-columns:var(--left-pane-width)_10px_minmax(0,1fr)]"
        style={
          {
            '--left-pane-width': `${leftPaneWidth}%`,
          } as CSSProperties
        }
      >
        <div className="flex min-h-0 flex-col gap-2">          
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

        <button
          type="button"
          aria-label={t('resume.resizePanels')}
          title={t('resume.resizePanels')}
          data-resize-handle="true"
          className="group hidden h-full cursor-col-resize bg-transparent transition-colors hover:bg-[var(--app-accent)]/10 focus-visible:bg-[var(--app-accent)]/10 focus-visible:outline-none lg:block"
        >
          <span className="mx-auto flex h-full w-px items-center justify-center bg-[var(--app-border)] transition-colors group-hover:bg-[var(--app-accent)] group-focus-visible:bg-[var(--app-accent)]">
            <span className="flex -translate-x-px flex-col items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-[var(--app-muted)] transition-colors group-hover:bg-[var(--app-accent)] group-focus-visible:bg-[var(--app-accent)]" />
              <span className="h-1 w-1 rounded-full bg-[var(--app-muted)] transition-colors group-hover:bg-[var(--app-accent)] group-focus-visible:bg-[var(--app-accent)]" />
              <span className="h-1 w-1 rounded-full bg-[var(--app-muted)] transition-colors group-hover:bg-[var(--app-accent)] group-focus-visible:bg-[var(--app-accent)]" />
            </span>
          </span>
        </button>

        <div className="flex min-h-0 flex-col gap-2">          
          <div className="relative min-h-[320px] flex-1 overflow-auto rounded-lg border border-[var(--app-border)] bg-[var(--app-canvas)]">
            <style>{resumeHtmlStyles()}</style>
            <div className="mx-auto flex min-h-full w-full min-w-max flex-col items-center gap-5 px-3 py-4 md:px-4">
              <div
                ref={measureRef}
                className="pointer-events-none absolute -left-[99999px] top-0 w-[794px]"
                aria-hidden
              >
                <div className="p-[42px]">
                  <div
                    className={RESUME_HTML_PREVIEW_CLASS}
                    dangerouslySetInnerHTML={{ __html: htmlPreview }}
                  />
                </div>
              </div>
              {Array.from({ length: pageCount }).map((_, idx) => (
                <div
                  key={idx}
                  className="relative w-[794px] overflow-hidden bg-white shadow-[0_14px_30px_rgba(17,24,39,0.18)]"
                  style={{
                    height: `${PAGE_HEIGHT}px`,
                  }}
                >
                  <div className="h-full p-[42px]">
                    <div
                      className={RESUME_HTML_PREVIEW_CLASS}
                      style={{
                        transform: `translateY(-${idx * PAGE_CONTENT_HEIGHT}px)`,
                      }}
                      dangerouslySetInnerHTML={{ __html: htmlPreview }}
                    />
                  </div>
                </div>
              ))}
            </div>
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
