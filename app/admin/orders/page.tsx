'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Edit, Eye } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  tracking_number?: string;
  estimated_delivery?: string;
  created_at: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }
        setOrders(data || []);
      } catch (err) {
        console.log('[v0] Error fetching orders:', err);
        toast({
          title: 'Error',
          description: 'Failed to load orders',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        throw new Error(error.message);
      }

      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);

      toast({
        title: 'Success',
        description: 'Order status updated',
      });

      // Send email notification for status change
      const order = updatedOrders.find(o => o.id === orderId);
      if (order && ['confirmed', 'processing', 'shipped', 'delivered'].includes(newStatus)) {
        // Fetch order items and shipping info
        const { data: orderData } = await supabase
          .from('orders')
          .select('*, order_items(*, products(name))')
          .eq('id', orderId)
          .single();

        if (orderData) {
          const shippingInfo = JSON.parse(orderData.shipping_address || '{}');
          
          fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: `order-${newStatus}`,
              to: order.customer_email,
              data: {
                customerName: order.customer_name,
                orderNumber: order.id.substring(0, 8).toUpperCase(),
                items: orderData.order_items.map((item: any) => ({
                  name: item.products.name,
                  quantity: item.quantity,
                  price: item.price,
                })),
                total: order.total_amount,
                shippingAddress: {
                  address: shippingInfo.address || '',
                  city: shippingInfo.city || '',
                  state: shippingInfo.state || '',
                  zip: shippingInfo.zip || '',
                },
                trackingNumber: order.tracking_number,
                estimatedDelivery: order.estimated_delivery,
              },
            }),
          }).catch(err => console.error('❌ Failed to send status email:', err));
        }
      }
    } catch (err) {
      console.log('[v0] Error updating order:', err);
      toast({
        title: 'Error',
        description: 'Failed to update order',
        variant: 'destructive',
      });
    }
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setTrackingNumber(order.tracking_number || '');
    setEstimatedDelivery(order.estimated_delivery || '');
    setDialogOpen(true);
  };

  const handleSaveTracking = async () => {
    if (!editingOrder) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('orders')
        .update({
          tracking_number: trackingNumber || null,
          estimated_delivery: estimatedDelivery || null,
        })
        .eq('id', editingOrder.id);

      if (error) {
        throw new Error(error.message);
      }

      setOrders(
        orders.map((order) =>
          order.id === editingOrder.id
            ? {
                ...order,
                tracking_number: trackingNumber || undefined,
                estimated_delivery: estimatedDelivery || undefined,
              }
            : order
        )
      );

      toast({
        title: 'Success',
        description: 'Tracking information updated',
      });

      setDialogOpen(false);
      setEditingOrder(null);
    } catch (err) {
      console.log('[v0] Error updating tracking:', err);
      toast({
        title: 'Error',
        description: 'Failed to update tracking information',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'confirmed':
        return 'bg-teal-100 text-teal-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Orders</h1>
            <p className="mt-2 text-foreground/70">
              Track and manage customer orders
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="h-20 animate-pulse bg-muted" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No orders yet
              </h3>
              <p className="text-foreground/70">
                Orders will appear here once customers start purchasing
              </p>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-secondary/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Tracking
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-secondary/5">
                        <td className="px-6 py-4 font-mono text-sm text-foreground">
                          #{order.id.substring(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-foreground">{order.customer_name}</p>
                            <p className="text-sm text-foreground/70">{order.customer_email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-foreground">
                          NPR {order.total_amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <Select
                            value={order.status}
                            onValueChange={(value) =>
                              handleStatusChange(order.id, value)
                            }
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {order.tracking_number ? (
                            <span className="font-mono text-foreground">{order.tracking_number}</span>
                          ) : (
                            <span className="text-foreground/50">Not set</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground/70">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditOrder(order)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link href={`/admin/orders/${order.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Edit Tracking Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Tracking Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tracking Number
                </label>
                <Input
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
                <p className="text-xs text-foreground/70 mt-1">
                  Nepal Post, Pathao, or other courier tracking number
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Estimated Delivery Date
                </label>
                <Input
                  type="date"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveTracking}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
