# KRATOS 2026

KRATOS 2026 is a Next.js 16 festival platform for registrations, payment verification, schedule publishing, check-in, gallery uploads, and results management for Matoshri Pratishthan Group of Institutions.

## Stack

- Next.js 16.2.0
- React 19.2
- TypeScript
- Tailwind CSS v4
- Drizzle ORM + Neon Postgres
- Auth.js / NextAuth v5 beta
- Cloudinary uploads

## What is working

- Public landing pages for events, schedule, gallery, contact, about, privacy, terms, and sponsorships
- Participant auth with Google and credentials
- Profile completion gate before registration
- Solo and team registrations
- Free-event registration flow without payment proof
- Paid-event registration flow with Cloudinary proof upload
- Admin event, organizer, schedule, registration, settings, results, and check-in pages
- CSV exports for master registrations and payment proofs
- Ticket download and QR-based check-in links

## Environment variables

Copy `.env.example` to `.env.local` and set:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- `NEXT_PUBLIC_SITE_URL`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

## Local setup

```bash
npm install
npx drizzle-kit push
npm run lint
npm run dev
```

Optional seed commands:

```bash
npx tsx src/db/seed.ts
npx tsx src/db/seed-admin.ts
```

## Deployment checklist

1. Set every environment variable in the hosting platform.
2. Run the database schema push or migrations on the production database.
3. Seed or create an admin account with `SEED_ADMIN_PASSWORD` set.
4. Confirm Cloudinary preset and cloud name are correct.
5. Set `NEXT_PUBLIC_SITE_URL` to the final production domain so ticket QR links resolve correctly.
6. Run `npm run lint` and `npm run build`.

## Project handoff

- Detailed architecture and deployment notes: [DOCUMENTATION.md](/D:/WORK/Kratos%202k26/FINAL%20WEB/Rahil-Events/DOCUMENTATION.md)
- Feature inventory: [FEATURES.md](/D:/WORK/Kratos%202k26/FINAL%20WEB/Rahil-Events/FEATURES.md)
- Master data and launch checklist: [real_data.md](/D:/WORK/Kratos%202k26/FINAL%20WEB/Rahil-Events/real_data.md)
- Remaining manual work: [PROJECT_TODO.md](/D:/WORK/Kratos%202k26/FINAL%20WEB/Rahil-Events/PROJECT_TODO.md)
