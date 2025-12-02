# 🚀 Quick Admin Setup (5 Minutes)

## Current Status
✅ Authentication system is built  
✅ Admin panel is ready  
❌ Database not connected yet  

---

## Step 1: Set Up Database (Required!)

### Option A: Railway (Easiest - $5/month)
1. Go to **https://railway.app**
2. Sign up with GitHub
3. Click **"New Project"** → **"Provision PostgreSQL"**
4. Click on the PostgreSQL service
5. Go to **"Variables"** tab
6. Copy the **`DATABASE_URL`** (looks like: `postgresql://...`)

### Option B: Supabase (FREE)
1. Go to **https://supabase.com**
2. Create free account
3. Create new project
4. Go to **Settings** → **Database**
5. Copy the connection string
6. Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

---

## Step 2: Add to Vercel

1. Go to **https://vercel.com/dashboard**
2. Click your **smmcompare** project
3. Go to **Settings** → **Environment Variables**
4. Add these:

```env
DATABASE_URL="paste-your-database-url-here"
NEXTAUTH_SECRET="run-this-command-below"
NEXTAUTH_URL="https://smmcompare.com"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```
Copy the output and paste as `NEXTAUTH_SECRET`

5. Click **Save**
6. Go to **Deployments** tab
7. Click **"..."** on latest deployment → **"Redeploy"**

---

## Step 3: Create Database Tables

After redeploy, you need to run database migrations.

**Option A: Using Prisma Studio (Local)**
```bash
cd smm-panel-database
npx prisma db push
```

**Option B: Using Railway Console**
1. Go to Railway → PostgreSQL → Connect
2. Use the SQL editor to run migrations (or use Prisma Migrate)

---

## Step 4: Create Your Admin Account

1. Go to: **https://smmcompare.com/admin/create-admin**
2. Fill in:
   - Name: Your name
   - Email: admin@smmcompare.com (or your email)
   - Password: Strong password (min 8 chars)
3. Click **"Create Admin Account"**
4. You'll be redirected to login

---

## Step 5: Login as Admin

1. Go to: **https://smmcompare.com/login**
2. Enter your admin email and password
3. Click **"Sign in"**
4. You'll see the dashboard
5. Click **"Admin Panel"** in the sidebar (or go to `/admin`)

---

## ✅ You're Done!

**Admin Panel URL:** https://smmcompare.com/admin

---

## Troubleshooting

**"Cannot create admin"**
- Make sure DATABASE_URL is set in Vercel
- Make sure you redeployed after adding env vars
- Check Vercel build logs for errors

**"Database connection error"**
- Verify DATABASE_URL is correct
- Make sure database is running
- Check if database allows external connections

**"Access denied to /admin"**
- Make sure you created admin account
- Make sure you're logged in
- Check your user role is "ADMIN"

---

## Need Help?

If you get stuck, check:
- Vercel deployment logs
- Railway database logs
- Browser console for errors

