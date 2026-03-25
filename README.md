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

## ⚡ Overview

Welcome to the digital command center for **KRATOS 2026**. This repository contains the full source code for the festival's web infrastructure—a high-performance ecosystem orchestrating event registrations, live leaderboards, and administrative oversight. 

Moving away from generic corporate templates, this platform utilizes a custom **Tech-Brutalist UI**, featuring aggressive typography, high-contrast monochrome palettes, and snappy Framer Motion animations to deliver a memorable user experience.

## ✨ Key Features

- 🎫 **Dynamic Event Registration**: Multi-step, responsive forms supporting both solo participants and multi-member tactical squadrons.
- 🔐 **Edge-Secured Authentication**: Integrated Google OAuth and secure credential logins powered by NextAuth.js v5.
- 📊 **Real-Time Command Center**: A securely guarded `/admin` portal allowing organizers to verify UPI transactions, manage users, and update leaderboards instantly.
- 📸 **Cloudinary Memory Gallery**: Integrated cloud upload widgets for participants to store their event highlights.
- 🚀 **Extreme Performance**: Leverages Next.js 16 Server Components, React 19, and the Turbopack engine for near-instant page loads and perfect SEO capabilities.

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
Push the Drizzle ORM schema to your Neon Postgres database to format the tables:
```bash
npx drizzle-kit push
```

### 4. Ignite the Turbopack Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the platform.

---

## 🛡️ Administrative Override

To evaluate the admin components locally:
1. Initialize the app and navigate to `/admin`.
2. Ensure you have modified your underlying database to set your user account `role` to `'ADMIN'`.
3. Non-admin users are automatically ejected via `src/proxy.ts` middleware.

---
<div align="center">
  <p><i>System Architecture Designed & Deployed for Matoshri Engineering Festival.</i></p>
</div>
