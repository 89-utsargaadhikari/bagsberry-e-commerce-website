'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Music, MoveUp, MoveDown, Play, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

interface Song {
  id: string;
  title: string;
  artist: string;
  youtube_url: string;
  duration_seconds: number;
  is_active: boolean;
  play_order: number;
  is_default?: boolean;
}

export default function AdminMusicPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    youtube_url: '',
    duration_seconds: 180,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('music_playlist')
        .select('*')
        .order('play_order', { ascending: true });

      if (error) throw error;
      setSongs(data || []);
    } catch (error: any) {
      console.error('Error fetching songs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load playlist',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const supabase = createClient();
      
      // Get max play_order
      const maxOrder = songs.length > 0 
        ? Math.max(...songs.map(s => s.play_order))
        : 0;

      const { error } = await supabase
        .from('music_playlist')
        .insert([
          {
            ...formData,
            play_order: maxOrder + 1,
            is_active: true,
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Song added to playlist',
      });

      setFormData({
        title: '',
        artist: '',
        youtube_url: '',
        duration_seconds: 180,
      });
      setDialogOpen(false);
      fetchSongs();
    } catch (error: any) {
      console.error('Error adding song:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add song',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this song from the playlist?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('music_playlist')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Song removed from playlist',
      });
      fetchSongs();
    } catch (error: any) {
      console.error('Error deleting song:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove song',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('music_playlist')
        .update({ is_active: !currentState })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Song ${!currentState ? 'enabled' : 'disabled'}`,
      });
      fetchSongs();
    } catch (error: any) {
      console.error('Error updating song:', error);
      toast({
        title: 'Error',
        description: 'Failed to update song',
        variant: 'destructive',
      });
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = songs.findIndex(s => s.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= songs.length) return;

    try {
      const supabase = createClient();
      const song1 = songs[currentIndex];
      const song2 = songs[newIndex];

      // Swap play_order
      await supabase
        .from('music_playlist')
        .update({ play_order: song2.play_order })
        .eq('id', song1.id);

      await supabase
        .from('music_playlist')
        .update({ play_order: song1.play_order })
        .eq('id', song2.id);

      fetchSongs();
    } catch (error: any) {
      console.error('Error reordering:', error);
      toast({
        title: 'Error',
        description: 'Failed to reorder songs',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefault = async (id: string, currentState: boolean) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('music_playlist')
        .update({ is_default: !currentState })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: !currentState 
          ? 'Set as default starting song' 
          : 'Removed as default song',
      });
      fetchSongs();
    } catch (error: any) {
      console.error('Error setting default:', error);
      toast({
        title: 'Error',
        description: 'Failed to set default song',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Music className="h-8 w-8" />
                Music Playlist
              </h1>
              <p className="mt-2 text-foreground/70">
                Manage background music for your website
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Song
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Song to Playlist</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Song Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Levitating"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="artist">Artist *</Label>
                    <Input
                      id="artist"
                      value={formData.artist}
                      onChange={(e) =>
                        setFormData({ ...formData, artist: e.target.value })
                      }
                      placeholder="Dua Lipa"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube_url">YouTube URL *</Label>
                    <Input
                      id="youtube_url"
                      value={formData.youtube_url}
                      onChange={(e) =>
                        setFormData({ ...formData, youtube_url: e.target.value })
                      }
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />
                    <p className="text-xs text-foreground/60">
                      Paste the full YouTube video URL
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration_seconds}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration_seconds: parseInt(e.target.value),
                        })
                      }
                      placeholder="180"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      Add Song
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="h-20 animate-pulse bg-muted" />
              ))}
            </div>
          ) : songs.length === 0 ? (
            <Card className="p-12 text-center">
              <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No songs in playlist
              </h3>
              <p className="text-foreground/70 mb-4">
                Add your first song to get started
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Song
              </Button>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="divide-y">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    className="p-4 flex items-center gap-4 hover:bg-secondary/5 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReorder(song.id, 'up')}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReorder(song.id, 'down')}
                        disabled={index === songs.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {song.title}
                      </h3>
                      <p className="text-sm text-foreground/60">{song.artist}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground/60">
                        {Math.floor(song.duration_seconds / 60)}:
                        {(song.duration_seconds % 60).toString().padStart(2, '0')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={song.is_active}
                        onCheckedChange={() =>
                          handleToggleActive(song.id, song.is_active)
                        }
                      />
                      <span className="text-xs text-foreground/60 w-16">
                        {song.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    <Button
                      variant={song.is_default ? 'default' : 'outline'}
                      size="sm"
                      className="gap-2"
                      onClick={() => handleSetDefault(song.id, song.is_default || false)}
                      title={song.is_default ? 'Default song (plays first)' : 'Set as default starting song'}
                    >
                      <Star className={`h-4 w-4 ${song.is_default ? 'fill-current' : ''}`} />
                      {song.is_default ? 'Default' : 'Set Default'}
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="gap-2"
                      >
                        <a
                          href={song.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Play className="h-4 w-4" />
                          Preview
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(song.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Instructions */}
          <Card className="mt-8 p-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Music className="h-5 w-5" />
              How to Use
            </h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>• Find songs on YouTube and copy their URLs</li>
              <li>• Add them to your playlist using the "Add Song" button</li>
              <li>• Click the ⭐ "Set Default" button to make a song always play first</li>
              <li>• Reorder songs using the up/down arrows</li>
              <li>• Toggle songs active/inactive without deleting them</li>
              <li>• Music player will appear on your website automatically</li>
            </ul>
          </Card>

          {/* Suggested Songs */}
          <Card className="mt-4 p-6 bg-secondary/5">
            <h3 className="font-semibold text-foreground mb-4">
              🎵 Suggested Girly/Feminine Songs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-foreground/70">
              <div>• "Levitating" - Dua Lipa</div>
              <div>• "Good 4 U" - Olivia Rodrigo</div>
              <div>• "Flowers" - Miley Cyrus</div>
              <div>• "Anti-Hero" - Taylor Swift</div>
              <div>• "Dance The Night" - Dua Lipa</div>
              <div>• "Espresso" - Sabrina Carpenter</div>
              <div>• "Pink Pony Club" - Chappell Roan</div>
              <div>• "Confident" - Demi Lovato</div>
              <div>• "7 Rings" - Ariana Grande</div>
              <div>• "Roar" - Katy Perry</div>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
