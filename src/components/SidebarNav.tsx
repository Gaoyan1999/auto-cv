import { useCallback, useState } from 'react'
import { ClipboardList, FileText, PanelLeft, PanelRight, ScanSearch } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { AppTab } from '../types/app'
import { useAppState } from '../hooks/useAppState'

const SIDEBAR_COLLAPSED_KEY = 'auto-cv-sidebar-collapsed'

const items: { id: AppTab; icon: typeof FileText; labelKey: string }[] = [
  { id: 'resume', icon: FileText, labelKey: 'nav.resume' },
  { id: 'jd', icon: ClipboardList, labelKey: 'nav.jd' },
  { id: 'analysis', icon: ScanSearch, labelKey: 'nav.analysis' },
]

function readCollapsed(): boolean {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1'
  } catch {
    return false
  }
}

export function SidebarNav() {
  const { t } = useTranslation()
  const { tab, setTab } = useAppState()
  const [collapsed, setCollapsed] = useState(readCollapsed)

  const toggleCollapsed = useCallback(() => {
    setCollapsed((c) => {
      const next = !c
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0')
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const toggleBtnClass =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--app-muted)] transition-colors hover:bg-black/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-accent)] dark:hover:bg-white/[0.08]'

  return (
    <nav
      className={[
        'flex w-full shrink-0 flex-col gap-1 border-b border-[var(--app-border)] bg-[var(--app-canvas)] p-3 transition-[width] duration-200 ease-out md:border-b-0 md:border-r',
        collapsed ? 'md:w-16 md:overflow-x-clip md:px-2.5 md:py-4' : 'md:w-[252px] md:px-3 md:py-4',
      ].join(' ')}
      aria-label={t('nav.aria')}
    >
      <div className="hidden shrink-0 pb-3 md:block">
        {collapsed ? (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-expanded={false}
              title={t('nav.expandSidebar')}
              aria-label={t('nav.expandSidebar')}
              className={toggleBtnClass}
            >
              <PanelRight className="h-[18px] w-[18px]" aria-hidden />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 shrink items-center" aria-label={t('app.title')} role="img">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--app-accent-subtle)] text-[var(--app-accent)]">
                <FileText className="h-[18px] w-[18px]" aria-hidden />
              </span>
            </div>
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-expanded
              title={t('nav.collapseSidebar')}
              aria-label={t('nav.collapseSidebar')}
              className={toggleBtnClass}
            >
              <PanelLeft className="h-[18px] w-[18px]" aria-hidden />
            </button>
          </div>
        )}
      </div>
      {items.map(({ id, icon: Icon, labelKey }) => {
        const active = tab === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            title={collapsed ? t(labelKey) : undefined}
            className={[
              'flex items-center gap-2.5 rounded-[10px] py-2.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-accent)]',
              collapsed ? 'md:justify-center md:px-2 md:text-center' : 'px-3 text-left',
              active
                ? 'bg-[var(--app-accent-subtle)] font-semibold text-[var(--app-text)] [&_svg]:text-[var(--app-accent)]'
                : 'bg-[var(--app-canvas)] font-normal text-[var(--app-muted)] hover:bg-black/[0.03]',
            ].join(' ')}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
            <span className={collapsed ? 'md:sr-only' : undefined}>{t(labelKey)}</span>
          </button>
        )
      })}
    </nav>
  )
}
