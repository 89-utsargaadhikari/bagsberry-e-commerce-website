'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Volume2, VolumeX, Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUiSounds } from '@/components/ui-sound-provider';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { PinkRibbonBow } from '@/components/pink-ribbon-bow';

export function Header() {
  const { enabled, toggle } = useUiSounds();
  const router = useRouter();
  const { items } = useCart();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    // Listen for auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between gap-2 sm:h-20">
          {/* Logo: left on mobile (avoids icon overlap), centered on desktop */}
          <Link
            href="/"
            className="relative z-10 min-w-0 shrink lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
          >
            <div className="relative inline-flex max-w-full items-center">
              <div className="logo-script text-[1.65rem] sm:text-[clamp(2rem,7vw,3.1rem)]">
                Bagsberry
              </div>
              <PinkRibbonBow
                className="pointer-events-none absolute -right-12 top-1/2 hidden h-11 w-11 -translate-y-1/2 ribbon-bow-float lg:block"
              />
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 pl-2 lg:flex">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Icons */}
          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label={enabled ? 'Mute UI sounds' : 'Unmute UI sounds'}
              data-sound="pop"
              className="btn-squishy h-9 w-9 sm:h-10 sm:w-10"
            >
              {enabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" asChild data-sound="tap" className="btn-squishy h-9 w-9 sm:h-10 sm:w-10">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            {user ? (
              <>
                <Button variant="ghost" size="icon" asChild data-sound="tap" className="btn-squishy h-9 w-9 sm:h-10 sm:w-10">
                  <Link href="/orders">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  data-sound="tap" 
                  className="btn-squishy h-9 w-9 sm:h-10 sm:w-10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
            <Button variant="ghost" size="icon" asChild data-sound="tap" className="btn-squishy h-9 w-9 sm:h-10 sm:w-10">
              <Link href="/login">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            )}
            <Button variant="ghost" size="icon" asChild data-sound="swoosh" className="btn-squishy relative h-9 w-9 sm:h-10 sm:w-10">
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
