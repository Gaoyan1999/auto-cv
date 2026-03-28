import { createContext } from 'react'
import type { AppStateValue } from '../types/app'

export const AppStateContext = createContext<AppStateValue | null>(null)
