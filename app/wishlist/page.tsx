'use client';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';

const mockWishlistItems = [
  {
    id: '1',
    name: 'Rose Velvet Evening Bag',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80',
    category: 'Evening Bag',
  },
  {
    id: '2',
    name: 'Blush Pink Leather Tote',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80',
    category: 'Tote',
  },
];

export default function WishlistPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="border-b py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-4">
              💖 Your Wishlist
            </h1>
            <p className="text-foreground/70 text-lg">
              {mockWishlistItems.length} items you're dreaming about
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {mockWishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
              <div className="text-8xl wiggle-idle">💔</div>
              <h2 className="text-3xl font-bold text-foreground">
                Your wishlist is empty
              </h2>
              <p className="text-foreground/70 max-w-md">
                Start adding bags you love and we'll keep them safe here for you!
              </p>
              <Button asChild size="lg" className="btn-squishy" data-sound="whoop">
                <Link href="/products">🛍️ Discover Bags</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {mockWishlistItems.map((item, index) => (
                <div
                  key={item.id}
                  className="product-card group overflow-hidden cursor-pointer border-2 hover:border-primary/30 rounded-3xl bg-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <button
                      data-sound="pop"
                      className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all duration-300 btn-squishy"
                    >
                      <Heart className="h-6 w-6 text-primary fill-primary" />
                    </button>
                  </div>
                  <div className="space-y-4 p-6">
                    <div>
                      <h3 className="font-semibold text-foreground text-xl mb-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-foreground/60 uppercase tracking-wide">
                        {item.category}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-primary">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        data-sound="whoop"
                        className="btn-squishy bg-primary hover:bg-primary/90"
                        size="sm"
                      >
                        🛒 Add to Cart
                      </Button>
                      <Button
                        data-sound="tap"
                        variant="outline"
                        className="btn-squishy"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
