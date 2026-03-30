/**
 * Contract for all planned LLM integrations in auto-cv.
 * Nothing here is wired to a provider yet — for review and future implementation.
 *
 * Current production path (`runAnalysisJob` in `analyze.ts`) uses heuristics only.
 */

import type { AnalysisResult, RewriteSuggestion } from '../types/app';

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

/** Locale for prompts and model output (e.g. UI language). */
export type LlmLocale = 'en' | 'zh';

/**
 * Optional knobs for providers; callers may ignore until you add a real client.
 */
export interface LlmCallOptions {
  /** Override default model id/name for this call. */
  model?: string;
  /** Sampling temperature where applicable. */
  temperature?: number;
  /** Max output tokens (provider-specific interpretation). */
  maxOutputTokens?: number;
  /** User / UI language for prompts and structured output. */
  locale?: LlmLocale;
}

/** Normalized failure from any LLM call (transport, rate limit, safety, parse). */
export interface LlmCallError extends Error {
  readonly code:
    | 'network'
    | 'rate_limited'
    | 'provider'
    | 'parse'
    | 'aborted'
    | 'unknown';
  readonly cause?: unknown;
}

// ---------------------------------------------------------------------------
// Call IDs (stable identifiers for logging, routing, and feature flags)
// ---------------------------------------------------------------------------

export const LlmCallId = {
  /** Resume vs JD comparison: fit summary, gaps, trace rows, and rewrite suggestions. */
  analyzeResumeVsJd: 'analyze_resume_vs_jd',
  /**
   * Regenerate or refine one suggestion when the user asks for a different wording
   * (future; not in UI today).
   */
  refineRewriteSuggestion: 'refine_rewrite_suggestion',
  /**
   * Optional: extract structured JD lines (requirements) before trace mapping
   * (could be merged into `analyzeResumeVsJd` instead).
   */
  extractJdRequirementLines: 'extract_jd_requirement_lines',
} as const;

export type LlmCallId = (typeof LlmCallId)[keyof typeof LlmCallId];

// ---------------------------------------------------------------------------
// 1) analyzeResumeVsJd — main analysis pipeline
// ---------------------------------------------------------------------------

export interface AnalyzeResumeVsJdInput {
  resumeMarkdown: string;
  jd: string;
  options?: LlmCallOptions;
}

export interface AnalyzeResumeVsJdOutput {
  result: AnalysisResult;
  suggestions: RewriteSuggestion[];
}

/**
 * Primary product call: compare resume to job description and produce
 * `AnalysisResult` plus inline `RewriteSuggestion`s for the polish step.
 */
export type AnalyzeResumeVsJd = (
  input: AnalyzeResumeVsJdInput
) => Promise<AnalyzeResumeVsJdOutput>;

// ---------------------------------------------------------------------------
// 2) refineRewriteSuggestion — optional follow-up on one suggestion
// ---------------------------------------------------------------------------

export interface RefineRewriteSuggestionInput {
  resumeMarkdown: string;
  jd: string;
  /** The suggestion the user is editing (same shape as stored). */
  suggestion: RewriteSuggestion;
  /** Free-text instruction, e.g. “shorter”, “more formal”. */
  userInstruction: string;
  options?: LlmCallOptions;
}

export interface RefineRewriteSuggestionOutput {
  /** Updated suggestion with `id` preserved; `newText` replaced. */
  suggestion: RewriteSuggestion;
}

export type RefineRewriteSuggestion = (
  input: RefineRewriteSuggestionInput
) => Promise<RefineRewriteSuggestionOutput>;

// ---------------------------------------------------------------------------
// 3) extractJdRequirementLines — optional structured JD preprocessing
// ---------------------------------------------------------------------------

export interface ExtractJdRequirementLinesInput {
  jd: string;
  /** Max bullets/lines to return. */
  maxLines?: number;
  options?: LlmCallOptions;
}

export interface ExtractJdRequirementLinesOutput {
  /** Short requirement lines suitable for trace rows / snippets. */
  lines: string[];
}

export type ExtractJdRequirementLines = (
  input: ExtractJdRequirementLinesInput
) => Promise<ExtractJdRequirementLinesOutput>;

// ---------------------------------------------------------------------------
// Registry surface (implement once; inject or import from a single module)
// ---------------------------------------------------------------------------

/**
 * Maps each call id to its function signature. Implementations return Promises
 * and should throw `LlmCallError` (or wrap provider errors) on failure.
 */
export interface LlmCalls {
  [LlmCallId.analyzeResumeVsJd]: AnalyzeResumeVsJd;
  [LlmCallId.refineRewriteSuggestion]: RefineRewriteSuggestion;
  [LlmCallId.extractJdRequirementLines]: ExtractJdRequirementLines;
}
