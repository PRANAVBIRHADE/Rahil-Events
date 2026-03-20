# KRATOS 2026: Technical Festival Platform

A high-performance, stark-brutalist web ecosystem for managing technical festivals. Built with Next.js 15, Neon PostgreSQL, and NextAuth.js.

## 🚀 Quick Start

### 1. Initialize Repository
```bash
cd kratos-platform
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the root directory:
```env
# Neon PostgreSQL Connection
DATABASE_URL="postgresql://neondb_owner:..."

# NextAuth Secret (Generate with: openssl rand -base64 32)
AUTH_SECRET="your-secret-here"
```

### 3. Synchronize Database
Ensure your Neon database matches the schema:
```bash
npx drizzle-kit push
```

### 4. Launch Command Terminal
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Administrative Access

The **Command Center** allows for real-time management of modules and participants.

- **Admin Login Page**: `/auth/adminlogin`
- **Default Admin**: `admin@kratos.fest`
- **Password**: `KratosAdmin2026!`

---

## 🏛️ Project Architecture

- **`/src/app`**: Next.js App Router (Pages & API)
- **`/src/components/ui`**: Custom Stark-Brutalist design system
- **`/src/db`**: Drizzle ORM schema and Neon connection
- **`/src/lib`**: Server Actions for secure transactions
- **`/src/middleware.ts`**: Role-Based Access Control (RBAC)

---

## 📖 Walkthrough & Verification
For a visual guide of the implemented features and verification screenshots, see:
[walkthrough.md](file:///C:/Users/Asus/.gemini/antigravity/brain/25b89b8b-7923-4395-b92f-85ecb7f56e3f/walkthrough.md)
