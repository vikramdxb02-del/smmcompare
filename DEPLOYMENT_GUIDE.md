# 🚀 Deployment Guide for smmcompare.com

## Overview
This guide will help you deploy your website to make it live at **smmcompare.com**

---

## Step 1: Create a GitHub Account (if you don't have one)

1. Go to **https://github.com**
2. Click **Sign up**
3. Create a free account

---

## Step 2: Create a Vercel Account

1. Go to **https://vercel.com**
2. Click **Sign Up**
3. Choose **Continue with GitHub** (easiest!)
4. Authorize Vercel to access your GitHub

---

## Step 3: Push Your Code to GitHub

### Option A: Using GitHub Desktop (Easiest for Beginners)
1. Download GitHub Desktop: https://desktop.github.com
2. Sign in with your GitHub account
3. File → Add Local Repository
4. Select your `smm-panel-database` folder
5. Click "Create Repository"
6. Click "Publish Repository"

### Option B: Using Terminal
```bash
cd /Users/nik/projects/yoyomedia-theme/smm-panel-database
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smmcompare.git
git push -u origin main
```

---

## Step 4: Deploy to Vercel

1. Go to **https://vercel.com/dashboard**
2. Click **"Add New..."** → **"Project"**
3. Find your `smmcompare` repository
4. Click **"Import"**
5. Leave all settings as default
6. Click **"Deploy"**
7. Wait 1-2 minutes for deployment

Your site will be live at: `smmcompare.vercel.app`

---

## Step 5: Connect Your Domain (smmcompare.com)

### In Vercel:
1. Go to your project in Vercel
2. Click **"Settings"** tab
3. Click **"Domains"** in sidebar
4. Type `smmcompare.com` and click **Add**
5. Also add `www.smmcompare.com`
6. Vercel will show you the DNS records needed

### In Namecheap:
1. Log in to **https://namecheap.com**
2. Go to **Domain List** → Click **Manage** on smmcompare.com
3. Click **Advanced DNS** tab
4. Delete any existing A or CNAME records (except email ones if you have them)
5. Add these records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | Automatic |
| CNAME | www | cname.vercel-dns.com | Automatic |

6. Wait 5-30 minutes for DNS to propagate

---

## Step 6: Enable HTTPS (Automatic)

Vercel automatically provides free SSL certificates. Once DNS propagates, your site will be available at:
- ✅ https://smmcompare.com
- ✅ https://www.smmcompare.com

---

## Step 7: Set Up Database (Optional but Recommended)

For storing users and data, you need a database:

### Using Railway (Recommended):
1. Go to **https://railway.app**
2. Sign up with GitHub
3. Click **"New Project"** → **"Provision PostgreSQL"**
4. Click on the PostgreSQL service
5. Go to **"Connect"** tab
6. Copy the **DATABASE_URL**
7. In Vercel, go to Settings → Environment Variables
8. Add: `DATABASE_URL` = (paste the URL)
9. Redeploy

---

## 🎉 Done!

Your website should now be live at **https://smmcompare.com**

---

## Troubleshooting

### "DNS not propagated yet"
- Wait 5-30 minutes
- Try: https://dnschecker.org to check status

### "Build failed on Vercel"
- Check the build logs in Vercel
- Make sure all files are pushed to GitHub

### Need help?
- Vercel Docs: https://vercel.com/docs
- Namecheap DNS Help: https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/

---

## Quick Reference

| Service | URL | Purpose |
|---------|-----|---------|
| Vercel | vercel.com | Hosting |
| GitHub | github.com | Code storage |
| Namecheap | namecheap.com | Domain |
| Railway | railway.app | Database |


