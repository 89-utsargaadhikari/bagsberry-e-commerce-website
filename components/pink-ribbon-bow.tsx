'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PinkRibbonBowProps {
  className?: string;
  style?: CSSProperties;
}

export function PinkRibbonBow({ className, style }: PinkRibbonBowProps) {
  return (
    <span className={cn('relative block', className)} style={style} aria-hidden>
      <Image
        src="/pink-bow-clean.png"
        alt=""
        fill
        sizes="(max-width: 768px) 48px, 64px"
        className="object-contain"
        priority
      />
    </span>
  );
}
