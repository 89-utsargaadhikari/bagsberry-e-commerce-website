'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Volume2, VolumeX, Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUiSounds } from '@/components/ui-sound-provider';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';

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
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="logo-script text-primary">Bagsberry</div>
          </Link>

          {/* Navigation */}
          <nav className="hidden gap-8 md:flex">
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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label={enabled ? 'Mute UI sounds' : 'Unmute UI sounds'}
              data-sound="pop"
              className="btn-squishy"
            >
              {enabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" asChild data-sound="tap" className="btn-squishy">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            {user ? (
              <>
                <Button variant="ghost" size="icon" asChild data-sound="tap" className="btn-squishy">
                  <Link href="/orders">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  data-sound="tap" 
                  className="btn-squishy"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
            <Button variant="ghost" size="icon" asChild data-sound="tap" className="btn-squishy">
              <Link href="/login">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            )}
            <Button variant="ghost" size="icon" asChild data-sound="swoosh" className="btn-squishy relative">
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
