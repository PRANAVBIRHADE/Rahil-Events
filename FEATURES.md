# KRATOS 2026: Comprehensive Feature & Workflow Guide

This document outlines the complete scope, technical features, and end-to-end workflows of the KRATOS 2026 web platform. It serves as a master reference for what the system is capable of and how data flows between participants and administrators.

---

## 1. System Architecture & Tech Stack

### High-Performance Core
- **Next.js 16 App Router**: Utilizes React Server Components (RSC) and Server Actions to push heavy data processing to the edge, resulting in zero-layout-shift routing and blazing-fast initial load times.
- **Neon Serverless Postgres**: Highly scalable cloud SQL database ensuring rapid transaction processing during high-traffic registration windows.
- **Drizzle ORM**: Type-safe database querying layer protecting against SQL injections and schema drift.
- **NextAuth.js v5**: Configured edge-compatible authentication supporting both Google OAuth and Credentials (Email/Password with `bcryptjs` hashing).

### Visual Language (Stark-Brutalist)
- **Tailwind CSS v4 & Framer Motion**: Deeply integrated to produce a custom "Tech-Brutalist" aesthetic with heavy borders, deep black/gold contrasts, spatial dynamic particle backgrounds, and aggressive micro-animations honoring the engineering spirit of the festival.

---

## 2. Participant (User) Workflow

### 2.1 Onboarding & Identity
1. **Landing & Exploration**: Users land on the public facade, featuring Day 1/Day 2 schedules, organizer contacts, and highlighted modules.
2. **Authentication**: Users hit "Login" or "Register" to authenticate via Google OAuth (1-click) or Standard Email/Password.
3. **Profile Completeness Check**: Upon successful login, the system validates if their extended profile exists (College, Branch, Year, Phone). If not, they are forcefully routed to `/profile/complete` to ensure data integrity before any registration begins.

### 2.2 Registration Engine
1. **Module Browsing**: Participants navigate to the Events page, filtered by "Universal Modules" and "Department Specific" modules.
2. **Dynamic Wizard Context**: Clicking "Register" loads a highly dynamic registration client form that computes context based on the event configuration (e.g., Solo vs. Team limits, Fee per person vs. Flat fee).
3. **Team Assembly (If applicable)**: For team events, the primary commander inputs the "Squadron Name" and dynamically adds fields for each team member (Name, College, Year, Phone), adhering to the minimum and maximum capacity set by admins.
4. **Payment & Evidence Upload**: The system generates a Live UPI QR Code. The user pays via their UPI app, submits the exact Transaction ID/UTR, and uploads a visual payment receipt/screenshot securely processed through the **Cloudinary Integration**.
5. **Transmission Pending**: Registration is saved to the database with a `PENDING` status.

### 2.3 Command Dashboard
- Users access `/dashboard` to monitor all active registrations, viewing their Live Status (`PENDING`, `APPROVED`, `REJECTED`) and any instructions.
- **Memory Gallery**: After the festival, participants can upload post-event pictures to a specialized gallery (locked/unlocked globally by Admins).

---

## 3. Administrator (Organizer) Workflow

The entire administrative zone (`/admin/*`) is hermetically sealed behind Next.js Middleware. Any non-admin user attempting access is instantly redirected.

### 3.1 Global Operations
- **System Settings Panel**: Admins can instantaneously modify master variables:
  - Toggle Registration Master Switch (Open/Close global registrations).
  - Update UPI Receipt ID.
  - Set global Fee Per Person and Deadline date.
  - Lock/Unlock the public Memory Gallery.

### 3.2 Registration Verification (The Core Loop)
1. **Master Logs**: Admins navigate to the Registrations table to view streaming registrations.
2. **Inspect Transmission**: Clicking "Verify" opens an isolated verification theater showcasing:
   - Event info, User info, and full Team Roster.
   - The verified Cloudinary Payment Receipt screenshot alongside the submitted Transaction ID.
3. **Approval Matrix**: Admins update the status to `APPROVED` or `REJECTED` and can leave specific "**Admin Notes**" (e.g., "Transaction ID mismatch"). These notes reflect instantly on the participant's dashboard.

### 3.3 Event-Day Check-In Terminal
- **Rapid Search**: Engineered for extreme speed on event day. Volunteers type a Registration ID (Team Code), Member Name, or Phone Number.
- **Instant Result**: The system lists matching approved registrations. Clicking "Check-In" injects a timestamp and marks the user/team as physically present.

### 3.4 Operational CRM
- **Dashboard Command Center**: Instantly reports Total Participants, Total Teams formed, Revenue Projections, and a live ticker of pending transactions requiring immediate verification.
- **Event Configurator**: Full CRUD on all modules. Admins define Team Size Min/Max, exact venue, category, and update Podium Winners directly into the events schema.
- **Schedule Logic Map**: Allows mapping particular events and venues to exact time slots for Day 1 and Day 2, automatically rendering on the global facade.
- **Export Layer**: Click-to-download CSV exports of all cleared rosters for ground operation coordination.

---

## 4. Key Automated Subsystems

- **Relation Normalization**: When a team registers, the system dynamically parses the JSON payload to insert individual rows into `teams` and `team_members` relational tables, eliminating flat-data duplication.
- **Live Leaderboard**: The public `/leaderboard` utilizes React Suspense to lazily stream podium winners pulled directly from the Events schema, generating a real-time hall of fame without affecting Main Thread load priority.
- **Responsive Media Handlers**: The platform is inherently mobile-first, ensuring QR codes scale precisely, tables collapse into summary cards, and navigation transitions into spatial hamburger menus.
