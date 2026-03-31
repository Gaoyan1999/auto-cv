import MarkdownIt from 'markdown-it';
import puppeteer, { type Browser } from 'puppeteer';

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

let browserPromise: Promise<Browser> | null = null;

function resumeHtmlStyles(): string {
  return `
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Arial, sans-serif;
    color: #111827;
    line-height: 1.45;
    font-size: 14px;
  }
  .resume-html-preview h1,
  .resume-html-preview h2,
  .resume-html-preview h3 {
    margin: 0.2em 0 0.35em;
    line-height: 1.22;
  }
  .resume-html-preview h1 { font-size: 30px; }
  .resume-html-preview h2 {
    font-size: 20px;
    padding-bottom: 0.15em;
    border-bottom: 1px solid #d1d5db;
  }
  .resume-html-preview h3 { font-size: 16px; }
  .resume-html-preview p,
  .resume-html-preview ul,
  .resume-html-preview ol { margin: 0.35em 0; }
  .resume-html-preview ul,
  .resume-html-preview ol { padding-left: 1.2em; }
  .resume-html-preview li + li { margin-top: 0.2em; }
  .resume-html-preview table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.45em 0;
  }
  .resume-html-preview th,
  .resume-html-preview td {
    border: 1px solid #d1d5db;
    padding: 0.28em 0.45em;
    text-align: left;
  }
  .resume-html-preview code {
    background: #f3f4f6;
    border-radius: 4px;
    padding: 0.12em 0.3em;
    font-size: 0.93em;
  }
  .resume-html-preview pre {
    background: #f3f4f6;
    border-radius: 6px;
    padding: 0.65em 0.75em;
    overflow: auto;
  }
  .resume-html-preview blockquote {
    margin: 0.4em 0;
    padding: 0.15em 0.85em;
    border-left: 3px solid #d1d5db;
    color: #374151;
  }
  `.trim();
}

function renderDocument(source: string): string {
  const body = source.trim()
    ? markdown.render(source)
    : '<p style="color:#6b7280">Start typing resume Markdown…</p>';
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <style>
      @page { size: A4; margin: 0; }
      ${resumeHtmlStyles()}
      .page {
        width: 794px;
        min-height: 1123px;
        padding: 42px;
      }
    </style>
  </head>
  <body>
    <main class="page">
      <div class="resume-html-preview">${body}</div>
    </main>
  </body>
</html>`;
}

async function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browserPromise;
}

export async function renderResumePdf(markdownSource: string): Promise<Uint8Array> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setContent(renderDocument(markdownSource), {
      waitUntil: 'networkidle0',
    });
    return await page.pdf({
      width: '794px',
      height: '1123px',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
    });
  } finally {
    await page.close();
  }
}
