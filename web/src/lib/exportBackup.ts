import type {
  AnalysisResult,
  PersistedAppState,
  ResumeRecord,
  RewriteSuggestion,
} from '@/types/app';

export interface ExportPayload {
  exportedAt: string;
  app: 'job-resume-agent';
  version: 1;
  resumeMarkdown: string;
  jobDescription: string;
  analysis: AnalysisResult | null;
  suggestions: RewriteSuggestion[];
}

export interface ExportPayloadV2 {
  exportedAt: string;
  app: 'job-resume-agent';
  version: 2;
  resumes: ResumeRecord[];
}

export function downloadJson(
  filename: string,
  payload: ExportPayload | ExportPayloadV2
) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  a.click();
  URL.revokeObjectURL(url);
}

export function buildExportAllPayload(
  state: PersistedAppState
): ExportPayloadV2 {
  return {
    exportedAt: new Date().toISOString(),
    app: 'job-resume-agent',
    version: 2,
    resumes: state.resumes,
  };
}
