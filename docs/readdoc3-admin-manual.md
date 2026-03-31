# 🛡️ ReadDoc 3: Admin Manual

How to manage the KRATOS 2026 platform from the dashboard.

## 1. Accessing the Admin Panel
1. Go to [**`localhost:3000/auth/admin-login`**](http://localhost:3000/auth/admin-login).
2. Login using the `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` you set in `.env.local`.

## 2. Managing Landing Page Images (NEW!)
This is the most important recent update for the **Web Team**:
-   Navigate to [**`Admin Dashboard > System Settings`**](http://localhost:3000/admin/settings).
-   Look for the **Hero Image** and **About Section** fields.
-   **Click Upload**: This uploads the file to Cloudinary and saves the URL in the database.
-   **Instantly Updated**: The changes appear on the landing page immediately.

## 3. Verifying Registrations
-   Go to **Registrations**.
-   Click **Pending** to see participants who have uploaded payment proofs.
-   **View Proof**: Click the link to see the Cloudinary screenshot.
-   **Action**: Click **Approve** (sets status to Approved) or **Reject** (add a reason note).

## 4. Organizing the Schedule
-   Go to **Schedule**.
-   The grid is fixed at **2 days x 5 slots**.
-   Select an event from the dropdown to link it to a specific time slot.

## 5. Exports & Reports
-   Use the **CSV Export** buttons in the Registrations and Results sections to download full participant lists for on-campus verification.

---
> **Congratulations!** You've completed the ReadDoc series.
> **For more deep technical info**, check out [**`DOCUMENTATION.md`**](../DOCUMENTATION.md).
