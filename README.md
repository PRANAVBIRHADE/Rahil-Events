# KRATOS 2026 Registration Platform

KRATOS 2026 is now a registration-first platform with a simple public flow and a staff review panel.

## Core Features

- Public event listing at `/` and `/events`
- Direct registration at `/register` for individual and team entries
- Payment screenshot upload with file type and size checks
- Public status lookup at `/status`
- Staff review flow at `/admin/registrations`
- Approval and rejection with notes at `/admin/verify/[id]`
- CSV export for registrations, users, and payment proofs
- Event-day desk entry screen at `/admin/desk`

## Tech Stack

- Next.js App Router
- React 19
- Drizzle ORM with Neon PostgreSQL
- NextAuth for staff authentication
- Cloudinary upload widget for screenshots and media

## Local Setup

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` if needed.
3. Fill the required environment variables:
   `DATABASE_URL`
   `AUTH_SECRET`
   `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
   `NEXT_PUBLIC_SITE_URL`
4. Seed the first admin account if this is a fresh database:
   `npm run seed:admin`
5. Start the app locally:
   `npm run dev`

## Required Environment Variables

- `DATABASE_URL`: Neon or PostgreSQL connection string
- `AUTH_SECRET`: NextAuth secret
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: unsigned upload preset used by the registration form
- `NEXT_PUBLIC_SITE_URL`: public base URL for the deployed site
- `SEED_ADMIN_EMAIL`: first admin email for bootstrapping
- `SEED_ADMIN_PASSWORD`: first admin password for bootstrapping

Optional:

- `ADMIN_SETUP_KEY`: required when creating new staff accounts without an already signed-in admin
- `SMTP_*` and `TWILIO_*`: only needed if email or WhatsApp notifications are enabled
- `REGISTRATION_KILL_SWITCH` and `REGISTRATION_KILL_SWITCH_MESSAGE`: emergency registration pause

## Main Routes

- `/`: landing page
- `/events`: event listing
- `/register`: registration form
- `/status`: public status lookup
- `/auth/adminlogin`: staff login
- `/admin/dashboard`: staff dashboard
- `/admin/registrations`: registration review list
- `/admin/settings`: registration settings and deployment checks
- `/admin/desk`: event-day desk entry screen

## Pre-Deployment Checklist

1. Confirm all required environment variables are set in the deployment target.
2. Run `npm run build`.
3. Log in at `/auth/adminlogin`.
4. Open `/admin/settings` and confirm:
   registration open or closed state
   UPI ID
   fee per person
   deadline
   deployment checks show configured
5. Test the public flow once:
   open site
   register
   upload screenshot
   check status
   approve from admin
   confirm the status page updates

## Documentation

- Required launch data: [real_data.md](real_data.md)
- Staff operations: [ADMIN_GUIDE.md](ADMIN_GUIDE.md)
