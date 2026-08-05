# Delivery Location Feature - Setup Instructions

## Issue
You're seeing this error:
```
Could not find the 'delivery_latitude' column of 'orders' in the schema cache
```

## Solution

The location columns need to be added to the `orders` table in your database.

### Step 1: Run SQL Migration

1. Open your **Supabase Dashboard**: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Copy and paste the contents of `add-delivery-location.sql`
5. Click **Run** to execute the SQL

This will add three new columns to the orders table:
- `delivery_latitude` - Latitude coordinate of delivery location
- `delivery_longitude` - Longitude coordinate of delivery location  
- `delivery_map_url` - Google Maps URL for the pinned location

### Step 2: Restart Your Dev Server

```bash
# Stop the server (Ctrl+C)
# Then start it again:
npm run dev
```

### Step 3: Test the Feature

1. Go to `/checkout` (while logged in)
2. Add items to cart first
3. On checkout page:
   - **Option 1**: Search for your location in the search box
   - **Option 2**: Click "Use My Current Location" button
   - **Option 3**: Click anywhere on the map to pin a location
4. The address fields will auto-fill based on your selected location
5. Place the order
6. Check admin dashboard → Orders → View the order
7. You should see "Open in Maps" button and coordinates displayed

## What This Feature Does

### For Customers:
- **Map Search**: Type location name and select from suggestions
- **GPS Location**: Use device's current location with one click
- **Manual Pin**: Click on map to pin exact delivery spot
- **Auto-fill**: Address fields populate automatically from map selection
- **Read-only**: Address fields locked to prevent mismatch with map

### For Admin:
- **Delivery Address**: Shows complete address from customer
- **Map Link**: "Open in Maps" button to view exact pinned location
- **Coordinates**: Displays precise lat/long coordinates
- **Easy Navigation**: Delivery team can use the map link to find customer

## Database Schema

The new columns are:
```sql
delivery_latitude DECIMAL(10, 8)    -- e.g., 27.7172453
delivery_longitude DECIMAL(11, 8)   -- e.g., 85.3239605
delivery_map_url TEXT               -- e.g., https://www.google.com/maps?q=27.7172,85.3240
```

## Benefits

✅ **Accurate Delivery** - Pinpoint exact location instead of vague addresses
✅ **Better UX** - No typing long addresses, just pin on map
✅ **Reduced Errors** - No spelling mistakes or wrong addresses
✅ **Faster Delivery** - Delivery team gets exact coordinates
✅ **Professional** - Modern e-commerce standard feature

## Troubleshooting

### Map not loading
- Check browser console for errors
- Ensure internet connection is stable
- Try refreshing the page

### Location not auto-filling
- Make sure you've selected/pinned a location before checkout
- Check that you clicked "Use My Current Location" or pinned on map
- Browser must allow location access for GPS feature

### Order not saving location
- Verify you ran the SQL migration script
- Check Supabase dashboard → Database → Tables → orders
- Confirm the three new columns exist
- Restart your dev server after running migration
