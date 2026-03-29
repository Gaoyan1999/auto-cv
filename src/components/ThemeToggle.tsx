import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../hooks/useTheme'

export function ThemeToggle() {
  const { t } = useTranslation()
  const { resolvedTheme, setTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'
  const Icon = isDark ? Moon : Sun

  return (
    <div className="app-lang app-lang-icons">
      <button
        type="button"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
        title={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
      >
        <Icon className="h-4 w-4" aria-hidden />
        <span className="sr-only">
          {isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
        </span>
      </button>
    </div>
  )
}
