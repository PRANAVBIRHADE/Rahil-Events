# KRATOS 2026 Project TODO

## Must do before production launch

- Set all production environment variables from `.env.example`.
- Set a strong `SEED_ADMIN_PASSWORD` before running any seed or admin bootstrap script.
- Set `NEXT_PUBLIC_SITE_URL` to the final production domain.
- Verify the production Neon database is reachable and run schema push or migrations.
- Confirm `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` are correct in production.
- Run `npm run lint`.
- Run `npm run build`.

## Content still needing your final input

- Replace the temporary faculty and student roster on the About page with the approved final team list.
- Add final organizer records from the admin organizer panel.
- Confirm all public contact emails and phone numbers one more time.
- Review the files in `public/branding/` and decide which approved assets should replace the current default UI visuals.
- Add event-specific PDF rule links only if you actually have finalized rule PDFs.
- Add the final YouTube embed URL for the results reveal page.

## Data and operations checks

- Review every event entry in the admin panel for fee, team size, venue, and description accuracy.
- Review the admin schedule page and link the correct events to each day/slot.
- Confirm which events should remain free and verify their fee is `0`.
- Test one paid registration and one free registration end to end.
- Test approval, rejection, ticket download, and check-in flows.
- Test gallery uploads after unlocking the gallery.

## Nice to do after launch prep

- Replace the placeholder About page roster with live database-driven team content.
- Add automated tests for registration, auth, and admin verification flows.
- Add stronger validation and rate limits for public write actions.
