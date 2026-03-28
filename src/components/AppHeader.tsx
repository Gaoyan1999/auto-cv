import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { downloadJson } from '../lib/exportBackup'
import { useAppState } from '../hooks/useAppState'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'

export function AppHeader() {
  const { t } = useTranslation()
  const { resume, jd, analysis, suggestions } = useAppState()

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--app-border)] bg-[var(--app-surface)] px-6 py-4 md:px-7">
      <p className="text-lg font-semibold text-[var(--app-text)]">
        {t('app.title')}
      </p>
      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        <p className="max-w-[220px] text-left text-xs leading-snug text-[var(--app-faint)]">
          {t('app.dataLocal')}
        </p>
        <ThemeToggle />
        <LanguageSwitcher />
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--app-border)] px-3.5 py-2 text-sm text-[var(--app-muted)] transition-colors hover:border-[var(--app-accent)]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-accent)]"
          onClick={() =>
            downloadJson(`job-resume-backup-${new Date().toISOString().slice(0, 10)}.json`, {
              exportedAt: new Date().toISOString(),
              app: 'job-resume-agent',
              version: 1,
              resumeMarkdown: resume,
              jobDescription: jd,
              analysis,
              suggestions,
            })
          }
        >
          <Download className="h-4 w-4" aria-hidden />
          {t('app.export')}
        </button>
      </div>
    </header>
  )
}
