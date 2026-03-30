import { useTranslation } from 'react-i18next';

/** Matches Pencil: step 1 = paste JD, step 2 = analysis, step 3 = resume (hint only in this panel). */
export type AnalysisFlowMode = 'jd' | 'analysis';

export function AnalysisFlowStepper({ mode }: { mode: AnalysisFlowMode }) {
  const { t } = useTranslation();
  const step1Done = mode === 'analysis';
  const step2Active = mode === 'analysis';

  const line12Class =
    step1Done || step2Active
      ? 'bg-[var(--app-accent)]'
      : 'bg-[var(--app-border)]';
  const line23Class = 'bg-[var(--app-border)]';

  return (
    <div
      className="flex w-full flex-col gap-2"
      role="group"
      aria-label={t('analysis.flow.aria')}
    >
      <div className="flex w-full items-center gap-2">
        <StepPill
          step={1}
          label={t('analysis.flow.step1')}
          state={mode === 'jd' ? 'active' : 'done'}
        />
        <div
          className={`h-0.5 min-w-[12px] flex-1 rounded-full ${line12Class}`}
        />
        <StepPill
          step={2}
          label={t('analysis.flow.step2')}
          state={step2Active ? 'active' : 'muted'}
        />
        <div
          className={`h-0.5 min-w-[12px] flex-1 rounded-full ${line23Class}`}
        />
        <StepPill step={3} label={t('analysis.flow.step3')} state="muted" />
      </div>
    </div>
  );
}

function StepPill({
  step,
  label,
  state,
}: {
  step: number;
  label: string;
  state: 'active' | 'done' | 'muted';
}) {
  const circle =
    state === 'active'
      ? 'border-[var(--app-accent)] bg-[var(--app-accent-subtle)] text-[var(--app-accent)]'
      : state === 'done'
        ? 'border-[var(--app-accent)] bg-[var(--app-accent-subtle)] text-[var(--app-accent)]'
        : 'border-[var(--app-border)] bg-[var(--app-canvas)] text-[var(--app-muted)]';

  const labelCls =
    state === 'muted' ? 'text-[var(--app-faint)]' : 'text-[var(--app-text)]';

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${circle}`}
        aria-current={state === 'active' ? 'step' : undefined}
      >
        {state === 'done' && step === 1 ? '✓' : step}
      </div>
      <span
        className={`max-w-[100px] text-center text-[11px] leading-tight font-medium sm:max-w-none sm:text-xs ${labelCls}`}
      >
        {label}
      </span>
    </div>
  );
}
