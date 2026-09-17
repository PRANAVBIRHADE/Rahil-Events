# KRATOS 2026 - Build Setup & Run Guide

A complete guide to set up, build, and run the KRATOS 2026 registration platform locally and for deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Running Locally](#running-locally)
6. [Building for Production](#building-for-production)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18+ (v20+ recommended)
- **npm**: v9+ (comes with Node.js) or **yarn**
- **Git**: for version control
- **PostgreSQL**: For local development (or use Neon for cloud database)
- **Environment Variables Editor**: Any text editor (VS Code, Notepad, etc.)

### Verify Installation

```bash
node --version
npm --version
```

---

## Installation

### Step 1: Clone or Navigate to the Repository

```bash
cd d:\WORK\Coding\Rahil-Events
```

### Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

**Expected output**: ~200+ packages installed, similar to:
```
added 250 packages in 45s
```

### Step 3: Verify Installation

Check that the build tools are available:

```bash
npm run lint
```

This should run ESLint without critical errors (some warnings are okay).

---

## Environment Configuration

### Step 1: Create `.env.local` File

In the project root directory, create a `.env.local` file:

```bash
# Windows (PowerShell)
New-Item -Path "d:\WORK\Coding\Rahil-Events\.env.local" -ItemType File

# Or simply create it in your editor
```

### Step 2: Required Environment Variables

Add these variables to `.env.local`:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# NextAuth Authentication
AUTH_SECRET=your-random-secret-string-min-32-chars

# Cloudinary (for image/file uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin Seeding (for first-time setup)
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=SecurePassword123!
```

### Step 3: Optional Environment Variables

Add these only if you enable notifications:

```env
# Email Notifications (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@events.com

# WhatsApp Notifications (optional)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Emergency Controls (optional)
REGISTRATION_KILL_SWITCH=false
REGISTRATION_KILL_SWITCH_MESSAGE=Registrations are temporarily closed

# Admin Setup Key (optional, for creating new admin accounts)
ADMIN_SETUP_KEY=your-setup-key
```

### Step 4: How to Generate Values

**AUTH_SECRET**: Generate a secure random string (min 32 characters)
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use an online generator: https://1password.com/password-generator/
```

**NEXT_PUBLIC_SITE_URL**: 
- Local: `http://localhost:3000`
- Staging: `https://staging.events.example.com`
- Production: `https://events.example.com`

**DATABASE_URL Format**: 
- Neon: `postgresql://user:password@ep-xxx.region.neon.tech/database?sslmode=require`
- Local PostgreSQL: `postgresql://postgres:password@localhost:5432/kratos_dev`

---

## Database Setup

### Option A: Using Neon (Recommended for Cloud)

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Copy the connection string from the dashboard
4. Paste into `DATABASE_URL` in `.env.local`

### Option B: Using Local PostgreSQL

1. **Install PostgreSQL** (if not already installed)
2. **Create a database**:
```bash
psql -U postgres
CREATE DATABASE kratos_dev;
\q
```

3. **Set DATABASE_URL** in `.env.local`:
```env
DATABASE_URL=postgresql://postgres:your-password@localhost:5432/kratos_dev
```

### Step 2: Run Database Migrations

Apply all schema changes from Drizzle migrations:

```bash
npx drizzle-kit migrate
```

This command:
- Reads migrations from `./drizzle/` folder
- Applies them to your database
- Creates tables, indexes, and relationships

### Step 3: Seed Initial Admin Account

Bootstrap the first admin account (required for accessing `/admin` pages):

```bash
npm run seed:admin
```

**Expected output**:
```
✓ Admin account created successfully
Email: admin@example.com
```

---

## Running Locally

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

**Expected output**:
```
  ▲ Next.js 16.2.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

### Access the Application

- **Public Site**: http://localhost:3000
- **Event Listing**: http://localhost:3000/events
- **Registration**: http://localhost:3000/register
- **Status Lookup**: http://localhost:3000/status
- **Admin Login**: http://localhost:3000/auth/adminlogin
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

### First-Time Testing

1. **Visit public pages** to ensure they load
2. **Test registration flow**:
   - Go to `/register`
   - Create a test registration
   - Upload a screenshot
3. **Login as admin**:
   - Go to `/auth/adminlogin`
   - Use credentials from `.env.local` (SEED_ADMIN_EMAIL/PASSWORD)
4. **Review registration**: View at `/admin/registrations`
5. **Check status**: Go to `/status` and look up your registration

### Development Tips

- **Auto-reload**: Changes to `.tsx`, `.ts`, `.css` files auto-reload
- **Terminal logs**: Check terminal for React/Next.js errors
- **Browser dev tools**: Open DevTools (F12) to check client-side errors
- **Database issues**: Check `.env.local` DATABASE_URL is correct

---

## Building for Production

### Step 1: Lint Check

Verify code quality before building:

```bash
npm run lint
```

Fix any errors:
```bash
npm run lint -- --fix
```

### Step 2: Build the Application

Compile TypeScript and optimize assets:

```bash
npm run build
```

**Expected output**:
```
✓ Compiled successfully
  Collecting page data ...
  ...
  ✓ Finalizing page optimization

Route (app)                                 Size
  ○ /                                        45 kB
  ○ /events                                  52 kB
  ○ /register                                67 kB
  ...

✓ Created Next.js production bundle
```

**Common build errors**:
- TypeScript errors: Fix types in `.ts`/`.tsx` files
- Missing env vars: Ensure all required variables are in `.env.local`
- Import errors: Verify file paths and exports

### Step 3: Test Production Build Locally

```bash
npm run start
```

This runs the production-optimized server. Verify:
- Pages load quickly
- No console errors
- Admin panel works
- External services (Cloudinary, emails) function

---

## Deployment

### Pre-Deployment Checklist

Before deploying to production, verify:

- [ ] All required environment variables are set in deployment platform
- [ ] `DATABASE_URL` points to production database (Neon, AWS RDS, etc.)
- [ ] `AUTH_SECRET` is a strong, unique 32+ character string
- [ ] `NEXT_PUBLIC_SITE_URL` is the production URL
- [ ] Cloudinary credentials are valid and production-ready
- [ ] `npm run build` completes without errors
- [ ] `/admin/settings` shows all deployment checks as configured
- [ ] Tested full flow: register → upload → check status → approve

### Deployment Platforms

#### Vercel (Recommended for Next.js)

1. **Connect repository**:
   ```
   https://vercel.com → Import Project
   ```

2. **Set environment variables** in Vercel dashboard:
   - Copy all variables from `.env.local`
   - Add production values (URLs, secrets)

3. **Deploy**:
   ```bash
   # Automatic on push to main/master
   git push origin main
   ```

#### AWS Amplify

1. Connect repository in Amplify Console
2. Add build settings:
```yaml
version: 1
phases:
  build:
    commands:
      - npm install
      - npm run build
artifacts:
  files:
    - '**/*'
```
3. Set environment variables in Console
4. Deploy

#### Docker + Self-Hosted

1. **Create Dockerfile**:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

2. **Build and run**:
```bash
docker build -t kratos:latest .
docker run -e DATABASE_URL=... -p 3000:3000 kratos:latest
```

### Post-Deployment Verification

After deploying:

1. **Visit public pages** to confirm they load
2. **Test registration** with test data
3. **Login as admin** and verify dashboard access
4. **Check `/admin/settings`** for deployment status
5. **Monitor logs** for any errors

---

## Troubleshooting

### Common Issues & Solutions

#### 1. **"Cannot find module" Error**

**Problem**: `Error: Cannot find module 'next'`

**Solution**:
```bash
rm -r node_modules
npm install
```

#### 2. **"DATABASE_URL is not set" Error**

**Problem**: `Error: DATABASE_URL environment variable is not set`

**Solution**:
- Verify `.env.local` exists in project root
- Check DATABASE_URL line has no typos
- Ensure PostgreSQL/Neon is running and accessible
- Test connection:
```bash
psql "your-connection-string"
```

#### 3. **Port 3000 Already in Use**

**Problem**: `Error: listen EADDRINUSE :::3000`

**Solution**:
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

#### 4. **Build Fails with Type Errors**

**Problem**: Build completes but has TypeScript errors

**Solution**:
```bash
# Check all errors
npm run lint
npm run build

# Fix autofix issues
npm run lint -- --fix

# Manual fixes: Open files and fix remaining issues
```

#### 5. **Cloudinary Upload Not Working**

**Problem**: Image upload fails silently

**Solution**:
- Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is correct
- Check `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is unsigned
- Confirm preset is active in Cloudinary dashboard
- Check browser console for specific error

#### 6. **Admin Login Not Working**

**Problem**: Login fails with "Invalid credentials"

**Solution**:
```bash
# Verify admin exists in database
# Re-seed admin account
npm run seed:admin

# Check SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env.local
```

#### 7. **Database Migrations Not Applied**

**Problem**: Tables don't exist after starting app

**Solution**:
```bash
# Check migration status
npx drizzle-kit status

# Run migrations
npx drizzle-kit migrate

# Verify connection and permissions
psql -c "SELECT * FROM pg_tables WHERE schemaname='public';"
```

### Getting Help

1. **Check existing documentation**:
   - [ADMIN_GUIDE.md](ADMIN_GUIDE.md)
   - [FEATURES.md](FEATURES.md)
   - [README.md](README.md)

2. **Debug steps**:
   - Check `.env.local` for correct values
   - Review terminal output for specific error messages
   - Check browser console (F12) for client-side errors
   - Review `/admin/settings` for deployment check results

3. **Database debugging**:
```bash
# Connect to database directly
psql $DATABASE_URL

# Check tables
\dt

# Check data
SELECT * FROM users;
SELECT * FROM registrations;
```

---

## Development Commands Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server (hot-reload) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Check code quality |
| `npm run lint -- --fix` | Auto-fix linting issues |
| `npm run seed:admin` | Create first admin account |

---

## Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── db/                  # Database schema and seed files
│   ├── lib/                 # Utilities and helpers
│   ├── types/               # TypeScript type definitions
│   ├── auth.ts              # Authentication config
│   └── proxy.ts             # Request proxy setup
├── drizzle/                 # Database migrations
├── public/                  # Static assets
├── scripts/                 # Utility scripts (seed, updates)
├── .env.local               # Environment variables (create this)
├── drizzle.config.ts        # Drizzle ORM config
├── next.config.ts           # Next.js config
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies and scripts
```

---

## Next Steps

1. ✅ [Install dependencies](#installation)
2. ✅ [Set up environment variables](#environment-configuration)
3. ✅ [Configure database](#database-setup)
4. ✅ [Run locally](#running-locally)
5. ⬜ [Test the application](#running-locally)
6. ⬜ [Build for production](#building-for-production)
7. ⬜ [Deploy](#deployment)

---

**Last Updated**: 2026-06-09  
**Next.js Version**: 16.2.0  
**React Version**: 19.2.4
