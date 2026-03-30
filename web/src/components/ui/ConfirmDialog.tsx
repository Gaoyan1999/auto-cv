import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from './Button';

export type DialogSize = 'sm' | 'md' | 'lg';

const panelMaxWidth: Record<DialogSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-[520px]',
  lg: 'max-w-2xl',
};

const bodyMaxHeight: Record<DialogSize, string> = {
  sm: 'max-h-[min(240px,45vh)]',
  md: 'max-h-[min(288px,50vh)]',
  lg: 'max-h-[min(400px,55vh)]',
};

const panelMaxHeight: Record<DialogSize, string> = {
  sm: 'max-h-[min(480px,85vh)]',
  md: 'max-h-[min(560px,85vh)]',
  lg: 'max-h-[min(720px,90vh)]',
};

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  content: ReactNode;
  /** Controls panel width and default body scroll height. */
  size?: DialogSize;
  /** Fires when the primary (Done) button is clicked; dialog closes afterward. */
  onConfirm?: () => void;
  cancelLabel: string;
  confirmLabel: string;
  closeAriaLabel: string;
  /** Optional z-index for stacking (default 100). */
  zIndexClass?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  title,
  content,
  size = 'md',
  onConfirm,
  cancelLabel,
  confirmLabel,
  closeAriaLabel,
  zIndexClass = 'z-[100]',
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className={`relative ${zIndexClass}`}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/45 transition duration-200 data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className={`flex w-full ${panelMaxWidth[size]} ${panelMaxHeight[size]} flex-col overflow-hidden rounded-[10px] border border-[var(--app-border)] bg-[var(--app-surface)] shadow-[0_4px_24px_rgba(0,0,0,0.14)] transition duration-200 data-[closed]:scale-95 data-[closed]:opacity-0 dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)]`}
        >
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--app-border)] px-5 py-3.5">
            <DialogTitle className="text-[15px] font-semibold text-[var(--app-text)]">
              {title}
            </DialogTitle>
            <CloseButton className="rounded-md p-1.5 text-[var(--app-muted)] transition-colors hover:bg-black/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-accent)] dark:hover:bg-white/[0.08]">
              <span className="sr-only">{closeAriaLabel}</span>
              <X className="h-4 w-4 shrink-0" aria-hidden />
            </CloseButton>
          </div>
          <div
            className={`min-h-0 flex-1 overflow-y-auto bg-[#F5F5F4] px-5 py-4 dark:bg-[var(--app-canvas)] ${bodyMaxHeight[size]}`}
          >
            {content}
          </div>
          <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-[var(--app-border)] px-5 pt-3 pb-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              {cancelLabel}
            </Button>
            <Button type="button" variant="primary" onClick={handleConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
