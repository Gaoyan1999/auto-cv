import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { assessJobDescription } from '../../lib/jdValidation'
import { useAppState } from '../../hooks/useAppState'
import { Button } from '../ui/Button'

export function JobDescriptionPanel() {
  const { t } = useTranslation()
  const { jd, setJd, runAnalysis } = useAppState()
  const { hint } = assessJobDescription(jd)

  const hintText =
    hint === 'empty'
      ? t('jd.hint.empty')
      : hint === 'too_short'
        ? t('jd.hint.tooShort')
        : hint === 'low_signal'
          ? t('jd.hint.lowSignal')
          : null

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setJd(text)
    } catch {
      /* user denied or unavailable */
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 p-6 md:p-8">
      <div className="flex max-w-lg flex-col gap-1 text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-accent)]">
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
        <p className="text-left text-sm text-amber-900" role="status">
          {hintText}
        </p>
      ) : (
        <p className="text-left text-sm text-[var(--app-muted)]" role="status">
          {t('jd.hint.ok')}
        </p>
      )}

      <div className="flex flex-col gap-3 border-t border-[var(--app-border)] pt-4">
        <p className="text-left text-sm text-[var(--app-muted)]">
          {t('jd.footerHint')}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={() => void pasteFromClipboard()}>
            {t('jd.pasteClipboard')}
          </Button>
          <Button
            variant="primary"
            disabled={hint === 'empty' || hint === 'too_short'}
            onClick={() => void runAnalysis()}
          >
            {t('jd.continueAnalysis')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
        <p className="text-left text-xs text-[var(--app-faint)]">{t('jd.orSidebar')}</p>
      </div>
    </div>
  )
}
