# Job Application Assistant — MVP Product Specification

**Document status:** Draft aligned with current product decisions  
**Last updated:** 2026-03-28

## One-line summary

A **web-only** application that helps job seekers **store and edit their resume locally**, **paste a job description (JD)**, and receive **structured match analysis and rewrite suggestions**—without login, with data kept in the browser first; **stronger JD capture automation** is planned as a second phase.

---

## Problem statement

Job seekers applying to many roles struggle to:

- Judge how well their resume fits a specific JD.
- Know **what to strengthen** when the fit is weak.
- Rewrite bullets so they align with the JD **without inventing experience**.

Manually comparing a JD to a resume is slow; generic chat tools lack **structured, auditable** resume–JD alignment and safe editing workflows.

## Primary user

Active job seekers who apply to multiple postings (including role or industry switches) and want higher signal per application without spending hours on each JD.

---

## Product principles

1. **Honest analysis:** Frame outputs as **fit / gaps / actionable edits**, not precise “success probability.” Avoid language that sounds like a guarantee.
2. **Fact safety:** The product **rephrases and reorganizes** based on user-provided facts; it does **not** fabricate employment history, metrics, or credentials.
3. **Privacy-first MVP:** No account required; **resume and JD content stay in the browser** by default (see Storage).
4. **Ship a thin vertical slice:** Web app first; **browser extension only when paste friction is validated**.

---

## MVP scope (must ship)

### Platform

| Decision | Choice |
|----------|--------|
| Client | **Web application** (desktop-first acceptable; mobile-friendly where cheap) |
| Authentication | **None** in v1 |
| Persistence | **Browser local storage** — prefer **IndexedDB** for full resume + JD payloads (avoid `localStorage` size limits) |
| JD input | **Paste text** as the supported path for v1 |

### Core capabilities

1. **Resume workspace**
   - Create / edit / preview **at least one** resume.
   - Format: **Markdown** for v1 (LaTeX and rich templates are **out of scope** for MVP unless explicitly reprioritized).

2. **JD ingestion**
   - Single primary input: **paste JD plain text** (large text area).
   - **Paste enhancement:** detect reasonable JD-like content (length, structure) and guide the user if input looks empty or irrelevant.

3. **Analysis (against current resume + pasted JD)**
   - **Fit summary:** strengths and gaps relative to the JD (avoid single “probability scores”; use qualitative bands or structured lists with reasons).
   - **Gap list:** what to strengthen (skills, experience framing, keywords) when fit is weak.
   - **Traceability:** where possible, tie suggestions to **specific JD requirements** and **resume sections**.

4. **Rewrite assistance**
   - Suggest edits **grounded in user-provided bullets** (reorder, rephrase, emphasize).
   - **Explicit user control:** side-by-side or diff-style **accept / reject**; no silent overwrite of the canonical resume.

5. **Data safety for users without accounts**
   - **Export / backup:** e.g. download resume (and optional analysis metadata) as JSON or Markdown so clearing the browser does not mean total loss.
   - Short **privacy copy** on how data is stored and whether it is sent to a model API (if applicable).

### Explicit non-goals (MVP)

- User accounts and cloud sync.
- Guaranteed automatic **full-page fetch** of JDs from LinkedIn / Seek / etc. via URL (often blocked by auth, CORS, or terms of use from the **browser alone**).
- LaTeX authoring pipeline.
- Fully automated scraping of third-party job boards.

---

## Automation roadmap (after MVP)

Automation should **reduce friction**, not block launch.

| Phase | Mechanism | Purpose |
|-----|-----------|---------|
| **MVP** | Paste + optional **clipboard read** (with user permission) | Fewer steps than manual Cmd+V in some flows |
| **Phase 2a** | **Bookmarklet** or similar lightweight capture | Send selected or visible text from a job page into the app |
| **Phase 2b** | **Minimal browser extension** | Only forwards readable page text to the already-open web app; **editing stays in the web app** |
| **Later (evaluate)** | Server-assisted URL fetch | Only if there is clear demand, budget for compliance, and a sustainable approach to third-party sites |

**Rationale:** A **standalone site** ships faster, keeps the editor in one codebase, and fits **no-login + local-first** storage. Extensions are valuable for **“get JD from this tab”** but add store review and DOM maintenance; defer until users complain about paste fatigue.

---

## Key risks and mitigations

| Risk | Mitigation |
|------|------------|
| Overclaiming “chance of getting hired” | Product copy and model prompts emphasize **fit and gaps**, not hiring odds. |
| Hallucinated resume facts | Constrained rewrite flows; user confirmation before committing text; optional “facts I assert are true” checkpoint. |
| Data loss without cloud | IndexedDB + export/backup; in-app warnings before destructive actions. |
| Competitors (generic LLM chat) | Differentiate with **structured JD↔resume mapping**, **version-safe editing**, and **local-first privacy** positioning. |

---

## Success metrics (suggested for post-MVP review)

- Repeat use: users return with **multiple JDs** (sessions or new analyses per week).
- Qualitative: users report **clearer next edits** and less time per application.
- Technical: low rate of “analysis failed” or empty outputs for valid pasted JDs.

---

## Open decisions (track outside this MVP)

- Monetization (subscription, pay-per-use, B2B).
- Whether **server-side** LLM calls are required and how **retention/logging** is described to users.
- Internationalization and locale-specific hiring norms.

---

## Document history

| Version | Date | Notes |
|---------|------|--------|
| 0.1 | 2026-03-28 | Initial spec from MVP alignment (web, no login, IndexedDB, paste-first, automation phased). |
