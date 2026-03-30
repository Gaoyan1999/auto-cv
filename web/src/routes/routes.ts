import type { AppTab } from '@/types/app';

/**
 * Route patterns for `<Route path={...}>` — keep in sync with path builders below.
 */
export const RoutePattern = {
  Root: '/',
  List: '/list',
  Polish: '/polish/:resumeId',
  PolishSection: '/polish/:resumeId/:section',
} as const;

/**
 * Concrete paths for `<Navigate to>` and redirects.
 * Prefer `useAppNavigate()` for imperative navigation from components.
 */
export const AppPath = {
  list: (): string => RoutePattern.List,
  polish: (resumeId: string, section: AppTab): string =>
    `/polish/${resumeId}/${section}`,
} as const;
