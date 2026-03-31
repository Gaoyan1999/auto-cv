import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

export const RESUME_HTML_PREVIEW_CLASS = 'resume-html-preview';

export function renderResumeHtmlFragment(source: string): string {
  if (!source.trim()) {
    return '<p class="resume-html-empty">Start typing resume Markdown…</p>';
  }
  return markdown.render(source);
}

export function resumeHtmlStyles(): string {
  return `
.${RESUME_HTML_PREVIEW_CLASS} {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Arial, sans-serif;
  color: #111827;
  line-height: 1.45;
  font-size: 14px;
}
.${RESUME_HTML_PREVIEW_CLASS} h1,
.${RESUME_HTML_PREVIEW_CLASS} h2,
.${RESUME_HTML_PREVIEW_CLASS} h3 {
  margin: 0.2em 0 0.35em;
  line-height: 1.22;
}
.${RESUME_HTML_PREVIEW_CLASS} h1 { font-size: 30px; }
.${RESUME_HTML_PREVIEW_CLASS} h2 {
  font-size: 20px;
  padding-bottom: 0.15em;
  border-bottom: 1px solid #d1d5db;
}
.${RESUME_HTML_PREVIEW_CLASS} h3 { font-size: 16px; }
.${RESUME_HTML_PREVIEW_CLASS} p,
.${RESUME_HTML_PREVIEW_CLASS} ul,
.${RESUME_HTML_PREVIEW_CLASS} ol { margin: 0.35em 0; }
.${RESUME_HTML_PREVIEW_CLASS} ul,
.${RESUME_HTML_PREVIEW_CLASS} ol { padding-left: 1.2em; }
.${RESUME_HTML_PREVIEW_CLASS} li + li { margin-top: 0.2em; }
.${RESUME_HTML_PREVIEW_CLASS} table {
  width: 100%;
  border-collapse: collapse;
  margin: 0.45em 0;
}
.${RESUME_HTML_PREVIEW_CLASS} th,
.${RESUME_HTML_PREVIEW_CLASS} td {
  border: 1px solid #d1d5db;
  padding: 0.28em 0.45em;
  text-align: left;
}
.${RESUME_HTML_PREVIEW_CLASS} code {
  background: #f3f4f6;
  border-radius: 4px;
  padding: 0.12em 0.3em;
  font-size: 0.93em;
}
.${RESUME_HTML_PREVIEW_CLASS} pre {
  background: #f3f4f6;
  border-radius: 6px;
  padding: 0.65em 0.75em;
  overflow: auto;
}
.${RESUME_HTML_PREVIEW_CLASS} blockquote {
  margin: 0.4em 0;
  padding: 0.15em 0.85em;
  border-left: 3px solid #d1d5db;
  color: #374151;
}
.${RESUME_HTML_PREVIEW_CLASS} .resume-html-empty {
  color: #6b7280;
}
  `.trim();
}

/** Full HTML document for PDF export — same markdown + CSS as the in-app preview. */
export function buildResumePdfHtml(markdownSource: string): string {
  const body = renderResumeHtmlFragment(markdownSource);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      @page { size: A4; margin: 0; }
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      body { margin: 0; background: #ffffff; }
      .page {
        width: 794px;
        min-height: 1123px;
        padding: 42px;
      }
      ${resumeHtmlStyles()}
    </style>
  </head>
  <body>
    <main class="page">
      <div class="${RESUME_HTML_PREVIEW_CLASS}">
        ${body}
      </div>
    </main>
  </body>
</html>`;
}

export async function downloadResumePdf(filename: string, source: string) {
  const apiBase = import.meta.env.VITE_APP_API_BASE ?? 'http://localhost:8787';
  const html = buildResumePdfHtml(source);
  const response = await fetch(`${apiBase}/api/resume/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html }),
  });
  if (!response.ok) {
    throw new Error(`PDF export failed with status ${response.status}`);
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  link.click();
  URL.revokeObjectURL(url);
}
