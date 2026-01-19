'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (orderPlaced) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-12 text-center product-card">
            <div className="mb-8 pulse-idle">
              <CheckCircle className="h-24 w-24 text-primary mx-auto mb-4" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              🎉 Order Confirmed!
            </h1>
            <p className="text-lg text-foreground/70 mb-8">
              Your order #12345 has been placed successfully!
              <br />
              We'll send you a confirmation email shortly.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Button asChild variant="outline" className="btn-squishy" data-sound="tap">
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button asChild className="btn-squishy" data-sound="whoop">
                <Link href="/orders">View Orders</Link>
              </Button>
            </div>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="border-b py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
              🛒 Checkout
            </h1>
            <div className="flex gap-4 mt-6">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                    s <= step ? 'bg-primary scale-105' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {step === 1 && (
                <Card className="p-8 product-card">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    📦 Shipping Information
                  </h2>
                  <form className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          First Name
                        </label>
                        <Input placeholder="Jane" className="btn-squishy" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Last Name
                        </label>
                        <Input placeholder="Doe" className="btn-squishy" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email
                      </label>
                      <Input type="email" placeholder="jane@example.com" className="btn-squishy" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input placeholder="+1 (555) 000-0000" className="btn-squishy" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Address
                      </label>
                      <Textarea placeholder="123 Fashion Ave, Suite 100" className="btn-squishy" />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-3">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          City
                        </label>
                        <Input placeholder="New York" className="btn-squishy" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          State
                        </label>
                        <Input placeholder="NY" className="btn-squishy" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          ZIP
                        </label>
                        <Input placeholder="10001" className="btn-squishy" />
                      </div>
                    </div>
                    <Button
                      onClick={() => setStep(2)}
                      type="button"
                      className="w-full btn-squishy"
                      size="lg"
                      data-sound="pop"
                    >
                      Continue to Payment →
                    </Button>
                  </form>
                </Card>
              )}

              {step === 2 && (
                <Card className="p-8 product-card">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    💳 Payment Information
                  </h2>
                  <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6 mb-6 text-center">
                    <Lock className="h-12 w-12 text-primary mx-auto mb-4 wiggle-idle" />
                    <p className="text-foreground/70 font-medium">
                      🔒 <strong>Safe Payment Placeholder</strong>
                      <br />
                      <span className="text-sm">
                        In production, this would integrate with Stripe/PayPal
                      </span>
                    </p>
                  </div>
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Card Number
                      </label>
                      <Input placeholder="1234 5678 9012 3456" className="btn-squishy" disabled />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Expiry Date
                        </label>
                        <Input placeholder="MM/YY" className="btn-squishy" disabled />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          CVV
                        </label>
                        <Input placeholder="123" className="btn-squishy" disabled />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        onClick={() => setStep(1)}
                        type="button"
                        variant="outline"
                        className="flex-1 btn-squishy"
                        data-sound="tap"
                      >
                        ← Back
                      </Button>
                      <Button
                        onClick={() => setStep(3)}
                        type="button"
                        className="flex-1 btn-squishy"
                        data-sound="pop"
                      >
                        Review Order →
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              {step === 3 && (
                <Card className="p-8 product-card">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    ✅ Review Your Order
                  </h2>
                  <div className="space-y-6 mb-6">
                    <div className="p-4 bg-secondary/5 rounded-xl">
                      <h3 className="font-semibold text-foreground mb-2">Shipping To:</h3>
                      <p className="text-foreground/70">
                        Jane Doe<br />
                        123 Fashion Ave, Suite 100<br />
                        New York, NY 10001
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/5 rounded-xl">
                      <h3 className="font-semibold text-foreground mb-2">Payment Method:</h3>
                      <div className="flex items-center gap-2 text-foreground/70">
                        <CreditCard className="h-5 w-5" />
                        <span>•••• •••• •••• 3456</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setStep(2)}
                      type="button"
                      variant="outline"
                      className="flex-1 btn-squishy"
                      data-sound="tap"
                    >
                      ← Back
                    </Button>
                    <Button
                      onClick={() => setOrderPlaced(true)}
                      type="button"
                      className="flex-1 btn-squishy bg-primary hover:bg-primary/90"
                      data-sound="whoop"
                    >
                      🎉 Place Order
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            <div>
              <Card className="p-6 space-y-6 sticky top-20">
                <h2 className="text-lg font-semibold text-foreground">
                  Order Summary
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Subtotal (2 items)</span>
                    <span className="font-medium">$489.98</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Shipping</span>
                    <span className="font-medium text-primary">FREE ✨</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Tax</span>
                    <span className="font-medium">$48.99</span>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-primary">$538.97</span>
                  </div>
                </div>
                <div className="rounded-lg bg-primary/5 p-4 space-y-2 text-xs text-foreground/70">
                  <div className="flex gap-2">
                    <span>🚚</span>
                    <span>Free shipping on all orders!</span>
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
        </div>
      </main>
    </>
  );
}
