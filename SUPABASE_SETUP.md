# Supabase Setup Instructions

## Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (looks like `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (long JWT token)

## Step 2: Create Environment File

Create a file named `.env.local` in the root of your project:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 1.

## Step 3: Set Up Database

1. In Supabase Dashboard, go to **SQL Editor**
2. Copy the entire contents of `scripts/setup-database.sql`
3. Paste and run it in the SQL Editor
4. This will create:
   - `products` table with 5 sample bags
   - `orders` table
   - `cart_items` table
   - `order_items` table
   - `user_profiles` table
   - All necessary Row Level Security (RLS) policies

## Step 4: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Step 5: Test the Connection

1. Visit `http://localhost:3000` - you should see 5 sample products
2. Visit `http://localhost:3000/admin` - admin dashboard with stats
3. Visit `http://localhost:3000/products` - product catalog

---

## Current Status

- ✅ Frontend running
- ✅ Admin dashboard built
- ✅ Database schema ready
- ❌ **Environment variables not configured** (this blocks Supabase connection)
- ❌ **Database not initialized** (run the SQL script)

## Sample Products Included

The setup script includes 5 luxury bags:
1. Velvet Crossbody - $189.99 (sale: $149.99)
2. Leather Tote - $249.99
3. Quilted Shoulder Bag - $199.99 (sale: $179.99)
4. Mini Clutch - $79.99
5. Hobo Handbag - $219.99 (sale: $199.99)

All products use Unsplash placeholder images currently.
