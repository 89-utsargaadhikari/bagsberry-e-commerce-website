# Add Default Song Feature

This adds the ability to set one default song that always plays first when users visit your website.

## Installation

Run this SQL script in your Supabase SQL editor:

```sql
-- File: add-default-song-feature.sql
```

This will:
1. Add an `is_default` column to the `music_playlist` table
2. Create a trigger to ensure only one song can be default at a time
3. Automatically unset other default songs when you set a new one

## How to Use

1. Run the SQL script in Supabase (one time setup)
2. Go to your Admin Dashboard → Music page
3. Click the ⭐ "Set Default" button on any song
4. That song will now always play first when users visit your site
5. If no default is set, a random song will play first (current behavior)

## Features

- ⭐ Only one song can be default at a time
- 🎵 Default song always plays first for new visitors
- 🎲 If no default set, random song plays (existing behavior)
- 🔄 Easy to change - just click a different song's "Set Default" button
- ✨ Works automatically - no code changes needed after running SQL

## Notes

- The default song must be "Active" to play
- Setting a new default automatically removes the old default
- You can remove the default by clicking the button again on the default song
