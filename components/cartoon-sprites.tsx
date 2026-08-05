'use client';

import { PinkRibbonBow } from '@/components/pink-ribbon-bow';

interface CartoonSpritesProps {
  variant?: 'hero' | 'products' | 'cta';
}

function GirlSticker({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={`sticker-shadow ${className}`} aria-hidden>
      <circle cx="60" cy="40" r="20" fill="#ffd7bf" />
      <path d="M42 38 Q60 10 78 38" fill="#5f3952" />
      <path d="M28 98 Q60 66 92 98 Z" fill="#ff86c0" />
      <circle cx="52" cy="40" r="3.5" fill="#2f1f2a" />
      <circle cx="68" cy="40" r="3.5" fill="#2f1f2a" />
      <path d="M53 50 Q60 56 67 50" fill="none" stroke="#2f1f2a" strokeWidth="3" strokeLinecap="round" />
      <rect x="34" y="58" width="52" height="10" rx="5" fill="#ffd1ea" />
      <circle cx="46" cy="22" r="6" fill="#ff6fb0" />
      <circle cx="74" cy="22" r="6" fill="#ff6fb0" />
    </svg>
  );
}

function HeartSticker({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={`sticker-shadow ${className}`} aria-hidden>
      <path d="M60 100 C20 72 10 44 28 28 C40 18 54 22 60 34 C66 22 80 18 92 28 C110 44 100 72 60 100 Z" fill="#ff7fbd" />
      <circle cx="44" cy="44" r="6" fill="#ffc7e6" />
      <circle cx="70" cy="56" r="4" fill="#ffd9ef" />
    </svg>
  );
}

export function CartoonSprites({ variant = 'hero' }: CartoonSpritesProps) {
  if (variant === 'products') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-8 right-4 h-10 w-10 sticker-hop opacity-75 sm:top-10 sm:right-8 sm:h-14 sm:w-14" style={{ animationDelay: '0.5s' }}>
          <HeartSticker className="h-full w-full" />
        </div>
        <div className="absolute right-16 top-14 h-10 w-10 ribbon-bow-float opacity-75 sm:right-24 sm:top-20 sm:h-16 sm:w-16" style={{ animationDelay: '0.35s' }}>
          <PinkRibbonBow className="h-full w-full" />
        </div>
        <div className="absolute left-1/3 top-16 hidden h-14 w-14 ribbon-bow-float sm:block" style={{ animationDelay: '0.6s' }}>
          <PinkRibbonBow className="h-full w-full" />
        </div>
        <div className="absolute right-8 bottom-12 hidden h-12 w-12 ribbon-bow-float sm:block" style={{ animationDelay: '0.95s' }}>
          <PinkRibbonBow className="h-full w-full" />
        </div>
        <div className="absolute left-10 bottom-20 hidden h-12 w-12 ribbon-bow-float sm:block" style={{ animationDelay: '1.15s' }}>
          <PinkRibbonBow className="h-full w-full" />
        </div>
        <div className="absolute bottom-6 left-4 text-xs cartoon-badge cartoon-sway sm:bottom-10 sm:left-10 sm:text-sm">meow magic</div>
      </div>
    );
  }

  if (variant === 'cta') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-8 left-4 h-12 w-12 sticker-dance opacity-70 sm:-top-12 sm:left-10 sm:h-20 sm:w-20" style={{ animationDelay: '0.2s' }}>
          <GirlSticker className="h-full w-full" />
        </div>
        <div className="absolute top-3 right-4 h-10 w-10 sticker-hop opacity-70 sm:top-4 sm:right-12 sm:h-14 sm:w-14" style={{ animationDelay: '0.7s' }}>
          <HeartSticker className="h-full w-full" />
        </div>
        <div className="absolute right-10 top-16 h-10 w-10 ribbon-bow-float opacity-70 sm:left-1/2 sm:top-10 sm:h-16 sm:w-16" style={{ animationDelay: '0.45s' }}>
          <PinkRibbonBow className="h-full w-full" />
        </div>
        <div className="absolute left-16 top-1/2 hidden h-14 w-14 ribbon-bow-float sm:block" style={{ animationDelay: '0.85s' }}>
          <PinkRibbonBow className="h-full w-full" />
        </div>
        <div className="absolute right-24 top-1/3 hidden h-12 w-12 ribbon-bow-float sm:block" style={{ animationDelay: '1.05s' }}>
          <PinkRibbonBow className="h-full w-full" />
        </div>
        <div className="absolute bottom-10 left-1/3 hidden h-12 w-12 ribbon-bow-float sm:block" style={{ animationDelay: '1.25s' }}>
          <PinkRibbonBow className="h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute right-2 top-8 h-12 w-12 sticker-hop opacity-75 sm:right-4 sm:top-10 sm:h-22 sm:w-22" style={{ animationDelay: '0.4s' }}>
        <GirlSticker className="h-full w-full" />
      </div>
      <div className="absolute left-1/2 top-2 h-10 w-10 -translate-x-1/2 ribbon-bow-float opacity-75 sm:top-4 sm:h-16 sm:w-16" style={{ animationDelay: '0.25s' }}>
        <PinkRibbonBow className="h-full w-full" />
      </div>
      <div className="absolute left-10 top-20 hidden h-14 w-14 ribbon-bow-float sm:block" style={{ animationDelay: '0.55s' }}>
        <PinkRibbonBow className="h-full w-full" />
      </div>
      <div className="absolute right-28 top-4 hidden h-12 w-12 ribbon-bow-float sm:block" style={{ animationDelay: '0.75s' }}>
        <PinkRibbonBow className="h-full w-full" />
      </div>
      <div className="absolute left-3 bottom-6 h-10 w-10 sticker-dance opacity-75 sm:left-20 sm:bottom-10 sm:h-14 sm:w-14" style={{ animationDelay: '0.9s' }}>
        <HeartSticker className="h-full w-full" />
      </div>
      <div className="absolute right-3 bottom-8 h-10 w-10 ribbon-bow-float opacity-75 sm:right-10 sm:bottom-20 sm:h-14 sm:w-14" style={{ animationDelay: '0.8s' }}>
        <PinkRibbonBow className="h-full w-full" />
      </div>
      <div className="absolute left-1/3 bottom-6 hidden h-12 w-12 ribbon-bow-float sm:block" style={{ animationDelay: '1.05s' }}>
        <PinkRibbonBow className="h-full w-full" />
      </div>
      <div className="absolute right-1/3 bottom-4 hidden h-10 w-10 ribbon-bow-float sm:block" style={{ animationDelay: '1.25s' }}>
        <PinkRibbonBow className="h-full w-full" />
      </div>
      <div className="absolute right-3 bottom-3 text-xs cartoon-badge cartoon-float sm:right-20 sm:bottom-8 sm:text-sm" style={{ animationDelay: '0.9s' }}>cute mode</div>
    </div>
  );
}







