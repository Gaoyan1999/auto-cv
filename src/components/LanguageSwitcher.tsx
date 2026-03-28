import { useTranslation } from 'react-i18next'

const locales = ['en', 'zh'] as const

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  return (
    <div className="app-lang" role="group" aria-label={t('common.language')}>
      {locales.map((lng) => {
        const active = i18n.resolvedLanguage?.startsWith(lng) ?? false
        return (
          <button
            key={lng}
            type="button"
            className={active ? 'active' : ''}
            onClick={() => void i18n.changeLanguage(lng)}
          >
            {t(`lang.${lng}`)}
          </button>
        )
      })}
    </div>
  )
}
