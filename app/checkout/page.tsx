'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import dynamic from 'next/dynamic';

// Dynamic import for map to avoid SSR issues
const LocationPicker = dynamic(
  () => import('@/components/location-picker').then(mod => ({ default: mod.LocationPicker })),
  { ssr: false }
);

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
  });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Redirect if cart is empty
    if (!orderPlaced && items.length === 0) {
      router.push('/cart');
    }
  }, [items, orderPlaced, router]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const shipping = total > 3000 ? 0 : 150; // NPR pricing: Free shipping over NPR 3000, else NPR 150
      const tax = 0; // No tax for now (Nepal VAT can be added later if needed)
      const finalTotal = total + shipping + tax;

      // Generate Google Maps URL if location is set
      const mapUrl = location 
        ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
        : null;

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingInfo: {
            name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            email: shippingInfo.email,
            phone: shippingInfo.phone,
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.province, // Using province field but mapping to state for backend compatibility
            zip: shippingInfo.postalCode,
          },
          location: location ? {
            latitude: location.lat,
            longitude: location.lng,
            mapUrl: mapUrl,
          } : null,
          total: finalTotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      setOrderNumber(data.orderNumber);
      setOrderPlaced(true);
      clearCart();
    } catch (error: any) {
      console.error('Order error:', error);
      alert(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
              Your order #{orderNumber} has been placed successfully!
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
            <p className="text-foreground/70 mt-2">
              Complete your order details below
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="p-8 product-card">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  📦 Delivery Information
                </h2>
                <form className="space-y-6" onSubmit={handlePlaceOrder}>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        First Name
                      </label>
                      <Input 
                        placeholder="Rajesh" 
                        className="btn-squishy"
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Last Name
                      </label>
                      <Input 
                        placeholder="Sharma" 
                        className="btn-squishy"
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input 
                      type="email" 
                      placeholder="rajesh@example.com" 
                      className="btn-squishy"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <Input 
                      placeholder="+977-98XXXXXXXX" 
                      className="btn-squishy"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Delivery Address
                    </label>
                    <Textarea 
                      placeholder="Thamel, Kathmandu" 
                      className="btn-squishy"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        City
                      </label>
                      <Input 
                        placeholder="Kathmandu" 
                        className="btn-squishy"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Province/District
                      </label>
                      <Input 
                        placeholder="Bagmati Province" 
                        className="btn-squishy"
                        value={shippingInfo.province}
                        onChange={(e) => setShippingInfo({...shippingInfo, province: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Postal Code
                      </label>
                      <Input 
                        placeholder="44600" 
                        className="btn-squishy"
                        value={shippingInfo.postalCode}
                        onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                        pattern="[0-9]{5}"
                        title="Please enter a 5-digit postal code"
                        required
                      />
                    </div>
                  </div>

                  {/* Location Picker */}
                  <div className="pt-4 border-t">
                    <LocationPicker
                      onLocationSelect={(lat, lng) => {
                        setLocation({ lat, lng });
                      }}
                      initialLat={27.7172}
                      initialLng={85.3240}
                    />
                  </div>

                  <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6 text-center">
                    <p className="text-foreground/70 font-medium">
                      📦 <strong>Cash on Delivery</strong>
                      <br />
                      <span className="text-sm">
                        Pay when you receive your order
                      </span>
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-squishy bg-primary hover:bg-primary/90"
                    size="lg"
                    data-sound="whoop"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : '🎉 Place Order'}
                  </Button>
                </form>
              </Card>
            </div>

            <div>
              <Card className="p-6 space-y-6 sticky top-20">
                <h2 className="text-lg font-semibold text-foreground">
                  Order Summary
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Subtotal ({items.length} items)</span>
                    <span className="font-medium">NPR {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Delivery Charge</span>
                    <span className="font-medium text-primary">
                      {total > 3000 ? 'FREE ✨' : `NPR ${(150).toFixed(2)}`}
                    </span>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-primary">
                      NPR {(total + (total > 3000 ? 0 : 150)).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="rounded-lg bg-primary/5 p-4 space-y-2 text-xs text-foreground/70">
                  <div className="flex gap-2">
                    <span>🚚</span>
                    <span>Free delivery on orders over NPR 3000</span>
                  </div>
                  <div className="flex gap-2">
                    <span>💰</span>
                    <span>Cash on Delivery available</span>
                  </div>
                  <div className="flex gap-2">
                    <span>📞</span>
                    <span>Customer support available</span>
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
