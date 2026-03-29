import { Copy, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppNavigate } from '../routes/useAppNavigate';
import { Button } from './ui/Button';
import { useAppState } from '../hooks/useAppState';

export function ResumeListPage() {
  const { t } = useTranslation();
  const { goToPolish } = useAppNavigate();
  const { resumes, createResume, forkResume, deleteResume } = useAppState();

  const sorted = [...resumes].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 p-6 md:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-left text-[22px] font-semibold text-[var(--app-text)]">
          {t('list.title')}
        </h1>
        <Button
          variant="primary"
          type="button"
          onClick={() => {
            const id = createResume();
            goToPolish(id, 'resume');
          }}
        >
          {t('list.newResume')}
        </Button>
      </div>

      <p className="max-w-3xl text-left text-sm leading-relaxed text-[var(--app-muted)]">
        {t('list.subtitle')}
      </p>

      <ul className="flex flex-col gap-5">
        {sorted.map((r) => (
          <li
            key={r.id}
            className="flex flex-col gap-3 rounded-[10px] border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm"
          >
            <div className="flex flex-col gap-6 gap-y-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <p className="text-left text-base font-semibold text-[var(--app-text)]">
                  {r.name}
                </p>
                <p className="text-left text-sm leading-relaxed text-[var(--app-muted)]">
                  {r.description.trim() ? r.description : '—'}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => forkResume(r.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--app-border)] px-3.5 py-2 text-sm text-[var(--app-muted)] transition-colors hover:border-[var(--app-accent)]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-accent)]"
                >
                  <Copy className="h-4 w-4 shrink-0" aria-hidden />
                  {t('list.saveAs')}
                </button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => goToPolish(r.id, 'resume')}
                >
                  {t('list.openPolish')}
                </Button>
                <button
                  type="button"
                  onClick={() => deleteResume(r.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--app-border)] px-3.5 py-2 text-sm text-red-600 transition-colors hover:border-red-300 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:text-red-400 dark:hover:border-red-800 dark:hover:bg-red-950/40"
                  aria-label={t('list.deleteAria', { name: r.name })}
                >
                  <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                  {t('list.delete')}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="max-w-3xl text-left text-xs leading-relaxed text-[var(--app-faint)]">
        {t('list.tip')}
      </p>
    </div>
  );
}
