'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Music, Volume2, VolumeX, X } from 'lucide-react';
import { PinkRibbonBow } from '@/components/pink-ribbon-bow';

interface Song {
  id: string;
  title: string;
  artist: string;
  youtube_url: string;
  is_active: boolean;
  play_order: number;
  is_default?: boolean;
}

export function MusicPlayer() {
  const EXPERIENCE_UNLOCK_KEY = 'bagsberry_experience_unlocked';
  const pathname = usePathname();
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [experienceUnlocked, setExperienceUnlocked] = useState(false);
  const [unlockChecked, setUnlockChecked] = useState(false);
  
  const playerRef = useRef<any>(null);
  const playlistRef = useRef<Song[]>([]);
  const currentIndexRef = useRef(0);
  const failedVideosRef = useRef<Set<string>>(new Set());
  const isTransitioningRef = useRef(false);
  const apiLoadedRef = useRef(false);

  // Check one-time unlock state (persisted for current tab session)
  useEffect(() => {
    if (pathname?.startsWith('/admin')) {
      setUnlockChecked(true);
      return;
    }

    try {
      const unlocked = window.sessionStorage.getItem(EXPERIENCE_UNLOCK_KEY) === 'true';
      setExperienceUnlocked(unlocked);
    } catch {
      setExperienceUnlocked(false);
    } finally {
      setUnlockChecked(true);
    }
  }, [pathname]);

  // Keep refs in sync with state
  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Extract YouTube ID helper
  const extractYouTubeId = useCallback((url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }, []);

  // Play next song with smart skipping
  const playNext = useCallback(() => {
    // Prevent rapid transitions
    if (isTransitioningRef.current) {
      console.log('⏸️ Already transitioning, skipping...');
      return;
    }
    
    isTransitioningRef.current = true;
    
    const currentPlaylist = playlistRef.current;
    const currentIdx = currentIndexRef.current;
    
    if (currentPlaylist.length === 0) {
      console.log('❌ No songs in playlist');
      isTransitioningRef.current = false;
      return;
    }

    // Find next valid song (skip failed ones)
    let attempts = 0;
    let nextIndex = (currentIdx + 1) % currentPlaylist.length;
    
    while (attempts < currentPlaylist.length) {
      const song = currentPlaylist[nextIndex];
      const videoId = extractYouTubeId(song.youtube_url);
      
      if (!videoId) {
        console.log(`⏭️ Invalid URL for "${song.title}", skipping...`);
        failedVideosRef.current.add(song.id);
        nextIndex = (nextIndex + 1) % currentPlaylist.length;
        attempts++;
        continue;
      }
      
      // If we've tried all songs and all failed, reset and try again
      if (failedVideosRef.current.has(song.id) && failedVideosRef.current.size >= currentPlaylist.length) {
        console.log('🔄 All songs failed once, resetting failed list...');
        failedVideosRef.current.clear();
      }
      
      // Skip if failed before (unless we've reset)
      if (failedVideosRef.current.has(song.id)) {
        console.log(`⏭️ Skipping previously failed song: "${song.title}"`);
        nextIndex = (nextIndex + 1) % currentPlaylist.length;
        attempts++;
        continue;
      }
      
      // Found a valid song!
      console.log(`🎵 Next song: "${song.title}" by ${song.artist}`);
      setCurrentIndex(nextIndex);
      
      // Load the video
      if (playerRef.current && playerRef.current.loadVideoById) {
        try {
          playerRef.current.loadVideoById({
            videoId: videoId,
            startSeconds: 0
          });
        } catch (error) {
          console.log('⏭️ Error loading video, trying next...');
          failedVideosRef.current.add(song.id);
          isTransitioningRef.current = false;
          setTimeout(() => playNext(), 500);
          return;
        }
      }
      
      // Reset transition lock after a delay
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 1000);
      
      return;
    }
    
    // If we get here, all songs failed
    console.log('❌ All songs failed to load');
    isTransitioningRef.current = false;
  }, [extractYouTubeId]);

  // Toggle mute with state validation
  const toggleMute = useCallback(() => {
    if (!playerRef.current || !playerReady) return;
    
    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch (error) {
      // Mute toggle failed silently
    }
  }, [isMuted, playerReady]);

  // Fetch playlist from database
  useEffect(() => {
    // Don't load playlist on admin pages
    if (pathname?.startsWith('/admin')) {
      return;
    }

    const fetchPlaylist = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('music_playlist')
          .select('*')
          .eq('is_active', true)
          .order('play_order', { ascending: true });

        if (error) {
          console.log('Music player error:', error.message);
          setIsVisible(false);
          return;
        }
        
        if (data && data.length > 0) {
          console.log('✅ Music playlist loaded:', data.length, 'songs');
          setPlaylist(data);
          
          // Check for default song first, otherwise play random
          const defaultSongIndex = data.findIndex(song => song.is_default === true);
          
          if (defaultSongIndex !== -1) {
            setCurrentIndex(defaultSongIndex);
            console.log('🎵 Starting with default song:', data[defaultSongIndex].title);
          } else {
            const randomIndex = Math.floor(Math.random() * data.length);
            setCurrentIndex(randomIndex);
            console.log('🎲 Random start song:', data[randomIndex].title);
          }
        } else {
          console.log('❌ No songs found in playlist');
          setIsVisible(false);
        }
      } catch (error: any) {
        console.error('Music player fetch error:', error);
        setIsVisible(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, [pathname]);

  // Initialize YouTube API and Player
  useEffect(() => {
    // Don't initialize player on admin pages
    if (pathname?.startsWith('/admin')) {
      return;
    }

    // Start player only after the one-time unlock action
    if (!experienceUnlocked) {
      return;
    }

    if (playlist.length === 0 || apiLoadedRef.current) return;
    
    apiLoadedRef.current = true;

    const initPlayer = () => {
      const videoId = extractYouTubeId(playlist[currentIndex].youtube_url);
      if (!videoId) {
        console.log('⏭️ Skipping song with invalid URL');
        failedVideosRef.current.add(playlist[currentIndex].id);
        playNext();
        return;
      }

      console.log('🎵 Loading:', playlist[currentIndex].title);

      try {
        // Destroy existing player if any
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
          playerRef.current.destroy();
        }

        playerRef.current = new (window as any).YT.Player('yt-player', {
          height: '0',
          width: '0',
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            loop: 0
          },
          events: {
            onReady: (event: any) => {
              console.log('✅ Player ready!');
              setPlayerReady(true);
              
              try {
                event.target.setVolume(40);
                event.target.playVideo();
                setIsPlaying(true);
              } catch (error) {
                // Autoplay might be blocked, user interaction needed
              }
            },
            onStateChange: (event: any) => {
              const state = event.data;
              const YT = (window as any).YT;
              
              if (state === YT.PlayerState.ENDED) {
                console.log('🏁 Song ended');
                playNext();
              } else if (state === YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (state === YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (state === YT.PlayerState.BUFFERING) {
                console.log('⏳ Buffering...');
              }
            },
            onError: (event: any) => {
              const errorCode = event.data;
              
              // Mark current song as failed
              const currentSong = playlistRef.current[currentIndexRef.current];
              if (currentSong) {
                failedVideosRef.current.add(currentSong.id);
                console.log(`⏭️ Skipping "${currentSong.title}" (video unavailable) - moving to next song...`);
              }
              
              playNext();
            },
          },
        });
      } catch (error) {
        console.log('⏭️ Unable to initialize player, trying next song...');
        const currentSong = playlist[currentIndex];
        if (currentSong) {
          failedVideosRef.current.add(currentSong.id);
        }
        playNext();
      }
    };

    // Load YouTube API
    const loadAPI = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        console.log('✅ YouTube API already loaded');
        initPlayer();
        return;
      }

      console.log('📡 Loading YouTube API...');
      
      // Check if script already exists
      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (existingScript) {
        console.log('📡 YouTube API script already in DOM, waiting for load...');
        (window as any).onYouTubeIframeAPIReady = initPlayer;
        return;
      }

      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      (window as any).onYouTubeIframeAPIReady = initPlayer;
    };

    loadAPI();

    // Cleanup on unmount
    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (error) {
          // Cleanup failed silently
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist.length, experienceUnlocked, pathname]);

  // Don't render music player on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  if (!unlockChecked) {
    return null;
  }

  const handleUnlockExperience = () => {
    try {
      window.sessionStorage.setItem(EXPERIENCE_UNLOCK_KEY, 'true');
    } catch {
      // Local storage failed silently
    }

    setExperienceUnlocked(true);
  };

  // One-time gate: shown only until user unlocks
  if (unlockChecked && !experienceUnlocked) {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-gradient-to-br from-pink-100/85 via-pink-100/80 to-pink-200/85 backdrop-blur-sm px-4">
        <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border-2 border-pink-300 bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 p-8 text-center shadow-2xl animate-[slide-up-bounce_0.7s_cubic-bezier(0.34,1.56,0.64,1)]">
          <div className="pointer-events-none absolute -top-8 -left-8 h-24 w-24 rounded-full bg-pink-300/40 blur-xl pulse-idle" />
          <div className="pointer-events-none absolute -bottom-10 -right-6 h-28 w-28 rounded-full bg-pink-300/40 blur-xl float-idle" />
          <PinkRibbonBow className="pointer-events-none absolute top-4 right-6 h-10 w-10 ribbon-bow-float" />
          <PinkRibbonBow className="pointer-events-none absolute bottom-4 left-7 h-9 w-9 ribbon-bow-float" style={{ animationDelay: '0.6s' }} />
          <PinkRibbonBow className="pointer-events-none absolute top-14 left-6 h-8 w-8 ribbon-bow-float" style={{ animationDelay: '0.95s' }} />
          <PinkRibbonBow className="pointer-events-none absolute bottom-10 right-16 h-7 w-7 ribbon-bow-float" style={{ animationDelay: '1.2s' }} />

          <div className="mb-2 text-3xl wiggle-idle">✨</div>
          <p
            className="text-5xl leading-tight text-primary"
            style={{ fontFamily: "var(--font-greatvibes), 'Great Vibes', cursive" }}
          >
            Unlock the Bagsberry experience
          </p>
          <p className="mt-2 text-sm text-foreground/70">Tap once to begin.</p>

          <button
            type="button"
            onClick={handleUnlockExperience}
            className="btn-squishy mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-10 py-3.5 text-lg font-semibold text-primary-foreground shadow-lg hover:bg-primary/90"
          >
            <span className="wiggle-idle">🔓</span>
            Unlock
          </button>
        </div>
      </div>
    );
  }

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="fixed top-20 right-6 z-[60]">
        <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-full p-3 shadow-xl animate-pulse">
          <Music className="h-5 w-5 text-white" />
        </div>
      </div>
    );
  }

  if (!isVisible || playlist.length === 0) {
    return null;
  }

  const currentSong = playlist[currentIndex];

  return (
    <div className="fixed top-20 right-6 z-[60]">
      {/* Hidden YouTube player */}
      <div id="yt-player" style={{ display: 'none' }} />

      {/* Pink Music Widget */}
      <div className="relative group">
        <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-full p-3 shadow-xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-110 cursor-pointer">
          
          {/* Music Icon */}
          <Music className={`h-5 w-5 text-white ${isPlaying ? 'animate-pulse' : ''}`} />

          {/* Mute Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="h-3 w-3 text-pink-600" />
            ) : (
              <Volume2 className="h-3 w-3 text-pink-600" />
            )}
          </button>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            className="absolute -top-1 -left-1 bg-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            title="Hide music"
          >
            <X className="h-3 w-3 text-pink-600" />
          </button>
        </div>

        {/* Song Info Tooltip */}
        <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-white rounded-lg shadow-xl p-2.5 text-right whitespace-nowrap border-2 border-pink-300">
            <p className="text-xs font-semibold text-pink-600">
              🎵 {currentSong.title}
            </p>
            <p className="text-xs text-pink-400">{currentSong.artist}</p>
            <p className="text-xs text-pink-400 mt-0.5">
              Song {currentIndex + 1} of {playlist.length}
            </p>
          </div>
          <div className="absolute bottom-full right-4 mb-[-1px]">
            <div className="border-4 border-transparent border-b-pink-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
