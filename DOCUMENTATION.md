# KRATOS 2026 — Technical Documentation

> **For developers and future maintainers.**
> This document covers the architecture, data model, runtime rules, admin operations, and deployment procedures for the KRATOS 2026 festival platform.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Model](#data-model)
3. [Auth & Middleware](#auth--middleware)
4. [Media Handling](#media-handling)
5. [Registration Rules](#registration-rules)
6. [Schedule System](#schedule-system)
7. [Admin Operations](#admin-operations)
8. [Seed & Bootstrap](#seed--bootstrap)
9. [Validation & Build](#validation--build)
10. [Deployment](#deployment)

---

## Architecture Overview

The platform is built on the **Next.js 16 App Router** with server components and server actions as the primary data-fetching and mutation layer.

```
src/
├── app/             ← All routes (public, admin, auth, API)
├── components/      ← UI components (layout, marketing, dashboard, admin, ui)
├── db/              ← Drizzle ORM schema, seed scripts, and DB client
├── lib/             ← Server actions, utility functions, XP logic
├── types/           ← Augmented NextAuth session & JWT types
└── proxy.ts         ← Edge-level middleware for route protection
```

### Key Route Groups

| Route prefix | Purpose |
|---|---|
| `/` | Public landing and marketing pages |
| `/events/*` | Public event listing and detail pages |
| `/auth/*` | Authentication pages (login, register, admin login) |
| `/dashboard` | Authenticated participant dashboard |
| `/admin/*` | Admin-only management panel |
| `/api/*` | API routes (auth, presence, exports, proofs) |

---

## Data Model

All tables live in **Neon Postgres** and are managed through **Drizzle ORM** (`src/db/`).

| Table | Description |
|---|---|
| `users` | Participants and admins |
| `events` | Festival events with fee, format, and capacity |
| `registrations` | Root record per registration (status, payment) |
| `teams` | Team metadata linked to a registration |
| `team_members` | Individual participants within a team |
| `schedule_slots` | 2-day × 5-slot schedule grid |
| `organizers` | Public-facing organizer directory |
| `gallery_photos` | Participant-uploaded photos (Cloudinary URLs) |
| `announcements` | Single active scrolling announcement |
| `system_settings` | Deadline, gallery lock, results timing, **and Landing Page Image assets** |

> Schema changes are applied with `npx drizzle-kit push` (development) or migrations in production.

---

## Auth & Middleware

- **Auth.js v5 beta** powers authentication with two providers:
  - **Google OAuth** — one-click sign-in
  - **Credentials** — email + bcrypt password
- Session and JWT types are extended in `src/types/next-auth.d.ts` to carry `role` and `id`.
- **`src/proxy.ts`** is an edge middleware that:
  - Redirects unauthenticated users away from `/dashboard/*`
  - Blocks non-admins from `/admin/*`
  - Enforces profile completion before registration

---

## Media Handling

- All file uploads (payment proofs, gallery photos) are sent to **Cloudinary** via `next-cloudinary`.
- `next.config.ts` whitelists `res.cloudinary.com` in the `next/image` remote patterns.
- Upload preset and cloud name must be set in environment variables before any upload will work.

---

## Registration Rules

| Rule | Detail |
|---|---|
| **Profile gate** | User must complete their profile before they can register for any event |
| **Free events** | Registration status is set to `approved` automatically; no proof upload |
| **Paid events** | Requires a transaction ID and a screenshot uploaded to Cloudinary |
| **Team size** | Validated server-side; mismatches are rejected before the record is created |
| **One registration per event** | A user cannot re-register for an event they are already registered for |

---

## Schedule System

The current UI is built for exactly **2 days × 5 slots per day**. The confirmed KRATOS 2026 time slots are:

| Slot | Time Range |
|---|---|
| 1 | 10:30 AM – 11:00 AM |
| 2 | 11:00 AM – 01:00 PM |
| 3 | 01:00 PM – 01:30 PM (Lunch) |
| 4 | 01:30 PM – 04:00 PM |
| 5 | 04:00 PM – 05:30 PM |

> If you need a different slot structure, the `schedule_slots` schema and the admin schedule UI will both need to be updated.

---

## Admin Operations

### Dashboard

Quick overview metrics:
- Total participants, approved teams, pending payments, verified payments, revenue estimate
- Shortcut links to: exports · schedule · settings · organizers · payment proofs · users · results · events

### Registrations & Payment Verification

- Admin reviews uploaded payment proof images
- Actions: **Approve** (sets status to `approved`, sends no email) or **Reject** (with a reason note)
- CSV export available for all registrations and for payment proofs separately

### Check-In

- Search by registration ID prefix, member name, or member phone
- Only `approved` registrations can be checked in
- Checking in sets a timestamp and marks the record as attended

### Results

- Configured with a `resultsRevealTime` from system settings
- Results page is locked until that time
- Admin sets the YouTube embed URL and per-event winners (top 3) from the results panel

### Settings & Image CMS

- Registration open/closed toggle
- Registration deadline (stored as UTC, formatted in local time for the `datetime-local` input)
- Gallery lock toggle
- Results reveal timestamp
- Active announcement text
- **Landing Page Image Assets**: Upload Hero and About section images directly to Cloudinary via the dashboard. These are stored in `system_settings` and served automatically on the landing page.

### Contact & Organizers

- **Organizers**: Manage faculty and student coordinator cards.
- **Contact Page**: A hybrid system displaying official college info, the organizer directory, and an embedded Google Map pointing to the Nanded campus.

---

## Seed & Bootstrap

Two seed scripts are provided in `src/db/`:

| Script | Purpose |
|---|---|
| `seed.ts` | Resets all festival tables and seeds base event data |
| `seed-admin.ts` | Creates a single admin account using `SEED_ADMIN_EMAIL` + `SEED_ADMIN_PASSWORD` |

Both scripts require `SEED_ADMIN_PASSWORD` to be set. Never commit credentials.

```bash
npx tsx src/db/seed.ts
npx tsx src/db/seed-admin.ts
```

> ⚠️ `seed.ts` **deletes all existing data** before re-seeding. Do not run in production unless you intend to reset.

---

## Validation & Build

Run these before every deployment:

```bash
npm run lint          # ESLint via eslint-config-next
npx tsc --noEmit      # TypeScript type check without emitting files
npm run build         # Full production build (Turbopack)
```

All three must pass with exit code 0 before going live.

---

## Deployment

1. Set all required environment variables on the host (see `.env.example`).
2. Push the schema: `npx drizzle-kit push` on the production database.
3. Bootstrap the admin: `npx tsx src/db/seed-admin.ts`.
4. Confirm `NEXT_PUBLIC_SITE_URL` matches the production domain (used for ticket QR links).
5. Confirm Cloudinary preset and cloud name are correct.
6. Run `npm run lint && npm run build` and verify exit code 0.
7. Deploy. Verify a complete registration flow (free + paid) in production.
