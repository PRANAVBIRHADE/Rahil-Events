# KRATOS Setup - Quick Reference

## ⚡ Quick Start (5 minutes)

```bash
# 1. Install
npm install

# 2. Create .env.local with required vars
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=password123

# 3. Setup database
npx drizzle-kit migrate
npm run seed:admin

# 4. Run
npm run dev

# 5. Access http://localhost:3000
```

---

## 📋 Environment Variables Needed

| Variable | Example | Required |
|----------|---------|----------|
| `DATABASE_URL` | `postgresql://user:pass@host/db` | ✅ |
| `AUTH_SECRET` | `abc123def456...` (32+ chars) | ✅ |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `mycloud` | ✅ |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `mypreset` | ✅ |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | ✅ |
| `SEED_ADMIN_EMAIL` | `admin@example.com` | ✅ |
| `SEED_ADMIN_PASSWORD` | `SecurePass123!` | ✅ |
| `SMTP_*` | Email settings | ❌ |
| `TWILIO_*` | WhatsApp settings | ❌ |
| `ADMIN_SETUP_KEY` | `secret-key` | ❌ |

---

## 🛠️ Build Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (auto-reload)
npm run build            # Build for production
npm start                # Run production server
npm run lint             # Check code quality
npm run lint -- --fix    # Auto-fix issues
npm run seed:admin       # Create first admin
```

---

## 🌐 Key URLs

| Page | URL |
|------|-----|
| Home | `http://localhost:3000` |
| Events | `http://localhost:3000/events` |
| Register | `http://localhost:3000/register` |
| Status | `http://localhost:3000/status` |
| Admin Login | `http://localhost:3000/auth/adminlogin` |
| Admin Dashboard | `http://localhost:3000/admin/dashboard` |
| Settings | `http://localhost:3000/admin/settings` |
| Registrations | `http://localhost:3000/admin/registrations` |
| Desk Entry | `http://localhost:3000/admin/desk` |

---

## 🔧 Common Tasks

### Start Development
```bash
npm run dev
```

### Run Production Locally
```bash
npm run build && npm start
```

### Generate AUTH_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Reset Admin Account
```bash
npm run seed:admin
```

### Check Database
```bash
psql $DATABASE_URL
\dt
SELECT * FROM users;
```

### Fix Linting Errors
```bash
npm run lint -- --fix
```

---

## ❌ Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `npm run dev -- -p 3001` |
| Database connection error | Check DATABASE_URL in .env.local |
| "Cannot find module" | `npm install` or `rm -r node_modules && npm install` |
| Build fails | `npm run lint -- --fix` then `npm run build` |
| Admin login fails | `npm run seed:admin` |
| Migrations not applied | `npx drizzle-kit migrate` |

---

## 📚 Documentation Files

- **[BUILD_AND_RUN_GUIDE.md](BUILD_AND_RUN_GUIDE.md)** - Complete setup guide (this file)
- **[README.md](README.md)** - Project overview
- **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)** - Staff operations
- **[FEATURES.md](FEATURES.md)** - Feature documentation

---

## 🚀 Deployment Checklist

- [ ] All env vars set (production values)
- [ ] `npm run build` succeeds
- [ ] Test `/admin/settings` 
- [ ] Test registration flow
- [ ] Test admin approval
- [ ] Set up database backups
- [ ] Configure monitoring/alerts
- [ ] Test recovery procedures

---

**Quick Links**: [Full Guide](BUILD_AND_RUN_GUIDE.md) | [README](README.md) | [Admin Guide](ADMIN_GUIDE.md)
