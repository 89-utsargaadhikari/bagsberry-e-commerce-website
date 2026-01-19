'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/lib/cart-context';
import { Trash2, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background" />
      </>
    );
  }

  const shipping = items.length > 0 ? (total > 100 ? 0 : 9.99) : 0;
  const tax = total * 0.1;
  const finalTotal = total + shipping + tax;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="border-b py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Shopping Cart
            </h1>
          </div>
        </section>

        {/* Cart Content */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="text-6xl">🛒</div>
              <h2 className="text-2xl font-semibold text-foreground">
                Your cart is empty
              </h2>
              <p className="text-foreground/70 max-w-sm">
                Add some luxurious bags to your collection and get started with
                Bagsberry
              </p>
              <Button asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <div className="space-y-1 divide-y">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex gap-4 p-6 items-start"
                      >
                        {/* Product Image */}
                        <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-3xl">
                          👜
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {item.name}
                          </h3>
                          <p className="text-sm text-foreground/70 mt-1">
                            ${item.price.toFixed(2)} each
                          </p>

                          {/* Quantity Control */}
                          <div className="mt-4 flex items-center gap-2 w-fit border rounded-lg bg-background">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  Math.max(0, item.quantity - 1)
                                )
                              }
                              data-sound="tap"
                              className="px-3 py-2 text-foreground hover:bg-secondary/10"
                            >
                              −
                            </button>
                            <span className="w-6 text-center font-medium text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              data-sound="tap"
                              className="px-3 py-2 text-foreground hover:bg-secondary/10"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Price & Remove */}
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="mt-2 text-destructive hover:underline flex items-center gap-1 text-sm"
                            data-sound="pop"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Continue Shopping */}
                <div className="mt-6">
                  <Button variant="outline" asChild className="gap-2 bg-transparent">
                    <Link href="/products">
                      <ArrowLeft className="h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="p-6 space-y-6 sticky top-20">
                  <h2 className="text-lg font-semibold text-foreground">
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Subtotal</span>
                      <span className="font-medium">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">
                        Shipping
                        {total > 100 && (
                          <span className="ml-1 text-primary text-xs">
                            (FREE)
                          </span>
                        )}
                      </span>
                      <span className="font-medium">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-xl font-bold text-primary">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>

                  {/* Benefits */}
                  <div className="rounded-lg bg-secondary/5 p-4 space-y-2 text-xs text-foreground/70">
                    <div className="flex gap-2">
                      <span>🚚</span>
                      <span>Free shipping on orders over $100</span>
                    </div>
                    <div className="flex gap-2">
                      <span>🛡️</span>
                      <span>30-day money-back guarantee</span>
                    </div>
                    <div className="flex gap-2">
                      <span>💬</span>
                      <span>24/7 customer support</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
