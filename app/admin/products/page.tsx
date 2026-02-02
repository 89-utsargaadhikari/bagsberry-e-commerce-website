'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  sale_price?: number;
  category: string;
  description: string;
  image_url?: string;
  stock_quantity: number;
  is_featured: boolean;
  created_at: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }
        setProducts(data || []);
      } catch (err) {
        console.log('[v0] Error fetching products:', err);
        toast({
          title: 'Error',
          description: 'Failed to load products',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      setProducts(products.filter((p) => p.id !== id));
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    } catch (err) {
      console.log('[v0] Error deleting product:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Products</h1>
              <p className="mt-2 text-foreground/70">
                Manage your product catalog
              </p>
            </div>
            <Button asChild className="gap-2">
              <Link href="/admin/products/new">
                <Plus className="h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="h-20 animate-pulse bg-muted" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No products yet
              </h3>
              <p className="text-foreground/70 mb-4">
                Get started by adding your first product
              </p>
              <Button asChild>
                <Link href="/admin/products/new">Add Product</Link>
              </Button>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-secondary/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-secondary/5">
                        <td className="px-6 py-4">
                          <div className="h-16 w-16 rounded-lg overflow-hidden border-2 border-primary/10">
                            <img
                              src={product.image_url || 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=200&q=80'}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=200&q=80';
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-foreground">
                              {product.name}
                            </p>
                            <p className="text-sm text-foreground/60 line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block rounded-full bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-foreground">
                              NPR {product.price.toFixed(2)}
                            </p>
                            {product.sale_price && product.sale_price < product.price && (
                              <p className="text-xs text-primary font-medium">
                                Sale: NPR {product.sale_price.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${
                              product.stock_quantity === 0 ? 'text-destructive' :
                              product.stock_quantity < 5 ? 'text-orange-500' :
                              'text-green-600'
                            }`}>
                              {product.stock_quantity}
                            </span>
                            {product.stock_quantity === 0 && (
                              <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">
                                Out
                              </span>
                            )}
                            {product.stock_quantity > 0 && product.stock_quantity < 5 && (
                              <span className="text-xs bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded">
                                Low
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {product.is_featured && (
                              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                ⭐ Featured
                              </span>
                            )}
                            {product.sale_price && product.sale_price < product.price && (
                              <span className="inline-flex items-center gap-1 text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded">
                                🏷️ On Sale
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="gap-2"
                            >
                              <Link href={`/admin/products/${product.id}`}>
                                <Edit2 className="h-4 w-4" />
                                Edit
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
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
      </main>
    </>
  );
}
