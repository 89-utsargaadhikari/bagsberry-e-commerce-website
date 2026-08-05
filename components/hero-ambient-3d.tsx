'use client';

import { cn } from '@/lib/utils';

interface HeroAmbient3DProps {
  className?: string;
}

export function HeroAmbient3D({ className }: HeroAmbient3DProps) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      <div className="absolute -top-20 -left-14 h-52 w-52 rounded-full bg-pink-400/25 blur-3xl depth-breathe" />
      <div className="absolute top-10 right-4 h-56 w-56 rounded-full bg-pink-400/25 blur-3xl particle-drift" />
      <div className="absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-pink-300/25 blur-3xl particle-drift" style={{ animationDelay: '1.2s' }} />

      <div className="absolute left-1/4 top-1/3 h-40 w-40 rounded-full border border-pink-300/40 orbit-3d" />
      <div className="absolute right-1/4 bottom-1/4 h-28 w-28 rounded-full border border-pink-300/45 orbit-3d" style={{ animationDuration: '10s' }} />
    </div>
  );
}
