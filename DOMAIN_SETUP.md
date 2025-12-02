# 🌐 Connect smmcompare.com to Vercel

## After Your Site is Deployed on Vercel:

### Step 1: Add Domain in Vercel
1. Go to your project in Vercel dashboard
2. Click **"Settings"** tab
3. Click **"Domains"** in the left sidebar
4. Type: `smmcompare.com` and click **Add**
5. Also add: `www.smmcompare.com` and click **Add**
6. Vercel will show you DNS records (save these!)

### Step 2: Update DNS in Namecheap

1. **Log in to Namecheap:** https://namecheap.com
2. Go to **Domain List** → Click **Manage** next to smmcompare.com
3. Click **Advanced DNS** tab
4. **Delete existing A and CNAME records** (except email ones if you use them)
5. **Add these records:**

#### For smmcompare.com (root domain):
- **Type:** A Record
- **Host:** @
- **Value:** `76.76.21.21`
- **TTL:** Automatic

#### For www.smmcompare.com:
- **Type:** CNAME Record  
- **Host:** www
- **Value:** `cname.vercel-dns.com`
- **TTL:** Automatic

6. Click **Save All Changes**

### Step 3: Wait for DNS Propagation
- Usually takes **5-30 minutes**
- Check status: https://dnschecker.org
- Search for: `smmcompare.com`

### Step 4: SSL Certificate (Automatic!)
- Vercel automatically provides FREE SSL
- Once DNS propagates, your site will be at:
  - ✅ https://smmcompare.com
  - ✅ https://www.smmcompare.com

---

## Alternative: Use Vercel's Nameservers (Easier!)

Instead of DNS records, you can use Vercel's nameservers:

1. In Vercel → Settings → Domains
2. Click on your domain
3. Choose **"Use Vercel DNS"**
4. Copy the nameservers shown
5. In Namecheap → Domain List → Manage → Nameservers
6. Select **"Custom DNS"**
7. Paste Vercel's nameservers
8. Save

This is easier and Vercel manages everything!

---

## Troubleshooting

**"Domain not connecting"**
- Wait 30 minutes for DNS
- Check: https://dnschecker.org

**"SSL certificate pending"**
- Wait up to 24 hours (usually instant)

**Need help?**
- Vercel Docs: https://vercel.com/docs/concepts/projects/domains

