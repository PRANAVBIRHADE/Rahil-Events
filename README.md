<div align="center">
  <img src="public/favicon.ico" alt="Kratos Logo" width="80" height="80" />
  <h1 align="center">KRATOS 2026</h1>
  <p align="center">
    <strong>The Ultimate Inter-Collegiate Technical Festival Platform</strong>
  </p>
  <p align="center">
    Built with cutting-edge web technologies and a signature Stark-Brutalist design language.
  </p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-16.2.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql" alt="Postgres" />
    <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  </div>
</div>

---

Welcome to the **KRATOS 2026** platform hub. This repository contains the full source code for the festival's web infrastructure—a high-performance system for event registrations, live leaderboards, and management. 

Moving away from generic corporate templates, this platform utilizes a custom **Tech-Brutalist UI**, featuring aggressive typography, high-contrast monochrome palettes, and snappy Framer Motion animations to deliver a memorable user experience.

## ✨ Key Features

- 🎯 **Complete Event Management System**: Events now support name, description, category, venue, schedule linkage, min/max team size, expected participants, and prize details.
- 📅 **Structured Day-Wise Schedule**: Admin-configurable Day 1 / Day 2 time slots with venue and event mapping, rendered publicly on the landing page.
- 👥 **Normalized Team System**: Dedicated `teams` and `team_members` tables with per-member details (`name`, `college`, `branch`, `year`, `phone`).
- 💳 **Payment + Verification Workflow**: Registration stores total fee, UTR/transaction ID, payment screenshot, verification status, and admin notes.
- ✅ **Event-Day Check-In**: Admin can search by team code (registration ID), member name, or phone and mark checked-in with timestamp.
- 📊 **Admin Panel Dashboard**: Includes total participants, total teams, pending payments, verified payments, and revenue estimate.
- 📤 **CSV Export for Ground Ops**: Exports Name, College, Event, Team, Phone, Payment status, and Check-in status.
- 🧩 **Organizer + Settings Management**: Organizer CRUD and public display; registration settings panel for open/close, UPI ID, fee per person, and deadline.

## 📖 Comprehensive Documentation

For an in-depth dive into the platform's exact technologies, database schemas, styling grammar, and deployment systems, please thoroughly review our central documentation directive:

👉 **[Read the Full DOCUMENTATION.md](./DOCUMENTATION.md)**

---

## 🚀 Quick Start Installation

Jump straight into local development:

### 1. Clone & Install
```bash
git clone https://github.com/PRANAVBIRHADE/Rahil-Events.git
cd Rahil-Events
npm install
```

### 2. Configure Environment Secrets
Duplicate the template file to hold your local secrets:
```bash
cp .env.example .env.local
```
*(Fill in your Neon Database URL and NextAuth secrets inside `.env.local`)*

### 3. Energize the Database
Generate and apply Drizzle ORM migrations to sync schema with Neon Postgres:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 4. Ignite the Turbopack Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the platform.

---

## 🛡️ Admin Access

To evaluate the admin components locally:
1. Initialize the app and navigate to `/admin`.
2. Ensure you have modified your underlying database to set your user account `role` to `'ADMIN'`.
3. Non-admin users are automatically ejected via `src/proxy.ts` middleware.

### Admin Routes (Core Operations)
- `/admin/dashboard` - Admin Panel metrics and quick actions
- `/admin/events` - Event management
- `/admin/schedule` - structured day-wise schedule editor
- `/admin/checkin` - event-day check-in search + mark
- `/admin/settings` - registration controls, UPI, fee/person, deadline
- `/admin/organizers` - organizer management

---
<div align="center">
  <p><i>System Architecture Designed & Deployed for Matoshri Engineering Festival.</i></p>
</div>
