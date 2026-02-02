-- Create music playlist table for background music feature

CREATE TABLE IF NOT EXISTS music_playlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255),
  youtube_url TEXT,
  duration_seconds INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  play_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE music_playlist ENABLE ROW LEVEL SECURITY;

-- Public can view active songs
CREATE POLICY "Anyone can view active songs" ON music_playlist
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admins can manage playlist
CREATE POLICY "Admins can insert songs" ON music_playlist
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can update songs" ON music_playlist
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can delete songs" ON music_playlist
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_music_playlist_order ON music_playlist(play_order, created_at);

-- Insert some sample girly/feminine songs (you can change these!)
INSERT INTO music_playlist (title, artist, youtube_url, duration_seconds, play_order, is_active)
VALUES
  ('Levitating', 'Dua Lipa', 'https://www.youtube.com/watch?v=TUVcZfQe-Kw', 203, 1, true),
  ('Good 4 U', 'Olivia Rodrigo', 'https://www.youtube.com/watch?v=gNi_6U5Pm_o', 178, 2, true),
  ('Flowers', 'Miley Cyrus', 'https://www.youtube.com/watch?v=G7KNmW9a75Y', 200, 3, true),
  ('Anti-Hero', 'Taylor Swift', 'https://www.youtube.com/watch?v=b1kbLwvqugk', 200, 4, true),
  ('Dance The Night', 'Dua Lipa', 'https://www.youtube.com/watch?v=Vn3IRHhA7kI', 177, 5, true);

COMMENT ON TABLE music_playlist IS 'Background music playlist for the website';
COMMENT ON COLUMN music_playlist.youtube_url IS 'YouTube video URL for embedding';
COMMENT ON COLUMN music_playlist.is_active IS 'Whether this song is included in rotation';
COMMENT ON COLUMN music_playlist.play_order IS 'Order in playlist (lower plays first)';
