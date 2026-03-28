import { ClipboardList, FileText, ScanSearch } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { AppTab } from '../types/app'
import { useAppState } from '../hooks/useAppState'

const items: { id: AppTab; icon: typeof FileText; labelKey: string }[] = [
  { id: 'resume', icon: FileText, labelKey: 'nav.resume' },
  { id: 'jd', icon: ClipboardList, labelKey: 'nav.jd' },
  { id: 'analysis', icon: ScanSearch, labelKey: 'nav.analysis' },
]

export function SidebarNav() {
  const { t } = useTranslation()
  const { tab, setTab } = useAppState()

  return (
    <nav
      className="flex w-full shrink-0 flex-col gap-1 border-b border-[var(--app-border)] bg-[var(--app-canvas)] p-3 md:w-[252px] md:border-b-0 md:border-r md:py-4"
      aria-label={t('nav.aria')}
    >
      {items.map(({ id, icon: Icon, labelKey }) => {
        const active = tab === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-accent)] ${
              active
                ? 'bg-[var(--app-accent-subtle)] font-semibold text-[var(--app-text)] [&_svg]:text-[var(--app-accent)]'
                : 'bg-[var(--app-canvas)] font-normal text-[var(--app-muted)] hover:bg-black/[0.03]'
            }`}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
            {t(labelKey)}
          </button>
        )
      })}
    </nav>
  )
}
