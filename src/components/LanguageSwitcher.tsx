import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const LOCALES = ['en', 'zh'] as const
type Locale = (typeof LOCALES)[number]

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const value: Locale = i18n.resolvedLanguage?.startsWith('zh') ? 'zh' : 'en'

  return (
    <div className="app-lang">
      <Listbox
        value={value}
        onChange={(lng: Locale) => void i18n.changeLanguage(lng)}
      >
        <ListboxButton
          aria-label={t('common.language')}
          className={({ open }) =>
            [
              'inline-flex items-center gap-2 rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-2.5 py-2 text-sm text-[var(--app-muted)] transition-[border-color,color,background-color] hover:border-[color-mix(in_srgb,var(--app-accent)_50%,var(--app-border))] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-accent)] data-[hover]:border-[color-mix(in_srgb,var(--app-accent)_50%,var(--app-border))]',
              open ? '[&>svg]:rotate-180' : '',
            ]
              .filter(Boolean)
              .join(' ')
          }
        >
          <span>{t(`lang.${value}`)}</span>
          <ChevronDown
            className="h-4 w-4 shrink-0 opacity-70 transition-transform duration-200"
            aria-hidden
          />
        </ListboxButton>
        <ListboxOptions
          transition
          anchor={{ to: 'bottom end', gap: '4px', padding: 8 }}
          portal
          modal={false}
          className="z-[200] mt-1 min-w-[var(--button-width)] origin-top-right transform-gpu rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-1 shadow-lg outline-none transition-[opacity,transform] duration-150 ease-out will-change-[transform,opacity] data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          {LOCALES.map((lng) => (
            <ListboxOption
              key={lng}
              value={lng}
              className={({ focus, selected }) =>
                [
                  'flex w-full cursor-pointer select-none items-center rounded-md px-3 py-2 text-left text-sm',
                  focus ? 'bg-[var(--app-accent-subtle)]' : '',
                  selected
                    ? 'font-semibold text-[var(--app-accent)]'
                    : 'text-[var(--app-muted)]',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              {t(`lang.${lng}`)}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  )
}
