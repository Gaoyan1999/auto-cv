import { AppHeader } from './components/AppHeader'
import { AnalysisPanel } from './components/analysis/AnalysisPanel'
import { JobDescriptionPanel } from './components/jd/JobDescriptionPanel'
import { ResumeWorkspace } from './components/resume/ResumeWorkspace'
import { SidebarNav } from './components/SidebarNav'
import { AppStateProvider } from './context/AppStateProvider'
import { useAppState } from './hooks/useAppState'
import './App.css'

function AppShell() {
  const { tab } = useAppState()

  return (
    <div className="flex min-h-[100svh] flex-col bg-[var(--app-canvas)] text-[var(--app-text)]">
      <AppHeader />
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
