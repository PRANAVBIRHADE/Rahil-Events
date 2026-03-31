# Kratos 2026 - Production Updates (March 2026)

This repository has been fully synchronized with the live Vercel environment. All UI components, branding, and dynamic features are now production-ready.

## Recent Major Updates
- **Branding**: Full institutional alignment with **Matoshri Pratishthan Group of Institutions, Nanded**.
- **Hero Section**: Fixed institution name, added premium staggered animations, and a real-time countdown timer.
- **About Section**: Redesigned with a 3-image college collage and affiliation banner (DB-backed images).
- **Events Section**: Added "Open for all branches" messaging and styled info boxes.
- **Contact Page**: Brand new page featuring official college contacts, organizer details, and an interactive Google Map.
- **Navbar**: Optimized navigation (Join Team, Events, Schedule, About, Contact, Gallery).
- **Footer**: Refactored to include campus location, official links, and contact support.

## Local Setup for Testing
1. **Environment Variables**: Ensure your `.env.local` matches the production keys for Cloudinary and Database.
2. **Install Dependencies**: `npm install`
3. **Run Development Server**: `npm run dev`
4. **Build Check**: `npm run build` (Ensures full TypeScript and build integrity).

## Key Files for Reference
- `src/app/page.tsx`: Main landing page structure.
- `src/components/marketing/`: All UI components (Brutalism styled).
- `src/db/schema.ts`: Database definitions (including new system setting fields).
- `src/lib/actions.ts`: Server actions for image management and event logic.

*The platform is now ready for deployment or local refinement.*
