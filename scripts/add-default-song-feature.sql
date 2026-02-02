-- Add is_default column to music_playlist table
-- This allows setting one song to always play first

ALTER TABLE music_playlist 
ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT FALSE;

-- Add comment
COMMENT ON COLUMN music_playlist.is_default IS 'If true, this song will always play first (only one song should be default)';

-- Create index for quick lookup
CREATE INDEX IF NOT EXISTS idx_music_playlist_default ON music_playlist(is_default) WHERE is_default = true;

-- Function to ensure only one song is default at a time
CREATE OR REPLACE FUNCTION ensure_single_default_song()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    -- Unset all other default songs
    UPDATE music_playlist 
    SET is_default = false 
    WHERE id != NEW.id AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_ensure_single_default_song ON music_playlist;
CREATE TRIGGER trigger_ensure_single_default_song
  BEFORE INSERT OR UPDATE ON music_playlist
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_song();
