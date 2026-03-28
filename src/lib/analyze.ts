import type { AnalysisResult, RewriteSuggestion } from '../types/app'

const STOP = new Set(
  [
    'the',
    'and',
    'for',
    'with',
    'you',
    'your',
    'our',
    'are',
    'this',
    'that',
    'from',
    'have',
    'has',
    'will',
    'not',
    'all',
    'any',
    'can',
    'may',
    'but',
    'was',
    'were',
    'been',
    'into',
    'about',
    'such',
    'also',
    'more',
    'than',
    'then',
    'their',
    'they',
    'them',
    'work',
    'team',
    'role',
    'job',
    'position',
    'company',
    'opportunity',
    'looking',
    'join',
    '等',
    '和',
    '与',
    '为',
    '了',
    '在',
    '是',
    '有',
    '将',
    '我们',
    '您',
    '岗位',
    '工作',
    '公司',
  ].map((s) => s.toLowerCase()),
)

function tokens(text: string): string[] {
  const m = text.toLowerCase().match(/[\p{L}\p{N}]+/gu)
  return m ?? []
}

function keywordScores(text: string): Map<string, number> {
  const freq = new Map<string, number>()
  for (const w of tokens(text)) {
    if (w.length < 3 || STOP.has(w)) continue
    freq.set(w, (freq.get(w) ?? 0) + 1)
  }
  return freq
}

function topKeywords(freq: Map<string, number>, n: number): string[] {
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k)
}

function jdRequirementLines(jd: string): string[] {
  const lines = jd
    .split(/\r?\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 12)
  const scored = lines.map((l) => {
    let s = 0
    if (/must|should|years|experience|required|strong|proficien|familiar/i.test(l)) {
      s += 2
    }
    if (/\d/.test(l)) {
      s += 1
    }
    if (l.length > 50) {
      s += 1
    }
    return { l, s }
  })
  return scored
    .sort((a, b) => b.s - a.s)
    .slice(0, 4)
    .map((x) => x.l)
}

function linkLabelForLine(jdLine: string, resume: string): string {
  const jdTok = new Set(tokens(jdLine))
  const resumeTok = new Set(tokens(resume))
  let overlap = 0
  for (const t of jdTok) {
    if (t.length < 4) continue
    if (resumeTok.has(t)) {
      overlap++
    }
  }
  if (overlap >= 3) {
    return 'Linked'
  }
  if (overlap >= 1) {
    return 'Partial'
  }
  return 'Gap'
}

function resumeNoteForLine(jdLine: string, resume: string): string {
  const label = linkLabelForLine(jdLine, resume)
  if (label === 'Linked') {
    return 'Resume: overlapping themes found; tighten wording to mirror JD phrasing where truthful.'
  }
  if (label === 'Partial') {
    return 'Resume: partial overlap; add a concrete bullet that reflects this requirement if accurate.'
  }
  return 'Resume: little explicit overlap; add evidence or reframe existing bullets without inventing facts.'
}

function pickMissingForBullets(
  resume: string,
  jdKeywords: string[],
  n: number,
): string[] {
  const r = new Set(tokens(resume))
  return jdKeywords.filter((k) => !r.has(k)).slice(0, n)
}

function extractBullets(md: string): { full: string; body: string }[] {
  const out: { full: string; body: string }[] = []
  for (const line of md.split(/\r?\n/)) {
    const trimmed = line.trimEnd()
    const m = trimmed.match(/^(\s*)([-*•]|\d+\.)\s+(.+)$/)
    if (!m) {
      continue
    }
    const body = m[3].trim()
    if (body.length < 8) {
      continue
    }
    out.push({ full: trimmed.trim(), body })
    if (out.length >= 6) {
      break
    }
  }
  return out
}

function buildSuggestions(
  resume: string,
  jdTop: string[],
  missing: string[],
): RewriteSuggestion[] {
  const bullets = extractBullets(resume)
  const suggestions: RewriteSuggestion[] = []
  let i = 0
  for (const b of bullets) {
    if (i >= 3) {
      break
    }
    const term =
      missing[i % Math.max(missing.length, 1)] ?? jdTop[i % Math.max(jdTop.length, 1)] ?? ''
    const newText = rewriteBulletLine(b.full, b.body, term, jdTop)
    if (newText.trim() === b.full.trim()) {
      continue
    }
    suggestions.push({
      id: `sg_${i}_${hash(b.full)}`,
      title: `AI suggestion · ${sectionHintFromBullet(b.body)}`,
      sectionHint: sectionHintFromBullet(b.body),
      oldText: b.full,
      newText,
    })
    i++
  }
  return suggestions
}

function sectionHintFromBullet(body: string): string {
  if (/engineer|developer|software|backend|frontend/i.test(body)) {
    return 'Experience'
  }
  if (/lead|manager|mentor/i.test(body)) {
    return 'Leadership'
  }
  return 'Experience'
}

function hash(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0
  }
  return Math.abs(h).toString(36)
}

function rewriteBulletLine(
  full: string,
  body: string,
  primaryTerm: string,
  jdTop: string[],
): string {
  const m = full.match(/^(\s*)([-*•]|\d+\.)\s+/)
  const prefix = m ? `${m[1]}${m[2]} ` : '- '
  const extra = jdTop.find((t) => !body.toLowerCase().includes(t)) ?? primaryTerm
  const base = body.replace(/\*\*/g, '').trim()
  if (!extra) {
    return `${prefix}${base}. Clarify scope, stakeholders, and outcomes you actually owned.`
  }
  return `${prefix}${base}. Tie this work to “${extra}” where it matches what you truly did—keep claims factual.`
}

export function analyzeResumeAgainstJd(
  resume: string,
  jd: string,
): { result: AnalysisResult; suggestions: RewriteSuggestion[] } {
  if (!resume.trim() || !jd.trim()) {
    return {
      result: {
        fitSummary:
          'Add both a resume and a job description to run a meaningful comparison. This is not a hiring prediction—only a structured fit review.',
        gaps: ['Paste a full posting and ensure your resume has content before running analysis.'],
        traceRows: [],
      },
      suggestions: [],
    }
  }

  const jdFreq = keywordScores(jd)
  const resumeFreq = keywordScores(resume)
  const jdTop = topKeywords(jdFreq, 48)
  const overlap = jdTop.filter((k) => resumeFreq.has(k))
  const missing = pickMissingForBullets(resume, jdTop, 10)

  const fitSummary =
    overlap.length >= 8
      ? `Solid overlap on themes such as ${overlap.slice(0, 4).join(', ')}. Keep tightening language to mirror the JD where truthful.`
      : overlap.length >= 3
        ? `Some alignment on ${overlap.slice(0, 3).join(', ')}, but several JD keywords are not clearly reflected in the resume yet.`
        : `Limited keyword overlap so far. Consider reframing existing bullets to surface relevant skills without inventing experience.`

  const gaps: string[] = []
  if (missing.length) {
    gaps.push(
      `Keywords not clearly mirrored yet: ${missing.slice(0, 5).join(', ')}. Add evidence only where accurate.`,
    )
  }
  gaps.push(
    'Stakeholder communication / leadership: if the JD stresses this, surface it with real examples you can defend in an interview.',
  )

  const reqLines = jdRequirementLines(jd)
  const traceRows = (reqLines.length ? reqLines : [jd.split(/\n/).find((l) => l.trim().length > 20) ?? jd.slice(0, 120)]).map(
    (line) => ({
      jdSnippet: line.length > 160 ? `${line.slice(0, 157)}…` : line,
      resumeNote: resumeNoteForLine(line, resume),
      linkLabel: linkLabelForLine(line, resume),
    }),
  )

  const suggestions = buildSuggestions(resume, jdTop, missing)

  return {
    result: { fitSummary, gaps, traceRows },
    suggestions,
  }
}

export async function runAnalysisJob(
  resume: string,
  jd: string,
): Promise<{ result: AnalysisResult; suggestions: RewriteSuggestion[] }> {
  await new Promise((r) => setTimeout(r, 900))
  return analyzeResumeAgainstJd(resume, jd)
}
