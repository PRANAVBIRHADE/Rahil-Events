<div align="center">

# ⚡ KRATOS 2026 Platform

### Next-Generation Technical Festival Management & Registration Engine

[![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45.1-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-Serverless-00E599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

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

**KRATOS 2026** is a full-stack, enterprise-grade event management and participant registration platform custom-built for the annual engineering technical festival of **MPGI Engineering**. Engineered on **Next.js 16 (App Router)** and **React 19**, it pairs a high-performance neo-brutalist public web portal with a real-time administrative command center.

The platform handles the entire festival lifecycle end-to-end: frictionless solo and team event registration, offline UPI payment verification with Cloudinary screenshot processing, dynamic multi-day schedule orchestration, gamified XP leveling, digital fast-entry passes with QR code generation, broadcast notifications over Email and WhatsApp, and high-throughput walk-in desk check-ins.

---

## ✨ Key Features

### 🎓 Participant Experience
- **Interactive 3D Multiverse Scene**: Three.js / React Three Fiber interactive DNA helix with kinetic scattering, live camera responsive framing, and particle systems.
- **Dynamic Event Discovery (`/events`)**: Detailed event briefs, technical specifications, prize pools, venues, and flexible registration formats (Solo, Team, Solo/Pair).
- **Frictionless Registration Flow (`/register`)**: Fast team and individual registrations with client-side validation, automated fee calculation, and Cloudinary-powered payment screenshot upload.
- **Live Status Tracking (`/status`)**: Public real-time registration verification by phone number or transaction ID with instant status badges (`PENDING`, `APPROVED`, `REJECTED`).
- **Participant Command Center (`/dashboard`)**:
  - **Digital Fast-Entry Pass**: Dynamic SVG/Canvas ticket pass with unique QR code verification.
  - **Personalized Schedule**: Chronological reporting timeline across Day 1 and Day 2.
  - **Team Collaboration Chat**: Real-time team message room for registered squad members.
  - **Event Gallery**: Participant photo sharing pipeline with role-gated upload access.
- **Gamified Progression System**: Automated XP tracking (100 XP per registration, 200 XP per level), rank leveling, and real-time festival leaderboard (`/leaderboard`).
- **Squad Finder (`/squads`)**: Social community board to recruit teammates and form rosters for competitive team events.
- **Real-Time Presence**: Live active concurrent viewer counter heartbeat on public pages (`/api/presence`).

### 🛡️ Administrative & Volunteer Operations (`/admin/*`)
- **Role-Based Access Control (RBAC)**: Strict separation of privileges across `ADMIN`, `VOLUNTEER`, and `PARTICIPANT` roles enforced at Edge proxy (`proxy.ts`) and Server Action level.
- **Review & Verification Queue (`/admin/registrations`, `/admin/verify/[id]`)**:
  - Full audit of payment screenshots, transaction IDs, leader details, and team member manifests.
  - One-click approval, rejection, and inline verification notes with automated status propagation.
  - Bulk approval, rejection, and deletion operations for high-volume batches.
- **Walk-in Fast-Track Desk (`/admin/desk`)**: Sub-10-second on-site registration terminal for chaotic venue walk-ins without requiring pre-created student accounts.
- **Event Management Engine (`/admin/events`)**: Complete CRUD suite for event categories, team size constraints, registration fees, venues, and winner podium assignments.
- **Festival Schedule Builder (`/admin/schedule`)**: Grid-based slot allocator for Day 1 and Day 2 events, stages, breaks, and venue assignments.
- **Committee Directory Manager (`/admin/organizers`)**: Manage student leads, faculty coordinators, departments, and social profiles.
- **Campaign Notification Hub (`/admin/settings`)**: Multi-channel broadcast dispatcher supporting mass and event-filtered Email (SMTP) and WhatsApp (Twilio) messages.
- **One-Click CSV Data Exports (`/api/admin/export`, `/api/admin/proofs`)**:
  - `dataset=participants`: Comprehensive manifest including team members, contacts, and transaction IDs.
  - `dataset=users`: Full user registry with academic branch, year, college, and XP level.
  - `/api/admin/proofs`: Consolidated payment verification ledger.
- **Emergency Kill Switch & Lockdown**: System-wide configuration toggles to pause registrations (`REGISTRATION_KILL_SWITCH`), freeze media galleries, or broadcast urgent marquee alerts.

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
| **Core Framework** | Next.js 16.2.0 (App Router), React 19.2.4 | Server Components, Server Actions, React Compiler optimization |
| **Language & Typing** | TypeScript 5.x | End-to-end type safety across schemas, actions, and UI |
| **Styling & Design** | Tailwind CSS 4, Lucide React, Neo-brutalist Design | Responsive cyberpunk aesthetic with custom border layouts |
| **3D & Animation** | Three.js 0.184, @react-three/fiber 9, Drei 10, Framer Motion 12, GSAP 3 | Interactive 3D DNA multiverse scene and kinetic transitions |
| **Database & ORM** | Neon Serverless PostgreSQL, Drizzle ORM 0.45.1, Drizzle Kit 0.31.10 | Scalable relational database with automated schema migrations |
| **Authentication** | Auth.js v5 (beta.30), bcryptjs, @auth/drizzle-adapter | Session-based JWT authentication, Google OAuth, Credential hashing |
| **Asset Storage** | Cloudinary (next-cloudinary) | Unsigned direct client uploads for UPI payment proofs and gallery |
| **Notifications** | Nodemailer 7 (SMTP), Twilio REST API | Automated transactional alerts and administrative mass campaigns |
| **Utilities & Export** | qrcode.react, html5-qrcode, html2canvas | Ticket pass generation, QR verification, and canvas image capture |

---

## 🚀 Quick Start

Follow these steps to clone, configure, and boot the development environment locally.

### Prerequisites
- **Node.js**: `v20.x` or later (`v18.x` minimum)
- **npm**: `v9.x` or later (or `pnpm` / `yarn`)
- **PostgreSQL Database**: [Neon](https://neon.tech) serverless Postgres instance (recommended) or local PostgreSQL `15+`
- **Cloudinary Account**: Free tier cloud for handling payment screenshots

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
Create a local environment file from the provided template:
```bash
cp .env.example .env.local
```

Edit `.env.local` and configure your database and authentication secrets:
```env
# Database connection string (Neon Postgres)
DATABASE_URL="postgres://user:password@ep-example-pooler.neon.tech/kratos?sslmode=require"

# NextAuth secret key (generate with: openssl rand -base64 32)
AUTH_SECRET="your-generated-32-char-random-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Cloudinary unsigned upload configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-unsigned-upload-preset"

# Initial administrator bootstrap credentials
SEED_ADMIN_EMAIL="admin@kratos.fest"
SEED_ADMIN_PASSWORD="YourSecurePassword123!"
```

### 4. Run Database Migrations
Push the Drizzle relational schema to your PostgreSQL database:
```bash
npx drizzle-kit migrate
```

### 5. Seed the Super Administrator Account
Bootstrap the initial administrative account using the CLI seed runner:
```bash
npm run seed:admin
```
> **Output:**
> ```
> 🚀 Bootstrapping admin account: admin@kratos.fest...
> ✅ Admin account created successfully!
> 👉 You can now log in at /auth/adminlogin
> ```

### 6. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Access the staff control portal at [http://localhost:3000/auth/adminlogin](http://localhost:3000/auth/adminlogin).

---

## 🔐 Environment Variables

| Variable | Required | Context | Description & Example |
|:---|:---:|:---|:---|
| `DATABASE_URL` | **Yes** | Server | PostgreSQL connection string (`postgresql://user:pass@host/db?sslmode=require`) |
| `AUTH_SECRET` | **Yes** | Server | Secret for signing Auth.js JWT tokens (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Client/Server | Canonical web URL (`http://localhost:3000` or `https://kratos.mpgi.in`) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | **Yes** | Client | Cloudinary cloud account name |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | **Yes** | Client | Unsigned upload preset for image and payment uploads |
| `SEED_ADMIN_EMAIL` | **Yes** | CLI Tool | Email for `npm run seed:admin` (default: `admin@kratos.fest`) |
| `SEED_ADMIN_PASSWORD` | **Yes** | CLI Tool | Strong password for bootstrapped administrator |
| `ADMIN_SETUP_KEY` | Optional | Server | Master registration token to create staff via `/auth/adminregister` |
| `AUTH_GOOGLE_ID` | Optional | Server | Google Cloud OAuth Client ID for social sign-in |
| `AUTH_GOOGLE_SECRET` | Optional | Server | Google Cloud OAuth Client Secret |
| `SMTP_HOST` | Optional | Server | SMTP mail host (`smtp.gmail.com` or `smtp.resend.com`) |
| `SMTP_PORT` | Optional | Server | SMTP mail port (`587` for TLS or `465` for SSL) |
| `SMTP_USER` | Optional | Server | SMTP username / sender account |
| `SMTP_PASS` | Optional | Server | SMTP password or app-specific password |
| `SMTP_FROM` | Optional | Server | Sender address header (e.g. `KRATOS 2026 <noreply@kratos.fest>`) |
| `TWILIO_ACCOUNT_SID` | Optional | Server | Twilio Account SID for WhatsApp broadcasts |
| `TWILIO_AUTH_TOKEN` | Optional | Server | Twilio Auth Token |
| `TWILIO_WHATSAPP_FROM` | Optional | Server | Twilio WhatsApp sender number (`whatsapp:+14155238886`) |
| `REGISTRATION_KILL_SWITCH` | Optional | Server | Emergency toggle (`true` / `false`) pausing all registrations |
| `REGISTRATION_KILL_SWITCH_MESSAGE` | Optional | Server | Custom outage banner displayed to students |

<details>
<summary><b>Example <code>.env.local</code> Template</b></summary>

```bash
# Database
DATABASE_URL="postgresql://kratos_owner:npg_secret@ep-cool-base-12345.ap-southeast-1.aws.neon.tech/kratos?sslmode=require"

# NextAuth v5
AUTH_SECRET="f6c8d76e4c730245089e9beaf14c62e5849842f1f50a49856ad8cbefc8d6264e"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Cloudinary Storage
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="kratos-fest"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="kratos_receipts"

# Administrative Bootstrap
SEED_ADMIN_EMAIL="admin@kratos.fest"
SEED_ADMIN_PASSWORD="SuperSecretAdminPassword2026!"
ADMIN_SETUP_KEY="kratos-committee-bootstrap-token"

# Multi-channel Dispatcher (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="kratos2k26.mpgi@gmail.com"
SMTP_PASS="xxxx xxxx xxxx xxxx"
SMTP_FROM="KRATOS 2026 <kratos2k26.mpgi@gmail.com>"

TWILIO_ACCOUNT_SID="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
TWILIO_AUTH_TOKEN="your_auth_token_here"
TWILIO_WHATSAPP_FROM="whatsapp:+14155238886"

# Emergency Safety Controls (Optional)
REGISTRATION_KILL_SWITCH="false"
REGISTRATION_KILL_SWITCH_MESSAGE="Registrations are temporarily paused for server maintenance."
```
</details>

---

## 📁 Project Structure

```
Rahil-Events/
├── src/
│   ├── app/                      # Next.js 16 App Router hierarchy
│   │   ├── (public pages)        # /, /events, /register, /status, /leaderboard, /squads, /about
│   │   ├── admin/                # Staff portal (/dashboard, /registrations, /verify, /desk, /events)
│   │   ├── auth/                 # Auth flows (/login, /register, /adminlogin, /adminregister)
│   │   ├── dashboard/            # Participant portal (fast-entry QR pass, schedule, team chat)
│   │   ├── api/                  # Edge & Server Route Handlers
│   │   │   ├── admin/export/     # CSV stream generator for participants and users
│   │   │   ├── admin/proofs/     # Payment proof verification ledger export
│   │   │   ├── auth/             # Auth.js route handlers ([...nextauth])
│   │   │   ├── presence/         # Dynamic concurrent viewer counter
│   │   │   └── team/[id]/        # Real-time team messaging endpoints
│   │   ├── layout.tsx            # Root HTML layout with providers & motion wrappers
│   │   └── globals.css           # Tailwind CSS 4 configuration and global tokens
│   ├── components/               # Modular React 19 UI component library
│   │   ├── admin/                # Verification tables, modals, broadcast & walk-in forms
│   │   ├── dashboard/            # Ticket passes, QR generators, team chat, gallery uploader
│   │   ├── layout/               # Navbar, Footer, Announcement marquee, Providers
│   │   ├── marketing/            # Hero, DnaHorizonScene (Three.js), Schedule, Countdown
│   │   └── ui/                   # Brutalist buttons, cards, badges, inputs, QR components
│   ├── db/                       # Drizzle ORM configuration & relational data model
│   │   ├── index.ts              # Neon database client connection pooler
│   │   └── schema.ts             # PostgreSQL schemas (users, events, registrations, teams, etc.)
│   ├── lib/                      # Core backend utilities & application logic
│   │   ├── actions.ts            # Next.js Server Actions (CRUD, registration, audit)
│   │   ├── authz.ts              # RBAC route guards & session verification assertions
│   │   ├── env.ts                # Environment variable parsing and capability detection
│   │   ├── notifications.ts      # Multi-channel campaign dispatcher (Email & WhatsApp)
│   │   ├── rate-limit.ts         # Sliding-window IP-based rate limiter
│   │   ├── registration.ts       # Registration calculation and state helpers
│   │   ├── schedule.ts           # Festival schedule sorting and indexing
│   │   ├── utils.ts              # Style merging (clsx + tailwind-merge)
│   │   └── xp.ts                 # Gamification XP calculator & leveling engine
│   ├── auth.ts                   # Auth.js configuration (Google + Credentials handlers)
│   ├── proxy.ts                  # Edge route protection & role redirection proxy
│   └── types/                    # TypeScript interfaces and module augmentations
├── drizzle/                      # Drizzle SQL migration files (0000 - 0005)
├── public/                       # Static public assets (logos, images, PWA manifest, sw.js)
├── scripts/                      # Operational CLI scripts (seed-admin, update-fee, etc.)
├── .env.example                  # Reference environment variable template
├── drizzle.config.ts             # Drizzle Kit migration & connection settings
├── next.config.ts                # Next.js compiler flags, security headers & image domains
├── package.json                  # Dependencies, engine constraints & execution scripts
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## 🌐 Routes & Endpoints

### Public Web Experience
| Route | Method | Access | Description |
|:---|:---:|:---:|:---|
| `/` | GET | Public | Festival landing page with 3D DNA multiverse, live counter & marquee |
| `/events` | GET | Public | Event discovery catalog with category filters and rules |
| `/events/[slug]` | GET | Public | Deep-dive event specification, prizes, schedule, and team limits |
| `/events/[slug]/register` | GET/POST | Public | Direct event registration form with team members input |
| `/register` | GET/POST | Public | Global registration wizard with UPI QR and Cloudinary receipt uploader |
| `/status` | GET | Public | Public participant lookup by phone number or transaction ID |
| `/leaderboard` | GET | Public | Gamification rankings and top participant XP leaderboard |
| `/squads` | GET/POST | Public | Squad matchmaking board to find teammates for group competitions |
| `/about` | GET | Public | Festival heritage, MPGI institution details, and vision |
| `/contact` | GET | Public | Official support contacts, location maps, and inquiries |
| `/organizers` | GET | Public | Faculty coordinators, technical leads, and student committee |
| `/dashboard` | GET | Participant | Protected student hub: digital fast-entry pass, timeline, and team chat |

### Authentication Routes
| Route | Method | Access | Description |
|:---|:---:|:---:|:---|
| `/auth/login` | GET/POST | Public | Student login with Google OAuth or credentials |
| `/auth/register` | GET/POST | Public | Student account registration |
| `/auth/adminlogin` | GET/POST | Public | Staff portal sign-in (restricted to `ADMIN` and `VOLUNTEER`) |
| `/auth/adminregister` | GET/POST | Key Protected | Privileged staff signup gated by `ADMIN_SETUP_KEY` |

### Administrative Command Center (`/admin/*`)
| Route | Method | Role Required | Description |
|:---|:---:|:---:|:---|
| `/admin/dashboard` | GET | Staff | Operational overview, registration charts, and festival metrics |
| `/admin/registrations` | GET | Staff | Live registry with status filters, search, and bulk operations |
| `/admin/verify/[id]` | GET/POST | Staff | Detailed receipt audit, team verification, and approval/rejection |
| `/admin/desk` | GET/POST | Staff | Fast-track walk-in desk for instantaneous on-site registrations |
| `/admin/events` | GET/POST | Admin | CRUD management for events, pricing, venues, and team rules |
| `/admin/schedule` | GET/POST | Admin | Multi-day schedule slot grid builder |
| `/admin/organizers` | GET/POST | Admin | Committee members directory and social link manager |
| `/admin/results` | GET/POST | Admin | YouTube livestream embeds, timed winner podium releases |
| `/admin/users` | GET/POST | Admin | User management and role escalations (`VOLUNTEER`, `ADMIN`) |
| `/admin/settings` | GET/POST | Admin | System kill switch, UPI configuration, deadlines, and image overrides |

### API Route Handlers
| Endpoint | Method | Role Required | Description |
|:---|:---:|:---:|:---|
| `/api/admin/export?dataset=participants` | GET | Staff | Streams full CSV of registrations, leader info, and team members |
| `/api/admin/export?dataset=users` | GET | Staff | Streams full CSV of registered student profiles |
| `/api/admin/proofs` | GET | Staff | Streams CSV audit ledger of payment proofs and transaction IDs |
| `/api/presence` | GET/POST | Public | Ingests client presence heartbeat; returns live viewer count |
| `/api/team/[id]/messages` | GET/POST | Participant | Retrieves and broadcasts messages inside a team's private channel |

---

## 🛠️ Operations Guide

### 1. Payment Verification & Registration Approval
1. Staff member signs in at `/auth/adminlogin`.
2. Navigate to **Registrations** (`/admin/registrations`).
3. Click **Review** on any `PENDING` registration.
4. Verify the student details, team members, entered UPI Transaction ID, and payment screenshot preview.
5. Enter verification notes (optional) and select **Approve Registration** or **Reject Registration**.
6. The status immediately reflects on the participant's `/status` lookup and unlocks their `/dashboard` entry pass.

### 2. Event-Day On-Site Walk-In Desk (`/admin/desk`)
> [!NOTE]
> The primary on-site operational check-in is the manual fast-track workflow at `/admin/desk`. This screen is engineered for high-throughput entry desk lines, bypassing account creation.

1. Open `/admin/desk` on any organizer tablet or mobile browser.
2. Select the target event from the dropdown.
3. Input the participant name, phone number, and academic details.
4. Add extra team members dynamically if registering a group.
5. Click **Submit Walk-In Entry** to immediately confirm and issue entry records.

### 3. Data Extraction & Reporting
Download live festival reports while signed in as staff:
```bash
# Export all participants & team manifests
curl -b "authjs.session-token=<TOKEN>" "http://localhost:3000/api/admin/export?dataset=participants" -o participants.csv

# Export student contact directory
curl -b "authjs.session-token=<TOKEN>" "http://localhost:3000/api/admin/export?dataset=users" -o users.csv

# Export payment verification ledger
curl -b "authjs.session-token=<TOKEN>" "http://localhost:3000/api/admin/proofs" -o payment_proofs.csv
```

### 4. Emergency Kill Switch Procedure
If event capacity is reached or technical maintenance is required:
1. Open `/admin/settings` as an Admin and toggle **Registration Paused**, OR
2. Set the environment variable `REGISTRATION_KILL_SWITCH="true"` in your hosting provider and redeploy.
3. Configure `REGISTRATION_KILL_SWITCH_MESSAGE` to display custom instructions to students.

---

## 🧰 Available Scripts

| Script | Command | Purpose |
|:---|:---|:---|
| **Development** | `npm run dev` | Launches the Next.js local development server on `http://localhost:3000` |
| **Production Build** | `npm run build` | Compiles TypeScript, runs React Compiler, and builds optimized production bundle |
| **Production Start** | `npm run start` | Boots the compiled Next.js production server |
| **Code Linting** | `npm run lint` | Executes ESLint 9 across all project files |
| **Admin Seeding** | `npm run seed:admin` | CLI runner to bootstrap or elevate the super admin account |
| **Database Migrations** | `npx drizzle-kit migrate` | Applies pending SQL migrations from `./drizzle` to PostgreSQL |
| **Database Push** | `npx drizzle-kit push` | Directly pushes schema changes from `src/db/schema.ts` to database |
| **Drizzle Studio** | `npx drizzle-kit studio` | Opens an interactive visual database browser in your browser |

---

## 🚢 Deployment

The platform is architected for modern serverless and containerized deployment targets (Vercel, Railway, Render, AWS).

### Recommended: Deploying to Vercel

1. Push your repository to GitHub:
   ```bash
   git push origin main
   ```
2. Import the repository into the [Vercel Dashboard](https://vercel.com).
3. In **Settings → Environment Variables**, add the production values for:
   - `DATABASE_URL` (Neon PostgreSQL pooled connection string)
   - `AUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `NEXT_PUBLIC_SITE_URL` (e.g. `https://kratos.mpgi.in`)
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
   - Optional notification and emergency variables (`SMTP_*`, `TWILIO_*`)
4. Set Build Command to `npm run build` and Output Directory to `.next`.
5. Run the database migrations before promoting to production:
   ```bash
   npx drizzle-kit migrate
   ```
6. Deploy the project.

### Self-Hosted / Node.js Production Run
```bash
# Build the application
npm run build

# Start the standalone server
NODE_ENV=production npm run start -p 3000
```

---

## 🔒 Security & Best Practices

- **Role Guard Isolation**: All administrative endpoints and Server Actions enforce strict role verification (`isStaffRole` and `assertAdminAction`). Unauthorized access attempts automatically redirect to `/auth/adminlogin` or `/dashboard`.
- **Sliding-Window Rate Limiting**: Critical endpoints (e.g., account registration, staff sign-in attempts) are protected against credential stuffing and abuse using an in-memory IP rate limiter (`src/lib/rate-limit.ts`).
- **HTTP Security Headers**: Strict CSP, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and `Referrer-Policy: strict-origin-when-cross-origin` configured natively in `next.config.ts`.
- **Database Connection Pooling**: Utilizes `@neondatabase/serverless` over WebSockets / HTTP for lightweight, connection-safe serverless execution without pool exhaustion.
- **Safe Media Storage**: Only signed URLs or preset-validated Cloudinary assets are rendered. Domain patterns are locked to `res.cloudinary.com` in `next.config.ts`.

---

## 🤝 Contributing

Contributions are welcomed from the community and organizing committee members.

1. **Fork the Repository**
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit Changes**: Follow Conventional Commits:
   ```bash
   git commit -m "feat: add real-time QR attendance scanner"
   ```
4. **Ensure Code Quality**:
   ```bash
   npm run lint
   npm run build
   ```
5. **Push to the Branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request** with a detailed explanation of your changes.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👥 Maintainers & Credits

**KRATOS 2026 Platform** is maintained by:

- **Lead Developer**: **Rahil Hussain** ([@ifeelrahiii](https://www.instagram.com/ifeelrahiii)) • [rahilhussain431601@gmail.com](mailto:rahilhussain431601@gmail.com)
- **Co-Lead Developer**: **Pranav Birhade** ([@PRANAVBIRHADE](https://github.com/PRANAVBIRHADE)) • ([@code_track_](https://www.instagram.com/code_track_))
- **Organizing Body**: MPGI Engineering Technical Committee • [kratos2k26.mpgi@gmail.com](mailto:kratos2k26.mpgi@gmail.com)

<div align="center">
<sub>Built with ❤️ for the students and organizers of KRATOS 2026.</sub>
</div>
