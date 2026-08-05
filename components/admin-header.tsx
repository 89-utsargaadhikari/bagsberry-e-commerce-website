'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PinkRibbonBow } from '@/components/pink-ribbon-bow';

export function AdminHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="relative text-2xl font-bold text-primary">
              Bagsberry Admin
              <PinkRibbonBow className="pointer-events-none absolute -right-9 top-1/2 h-8 w-8 -translate-y-1/2 ribbon-bow-float" />
            </div>
          </Link>

          <nav className="hidden gap-6 md:flex">
            <Link href="/admin" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/products" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="/admin/categories" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/admin/brands" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Brands
            </Link>
            <Link href="/admin/orders" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Orders
            </Link>
            <Link href="/admin/music" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              🎵 Music
            </Link>
          </nav>

          <Button variant="ghost" size="sm" className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
