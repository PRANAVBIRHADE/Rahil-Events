# KRATOS 2026 — Pre-Launch TODO

> Tracked remaining manual tasks before KRATOS 2026 goes live.
> Each section is ordered by priority. Complete top-to-bottom.

---

## 🔴 Critical — Must Complete Before Launch

These block the platform from working correctly in production.

- [ ] Set **all** production environment variables (see `.env.example` for the full list)
- [ ] Set a strong `SEED_ADMIN_PASSWORD` before running any bootstrap script
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the final production domain (QR ticket links depend on this)
- [ ] Confirm the **Neon production database** is reachable and run `npx drizzle-kit push`
- [ ] Confirm `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` are correct
- [ ] Run `npm run lint && npm run build` — both must pass with exit code 0

---

## 🟡 Content — Needs Your Final Input

Real data that the web team cannot fill in without organizer approval.

- [ ] **About page** — Replace placeholder roster with the approved faculty advisors and student core team list
- [ ] **Organizers panel** — Add final organizer records from the admin organizers page
- [ ] **Contact page** — Verify all public emails and phone numbers one final time
- [ ] **Branding** — Replace default UI visuals in `public/branding/` with approved assets (logo, favicon, hero image)
- [ ] **Event rules** — Add PDF links for events that have finalized rule documents
- [ ] **Results page** — Set the YouTube embed URL for the results reveal video

---

## 🟢 Operations — Data & Flow Checks

Manual verification before the event goes live.

- [ ] Review every event in the admin panel — check fee, team size limits, venue, and description
- [ ] Link the correct events to each day and time slot from the admin schedule page
- [ ] Confirm which events are free (fee = 0) and verify they appear correctly in the registration flow
- [ ] Run a full **paid registration** test — upload proof, approve, download ticket
- [ ] Run a full **free registration** test — verify auto-approval and ticket download
- [ ] Test the **check-in** flow with a QR code and a manual search
- [ ] Unlock the gallery and test a **gallery photo upload**

---

## ⚪ Nice to Have — After Launch

Lower priority improvements once the platform is stable.

- [ ] Replace the static About page roster with a live database-driven team section
- [ ] Add automated tests for registration, auth, and admin verification flows
- [ ] Add rate limiting and stronger server-side validation for public write actions
- [ ] Document the admin runbook for day-of operations

---

> **For architecture and deployment details → [`DOCUMENTATION.md`](./DOCUMENTATION.md)**
> **For the complete feature list → [`FEATURES.md`](./FEATURES.md)**
> **For all real festival data → [`real_data.md`](./real_data.md)**
