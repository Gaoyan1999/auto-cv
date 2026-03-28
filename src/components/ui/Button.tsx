import { Button as HeadlessButton } from '@headlessui/react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const variantClass: Record<Variant, string> = {
  primary:
    'bg-[var(--app-accent)] text-white border-transparent hover:opacity-95 shadow-sm',
  secondary:
    'bg-[var(--app-surface)] text-[var(--app-muted)] border-[var(--app-border)] hover:border-[var(--app-accent)]/40',
  ghost: 'bg-transparent text-[var(--app-muted)] border-transparent hover:bg-black/[0.04]',
}

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-accent)] disabled:pointer-events-none disabled:opacity-50'

export function Button({
  variant = 'secondary',
  className = '',
  type = 'button',
  children,
  ...rest
}: {
  variant?: Variant
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <HeadlessButton
      type={type}
      className={`${baseClass} ${variantClass[variant]} ${className}`}
      {...rest}
    >
      {children}
    </HeadlessButton>
  )
}
