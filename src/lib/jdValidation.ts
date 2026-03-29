export type JdHint = 'empty' | 'too_short' | 'low_signal' | 'ok';

const MIN_CHARS = 120;
const MIN_LINES = 4;

export function assessJobDescription(text: string): {
  hint: JdHint;
  lineCount: number;
  charCount: number;
} {
  const trimmed = text.trim();
  const charCount = trimmed.length;
  const lineCount = trimmed
    ? trimmed.split(/\r?\n/).filter((l) => l.trim()).length
    : 0;

  if (!trimmed) {
    return { hint: 'empty', lineCount: 0, charCount: 0 };
  }
  if (charCount < MIN_CHARS || lineCount < MIN_LINES) {
    return { hint: 'too_short', lineCount, charCount };
  }

  const lower = trimmed.toLowerCase();
  const jdLike =
    /\b(responsibilit|requirement|qualification|experience|skill|year|must|should)\b/i.test(
      lower
    ) || /([$€£]|\d+\s*\+?\s*years?)/i.test(trimmed);

  if (!jdLike) {
    return { hint: 'low_signal', lineCount, charCount };
  }

  return { hint: 'ok', lineCount, charCount };
}
