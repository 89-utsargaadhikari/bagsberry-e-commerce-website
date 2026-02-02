'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { useUiSounds } from '@/components/ui-sound-provider';
import { useCart } from '@/lib/cart-context';
import { Zap } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  sale_price?: number;
  category: string;
  image_url: string;
  description: string;
  stock_quantity: number;
  is_featured: boolean;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { play } = useUiSounds();
  const { addItem } = useCart();
  const router = useRouter();
  const loadedOnceRef = useRef(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true)
          .limit(6);

        if (error) {
          console.error('Supabase error:', error);
          // Fallback: try without filter
          const { data: allData } = await supabase
            .from('products')
            .select('*')
            .limit(6);
          setProducts(allData || []);
        } else {
          console.log('Fetched products:', data);
          setProducts(data || []);
        }
      } catch (err) {
        console.error('Exception:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!loading && !loadedOnceRef.current) {
      loadedOnceRef.current = true;
      if (products.length > 0) {
        play('pop');
      }
    }
  }, [loading, products.length, play]);

  const handleBuyNow = (product: Product) => {
    if (product.stock_quantity === 0) {
      return; // Don't add out of stock items
    }
    
    const effectivePrice = product.sale_price && product.sale_price < product.price 
      ? product.sale_price 
      : product.price;
    
    addItem({
      productId: product.id,
      name: product.name,
      price: effectivePrice,
      quantity: 1,
      image_url: product.image_url,
    });
    router.push('/checkout');
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="space-y-8">
                <div>
                  <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                    Luxury Bags for the Modern Woman
                  </h1>
                  <p className="mt-6 text-pretty text-lg leading-8 text-foreground/80">
                    Discover Bagsberry's curated collection of premium, handcrafted bags and accessories. Each piece tells a story of elegance and sophistication.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button asChild size="lg" className="btn-squishy bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-2xl" data-sound="pop">
                    <Link href="/products">🛍️ Shop Collection</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="btn-squishy" data-sound="tap">
                    ✨ Learn More
                  </Button>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl float-idle">
                <img
                  src="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1200&q=80"
                  alt="Luxury Bags Collection"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full rotate-idle">
                    <span className="text-2xl">✨ Premium Collection ✨</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Featured Collections
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-foreground/70">
                  Explore our latest curated selections of premium bags and accessories
                </p>
              </div>

              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="overflow-hidden animate-pulse">
                      <div className="aspect-square bg-muted" />
                      <div className="space-y-3 p-4">
                        <div className="h-4 bg-muted rounded" />
                        <div className="h-4 w-3/4 bg-muted rounded" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      data-sound-hover="tick"
                      className="product-card group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/30 rounded-3xl bg-card"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Link href={`/products/${product.id}`} data-sound="tap">
                        <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 relative cursor-pointer">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
                            ✨ NEW
                          </div>
                        </div>
                      </Link>
                      <div className="space-y-3 p-6 relative">
                        <Link href={`/products/${product.id}`} data-sound="tap">
                          <h3 className="font-semibold text-foreground line-clamp-2 text-xl group-hover:text-primary transition-colors cursor-pointer">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-foreground/60 uppercase tracking-wide">
                          {product.category}
                        </p>
                        <div className="flex items-center gap-2">
                          {product.sale_price && product.sale_price < product.price ? (
                            <>
                              <p className="text-2xl font-bold text-primary">
                                NPR {product.sale_price.toFixed(2)}
                              </p>
                              <p className="text-lg text-foreground/50 line-through">
                                NPR {product.price.toFixed(2)}
                              </p>
                            </>
                          ) : (
                            <p className="text-2xl font-bold text-primary">
                              NPR {product.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                        {product.stock_quantity > 0 ? (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBuyNow(product);
                            }}
                            className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                            data-sound="bounce"
                          >
                            <Zap className="h-4 w-4" />
                            Buy Now
                          </Button>
                        ) : (
                          <Button
                            disabled
                            className="w-full gap-2"
                            variant="secondary"
                          >
                            Out of Stock
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && products.length > 0 && (
                <div className="text-center pt-8">
                  <Button asChild variant="outline" size="lg">
                    <Link href="/products">View All Products</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24 bg-secondary/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Premium Quality',
                  description: 'Handcrafted with the finest materials and attention to detail',
                  emoji: '💎',
                },
                {
                  title: 'Sustainable',
                  description: 'Ethically sourced and environmentally conscious production',
                  emoji: '🌿',
                },
                {
                  title: 'Lifetime Support',
                  description: 'Expert care and support for all your Bagsberry purchases',
                  emoji: '💝',
                },
              ].map((feature, index) => (
                <div key={feature.title} className="space-y-4 text-center product-card" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="text-6xl wiggle-idle" style={{ animationDelay: `${index * 0.3}s` }}>
                    {feature.emoji}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-primary/5 px-6 py-16 text-center sm:px-12 sm:py-20 space-y-6">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Join the Bagsberry Community
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-foreground/70">
                Subscribe to our newsletter for exclusive offers, early access to new collections, and style tips from our experts.
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/subscribe">Subscribe Now</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-secondary/5">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">About</h3>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                  <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
                  <li><Link href="/press" className="hover:text-primary">Press</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Support</h3>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                  <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
                  <li><Link href="/returns" className="hover:text-primary">Returns</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Legal</h3>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li><Link href="/privacy" className="hover:text-primary">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
                  <li><Link href="/cookies" className="hover:text-primary">Cookies</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Follow</h3>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li><a href="#" className="hover:text-primary">Instagram</a></li>
                  <li><a href="#" className="hover:text-primary">TikTok</a></li>
                  <li><a href="#" className="hover:text-primary">Pinterest</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t pt-8 text-center text-sm text-foreground/60">
              <p>&copy; 2025 Bagsberry. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
