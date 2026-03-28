import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ThemePreference } from '../types/theme'
import { useTheme } from '../hooks/useTheme'

const modes: { id: ThemePreference; icon: typeof Sun; labelKey: string }[] = [
  { id: 'light', icon: Sun, labelKey: 'theme.light' },
  { id: 'dark', icon: Moon, labelKey: 'theme.dark' },
]

export function ThemeToggle() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  return (
    <div
      className="app-lang app-lang-icons"
      role="group"
      aria-label={t('theme.aria')}
    >
      {modes.map(({ id, icon: Icon, labelKey }) => {
        const active = theme === id
        return (
          <button
            key={id}
            type="button"
            className={active ? 'active' : ''}
            aria-pressed={active}
            title={t(labelKey)}
            onClick={() => setTheme(id)}
          >
            <Icon className="h-4 w-4" aria-hidden />
            <span className="sr-only">{t(labelKey)}</span>
          </button>
        )
      })}
    </div>
  )
}
