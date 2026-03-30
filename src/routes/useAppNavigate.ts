import { useMemo } from 'react';
import { useNavigate, type NavigateOptions } from 'react-router-dom';
import type { AppTab } from '@/types/app';
import { AppPath } from './routes';

/**
 * Typed navigation — do not call `navigate('/...')` with raw strings in feature code.
 */
export function useAppNavigate() {
  const navigate = useNavigate();

  return useMemo(
    () => ({
      goToList: (options?: NavigateOptions) => navigate(AppPath.list(), options),
      goToPolish: (
        resumeId: string,
        section: AppTab,
        options?: NavigateOptions
      ) => navigate(AppPath.polish(resumeId, section), options),
    }),
    [navigate]
  );
}
