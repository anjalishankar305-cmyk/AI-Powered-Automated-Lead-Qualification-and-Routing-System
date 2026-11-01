# Leadflow — AI lead qualification system

Leadflow turns inquiry messages into structured lead records, applies configurable budget qualification rules on the server, and provides a sales dashboard for follow-up.

## Requirements

- Node.js 20 or newer and npm
- MongoDB connection string for persistence
- Gemini API key for AI extraction (optional in development; a conservative local extractor is used when it is absent)

## Run locally

1. From the project root, install packages with `npm.cmd install`, `npm.cmd install --prefix server`, and `npm.cmd install --prefix client`. (`npm.cmd` avoids PowerShell's script execution policy blocking `npm.ps1`.)
2. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`, `GEMINI_API_KEY`, and any desired qualification settings.
3. Run `npm.cmd run dev` from the project root. The UI runs at `http://localhost:5173` and the API at `http://localhost:5000`.
4. Sign in locally with `admin@leadflow.local` / `leadflow-local-only`, or replace these development-only credentials in `server/.env`.

Without MongoDB, the API uses in-memory storage for local demos; records reset when the server restarts. Without Gemini, the local extractor identifies common budget, timeline, and company patterns. Configure both services for production.

## Configuration

See `server/.env.example`. The qualification threshold defaults to 10,000 USD. Non-USD amounts are sent for manual review unless they match the configured currency; the system never compares unlike currencies. Set `CLIENT_URL` to the deployed frontend origin. Set `VITE_API_URL` in the frontend build environment to the backend base URL (for example `https://api.example.com/api`).

## API

- `POST /api/auth/login` — exchange admin credentials for an 8-hour access token. All lead endpoints below require the resulting bearer token.

- `GET /api/health` — service and database status
- `POST /api/leads` — validate, extract, qualify, route, and save a lead
- `GET /api/leads` — list leads with optional `search`, `tier`, `urgency`, `status`, `page`, and `limit`
- `GET /api/leads/enterprise` — enterprise leads only
- `GET /api/leads/stats` — dashboard counts
- `GET /api/leads/:id` — lead detail

Dashboard and lead-management APIs require the admin login. Configure `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET`; production refuses to start without MongoDB and valid authentication settings.

## Deploy

For the complete Vercel + Render + MongoDB Atlas walkthrough, follow [DEPLOYMENT.md](./DEPLOYMENT.md). The repository includes `render.yaml` for the API and `client/vercel.json` for SPA deep links. Keep backend secrets in Render environment variables; never use `VITE_` prefixes for secrets.
