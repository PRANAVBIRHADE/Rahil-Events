# KRATOS 2026 Documentation

## Overview

This project is a festival operations platform built with the Next.js App Router. It supports public event discovery, participant authentication, profile completion, registration, payment proof uploads, admin verification, results publishing, and event-day check-in.

## Architecture

### App layer

- `src/app` contains public pages, admin pages, auth pages, and API routes.
- Route params already follow the async Next.js 16 pattern for dynamic routes.
- Global layout renders the navbar, announcement bar, motion layer, intro sequence, and footer.

### Data layer

- Neon Postgres is accessed through Drizzle in `src/db`.
- Core tables include `users`, `events`, `registrations`, `teams`, `team_members`, `schedule_slots`, `organizers`, `gallery_photos`, `announcements`, and `system_settings`.

### Auth layer

- Auth.js uses credentials and Google sign-in.
- Session and JWT types are augmented in `src/types/next-auth.d.ts`.
- `src/proxy.ts` protects `/admin/*` and `/dashboard/*`.

### Media layer

- Cloudinary is used for registration proof uploads and gallery uploads.
- `next.config.ts` now whitelists `res.cloudinary.com` for `next/image`.

## Important runtime rules

### Registration

- Paid events require transaction ID plus image proof.
- Free events skip payment proof and are created as approved registrations automatically.
- Team size validation happens server-side before the registration is stored.

### Schedule

- The current build assumes 2 days and 5 slots per day.
- Admin and public schedule views now use the confirmed KRATOS slot timings:
  - `10:30 AM - 11:00 AM`
  - `11:00 AM - 01:00 PM`
  - `01:00 PM - 01:30 PM`
  - `01:30 PM - 04:00 PM`
  - `04:00 PM - 05:30 PM`

### Tickets and QR links

- Ticket QR links use `window.location.origin` in the browser and fall back to `NEXT_PUBLIC_SITE_URL` only when needed.

## Admin operations

### Dashboard

- Shows participant count, approved team count, pending payments, verified payments, and revenue estimate.
- Links to exports, schedules, settings, organizers, proofs, users, results, and event management.

### Check-in

- Search supports registration ID prefixes, member names, and member phones.
- Check-in is only allowed for approved registrations.

### Settings

- Registration deadline values are now formatted in local time for the `datetime-local` input.

## Seeding and bootstrap

### Seed scripts

- `src/db/seed.ts` resets the main festival tables and seeds baseline event data.
- `src/db/seed-admin.ts` creates an admin safely without hardcoded credentials.
- Both scripts require `SEED_ADMIN_PASSWORD`.

### Why this changed

- The repo previously contained hardcoded admin passwords and an incomplete data reset path.
- Those defaults were not safe for deployment and could also leave stale child records behind.

## Validation commands

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Deployment notes

1. Set all required environment variables.
2. Push schema changes to the target database.
3. Seed or create the admin account with a strong `SEED_ADMIN_PASSWORD`.
4. Confirm Cloudinary upload preset, cloud name, and site URL.
5. Verify organizer contacts, results timing, and public content before launch.
