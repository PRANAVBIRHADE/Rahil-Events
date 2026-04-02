<div align="center">

# KRATOS 2026

**Annual Technical Festival Platform - Matoshri Pratishthan Group of Institutions, Nanded**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?logo=drizzle)](https://orm.drizzle.team/)

> **Live dates:** 20-21 April 2026 - Registration closes 18 April 2026

</div>

---

## Quick Start Guides

For a fast, simplified setup and usage guide, see our **ReadDoc Series**:

1. [**`readdoc1-get-started.md`**](./docs/readdoc1-get-started.md) - Local setup, environment variables, and running the dev server.
2. [**`readdoc2-new-features.md`**](./docs/readdoc2-new-features.md) - Overview of the latest UI polish, branding, and new sections.
3. [**`readdoc3-admin-manual.md`**](./docs/readdoc3-admin-manual.md) - How to manage events, verify payments, and upload landing page images.
4. [**`readdoc4-future-scope.md`**](./docs/readdoc4-future-scope.md) - Post-launch improvements and pragmatic future enhancements.

---

## Tech Stack

<div align="center">

| Layer | Technology |
|:---:|:---|
| **Framework** | Next.js 16.2.0 (App Router, Turbopack) |
| **UI** | React 19.2 + Tailwind CSS v4 + Framer Motion |
| **Language** | TypeScript 5 |
| **Database** | Neon Postgres via Drizzle ORM |
| **Auth** | Auth.js v5 beta (Credentials + Google OAuth) |
| **Media** | Cloudinary (CMS assets + participant uploads) |

</div>

---

## Highlights & Features

> [!TIP]
> The platform provides a comprehensive administrative and participant experience tailored for large-scale collegiate events.

- **Premium Branding**: Full institutional synchronization with **Matoshri Pratishthan**, featuring polished animations and modern aesthetics.
- **Image CMS via Cloudinary**: Seamless uploads for Hero images, About section images, and payment proofs.
- **Authentication**: Robust Google OAuth plus email/password login. Profile completion is required before event registration.
- **Registrations**: Support for individual and team registrations. Free events auto-approve; paid events use a proof upload pipeline.
- **Admin Panel**: Full control over events, organizers, schedules, dynamic check-ins, system settings, results, and users.
- **Data Portability**: CSV exports for registrations and payment proofs.
- **Instant Ticketing**: Downloadable entry passes with QR-based digital check-ins.
- **Live Updates**: Real-time viewer counters and scrolling announcements powered from the database.

---

## Environment Variables

> [!WARNING]
> Duplicate `.env.example` to `.env.local` and fill in all values before startup. Do not commit credentials.

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
NEXT_PUBLIC_SITE_URL=
SEED_ADMIN_EMAIL=
SEED_ADMIN_PASSWORD=
```

---

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Push database schema (initial setup)
npx drizzle-kit push

# 3. (Optional) Seed base event data
npx tsx src/db/seed.ts

# 4. (Optional) Create admin account
npx tsx src/db/seed-admin.ts

# 5. Start dev server
npm run dev
```

---

## Deployment Checklist

> [!IMPORTANT]
> Ensure all checklist criteria are met for a safe production deployment.

- [ ] Set **all** environment variables on the hosting provider (for example Vercel or Railway)
- [ ] Push the database schema: `npx drizzle-kit push`
- [ ] Bootstrap the root admin account: `npx tsx src/db/seed-admin.ts`
- [ ] Validate the Cloudinary `preset`, `cloud name`, and `NEXT_PUBLIC_SITE_URL`
- [ ] Ensure the build succeeds locally via `npm run lint && npm run build`

---

## Documentation Index

| Resource | Purpose |
|:---|:---|
| [`DOCUMENTATION.md`](./DOCUMENTATION.md) | In-depth architecture, data model, admin operations, and runtime rules |
| [`FEATURES.md`](./FEATURES.md) | Granular inventory for participants, admins, and system entities |
| [`docs/readdoc4-future-scope.md`](./docs/readdoc4-future-scope.md) | Post-launch roadmap focused on UX, operations, and stability |
| [`real_data.md`](./real_data.md) | Single source of truth for all real-world festival parameters |
| [`PROJECT_TODO.md`](./PROJECT_TODO.md) | Final manual checks prior to launch |

<br/>

<div align="center">
Built with love for <b>Matoshri Pratishthan Group of Institutions</b> by <a href="https://github.com/Rahil-dope">Rahil Hussain</a> &amp; <a href="https://github.com/PRANAVBIRHADE">Pranav Birhade</a>
</div>
