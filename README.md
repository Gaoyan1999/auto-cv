# auto-cv

**Job Application Assistant** — a web app for job seekers: edit your resume in Markdown in the browser, paste a job description (JD), and get structured fit analysis and rewrite suggestions. The MVP is local-first with no login; data stays in the browser by default.

This repo holds the product spec, UI design notes, and a high-fidelity Pencil prototype (`.pen`).

## Documentation

| Document | Description |
|----------|-------------|
| [docs/job-resume-agent-mvp-spec.md](docs/job-resume-agent-mvp-spec.md) | MVP spec: scope, principles, capabilities, and explicit non-goals |
| [docs/ui-agent.md](docs/ui-agent.md) | Desktop web UI direction and screen list (for design and implementation) |

## Initialize the GitHub remote

This machine may not have the [GitHub CLI](https://cli.github.com/) (`gh`). Use either path below.

### Option A: Create on GitHub, then push

1. Create a new repo: **https://github.com/new**  
   - Name it e.g. `auto-cv`  
   - Do **not** check “Add a README” (avoids conflicts if you already have local history)  
   - After creation, copy the **HTTPS** or **SSH** URL.

2. In your project directory (replace the URL with yours):

   ```bash
   cd /Users/daniel/Workspace/auto-cv
   git remote add origin https://github.com/<your-username>/auto-cv.git
   git push -u origin main
   ```

   If your default branch is `master`, run `git branch -M main` before pushing.

### Option B: GitHub CLI one-shot

```bash
brew install gh
gh auth login
cd /Users/daniel/Workspace/auto-cv
gh repo create auto-cv --public --source=. --remote=origin --push
```

(If the remote already exists from the web UI, only `git remote add` + `git push` may be needed.)

## License

Add a license via **Settings → General → License** on GitHub, or add a `LICENSE` file at the repo root.
