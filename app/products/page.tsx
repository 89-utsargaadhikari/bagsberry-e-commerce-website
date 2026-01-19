'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { useUiSounds } from '@/components/ui-sound-provider';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  description: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceSort, setPriceSort] = useState('relevant');
  const { play } = useUiSounds();
  const loadedOnceRef = useRef(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) {
          console.log('[v0] Error fetching products:', error.message);
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        console.log('[v0] Exception fetching products:', err);
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

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Sort
    if (priceSort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceSort]);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="border-b py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Our Collection
            </h1>
            <p className="mt-2 text-foreground/70">
              Explore our premium selection of luxury bags and accessories
            </p>
          </div>
        </section>

        {/* Filters & Products */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar Filters */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Search
                </h3>
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Category
                </h3>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Sort By
                </h3>
                <Select value={priceSort} onValueChange={setPriceSort}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevant">Most Relevant</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(9)].map((_, i) => (
                    <Card key={i} className="overflow-hidden animate-pulse">
                      <div className="aspect-square bg-muted" />
                      <div className="space-y-3 p-4">
                        <div className="h-4 bg-muted rounded" />
                        <div className="h-4 w-3/4 bg-muted rounded" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                  <div className="text-6xl">🛍️</div>
                  <h2 className="text-2xl font-semibold text-foreground">
                    No products found
                  </h2>
                  <p className="text-foreground/70">
                    Try adjusting your filters or search terms
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setPriceSort('relevant');
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-6 text-sm text-foreground/70">
                    Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                  </div>
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                      <Link key={product.id} href={`/products/${product.id}`} data-sound="tap">
                        <Card
                          data-sound-hover="tick"
                          className="group overflow-hidden hover:shadow-2xl transition-all duration-300 h-full cursor-pointer hover:-translate-y-2 border-2 hover:border-primary/30"
                        >
                          <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80';
                              }}
                            />
                          </div>
                          <div className="space-y-3 p-6">
                            <h3 className="font-semibold text-foreground line-clamp-2 text-xl">
                              {product.name}
                            </h3>
                            <p className="text-sm text-foreground/60 uppercase tracking-wide">{product.category}</p>
                            <p className="text-2xl font-bold text-primary">
                              ${product.price.toFixed(2)}
                            </p>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
