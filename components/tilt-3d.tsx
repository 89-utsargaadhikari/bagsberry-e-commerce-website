'use client';

import { useMemo, useState } from 'react';
import type { CSSProperties, PointerEvent, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  glareClassName?: string;
  maxTilt?: number;
  disabled?: boolean;
}

export function Tilt3D({
  children,
  className,
  glareClassName,
  maxTilt = 8,
  disabled = false,
}: Tilt3DProps) {
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg) translateZ(0)');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || reducedMotion) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xPercent = x / rect.width;
    const yPercent = y / rect.height;

    const rotateY = (xPercent - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - yPercent) * maxTilt * 2;

    setTransform(`rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(0)`);
    setGlare({
      x: xPercent * 100,
      y: yPercent * 100,
      opacity: 0.35,
    });
  };

  const handlePointerLeave = () => {
    setTransform('rotateX(0deg) rotateY(0deg) translateZ(0)');
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const glareStyle: CSSProperties = {
    opacity: glare.opacity,
    background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.45), transparent 42%)`,
  };

  return (
    <div className={cn('scene-3d', className)}>
      <div
        className="tilt-3d relative preserve-3d"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ transform }}
      >
        <div
          className={cn('pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300', glareClassName)}
          style={glareStyle}
        />
        {children}
      </div>
    </div>
  );
}
