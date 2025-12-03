# Environment Variables Setup

## ✅ Database Tables Created!
All database tables have been created successfully in Railway!

---

## Step 1: Create Local .env File (For Development)

Create a file called `.env` in the `smm-panel-database` folder with this content:

```env
DATABASE_URL="postgresql://postgres:gOYVeuseWerVkzgXbTUiyhXqgXankfwK@turntable.proxy.rlwy.net:36976/railway"
NEXTAUTH_SECRET="5WKfJQWnm0aNqbRhDbhbGz/AUpuO212ZReoRxtHthC0="
NEXTAUTH_URL="http://localhost:3000"
```

**How to create:**
1. Open the `smm-panel-database` folder in Cursor/VS Code
2. Create a new file called `.env` (make sure it starts with a dot!)
3. Paste the content above
4. Save the file

---

## Step 2: Add to Vercel (For Live Website)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project (`smm-panel-database` or similar)
3. Go to **Settings** → **Environment Variables**
4. Add these 3 variables:

   **Variable 1:**
   - Name: `DATABASE_URL`
   - Value: `postgresql://postgres:gOYVeuseWerVkzgXbTUiyhXqgXankfwK@turntable.proxy.rlwy.net:36976/railway`
   - Environment: All (Production, Preview, Development)

   **Variable 2:**
   - Name: `NEXTAUTH_SECRET`
   - Value: `5WKfJQWnm0aNqbRhDbhbGz/AUpuO212ZReoRxtHthC0=`
   - Environment: All

   **Variable 3:**
   - Name: `NEXTAUTH_URL`
   - Value: `https://smmcompare.com`
   - Environment: Production
   - Also add: `http://localhost:3000` for Development

5. Click **Save** for each variable
6. **Redeploy** your project (Vercel will automatically redeploy when you add env vars, or you can manually trigger it)

---

## Step 3: Create Admin Account

After Vercel redeploys:

1. Go to: **https://smmcompare.com/admin/create-admin**
2. Fill in the form:
   - Name: Your name
   - Email: Your email
   - Password: Choose a strong password
3. Click "Create Admin"
4. You'll be redirected to login

---

## Step 4: Login and Access Admin Panel

1. Go to: **https://smmcompare.com/login**
2. Login with your admin credentials
3. Access admin panel at: **https://smmcompare.com/admin**

---

## ✅ Done!

Your database is set up and ready to use!

