import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AppHeader } from './components/AppHeader';
import { AnalysisPanel } from './components/analysis/AnalysisPanel';
import { ResumeListPage } from './components/ResumeListPage';
import { ResumeWorkspace } from './components/resume/ResumeWorkspace';
import { SidebarNav } from './components/SidebarNav';
import { AppStateProvider } from './context/AppStateProvider';
import { useAppState } from './hooks/useAppState';
import { AppPath, RoutePattern } from './routes/routes';
import { useAppNavigate } from './routes/useAppNavigate';
import type { AppTab } from './types/app';
import './App.css';

function LoadingScreen() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-[var(--app-canvas)] text-sm text-[var(--app-muted)]">
      {t('app.loading')}
    </div>
  );
}

function ListPage() {
  const { goToList } = useAppState();

  useEffect(() => {
    goToList();
  }, [goToList]);

  return (
    <div className="flex min-h-[100svh] flex-col bg-[var(--app-canvas)] text-[var(--app-text)]">
      <AppHeader variant="list" />
      <main className="min-h-0 flex-1 overflow-auto bg-[var(--app-canvas)]">
        <ResumeListPage />
      </main>
    </div>
  );
}

function PolishIndexRedirect() {
  const { resumeId } = useParams();
  if (!resumeId) {
    return <Navigate to={AppPath.list()} replace />;
  }
  return <Navigate to={AppPath.polish(resumeId, 'resume')} replace />;
}

function PolishPage() {
  const { t } = useTranslation();
  const { resumeId, section } = useParams();
  const { goToList, goToPolish } = useAppNavigate();
  const { hydrated, resumes, openResume } = useAppState();
  const resumesRef = useRef(resumes);
  useEffect(() => {
    resumesRef.current = resumes;
  }, [resumes]);

  useEffect(() => {
    if (!hydrated || !resumeId) {
      return;
    }
    if (section !== 'resume' && section !== 'analysis') {
      goToPolish(resumeId, 'resume', { replace: true });
      return;
    }
    const exists = resumesRef.current.some((r) => r.id === resumeId);
    if (!exists) {
      goToList({ replace: true });
      return;
    }
    openResume(resumeId, section as AppTab);
  }, [hydrated, resumeId, section, goToList, goToPolish, openResume]);

  if (!hydrated) {
    return <LoadingScreen />;
  }

  const exists = resumeId && resumes.some((r) => r.id === resumeId);
  if (!exists) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-[var(--app-canvas)] text-sm text-[var(--app-muted)]">
        {t('app.loading')}
      </div>
    );
  }

  const panel =
    section === 'analysis' ? <AnalysisPanel /> : <ResumeWorkspace />;

  return (
    <div className="flex min-h-[100svh] flex-col bg-[var(--app-canvas)] text-[var(--app-text)]">
      <AppHeader variant="workspace" />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <SidebarNav />
        <main className="min-h-0 flex-1 overflow-auto bg-[var(--app-canvas)]">
          {panel}
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { hydrated } = useAppState();

  if (!hydrated) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route
        path={RoutePattern.Root}
        element={<Navigate to={AppPath.list()} replace />}
      />
      <Route path={RoutePattern.List} element={<ListPage />} />
      <Route path={RoutePattern.Polish} element={<PolishIndexRedirect />} />
      <Route path={RoutePattern.PolishSection} element={<PolishPage />} />
      <Route path="*" element={<Navigate to={AppPath.list()} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <AppRoutes />
    </AppStateProvider>
  );
}
