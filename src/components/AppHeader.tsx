import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { buildExportAllPayload, downloadJson } from '../lib/exportBackup'
import { useAppState } from '../hooks/useAppState'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'

type HeaderVariant = 'list' | 'workspace'

export function AppHeader({ variant }: { variant: HeaderVariant }) {
  const { t } = useTranslation()
  const { resumes, goToList } = useAppState()

  const onExport = () => {
    downloadJson(
      `job-resume-backup-${new Date().toISOString().slice(0, 10)}.json`,
      buildExportAllPayload({ version: 2, resumes }),
    )
  }

  const hint =
    variant === 'list' ? t('app.dataLocalShort') : t('app.dataLocal')

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--app-border)] bg-[var(--app-surface)] px-6 py-4 md:px-7">
      <div className="flex min-w-0 flex-wrap items-center gap-3 md:gap-4">
        {variant === 'workspace' ? (
          <>
            <button
              type="button"
              onClick={goToList}
              className="shrink-0 text-sm font-semibold text-[var(--app-accent)] transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-accent)]"
            >
              {t('app.backToList')}
            </button>
            <p className="text-lg font-semibold text-[var(--app-text)]">
              {t('app.title')}
            </p>
          </>
        ) : (
          <p className="text-lg font-semibold text-[var(--app-text)]">
            {t('app.title')}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        <p className="max-w-[220px] text-left text-xs leading-snug text-[var(--app-faint)]">
          {hint}
        </p>
        <ThemeToggle />
        <LanguageSwitcher />
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--app-border)] px-3.5 py-2 text-sm text-[var(--app-muted)] transition-colors hover:border-[var(--app-accent)]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-accent)]"
          onClick={onExport}
        >
          <Download className="h-4 w-4" aria-hidden />
          {t('app.export')}
        </button>
      </div>
    </header>
  )
}
