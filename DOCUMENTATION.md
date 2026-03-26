# KRATOS 2026: Official Documentation

Welcome to the comprehensive guide for **KRATOS 2026**, the premier inter-collegiate technical festival platform.

---

## 🏗️ Project Overview & Architecture

KRATOS 2026 is a high-performance, edge-ready web application designed to handle hundreds of concurrent participants registering, viewing live leaderboards, and interacting with the festival infrastructure. 

The architecture is built heavily around Server-Side Rendering (SSR) and React Server Components (RSC) to ensure lightning-fast load times and maximum SEO efficiency, heavily relying on the Next.js App Router paradigm.

### Tech Stack
- **Framework**: [Next.js 16.2.0](https://nextjs.org/) (App Router, Turbopack enabled)
- **UI Library**: [React 19.2](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Neon Postgres (Serverless)](https://neon.tech/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/) (Auth.js)
- **Media Storage**: [Cloudinary](https://cloudinary.com/)

---

## 🎨 UI/UX Design Grammar (Stark-Brutalist)

The platform employs a distinctly **stark, tech-brutalist** design language. This aesthetic choices reflects the engineering nature of the festival—eschewing soft shadows and rounded corners for sharp, utilitarian geometry.

### Core Visual Principles
1. **Typography**: Heavy, aggressive use of uppercase fonts (`Space Grotesk` for display headers, `Inter` for readability, and monospace for technical data).
2. **Colors**: High-contrast monochrome base (Pitch Black `bg-surface`, Bright White `text-on-surface`), punctuated by stark primary accents (Electric yellow/gold, alert reds) for interactive elements.
3. **Borders & Elevation**: Elements utilizes bold, heavy borders (`brutal-border`) and solid, offset drop-shadows (`hard-shadow-gold`) instead of soft blurs.
4. **Motion**: Crisp, snappy micro-interactions via Framer Motion. Elements scale up aggressively on hover, and global background particles provide a dynamic 3D depth layer (`GlobalMotionLayer.tsx`).
5. **Components**:
   - `BrutalCard`: The fundamental container layout.
   - `BrutalButton`: High-impact interactive surfaces.
   - `BrutalInput`: Utilitarian, terminal-style input fields. 

---

## 🗄️ Database Schema & Entities

The platform uses a relational architecture managed by Drizzle ORM.

### 1. Users (`users`)
- **Role**: Tracks both `PARTICIPANT` and `ADMIN` roles.
- **Fields**: ID, Name, Email (Unique), Password (Hashed), Phone, College, Branch, Year, Role, CreatedAt.

### 2. Events (`events`)
- **Role**: The technical competitions or events available for registration.
- **Fields**: ID, Slug, Name, Description, Category, Venue, Fee, Format (`SOLO`, `TEAM`, `SOLO_TEAM`), TeamSizeMin, TeamSizeMax, ExpectedParticipants, PrizeDetails, Branch, IsCommon.
- **Winners**: A JSONB column tracking the podium placements for post-event leaderboards.

### 3. Registrations (`registrations`)
- **Role**: The nexus entity linking Users to Events.
- **Fields**: ID, UserID, EventID, TeamID, TeamName, Status (`PENDING`, `APPROVED`, `REJECTED`), TransactionID, PaymentScreenshot (Cloudinary URL), PaymentNotes, TotalFee, CheckedIn, CheckedInAt.

### 4. Teams (`teams`)
- **Role**: Persistent team entity associated with an event registration.
- **Fields**: ID, EventID, Name, CreatedAt.

### 5. Team Members (`team_members`)
- **Role**: Member-level roster storage for teams.
- **Fields**: ID, TeamID, Name, College, Branch, Year, Phone, CreatedAt.

### 6. Schedule Slots (`schedule_slots`)
- **Role**: Structured Day 1 / Day 2 schedule model with slot-level venue and linked events.
- **Fields**: ID, Day, SortIndex, TimeSlot, Venue, LinkedEventID, IsBreak, CreatedAt.

### 7. Organizers (`organizers`)
- **Role**: Public-facing organizer directory and contact metadata.
- **Fields**: ID, OrganizerName, Role, Contact, CreatedAt.

### 8. System Settings (`system_settings`)
- **Role**: Dynamic controls for real-world operations.
- **Fields**: RegistrationOpen, UPI ID, FeePerPerson, Deadline, plus existing global toggles.

---

## 🔐 Security & Authentication

Authentication is handled natively at the edge via NextAuth.js. 

- **Providers**: Supports both Google OAuth (for rapid onboarding) and standardized Email/Password Credentials (hashed via `bcryptjs`).
- **Role-Based Access Control (RBAC)**: All administrative routes (`/admin/*`) are heavily guarded by Next.js advanced interceptors (`src/proxy.ts`), which automatically eject any user lacking the `ADMIN` permission role back to their standard dashboard.

---

## 🚀 Deployment & Operations

### Local Development Setup
1. Clone the repository and install dependencies (`npm install`).
2. Create your `.env.local` containing:
   - `DATABASE_URL` (Neon Postgres)
   - `AUTH_SECRET` (Run `npx auth secret`)
   - Google Auth IDs (Optional)
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (Unsigned Cloudinary upload profile)
3. Push the schema to your fresh database: `npx drizzle-kit push`
4. Start the Turbopack engine: `npm run dev`

### Production Deployment
The application is pre-configured and optimized for deployment on **Vercel**. All environments require zero-config setups, provided the corresponding Environment Variables are duplicated in the Vercel Dashboard project settings.

---

## ⚙️ Key Subsystems

- **Registration Wizard**: Multi-step flow now computes total fee from global settings and stores team members individually in normalized tables.
- **Admin Panel**: Dashboard reports total participants, total teams, pending payments, verified payments, and revenue estimate.
- **Schedule Engine**: Admin configures Day 1 / Day 2 slots with linked events and venues, rendered dynamically on the public site.
- **Check-In Terminal**: Admin can search by registration ID, member name, or phone and mark checked-in.
- **Settings Panel**: Registration open/close, UPI ID, fee per person, and deadline are editable from admin settings.
- **Organizer Management**: Organizer management in admin and public display on landing page.
- **Memory Gallery**: An integrated tool allowing participants to upload post-event pictures.
- **Live Leaderboard**: A real-time table showing the winners of various events.
