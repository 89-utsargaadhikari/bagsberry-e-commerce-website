# Pre-Deployment Checklist

Complete this checklist **before** deploying to production.

## 1. Environment Variables Setup

### Required Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- [ ] `RESEND_API_KEY` - Resend API key for email notifications
- [ ] `NEXT_PUBLIC_SITE_URL` - **CRITICAL** - Your production domain (e.g., `https://bagsberry.com`)

### Where to Set Them
- **Vercel**: Project Settings → Environment Variables → Add each variable
- **Netlify**: Site Settings → Environment Variables
- **Railway**: Project → Variables tab
- **Other platforms**: Check your hosting provider's documentation

### Verification
```bash
# Test locally with production-like environment
# Create .env.local with production values (don't commit!)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
RESEND_API_KEY=re_your_key
# ... etc

# Run build locally
npm run build

# Test production build locally
npm run start
```

## 2. Database Migration

### Run SQL Scripts in Order

Go to: **Supabase Dashboard → SQL Editor**

- [ ] **Step 1:** Run `scripts/setup-database.sql`
  - Creates main tables: `products`, `orders`, `order_items`, `admin_users`
  - Sets up RLS policies
  - Creates indexes

- [ ] **Step 2:** Run `scripts/add-music-playlist.sql`
  - Creates `music_playlist` table
  - Adds sample songs (optional, can customize)

- [ ] **Step 3:** Run `scripts/add-default-song-feature.sql`
  - Adds `is_default` column to `music_playlist`
  - Sets up default song functionality

- [ ] **Step 4:** Run `scripts/add-categories-brands.sql`
  - Creates `categories` and `brands` tables
  - Adds foreign keys to `products`
  - Inserts default categories (Tote, Crossbody, Shoulder, etc.)
  - Inserts default luxury brands (Gucci, Chanel, Louis Vuitton, etc.)

- [ ] **Step 5:** Run `scripts/setup-product-images-bucket.sql`
  - Sets up storage policies for `product_images` bucket
  - Allows public read, authenticated write

### Verify Database Setup
- [ ] All tables exist in Supabase dashboard
- [ ] RLS policies are enabled on all tables
- [ ] Sample categories and brands are inserted
- [ ] Foreign keys are properly set up

## 3. Supabase Storage Setup

### Create Storage Bucket
- [ ] Go to: **Supabase Dashboard → Storage**
- [ ] Create bucket named: `product_images` (exact name, lowercase)
- [ ] Mark bucket as **Public**
- [ ] Run storage policies script (already done in step 2.5 above)

### Verify Storage Policies
- [ ] Go to Storage → `product_images` → Policies tab
- [ ] Should see 4 policies:
  - Public can view product images
  - Authenticated users can upload product images
  - Authenticated users can update product images
  - Authenticated users can delete product images

## 4. Admin User Setup

### Create Your Admin Account
```sql
-- Run this in Supabase SQL Editor
-- Replace 'your-user-id-here' with your actual Supabase auth user ID

-- First, sign up normally on your site to create a user account
-- Then get your user ID from: Supabase Dashboard → Authentication → Users
-- Copy your User ID

-- Add yourself as admin
INSERT INTO admin_users (user_id, email, name)
VALUES (
  'your-user-id-here',
  'your-email@example.com',
  'Your Name'
);
```

### Verification
- [ ] You can access `/admin` after logging in
- [ ] Admin dashboard displays correctly
- [ ] You can view products, orders, categories, brands

## 5. Email Service Setup (Resend)

### Domain Verification
- [ ] Go to: https://resend.com/domains
- [ ] Add your domain
- [ ] Add DNS records (SPF, DKIM, DMARC)
- [ ] Wait for verification (usually 5-30 minutes)

### API Key
- [ ] Go to: https://resend.com/api-keys
- [ ] Create API key
- [ ] Copy and save in environment variables as `RESEND_API_KEY`
- [ ] Set "From" email address (e.g., `orders@yourdomain.com`)

### Test Email
```bash
# After deployment, test email by placing a test order
# Check Resend dashboard for sent emails
```

## 6. Code Quality Checks

### Linting and Type Checking
```bash
# Run these locally before deploying
npm run lint
npm run build
```

- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Build completes successfully

### Security Checks
- [ ] No API keys or secrets in code
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.example` is up to date
- [ ] No console.logs with sensitive data

## 7. Final Code Review

### Critical Files to Review
- [ ] `app/api/orders/create/route.ts` - Email URL uses environment variable
- [ ] `lib/upload-image.ts` - Uses correct bucket name (`product_images`)
- [ ] `proxy.ts` - Middleware is properly configured
- [ ] All admin routes have proper authentication

### Remove Test/Debug Code
- [ ] Remove any `console.log` statements (except error logging)
- [ ] Remove debug flags or test data
- [ ] Remove commented-out code

## 8. Git & Version Control

### Create Production Branch
```bash
# Create production-ready branch from your working branch
git checkout -b production
git push origin production
```

### Tag Release
```bash
# Tag your release for easy rollback
git tag -a v1.0.0 -m "Initial production release"
git push origin v1.0.0
```

- [ ] All changes committed
- [ ] Branch pushed to GitHub
- [ ] Release tagged

## 9. Content Preparation

### Initial Products
- [ ] Prepare at least 5-10 products with:
  - High-quality images
  - Detailed descriptions
  - Proper pricing
  - Stock quantities
  - Assigned categories and brands

### Categories & Brands
- [ ] Review default categories (customize if needed)
- [ ] Review default brands (customize if needed)
- [ ] Add any additional categories/brands needed

### Music Playlist (Optional)
- [ ] Customize songs in music playlist
- [ ] Set default song
- [ ] Test music player functionality

## 10. Performance Optimization

### Images
- [ ] All product images optimized (WebP format recommended)
- [ ] Images are appropriately sized (max 1000px width recommended)
- [ ] No images over 500KB

### Database
- [ ] Indexes are set up on frequently queried columns
- [ ] RLS policies are optimized

## 11. Legal & Compliance

- [ ] Privacy Policy added to site
- [ ] Terms of Service added to site
- [ ] Refund/Return Policy added to site
- [ ] Cookie consent banner (if needed for your region)
- [ ] GDPR compliance (if serving EU customers)

## 12. Monitoring & Analytics Setup

### Error Tracking (Recommended)
- [ ] Set up Sentry or similar error tracking
- [ ] Add error tracking to `next.config.js`

### Analytics (Recommended)
- [ ] Set up Google Analytics or Plausible
- [ ] Add tracking code to site

### Logging
- [ ] Set up log aggregation (e.g., Vercel Logs, Logtail)
- [ ] Configure log retention

## 13. Backup Strategy

- [ ] Supabase automatic backups enabled (check billing plan)
- [ ] Schedule manual database exports (weekly recommended)
- [ ] Keep local copy of latest database schema

## 14. DNS & Domain Setup

- [ ] Domain purchased and owned
- [ ] DNS pointed to hosting provider
- [ ] SSL certificate configured (usually automatic)
- [ ] www redirect configured
- [ ] Subdomain setup if needed

## 15. Pre-Deployment Testing

### Local Production Build
```bash
npm run build
npm run start
```

- [ ] Test all pages load
- [ ] Test user registration/login
- [ ] Test product browsing
- [ ] Test add to cart
- [ ] Test checkout flow
- [ ] Test admin dashboard
- [ ] Test product creation
- [ ] Test image upload

## Ready to Deploy? ✅

Once ALL items above are checked:
1. Deploy to your hosting platform
2. Wait for deployment to complete
3. Proceed to **POST-DEPLOYMENT.md** checklist

---

**Last Updated:** 2026-01-28
**Version:** 1.0.0
