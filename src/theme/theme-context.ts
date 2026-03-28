import { createContext } from 'react'
import type { ThemePreference } from '../types/theme'

export interface ThemeContextValue {
  theme: ThemePreference
  setTheme: (t: ThemePreference) => void
  resolvedTheme: 'light' | 'dark'
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
