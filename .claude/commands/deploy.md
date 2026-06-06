# /deploy

Deploy the current state of the repo to production.

## Steps

1. Check for uncommitted changes:
   ```bash
   git status
   ```

2. If there are uncommitted changes, stage and commit them:
   ```bash
   git add -A
   git commit -m "chore: deploy [brief description of changes]"
   ```
   If the working tree is already clean, skip to step 3.

3. Push to trigger Vercel auto-deploy:
   ```bash
   git push origin main
   ```

4. Confirm the push succeeded and report that Vercel deploy has been triggered via GitHub integration.

## Rules

- `git push origin main` is the deploy method — Vercel picks it up automatically via GitHub integration.
- Never use `npx vercel --prod` — that path is no longer needed and can cause issues with stale build artifacts.
- Never skip the push. The user wants changes live immediately.
- If there's nothing to push (already up to date), say so clearly.
