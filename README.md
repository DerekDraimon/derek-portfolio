# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Contact API (`/api/contact`) — local development

`api/contact.js` is a **Vercel Node.js Function**, not part of the Vite app.
`npm run dev` only runs Vite, so it does **not** execute anything under
`/api/*` — a request to `/api/contact` from the Vite dev server will 404.
To exercise the real handler locally, use the Vercel CLI instead:

```
npx vercel dev
```

`vercel dev` requires being logged in to a Vercel account (`npx vercel login`)
the first time it runs, since it links the local folder to a Vercel project
to resolve environment variables and build settings.

Required environment variables (set in `.env` locally, and in Vercel →
Project Settings → Environment Variables for Preview/Production):

| Var | Required | Notes |
|---|---|---|
| `RESEND_API_KEY` | yes | From the Resend dashboard. Without it, `/api/contact` returns `500 send_failed` for every submission (no emails will send). |
| `CONTACT_TO_EMAIL` | yes | Owner inbox that receives every submission. |
| `CONTACT_FROM_EMAIL` | yes | Resend-verified sender address (`onboarding@resend.dev` works without a custom domain, but can only deliver to the account owner). |
| `CONTACT_CONFIRMATION_ENABLED` | no (default off) | Set to the exact string `true` to also send the visitor a confirmation email. Requires a verified custom domain in Resend first — `onboarding@resend.dev` cannot deliver to arbitrary visitor addresses. Leave unset for v1. |
| `VITE_SITE_URL` | build-time | Canonical/OG absolute URL. |

Server code (`api/**`) can import plain JS modules from `src/lib/` — Vercel's
Node runtime traces local file imports at build time, so
`validateContactForm.js` is shared between client and server without
duplication. `api/_lib/` holds server-only helpers: Vercel treats any
`_`-prefixed file or folder under `api/` as non-routable, so nothing in
`api/_lib/` becomes its own endpoint.
