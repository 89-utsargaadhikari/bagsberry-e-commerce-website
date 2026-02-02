# Product Images Storage Setup

## Issue
Getting "Failed to upload image" error when adding products.

## Solution

### Step 1: Apply Storage Policies
1. Open your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Copy and paste the contents of `setup-product-images-bucket.sql`
5. Click **Run** to execute the SQL

This will create the necessary storage policies to allow:
- ✅ Anyone to view/download images (public access)
- ✅ Authenticated users to upload images
- ✅ Authenticated users to update/delete images

### Step 2: Restart Your Dev Server
The code has been updated to use `product_images` (lowercase) instead of `PRODUCT_IMAGES`.

1. Stop your dev server (Ctrl+C in terminal)
2. Start it again: `npm run dev`
3. Clear your browser cache or do a hard refresh (Ctrl+Shift+R)

### Step 3: Test Image Upload
1. Go to `/admin/products/new`
2. Try uploading a product image
3. It should now work! ✅

## What Was Changed

**File:** `lib/upload-image.ts`
- Changed bucket name from `PRODUCT_IMAGES` to `product_images` to match your Supabase bucket

## Verification

To verify the policies are set up correctly:
1. Go to Supabase Dashboard → Storage → product_images bucket
2. Click on "Policies" tab
3. You should see 4 policies listed

## Troubleshooting

If you still get errors:
1. Check the browser console for the actual Supabase error
2. Make sure you're logged in as an authenticated user (admin)
3. Verify the bucket name is exactly `product_images` in Supabase
4. Check that the bucket is marked as "Public"
