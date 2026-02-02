# Production Deployment Checklist

## Environment Variables Required

Before deploying to production, ensure these environment variables are set:

### 1. Supabase (Required)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Email Service - Resend (Required for order notifications)
```
RESEND_API_KEY=re_your_api_key_here
```

Get your API key from: https://resend.com/api-keys

### 3. Site URL (Required for production)
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**Important:** This MUST be set to your production domain (without trailing slash).
This is used for:
- Email notification callbacks
- OAuth redirects
- Sitemap generation
- Open Graph URLs

## Deployment Steps

### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# Project Settings → Environment Variables
```

### 2. Other Platforms
Set all environment variables in your platform's settings:
- Netlify: Site settings → Environment variables
- Railway: Project → Variables
- AWS/Azure: Configure in deployment settings

## Database Setup

Run these SQL scripts in your Supabase SQL Editor (in order):

1. `scripts/setup-database.sql` - Main tables
2. `scripts/add-music-playlist.sql` - Music player
3. `scripts/add-default-song-feature.sql` - Default song
4. `scripts/add-categories-brands.sql` - Categories & brands
5. `scripts/setup-product-images-bucket.sql` - Storage policies

## Storage Setup

In Supabase Dashboard → Storage:
1. Verify `product_images` bucket exists
2. Ensure bucket is marked as **Public**
3. Verify storage policies are created (from step 5 above)

## Post-Deployment Checklist

- [ ] Environment variables set correctly
- [ ] Database migrations run successfully
- [ ] Storage bucket configured with policies
- [ ] Test user registration/login
- [ ] Test product browsing
- [ ] Test add to cart
- [ ] Test checkout flow
- [ ] Test order email notifications
- [ ] Test admin login
- [ ] Test product creation with image upload
- [ ] Test music player (main site only, not admin)
- [ ] Verify categories and brands filters work

## Common Issues

### Emails not sending
- Check `RESEND_API_KEY` is set
- Check `NEXT_PUBLIC_SITE_URL` is set to production domain
- Verify domain in Resend dashboard

### Images not uploading
- Check storage bucket exists: `product_images`
- Check storage policies are created
- Verify bucket is public

### OAuth/Login issues
- Check Supabase redirect URLs include your domain
- Update Site URL in Supabase dashboard

### Admin access denied
- Ensure user exists in `admin_users` table
- Check RLS policies are enabled
