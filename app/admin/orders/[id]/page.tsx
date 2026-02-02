'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminHeader } from '@/components/admin-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  shipping_address: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  tracking_number?: string;
  estimated_delivery?: string;
  status_updated_at?: string;
  delivery_latitude?: number;
  delivery_longitude?: number;
  delivery_map_url?: string;
  order_items: OrderItem[];
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              id,
              product_id,
              quantity,
              price,
              products (
                name,
                image_url
              )
            )
          `)
          .eq('id', orderId)
          .single();

        if (error) {
          console.error('Error fetching order:', error);
        } else {
          setOrder(data);
        }
      } catch (err) {
        console.error('Exception fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getCurrentStepIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    const index = statusSteps.findIndex(step => step.key === status);
    return index >= 0 ? index : 0;
  };

  const parseAddress = (addressJson: string) => {
    try {
      const addr = JSON.parse(addressJson);
      return `${addr.address}, ${addr.city}, ${addr.state} ${addr.zip}`;
    } catch {
      return addressJson;
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 w-64 bg-muted rounded" />
              <div className="h-64 bg-muted rounded" />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <AdminHeader />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Card className="p-12 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Order Not Found
              </h1>
              <p className="text-foreground/70 mb-6">
                The order you're looking for doesn't exist.
              </p>
              <Button asChild>
                <Link href="/admin/orders">Back to Orders</Link>
              </Button>
            </Card>
          </div>
        </main>
      </>
    );
  }

  const currentStepIndex = getCurrentStepIndex(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-background">
        <section className="border-b py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Link>
            <h1 className="text-4xl font-bold text-foreground">
              Order #{order.id.substring(0, 8).toUpperCase()}
            </h1>
            <p className="text-foreground/70 mt-2">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {/* Order Status Timeline */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {isCancelled ? '❌ Order Cancelled' : '📦 Order Status'}
                </h2>
                
                {isCancelled ? (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-700 font-medium">
                      This order has been cancelled
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {statusSteps.map((step, index) => {
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;
                      const Icon = step.icon;

                      return (
                        <div key={step.key} className="flex items-start gap-4 relative">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                            isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-semibold ${isCompleted ? 'text-foreground' : 'text-foreground/50'}`}>
                              {step.label}
                            </h3>
                            {isCurrent && (
                              <p className="text-sm text-primary font-medium mt-1">
                                Current Status
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {order.tracking_number && (
                  <div className="mt-6 p-4 bg-primary/5 rounded-xl">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Tracking Number
                    </p>
                    <p className="text-lg font-mono text-primary">
                      {order.tracking_number}
                    </p>
                  </div>
                )}

                {order.estimated_delivery && (
                  <div className="mt-4 p-4 bg-secondary/10 rounded-xl">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Estimated Delivery
                    </p>
                    <p className="text-lg text-foreground">
                      {new Date(order.estimated_delivery).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </Card>

              {/* Order Items */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Order Items
                </h2>
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-secondary/5 rounded-xl">
                      <img
                        src={item.products.image_url}
                        alt={item.products.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=200&q=80';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {item.products.name}
                        </h3>
                        <p className="text-sm text-foreground/70">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-primary mt-1">
                          NPR {item.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">
                          NPR {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Subtotal</span>
                    <span className="font-medium">NPR {order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-primary">
                      NPR {order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Delivery Address
                </h2>
                <p className="text-sm text-foreground/70 whitespace-pre-line">
                  {order.customer_name}
                  {'\n'}
                  {parseAddress(order.shipping_address)}
                  {'\n'}
                  {order.customer_phone}
                </p>
                {order.delivery_map_url && (
                  <div className="mt-4">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                    >
                      <a
                        href={order.delivery_map_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        Open in Maps
                      </a>
                    </Button>
                    <p className="text-xs text-foreground/50 text-center mt-2">
                      Pinned location: {order.delivery_latitude?.toFixed(6)}, {order.delivery_longitude?.toFixed(6)}
                    </p>
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Contact Information
                </h2>
                <div className="space-y-2 text-sm">
                  <p className="text-foreground/70">
                    <span className="font-medium">Email:</span><br />
                    {order.customer_email}
                  </p>
                  <p className="text-foreground/70">
                    <span className="font-medium">Phone:</span><br />
                    {order.customer_phone}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
