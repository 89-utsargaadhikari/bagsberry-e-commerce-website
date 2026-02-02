# Categories & Brands System - Setup Instructions

This guide explains how to set up the categories and brands system for your e-commerce website.

## Database Setup

Run this SQL script in your Supabase SQL Editor:

```sql
-- File: scripts/add-categories-brands.sql
```

This will:
1. Create `categories` and `brands` tables
2. Add `category_id` and `brand_id` columns to `products` table
3. Set up proper foreign keys and indexes
4. Create RLS policies for security
5. Insert default categories (Tote, Crossbody, Shoulder, Clutch, etc.)
6. Insert default luxury brands (Gucci, Louis Vuitton, Chanel, Prada, etc.)

## Admin Features

### Manage Categories
- Go to: **Admin Dashboard → Categories**
- Click "Add Category" to create new categories
- Edit or delete existing categories
- Toggle categories active/inactive
- Categories have auto-generated slugs for URLs

### Manage Brands
- Go to: **Admin Dashboard → Brands**
- Click "Add Brand" to add new brands
- Edit or delete existing brands
- Toggle brands active/inactive
- Brands have auto-generated slugs for URLs

### Add Products
When creating or editing products:
1. Select **Category** from dropdown (required)
2. Select **Brand** from dropdown (required)
3. Both are automatically loaded from the database
4. Only active categories and brands appear in dropdowns

## Customer Features

### Browse & Filter
- Filter products by **Category** (e.g., "Tote Bags")
- Filter products by **Brand** (e.g., "Gucci")
- Use **both filters together** (e.g., "Gucci Tote Bags")
- Search by product name or description
- Sort by price or relevance

### Filter Examples
- All Gucci products: Select "Gucci" brand filter
- All Tote Bags: Select "Tote Bags" category filter
- Gucci Tote Bags: Select both "Gucci" and "Tote Bags"
- Chanel Clutches: Select "Chanel" brand + "Clutches" category

## Key Benefits

✅ **Fully Dynamic** - Add/edit/delete categories and brands without code changes
✅ **SEO Friendly** - Auto-generated slugs for clean URLs
✅ **Industry Standard** - Follows e-commerce best practices
✅ **Flexible Filtering** - Combine category + brand filters
✅ **Admin Controlled** - No hardcoded values in code
✅ **Scalable** - Add unlimited categories and brands

## Notes

- When deleting a category/brand, products using it will have NULL values
- Inactive categories/brands won't appear in filters
- Product listings work even without categories/brands (backward compatible)
