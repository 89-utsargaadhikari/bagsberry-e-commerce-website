'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

export default function SubscribePage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      
      // Create subscribers table if it doesn't exist (will be handled in DB setup)
      const { error: insertError } = await supabase
        .from('subscribers')
        .insert([
          {
            email: formData.email,
            name: formData.name,
            subscribed_at: new Date().toISOString(),
          },
        ]);

      if (insertError) throw insertError;
      
      setSubscribed(true);
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 sm:p-12">
          {subscribed ? (
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome to Bagsberry!
              </h1>
              <p className="text-lg text-foreground/70">
                Thank you for subscribing, {formData.name}! You'll be the first to know about:
              </p>
              <div className="grid gap-4 sm:grid-cols-3 mt-8">
                <div>
                  <div className="text-3xl mb-2">🎁</div>
                  <p className="font-semibold">Exclusive Offers</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">✨</div>
                  <p className="font-semibold">New Arrivals</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">💝</div>
                  <p className="font-semibold">Special Events</p>
                </div>
              </div>
              <Button asChild className="mt-8">
                <a href="/products">Start Shopping</a>
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  Join the Bagsberry Community
                </h1>
                <p className="text-lg text-foreground/70">
                  Subscribe to our newsletter for exclusive offers, early access to new collections, and style tips from our experts.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Jane Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="jane@example.com"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Subscribing...' : '🎉 Subscribe Now'}
                </Button>

                <p className="text-xs text-center text-foreground/60">
                  By subscribing, you agree to receive marketing emails from Bagsberry. You can unsubscribe at any time.
                </p>
              </form>

              <div className="mt-12 grid gap-6 sm:grid-cols-3 text-center">
                <div>
                  <div className="text-4xl mb-3">💎</div>
                  <h3 className="font-semibold text-foreground mb-1">Premium Quality</h3>
                  <p className="text-sm text-foreground/70">Handcrafted luxury bags</p>
                </div>
                <div>
                  <div className="text-4xl mb-3">🚚</div>
                  <h3 className="font-semibold text-foreground mb-1">Free Shipping</h3>
                  <p className="text-sm text-foreground/70">On orders over $100</p>
                </div>
                <div>
                  <div className="text-4xl mb-3">💝</div>
                  <h3 className="font-semibold text-foreground mb-1">Exclusive Access</h3>
                  <p className="text-sm text-foreground/70">Member-only benefits</p>
                </div>
              </div>
            </>
          )}
        </Card>
      </main>
    </>
  );
}
