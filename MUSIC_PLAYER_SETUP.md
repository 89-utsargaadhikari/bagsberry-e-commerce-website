# 🎵 Music Player Feature - Complete Setup

## Overview

A beautiful background music system for your website using **FREE YouTube audio**. Admins manage the playlist, customers enjoy the music!

---

## ✨ Features

### For Admins (`/admin/music`)
**Playlist Management Only:**
- ➕ Add songs (title, artist, YouTube URL)
- 🗑️ Delete songs from playlist
- ⬆️⬇️ Reorder songs with up/down arrows
- 🔄 Enable/disable songs (toggle active/inactive)
- 👁️ Preview songs (opens YouTube in new tab)
- 📋 See full playlist with durations

**NO player controls in admin** - just manage the list!

### For Customers (Website)
**Cute Pink Music Widget:**
- 💖 Tiny pink circular button (top-right corner)
- 🎵 Pulsing music icon (shows music is playing)
- 🔊 Mute button (appears on hover)
- ❌ Close button (appears on hover)
- 📋 Song info tooltip (appears on hover)
- ▶️ **Auto-plays when website opens!**
- 🔄 **Auto-loops through playlist**

---

## 🚀 Setup Instructions

### Step 1: Run Database Script
Run this in Supabase SQL Editor:

```sql
-- File: scripts/add-music-playlist.sql
```

This creates:
- `music_playlist` table
- RLS policies (admins manage, everyone views)
- Sample songs (5 girly pop songs pre-loaded!)

### Step 2: Access Admin Dashboard
Go to: `http://localhost:3000/admin/music`

### Step 3: Add Your Songs

1. Find a song on YouTube
2. Copy the full URL (e.g., `https://www.youtube.com/watch?v=TUVcZfQe-Kw`)
3. Click "Add Song" in admin
4. Fill in:
   - Title: "Levitating"
   - Artist: "Dua Lipa"
   - YouTube URL: (paste the URL)
   - Duration: 203 (seconds, optional)
5. Click "Add Song"

### Step 4: Manage Playlist

**Reorder Songs:**
- Use ⬆️⬇️ arrows to change play order

**Enable/Disable:**
- Toggle switch on/off (keeps song in list without deleting)

**Delete:**
- Click "Delete" to permanently remove

**Preview:**
- Click "Preview" to watch video on YouTube

---

## 📱 How It Looks

### Admin Dashboard
```
╔════════════════════════════════════════╗
║  🎵 Music Playlist           [+ Add]   ║
╠════════════════════════════════════════╣
║  ⬆️⬇️  1  Levitating                   ║
║         Dua Lipa                       ║
║         3:23  [Active ✓] [Preview] [❌]║
╠════════════════════════════════════════╣
║  ⬆️⬇️  2  Good 4 U                     ║
║         Olivia Rodrigo                 ║
║         2:58  [Active ✓] [Preview] [❌]║
╚════════════════════════════════════════╝
```

### Customer Widget (Top-Right Corner)
```
    ╭────╮
  ❌│ 🎵 │🔊  💖 Pink!
    ╰────╯
      ⬇️
  Levitating         
  Dua Lipa          
  Song 1 of 5            
    
(Hover to see mute/close & song info)
```

**Ultra minimal!** Just a tiny pink circle with music icon.
- **Auto-plays** when website opens
- **No buttons needed** - music plays automatically
- **Hover** to mute or close

---

## 🎵 Pre-loaded Songs (Samples)

The database script includes 5 girly pop songs:

1. **Levitating** - Dua Lipa
2. **Good 4 U** - Olivia Rodrigo
3. **Flowers** - Miley Cyrus
4. **Anti-Hero** - Taylor Swift
5. **Dance The Night** - Dua Lipa

You can delete these and add your own!

---

## 🎀 Suggested Girly Songs

Perfect for a feminine shopping vibe:

### Pop Icons
- "7 Rings" - Ariana Grande
- "Roar" - Katy Perry
- "Confident" - Demi Lovato
- "Woman" - Doja Cat
- "Boss Bitch" - Doja Cat

### Upbeat & Fun
- "Espresso" - Sabrina Carpenter
- "Pink Pony Club" - Chappell Roan
- "Physical" - Dua Lipa
- "Blinding Lights" - The Weeknd (remix)
- "Don't Start Now" - Dua Lipa

### Chill Shopping Vibes
- "Cardigan" - Taylor Swift
- "Drivers License" - Olivia Rodrigo
- "Traitor" - Olivia Rodrigo
- "Happier Than Ever" - Billie Eilish

### Girl Power
- "Run The World (Girls)" - Beyoncé
- "Salute" - Little Mix
- "Shout Out to My Ex" - Little Mix
- "Woman Like Me" - Little Mix

---

## 🎛️ Customer Widget Controls

| Control | What It Does |
|---------|-------------|
| 💖 Pink Circle | Tiny pink dot in top-right - shows music is active |
| 🎵 Music Icon | Pulses when music is playing |
| 🔊 Mute Button | Shows on hover - toggle sound on/off |
| ❌ Close Button | Shows on hover - hide widget completely |
| 💬 Song Info | Tooltip on hover - shows current song & artist |
| ▶️ Auto-Play | Music starts automatically when website opens! |
| 🔄 Auto-Next | Automatically plays next song when current ends |

**No buttons needed!** Music plays automatically, hover to control.

---

## 💡 How It Works Technically

### YouTube IFrame API (FREE!)
- No API key needed
- No usage limits
- No billing
- Just paste YouTube URLs

### Database
- Stores song metadata (title, artist, URL)
- Admins control via Supabase RLS
- Customers can only view active songs

### Player
- Loads YouTube IFrame API automatically
- Plays audio only (no video shown)
- Respects copyright (uses official YouTube videos)
- Auto-advances to next song when finished

---

## 🔒 Security & Permissions

### Admin Only (RLS Protected)
- ✅ Add songs
- ✅ Delete songs
- ✅ Update songs
- ✅ Reorder playlist

### Everyone (Public)
- ✅ View active songs
- ✅ Play music
- ❌ Can't modify playlist

---

## 📊 Database Table

```sql
music_playlist:
  - id (UUID)
  - title (text)
  - artist (text)
  - youtube_url (text)
  - duration_seconds (integer)
  - is_active (boolean) - show in player?
  - play_order (integer) - sort order
  - created_at (timestamp)
  - updated_at (timestamp)
```

---

## 🎯 Usage Tips

### Finding Good YouTube Links
1. Search song on YouTube
2. Pick official music video or audio
3. Copy full URL from address bar
4. Paste in admin dashboard

### Managing Volume
- Customer can control their own volume
- Starts at 50% by default
- Setting saves for their session

### When Player Shows
- Automatically appears if songs exist
- Only shows when playlist has active songs
- Customers can hide it anytime

---

## 🐛 Troubleshooting

### Player Not Showing?
- Check if any songs are marked "Active" in admin
- Verify YouTube URLs are valid
- Check browser console for errors

### Song Not Playing?
- Make sure YouTube video is available (not deleted/private)
- Check if customer's country allows the video
- Try a different video URL

### Can't Add Songs in Admin?
- Make sure you're logged in as admin
- Check RLS policies are applied
- Verify database table exists

---

## ✅ Checklist

### Setup
- [ ] Run `scripts/add-music-playlist.sql` in Supabase
- [ ] Access `/admin/music` page
- [ ] See pre-loaded sample songs

### Admin Tasks
- [ ] Add your own song
- [ ] Delete a song
- [ ] Reorder songs
- [ ] Toggle a song active/inactive
- [ ] Preview a song on YouTube

### Customer Experience
- [ ] Visit homepage (player appears bottom-right)
- [ ] Click play button
- [ ] Test skip forward/backward
- [ ] Try shuffle mode
- [ ] Adjust volume
- [ ] Minimize player
- [ ] Close player

---

## 🎉 That's It!

**Admin:** Manage playlist at `/admin/music`  
**Customer:** Enjoy music on website automatically  
**Cost:** 100% FREE (using YouTube)

No API keys, no limits, no billing! 🎵✨

---

**Created for Bagsberry** 💖
