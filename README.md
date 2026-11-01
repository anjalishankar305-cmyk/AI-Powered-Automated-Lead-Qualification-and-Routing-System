# Leadflow — AI lead qualification system

Leadflow turns inquiry messages into structured lead records, applies configurable budget qualification rules on the server, and provides a sales dashboard for follow-up.

## Requirements

- Node.js 20 or newer and npm
- MongoDB connection string for persistence
- Gemini API key for AI extraction (optional in development; a conservative local extractor is used when it is absent)

## Run locally

1. Install the root tooling with `npm install`.
2. Install app dependencies with `npm install --prefix server` and `npm install --prefix client`.
3. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`, `GEMINI_API_KEY`, and any desired qualification settings.
4. Run `npm run dev` from the project root. The UI runs at `http://localhost:5173` and the API at `http://localhost:5000`.

Without MongoDB, the API uses in-memory storage for local demos; records reset when the server restarts. Without Gemini, the local extractor identifies common budget, timeline, and company patterns. Configure both services for production.

## Configuration

See `server/.env.example`. The qualification threshold defaults to 10,000 USD. Non-USD amounts are sent for manual review unless they match the configured currency; the system never compares unlike currencies. Set `CLIENT_URL` to the deployed frontend origin. Set `VITE_API_URL` in the frontend build environment to the backend base URL (for example `https://api.example.com/api`).

## API

- `GET /api/health` — service and database status
- `POST /api/leads` — validate, extract, qualify, route, and save a lead
- `GET /api/leads` — list leads with optional `search`, `tier`, `urgency`, `status`, `page`, and `limit`
- `GET /api/leads/enterprise` — enterprise leads only
- `GET /api/leads/stats` — dashboard counts
- `GET /api/leads/:id` — lead detail

Dashboard and lead-management API routes are open in this MVP. Add authentication and authorization before production use, as required by the spec.

## Deploy

Deploy `client` as a Vite static site and `server` as a Node service, provision MongoDB Atlas, and configure the environment values above. Restrict `CLIENT_URL` to approved origins and use HTTPS. Keep API keys only in backend environment variables.
