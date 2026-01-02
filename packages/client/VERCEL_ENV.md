Vercel environment variables

- `OPENAI_API_KEY` (required) — your OpenAI API key used by the serverless function at `/api/chat`.
- `HF_TOKEN` (optional) — Hugging Face token if you later use HF endpoints.

Set these under your Vercel Project → Settings → Environment Variables and redeploy the project.

Notes:
- The serverless function is `packages/client/api/chat/route.ts` and returns JSON { id, message }.
- Keep secrets private and do not commit them to git.
