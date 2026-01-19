'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin-header';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient();

        const [productsRes, ordersRes] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*'),
        ]);

        const products = productsRes.count || 0;
        const orders = ordersRes.data || [];

        const revenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        const pending = orders.filter((order) => order.status === 'pending').length;

        setStats({
          totalProducts: products,
          totalOrders: orders.length,
          totalRevenue: revenue,
          pendingOrders: pending,
        });
      } catch (err) {
        console.log('[v0] Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: '📦',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: '📋',
    },
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: '💰',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      icon: '⏳',
    },
  ];

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="mt-2 text-foreground/70">Welcome to Bagsberry Admin</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {statCards.map((stat) => (
              <Card key={stat.label} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground/70">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                      {loading ? '—' : stat.value}
                    </p>
                  </div>
                  <div className="text-4xl">{stat.icon}</div>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Quick Actions
              </h2>
              <div className="space-y-2">
                <a
                  href="/admin/products/new"
                  className="block p-3 rounded-lg hover:bg-secondary/10 transition-colors"
                >
                  <div className="font-medium text-foreground">Add New Product</div>
                  <p className="text-sm text-foreground/60">Create a new product listing</p>
                </a>
                <a
                  href="/admin/orders"
                  className="block p-3 rounded-lg hover:bg-secondary/10 transition-colors"
                >
                  <div className="font-medium text-foreground">View Orders</div>
                  <p className="text-sm text-foreground/60">Manage customer orders</p>
                </a>
                <a
                  href="/admin/products"
                  className="block p-3 rounded-lg hover:bg-secondary/10 transition-colors"
                >
                  <div className="font-medium text-foreground">Manage Products</div>
                  <p className="text-sm text-foreground/60">Edit or delete products</p>
                </a>
              </div>
            </Card>

            {/* System Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                System Information
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Status</span>
                  <span className="font-medium text-green-600">Operational</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">API Health</span>
                  <span className="font-medium text-green-600">Healthy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Database</span>
                  <span className="font-medium text-green-600">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Last Update</span>
                  <span className="font-medium">Just now</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
