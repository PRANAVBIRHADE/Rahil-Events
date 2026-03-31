# KRATOS 2026 — Feature Inventory

> Complete list of all implemented features for participants, administrators, and the underlying system.

---

## 👤 Participant Features

### Discovery
- Browse all festival events on the public listing page
- View detailed event pages showing venue, schedule, team requirements, fees, and prizes

### Account & Profile
- Sign in with **Google** (one-click) or **email + password** (credentials)
- Profile completion gate — must provide name, phone, and college details before registering

### Registration
- Register for **solo** events (single-person)
- Register for **team** events with group sizing validation
- **Free events** — instant auto-approval, no payment required
- **Paid events** — enter transaction ID and upload payment screenshot

### Dashboard
- Track the live status of all registrations (pending / approved / rejected)
- Download approved **entry passes** (PDF-style ticket with QR code)
- Access **team chat** for paired or group registrations
- Upload gallery photos when the gallery is unlocked by admins

---

## 🔧 Admin Features

### Event Management
- Create, edit, and deactivate events
- Set name, slug, description, category, format, team size limits, venue, fee, and registration cap

### Schedule Management
- Edit the structured 2-day × 5-slot schedule from the admin panel
- Link events to specific day and time slot combinations

### Registration Control
- Toggle registration open/closed globally
- Set and update the registration deadline (with local-time formatting)
- Set the UPI ID displayed to participants during checkout

### Payment Verification
- View uploaded payment proof screenshots side-by-side with registration details
- **Approve** or **Reject** registrations (with optional rejection notes)
- Export full registration list and payment proofs as **CSV**

### Event-Day Operations
- Search registrations by ID prefix, participant name, or phone number
- Mark participants as checked-in; only approved registrations can be checked in

### Content & Results
- **Landing Page CMS** — Upload and update Hero and About section images directly from the Admin dashboard.
- **Organizer Directory** — Manage faculty and student contact cards with brutalist styling.
- **Results Reveal** — Set the reveal time and YouTube live stream URL.
- **Winner Management** — Define top 3 winners per event once competitions conclude.
- **Live Tech Comms** — Update scrolling announcement text in real-time.

---

## ⚙️ System Features

### Architecture
- **Next.js 16 App Router** with server components and server actions
- **Drizzle ORM** relational data model with full type-safety
- Edge middleware (`proxy.ts`) for session-aware route protection
- Auth.js session and JWT types augmented with `role` and `id`

### Media & Uploads
- Cloudinary integration for payment proof uploads and gallery photos
- `next/image` remote pattern support for Cloudinary-hosted images

### Engagement
- Live viewer counter on the results page (SSE-based)
- Scrolling announcement bar driven from the database
- QR ticket generation with correct origin-aware links

### Security & Hardening
- All admin creation uses environment variable credentials (no hardcoded passwords)
- Profile gate prevents incomplete accounts from registering
- Team size validation is enforced server-side
- `.env.example` documents every required variable for new deployments
