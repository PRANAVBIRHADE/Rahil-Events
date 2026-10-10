<div align="center">

# ⚡ KRATOS 2026 Platform

### Technical Festival Management & Registration Engine

[![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45.1-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-Serverless-00E599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-environment-variables">Environment</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-routes--endpoints">Routes & APIs</a> •
  <a href="#-operations-guide">Operations</a> •
  <a href="#-deployment">Deployment</a>
</p>

</div>

---

## 📖 Overview

**KRATOS 2026** is the full-stack event management and participant registration platform for the annual technical festival of **Matoshri Pratishthan Group of Institutions (MPGI), School of Engineering, Nanded**. It is built on **Next.js 16 (App Router)** and **React 19**, pairing a neo-brutalist public portal with a staff admin command center.

The platform covers the festival lifecycle: solo and team registration, offline UPI payment verification with Cloudinary screenshots, multi-day schedule management, gamified XP leveling, digital fast-entry passes with QR codes, Email/WhatsApp broadcasts, and walk-in desk check-ins.

### Documentation

| Guide | What it covers |
|:---|:---|
| [BUILD_AND_RUN_GUIDE.md](BUILD_AND_RUN_GUIDE.md) | Local setup, database, production build, deployment, troubleshooting |
| [QUICKSTART.md](QUICKSTART.md) | Short command cheat sheet |
| [ADMIN_GUIDE.md](ADMIN_GUIDE.md) | Approve/reject registrations, CSV exports, walk-in desk |
| [FEATURES.md](FEATURES.md) | Participant, volunteer, and admin feature overview |

---

## ✨ Key Features

### 🎓 Participant Experience
- **Interactive 3D Multiverse Scene**: Three.js / React Three Fiber DNA helix with kinetic scattering and live camera framing.
- **Dynamic Event Discovery (`/events`)**: Event briefs, prizes, venues, and Solo / Team / Solo-Pair formats.
- **Registration Flow (`/register`)**: Team and individual signup with fee calculation and Cloudinary payment screenshot upload.
- **Live Status Tracking (`/status`)**: Lookup by phone number or transaction ID (`PENDING`, `APPROVED`, `REJECTED`).
- **Participant Dashboard (`/dashboard`)**:
  - Digital fast-entry pass with unique QR code
  - Personalized Day 1 / Day 2 schedule
  - Team message room
  - Role-gated event gallery uploads
- **Gamified Progression**: XP tracking (100 XP per registration, 200 XP per level) and public leaderboard (`/leaderboard`).
- **Squad Finder (`/squads`)**: Board to recruit teammates for team events.
- **Profile Completion (`/profile/complete`)**: Extra academic details after Google sign-in.
- **Sponsorships, Privacy, Terms**: Public pages at `/sponsorships`, `/privacy`, and `/terms`.
- **Real-Time Presence**: Concurrent viewer heartbeat (`/api/presence`).

### 🛡️ Administrative & Volunteer Operations (`/admin/*`)
- **Role-Based Access Control (RBAC)**: `ADMIN`, `VOLUNTEER`, and `PARTICIPANT` enforced in `src/proxy.ts` and Server Actions.
- **Review Queue (`/admin/registrations`, `/admin/verify/[id]`)**: Payment screenshots, transaction IDs, team manifests, bulk approve/reject/delete.
- **Walk-in Desk (`/admin/desk`)**: On-site registration without a pre-created student account. There is no separate QR scanner screen; event-day fallback is this desk workflow.
- **Event Management (`/admin/events`)**: Categories, team sizes, fees, venues, winner podiums.
- **Schedule Builder (`/admin/schedule`)**: Day 1 / Day 2 slots, stages, and venues.
- **Committee Directory (`/admin/organizers`)**: Student leads, faculty coordinators, departments.
- **Notification Hub (`/admin/settings`)**: Email (SMTP) and WhatsApp (Twilio) broadcasts.
- **CSV Exports**:
  - `/api/admin/export?dataset=participants`
  - `/api/admin/export?dataset=users`
  - `/api/admin/proofs`
- **Emergency Kill Switch**: Pause registrations via `/admin/settings` or `REGISTRATION_KILL_SWITCH`.

---

## 🏗️ Architecture

```mermaid
flowchart TD
    subgraph Client["Client Tier"]
        Browser["Desktop & Mobile Browser"]
        PWA["PWA Service Worker & Manifest"]
    end

    subgraph Edge["Edge & Security Layer"]
        Proxy["Proxy Route Guardian (src/proxy.ts)"]
        RateLimit["Sliding Window Rate Limiter (src/lib/rate-limit.ts)"]
    end

    subgraph AppRouter["Next.js 16 App Router (React 19)"]
        PublicPages["Public Pages (/, /events, /register, /status, /dashboard)"]
        AdminPages["Admin Portal (/admin/registrations, /admin/desk, /admin/events)"]
        ServerActions["Server Actions (src/lib/actions.ts)"]
        APIRoutes["Route Handlers (/api/admin/export, /api/presence, /api/team)"]
    end

    subgraph Services["External & Data Services"]
        NeonDB[("Neon Serverless PostgreSQL\n(Drizzle ORM)")]
        Cloudinary["Cloudinary CDN\n(Proof & Media Storage)"]
        AuthJS["Auth.js v5\n(Google OAuth + Credentials)"]
        Nodemailer["Nodemailer\n(SMTP Email Campaigns)"]
        Twilio["Twilio REST API\n(WhatsApp Broadcasts)"]
    end

    Browser --> Proxy
    PWA --> Proxy
    Proxy --> RateLimit
    RateLimit --> PublicPages
    RateLimit --> AdminPages
    PublicPages --> ServerActions
    AdminPages --> ServerActions
    PublicPages --> APIRoutes
    AdminPages --> APIRoutes

    ServerActions --> NeonDB
    ServerActions --> Cloudinary
    ServerActions --> AuthJS
    ServerActions --> Nodemailer
    ServerActions --> Twilio
    APIRoutes --> NeonDB
```

---

## 💻 Tech Stack

| Layer | Technologies | Purpose |
|:---|:---|:---|
| **Core Framework** | Next.js 16.2.0 (App Router), React 19.2.4 | Server Components, Server Actions, React Compiler |
| **Language** | TypeScript 5.x | Schemas, actions, and UI typing |
| **Styling** | Tailwind CSS 4, Lucide React | Neo-brutalist / cyberpunk layout |
| **3D & Motion** | Three.js 0.184, @react-three/fiber 9, Drei 10, Framer Motion 12, GSAP 3 | DNA scene and transitions |
| **Database** | Neon PostgreSQL, Drizzle ORM 0.45.1, Drizzle Kit 0.31.10 | Schema and migrations |
| **Auth** | Auth.js v5, bcryptjs, @auth/drizzle-adapter | Google OAuth + staff credentials |
| **Storage** | Cloudinary (next-cloudinary) | Payment proofs and gallery |
| **Notifications** | Nodemailer 7, Twilio REST API | Email and WhatsApp campaigns |
| **Utilities** | qrcode.react, html2canvas | Ticket passes and image capture |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** `v20.x` or later (`v18.x` minimum)
- **npm** `v9.x` or later
- **PostgreSQL**: [Neon](https://neon.tech) (recommended) or local PostgreSQL 15+
- **Cloudinary** account for payment screenshots

### 1. Clone the Repository
```bash
git clone https://github.com/PRANAVBIRHADE/Rahil-Events.git
cd Rahil-Events
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

`.env*` files are gitignored. Create `.env.local` in the project root (PowerShell: `New-Item .env.local`).

```env
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
AUTH_SECRET="replace-with-32-plus-character-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-unsigned-upload-preset"

SEED_ADMIN_EMAIL="admin@kratos.fest"
SEED_ADMIN_PASSWORD="YourSecurePassword123!"
```

Generate `AUTH_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Run Database Migrations
```bash
npx drizzle-kit migrate
```

### 5. Seed the Super Administrator
```bash
npm run seed:admin
```

Expected output:
```
🚀 Bootstrapping admin account: admin@kratos.fest...
✅ Admin account created successfully!
👉 You can now log in at /auth/adminlogin
```

If the email already exists, the seed script elevates that account to `ADMIN`.

### 6. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Staff portal: [http://localhost:3000/auth/adminlogin](http://localhost:3000/auth/adminlogin).

For production build steps, Docker, and troubleshooting, see [BUILD_AND_RUN_GUIDE.md](BUILD_AND_RUN_GUIDE.md).

---

## 🔐 Environment Variables

| Variable | Required | Context | Description |
|:---|:---:|:---|:---|
| `DATABASE_URL` | **Yes** | Server | PostgreSQL connection string |
| `AUTH_SECRET` | **Yes** | Server | Auth.js JWT signing secret (32+ chars) |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Client/Server | Canonical URL (`http://localhost:3000` in dev) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | **Yes** | Client | Cloudinary cloud name |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | **Yes** | Client | Unsigned upload preset |
| `SEED_ADMIN_EMAIL` | **Yes** | CLI | Email for `npm run seed:admin` (default `admin@kratos.fest`) |
| `SEED_ADMIN_PASSWORD` | **Yes** | CLI | Strong password for the seeded admin |
| `ADMIN_SETUP_KEY` | Optional | Server | Token required for `/auth/adminregister` |
| `AUTH_GOOGLE_ID` | Optional | Server | Google OAuth client ID (Auth.js v5) |
| `AUTH_GOOGLE_SECRET` | Optional | Server | Google OAuth client secret |
| `SMTP_HOST` | Optional | Server | SMTP host |
| `SMTP_PORT` | Optional | Server | `587` (TLS) or `465` (SSL) |
| `SMTP_USER` | Optional | Server | SMTP username |
| `SMTP_PASS` | Optional | Server | SMTP password / app password |
| `SMTP_FROM` | Optional | Server | From header, e.g. `KRATOS 2026 <noreply@example.com>` |
| `TWILIO_ACCOUNT_SID` | Optional | Server | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Optional | Server | Twilio Auth Token |
| `TWILIO_WHATSAPP_FROM` | Optional | Server | WhatsApp sender, e.g. `whatsapp:+14155238886` |
| `REGISTRATION_KILL_SWITCH` | Optional | Server | `true` / `false` to pause registrations |
| `REGISTRATION_KILL_SWITCH_MESSAGE` | Optional | Server | Banner shown when registrations are paused |

WhatsApp broadcasts are enabled only when `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_WHATSAPP_FROM` are all set (not `TWILIO_PHONE_NUMBER`).

<details>
<summary><b>Example <code>.env.local</code></b></summary>

```env
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
AUTH_SECRET="generate-a-long-random-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-unsigned-preset"

SEED_ADMIN_EMAIL="admin@kratos.fest"
SEED_ADMIN_PASSWORD="change-me"
ADMIN_SETUP_KEY="optional-staff-signup-token"

# Optional notifications
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="you@example.com"
SMTP_PASS="app-password"
SMTP_FROM="KRATOS 2026 <you@example.com>"

TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_WHATSAPP_FROM="whatsapp:+14155238886"

REGISTRATION_KILL_SWITCH="false"
REGISTRATION_KILL_SWITCH_MESSAGE="Registrations are temporarily paused."
```
</details>

---

## 📁 Project Structure

```
Rahil-Events/
├── src/
│   ├── app/                      # Next.js 16 App Router
│   │   ├── page.tsx              # Landing page
│   │   ├── events/               # Catalog and /events/[slug]/register
│   │   ├── register/ status/ dashboard/ leaderboard/ squads/
│   │   ├── about/ contact/ organizers/ sponsorships/
│   │   ├── privacy/ terms/ profile/complete/
│   │   ├── admin/                # Staff portal
│   │   ├── auth/                 # /login, /register, /adminlogin, /adminregister
│   │   └── api/                  # export, proofs, presence, team messages, auth
│   ├── components/
│   │   ├── admin/ dashboard/ layout/ marketing/
│   │   ├── organizers/ profile/ squads/ ui/
│   ├── db/                       # Neon client + Drizzle schema
│   ├── lib/                      # actions, authz, env, notifications, rate-limit, xp
│   ├── auth.ts                   # Auth.js (Google + staff credentials)
│   ├── proxy.ts                  # Edge route protection
│   └── types/
├── drizzle/                      # SQL migrations (0000–0005)
├── public/                       # Branding, PWA manifest, service worker
├── scripts/                      # seed-admin, update-fee, update-live-dates, get-admins
├── drizzle.config.ts
├── next.config.ts
└── package.json
```

---

## 🌐 Routes & Endpoints

### Public Web Experience
| Route | Access | Description |
|:---|:---:|:---|
| `/` | Public | Landing page: 3D DNA scene, live counter, marquee |
| `/events` | Public | Event catalog |
| `/events/[slug]` | Public | Event detail |
| `/events/[slug]/register` | Public | Per-event registration |
| `/register` | Public | Global registration + UPI proof upload |
| `/status` | Public | Lookup by phone or transaction ID |
| `/leaderboard` | Public | XP rankings |
| `/squads` | Public | Teammate matchmaking |
| `/about` | Public | Festival / institution |
| `/contact` | Public | Support and location |
| `/organizers` | Public | Committee directory |
| `/sponsorships` | Public | Sponsorship inquiry |
| `/privacy` `/terms` | Public | Legal pages |
| `/profile/complete` | Signed-in | Complete student profile |
| `/dashboard` | Participant | Pass, schedule, team chat, gallery |

### Authentication
| Route | Access | Description |
|:---|:---:|:---|
| `/auth/login` | Public | Student Google / credentials login |
| `/auth/register` | Public | Student account signup |
| `/auth/adminlogin` | Public | Staff sign-in (`ADMIN` / `VOLUNTEER`) |
| `/auth/adminregister` | `ADMIN_SETUP_KEY` | Privileged staff signup |

### Admin (`/admin/*`)
| Route | Role | Description |
|:---|:---:|:---|
| `/admin/dashboard` | Staff | Metrics overview |
| `/admin/registrations` | Staff | Registry, search, bulk actions |
| `/admin/verify/[id]` | Staff | Receipt audit and approve/reject |
| `/admin/desk` | Staff | Walk-in entries |
| `/admin/events` | Admin | Event CRUD |
| `/admin/schedule` | Admin | Slot grid |
| `/admin/organizers` | Admin | Committee directory |
| `/admin/results` | Admin | Livestream / winner reveal |
| `/admin/users` | Admin | Role management |
| `/admin/settings` | Admin | Kill switch, UPI, deadlines, deployment checks |

### API
| Endpoint | Role | Description |
|:---|:---:|:---|
| `/api/admin/export?dataset=participants` | Staff | Registrations + team members CSV |
| `/api/admin/export?dataset=users` | Staff | User directory CSV |
| `/api/admin/proofs` | Staff | Payment proof ledger CSV |
| `/api/presence` | Public | Viewer heartbeat / count |
| `/api/team/[id]/messages` | Participant | Team chat |
| `/api/auth/[...nextauth]` | Public | Auth.js handlers |

---

## 🛠️ Operations Guide

### 1. Payment Verification
1. Sign in at `/auth/adminlogin`.
2. Open **Registrations** (`/admin/registrations`).
3. **Review** a `PENDING` row.
4. Check details, team, UPI Transaction ID, and screenshot.
5. **Approve** or **Reject**. Status updates on `/status` and unlocks `/dashboard` for the student.

### 2. Event-Day Walk-In Desk (`/admin/desk`)

The live event-day fallback is this manual desk. There is no separate scanner page.

1. Open `/admin/desk` on a tablet or phone.
2. Select the event.
3. Enter name, phone, and academic details.
4. Add extra team members if needed.
5. Submit to write the entry immediately.

### 3. CSV Exports
While signed in as staff:
```bash
# Participants & teams
curl -b "authjs.session-token=<TOKEN>" "http://localhost:3000/api/admin/export?dataset=participants" -o participants.csv

# Users
curl -b "authjs.session-token=<TOKEN>" "http://localhost:3000/api/admin/export?dataset=users" -o users.csv

# Payment proofs
curl -b "authjs.session-token=<TOKEN>" "http://localhost:3000/api/admin/proofs" -o payment_proofs.csv
```

### 4. Kill Switch
1. Toggle **Registration Paused** in `/admin/settings`, or
2. Set `REGISTRATION_KILL_SWITCH="true"` on the host and redeploy.
3. Optionally set `REGISTRATION_KILL_SWITCH_MESSAGE`.

---

## 🧰 Available Scripts

| Script | Command | Purpose |
|:---|:---|:---|
| Development | `npm run dev` | Dev server at `http://localhost:3000` |
| Production build | `npm run build` | Optimized production bundle |
| Production start | `npm run start` | Run the compiled server |
| Lint | `npm run lint` | ESLint 9 |
| Admin seed | `npm run seed:admin` | Create or elevate the super admin |
| Migrate | `npx drizzle-kit migrate` | Apply `./drizzle` SQL |
| Push schema | `npx drizzle-kit push` | Push `src/db/schema.ts` directly |
| Studio | `npx drizzle-kit studio` | Visual DB browser |

---

## 🚢 Deployment

Designed for Vercel, Railway, Render, or a Node host. Full platform notes are in [BUILD_AND_RUN_GUIDE.md](BUILD_AND_RUN_GUIDE.md).

### Vercel (recommended)

1. Push to GitHub and import the repo in [Vercel](https://vercel.com).
2. Set production env vars: `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, Cloudinary keys, plus optional SMTP/Twilio.
3. Build command: `npm run build`. Output: `.next`.
4. Apply migrations before go-live:
   ```bash
   npx drizzle-kit migrate
   ```
5. Seed admin if the production database is empty: `npm run seed:admin`.
6. Confirm `/admin/settings` deployment checks after first deploy.

### Self-hosted
```bash
npm run build
NODE_ENV=production npm run start
```

---

## 🔒 Security

- Admin routes and Server Actions check staff roles (`isStaffRole` / `assertAdminAction`). Unauthorized users are sent to `/auth/adminlogin` or `/dashboard`.
- Sliding-window IP rate limits on sensitive flows (`src/lib/rate-limit.ts`).
- CSP and related headers in `next.config.ts`.
- Neon serverless driver for connection-safe Postgres.
- Image domains limited to Cloudinary in `next.config.ts`.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-change`
3. Lint and build: `npm run lint` and `npm run build`
4. Open a pull request describing the change.

---

## 👥 Maintainers

**KRATOS 2026 Platform**

- **Lead Developer**: **Rahil Hussain** ([@ifeelrahiii](https://www.instagram.com/ifeelrahiii)) • [rahilhussain431601@gmail.com](mailto:rahilhussain431601@gmail.com)
- **Co-Lead Developer**: **Pranav Birhade** ([@PRANAVBIRHADE](https://github.com/PRANAVBIRHADE)) • ([@code_track_](https://www.instagram.com/code_track_))
- **Organizing Body**: MPGI School of Engineering Technical Committee • [kratos2k26.mpgi@gmail.com](mailto:kratos2k26.mpgi@gmail.com)

<div align="center">
<sub>Built for the students and organizers of KRATOS 2026.</sub>
</div>
