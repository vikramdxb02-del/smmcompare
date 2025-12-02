# 🔐 Admin Panel Setup Guide

## How to Create Your First Admin Account

### Step 1: Set Up Database (Required First!)

You need a PostgreSQL database before you can create admin accounts.

**Option A: Railway (Recommended - $5/month)**
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Provision PostgreSQL"
4. Copy the `DATABASE_URL` from the PostgreSQL service
5. Add it to Vercel environment variables

**Option B: Free Database (Supabase)**
1. Go to https://supabase.com
2. Create free account
3. Create new project
4. Go to Settings → Database
5. Copy the connection string
6. Add to Vercel as `DATABASE_URL`

---

### Step 2: Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="generate-random-string-here"
NEXTAUTH_URL="https://smmcompare.com"
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

4. Click **Save**
5. **Redeploy** your project

---

### Step 3: Run Database Migration

After adding DATABASE_URL, you need to create the database tables:

**Option A: Using Prisma Studio (Local)**
```bash
cd smm-panel-database
npx prisma db push
```

**Option B: Using Railway Console**
1. Go to Railway → Your PostgreSQL service
2. Click "Connect" → "Query"
3. Or use Prisma Migrate (more advanced)

---

### Step 4: Create Your First Admin

Once database is set up:

1. Go to: **https://smmcompare.com/admin/create-admin**
2. Fill in the form:
   - Name: Your name
   - Email: Your email (e.g., admin@smmcompare.com)
   - Password: Strong password (min 8 characters)
   - Confirm Password: Same password
3. Click **"Create Admin Account"**
4. You'll be redirected to login page

---

### Step 5: Login as Admin

1. Go to: **https://smmcompare.com/login**
2. Enter your admin email and password
3. Click **"Sign in"**
4. You'll be redirected to dashboard
5. Go to: **https://smmcompare.com/admin** to access admin panel

---

## Admin Panel Features

Once logged in as admin, you can access:

- **Admin Dashboard** - Overview of all stats
- **Manage Users** - View, edit, delete users
- **Manage Providers** - Add/edit SMM panel providers
- **Analytics** - View platform statistics
- **Settings** - Configure platform settings
- **Security** - Monitor security events

---

## Troubleshooting

### "Failed to create admin"
- Make sure database is set up
- Check DATABASE_URL in Vercel environment variables
- Make sure you ran `prisma db push` or migrations

### "Cannot access /admin"
- Make sure you're logged in
- Make sure your user role is "ADMIN"
- Check browser console for errors

### "Database connection error"
- Verify DATABASE_URL is correct
- Check if database is running
- Make sure database allows connections from Vercel IPs

---

## Security Notes

⚠️ **Important:**
- Only create admin accounts you trust
- Use strong passwords
- Don't share admin credentials
- Consider 2FA for admin accounts (future feature)

---

## Next Steps After Setup

1. ✅ Create admin account
2. ✅ Login and test admin panel
3. 🔄 Add more admin users (from admin panel)
4. 🔄 Set up Meilisearch for search
5. 🔄 Import SMM services data

---

Need help? Check the main README.md or ask for assistance!

