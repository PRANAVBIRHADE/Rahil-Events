<div align="center">

# ⚡ KRATOS 2026

**Annual Technical Festival Platform — Matoshri Pratishthan Group of Institutions, Nanded**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?logo=drizzle)](https://orm.drizzle.team/)

> **Live dates:** 20–21 April 2026 · Registration closes 18 April 2026

</div>

---

## 🏗️ Quick Start Guides
For a fast, simplified setup and usage guide, see our **ReadDoc Series**:
1. [**`readdoc1-get-started.md`**](./docs/readdoc1-get-started.md) — Local setup, environment variables, and running the dev server.
2. [**`readdoc2-new-features.md`**](./docs/readdoc2-new-features.md) — Overview of the latest UI polish, branding, and new sections.
3. [**`readdoc3-admin-manual.md`**](./docs/readdoc3-admin-manual.md) — How to manage events, verify payments, and upload landing page images.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.0 (App Router, Turbopack) |
| UI | React 19.2 + Tailwind CSS v4 + Framer Motion |
| Language | TypeScript 5 |
| Database | Neon Postgres via Drizzle ORM |
| Auth | Auth.js v5 beta (Credentials + Google OAuth) |
| Media | Cloudinary (CMS assets + participant uploads) |

---

## ✅ What's Working

- **Public pages** — landing (dynamic), events, schedule, gallery, about, contact (with maps), privacy, terms, sponsorships.
- **Image CMS** — Directly upload Hero and About section images from the admin panel (saved in DB).
- **Premium Branding** — Full institutional synchronization with **Matoshri Pratishthan**, featuring staggered animations.
- **Auth** — Google sign-in and email/password credentials.
- **Profile gate** — Participants must complete profile before registering.
- **Registrations** — Solo and team flows; free events auto-approve, paid events require proof upload.
- **Admin panel** — Events, organizers, schedule, registrations, **system settings**, results, check-in, users.
- **CSV exports** — Master registrations and payment proofs.
- **Tickets** — Downloadable entry passes with QR-based check-in links.
- **Real-time** — Live spectator counter and scrolling mission-comms announcements.

---

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and fill in every value:

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

## 🚀 Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Push database schema (Initial setup)
npx drizzle-kit push

# 3. (Optional) Seed base event data
npx tsx src/db/seed.ts

# 4. (Optional) Create admin account
npx tsx src/db/seed-admin.ts

# 5. Start dev server
npm run dev
```

---

## 📦 Deployment Checklist

1. Set **all** environment variables on your hosting platform.
2. Push the database schema → `npx drizzle-kit push` (on production DB).
3. Run `npx tsx src/db/seed-admin.ts` to bootstrap the first admin account.
4. Confirm Cloudinary preset, cloud name, and `NEXT_PUBLIC_SITE_URL`.
5. Validate the build → `npm run lint && npm run build`.

---

## 📂 Documentation Index

| File | Purpose |
|---|---|
| [`DOCUMENTATION.md`](./DOCUMENTATION.md) | Architecture, data model, admin ops, runtime rules |
| [`FEATURES.md`](./FEATURES.md) | Complete feature inventory for participants, admins, and system |
| [`real_data.md`](./real_data.md) | Single source of truth for all real-world festival data |
| [`PROJECT_TODO.md`](./PROJECT_TODO.md) | Remaining manual tasks before production launch |
| [**`readdoc1`**](./docs/readdoc1-get-started.md) | **Simplified Step 1: Getting Started** |
| [**`readdoc2`**](./docs/readdoc2-new-features.md) | **Simplified Step 2: New Features** |
| [**`readdoc3`**](./docs/readdoc3-admin-manual.md) | **Simplified Step 3: Admin Manual** |

---

<div align="center">
Built with ❤️ for **Matoshri Pratishthan Group of Institutions** by <a href="https://github.com/Rahil-dope">Rahil Hussain</a> &amp; <a href="https://github.com/PRANAVBIRHADE">Pranav Birhade</a>
</div>
