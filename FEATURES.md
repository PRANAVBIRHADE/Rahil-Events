# KRATOS 2026 Feature Guide

## Participant features

- Browse all festival events from the public site
- View detailed event pages with venue, schedule, and fee information
- Register with Google or email/password
- Complete profile data before registering
- Register for solo or team events
- Register for free events without payment proof
- Upload payment screenshots for paid events
- Track registration status from the dashboard
- Download approved entry passes
- Access team chat for team and pair registrations
- Upload gallery photos when the gallery is unlocked

## Admin features

- Create and update events
- Edit the structured 2-day schedule
- Control registration status, fees, UPI ID, and deadline
- Review payment proofs and approve or reject registrations
- Search registrations for event-day check-in
- Publish organizer contact cards
- Configure result reveal time and results video
- Export registration and payment CSV files

## System features

- Next.js 16 App Router architecture
- Server actions for admin and participant mutations
- Drizzle-backed relational data model
- Auth.js session and JWT typing
- Cloudinary upload support with production-safe image config
- QR ticket generation and admin check-in links
- Live viewer counter for the results page
- Announcement bar driven from database content

## Deployment hardening completed

- Added Cloudinary `next/image` remote pattern support
- Replaced hardcoded admin seed credentials with env-driven setup
- Added missing deployment env vars to `.env.example`
- Fixed local-time formatting for admin deadline controls
- Removed misleading dead buttons and placeholder contact behavior
- Aligned admin and public schedule defaults with confirmed KRATOS timings
