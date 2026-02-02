'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ShoppingBag, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUiSounds } from '@/components/ui-sound-provider';
import { useCart } from '@/lib/cart-context';

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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { play } = useUiSounds();
  const { addItem } = useCart();
  const loadedOnceRef = useRef(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) {
          console.log('[v0] Error fetching product:', error.message);
        } else {
          setProduct(data);
        }
      } catch (err) {
        console.log('[v0] Exception fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (!loading && !loadedOnceRef.current) {
      loadedOnceRef.current = true;
      if (product) {
        play('pop');
      }
    }
  }, [loading, product, play]);

  const handleAddToCart = () => {
    if (product) {
      if (product.stock_quantity === 0) {
        toast({
          title: 'Out of Stock',
          description: 'This product is currently unavailable',
          variant: 'destructive',
        });
        return;
      }
      
      if (quantity > product.stock_quantity) {
        toast({
          title: 'Insufficient Stock',
          description: `Only ${product.stock_quantity} items available`,
          variant: 'destructive',
        });
        return;
      }
      
      const effectivePrice = product.sale_price && product.sale_price < product.price 
        ? product.sale_price 
        : product.price;
      
      addItem({
        productId: product.id,
        name: product.name,
        price: effectivePrice,
        quantity: quantity,
        image_url: product.image_url,
      });
      toast({
        title: 'Added to cart',
        description: `${product.name} x ${quantity} added to your cart`,
      });
      setQuantity(1);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      if (product.stock_quantity === 0) {
        toast({
          title: 'Out of Stock',
          description: 'This product is currently unavailable',
          variant: 'destructive',
        });
        return;
      }
      
      if (quantity > product.stock_quantity) {
        toast({
          title: 'Insufficient Stock',
          description: `Only ${product.stock_quantity} items available`,
          variant: 'destructive',
        });
        return;
      }
      
      const effectivePrice = product.sale_price && product.sale_price < product.price 
        ? product.sale_price 
        : product.price;
      
      addItem({
        productId: product.id,
        name: product.name,
        price: effectivePrice,
        quantity: quantity,
        image_url: product.image_url,
      });
      router.push('/checkout');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 w-24 bg-muted rounded" />
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="aspect-square bg-muted rounded-lg" />
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded w-3/4" />
                  <div className="h-6 bg-muted rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 py-16">
              <h1 className="text-2xl font-bold text-foreground">
                Product not found
              </h1>
              <p className="text-foreground/70">
                The product you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link href="/products">Back to Products</Link>
              </Button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary hover:underline"
            data-sound="tap"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>

        {/* Product Details */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1200&q=80';
                }}
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {product.category}
                </div>
                <h1 className="text-4xl font-bold text-foreground">
                  {product.name}
                </h1>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {product.sale_price && product.sale_price < product.price ? (
                    <>
                      <p className="text-4xl font-bold text-primary">
                        NPR {product.sale_price.toFixed(2)}
                      </p>
                      <p className="text-2xl text-foreground/50 line-through">
                        NPR {product.price.toFixed(2)}
                      </p>
                      <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                        Save {Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                      </span>
                    </>
                  ) : (
                    <p className="text-4xl font-bold text-primary">
                      NPR {product.price.toFixed(2)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-foreground/70">
                    Premium quality, handcrafted with excellence
                  </p>
                  {product.stock_quantity > 0 && product.stock_quantity < 10 && (
                    <span className="text-orange-600 text-sm font-semibold">
                      • Only {product.stock_quantity} left!
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <Card className="p-6 bg-secondary/5 border-0">
                <h3 className="font-semibold text-foreground mb-3">Description</h3>
                <p className="text-foreground/70 leading-relaxed">
                  {product.description}
                </p>
              </Card>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Features</h3>
                <ul className="space-y-2 text-foreground/70">
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Premium leather crafted to perfection</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Spacious interior compartments</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Secure closure mechanisms</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Lifetime care and support</span>
                  </li>
                </ul>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                {product.stock_quantity > 0 ? (
                  <>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-foreground">Quantity</span>
                      <div className="flex items-center gap-2 border rounded-lg bg-background">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          data-sound="tap"
                          className="px-4 py-2 text-foreground hover:bg-secondary/10"
                          disabled={quantity <= 1}
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                          data-sound="tap"
                          className="px-4 py-2 text-foreground hover:bg-secondary/10"
                          disabled={quantity >= product.stock_quantity}
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm text-foreground/60">
                        ({product.stock_quantity} available)
                      </span>
                    </div>

                    <Button
                      onClick={handleBuyNow}
                      size="lg"
                      className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                      data-sound="bounce"
                    >
                      <Zap className="h-5 w-5" />
                      Buy Now
                    </Button>

                    <Button
                      onClick={handleAddToCart}
                      variant="outline"
                      size="lg"
                      className="w-full gap-2 bg-transparent"
                      data-sound="tap"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Add to Cart
                    </Button>
                  </>
                ) : (
                  <div className="bg-destructive/10 border-2 border-destructive/20 rounded-lg p-6 text-center">
                    <p className="text-destructive font-semibold text-lg mb-2">
                      Out of Stock
                    </p>
                    <p className="text-foreground/70 text-sm">
                      This product is currently unavailable. Check back soon!
                    </p>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="space-y-3 rounded-lg bg-secondary/5 p-4">
                <p className="text-sm font-medium text-foreground">Why buy from Bagsberry?</p>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>🛡️ 30-day money-back guarantee</li>
                  <li>🚚 Free shipping on orders over $100</li>
                  <li>💬 Expert customer support 24/7</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="border-t py-16 sm:py-24 bg-secondary/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              You might also like
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card
                  key={i}
                  data-sound-hover="tick"
                  className="overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
                >
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <div className="text-6xl">👜</div>
                  </div>
                  <div className="space-y-2 p-4">
                    <p className="text-sm text-foreground/60">Premium Collection</p>
                    <p className="text-lg font-bold text-primary">$299.00</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
