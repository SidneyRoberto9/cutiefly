# Cutiefly

[![Tests](https://github.com/SidneyRoberto9/cutiefly/actions/workflows/ci.yml/badge.svg)](https://github.com/SidneyRoberto9/cutiefly/actions/workflows/ci.yml)

A disposable URL shortener with a public API. Paste a long link, get a short one — or call the API and get it back as JSON.

![Landing Page](public/assets/base.png "Landing Page")

Live: https://cutiefly-sid.vercel.app

## Problem

Most shorteners want an account before they give you a link, and they keep that link — and its click data — forever. Cutiefly takes the opposite position: no sign-up, no tracking of who clicked what, and **every link is deleted after 7 days**. It exists for the throwaway case — a link in a chat message, a QR code on a slide, a share that stops mattering next week.

The API is the point as much as the UI: one `POST` with no key, no OAuth dance, no SDK.

## Features

- **Shorten a URL** — 16-character `nanoid` code, generated server-side.
- **Custom codes** — supply your own code (max 16 characters); rejected with `400` if already taken.
- **Redirect** — `GET /<code>` resolves the code and redirects; unknown codes render a 404 page.
- **Public API** — no authentication, `fetch`-able from anywhere, rate limited to 10 requests per minute per IP.
- **Private links** — `visible: false` keeps a link out of the public "Recent URLs" list; the link itself still works.
- **Recent URLs** — the 3 most recent public links on the home page, with copy-to-clipboard and relative age.
- **Weekly purge** — a GitHub Actions cron calls `POST /api/clean` with a shared secret every Monday at 03:00 UTC, deleting everything older than 7 days.

Not implemented: click analytics, accounts, link editing or deletion by the user.

## Architecture

```
Browser ──────────────┐
                      │
                      ▼
        Next.js 15 (App Router, Vercel)
        ├── /                 UI (React 19, Tailwind, shadcn/ui)
        ├── /[code]           Server Component → redirect()
        └── /api/*            Route Handlers
                      │
                      ▼
        Prisma 6 + @prisma/adapter-neon
                      │
                      ▼
        Neon (serverless PostgreSQL over WebSocket)

GitHub Actions (cron, Mon 03:00 UTC) ──► POST /api/clean (Bearer secret)
```

One process, one table. No queue, no cache, no background worker — the cleanup job is an external cron hitting an HTTP endpoint, which is all a 7-day TTL needs.

**Data model** (`prisma/schema.prisma`):

| Field         | Type       | Notes                                    |
| ------------- | ---------- | ---------------------------------------- |
| `id`          | `String`   | `cuid()`                                 |
| `originalUrl` | `String`   | target                                   |
| `shortCode`   | `String`   | unique — the lookup key                  |
| `createdAt`   | `DateTime` | drives the 7-day purge                   |
| `isPrivate`   | `Boolean`  | hides the link from the public recents    |

## API

### `POST /api/shorten`

```ts
await fetch("https://cutiefly-sid.vercel.app/api/shorten", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: "https://example.com/a/very/long/link",
    code: "my-custom-code", // optional, max 16 chars
    visible: false, // optional, omit from the public recents list
  }),
})
```

| Field     | Type      | Required | Default              | Constraints                              |
| --------- | --------- | -------- | -------------------- | ---------------------------------------- |
| `url`     | `string`  | yes      | —                    | parseable, `http:`/`https:`, ≤ 2048 chars |
| `code`    | `string`  | no       | `nanoid(16)`         | `[A-Za-z0-9_-]`, ≤ 16 chars              |
| `visible` | `boolean` | no       | `true` (link listed) | —                                        |

`200` → `{ "url": "https://cutiefly-sid.vercel.app/<code>" }`
`400` → `{ "error": "Invalid url, only http and https are allowed" }`, `{ "error": "Code too long, maximum 16 characters" }`, `{ "error": "Invalid code, use letters, numbers, hyphen or underscore" }` or `{ "error": "Short code already exists" }`
`429` → `{ "error": "Too many requests, try again in a minute" }`

### `GET /api/urls`

The 3 most recent **public** links, newest first, as raw `Url` rows.

### `POST /api/clean`

Deletes every link older than 7 days. Requires `Authorization: Bearer $CLEANUP_SECRET`; anything else gets `401`. Returns `{ "success": true }`. Called by the scheduled workflow.

### `GET /<code>`

`307` redirect to the original URL, or the 404 page if the code is unknown or expired.

## Security

- **URL validation** — `POST /api/shorten` parses `url` with the WHATWG `URL` constructor and accepts only `http:` and `https:`, capped at 2048 characters. `javascript:`, `data:` and `file:` URIs are rejected with `400`, so `/[code]` never hands one to `redirect()`.
- **Custom code validation** — codes are matched against `[A-Za-z0-9_-]` and capped at 16 characters, so a code can never contain a path separator or reshape the redirect URL.
- **Rate limiting** — 10 requests per minute per IP on `POST /api/shorten`, keyed on the first entry of `x-forwarded-for`. The window is held in memory, so it is per serverless instance: a cold start or a second instance resets the counter. Good enough to stop a naive loop, not a distributed flood — the upgrade path is Upstash/Redis, marked in `src/lib/rate-limit.ts`.
- **`/api/clean`** — `POST` behind `Authorization: Bearer $CLEANUP_SECRET`. Missing or wrong secret returns `401`, and a deploy without `CLEANUP_SECRET` set fails closed.
- **Code generation** — `nanoid(16)` (≈95 bits, not guessable by enumeration). Custom codes are checked for collision before insert, so codes are unique but **not** secret — anyone can request a code and see whether it is taken.
- **Private links** — `isPrivate` only removes the link from `GET /api/urls`. It is not access control; anyone with the code can follow it.

Still open: the rate limit is not shared across instances, and there is no abuse reporting or blocklist for links that get shortened here.

## Testing

Vitest + Testing Library, jsdom environment, Prisma mocked with `vitest-mock-extended`. 43 tests across 13 files, run on every push and PR to `master` (`.github/workflows/ci.yml`).

```bash
pnpm test
```

| Area           | Covered                                                                      |
| -------------- | ---------------------------------------------------------------------------- |
| Route handlers | `shorten` (generated code, custom code, too long, bad charset, bad protocol, collision, 429), `urls`, `clean` (authorized, missing/wrong/unset secret) |
| Redirect page  | known code redirects, unknown code renders the 404                            |
| Components     | form submit + loading state + API error message, list fetch/empty/copy, container refresh, 404 |
| Layout/page    | metadata and render smoke tests                                               |
| Helpers        | protocol allowlist, rate-limit window and per-client isolation, IP extraction |

## Running locally

Requires Node 18+ and a PostgreSQL database reachable through the Neon serverless driver (a free Neon project is the path of least resistance).

```bash
pnpm install          # runs `prisma generate` via postinstall
cp .env.example .env  # then fill in the values below
pnpm prisma migrate dev
pnpm dev
```

| Variable               | Purpose                                             |
| ---------------------- | --------------------------------------------------- |
| `DATABASE_URL`         | Neon pooled connection string                       |
| `DIRECT_URL`           | Neon direct connection, used by migrations          |
| `NEXT_PUBLIC_BASE_URL` | Origin used to build returned links, e.g. `http://localhost:3000` |
| `CLEANUP_SECRET`       | Bearer token required by `POST /api/clean`; set the same value as the `CLEANUP_SECRET` repository secret used by the cron workflow |

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS + shadcn/ui · Prisma 6 · Neon PostgreSQL · Vitest · Vercel
