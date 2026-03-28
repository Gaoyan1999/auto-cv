import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ThemeContext, type ThemeContextValue } from './theme-context'
import type { ThemePreference } from '../types/theme'

const STORAGE_KEY = 'theme'

function readStoredTheme(): ThemePreference {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark' || v === 'system') {
      return v
    }
  } catch {
    /* ignore */
  }
  return 'system'
}

function isDarkForPreference(
  preference: ThemePreference,
  osDark: boolean,
): boolean {
  if (preference === 'dark') {
    return true
  }
  if (preference === 'light') {
    return false
  }
  return osDark
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(() =>
    typeof window !== 'undefined' ? readStoredTheme() : 'system',
  )
  const [osDark, setOsDark] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setOsDark(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const resolvedTheme: 'light' | 'dark' = useMemo(() => {
    return isDarkForPreference(theme, osDark) ? 'dark' : 'light'
  }, [theme, osDark])

  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      resolvedTheme === 'dark',
    )
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme, resolvedTheme])

  const setTheme = useCallback((t: ThemePreference) => {
    setThemeState(t)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
    }),
    [theme, setTheme, resolvedTheme],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}
