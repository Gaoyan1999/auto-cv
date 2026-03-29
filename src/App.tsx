import { useTranslation } from 'react-i18next'
import { AppHeader } from './components/AppHeader'
import { AnalysisPanel } from './components/analysis/AnalysisPanel'
import { JobDescriptionPanel } from './components/jd/JobDescriptionPanel'
import { ResumeListPage } from './components/ResumeListPage'
import { ResumeWorkspace } from './components/resume/ResumeWorkspace'
import { SidebarNav } from './components/SidebarNav'
import { AppStateProvider } from './context/AppStateProvider'
import { useAppState } from './hooks/useAppState'
import './App.css'

function AppShell() {
  const { t } = useTranslation()
  const { tab, activeResumeId, hydrated } = useAppState()

  if (!hydrated) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-[var(--app-canvas)] text-sm text-[var(--app-muted)]">
        {t('app.loading')}
      </div>
    )
  }

  if (!activeResumeId) {
    return (
      <div className="flex min-h-[100svh] flex-col bg-[var(--app-canvas)] text-[var(--app-text)]">
        <AppHeader variant="list" />
        <main className="min-h-0 flex-1 overflow-auto bg-[var(--app-canvas)]">
          <ResumeListPage />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-[100svh] flex-col bg-[var(--app-canvas)] text-[var(--app-text)]">
      <AppHeader variant="workspace" />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <SidebarNav />
        <main className="min-h-0 flex-1 overflow-auto bg-[var(--app-canvas)]">
          {tab === 'resume' ? (
            <ResumeWorkspace />
          ) : tab === 'jd' ? (
            <JobDescriptionPanel />
          ) : (
            <AnalysisPanel />
          )}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <AppShell />
    </AppStateProvider>
  )
}
