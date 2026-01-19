'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

type UiSound =
  | 'tap'
  | 'pop'
  | 'whoop'
  | 'swoosh'
  | 'tick'
  | 'bounce';

type UiSoundContextValue = {
  enabled: boolean;
  toggle: () => void;
  play: (sound: UiSound) => void;
};

const UiSoundContext = createContext<UiSoundContextValue | null>(null);

const STORAGE_KEY = 'ui-sounds-muted';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createNoiseBuffer(ctx: AudioContext, durationSeconds: number) {
  const length = Math.floor(durationSeconds * ctx.sampleRate);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * 0.6;
  }
  return buffer;
}

export function UiSoundProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(true);
  const ctxRef = useRef<AudioContext | null>(null);
  const lastPlayedRef = useRef<Record<string, number>>({});
  const hasUserGestureRef = useRef(false);
  const previousPathRef = useRef<string | null>(null);
  const welcomePlayedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setEnabled(stored !== 'true');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, (!enabled).toString());
  }, [enabled]);

  const ensureContext = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        ctxRef.current = new AudioCtx();
      }
    }
    return ctxRef.current;
  }, []);

  const resumeContext = useCallback(() => {
    const ctx = ensureContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }, [ensureContext]);

  const canPlay = useCallback((sound: UiSound, minIntervalMs: number) => {
    const now = Date.now();
    const last = lastPlayedRef.current[sound] ?? 0;
    if (now - last < minIntervalMs) return false;
    lastPlayedRef.current[sound] = now;
    return true;
  }, []);

  const playTone = useCallback((
    ctx: AudioContext,
    {
      type = 'sine',
      start,
      end,
      duration,
      gain,
      attack = 0.01,
      release = 0.04,
      delay = 0,
    }: {
      type?: OscillatorType;
      start: number;
      end?: number;
      duration: number;
      gain: number;
      attack?: number;
      release?: number;
      delay?: number;
    }
  ) => {
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(start, now);
    if (end) {
      osc.frequency.exponentialRampToValueAtTime(end, now + duration);
    }
    amp.gain.setValueAtTime(0.0001, now);
    amp.gain.exponentialRampToValueAtTime(clamp(gain, 0.0001, 0.2), now + attack);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);
    osc.connect(amp);
    amp.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + release + 0.02);
  }, []);

  const play = useCallback((sound: UiSound) => {
    if (!enabled) return;
    if (!hasUserGestureRef.current) return;
    const ctx = resumeContext();
    if (!ctx) return;

    if (sound === 'tick' && !canPlay(sound, 120)) return;
    if ((sound === 'tap' || sound === 'pop') && !canPlay(sound, 60)) return;
    if ((sound === 'whoop' || sound === 'bounce') && !canPlay(sound, 180)) return;
    if (sound === 'swoosh' && !canPlay(sound, 220)) return;

    switch (sound) {
      case 'tap': {
        playTone(ctx, { type: 'triangle', start: 320, end: 240, duration: 0.05, gain: 0.05 });
        break;
      }
      case 'pop': {
        playTone(ctx, { type: 'sine', start: 420, end: 280, duration: 0.08, gain: 0.06 });
        break;
      }
      case 'tick': {
        playTone(ctx, { type: 'square', start: 1200, end: 900, duration: 0.03, gain: 0.03 });
        break;
      }
      case 'whoop': {
        playTone(ctx, { type: 'sine', start: 220, end: 820, duration: 0.18, gain: 0.07, attack: 0.02, release: 0.06 });
        break;
      }
      case 'bounce': {
        playTone(ctx, { type: 'sine', start: 360, end: 240, duration: 0.07, gain: 0.06 });
        playTone(ctx, {
          type: 'sine',
          start: 300,
          end: 220,
          duration: 0.06,
          gain: 0.04,
          attack: 0.01,
          release: 0.05,
          delay: 0.05,
        });
        break;
      }
      case 'swoosh': {
        const now = ctx.currentTime;
        const duration = 0.32;
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx, duration);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.frequency.exponentialRampToValueAtTime(400, now + duration);
        const amp = ctx.createGain();
        amp.gain.setValueAtTime(0.0001, now);
        amp.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
        amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        noise.connect(filter);
        filter.connect(amp);
        amp.connect(ctx.destination);
        noise.start(now);
        noise.stop(now + duration + 0.02);
        break;
      }
      default:
        break;
    }
  }, [enabled, resumeContext, canPlay, playTone]);

  // Mark user gesture for audio context (needed for UI sounds)
  useEffect(() => {
    const markGesture = () => {
      hasUserGestureRef.current = true;
      resumeContext();
    };
    window.addEventListener('pointerdown', markGesture, { passive: true, once: true });
    window.addEventListener('keydown', markGesture, { passive: true, once: true });
    return () => {
      window.removeEventListener('pointerdown', markGesture);
      window.removeEventListener('keydown', markGesture);
    };
  }, [resumeContext]);

  // Play welcome message on load - ONLY ONCE
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (welcomePlayedRef.current) return;
    if (!('speechSynthesis' in window)) return;
    
    // Mark as played immediately
    welcomePlayedRef.current = true;
    
    const speakWelcome = () => {
      // Cancel any existing speech
      window.speechSynthesis.cancel();
      
      const voices = window.speechSynthesis.getVoices();
      
      // Find the best female voice (prioritize Zira for sexy, classy tone)
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('zira') // Microsoft Zira - sexy, classy
      ) || voices.find(voice => 
        voice.name.toLowerCase().includes('samantha') // Apple Samantha - elegant
      ) || voices.find(voice => 
        voice.name.toLowerCase().includes('hazel') // Hazel - British, sophisticated
      ) || voices.find(voice => 
        voice.name.toLowerCase().includes('female') && voice.lang.startsWith('en')
      ) || voices.find(voice => 
        voice.lang.startsWith('en-') && 
        !voice.name.toLowerCase().includes('male') &&
        !voice.name.toLowerCase().includes('david') &&
        !voice.name.toLowerCase().includes('george') &&
        !voice.name.toLowerCase().includes('james')
      );
      
      // Only speak if we found a female voice
      if (femaleVoice) {
        const utterance = new SpeechSynthesisUtterance('Welcome to Bagsberry');
        utterance.rate = 0.8; // Slower, sultry pace
        utterance.pitch = 0.9; // Lower pitch for sexiness
        utterance.volume = 0.9;
        utterance.voice = femaleVoice;
        
        window.speechSynthesis.speak(utterance);
      }
    };
    
    // Wait for voices to load, then play after a delay
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      setTimeout(speakWelcome, 1000); // Give page time to fully load
    } else {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        setTimeout(speakWelcome, 1000);
      }, { once: true });
    }
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-sound]');
      if (!target) return;
      if (target.getAttribute('aria-disabled') === 'true' || target.hasAttribute('disabled')) return;
      const sound = target.dataset.sound as UiSound | undefined;
      if (sound) {
        play(sound);
      }
    };

    const handlePointerOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-sound-hover]');
      if (!target) return;
      if (target.contains(event.relatedTarget as Node)) return;
      const sound = target.dataset.soundHover as UiSound | undefined;
      if (sound) {
        play(sound);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerover', handlePointerOver);
    };
  }, [play]);

  useEffect(() => {
    if (!pathname) return;
    if (previousPathRef.current && previousPathRef.current !== pathname) {
      play('swoosh');
    }
    previousPathRef.current = pathname;
  }, [pathname, play]);

  const toggle = useCallback(() => {
    setEnabled((current) => !current);
  }, []);

  return (
    <UiSoundContext.Provider value={{ enabled, toggle, play }}>
      {children}
    </UiSoundContext.Provider>
  );
}

export function useUiSounds() {
  const context = useContext(UiSoundContext);
  if (!context) {
    throw new Error('useUiSounds must be used within UiSoundProvider');
  }
  return context;
}
